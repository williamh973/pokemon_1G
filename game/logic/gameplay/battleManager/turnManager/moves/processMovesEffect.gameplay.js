import { handlerMoveEffectDialogs } from "../handlerDialogs/handlerMoveEffectDialogs.gameplay.js";
import { applyMoveEffect } from "./applyMoveEffect.gameplay.js";

export const processMovesEffect = (turnManager, action, sequence) => {
  if (turnManager.isMoveEffectProcessed) return false;

  const moveEffectResult = applyMoveEffect(action);

  if (moveEffectResult) {
    turnManager.isMoveEffectProcessed = true;

    console.log("move effect result: ", moveEffectResult);

    handlerMoveEffectDialogs(turnManager.battleManager, moveEffectResult);

    turnManager.waitForAction(() => {
      turnManager.checkActionAnimationFinished(sequence, action);
    }, turnManager.state);

    return true;
  }

  return false;
};
