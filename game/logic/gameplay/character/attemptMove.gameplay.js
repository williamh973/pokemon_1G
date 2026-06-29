const checkSolidAt = (game, tile, character, targetX, targetY) => {
  return (
    !tile.walkable ||
    character.checkCliffTrigger(game, tile) ||
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
  );
};

const checkOPAt = (game, character, targetX, targetY) => {
  return character.isEntityAt(
    game,
    targetX,
    targetY,
    (e) => e.entityType === "OP",
    character
  );
};

const attemptEncounterWildPokemon = (game, character, tile) => {
  const MAP = game.mapManager.currentMap;
  const OP = MAP.overworldPokemons;
  const maxOP = MAP.maxOP;

  if (character.entityType === "PLAYER" && tile.encounter && OP.length <= maxOP)
    game.encounterManager.tryDoWildEncounter(game, tile, game.timeManager);
};

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

  const isSolidAt = checkSolidAt(game, tile, character, targetX, targetY);
  if (isSolidAt) return;

  const targetOP = checkOPAt(game, character, targetX, targetY);
  if (targetOP)
    return game.encounterManager.startWildBattle(game, targetOP, tile);

  attemptEncounterWildPokemon(game, character, tile);

  character.moveToTile(character, dx, dy, game);

  return true;
};
