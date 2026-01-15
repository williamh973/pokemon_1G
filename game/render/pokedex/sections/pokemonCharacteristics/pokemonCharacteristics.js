import { keys } from "../../../../logic/gameplay/player/keyboard.js";

export const handleItems = (pokemonList, pokedexCharac) => {
  if (pokemonList.isPokemonSelected && keys.action) {
    pokedexCharac.openItem();
    keys.action = false;
  }
};

export const pokedexCharacteristicsIndexMoveUp = (
  pokemonList,
  pokedexCharac
) => {
  if (
    keys.up &&
    pokemonList.isPokemonSelected &&
    pokedexCharac.currentIndex > 0
  ) {
    pokedexCharac.currentIndex--;
    keys.up = false;
  }
};

export const pokedexCharacteristicsIndexMoveDown = (
  pokemonList,
  pokedexCharac
) => {
  if (
    keys.down &&
    pokemonList.isPokemonSelected &&
    pokedexCharac.currentIndex < pokedexCharac.items.length - 1
  ) {
    pokedexCharac.currentIndex++;
    keys.down = false;
  }
};
