import { DIALOGS_DATABASE } from "../../../../../../shareds/dialogs/dialogs.database.js";

export const handleDisableLastMoveEffectDialogs = (
  turnManager,
  action,
  moveEffectResult
) => {
  const pokemon = action.pokemon;
  const target = action.target;

  if (!moveEffectResult.isAffected) {
    turnManager.battleManager.openDialogBox(
      DIALOGS_DATABASE.BATTLE_DIALOGS.pokemonMissMove(
        pokemon.name,
        pokemon.trainerId
      )
    );
    console.log(
      DIALOGS_DATABASE.BATTLE_DIALOGS.pokemonMissMove(
        pokemon.name,
        pokemon.trainerId
      )
    );
  } else {
    turnManager.battleManager.openDialogBox(
      DIALOGS_DATABASE.BATTLE_DIALOGS.disabledMove(
        target.lastMove.name,
        target.name,
        target.trainerId
      )
    );
    console.log(
      DIALOGS_DATABASE.BATTLE_DIALOGS.disabledMove(
        target.lastMove.name,
        target.name,
        target.trainerId
      )
    );
  }
};
