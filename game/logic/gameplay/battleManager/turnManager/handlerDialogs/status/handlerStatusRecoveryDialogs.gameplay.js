import { DIALOGS_DATABASE } from "../../../../../../shareds/dialogs/dialogs.database.js";

export const handlerStatusRecoveryDialogs = {
  wokenUpProcessDialog: (battleManager, processStatusResult) => {
    battleManager.openDialogBox(
      DIALOGS_DATABASE.BATTLE_DIALOGS.wokenUp(processStatusResult.pokemon.name)
    );
  },
  thawedOutProcessDialog: (battleManager, processStatusResult) => {
    battleManager.openDialogBox(
      DIALOGS_DATABASE.BATTLE_DIALOGS.thawedOut(
        processStatusResult.pokemon.name
      )
    );
  },
};
