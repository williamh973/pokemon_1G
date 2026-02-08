import { Save } from "../../../models/Menu/items/Save/save.model.js";
import { WorldMap } from "../../../models/Menu/items/pokedex/sections/WorldMap/WorldMap.model.js";

export const dispatchMenuSelection = (game, itemId, source) => {
  source.hasFocus = false;
  const gameMenu = {
    POKEDEX: () => game.openPokedex(),
    POKEMON: () => game.openTeam(),
    SAC: () => game.openInventory(),
    SAUVER: () => game.attemptSave(),
    OPTIONS: () => game.openOptionsScreen(),
    RETOUR: () => game.closeMenu(),
  };

  const pokedexCharacMenu = {
    INFO: () => game.openPokemonDetail(),
    CRI: () => game(),
    ZONE: () => game.openWorldMap(),
    RETOUR: () => game.closeCurrentScreen(),
  };

  const titleScreenMenu = {
    NEW_GAME: () => game.closeTitleScreen(),
    CONTINUE: () => game.load(),
    OPTIONS: () => game.openOptionsScreen(),
  };

  if (game.menu.isOpen) gameMenu[itemId]?.();
  if (
    game.currentScreen?.name === "POKEDEX" &&
    game.currentScreen?.pokedexCharac.isOpen
  )
    pokedexCharacMenu[itemId]?.();

  if (game.currentScreen?.name === "TITLE" && game.currentScreen?.isOpen)
    titleScreenMenu[itemId]?.();
};

export const startTransitionBeforeOpenWorldMap = (game) => {
  game.transition.start(
    () => {
      const pokemon = game.currentScreen.pokemonList.selectedPokemon;
      game.currentScreen = new WorldMap(game, "ENCOUNTER");
      game.currentScreen.open(pokemon);
      game.state = "WORLDMAP";
      game.menu.close();
    },
    () => {}
  );
};

export const loadGame = (game) => {
  const save = Save.load();
  if (!save) return;

  save.apply(game);
  game.isLoaded = true;
  game.mapManager.loadMap(game.currentMap.id);
  game.closeTitleScreen();
};
