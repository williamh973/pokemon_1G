import { keys } from "../logic/gameplay/player/keyboard.js";

export const dialogBox = (game) => {
  if (game.dialogBox?.isOpen) {
    game.dialogBox.update(game.canvas.context);

    if (keys.action) game.dialogBox.nextPage();
    keys.action = false; // on garde
  }
};
