import { handlerStatStagesEffectDialogs } from "../handlerDialogs/handlerStatStagesEffectDialogs.gameplay.js";
import { handlerDrainEffectDialogs } from "../handlerDialogs/moves/handlerDrainEffectDialogs.gameplay.js";
import { handlerFocusEnergyEffectDialogs } from "../handlerDialogs/moves/handlerFocusEnergyEffectDialogs.gameplay.js";
import { applyMoveEffect } from "./applyMoveEffect.gameplay.js";
import { checkFocusEnergyApply } from "./focusEnergy/checkFocusEnergyApply.gameplay.js";

export const processMovesEffect = (turnManager, action, sequence) => {
  if (turnManager.isMoveEffectProcessed) return false;

  const moveEffectResult = applyMoveEffect(action);

  if (moveEffectResult) {
    turnManager.isMoveEffectProcessed = true;

    switch (action.move.effect?.type) {
      case "STAT_STAGE":
        handlerStatStagesEffectDialogs(
          turnManager.battleManager,
          moveEffectResult
        );
        break;

      case "DRAIN":
        handlerDrainEffectDialogs(turnManager.battleManager, action);
        break;

      default:
        break;
    }

    console.log("move effect result: ", moveEffectResult);

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
