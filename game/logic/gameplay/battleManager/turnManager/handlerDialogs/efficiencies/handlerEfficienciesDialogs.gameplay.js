import { DIALOGS_DATABASE } from "../../../../../../shareds/dialogs/dialogs.database.js";
import { processMovesEffect } from "../../moves/processMovesEffect.gameplay.js";

export const handlerEfficienciesDialogs = (
  turnManager,
  calculResult,
  action,
  sequence
) => {
  turnManager.waitForAction(() => {
    processMovesEffect(turnManager, calculResult.damages, action, sequence);
  }, turnManager.state);

  const { TYPE1, TYPE2 } = calculResult.efficiencies;

  const efficiency = TYPE1 * TYPE2;

  if (efficiency < 1)
    turnManager.battleManager.openDialogBox(
      DIALOGS_DATABASE.BATTLE_DIALOGS.notVeryEffective()
    );

  if (efficiency > 1)
    turnManager.battleManager.openDialogBox(
      DIALOGS_DATABASE.BATTLE_DIALOGS.superEffective()
    );

  if (efficiency === 0)
    turnManager.battleManager.openDialogBox(
      DIALOGS_DATABASE.BATTLE_DIALOGS.ineffective(
        action.target,
        action.target.trainerId
      )
    );

  return true;
};
