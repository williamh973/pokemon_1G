import { processConfusionEffect } from "./confusion/processConfusionEffect.gameplay.js";
import { executeChargedMoveFirstPhase } from "./chargedMoves/executeChargedMoveFirstPhase .gameplay.js";
import { processVolatileEffect } from "./processVolatileEffect.gameplay.js";

export const processActionVolatile = (turnManager, sequence, action) => {
  const processVolatileResult = processVolatileEffect(action);

  if (!processVolatileResult.isAffected) return false;

  console.log(
    `[VOLATILE] ${action.pokemon.name} | ` +
      `confusionTurns = ${action.pokemon.volatils.confusionTurns} | ` +
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
