export const dialogBox = (game) => {
  if (game.dialogBox?.isOpen) game.dialogBox.update(game.canvas.context);
};
