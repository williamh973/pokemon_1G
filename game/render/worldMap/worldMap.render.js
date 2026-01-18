export const worldMap = (game) => {
  if (game.currentScreen?.name !== "worldMap") return;
  const worldMap = game.currentScreen;
  worldMap.update(game.canvas.context);
};
