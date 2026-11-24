import { handlerStatStagesEffectDialogs } from "../handlerDialogs/handlerStatStagesEffectDialogs.gameplay.js";
import { handlerConfusionEffectDialogs } from "../handlerDialogs/moves/handlerConfusionEffectDialogs.gameplay.js";
import { handlerDrainEffectDialogs } from "../handlerDialogs/moves/handlerDrainEffectDialogs.gameplay.js";
import { handlerFocusEnergyEffectDialogs } from "../handlerDialogs/moves/handlerFocusEnergyEffectDialogs.gameplay.js";
import { applyMoveEffect } from "./applyMoveEffect.gameplay.js";

export const processMovesEffect = (turnManager, damages, action, sequence) => {
  if (turnManager.isMoveEffectProcessed) return false;
  const moveEffectResult = applyMoveEffect(damages, action);

  if (action.move.effect?.type === "STAT_STAGE" && moveEffectResult === null) {
    turnManager.isMoveEffectProcessed = true;
    return false;
  }

  if (moveEffectResult) {
    console.log("Le jeu passe dans moveEffectResult de processMovesEffect");
    turnManager.isMoveEffectProcessed = true;

    switch (action.move.effect?.type) {
      case "STAT_STAGE": {
        const results = Array.isArray(moveEffectResult)
          ? moveEffectResult
          : [moveEffectResult];

        let index = 0;

        const showNextDialog = () => {
          if (index >= results.length) {
            turnManager.checkActionAnimationFinished(sequence, action);
            return;
          }

          handlerStatStagesEffectDialogs(
            turnManager.battleManager,
            results[index]
          );

          index++;

          turnManager.waitForAction(showNextDialog, turnManager.state);
        };

        showNextDialog();
        return true;
      }

      case "DRAIN":
        handlerDrainEffectDialogs(
          turnManager.battleManager,
          action,
          moveEffectResult.recoveredHP
        );
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
      console.log("Le jeu passe dans le waitForAction de processMovesEffect");
      turnManager.checkActionAnimationFinished(sequence, action);
    }, turnManager.state);

    return true;
  }

  return false;
};
