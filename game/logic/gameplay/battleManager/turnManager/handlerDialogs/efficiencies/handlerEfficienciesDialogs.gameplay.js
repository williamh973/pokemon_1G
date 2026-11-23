import { DIALOGS_DATABASE } from "../../../../../../shareds/dialogs/dialogs.database.js";
import { processMovesEffect } from "../../moves/processMovesEffect.gameplay.js";

export const handlerEfficienciesDialogs = (
  turnManager,
  moveDamagesResult,
  action,
  sequence,
  efficiency
) => {
  if (efficiency === 1) return false;

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
        action.target.name,
        action.target.trainerId
      )
    );

  // permet d'attendre la validation du joueur avant de poursuivre après un dialogue comme "C'est super efficace"
  if (efficiency !== 1)
    turnManager.waitForAction(() => {
      processMovesEffect(
        turnManager,
        moveDamagesResult.damages,
        action,
        sequence
      );
    }, turnManager.state);

  return true;
};
