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

export const menu = (game) => {
  handleOpenClose(game);
};
