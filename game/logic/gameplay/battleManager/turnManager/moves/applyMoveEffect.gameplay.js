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
      if (random(action.move.effect?.percentage))
        return modifyStatStage(
          action.move.selfTarget ? action.pokemon : action.target,
          action.move.effect.stat,
          action.move.effect.amount
        );
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
