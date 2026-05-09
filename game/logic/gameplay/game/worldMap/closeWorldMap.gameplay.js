export const closeWorldMap = (game) => {
  const worldMap = game.currentScreen;
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
