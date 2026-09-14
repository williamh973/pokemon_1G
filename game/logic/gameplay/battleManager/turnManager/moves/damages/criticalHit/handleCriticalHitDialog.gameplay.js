import { DIALOGS_DATABASE } from "../../../../../../../shareds/dialogs/dialogs.database.js";
import { processMovesEffect } from "../../processMovesEffect.gameplay.js";

export const handleCriticalHitDialog = (
  turnManager,
  damages,
  action,
  sequence,
  criticalHitResult
) => {
  if (!criticalHitResult.isCriticalHit) return false;

  turnManager.waitForAction(() => {
    processMovesEffect(turnManager, damages, action, sequence);
  }, turnManager.state);

  turnManager.battleManager.openDialogBox(
    DIALOGS_DATABASE.BATTLE_DIALOGS.criticalHit()
  );

  return true;
};
