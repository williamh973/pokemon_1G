import { DIALOGS_DATABASE } from "../../../../../../shareds/dialogs/dialogs.database.js";

const getStatusLabel = (status) => {
  const labels = {
    BURN: "brûlé",
    PARALYSIS: "paralysé",
    POISON: "empoisonné",
    SLEEP: "endormis",
    FREEZE: "gelé",
  };

  return labels[status] ?? status;
};

export const handlerStatusEffectDialogs = (
  battleManager,
  statusEffectResult
) => {
  battleManager.openDialogBox(
    DIALOGS_DATABASE.BATTLE_DIALOGS.statusChanged(
      statusEffectResult.pokemon.name,
      getStatusLabel(statusEffectResult.status)
    )
  );
};
