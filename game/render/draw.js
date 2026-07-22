import { GAME_STATES } from "../logic/gameplay/game/states/states.gameplay.js";

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

export const draw = (game, tileManager) => {
  drawBackTiles(game, tileManager);
  drawPuddleTiles(game, tileManager);
  drawForegroundTiles(game, tileManager);

  switch (game.state) {
    case GAME_STATES.WORLD:
      npcs(game);
      MO(game);
      player(game);
      drawWalkingOP(game);
      drawOverlayTiles(game, tileManager);
      drawFlyingOP(game);
      break;
    case "DIALOG":
      npcs(game);
      MO(game);
      player(game);
      drawWalkingOP(game);
      drawOverlayTiles(game, tileManager);
      drawFlyingOP(game);
      break;
    case GAME_STATES.PLAYER_MENU:
      npcs(game);
      MO(game);
      player(game);
      drawWalkingOP(game);
      drawOverlayTiles(game, tileManager);
      drawFlyingOP(game);
      break;

    case GAME_STATES.CHOICE_MENU:
      npcs(game);
      MO(game);
      player(game);
      drawWalkingOP(game);
      drawOverlayTiles(game, tileManager);
      drawFlyingOP(game);

      game.dialogBox?.draw(game.canvas.context);
      break;
  }
};
