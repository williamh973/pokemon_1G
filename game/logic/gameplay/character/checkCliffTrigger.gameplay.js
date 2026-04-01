import { TILE_TYPES } from "../../../shareds/tile/tile.type.js";

export const checkCliffTrigger = (character, game, targetX, targetY) => {
  const targetTile = game.mapManager.currentMap.collision[targetY][targetX];
  const collision = TILE_TYPES[targetTile];
  if (collision.terrain === "cliff")
    if (character.facing === "down") {
      character.startForcedMovement([...Array(2).fill(character.facing)]);
      character.isJumping = true;
    }
};
