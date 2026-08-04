import { GAME_STATES } from "../../logic/gameplay/game/states/states.gameplay.js";

export class ScreenManager {
  constructor(game) {
    this.game = game;
    this.currentScreen = null;
  }

  setCurrentScreen(screen) {
    this.currentScreen = screen;
  }

  open(screen, state) {
    this.setCurrentScreen(screen);
    // console.log(this.currentScreen);
    this.currentScreen.open();

    this.game.state = state;
  }

  close(state) {
    this.currentScreen.close();
    this.currentScreen = null;

    if (state) this.game.state = state;
  }

  openPokemonSummary() {
    this.open(
      this.game.player.party.contextMenu.pokemonSummary,
      GAME_STATES.PARTY_SUMMARY
    );
  }

  openEvolution() {
    this.open(
      this.game.player.party.partyPhaseManager.evolutionSequence,
      GAME_STATES.EVOLUTION
    );
  }

  closeEvolution() {
    this.close(GAME_STATES.EVOLUTION);
  }
}
