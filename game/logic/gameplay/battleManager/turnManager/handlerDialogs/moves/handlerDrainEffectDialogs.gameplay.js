import { DIALOGS_DATABASE } from "../../../../../../shareds/dialogs/dialogs.database.js";

export const handlerDrainEffectDialogs = (
  battleManager,
  action,
  recoveredHP
) => {
  const movePower = action.move.power;
  movePower > 0
    ? battleManager.openDialogBox(
        DIALOGS_DATABASE.BATTLE_DIALOGS.drain(
          action.target.name,
          action.target.trainerId
        )
      )
    : battleManager.openDialogBox(
        DIALOGS_DATABASE.BATTLE_DIALOGS.recover(
          action.target.name,
          action.target.trainerId,
          recoveredHP
        )
      );
};
