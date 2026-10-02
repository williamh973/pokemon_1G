import { BATTLE_RESULT_STATES } from "../battleManager/resultManager/resultManager.states.js";
import { GAME_STATES } from "./states/states.gameplay.js";

export const handlerClosesFromReturnItem = (game) => {
  // if (game.battleManager) {
  //   game.screenManager.setCurrentScreen(game.battleManager);
  //   game.battleManager.openBattleMenu();
  // }

  switch (game.state) {
    case GAME_STATES.BATTLE_LEARN_MOVES_MENU:
      game.screenManager.setCurrentScreen(game.battleManager);
      game.battleManager.battleLearnMoveMenu.close();

      game.battleManager.resultManager.state =
        BATTLE_RESULT_STATES.CHECK_EVOLUTION;
      break;
    case GAME_STATES.POKEDEX:
      game.screenManager.open(game.player.pokedex, GAME_STATES.POKEDEX);
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
