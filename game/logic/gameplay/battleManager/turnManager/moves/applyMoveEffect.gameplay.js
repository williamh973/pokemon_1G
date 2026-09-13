import { modifyStatStage } from "../statStages/modifyStatStage.gameplay.js";
import { modifyStatHP } from "../stats/modifyStatHP.gameplay.js";

const random = (percent) => {
  const random100 = Math.floor(Math.random() * 100) + 1;
  return random100 <= percent;
};

export const applyMoveEffect = (action) => {
  switch (action.move.effect?.type) {
    case "STAT_STAGE":
      if (random(action.move.effect?.percentage)) {
        return modifyStatStage(
          action.move.selfTarget ? action.pokemon : action.target,
          action.move.effect.stat,
          action.move.effect.amount
        );
      }
      break;

    case "DRAIN":
      if (random(action.move.effect?.percentage)) {
        return modifyStatHP(action.damage, action.move, action.pokemon);
      }
      break;
    default:
      break;
  }
};
