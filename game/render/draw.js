export const draw = (game, tileManager) => {
  tileManager.drawMap(
    game.canvas.context,
    game.currentMap.layout,
    game.camera.offsetX,
    game.camera.offsetY
  );

  switch (game.state) {
    case "DIALOG":
      game.player.draw(game.canvas);
      break;
    case "MENU":
      game.player.draw(game.canvas);
      break;
  }
};
