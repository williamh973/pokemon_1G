import { keys } from "../../../../logic/gameplay/player/keyboard.js";

export const selectPokemonFromPokemonList = (pokemonList, pokedexCharac) => {
  if (keys.action && !pokemonList.isPokemonSelected) {
    pokemonList.isPokemonSelected = true;
    pokemonList.cursor.state = pokemonList.cursor.state.focused;
    pokedexCharac.cursor.isVisible = true;
    pokedexCharac.hasFocus = true;
    keys.action = false;
  }
};

export const pokemonListIndexMoveUp = (pokemonList) => {
  if (
    keys.up &&
    !pokemonList.isPokemonSelected &&
    pokemonList.currentIndex > 0
  ) {
    pokemonList.currentIndex--;
    keys.up = false;
  }
};

export const pokemonListIndexMoveDown = (pokemonList) => {
  if (
    keys.down &&
    !pokemonList.isPokemonSelected &&
    pokemonList.currentIndex < pokemonList.databases.length - 1
  ) {
    pokemonList.currentIndex++;
    keys.down = false;
  }
};
