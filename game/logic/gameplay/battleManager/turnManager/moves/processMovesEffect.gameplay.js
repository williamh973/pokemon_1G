import { handlerStatStagesEffectDialogs } from "../handlerDialogs/handlerStatStagesEffectDialogs.gameplay.js";
import { handlerConfusionEffectDialogs } from "../handlerDialogs/moves/handlerConfusionEffectDialogs.gameplay.js";
import { handlerDrainEffectDialogs } from "../handlerDialogs/moves/handlerDrainEffectDialogs.gameplay.js";
import { handlerFocusEnergyEffectDialogs } from "../handlerDialogs/moves/handlerFocusEnergyEffectDialogs.gameplay.js";
import { applyMoveEffect } from "./applyMoveEffect.gameplay.js";

export const processMovesEffect = (turnManager, damages, action, sequence) => {
  if (turnManager.isMoveEffectProcessed) return false;

  const moveEffectResult = applyMoveEffect(damages, action);

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

      case "VOLATILE":
        switch (moveEffectResult.volatile) {
          case "CONFUSION":
            handlerConfusionEffectDialogs(
              turnManager.battleManager,
              action.target,
              moveEffectResult.alreadyConfusing
            );
            break;

          case "SCARED":
            break;

          case "FOCUS_ENERGY":
            handlerFocusEnergyEffectDialogs(
              turnManager.battleManager,
              moveEffectResult
            );
            break;

          default:
            break;
        }

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

  return false;
};
