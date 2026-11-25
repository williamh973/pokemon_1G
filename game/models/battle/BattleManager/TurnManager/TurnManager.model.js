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
import { handleTargetKO } from "../../../../logic/gameplay/battleManager/turnManager/handleKO/handleTargetKO.gameplay.js";
import { processActionVolatile } from "../../../../logic/gameplay/battleManager/turnManager/moves/volatiles/processActionVolatils.gameplay.js";
import { processMoveConsequence } from "../../../../logic/gameplay/battleManager/turnManager/moves/processMoveConsequence.gameplay.js";
import { processActionConsequence } from "../../../../logic/gameplay/battleManager/turnManager/moves/consequences/processActionConsequence.gameplay.js";
import { resetChargedMoveState } from "../../../../logic/gameplay/battleManager/turnManager/moves/volatiles/chargedMoves/resetChargedMoveState.gameplay.js";
import { wait } from "../../../../logic/gameplay/battleManager/turnManager/turn/wait.gameplay.js";
import { processPendingChargedMove } from "../../../../logic/gameplay/battleManager/turnManager/moves/volatiles/chargedMoves/processPendingChargedMove.gameplay.js";
import { getPendingChargedMoveAction } from "../../../../logic/gameplay/battleManager/turnManager/moves/volatiles/chargedMoves/getPendingChargedMoveAction.gameplay.js";
import { isPendingMultiHitTurn } from "../../../../logic/gameplay/battleManager/turnManager/moves/volatiles/multiHitMoves/isPendingMultiHitTurn.gameplay.js";
import { executeNextMultiHit } from "../../../../logic/gameplay/battleManager/turnManager/moves/volatiles/multiHitMoves/executeNextMultiHit.gameplay.js";
import { waitForAction } from "../../../../logic/gameplay/battleManager/turnManager/turn/waitForAction.gameplay.js";
import { handleMoveDamageDialogs } from "../../../../logic/gameplay/battleManager/turnManager/handlerDialogs/handleMoveDamageDialogs.gameplay.js";
import { handlerDisableTurns } from "../../../../logic/gameplay/battleManager/turnManager/moves/volatiles/disabledMoves/handlerDisableTurns.gameplay.js";

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
    this.isEndOfTurnProcessed = false;
    this.isFinished = false;

    this.isExecutingChargedMove = false;
    this.isChargedMoveContinuation = false;

    this.waitTimer = 0;
    this.waitCooldown = 0;
  }

  wait(duration, callbackFn, nextState) {
    wait(this, duration, callbackFn, nextState);
  }

  waitForAction(callbackFn, nextState) {
    waitForAction(this, callbackFn, nextState);
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

  startTurn(sequence) {
    this.isEndOfTurnProcessed = false;
    startTurn(this, sequence);
  }

  determineOrder() {
    determineOrder(this);
  }

  resetActionState() {
    this.isDamageApplied = false;
    this.isPPDeducted = false;
    this.isMoveEffectProcessed = false;
    this.isStatusEffectProcessed = false;
  }

  resetMultiHitState() {
    this.isDamageApplied = false;
    this.isMoveEffectProcessed = false;
    this.isStatusEffectProcessed = false;
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
      action.target,
      "| Multi Hit Initialisé : ",
      action.isMultiHitInitialized
    );

    this.resetActionState();

    if (processActionStatus(this, sequence, action)) return;

    if (processActionVolatile(this, sequence, action)) return;

    if (processActionConsequence(this, sequence, action)) return;

    this.executeMove(sequence, action);
  }

  executeMove(sequence, action) {
    action.pokemon.lastMove = action.move;

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
        this.attemptMove(sequence, action);
      },
      this.state
    );
  }

  executeNextMultiHit(sequence, action) {
    executeNextMultiHit(this, sequence, action);
  }

  checkMovePrecision(action) {
    return checkMovePrecision(action);
  }

  deductMovePP(action) {
    if (this.isPPDeducted) return;

    action.move.currentPP = Math.max(0, action.move.currentPP - 1);
    this.isPPDeducted = true;
  }

  deductMultiHitTurns(action) {
    if (action.pokemon.volatils.multiHitTurns <= 0) return;

    action.pokemon.volatils.multiHitTurns--;
  }

  handlerDisableTurns() {
    handlerDisableTurns(this);
  }

  attemptMove(sequence, action) {
    if (!this.isPPDeducted) this.deductMovePP(action);

    const isMoveSuccessful = this.checkMovePrecision(action);

    if (!isMoveSuccessful) {
      console.log(`${action.pokemon.name} rate son attaque !`);

      this.battleManager.openDialogBox(
        DIALOGS_DATABASE.BATTLE_DIALOGS.pokemonMissMove(
          action.pokemon.name,
          action.pokemon.trainerId
        )
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

    sequence.startMoveSequence(action);
  }

  isCurrentActionChargedContinuation() {
    const chargedMove = this.currentAction?.pokemon?.chargedMove;

    return (
      this.isChargedMoveContinuation &&
      chargedMove?.animationPhase === "SECOND" &&
      this.currentAction?.move === chargedMove?.move
    );
  }

  isPendingMultiHitTurn() {
    return isPendingMultiHitTurn(this.currentAction);
  }

  onActionFinished(sequence) {
    sequence.pokemonUseMoveSequence = null;
    console.log({
      "turn state : ": this.state + " | ",
      "isChargedMoveContinuation : ": this.isChargedMoveContinuation + " | ",
      "isExecutingChargedMove : ": this.isExecutingChargedMove + " | ",
    });

    const isChargedContinuation = this.isCurrentActionChargedContinuation();

    switch (this.state) {
      case TURN_STATES.FIRST_ACTION:
        const finishedPokemon = this.currentAction.pokemon;

        if (isChargedContinuation) {
          resetChargedMoveState(this, finishedPokemon);
          this.isChargedMoveContinuation = false;

          this.state = TURN_STATES.SECOND_ACTION;
          this.executeAction(sequence, this.secondAction);
          return;
        }

        if (this.isExecutingChargedMove) {
          resetChargedMoveState(this, finishedPokemon);
          this.isExecutingChargedMove = false;

          const pendingAction = getPendingChargedMoveAction(
            this,
            finishedPokemon
          );

          if (pendingAction) {
            pendingAction.pokemon.chargedMove.animationPhase = "SECOND";

            this.state = TURN_STATES.FIRST_ACTION;
            this.isExecutingChargedMove = true;

            this.executeAction(sequence, pendingAction);
            return;
          }

          this.state = TURN_STATES.END;
          console.log("turn state : ", this.state);
          return;
        }

        if (this.isPendingMultiHitTurn()) {
          this.executeNextMultiHit(sequence, this.currentAction);
          return;
        }

        this.state = TURN_STATES.SECOND_ACTION;
        console.log("FIRST_ACTION est fini, SECOND_ACTION peut se lancer");
        this.executeAction(sequence, this.secondAction);
        break;

      case TURN_STATES.SECOND_ACTION:
        if (isChargedContinuation) {
          const finishedPokemon = this.currentAction.pokemon;

          resetChargedMoveState(this, finishedPokemon);
          this.isChargedMoveContinuation = false;

          const pendingAction = getPendingChargedMoveAction(
            this,
            finishedPokemon
          );

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

        if (processPendingChargedMove(this, sequence)) return;

        if (this.isPendingMultiHitTurn()) {
          this.executeNextMultiHit(sequence, this.currentAction);
          return;
        }

        console.log("SECOND_ACTION est fini, le tour est fini");
        this.state = TURN_STATES.END;
        console.log("turn state : ", this.state);
        break;
    }
  }

  checkMoveSequenceFinished(sequence, action) {
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

    processMoveConsequence(
      this,
      action,
      sequence,
      applyMoveDamageResult.moveDamagesResult
    );

    if (handleMoveDamageDialogs(this, applyMoveDamageResult, action, sequence))
      return true;

    console.log("log entre processMoveConsequence et processMovesEffect");

    return processMovesEffect(
      this,
      applyMoveDamageResult.moveDamagesResult.damages,
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

    console.log("move séquence est fini");

    if (this.handleTargetKO(action)) return;

    if (processStatusEffect(this, sequence, action)) return;

    this.onActionFinished(sequence);
  }

  update(sequence, actionInput) {
    switch (this.state) {
      case TURN_STATES.FIRST_ACTION:
      case TURN_STATES.SECOND_ACTION: {
        if (!this.currentAction) break;

        const isWaitingForAction = this.checkMoveSequenceFinished(
          sequence,
          this.currentAction
        );

        if (isWaitingForAction) break;

        this.checkActionAnimationFinished(sequence, this.currentAction);

        break;
      }

      case TURN_STATES.END:
        if (!this.isEndOfTurnProcessed) {
          this.isEndOfTurnProcessed = true;
          this.handlerDisableTurns();
          break;
        }

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
