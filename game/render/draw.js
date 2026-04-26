const drawBackTiles = (game, tileManager) => {
  tileManager.drawMap(
    game.canvas.context,
    game.mapManager.currentMap.backgLayout,
    game.camera.offsetX,
    game.camera.offsetY,
    "background"
  );
};

const drawPuddleTiles = (game, tileManager) => {
  if (game.mapManager.currentMap.puddlesLayout && game.flags.weather?.rain) {
    tileManager.drawMap(
      game.canvas.context,
      game.mapManager.currentMap.puddlesLayout,
      game.camera.offsetX,
      game.camera.offsetY,
      "background"
    );
  }
};

const drawForegroundTiles = (game, tileManager) => {
  if (game.mapManager.currentMap.foregroundLayout) {
    tileManager.drawMap(
      game.canvas.context,
      game.mapManager.currentMap.foregroundLayout,
      game.camera.offsetX,
      game.camera.offsetY,
      "foreground"
    );
  }
};

const drawOverlayTiles = (game, tileManager) => {
  if (game.mapManager.currentMap.overlayLayout) {
    tileManager.drawMap(
      game.canvas.context,
      game.mapManager.currentMap.overlayLayout,
      game.camera.offsetX,
      game.camera.offsetY,
      "overlay"
    );
  }
};

export const draw = (game, tileManager) => {
  drawBackTiles(game, tileManager);
  drawPuddleTiles(game, tileManager);
  drawForegroundTiles(game, tileManager);

  switch (game.state) {
    case "WORLD":
      game.mapManager.currentMap.npcs?.forEach((npc) =>
        npc.draw(game.canvas, game.camera)
      );
      game.mapManager.currentMap.missableObjects?.forEach((mo) =>
        mo.draw(game.canvas, game.camera)
      );
      game.player.draw(game.canvas, game.camera);

      drawOverlayTiles(game, tileManager);
      game.dayNightCycle.draw(game.canvas, game.timeManager);
      game.timeManager.draw(game.canvas);
      break;
    case "DIALOG":
      game.mapManager.currentMap.npcs?.forEach((npc) =>
        npc.draw(game.canvas, game.camera)
      );
      game.mapManager.currentMap.missableObjects?.forEach((mo) =>
        mo.draw(game.canvas, game.camera)
      );
      game.player.draw(game.canvas, game.camera);

      drawOverlayTiles(game, tileManager);
      game.dayNightCycle.draw(game.canvas, game.timeManager);
      game.timeManager.draw(game.canvas);

      if (!game.isAttemptSave) return;
      game.mainMenu?.draw(game.canvas.context, null);

      break;
    case "MENU":
      game.mapManager.currentMap.npcs?.forEach((npc) =>
        npc.draw(game.canvas, game.camera)
      );
      game.mapManager.currentMap.missableObjects?.forEach((mo) =>
        mo.draw(game.canvas, game.camera)
      );
      game.player.draw(game.canvas, game.camera);

      drawOverlayTiles(game, tileManager);
      game.dayNightCycle.draw(game.canvas, game.timeManager);
      game.timeManager.draw(game.canvas);
      break;

    case "CHOICE_MENU":
      game.mapManager.currentMap.npcs?.forEach((npc) =>
        npc.draw(game.canvas, game.camera)
      );
      game.mapManager.currentMap.missableObjects?.forEach((mo) =>
        mo.draw(game.canvas, game.camera)
      );
      game.player.draw(game.canvas, game.camera);

      drawOverlayTiles(game, tileManager);
      game.dayNightCycle.draw(game.canvas, game.timeManager);
      game.timeManager.draw(game.canvas);

      game.dialogBox?.draw(game.canvas.context);

      if (!game.isAttemptSave) return;
      game.mainMenu?.draw(game.canvas.context, null);
      break;
  }
};
