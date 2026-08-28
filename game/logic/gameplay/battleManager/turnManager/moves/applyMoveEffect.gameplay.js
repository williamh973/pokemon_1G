import { modifyStatStage } from "../statStages/modifyStatStage.gameplay.js";

export const applyMoveEffect = (action) => {
  if (action.move.effect?.type === "STAT_STAGE") {
    modifyStatStage(
      action.target,
      action.move.effect.stat,
      action.move.effect.amount
    );
  }
};
