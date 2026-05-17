import { Save } from "../../../models/MainMenu/items/Save/save.model.js";

export const loadGame = (game) => {
  const save = Save.loadLS();
  if (!save) return;

  const SAVE_DATA = save.apply(game);
  game.mapManager.loadMap(SAVE_DATA.map.id, SAVE_DATA);
  game.weatherManager.onMapChanged(game.mapManager.currentMap);

  game.player.party.slots.forEach((slot) => {
    slot.initHPbar();
  });

  game.closeTitleScreen();
};
