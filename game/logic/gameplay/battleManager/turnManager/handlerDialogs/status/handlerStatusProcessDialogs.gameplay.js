import { DIALOGS_DATABASE } from "../../../../../../shareds/dialogs/dialogs.database.js";

const getStatusLabel = (status) => {
  const labels = {
    BURN: "\nsouffre de sa brûlure.",
    PARALYSIS: "est paralysé.",
    POISON: "\nsouffre du poison.",
    SLEEP: "\ndort profondément.",
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
      processStatusResult.pokemon.trainerId,
      getStatusLabel(processStatusResult.pokemon.status)
    )
  );
};
