import { DIALOGS_DATABASE } from "../../../../../../shareds/dialogs/dialogs.database.js";

const getStatusLabel = (status) => {
  const labels = {
    BURN: "souffre de sa brûlure.",
    PARALYSIS: "est paralysé.",
    POISON: "souffre du poison.",
    SLEEP: "dort profondément.",
    FREEZE: "est gelé.",
  };

  return labels[status] ?? status;
};

export const handlerStatusProcessDialogs = (
  battleManager,
  processStatusResult
) => {
  battleManager.openDialogBox(
    DIALOGS_DATABASE.BATTLE_DIALOGS.processStatus(
      processStatusResult.pokemon.name,
      getStatusLabel(processStatusResult.pokemon.status)
    )
  );
};
