import { CHARACTER_STATE } from "../../../shareds/utils/character/character.utils.js";
import { TILES_SIZE } from "../../../shareds/utils/tile/tile.utils.js";

export const moveToTile = (character, dx, dy, game) => {
  character.isMoving = true;
  character.state = CHARACTER_STATE.WALK;
  character.step = 1 - character.step;
  character.framesMax = character.frames.walk.max;
  character.image = character.sprites.walk[character.facing][character.step];
  character.moveProgress = 0;

  character.tileX += dx;
  character.tileY += dy;

  character.startX = character.position.x;
  character.startY = character.position.y;

  character.targetX = character.tileX * TILES_SIZE;
  character.targetY = character.tileY * TILES_SIZE;

  if (game.rainSystem?.intensity > 0.3) {
    const footX = character.position.x + game.camera.offsetX + 13;
    const footY = character.position.y + game.camera.offsetY + 30;

    game.splashSystem.spawn(footX, footY);
  }
};
