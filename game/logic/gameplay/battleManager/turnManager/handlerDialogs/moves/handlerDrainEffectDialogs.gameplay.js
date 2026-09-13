import { DIALOGS_DATABASE } from "../../../../../../shareds/dialogs/dialogs.database.js";

export const handlerDrainEffectDialogs = (battleManager, action) => {
  battleManager.openDialogBox(
    DIALOGS_DATABASE.BATTLE_DIALOGS.drain(action.target.name)
  );
};
