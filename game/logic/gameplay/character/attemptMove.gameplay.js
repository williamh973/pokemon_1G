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

  if (
    character.checkCliffTrigger(game, targetX, targetY) ||
    !character.walkableTile(game, targetX, targetY) ||
    character.npcInFrontOfPlayer(game, targetX, targetY) ||
    character.moInFrontOfPlayer(game, targetX, targetY) ||
    character.playerInFrontOfPnc(game, targetX, targetY)
  )
    return;

  character.moveToTile(dx, dy, game);

  return true;
};
