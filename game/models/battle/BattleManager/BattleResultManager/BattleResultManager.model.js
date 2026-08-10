import { BATTLE_MANAGER_STATES } from "../../../../logic/gameplay/battleManager/slots/states/battleManager.states.js";
import { GAME_STATES } from "../../../../logic/gameplay/game/states/states.gameplay.js";
import { INPUT_STATE } from "../../../../logic/input/inputs.state.js";
import { DIALOGS_DATABASE } from "../../../../shareds/dialogs/dialogs.database.js";

export class BattleResultManager {
  constructor(battleManager) {
    this.battleManager = battleManager;
  }

  checkPlayerEscaped(action) {
    if (this.battleManager.hasPlayerEscaped) {
      this.battleManager.openDialogBox(`Vous prenez la fuite!`);

      if (action === INPUT_STATE.ACTION) {
        const pokedexState =
          this.battleManager.game.player.pokedex.pokemonList.pokedexState;

        pokedexState.addSee(this.battleManager.wildPokemon.id);
        this.endBattle();

        this.battleManager.hasPlayerEscaped = false;
      }
    }
  }

  checkPokemonCaptured(action) {
    if (this.battleManager.sequenceManager.battleCatchSequence?.hasCaptured) {
      this.battleManager.state = BATTLE_MANAGER_STATES.CAPTURED;

      this.openDialogBox(
        DIALOGS_DATABASE.BATTLE_DIALOGS.pokemonCaptured(
          this.battleManager.wildPokemon.name
        )
      );

      if (
        action === INPUT_STATE.ACTION &&
        this.battleManager.state === BATTLE_MANAGER_STATES.CAPTURED
      ) {
        const emptySlot =
          this.battleManager.game.player.party.addPokemonToFirstEmptySlot(
            this.battleManager.wildPokemon
          );

        if (emptySlot) {
          const pokedexState =
            this.battleManager.game.player.pokedex.pokemonList.pokedexState;
          const hasPokedexAddedPokemon = pokedexState.addCatch(
            this.battleManager.wildPokemon.id
          );

          if (hasPokedexAddedPokemon) {
            this.battleManager.state = BATTLE_MANAGER_STATES.ADD_POKEDEX;
            this.battleManager.openDialogBox(
              `${this.battleManager.wildPokemon.name} a été au pokedex !`
            );
            this.battleManager.game.stopWildBattle();
          } else this.battleManager.game.stopWildBattle();
        } else {
          // PC logic
          this.battleManager.openDialogBox(
            `Plus de place dans l'équipe\n${this.battleManager.wildPokemon.name} est transféré au pc`
          );
        }
      }
    }
  }

  endBattle() {
    this.battleManager.game.transition.start(
      () => {
        this.battleManager.game.togglePause(false, true);
      },
      (done) => {
        this.battleManager.game.screenManager.close(GAME_STATES.WORLD);
        this.battleManager.battleMenu.resetCurrentIndex();
        this.battleManager.game.onBattleEnded();
        done();
      },
      () => {}
    );
  }

  update(action) {
    this.checkPlayerEscaped(action);
    this.checkPokemonCaptured(action);
  }
}
