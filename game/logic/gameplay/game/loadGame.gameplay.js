import { Save } from "../../../models/MainMenu/items/Save/save.model.js";

export const loadGame = (game) => {
  const save = Save.loadLS();
  if (!save) return;

  const data = save.apply(game);
  // console.log(data);
  game.mapManager.loadMap(data.map.id, data);
  game.mapManager.getSavedWeather(game);
  game.closeTitleScreen();
};
