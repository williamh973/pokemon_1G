import { handlerMoveEffectDialogs } from "../handlerDialogs/handlerMoveEffectDialogs.gameplay.js";
import { applyMoveEffect } from "./applyMoveEffect.gameplay.js";

export const processMovesEffect = (turnManager, action, sequence) => {
  const moveEffectResult = applyMoveEffect(action);

  if (moveEffectResult) {
    console.log("move effect result: ", moveEffectResult);

    handlerMoveEffectDialogs(turnManager.battleManager, moveEffectResult);

    turnManager.waitForAction(() => {
      turnManager.checkActionAnimationFinished(sequence, action);
    }, turnManager.state);

    return true;
  }

  return false;
};
