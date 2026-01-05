import { keys } from "../logic/gameplay/player/keyboard.js";

const dialogBox = (game) => {
  if (game.dialogBox?.isOpen) {
    game.dialogBox.update(game.canvas.context);

    if (keys.action) game.dialogBox.nextPage();
    keys.action = false; // on garde
  }
};

const menu = (game) => {
  if (game.menu?.isOpen) game.menu.update(game.canvas.context);
  if (game.menu?.isOpen && keys.up && game.menu.currentIndex > 0) {
    game.menu.currentIndex--;
    keys.up = false;
  }
  if (
    game.menu?.isOpen &&
    keys.down &&
    game.menu.currentIndex < game.menu.items.length - 1
  ) {
    game.menu.currentIndex++;
    keys.down = false;
  }

  if (keys.menu) {
    game.showMenu();
    keys.menu = false;
  }

  if (game.menu?.isOpen && keys.action) {
    game.menu.openItem();
    keys.action = false;
  }
};

const activeScreen = (game) => {
  if (game.activeMenuScreen) game.activeMenuScreen.update(game.canvas.context);
};

export const update = (game) => {
  game.player.update(game.canvas);
  game.tileManager.update();

  dialogBox(game);
  menu(game);
  activeScreen(game);

  game.transition.update();
};
//
