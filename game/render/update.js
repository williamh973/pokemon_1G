import { dialogBox } from "./dialogBox.render.js";
import { menu } from "./menu/menu.render.js";
import { pokedex } from "./pokedex/pokedex.js";
import { worldMap } from "./worldMap/worldMap.render.js";

export const update = (game) => {
  const action = game.input.consume();

  switch (game.state) {
    case "DIALOG":
      game.dialogBox?.handleAction(action);
      break;

    case "MENU":
      game.menu?.handleAction(action);
      break;
    case "POKEDEX":
      game.currentScreen?.handleAction(action);
      break;
  }

  game.player.update(game.canvas, game.input);
  game.tileManager.update();

  menu(game);
  pokedex(game);
  worldMap(game);

  dialogBox(game);
  game.transition.update();
};
