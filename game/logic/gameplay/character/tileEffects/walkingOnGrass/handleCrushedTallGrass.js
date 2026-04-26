export const handleCrushedTallGrass = (game, character, map, x, y) => {
  const originalIndex = map.backgLayout[y][x];

  if (character.previousTile) {
    const { x: lx, y: ly, originalIndex } = character.previousTile;

    if (map.backgLayout[ly]) map.backgLayout[ly][lx] = originalIndex;
  }
  const backgLayoutTile = character.backgLayoutTile(game, x, y);
  if (backgLayoutTile.name !== "tall_grass") return;

  const crushedIndex = 22;
  const crushedAnimationIndex = 25;
  const crushedOverlayIndex = 9;

  const tileData = game.tileManager.tilesets[crushedAnimationIndex];
  const duration = tileData.frames * tileData.frameDuration;

  setTimeout(() => {
    if (map.overlayLayout[y]) map.overlayLayout[y][x] = crushedOverlayIndex;
  }, duration * (1000 / 60));

  map.backgLayout[y][x] = crushedIndex;
  map.overlayLayout[y][x] = crushedAnimationIndex;

  character.previousTile = { x, y, originalIndex };
};
