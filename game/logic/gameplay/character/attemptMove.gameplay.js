export const attemptMove = (character, dx, dy, game) => {
  if (
    character.isMoving ||
    character.forcedMovements.length > 0 ||
    game.isPaused
  )
    return;

  character.setFacing(character.getFacingFromDelta(dx, dy));
  character.updateSprite();

  const targetX = character.tileX + dx;
  const targetY = character.tileY + dy;

  if (game.mapManager.checkWarp(character, false)) return;

  if (character.outOfMap(targetX, targetY, game.mapManager.currentMap)) return;

  const tile = character.walkableTile(game, targetX, targetY);
  if (
    character.checkCliffTrigger(game, targetX, targetY) ||
    !tile.walkable ||
    character.npcInFrontOfPlayer(game, targetX, targetY) ||
    character.moInFrontOfPlayer(game, targetX, targetY) ||
    character.playerInFrontOfPnc(game, targetX, targetY)
  )
    return;

  character.moveToTile(character, dx, dy, game);

  return true;
};
