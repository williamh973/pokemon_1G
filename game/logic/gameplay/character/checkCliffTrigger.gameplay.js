export const checkCliffTrigger = (game, targetTile, character) => {
  if (
    targetTile.terrain === "cliff_down" &&
    character.facing === targetTile.direction
  ) {
    // const shadowIndex = 6008;

    // const map = game.mapManager.currentMap;

    // map.overlayLayout[character.tileY][character.tileX] = shadowIndex;
    // console.log(map.overlayLayout[character.tileY][character.tileX]);

    character.startForcedMovement([...Array(2).fill(targetTile.direction)]);
    character.isJumping = true;

    // 6008; l'index du tileset de l'ombre du joueur
  }
};
