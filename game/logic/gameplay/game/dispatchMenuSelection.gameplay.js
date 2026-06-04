export const dispatchMenuSelection = (game, itemId, source) => {
  source.hasFocus = false;

  const itemsList = {
    POKEDEX: () => game.openPokedex(),
    POKEMON: () => game.openParty(),
    SAC: () => game.openInventory(),
    SAUVER: () => game.attemptSave(),
    OPTIONS: () => game.openOptionsScreen(),
    RETOUR: () => game.handlerCloses(),
    INFO: () => game.openPokemonDetail(),
    CRI: () => game.playCry(),
    ZONE: () => game.openWorldMap(),
    NEW_GAME: () => game.startNewGame(),
    CONTINUE: () => game.load(),
    BOY: () => game.selectGender(itemId),
    GIRL: () => game.selectGender(itemId),
    SUMMARY: () => game.openPokemonSummary(),
  };

  return itemsList[itemId]?.();
};
