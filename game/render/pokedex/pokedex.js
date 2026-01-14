import { keys } from "../../logic/gameplay/player/keyboard.js";
import {
  handleItems,
  openPokemonDetails,
  pokedexCharacteristicsIndexMoveDown,
  pokedexCharacteristicsIndexMoveUp,
} from "./sections/pokemonCharacteristics/pokemonCharacteristics.js";
import {
  pokemonListIndexMoveDown,
  pokemonListIndexMoveUp,
  selectPokemonFromPokemonList,
} from "./sections/pokemonList/pokemonList.js";

const closePokedex = (game, pokedex, pokemonList, pokemonDetail) => {
  if (keys.escape)
    pokedex.isOpen =
      pokemonList.isOpen =
      pokedex.pokedexCharac.isOpen =
      pokemonList.pokedexState.isOpen =
      pokemonDetail.isOpen =
        false;
};

const pokemonListS = (pokemonList) => {
  pokemonListIndexMoveUp(pokemonList);
  pokemonListIndexMoveDown(pokemonList);
  selectPokemonFromPokemonList(pokemonList);
};

const characteristicsS = (pokemonList, pokedexCharac, pokemonDetail) => {
  handleItems(pokemonList, pokedexCharac);
  openPokemonDetails(pokemonList, pokemonDetail);
  pokedexCharacteristicsIndexMoveUp(pokemonList, pokedexCharac);
  pokedexCharacteristicsIndexMoveDown(pokemonList, pokedexCharac);
};

export const pokedex = (game) => {
  const currentScreen = game.currentScreen;
  if (currentScreen?.name !== "POKEDEX") return;
  const pokedex = currentScreen;
  const pokemonList = pokedex?.pokemonList;
  const pokemonState = pokemonList.pokedexState;
  const pokedexCharac = pokedex?.pokedexCharac;
  const pokemonDetail = pokemonList.pokemonDetail;

  if (pokedex) {
    pokedex.update(game.canvas.context);
    pokemonList.update(game.canvas.context);
    pokemonState.update(game.canvas.context);
    pokedexCharac.update(game.canvas.context);
  }
  if (pokemonList.isPokemonSelected) pokemonDetail.update(game.canvas.context);

  pokemonListS(pokemonList);
  characteristicsS(pokemonList, pokedexCharac, pokemonDetail);
  closePokedex(game, pokedex, pokemonList, pokemonDetail);
};
