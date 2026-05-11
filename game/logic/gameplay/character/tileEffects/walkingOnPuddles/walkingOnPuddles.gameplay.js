export const walkingOnPuddles = (game, character, map, x, y) => {
  if (!map.puddlesLayout) return;

  const puddlesLayoutTile = character.getTileData(
    game,
    x,
    y,
    map.puddlesLayout
  );

  if (!puddlesLayoutTile) return;

  const possibleTileNames = [
    "puddle_right",
    "puddle_little",
    "puddle_border_top_right",
    "puddle_border_top_left",
    "puddle_border_bottom_left",
    "puddle_border_bottom_right",
    "puddle_any_border",
    "puddle_left",
  ];

  const footX = character.position.x + game.camera.offsetX + 13;
  const footY = character.position.y + game.camera.offsetY + 30;

  const playerWalkingOnPuddleTile = possibleTileNames.includes(
    puddlesLayoutTile.name
  );

  const spawnSplash = setTimeout(() => {
    game.weatherManager.splashSystem.spawn(footX, footY);
    clearTimeout(spawnSplash);
  }, 200);

  if (game.weatherManager.rainSystem?.active && playerWalkingOnPuddleTile)
    spawnSplash;
};
