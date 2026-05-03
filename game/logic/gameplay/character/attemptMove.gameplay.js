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
      (e) => e.entityType === "MO"
    ) ||
    character.isEntityAt(game, targetX, targetY, (e) => e.entityType === "NPC")
  )
    return;

  character.moveToTile(character, dx, dy, game);

  const map = game.mapManager.currentMap;
  const OP_FLYING = map.overworldPokemons?.flying;
  const OP_WALKING = map.overworldPokemons?.walking;

  if (
    character.entityType === "PLAYER" &&
    (OP_FLYING?.length <= 1 || OP_WALKING?.length <= 1)
  )
    game.encounterManager.getEncounter(game, tile, game.timeManager);

  return true;
};
