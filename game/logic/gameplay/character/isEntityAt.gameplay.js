export const isEntityAt = (game, x, y, filterFn, character) => {
  const entities = game.mapManager.getEntities(game.mapManager.currentMap);

  return entities.find((entity) => {
    if (entity === character) return false;

    if (filterFn && !filterFn(entity)) return false;

    return entity.tileX === x && entity.tileY === y;
  });
};
