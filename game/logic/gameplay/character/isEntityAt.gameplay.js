export const isEntityAt = (game, x, y, filterFn = null, character) => {
  const entities = game.mapManager.getEntities(game.mapManager.currentMap);

  return entities.some((entity) => {
    if (entity === character) return false;

    if (filterFn && !filterFn(entity)) return false;

    return entity.tileX === x && entity.tileY === y;
  });
};
