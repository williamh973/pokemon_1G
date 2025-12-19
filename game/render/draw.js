export const draw = (game, tileManager) => {
  tileManager.drawMap(
    game.canvas.context,
    game.currentMap.layout,
    game.camera.position.x,
    game.camera.position.y
  );
};
