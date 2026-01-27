export const worldMap = (game, action) => {
  if (game.currentScreen?.name !== "worldMap") return;
  const worldMap = game.currentScreen;
  worldMap.update(game, action);
};
