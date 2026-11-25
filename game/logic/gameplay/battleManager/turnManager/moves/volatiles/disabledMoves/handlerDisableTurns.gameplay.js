import { DIALOGS_DATABASE } from "../../../../../../../shareds/dialogs/dialogs.database.js";
import { TURN_STATES } from "../../../states/turnManager.states.js";

export const handlerDisableTurns = (turnManager) => {
  const pokemons = [
    turnManager.firstAction?.pokemon,
    turnManager.secondAction?.pokemon,
  ].filter(Boolean);

  const releasedMoves = [];

  for (const pokemon of new Set(pokemons)) {
    const { disabledMove, disabledTurns } = pokemon.volatils;

    if (!disabledMove || disabledTurns <= 0) continue;

    pokemon.volatils.disabledTurns--;

    if (pokemon.volatils.disabledTurns === 0) {
      disabledMove.enabled = true;
      pokemon.volatils.disabledMove = null;

      releasedMoves.push({ pokemon, disabledMove });
    }

    console.log(
      `${pokemon.name} : Entrave restante : ${pokemon.volatils.disabledTurns}`
    );
  }

  if (releasedMoves.length === 0) return;

  const showNextDialog = (index) => {
    const { pokemon, disabledMove } = releasedMoves[index];

    turnManager.battleManager.openDialogBox(
      DIALOGS_DATABASE.BATTLE_DIALOGS.enabledMove(
        disabledMove.name,
        pokemon.name,
        pokemon.trainerId
      )
    );

    turnManager.waitForAction(() => {
      if (index + 1 < releasedMoves.length) {
        showNextDialog(index + 1);
      }
    }, TURN_STATES.END);
  };

  showNextDialog(0);
};
