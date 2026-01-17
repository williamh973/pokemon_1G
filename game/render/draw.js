export const draw = (game, tileManager) => {
  tileManager.drawMap(
    game.canvas.context,
    game.currentMap.layout,
    game.camera.offsetX,
    game.camera.offsetY
  );

  if (game.worldMap.isOpen) game.worldMap.draw(game.canvas.context);
};
