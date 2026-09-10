import { modifyStatStage } from "../statStages/modifyStatStage.gameplay.js";

const random = (percent) => {
  const random100 = Math.floor(Math.random() * 100) + 1;
  return random100 <= percent;
};

export const applyMoveEffect = (action) => {
  if (action.move.effect?.type === "STAT_STAGE") {
    if (random(action.move.effect?.percentage)) {
      return modifyStatStage(
        action.target,
        action.move.effect.stat,
        action.move.effect.amount
      );
    }
  }
};
