import { WORLDMAP_CONFIG } from "../../../render/config/worldMap/worldMap.config.js";

export const loadTiles = (worldMap) => {
  for (let x = 0; x < WORLDMAP_CONFIG.width; x++) {
    for (let y = 0; y < WORLDMAP_CONFIG.height; y++) {
      const key = `${x},${y}`;
      const img = new Image();
      img.src = `${WORLDMAP_CONFIG.basePath}world_X${x}_Y${y}.png`;
      worldMap.images[key] = img;
    }
  }
};
