export const applySaveDatas = (game, save) => {
  const SAVE_DATA = save.apply(game);

  game.mapManager.loadMap(SAVE_DATA.map.id, SAVE_DATA);
  game.weatherManager.onMapChanged(game.mapManager.currentMap);

  game.player.party.slots.forEach((slot) => {
    slot.initHPbar();
  });

  return true;
};
