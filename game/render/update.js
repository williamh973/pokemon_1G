import { keys } from "../logic/gameplay/player/keyboard.js";
import { dialogBox } from "./dialogBox.js";
import { menu } from "./menu.js";
import { pokedex } from "./pokedex.js";

export const update = (game) => {
  game.player.update(game.canvas);
  game.tileManager.update();

  dialogBox(game);
  menu(game);
  pokedex(game);

  game.transition.update();
};
