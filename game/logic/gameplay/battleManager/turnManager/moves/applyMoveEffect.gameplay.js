import { modifyStatStage } from "../statStages/modifyStatStage.gameplay.js";
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

      const target = action.move.selfTarget ? action.pokemon : action.target;

      const stats = effect.stats ?? [effect.stat];

      const results = stats.map((stat) =>
        modifyStatStage(target, stat, effect.amount)
      );

      return effect.stats ? results : results[0];
      break;

    case "DRAIN":
      if (random(action.move.effect?.percentage))
        return modifyStatHP(damages, action.move, action.pokemon);
      break;

    case "VOLATILE":
      if (random(action.move.effect?.percentage))
        return modifyVolatile(action, action.move.effect?.volatile);
      break;
    default:
      break;
  }
};
