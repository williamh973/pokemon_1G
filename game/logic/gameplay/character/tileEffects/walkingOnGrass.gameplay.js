export const walkingOnTallGrass = (game, character) => {
  const crushedIndex = 22;
  const map = game.mapManager.currentMap.backgLayout;
  const x = character.tileX;
  const y = character.tileY;
  const backgLayoutTile = character.backgLayoutTile(game, x, y);

  if (character.previousTile) {
    const { x: lx, y: ly, originalIndex } = character.previousTile;

    if (map[ly]) map[ly][lx] = originalIndex;
  }

  if (backgLayoutTile.name !== "tall_grass") return;

  const originalIndex = map[y][x];

  map[y][x] = crushedIndex;

  character.previousTile = { x, y, originalIndex };
};
