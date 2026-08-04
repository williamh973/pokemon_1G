import { WORLDMAP_CONFIG } from "../../../render/config/worldMap/worldMap.config.js";

export const drawOverlays = (context, area, worldMap) => {
  context.fillStyle = `rgba(255, 0, 0, ${worldMap.blinkOpacity})`;
  context.fillRect(
    area.x * WORLDMAP_CONFIG.tileSize,
    area.y * WORLDMAP_CONFIG.tileSize,
    (area.w * WORLDMAP_CONFIG.tileSize) / 2, // area contient les coordonnées de la map :   export const palletTownWorldMap = {   pokemonNest: { x: 3, y: 7.5, w: 1, h: 1 },  playerPosition: { x: 2.95, y: 7.4 },};

    (area.h * WORLDMAP_CONFIG.tileSize) / 2
  );
};
