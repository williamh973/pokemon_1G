import { pokedex } from "./pokedex/pokedex.js";
import { worldMap } from "./worldMap/worldMap.render.js";

const openMenu = (game) => {
  game.player.draw(game.canvas);
  game.openMenu();
};

export const update = (game) => {
  const action = game.input.consume();

  console.log(game.state);

  switch (game.state) {
    case "WORLD":
      if (action === "MENU") {
        openMenu(game);
        return;
      }

      game.player.update(game, action);
      break;
    case "DIALOG":
      game.dialogBox?.update(game.canvas.context, action);
      break;
    case "MENU":
      game.menu?.update(game.canvas.context, action);
      break;
    case "POKEDEX":
      pokedex(game, action);
      break;
  }

  game.tileManager.update();

  // worldMap(game);

  game.transition.update();
};
