import { WORLDMAP_CONFIG } from "../../../render/config/worldMap/worldMap.config.js";

export const drawWorldMap = (context, worldMap) => {
  for (let x = 0; x < WORLDMAP_CONFIG.width; x++) {
    for (let y = 0; y < WORLDMAP_CONFIG.height; y++) {
      const key = `${x},${y}`;
      const img = worldMap.images[key];

      if (!img) continue;

      context.drawImage(
        img,
        worldMap.position.x + x * WORLDMAP_CONFIG.tileSize,
        worldMap.position.y + y * WORLDMAP_CONFIG.tileSize,
        WORLDMAP_CONFIG.tileSize,
        WORLDMAP_CONFIG.tileSize
      );
    }
  }
};
