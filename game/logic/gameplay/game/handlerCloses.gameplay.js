export const handlerCloses = (game) => {
  if (game.isBattleMod) {
    game.currentScreen = game.battleManager;
    game.openBattleMenu();
  }

  switch (game.state) {
    case "POKEDEX":
      game.openPokedex();
      break;
    case "PARTY":
      game.player.party.contextMenu.close();
      break;

    default:
      break;
  }
};
