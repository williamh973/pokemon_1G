export const closeDialogBox = (game) => {
  game.dialogBox.close();
  if (game.activeNpc) game.activeNpc = null;
  game.state = "WORLD";
  game.togglePause(false, true);

  if (game.dialogCallback) {
    const cb = game.dialogCallback;
    game.dialogCallback = null;
    cb();
  }
};
