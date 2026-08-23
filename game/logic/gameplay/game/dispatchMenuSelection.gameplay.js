import { GAME_STATES } from "./states/states.gameplay.js";

export const dispatchMenuSelection = (game, itemId, source) => {
  source.hasFocus = false;

  const itemsList = {
    POKEDEX: () =>
      game.screenManager.open(game.player.pokedex, GAME_STATES.POKEDEX),

    POKEMON: () =>
      game.screenManager.open(game.player.party, GAME_STATES.PARTY),

    SAC: () =>
      game.screenManager.open(game.player.inventory, GAME_STATES.INVENTORY),

    TRAINER_CARD: () =>
      game.screenManager.open(
        game.player.trainerCard,
        GAME_STATES.TRAINER_CARD
      ),

    SAUVER: () => game.attemptSave(),

    OPTIONS: () => game.openOptionsScreen(),

    RETOUR: () => game.handlerClosesFromReturnItem(),

    INFO: () =>
      game.screenManager.currentScreen.pokemonList.pokemonDetail.open(),

    CRI: () => game.playCry(),

    ZONE: () => game.openWorldMap(),

    NEW_GAME: () => game.startNewGame(),

    CONTINUE: () => game.load(),

    BOY: () => game.hasPlayerGenderSelected(itemId),

    GIRL: () => game.hasPlayerGenderSelected(itemId),

    SUMMARY: () => game.screenManager.openPokemonSummary(),

    ATTACK: () => game.battleManager.openBattleMovesMenu(),

    ESCAPE: () => game.battleManager.playerWantQuitBattle(),

    SWITCH_POKEMON: () => game.switchPokemon(),

    MOVE_SLOT: () => game.battleManager.selecteMove(source.selectedMoveData),

    USE_ITEM_TO_PARTY: () => game.player.party.applyUsedItemEffect(),
  };

  return itemsList[itemId]?.();
};
