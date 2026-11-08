import { DIALOGS_DATABASE } from "../../../../../../../shareds/dialogs/dialogs.database.js";
import { processMovesEffect } from "../../processMovesEffect.gameplay.js";

export const handleCriticalHitDialog = (
  turnManager,
  moveDamagesResult,
  action,
  sequence,
  criticalHitResult,
  efficiency
) => {
  if (!criticalHitResult.isCriticalHit || efficiency === 0) return false;

  turnManager.waitForAction(() => {
    processMovesEffect(
      turnManager,
      moveDamagesResult.damages,
      action,
      sequence
    );
  }, turnManager.state);

  turnManager.battleManager.openDialogBox(
    DIALOGS_DATABASE.BATTLE_DIALOGS.criticalHit()
  );

  return true;
};
