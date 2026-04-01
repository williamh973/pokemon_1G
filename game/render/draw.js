export const draw = (game, tileManager) => {
  switch (game.state) {
    case "WORLD":
      tileManager.drawMap(
        game.canvas.context,
        game.mapManager.currentMap.backgLayout,
        game.camera.offsetX,
        game.camera.offsetY,
        "background"
      );
      game.mapManager.currentMap.npcs.forEach((npc) =>
        npc.draw(game.canvas, game.camera)
      );
      game.player.draw(game.canvas, game.camera);

      if (game.mapManager.currentMap.overlayLayout) {
        tileManager.drawMap(
          game.canvas.context,
          game.mapManager.currentMap.overlayLayout,
          game.camera.offsetX,
          game.camera.offsetY,
          "overlay"
        );
      }
      break;
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
