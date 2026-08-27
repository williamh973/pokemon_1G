import { calculateMoveDamages } from "../../../../logic/gameplay/battleManager/turnManager/damages/calculateDamages.gameplay.js";
import { determineOrder } from "../../../../logic/gameplay/battleManager/turnManager/determineOrder/determineOrder.gameplay.js";
import { TURN_STATES } from "../../../../logic/gameplay/battleManager/turnManager/states/turnManager.states.js";
import { DIALOGS_DATABASE } from "../../../../shareds/dialogs/dialogs.database.js";

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

  isActionAnimationFinished(sequence, action) {
    return (
      sequence.pokemonUseMoveSequence?.isFinished &&
      this.battleManager.isHpAnimationFinished(action.target)
    );
  }

  startTurn(sequence) {
    this.isFinished = false;

    this.determineOrder();

    this.state = TURN_STATES.FIRST_ACTION;

    this.executeAction(sequence, this.firstAction);
  }

  determineOrder() {
    determineOrder(this);
  }

  executeAction(sequence, action) {
    console.log(this.state);
    this.isDamageApplied = false;
    this.isPPDeducted = false;

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
    const isSuccessful = random100 <= action.move.precision;

    console.log(
      `${action.pokemon.name} utilise ${action.move.name}`,
      `| random: ${random100}`,
      `| précision: ${action.move.precision}`,
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

    if (!this.isPPDeducted) this.deductMovePP(action);

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
    } else {
      sequence.startPokemonUseMoveSequence(action);
    }
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
    if (sequence.pokemonUseMoveSequence?.isFinished && !this.isDamageApplied) {
      if (!this.isDamageApplied) {
        const damages = calculateMoveDamages(action);

        action.target.stats.hp = Math.max(0, action.target.stats.hp - damages);

        this.isDamageApplied = true;

        if (
          action.target === this.battleManager.currentPlayerPokemon &&
          damages > 0
        ) {
          this.battleManager.game.dialogBox.startShakeAnimation();
        }
      }
    }
  }

  checkActionTargetKO(action) {
    if (action.target.stats.hp <= 0) {
      this.koAction = action;
      this.state = TURN_STATES.DETERMINE_KO;
      console.log(`${this.koAction.target.name} est KO`);
      return;
    }
  }

  checkActionAnimationFinished(sequence, action) {
    if (this.isActionAnimationFinished(sequence, action)) {
      console.log("pokemonUseMoveSequence est fini");

      this.checkActionTargetKO(action);

      this.onActionFinished(sequence);
    }
  }

  update(sequence) {
    switch (this.state) {
      case TURN_STATES.FIRST_ACTION:
      case TURN_STATES.SECOND_ACTION:
        const action =
          this.state === TURN_STATES.FIRST_ACTION
            ? this.firstAction
            : this.secondAction;

        this.checkPokemonUseMoveSequenceFinished(sequence, action);

        this.checkActionAnimationFinished(sequence, action);
        break;

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
    }
  }
}
