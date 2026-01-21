import { keys } from "../../logic/gameplay/player/keyboard.js";

const handleOpenClose = (game) => {
  if (!keys.menu) return;

  if (game.menu.isOpen) {
    game.closeMenu();
  } else {
    game.openMenu();
  }

  keys.menu = false;
};

const handleIndex = (menu) => {
  if (!menu.isOpen || !menu.hasFocus) return;

  if (keys.up && menu.currentIndex > 0) {
    menu.currentIndex--;
    keys.up = false;
  }

  if (keys.down && menu.currentIndex < menu.items.length - 1) {
    menu.currentIndex++;
    keys.down = false;
  }
};

const handleItems = (menu) => {
  if (!menu.isOpen || !menu.hasFocus) return;

  if (keys.action) {
    menu.openItem();
    keys.action = false;
  }
};

export const menu = (game) => {
  handleOpenClose(game);

  const menu = game.menu;
  if (!menu.isOpen) return;

  menu.update(game.canvas.context);
  handleIndex(menu);
  handleItems(menu);
};
