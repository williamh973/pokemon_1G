import { SWITCH_STATES } from "../../../../../logic/gameplay/battle/sequences/switchSequence/switchSequenceState.gameplay.js";
import { DIALOGS_DATABASE } from "../../../../../shareds/dialogs/dialogs.database.js";

export class BattleSwitchSequence {
  constructor(game, context, battleSequenceManager, key) {
    this.state = SWITCH_STATES.DISAPPEAR;
    this.game = game;
    this.playerParty = context.playerParty;
    this.playerTargetPokemon = context.playerTargetPokemon;
    this.sequenceManager = battleSequenceManager;
    this.key = key;
    this.isFinished = false;
    this.isStarted = false;
  }

  updateHUD() {
    const currentPlayerPokemon = this.game.battleManager.currentPlayerPokemon;
    this.game.battleManager.battleRenderer.backSlot.content =
      currentPlayerPokemon;

    this.game.battleManager.battleRenderer.backHUD.pokemon =
      currentPlayerPokemon;

    this.updateHPbar(currentPlayerPokemon);
    this.updateXPbar(currentPlayerPokemon);
  }

  updateHPbar(currentPlayerPokemon) {
    this.game.battleManager.battleRenderer.backHUD.HPbar.currentHp =
      currentPlayerPokemon.stats.hp;

    this.game.battleManager.battleRenderer.backHUD.HPbar.maxHp =
      currentPlayerPokemon.stats.maxHp;
  }

  updateXPbar(currentPlayerPokemon) {
    this.game.battleManager.battleRenderer.backHUD.expBar.pokemon =
      currentPlayerPokemon;
  }

  updateCurrentPlayerPokemon() {
    this.game.battleManager.currentPlayerPokemon = this.playerTargetPokemon;
  }

  start() {
    this.isStarted = true;
    this.sequenceManager.startPokemonDisappearsSequence(this.key);
  }

  update(context) {
    const sequence = this.sequenceManager;

    switch (this.state) {
      case SWITCH_STATES.DISAPPEAR:
        sequence.pokemonDisappearsSequence?.update();

        if (sequence.pokemonDisappearsSequence?.isFinished) {
          sequence.pokemonDisappearsSequence = null;
          this.game.battleManager.currentPlayerPokemon =
            this.playerTargetPokemon;

          this.updateCurrentPlayerPokemon();
          this.updateHUD();
          this.game.battleManager.updateDebugStatsBoxes(this.key); // for debug

          sequence.startPlayerThrowSequence();

          this.game.battleManager.openDialogBox(
            DIALOGS_DATABASE.BATTLE_DIALOGS.playerSentOutPokemon(
              this.game.battleManager.currentPlayerPokemon.name
            )
          );

          this.state = SWITCH_STATES.PLAYER_THROW_POKEBALL;
        }
        break;

      case SWITCH_STATES.PLAYER_THROW_POKEBALL:
        if (sequence.playerThrowSequence?.pokeball?.state === "release") {
          sequence.playerThrowSequence?.pokeball?.pokeballReleaseEffect?.update(
            context
          );

          if (
            sequence.playerThrowSequence?.pokeball?.pokeballReleaseEffect
              ?.isFinished
          ) {
            sequence.playerThrowSequence = null;

            sequence.startPokemonAppearsSequence(
              this.playerTargetPokemon,
              this.key
            );

            this.state = SWITCH_STATES.APPEAR;
          }
        }
        break;

      case SWITCH_STATES.APPEAR:
        if (sequence.pokemonAppearsSequence?.isFinished) {
          sequence.pokemonAppearsSequence = null;
          this.isFinished = true;
        }

        break;
    }
  }
}
