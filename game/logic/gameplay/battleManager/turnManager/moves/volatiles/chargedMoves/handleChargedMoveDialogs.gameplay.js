import { DIALOGS_DATABASE } from "../../../../../../../shareds/dialogs/dialogs.database.js";

export const handleChargedMoveDialogs = (turnManager, chargedMove, pokemon) => {
  let dialog = null;

  switch (chargedMove.move.id) {
    case "dig":
      dialog = DIALOGS_DATABASE.BATTLE_DIALOGS.dig(
        pokemon.name,
        pokemon.trainerId
      );
      break;
    case "solarBeam":
      dialog = DIALOGS_DATABASE.BATTLE_DIALOGS.shining(
        pokemon.name,
        pokemon.trainerId
      );
      break;
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
