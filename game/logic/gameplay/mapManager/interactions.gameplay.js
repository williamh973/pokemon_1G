export const checkInteractions = (game, player) => {
  const MAP = game.mapManager.currentMap;
  const FRONT_TILE = player.getFrontTile();

  const staticInt = interactiveElement(MAP, FRONT_TILE);
  if (staticInt) return sign(game, staticInt, player);

  const missableObj = MO(MAP, FRONT_TILE);
  if (missableObj) return missableObj.interact(game);

  const npc = NPC(MAP, FRONT_TILE);
  if (npc) return npc.interact(game);
};

export const interactiveElement = (currentMap, front) => {
  if (currentMap.interactions) {
    const interaction = currentMap.interactions.find(
      (i) => i.tile.x === front.x && i.tile.y === front.y
    );
    return interaction;
  }
};

export const sign = (game, staticInt, player) => {
  if (
    staticInt.type === "sign" &&
    player.facing === staticInt.facing[player.facing]
  )
    game.openDialogBox(staticInt.text);
};

export const MO = (currentMap, front) => {
  return currentMap.missableObjects?.find(
    (missableObj) =>
      missableObj.tileX === front.x && missableObj.tileY === front.y
  );
};

export const NPC = (currentMap, front) => {
  return currentMap.npcs?.find(
    (npc) => npc.tileX === front.x && npc.tileY === front.y
  );
};
