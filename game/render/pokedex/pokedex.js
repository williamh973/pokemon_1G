export const pokedex = (game, action) => {
  const currentScreen = game.currentScreen;
  const pokedex = currentScreen;
  const pokemonList = pokedex?.pokemonList;
  const pokemonState = pokemonList.pokedexState;
  const pokedexCharac = pokedex?.pokedexCharac;
  const pokemonDetail = pokemonList.pokemonDetail;

  if (pokedex.isOpen) pokedex.update(game.canvas.context, action);

  if (pokemonList.hasFocus) pokemonList.update(game.canvas.context, action);
  else if (pokedexCharac.hasFocus)
    pokedexCharac.update(game.canvas.context, action);

  if (pokemonList.isOpen) pokemonState.update(game.canvas.context);

  if (pokemonList.isOpen) {
    pokemonList.draw(game.canvas.context);
    pokedexCharac.draw(game.canvas.context);
  }

  if (pokemonList.isPokemonSelected && pokemonDetail.isOpen) {
    pokemonDetail.update(game.canvas.context, action);
    pokemonDetail.pokemonSprite?.update(game.canvas.context);
  }
};
