export const ITEM_EFFECTS = {
  // HEAL_HP: "HEAL_HP",
  REVIVE: ({ game, item }) => {
    console.log("REVIVE");
  },
  // CURE_STATUS,
  CATCH: ({ game, item }) => {
    game.openBattleWhitoutBattleMenu(item);
  },
};
