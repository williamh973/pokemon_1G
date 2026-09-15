import { DIALOGS_DATABASE } from "../../../../../../shareds/dialogs/dialogs.database.js";

export const handlerFocusEnergyEffectDialogs = (
  battleManager,
  moveEffectResult
) => {
  if (moveEffectResult.alreadyBoostedByFocusEnergy)
    battleManager.openDialogBox(DIALOGS_DATABASE.BATTLE_DIALOGS.noEffect());
  else
    battleManager.openDialogBox(
      DIALOGS_DATABASE.BATTLE_DIALOGS.boostedByFocusEnergy(
        moveEffectResult.pokemon.name,
        moveEffectResult.pokemon.trainerId
      )
    );
};
