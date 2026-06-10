import { GAME_STATES } from "./states/states.gameplay.js";

export const handlerClosesFromReturnItem = (game) => {
  if (game.isBattleMod) {
    game.currentScreen = game.battleManager;
    game.openBattleMenu();
  }

  switch (game.state) {
    case GAME_STATES.POKEDEX:
      game.openPokedex();
      break;
    case GAME_STATES.PARTY:
      game.player.party.contextMenu.close();
      break;
    case GAME_STATES.INVENTORY:
      game.closeAndReturnFromSubMenu();
      break;
    case GAME_STATES.PLAYER_MENU:
      game.closePlayerMenu();
      break;
    default:
      break;
  }
};
