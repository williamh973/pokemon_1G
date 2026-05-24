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
  if (
    game.mapManager.currentMap.puddlesLayout &&
    game.weatherManager.rainSystem?.active
  ) {
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

const npcs = (game) => {
  game.mapManager.currentMap.npcs?.forEach((npc) =>
    npc.draw(game.canvas, game.camera)
  );
};

const MO = (game) => {
  game.mapManager.currentMap.missableObjects?.forEach((mo) =>
    mo.draw(game.canvas, game.camera)
  );
};

const drawWalkingOP = (game) => {
  const allOP = game.mapManager.currentMap.overworldPokemons ?? [];

  allOP
    .filter((op) => op.movementType !== "fly")
    .forEach((op) => op.draw(game.canvas, game.camera));
};

const drawFlyingOP = (game) => {
  const allOP = game.mapManager.currentMap.overworldPokemons ?? [];

  allOP
    .filter((op) => op.movementType === "fly")
    .forEach((op) => op.draw(game.canvas, game.camera));
};

const player = (game) => {
  game.player.draw(game.canvas, game.camera);
};

const dayNightCycle = (game) => {
  game.dayNightCycle.draw(game);
};

const timeManager = (game) => {
  game.timeManager.draw(game.canvas.context);
};

const mainMenu = (game) => {
  game.mainMenu?.draw(game.canvas.context, null);
};

export const draw = (game, tileManager) => {
  drawBackTiles(game, tileManager);
  drawPuddleTiles(game, tileManager);
  drawForegroundTiles(game, tileManager);

  switch (game.state) {
    case "WORLD":
      npcs(game);
      MO(game);
      drawWalkingOP(game);
      player(game);
      drawOverlayTiles(game, tileManager);
      drawFlyingOP(game);
      dayNightCycle(game);
      timeManager(game);
      break;
    case "DIALOG":
      npcs(game);
      MO(game);
      drawWalkingOP(game);
      player(game);
      drawOverlayTiles(game, tileManager);
      drawFlyingOP(game);
      dayNightCycle(game);
      timeManager(game);

      if (!game.isAttemptSave) return;
      mainMenu(game);

      break;
    case "PLAYER_MENU":
      npcs(game);
      MO(game);
      drawWalkingOP(game);
      player(game);
      drawOverlayTiles(game, tileManager);
      drawFlyingOP(game);
      dayNightCycle(game);
      timeManager(game);
      break;

    case "CHOICE_MENU":
      npcs(game);
      MO(game);
      drawWalkingOP(game);
      player(game);
      drawOverlayTiles(game, tileManager);
      drawFlyingOP(game);
      dayNightCycle(game);
      timeManager(game);

      game.dialogBox?.draw(game.canvas.context);

      if (!game.isAttemptSave) return;
      mainMenu(game);
      break;
  }
};
