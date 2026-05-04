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
    character.checkCliffTrigger(game, tile) ||
    !tile.walkable ||
    character.isPlayerAt(game, targetX, targetY) ||
    character.isEntityAt(
      game,
      targetX,
      targetY,
      (e) => e.entityType === "NPC",
      character
    ) ||
    character.isEntityAt(
      game,
      targetX,
      targetY,
      (e) => e.entityType === "MO",
      character
    )
  )
    return;

  const targetOp = character.isEntityAt(
    game,
    targetX,
    targetY,
    (e) => e.entityType === "OP",
    character
  );

  if (targetOp) return console.log("battle");

  const OP = game.mapManager.currentMap.overworldPokemons;

  if (character.entityType === "PLAYER" && OP.length <= 2)
    game.encounterManager.getEncounter(game, tile, game.timeManager);

  character.moveToTile(character, dx, dy, game);

  return true;
};
