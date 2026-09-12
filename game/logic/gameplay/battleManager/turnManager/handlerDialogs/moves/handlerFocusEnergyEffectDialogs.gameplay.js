import { DIALOGS_DATABASE } from "../../../../../../shareds/dialogs/dialogs.database.js";

export const handlerFocusEnergyEffectDialogs = (
  battleManager,
  focusEnergyMoveEffectResult
) => {
  if (focusEnergyMoveEffectResult.hasBoostedByFocusEnergy) {
    battleManager.openDialogBox(
      DIALOGS_DATABASE.BATTLE_DIALOGS.boostedByFocusEnergy(
        focusEnergyMoveEffectResult.pokemon.name
      )
    );
  } else
    battleManager.openDialogBox(DIALOGS_DATABASE.BATTLE_DIALOGS.noEffect());
};
