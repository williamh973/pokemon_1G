export const startTransitionBeforeOpenWorldMap = (game) => {
  game.transition.start(
    () => {},
    (done) => {
      const pokemon = game.currentScreen.pokemonList.selectedPokemon;
      game.currentScreen = game.worldMap;
      game.currentScreen.open(pokemon);
      game.state = "WORLDMAP";
      game.mainMenu.close();
      done();
    },
    () => {}
  );
};
