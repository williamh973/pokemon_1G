import { keys } from "../logic/gameplay/player/keyboard.js";

const selectPokemon = (pokemonList) => {
  if (keys.action && !pokemonList.isPokemonSelected) {
    pokemonList.isPokemonSelected = true;
    pokemonList.cursor.state = pokemonList.cursor.state.active;
  }
};

const handleIndex = (pokemonList, pokedexCharac) => {
  if (
    keys.up &&
    !pokemonList.isPokemonSelected &&
    pokemonList.currentIndex > 0
  ) {
    pokemonList.currentIndex--;
    keys.up = false;
  }

  if (
    keys.down &&
    !pokemonList.isPokemonSelected &&
    pokemonList.currentIndex < pokemonList.databases.length - 1
  ) {
    pokemonList.currentIndex++;
    keys.down = false;
  }

  if (
    keys.up &&
    pokemonList.isPokemonSelected &&
    pokedexCharac.currentIndex > 0
  ) {
    pokedexCharac.currentIndex--;
    keys.up = false;
  }

  if (
    keys.down &&
    pokemonList.isPokemonSelected &&
    pokedexCharac.currentIndex < pokedexCharac.items.length - 1
  ) {
    pokedexCharac.currentIndex++;
    keys.down = false;
  }
};

const closePokedex = (game, pokedex, pokemonList) => {
  if (keys.escape) {
    pokedex.isOpen =
      pokemonList.isOpen =
      pokedex.pokedexCharac.isOpen =
      pokemonList.pokedexState.isOpen =
        false;
    game.togglePause(false, true);
  }
};

const handleItems = (pokedexCharac) => {
  if (keys.action.pressed && !keys.action.activated) {
    pokedexCharac.openItem();
    keys.action.activated = true;
  }

  if (!keys.action.pressed) {
    keys.action.activated = false;
  }
};

const openPokemonDetail = (pokemonList, pokemonDetail) => {
  if (pokemonList.isPokemonSelected && keys.action) {
    console.log("déclenché");
  }
};

export const pokedex = (game) => {
  const currentScreen = game.currentScreen;
  if (currentScreen?.name !== "POKEDEX") return;

  const pokedex = currentScreen;
  const pokemonList = pokedex?.pokemonList;
  const pokedexCharac = pokedex?.pokedexCharac;
  const pokemonDetail = pokedex?.pokemonDetail;

  if (pokedex) {
    pokedex.update(game.canvas.context);
    pokemonList.update(game.canvas.context);
    pokemonList.pokedexState.update(game.canvas.context);
    pokedexCharac.update(game.canvas.context);
    pokemonDetail.update(game.canvas.context);
  }

  selectPokemon(pokemonList);
  closePokedex(game, pokedex, pokemonList);
  handleIndex(pokemonList, pokedexCharac);
  handleItems(pokedexCharac);
  openPokemonDetail(pokemonList, pokemonDetail);
};
