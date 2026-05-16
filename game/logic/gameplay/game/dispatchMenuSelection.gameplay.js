export const dispatchMenuSelection = (game, itemId, source) => {
  source.hasFocus = false;
  const itemsList = {
    POKEDEX: () => game.openPokedex(),
    POKEMON: () => game.openParty(),
    SAC: () => game.openInventory(),
    SAUVER: () => game.attemptSave(),
    OPTIONS: () => game.openOptionsScreen(),
    RETOUR: () => game.closeMenu(),
    INFO: () => game.openPokemonDetail(),
    CRI: () => game.playCry(),
    ZONE: () => game.openWorldMap(),
    NEW_GAME: () => game.start(),
    CONTINUE: () => game.load(),
  };

  return itemsList[itemId]?.();
};
