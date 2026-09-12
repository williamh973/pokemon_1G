import { handlerStatStagesEffectDialogs } from "../handlerDialogs/handlerStatStagesEffectDialogs.gameplay.js";
import { handlerFocusEnergyEffectDialogs } from "../handlerDialogs/moves/handlerFocusEnergyEffectDialogs.gameplay.js";
import { applyMoveEffect } from "./applyMoveEffect.gameplay.js";
import { checkFocusEnergyApply } from "./focusEnergy/checkFocusEnergyApply.gameplay.js";

export const processMovesEffect = (turnManager, action, sequence) => {
  if (turnManager.isMoveEffectProcessed) return false;

  const statStagesMoveEffectResult = applyMoveEffect(action);

  if (statStagesMoveEffectResult) {
    turnManager.isMoveEffectProcessed = true;

    console.log("stat stages move effect result: ", statStagesMoveEffectResult);

    handlerStatStagesEffectDialogs(
      turnManager.battleManager,
      statStagesMoveEffectResult
    );

    turnManager.waitForAction(() => {
      turnManager.checkActionAnimationFinished(sequence, action);
    }, turnManager.state);

    return true;
  }

  if (action.move.id === "focusEnergy") {
    const focusEnergyMoveEffectResult = checkFocusEnergyApply(action);

    if (focusEnergyMoveEffectResult) {
      handlerFocusEnergyEffectDialogs(
        turnManager.battleManager,
        focusEnergyMoveEffectResult
      );

      turnManager.waitForAction(() => {
        turnManager.checkActionAnimationFinished(sequence, action);
      }, turnManager.state);

      return true;
    }
  }

  return false;
};
