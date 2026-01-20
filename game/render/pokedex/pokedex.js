import { keys } from "../../logic/gameplay/player/keyboard.js";
import {
  handleItems,
  pokedexCharacteristicsIndexMoveDown,
  pokedexCharacteristicsIndexMoveUp,
} from "./sections/pokemonCharacteristics/pokemonCharacteristics.js";
import {
  pokemonListIndexMoveDown,
  pokemonListIndexMoveUp,
  selectPokemonFromPokemonList,
} from "./sections/pokemonList/pokemonList.js";

const closePokedex = (game, pokedex, pokemonList, pokemonDetail) => {
  const dialogBox = game.dialogBox;
  if (pokedex.isOpen && keys.escape) {
    if (dialogBox?.isOpen) game.closeDialogBox();

    pokedex.isOpen =
      pokemonList.isOpen =
      pokedex.pokedexCharac.isOpen =
      pokemonList.pokedexState.isOpen =
      pokemonDetail.isOpen =
        false;

    pokedex.pokedexCharac.hasFocus = false;
    pokemonList.hasFocus = false;

    pokedex.pokedexCharac.cursor.isVisible = false;
    pokemonList.cursor.isVisible = false;

    game.resetCurrentScreen();
    game.openMenu();
  }
};

const pokemonListS = (pokemonList, pokedexCharac) => {
  if (!pokemonList.isOpen || !pokemonList.hasFocus) return;
  pokemonListIndexMoveUp(pokemonList);
  pokemonListIndexMoveDown(pokemonList);
  selectPokemonFromPokemonList(pokemonList, pokedexCharac);
};

const characteristicsS = (pokemonList, pokedexCharac, pokemonDetail) => {
  handleItems(pokemonList, pokedexCharac);
  pokedexCharacteristicsIndexMoveUp(pokemonList, pokedexCharac);
  pokedexCharacteristicsIndexMoveDown(pokemonList, pokedexCharac);
};

export const pokedex = (game) => {
  if (game.currentScreen?.name !== "POKEDEX") return;
  const currentScreen = game.currentScreen;
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
  if (pokemonList.isPokemonSelected) {
    pokemonDetail.update(game.canvas.context);
    pokemonDetail.pokemonSprite?.update(game.canvas.context);
  }
  pokemonListS(pokemonList, pokedexCharac);
  characteristicsS(pokemonList, pokedexCharac, pokemonDetail);
  closePokedex(game, pokedex, pokemonList, pokemonDetail);
};
