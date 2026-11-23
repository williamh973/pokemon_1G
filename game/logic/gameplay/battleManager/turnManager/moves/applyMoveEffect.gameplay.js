import { random } from "../../../../../shareds/utils/math/math.utils.js";
import { handlerStatStagesEffect } from "../statStages/handlerStatStagesEffect.gamplay.js";
import { modifyStatHP } from "../stats/modifyStatHP.gameplay.js";
import { modifyVolatile } from "./volatiles/modifyVolatile.gameplay.js";
import { createMultiHitTurns } from "./volatiles/multiHitMoves/createMultiHitTurns.gameplay.js";

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

      if (action.isMultiHitInitialized) return null;

      createMultiHitTurns(pokemon, action);

      action.isMultiHitInitialized = true;

      return null;

    default:
      break;
  }
};
