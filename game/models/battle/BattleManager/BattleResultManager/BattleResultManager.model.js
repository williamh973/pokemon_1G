import { BATTLE_MANAGER_STATES } from "../../../../logic/gameplay/battleManager/states/battleManager.states.js";
import { resetTeamStatStages } from "../../../../logic/gameplay/battleManager/turnManager/statStages/resetStatStages.gameplay.js";
import { TURN_STATES } from "../../../../logic/gameplay/battleManager/turnManager/states/turnManager.states.js";
import { GAME_STATES } from "../../../../logic/gameplay/game/states/states.gameplay.js";
import { INPUT_STATE } from "../../../../logic/input/inputs.state.js";
import { DIALOGS_DATABASE } from "../../../../shareds/dialogs/dialogs.database.js";

export class BattleResultManager {
  constructor(battleManager) {
    this.battleManager = battleManager;
    this.isKoProcessed = false;
    this.gainedExp = null;
    this.isExpGainStarted = false;
    this.isExpGainFinished = false;
  }

  checkPokemonKo() {
    const turnManager = this.battleManager.turnManager;

    if (turnManager.state !== TURN_STATES.DETERMINE_KO) return;
    if (this.isKoProcessed) return;

    const koAction = turnManager.koAction;

    if (!koAction) return;

    const koPokemon = koAction.target;

    if (koPokemon === this.battleManager.wildPokemon) this.isKoProcessed = true;

    if (koPokemon === this.battleManager.currentPlayerPokemon) {
      this.isKoProcessed = true;
      // Pokémon du joueur KO
      // → choisir un autre Pokémon
      // → ou défaite
    }
  }

  startExpGain() {
    this.isExpGainStarted = true;

    const wildPokemonXp = this.battleManager.wildPokemon.exp;
    const { pokemon } = this.battleManager.turnManager.koAction;

    pokemon.exp += wildPokemonXp;

    console.log("XP finale :", pokemon.exp);
  }

  checkPokemonCaptured(action) {
    if (this.battleManager.sequenceManager.battleCatchSequence?.hasCaptured) {
      this.battleManager.state = BATTLE_MANAGER_STATES.CAPTURED;

      this.battleManager.openDialogBox(
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
              DIALOGS_DATABASE.BATTLE_DIALOGS.wildPokemonAddedToPokedex(
                this.battleManager.wildPokemon.name
              )
            );
            this.endBattle();
          } else this.endBattle();
        } else {
          // PC logic
          this.battleManager.openDialogBox(
            DIALOGS_DATABASE.BATTLE_DIALOGS.pokemonSentToPc(
              this.battleManager.wildPokemon.name
            )
          );
        }
      }
    }
  }

  endBattle() {
    resetTeamStatStages(this.battleManager.game.player.party);

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
    this.checkPokemonKo();
    this.checkPokemonCaptured(action);

    if (this.isExpGainStarted && !this.isExpGainFinished) {
      const { pokemon } = this.battleManager.turnManager.koAction;

      if (this.battleManager.isExpAnimationFinished(pokemon)) {
        this.isExpGainFinished = true;
      }
    }
  }
}
