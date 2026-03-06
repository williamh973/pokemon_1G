import { Save } from "../../../models/MainMenu/items/Save/save.model.js";
import { WorldMap } from "../../../models/MainMenu/items/pokedex/sections/WorldMap/WorldMap.model.js";

export const dispatchMenuSelection = (game, itemId, source) => {
  source.hasFocus = false;
  const itemsList = {
    POKEDEX: () => game.openPokedex(),
    POKEMON: () => game.openTeam(),
    SAC: () => game.openInventory(),
    SAUVER: () => game.attemptSave(),
    OPTIONS: () => game.openOptionsScreen(),
    RETOUR: () => game.closeMenu(),
    INFO: () => game.openPokemonDetail(),
    CRI: () => game.playCry(),
    ZONE: () => game.openWorldMap(),
    NEW_GAME: () => game.start(),
    CONTINUE: () => game.load(),
  };

  return itemsList[itemId]?.();
};

export const startTransitionBeforeOpenWorldMap = (game) => {
  game.transition.start(
    () => {
      const pokemon = game.currentScreen.pokemonList.selectedPokemon;
      game.currentScreen = new WorldMap(game, "ENCOUNTER");
      game.currentScreen.open(pokemon);
      game.state = "WORLDMAP";
      game.mainMenu.close();
    },
    () => {}
  );
};

export const loadGame = (game) => {
  const save = Save.load();
  if (!save) return;

  save.apply(game);
  game.isLoaded = true;
  game.mapManager.loadMap(game.mapManager.currentMap);
  game.closeTitleScreen();
};
