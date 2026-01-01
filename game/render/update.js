import { keys } from "../logic/gameplay/player/keyboard.js";

export const update = (game) => {
  game.player.update(game.canvas);
  game.tileManager.update();

  if (game.dialogBox?.isOpen) {
    game.dialogBox.update(game.canvas.context);

    if (keys.action && game.dialogBox.justPressed) {
      console.log("cou");
      game.dialogBox.nextPage();
    }
    keys.action = false; // on garde
  }
  game.transition.update();
};
//
