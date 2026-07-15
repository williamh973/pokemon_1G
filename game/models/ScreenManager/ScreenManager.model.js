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
}
