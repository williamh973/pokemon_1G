import { DIALOGS_DATABASE } from "../../../../../../shareds/dialogs/dialogs.database.js";
import { processMovesEffect } from "../../moves/processMovesEffect.gameplay.js";

export const handleOHKOEffectDialog = (
  turnManager,
  moveDamagesResult,
  action,
  sequence,
  efficiency
) => {
  if (!moveDamagesResult.wasHitByOHKO || efficiency === 0) return;

  turnManager.waitForAction(() => {
    processMovesEffect(
      turnManager,
      moveDamagesResult.damages,
      action,
      sequence
    );
  }, turnManager.state);

  turnManager.battleManager.openDialogBox(
    DIALOGS_DATABASE.BATTLE_DIALOGS.OHKO(
      action.target.name,
      action.target.trainerId
    )
  );

  return true;
};
