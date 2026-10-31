import { DIALOGS_DATABASE } from "../../../../../../../shareds/dialogs/dialogs.database.js";

export const handleChargedMoveDialogs = (turnManager, chargedMove, pokemon) => {
  let dialog = null;

  switch (chargedMove.move.id) {
    case "skullBash":
      dialog = DIALOGS_DATABASE.BATTLE_DIALOGS.setBack(
        pokemon.name,
        pokemon.trainerId
      );
      break;

    case "fly":
      dialog = DIALOGS_DATABASE.BATTLE_DIALOGS.takeOff(
        pokemon.name,
        pokemon.trainerId
      );
      break;

    default:
      break;
  }

  turnManager.battleManager.openDialogBox(dialog);
};
