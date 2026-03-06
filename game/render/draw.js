export const draw = (game, tileManager) => {
  tileManager.drawMap(
    game.canvas.context,
    game.mapManager.currentMap.layout,
    game.camera.offsetX,
    game.camera.offsetY
  );

  switch (game.state) {
    case "DIALOG":
      game.player.draw(game.canvas, game.camera);
      if (!game.isAttemptSave) return;
      game.mainMenu?.draw(game.canvas.context, null);

      break;
    case "MENU":
      game.player.draw(game.canvas, game.camera);
      break;

    case "CHOICE_MENU":
      game.player.draw(game.canvas, game.camera);
      game.dialogBox?.draw(game.canvas.context);
      if (!game.isAttemptSave) return;
      game.mainMenu?.draw(game.canvas.context, null);
      break;
  }
};
