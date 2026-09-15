import { processConfusionEffect } from "./confusion/processConfusionEffect.gameplay.js";
import { processVolatileEffect } from "./processVolatileEffect.gameplay.js";

export const processActionVolatile = (turnManager, sequence, action) => {
  const processVolatileResult = processVolatileEffect(action.pokemon);

  if (!processVolatileResult.isAffected) return false;

  console.log(
    `[VOLATILE] ${action.pokemon.name} | ` +
      `confusionTurns=${action.pokemon.volatils.confusionTurns} | ` +
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

    default:
      break;
  }

  return true;
};
