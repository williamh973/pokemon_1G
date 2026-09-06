import { handlerStatusEffectDialogs } from "../handlerDialogs/status/handlerStatusEffectDialogs.gameplay.js";
import { applyStatusEffect } from "./applyStatusEffect.gameplay.js";

export const processStatusEffect = (turnManager, sequence, action) => {
  const statusEffectResult = applyStatusEffect(action);

  if (statusEffectResult?.isAffected) {
    handlerStatusEffectDialogs(turnManager.battleManager, statusEffectResult);

    turnManager.waitForAction(() => {
      turnManager.checkActionAnimationFinished(sequence, action);
    }, turnManager.state);

    return true;
  }
  return false;
};
