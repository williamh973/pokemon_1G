import { WORLDMAP_CONFIG } from "../../../render/config/worldMap/worldMap.config.js";

export const showPlayer = (context, playerCurrentPosition, worldMap) => {
  worldMap.drawInfos(context, "20", "rgb(255, 255, 255, 0.9)");

  if (!worldMap.isPlayerVisible) return;

  const playerSprite = worldMap.game.player.isOnBike
    ? worldMap.possiblePlayerImages.bikeIdleDown
    : worldMap.possiblePlayerImages.idleDown;

  context.drawImage(
    playerSprite,
    playerCurrentPosition.x,
    playerCurrentPosition.y,
    playerSprite.width,
    playerSprite.height
  );
};
