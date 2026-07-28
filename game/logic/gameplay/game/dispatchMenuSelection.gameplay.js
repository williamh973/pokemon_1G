export const dispatchMenuSelection = (game, itemId, source) => {
  source.hasFocus = false;

  const itemsList = {
    POKEDEX: () => game.openPokedex(),
    POKEMON: () => game.openParty(),
    SAC: () => game.openInventory(),
    TRAINER_CARD: () => game.openTrainerCard(),
    SAUVER: () => game.attemptSave(),
    OPTIONS: () => game.openOptionsScreen(),
    RETOUR: () => game.handlerClosesFromReturnItem(),
    INFO: () => game.openPokemonDetail(),
    CRI: () => game.playCry(),
    ZONE: () => game.openWorldMap(),
    NEW_GAME: () => game.startNewGame(),
    CONTINUE: () => game.load(),
    BOY: () => game.selectGender(itemId),
    GIRL: () => game.selectGender(itemId),
    SUMMARY: () => game.openPokemonSummary(),
    ATTACK: () => game.openBattleAttacksMenu(),
    ESCAPE: () => game.playerWantQuitBattle(),
    SWITCH_POKEMON: () => game.switchPokemon(),
    MOVE_SLOT: () => game.handleBattleMoves(source.selectedMoveData),
    USE_ITEM_TO_PARTY: () => game.player.party.applyUsedItemEffect(),
  };

  return itemsList[itemId]?.();
};
