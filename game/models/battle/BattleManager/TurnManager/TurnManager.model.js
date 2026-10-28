import { determineOrder } from "../../../../logic/gameplay/battleManager/turnManager/determineOrder/determineOrder.gameplay.js";
import { TURN_STATES } from "../../../../logic/gameplay/battleManager/turnManager/states/turnManager.states.js";
import { INPUT_STATE } from "../../../../logic/input/inputs.state.js";
import { DIALOGS_DATABASE } from "../../../../shareds/dialogs/dialogs.database.js";
import { startTurn } from "../../../../logic/gameplay/battleManager/turnManager/turn/startTurn.gameplay.js";
import { processActionStatus } from "../../../../logic/gameplay/battleManager/turnManager/status/processActionStatus.gameplay.js";
import { processMovesEffect } from "../../../../logic/gameplay/battleManager/turnManager/moves/processMovesEffect.gameplay.js";
import { applyMoveDamage } from "../../../../logic/gameplay/battleManager/turnManager/moves/damages/applyMoveDamage.gameplay.js";
import { processStatusEffect } from "../../../../logic/gameplay/battleManager/turnManager/moves/processStatusEffect.gameplay.js";
import { checkMovePrecision } from "../../../../logic/gameplay/battleManager/turnManager/moves/precision/checkMovePrecision.gameplay.js";
import { handleCriticalHitDialog } from "../../../../logic/gameplay/battleManager/turnManager/moves/damages/criticalHit/handleCriticalHitDialog.gameplay.js";
import { handleTargetKO } from "../../../../logic/gameplay/battleManager/turnManager/handleKO/handleTargetKO.gameplay.js";
import { processActionVolatile } from "../../../../logic/gameplay/battleManager/turnManager/moves/volatiles/processActionVolatils.gameplay.js";
import { handlerEfficienciesDialogs } from "../../../../logic/gameplay/battleManager/turnManager/handlerDialogs/efficiencies/handlerEfficienciesDialogs.gameplay.js";
import { processMoveConsequence } from "../../../../logic/gameplay/battleManager/turnManager/moves/processMoveConsequence.gameplay.js";
import { processActionConsequence } from "../../../../logic/gameplay/battleManager/turnManager/moves/consequences/processActionConsequence.gameplay.js";
import { resetFlyState } from "../../../../logic/gameplay/battleManager/turnManager/moves/volatiles/fly/resetFlyState.gameplay.js";
import { wait } from "../../../../logic/gameplay/battleManager/turnManager/turn/wait.gameplay.js";

export class TurnManager {
  constructor(battleManager) {
    this.battleManager = battleManager;
    this.viewers = this.battleManager.viewers;
    this.pokemonViewer = null;

    this.state = TURN_STATES.IDLE;

    this.playerMove = null;
    this.wildMove = null;

    this.firstAction = null;
    this.secondAction = null;
    this.currentAction = null;
    this.koAction = null;

    this.callbackFnAfterWait = null;
    this.nextStateAfterWait = null;

    this.isDamageApplied = false;
    this.isPPDeducted = false;
    this.isMoveEffectProcessed = false;
    this.isStatusEffectProcessed = false;
    this.isFinished = false;

    this.isExecutingChargedMove = false;
    this.isChargedMoveContinuation = false;

    this.waitTimer = 0;
    this.waitCooldown = 0;
  }

  getSpriteViewer(pokemon) {
    if (this.viewers.front.slot.content === pokemon)
      this.pokemonViewer = this.viewers.front;
    else this.pokemonViewer = this.viewers.back;
  }

  wait(duration, callbackFn, nextState) {
    wait(this, duration, callbackFn, nextState);
  }

  waitForAction(callbackFn, nextState) {
    this.state = TURN_STATES.WAITING_FOR_ACTION;
    this.callbackFnAfterWait = callbackFn;
    this.nextStateAfterWait = nextState;
  }

  isActionAnimationFinished(sequence, action) {
    return (
      sequence.pokemonUseMoveSequence?.isFinished &&
      this.battleManager.isHpAnimationFinished(action.target)
    );
  }

  getActionContainsChargedMove() {
    return [this.firstAction, this.secondAction].find(
      (action) => action?.pokemon?.chargedMove?.move
    );
  }

  getActionContainsChargedMoveContinuation() {
    return [this.firstAction, this.secondAction].find(
      (action) =>
        action?.pokemon?.chargedMove?.move &&
        action.pokemon.chargedMove.animationPhase === "SECOND"
    );
  }

  getPendingChargedMoveAction(excludedPokemon = null) {
    return [this.firstAction, this.secondAction].find((action) => {
      const pokemon = action?.pokemon;
      const chargedMove = pokemon?.chargedMove;

      return (
        pokemon &&
        pokemon !== excludedPokemon &&
        pokemon.volatils.fly &&
        chargedMove?.move &&
        chargedMove.animationPhase === "FIRST"
      );
    });
  }

  startChargedMove(sequence) {
    const action = this.getActionContainsChargedMove();

    if (!action) return false;

    const chargedMove = action.pokemon.chargedMove;

    if (
      !action.pokemon.volatils.fly ||
      !chargedMove.move ||
      chargedMove.animationPhase !== "FIRST"
    ) {
      return false;
    }

    if (chargedMove.turnAction === TURN_STATES.SECOND_ACTION) {
      chargedMove.animationPhase = "SECOND";
      this.state = TURN_STATES.END;
      return true;
    }

    chargedMove.animationPhase = "SECOND";

    this.isExecutingChargedMove = true;
    this.state = TURN_STATES.FIRST_ACTION;

    this.executeAction(sequence, action);

    return true;
  }

  startTurn(sequence) {
    startTurn(this, sequence);
  }

  determineOrder() {
    determineOrder(this);
  }

  executeAction(sequence, action) {
    this.currentAction = action;

    const chargedMove = action.pokemon?.chargedMove;

    if (
      chargedMove?.move &&
      chargedMove.animationPhase === "FIRST" &&
      !chargedMove.turnAction
    ) {
      chargedMove.turnAction = this.state;
    }

    console.log(
      this.state,
      "| Move utilisé : ",
      action.move,
      "| Lanceur : ",
      action.pokemon,
      "| Cible : ",
      action.target
    );

    this.isDamageApplied = false;
    this.isPPDeducted = false;
    this.isMoveEffectProcessed = false;
    this.isStatusEffectProcessed = false;

    if (processActionStatus(this, sequence, action)) return;

    if (processActionVolatile(this, sequence, action)) return;

    if (processActionConsequence(this, sequence, action)) return;

    this.executeMove(sequence, action);
  }

  executeMove(sequence, action) {
    this.battleManager.openDialogBox(
      DIALOGS_DATABASE.BATTLE_DIALOGS.pokemonUseMove(
        action.pokemon.name,
        action.trainerId,
        action.move.name
      )
    );

    this.wait(
      40,
      () => {
        this.pokemonAttemptMove(sequence, action);
      },
      this.state
    );
  }

  checkMovePrecision(action) {
    return checkMovePrecision(action);
  }

  deductMovePP(action) {
    if (this.isPPDeducted) return;

    action.move.currentPP = Math.max(0, action.move.currentPP - 1);
    this.isPPDeducted = true;
  }

  pokemonAttemptMove(sequence, action) {
    if (!this.isPPDeducted) this.deductMovePP(action);

    const isMoveSuccessful = this.checkMovePrecision(action);

    if (!isMoveSuccessful) {
      console.log(`${action.pokemon.name} rate son attaque !`);

      this.battleManager.openDialogBox(
        DIALOGS_DATABASE.BATTLE_DIALOGS.pokemonMissMove(action.pokemon.name)
      );

      this.wait(
        60,
        () => {
          this.onActionFinished(sequence);
        },
        this.state
      );

      return;
    }

    sequence.startPokemonUseMoveSequence(action);
  }

  onActionFinished(sequence) {
    sequence.pokemonUseMoveSequence = null;
    console.log({
      "turn state : ": this.state + " | ",
      "isChargedMoveContinuation : ": this.isChargedMoveContinuation + " | ",
      "isExecutingChargedMove : ": this.isExecutingChargedMove + " | ",
    });

    const isChargedContinuation =
      this.isChargedMoveContinuation &&
      this.currentAction?.pokemon?.chargedMove?.animationPhase === "SECOND" &&
      this.currentAction?.move ===
        this.currentAction?.pokemon?.chargedMove?.move;

    switch (this.state) {
      case TURN_STATES.FIRST_ACTION:
        if (isChargedContinuation) {
          resetFlyState(this, this.currentAction.pokemon);
          this.isChargedMoveContinuation = false;

          this.state = TURN_STATES.SECOND_ACTION;
          console.log("turn state : ", this.state);
          this.executeAction(sequence, this.secondAction);
          return;
        }

        if (this.isExecutingChargedMove) {
          const finishedPokemon = this.currentAction.pokemon;

          resetFlyState(this, finishedPokemon);
          this.isExecutingChargedMove = false;

          const pendingAction =
            this.getPendingChargedMoveAction(finishedPokemon);

          if (pendingAction) {
            pendingAction.pokemon.chargedMove.animationPhase = "SECOND";

            this.state = TURN_STATES.FIRST_ACTION;
            this.isExecutingChargedMove = true;

            console.log(
              "Une autre attaque chargée est en attente :",
              pendingAction.pokemon.name
            );

            this.executeAction(sequence, pendingAction);
            return;
          }

          this.state = TURN_STATES.END;
          console.log("turn state : ", this.state);
          return;
        }

        this.state = TURN_STATES.SECOND_ACTION;
        console.log("FIRST_ACTION est fini, SECOND_ACTION peut se lancer");
        this.executeAction(sequence, this.secondAction);
        break;

      case TURN_STATES.SECOND_ACTION:
        if (isChargedContinuation) {
          const finishedPokemon = this.currentAction.pokemon;

          resetFlyState(this, finishedPokemon);
          this.isChargedMoveContinuation = false;

          const pendingAction =
            this.getPendingChargedMoveAction(finishedPokemon);

          if (pendingAction) {
            this.state = TURN_STATES.FIRST_ACTION;
            this.isExecutingChargedMove = true;
            this.executeAction(sequence, pendingAction);
            return;
          }

          this.state = TURN_STATES.END;
          console.log("turn state : ", this.state);
          return;
        }

        if (this.startChargedMove(sequence)) return;

        console.log("SECOND_ACTION est fini, le tour est fini");
        this.state = TURN_STATES.END;
        console.log("turn state : ", this.state);
        break;
    }
  }

  checkPokemonUseMoveSequenceFinished(sequence, action) {
    if (!sequence.pokemonUseMoveSequence?.isFinished || this.isDamageApplied)
      return false;

    if (action.move.power <= 0) {
      this.isDamageApplied = true;

      return processMovesEffect(this, 0, action, sequence);
    }

    const applyMoveDamageResult = applyMoveDamage(
      this,
      action,
      this.battleManager.weather
    );

    processMoveConsequence(action);

    if (
      handleCriticalHitDialog(
        this,
        applyMoveDamageResult.calculResult.damages,
        action,
        sequence,
        applyMoveDamageResult.criticalHitResult
      )
    )
      return true;

    if (
      handlerEfficienciesDialogs(
        this,
        applyMoveDamageResult.calculResult,
        action,
        sequence
      )
    )
      return true;

    return processMovesEffect(
      this,
      applyMoveDamageResult.calculResult.damages,
      action,
      sequence
    );
  }

  handleTargetKO(action) {
    handleTargetKO(this, action);

    return false;
  }

  checkActionAnimationFinished(sequence, action) {
    if (!this.isActionAnimationFinished(sequence, action)) return;

    console.log("pokemonUseMoveSequence est fini");

    if (this.handleTargetKO(action)) return;

    if (processStatusEffect(this, sequence, action)) return;

    this.onActionFinished(sequence);
  }

  update(sequence, actionInput) {
    switch (this.state) {
      case TURN_STATES.FIRST_ACTION:
      case TURN_STATES.SECOND_ACTION: {
        const action = this.currentAction;

        if (!action) break;

        const isWaitingForAction = this.checkPokemonUseMoveSequenceFinished(
          sequence,
          action
        );

        if (isWaitingForAction) break;

        this.checkActionAnimationFinished(sequence, action);

        break;
      }

      case TURN_STATES.END:
        if (!this.isFinished) this.isFinished = true;

        break;

      case TURN_STATES.WAITING:
        this.waitCooldown--;

        if (this.waitCooldown <= 0) {
          this.state = this.nextStateAfterWait;
          this.waitCooldown = this.waitTimer;

          const callback = this.callbackFnAfterWait;
          this.callbackFnAfterWait = null;

          callback?.();
        }

        break;

      case TURN_STATES.WAITING_FOR_ACTION:
        if (actionInput === INPUT_STATE.ACTION) {
          this.state = this.nextStateAfterWait;

          const callback = this.callbackFnAfterWait;
          this.callbackFnAfterWait = null;

          callback?.();
        }

        break;
    }
  }
}
