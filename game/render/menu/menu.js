import { keys } from "../../logic/gameplay/player/keyboard.js";

const handleOpenClose = (game) => {
  if (keys.menu) {
    game.toggleMenu();
    keys.menu = false;
  }
};

const handleIndex = (menu) => {
  if (menu.isOpen && keys.up && menu.currentIndex > 0) {
    menu.currentIndex--;
    keys.up = false;
  }
  if (menu.isOpen && keys.down && menu.currentIndex < menu.items.length - 1) {
    menu.currentIndex++;
    keys.down = false;
  }
};

const handleItems = (menu) => {
  if (menu.isOpen && keys.action) {
    menu.openItem();
    keys.action = false;
  }
};

export const menu = (game) => {
  const menu = game.menu;
  if (menu.isOpen) menu.update(game.canvas.context);

  handleOpenClose(game);
  handleIndex(menu);
  handleItems(menu);
};
