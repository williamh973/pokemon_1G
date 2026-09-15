import { DIALOGS_DATABASE } from "../../../../../../shareds/dialogs/dialogs.database.js";

export const handlerConfusionEffectDialogs = (
  battleManager,
  target,
  alreadyConfusing
) => {
  if (alreadyConfusing)
    battleManager.openDialogBox(DIALOGS_DATABASE.BATTLE_DIALOGS.noEffect());
  else
    battleManager.openDialogBox(
      DIALOGS_DATABASE.BATTLE_DIALOGS.becomesConfusing(target.name)
    );
};
