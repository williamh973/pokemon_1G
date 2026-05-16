import { Save } from "../../../models/MainMenu/items/Save/save.model.js";

export const loadGame = (game) => {
  const save = Save.loadLS();
  if (!save) return;

  const SAVE_DATA = save.apply(game);
  game.mapManager.loadMap(SAVE_DATA.map.id, SAVE_DATA);
  game.weatherManager.onMapChanged(game.mapManager.currentMap);
  const slotsFromSave = SAVE_DATA.player.party.slots;
  console.log(game.player.party.slots);
  game.closeTitleScreen();
};
