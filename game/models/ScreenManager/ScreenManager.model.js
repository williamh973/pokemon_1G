export class ScreenManager {
  constructor(game) {
    this.game = game;
    this.currentScreen = null;
  }

  open(screen, state) {
    this.currentScreen = screen;
    this.currentScreen.open();

    this.game.state = state;
  }

  close(state) {
    this.currentScreen.close();
    this.currentScreen = null;

    this.game.state = state;
  }
}
