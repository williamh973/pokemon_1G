import { DIALOGS_DATABASE } from "../../../../../../../shareds/dialogs/dialogs.database.js";
import { processMovesEffect } from "../../processMovesEffect.gameplay.js";

export const handleCriticalHitDialog = (
  turnManager,
  moveDamagesResult,
  action,
  sequence,
  criticalHitResult
) => {
  const { TYPE1, TYPE2 } = moveDamagesResult.efficiencies;
  const efficiency = TYPE1 * TYPE2;

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
