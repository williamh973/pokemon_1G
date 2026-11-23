import { processConfusionEffect } from "./confusion/processConfusionEffect.gameplay.js";
import { executeChargedMoveFirstPhase } from "./chargedMoves/executeChargedMoveFirstPhase.gameplay.js";
import { processVolatileEffect } from "./processVolatileEffect.gameplay.js";
import { DIALOGS_DATABASE } from "../../../../../../shareds/dialogs/dialogs.database.js";

export const processActionVolatile = (turnManager, sequence, action) => {
  const processVolatileResult = processVolatileEffect(action);

  if (!processVolatileResult.isAffected) return false;

  console.log(
    `[VOLATILE] ${action.pokemon.name} | ` +
      `confusionTurns = ${action.pokemon.volatils.confusionTurns} | ` +
      `isFrighten = ${action.pokemon.volatils.isFrighten} | ` +
      `chargedMove = ${action.pokemon.chargedMove.move?.id} , ` +
      `chargedMoveAnimationPhase = ${action.pokemon.chargedMove.animationPhase} | ` +
      `canUseMove=${processVolatileResult.canUseMove}`
  );

  switch (processVolatileResult.volatile) {
    case "CONFUSION":
      processConfusionEffect(
        turnManager,
        sequence,
        action,
        processVolatileResult
      );
      break;

    case "FRIGHTEN":
      turnManager.battleManager.openDialogBox(
        DIALOGS_DATABASE.BATTLE_DIALOGS.isFrighten(
          action.pokemon.name,
          action.pokemon.trainerId
        )
      );

      turnManager.waitForAction(() => {
        turnManager.onActionFinished(sequence);

        action.pokemon.volatils.isFrighten = false;
      }, turnManager.state);
      break;

    case "CHARGED_MOVE":
      return executeChargedMoveFirstPhase(
        turnManager,
        action,
        processVolatileResult,
        sequence
      );

    default:
      break;
  }

  return true;
};
