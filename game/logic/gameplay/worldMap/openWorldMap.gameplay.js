import { WORLDMAP_STATES } from "./worldMap.states.js";

export const openWorldMap = (selectedPokemonFromPokedex, item, worldMap) => {
  worldMap.selectedPokemon = null;
  worldMap.usedItem = null;

  if (selectedPokemonFromPokedex) {
    worldMap.state = WORLDMAP_STATES.ENCOUNTER;
    worldMap.selectedPokemon = selectedPokemonFromPokedex;
  }

  if (item) {
    worldMap.state = WORLDMAP_STATES.PLAYER_POSITION;
    worldMap.usedItem = item;
  }

  worldMap.isOpen = true;
  worldMap.hasFocus = true;

  worldMap.cursor.isVisible = true;
};
