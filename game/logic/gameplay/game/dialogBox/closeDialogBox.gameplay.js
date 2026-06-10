import { GAME_STATES } from "../states/states.gameplay.js";

export const closeDialogBox = (game) => {
  game.dialogBox.close();
  if (game.activeNpc) game.activeNpc = null;
  game.state = GAME_STATES.WORLD;
  game.togglePause(false, true);

  if (game.dialogCallback) {
    const cb = game.dialogCallback;
    game.dialogCallback = null;
    cb();
  }
};
