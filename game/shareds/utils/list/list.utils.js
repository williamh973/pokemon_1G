export const listSort = (listFilter) => {
  return listFilter.sort((a, b) => a.name.localeCompare(b.name));
};

export const resetList = (list) => {
  list.length = 0;
};

export const removeMObyItemId = (currentMap, itemId) => {
  return currentMap.missableObjects.filter((item) => {
    return item.itemId !== itemId;
  });
};

export const removeMObyFlagId = (game, flagId) => {
  return game.mapManager.currentMap.missableObjects.filter((item) => {
    return item.flagId !== flagId;
  });
};
