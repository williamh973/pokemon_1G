import { dialogBox } from "./dialogBox.js";
import { menu } from "./menu/menu.js";
import { pokedex } from "./pokedex/pokedex.js";
import { worldMap } from "./worldMap/worldMap.render.js";

export const update = (game) => {
  game.player.update(game.canvas);
  game.tileManager.update();

  menu(game);
  pokedex(game);
  worldMap(game);
  dialogBox(game);

  game.transition.update();
};
