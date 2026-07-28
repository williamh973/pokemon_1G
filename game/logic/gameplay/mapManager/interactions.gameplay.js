import { SURF_DIALOG_TREE } from "../../../shareds/dialogTree/trees/surf.dialogTree.js";

export const checkInteractions = (game, player) => {
  const MAP = game.mapManager.currentMap;
  const party = player.party;

  const frontTileCoords = player.getFrontTile();

  const frontTileCollide = getFrontTileCollide(MAP, frontTileCoords);

  if (!frontTileCollide) return;

  const foundedPokemonLearnedSurf = party.slots
    .find((slot) => slot)
    .content?.moves?.find((move) => move.id === "surf");

  const isSurfPossible = checkSurfCanPossible(
    game,
    frontTileCollide,
    foundedPokemonLearnedSurf
  );
  if (isSurfPossible) return;

  const staticInt = interactiveElement(MAP, frontTileCoords);
  if (staticInt) return sign(game, staticInt, player);

  const missableObj = MO(MAP, frontTileCoords);
  if (missableObj) return missableObj.interact(game);

  const npc = NPC(MAP, frontTileCoords);
  if (npc) return npc.interact(game);
};

const getFrontTileCollide = (MAP, frontTileCoords) => {
  return MAP.collision[frontTileCoords.y][frontTileCoords.x];
};

export const checkSurfCanPossible = (
  game,
  frontTileCollide,
  foundedPokemonLearnedSurf
) => {
  if (frontTileCollide === 5) {
    if (foundedPokemonLearnedSurf) {
      game.openDialogBox("L'eau est calme, utiliser\nsurf ?", SURF_DIALOG_TREE);
    } else return game.openDialogBox("L'eau est calme");
  }
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
  ) {
    const text =
      typeof staticInt.text === "function"
        ? staticInt.text(game)
        : staticInt.text;

    game.openDialogBox(text);
  }
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
