import { DIALOGS_DATABASE } from "../../../../../../shareds/dialogs/dialogs.database.js";

export const handlerConfusionEffectDialogs = (battleManager, target) => {
  battleManager.openDialogBox(
    DIALOGS_DATABASE.BATTLE_DIALOGS.becomesConfusing(target.name)
  );
};
