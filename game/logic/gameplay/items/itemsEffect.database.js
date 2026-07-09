import { GAME_STATES } from "../game/states/states.gameplay.js";

export const ITEM_EFFECTS = {
  // HEAL_HP: "HEAL_HP",
  REVIVE: ({ game, item }) => {
    console.log("REVIVE");
  },
  // CURE_STATUS,
  CATCH: ({ game, item }) => {
    game.openBattleWhitoutBattleMenu(item);
  },

  USE_BICYCLE: ({ game, item }) => {
    game.screenManager.close(GAME_STATES.DIALOG);
    game.player.isOnBike = !game.player.isOnBike;

    if (game.player.isOnBike)
      game.dialogBox.open(
        `${game.player.nickname} monte sur la ${item.name}.`,
        false
      );
    else
      game.dialogBox.open(
        `${game.player.nickname} descend de la  ${item.name}.`,
        false
      );
  },
  LEVEL_UP: ({ game, item }) => {
    game.screenManager.close(GAME_STATES.WORLD);

    game.player.party.usedItem = item;
    game.openParty();
    game.dialogBox.open(`Donner à quel POKéMON ?`, false);
  },
};
