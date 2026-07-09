export const closeWorldMap = (game) => {
  const worldMap = game.screenManager.currentScreen;
  switch (worldMap.mod) {
    case "ENCOUNTER":
      game.openPokedex();
      break;
    case "FLY":
      break;
    case "PLAYER_POSITION":
      break;
    default:
      break;
  }
};
