import { randomBetween } from "../../../../../shareds/utils/math/math.utils.js";
import { handlerStatStagesEffect } from "../statStages/handlerStatStagesEffect.gamplay.js";
import { modifyStatHP } from "../stats/modifyStatHP.gameplay.js";
import { modifyVolatile } from "./volatiles/modifyVolatile.gameplay.js";

const random = (percent) => {
  const random100 = Math.floor(Math.random() * 100) + 1;
  return random100 <= percent;
};

export const applyMoveEffect = (damages, action) => {
  switch (action.move.effect?.type) {
    case "STAT_STAGE":
      const effect = action.move.effect;

      if (!random(effect.percentage)) return null;

      return handlerStatStagesEffect(effect, action);

    case "DRAIN":
      if (random(action.move.effect?.percentage))
        return modifyStatHP(damages, action.move, action.pokemon);
      break;

    case "VOLATILE":
      if (random(action.move.effect?.percentage))
        return modifyVolatile(action, action.move.effect?.volatile);
      break;

    case "MULTI_HIT":
      const pokemon = action.pokemon;

      if (pokemon.volatils.multiHitTurns > 0) return;

      const minCount = action.move.effect?.minCount;
      const maxCount = action.move.effect?.maxCount;
      const currentTurn = 1;

      pokemon.volatils.multiHitTurns = randomBetween(minCount, maxCount);

      const deductedMultiHitTurn = pokemon.volatils.multiHitTurns - currentTurn;

      pokemon.volatils.multiHitTurns = deductedMultiHitTurn;

      console.log(
        "Définition du nombre de Multi Hits : ",
        pokemon.volatils.multiHitTurns
      );
    default:
      break;
  }
};
