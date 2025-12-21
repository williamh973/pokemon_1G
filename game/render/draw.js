export const draw = (game, tileManager) => {
  tileManager.drawMap(
    game.canvas.context,
    game.currentMap.layout,
    game.camera.offsetX,
    game.camera.offsetY
  );
};
