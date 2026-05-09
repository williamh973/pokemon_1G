import { WorldMap } from "../../../../models/MainMenu/items/pokedex/sections/WorldMap/WorldMap.model.js";

export const startTransitionBeforeOpenWorldMap = (game) => {
  game.transition.start(
    () => {},
    (done) => {
      const pokemon = game.currentScreen.pokemonList.selectedPokemon;
      game.currentScreen = new WorldMap(game, "ENCOUNTER");
      game.currentScreen.open(pokemon);
      game.state = "WORLDMAP";
      game.mainMenu.close();
      done();
    },
    () => {}
  );
};
