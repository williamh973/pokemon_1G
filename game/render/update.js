import { menu } from "./menu/menu.render.js";
import { pokedex } from "./pokedex/pokedex.js";
import { worldMap } from "./worldMap/worldMap.render.js";

export const update = (game) => {
  const action = game.input.consume();

  switch (game.state) {
    case "WORLD":
      game.player.update(game, action);
      break;
    case "DIALOG":
      game.dialogBox?.update(game.canvas.context, action);
      game.player.draw(game.canvas);
      break;
    case "MENU":
      game.menu?.handleAction(action);
      game.menu?.update(game.canvas.context);
      break;
    case "POKEDEX":
      game.currentScreen?.handleAction(action);
      break;
  }

  game.tileManager.update();

  // menu(game);
  // pokedex(game);
  // worldMap(game);

  game.transition.update();
};
