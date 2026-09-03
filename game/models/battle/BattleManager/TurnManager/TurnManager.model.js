import { calculateMoveDamages } from "../../../../logic/gameplay/battleManager/turnManager/damages/calculateDamages.gameplay.js";
import { determineOrder } from "../../../../logic/gameplay/battleManager/turnManager/determineOrder/determineOrder.gameplay.js";
import { checkDialogBoxShakeAnimation } from "../../../../logic/gameplay/battleManager/turnManager/dialogBox/dialogBoxShakeAnimation.gameplay.js";
import { handlerMoveEffectDialogs } from "../../../../logic/gameplay/battleManager/turnManager/handlerDialogs/handlerMoveEffectDialogs.gameplay.js";
import { handlerStatusEffectDialogs } from "../../../../logic/gameplay/battleManager/turnManager/handlerDialogs/status/handlerStatusEffectDialogs.gameplay.js";
import { applyStatusEffect } from "../../../../logic/gameplay/battleManager/turnManager/moves/applyStatusEffect.gameplay.js";
import { applyMoveEffect } from "../../../../logic/gameplay/battleManager/turnManager/moves/applyMoveEffect.gameplay.js";
import { getAccuracyStageMultiplier } from "../../../../logic/gameplay/battleManager/turnManager/statStages/getAccuracyStageMultiplier.gameplay.js";
import { TURN_STATES } from "../../../../logic/gameplay/battleManager/turnManager/states/turnManager.states.js";
import { INPUT_STATE } from "../../../../logic/input/inputs.state.js";
import { DIALOGS_DATABASE } from "../../../../shareds/dialogs/dialogs.database.js";
import { processPokemonStatus } from "../../../../logic/gameplay/pokemon/status/processPokemonStatus.gameplay.js";
import { handlerStatusProcessDialogs } from "../../../../logic/gameplay/battleManager/turnManager/handlerDialogs/status/handlerStatusProcessDialogs.gameplay.js";
import { startTurn } from "../../../../logic/gameplay/battleManager/turnManager/turn/startTurn.gameplay.js";
import { processActionStatus } from "../../../../logic/gameplay/battleManager/turnManager/status/processActionStatus.gameplay.js";

export class TurnManager {
  constructor(battleManager) {
    this.battleManager = battleManager;
    this.state = TURN_STATES.IDLE;

    this.playerMove = null;
    this.wildMove = null;

    this.firstAction = null;
    this.secondAction = null;
    this.koAction = null;

    this.callbackFnAfterWait = null;
    this.nextStateAfterWait = null;

    this.isDamageApplied = false;
    this.isPPDeducted = false;
    this.isFinished = false;

    this.waitTimer = 0;
    this.waitCooldown = 0;
  }

  wait(duration, callbackFn, nextState) {
    this.state = TURN_STATES.WAITING;
    this.waitTimer = duration;
    this.waitCooldown = duration;
    this.callbackFnAfterWait = callbackFn;
    this.nextStateAfterWait = nextState;
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

  startTurn(sequence) {
    startTurn(this, sequence);
  }

  determineOrder() {
    determineOrder(this);
  }

  executeAction(sequence, action) {
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

    if (processActionStatus(this, sequence, action)) {
      return;
    }

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
    const random100 = Math.floor(Math.random() * 100) + 1;

    const accuracyStage = action.pokemon.statStages.accuracy;

    const accuracy =
      action.move.precision * getAccuracyStageMultiplier(accuracyStage);

    const isSuccessful = random100 <= accuracy;

    console.log(
      `${action.pokemon.name} utilise ${action.move.name}`,
      `| random: ${random100}`,
      `| précision de base: ${action.move.precision}`,
      `| précision réelle: ${accuracy}`,
      `| résultat: ${isSuccessful ? "RÉUSSI" : "RATÉ"}`
    );

    return isSuccessful;
  }

  deductMovePP(action) {
    if (this.isPPDeducted) return;

    action.move.currentPP = Math.max(0, action.move.currentPP - 1);

    this.isPPDeducted = true;
  }

  pokemonAttemptMove(sequence, action) {
    const isMoveSuccessful = this.checkMovePrecision(action);

    if (!this.isPPDeducted) {
      this.deductMovePP(action);
    }

    if (!isMoveSuccessful) {
      console.log(`${action.pokemon.name} rate son attaque !`);

      this.battleManager.openDialogBox(
        DIALOGS_DATABASE.BATTLE_DIALOGS.pokemonMissMove(action.pokemon.name)
      );

      this.wait(
        40,
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

    switch (this.state) {
      case TURN_STATES.FIRST_ACTION:
        console.log("FIRST_ACTION est fini, SECOND_ACTION peut se lancer");

        this.state = TURN_STATES.SECOND_ACTION;
        this.executeAction(sequence, this.secondAction);
        break;

      case TURN_STATES.SECOND_ACTION:
        console.log("SECOND_ACTION est fini, le tour est fini");

        this.state = TURN_STATES.END;
        break;
    }
  }

  checkPokemonUseMoveSequenceFinished(sequence, action) {
    if (!sequence.pokemonUseMoveSequence?.isFinished || this.isDamageApplied) {
      return false;
    }

    const damages = calculateMoveDamages(action);

    action.target.stats.hp = Math.max(0, action.target.stats.hp - damages);

    this.isDamageApplied = true;

    if (action.target === this.battleManager.currentPlayerPokemon) {
      checkDialogBoxShakeAnimation(this.battleManager, damages);
    }

    const moveEffectResult = applyMoveEffect(action);

    if (moveEffectResult) {
      console.log("move effect result: ", moveEffectResult);

      handlerMoveEffectDialogs(this.battleManager, moveEffectResult);

      this.waitForAction(() => {
        this.checkActionAnimationFinished(sequence, action);
      }, this.state);

      return true;
    }

    return false;
  }

  checkActionTargetKO(action) {
    if (action.target.stats.hp <= 0) {
      this.koAction = {
        ...action,
        active: action.pokemon,
        fainted: action.target,
      };

      this.state = TURN_STATES.DETERMINE_KO;

      console.log(`${this.koAction.fainted.name} est KO`);

      return true;
    }

    return false;
  }

  checkActionAnimationFinished(sequence, action) {
    if (!this.isActionAnimationFinished(sequence, action)) {
      return;
    }

    console.log("pokemonUseMoveSequence est fini");

    if (this.checkActionTargetKO(action)) {
      return;
    }

    const statusEffectResult = applyStatusEffect(action);

    if (statusEffectResult?.isAffected) {
      handlerStatusEffectDialogs(this.battleManager, statusEffectResult);

      this.waitForAction(() => {
        this.checkActionAnimationFinished(sequence, action);
      }, this.state);

      return;
    }

    this.onActionFinished(sequence);
  }

  update(sequence, actionInput) {
    switch (this.state) {
      case TURN_STATES.FIRST_ACTION:
      case TURN_STATES.SECOND_ACTION: {
        const action =
          this.state === TURN_STATES.FIRST_ACTION
            ? this.firstAction
            : this.secondAction;

        const isWaitingForAction = this.checkPokemonUseMoveSequenceFinished(
          sequence,
          action
        );

        if (isWaitingForAction) break;

        this.checkActionAnimationFinished(sequence, action);

        break;
      }

      case TURN_STATES.END:
        if (!this.isFinished) {
          this.isFinished = true;
        }
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
