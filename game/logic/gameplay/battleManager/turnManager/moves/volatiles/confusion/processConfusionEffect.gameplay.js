import { DIALOGS_DATABASE } from "../../../../../../../shareds/dialogs/dialogs.database.js";
import { TURN_STATES } from "../../../states/turnManager.states.js";
import { executeChargedMoveFirstPhase } from "../chargedMoves/executeChargedMoveFirstPhase.gameplay.js";
import { getPendingChargedMoveAction } from "../chargedMoves/getPendingChargedMoveAction.gameplay.js";
import { prepareChargedMove } from "../chargedMoves/prepareChargedMove.gameplay.js";

const checkChargedMoveBeforeExecuteMove = (turnManager, sequence, action) => {
  const pendingChargedMove = getPendingChargedMoveAction(turnManager);

  if (pendingChargedMove) {
    console.log(
      `[CHARGED MOVE EN ATTENTE] ${pendingChargedMove.pokemon} | ${pendingChargedMove.move} | ${pendingChargedMove.animationPhase}`
    );
    turnManager.executeMove(sequence, action);
    return;
  }

  const isChargedMoveInProgress =
    action.pokemon.chargedMove?.animationPhase === "SECOND" &&
    action.pokemon.chargedMove?.move?.id === action.move.id;

  if (isChargedMoveInProgress) {
    turnManager.executeMove(sequence, action);
    return;
  }

  if (
    action.pokemon.chargedMove?.move?.effect?.volatile === "CHARGED_MOVE" ||
    action.move.effect?.volatile === "CHARGED_MOVE"
  ) {
    console.log(
      `${action.pokemon.name} a l'intention d'utiliser ${action.move.id}`
    );
    const prepareChargedMoveResult = prepareChargedMove(
      action.pokemon,
      action.move
    );

    if (prepareChargedMoveResult.isAffected)
      return executeChargedMoveFirstPhase(
        turnManager,
        action,
        prepareChargedMoveResult,
        sequence
      );
  }

  turnManager.executeMove(sequence, action);
};

export const processConfusionEffect = (
  turnManager,
  sequence,
  action,
  processVolatileResult
) => {
  if (processVolatileResult.hasConfusedNoMore) {
    console.log(`N'EST PLUS CONFUS `);

    turnManager.battleManager.openDialogBox(
      DIALOGS_DATABASE.BATTLE_DIALOGS.confusedNoMore(
        action.pokemon.name,
        action.pokemon.trainerId
      )
    );

    turnManager.waitForAction(() => {
      checkChargedMoveBeforeExecuteMove(turnManager, sequence, action);
    }, turnManager.state);

    return true;
  }

  console.log(`IL EST CONFUS `);

  turnManager.battleManager.openDialogBox(
    DIALOGS_DATABASE.BATTLE_DIALOGS.confusing(
      action.pokemon.name,
      action.pokemon.trainerId
    )
  );

  if (processVolatileResult.resist) {
    console.log(`CONFUS MAIS RÉSIST`);

    turnManager.waitForAction(() => {
      checkChargedMoveBeforeExecuteMove(turnManager, sequence, action);
    }, turnManager.state);

    return true;
  }

  if (!processVolatileResult.resist) {
    console.log(`CONFUS, NE RÉSIST PAS`);

    turnManager.waitForAction(() => {
      turnManager.battleManager.openDialogBox(
        DIALOGS_DATABASE.BATTLE_DIALOGS.confusionDeals()
      );

      turnManager.waitForAction(() => {
        if (processVolatileResult.pokemon.stats.hp <= 0) {
          turnManager.koAction = {
            ...action,
            active: action.target,
            fainted: processVolatileResult.pokemon,
          };

          turnManager.state = TURN_STATES.DETERMINE_KO;

          console.log(
            `${turnManager.koAction.fainted.name} est KO à cause de la confusion`
          );

          return;
        }

        if (!processVolatileResult.canUseMove) {
          turnManager.onActionFinished(sequence);
          return;
        }

        checkChargedMoveBeforeExecuteMove(turnManager, sequence, action);
      }, turnManager.state);
    }, turnManager.state);
  }
};
