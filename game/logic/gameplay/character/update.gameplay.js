import { CHARACTER_STATE } from "../../../shareds/utils/character/character.utils.js";

export const update = (character, game) => {
  if (character.isCanMove && character.isMoving) {
    character.moveProgress++;
    character.animateFrames();

    const t = character.moveProgress / character.moveDuration;
    character.position.x =
      character.startX + (character.targetX - character.startX) * t;
    character.position.y =
      character.startY + (character.targetY - character.startY) * t;

    if (character.moveProgress >= character.moveDuration) {
      character.position.x = character.targetX;
      character.position.y = character.targetY;

      character.isMoving = false;
      character.framesCurrent = 0;
      character.framesMax = character.frames.idle.max;
      character.image = character.sprites.idle[character.facing];

      if (!character.isMoving && character.forcedMovements.length === 0) {
        if (character.movementCallbacks.length > 0) {
          const callBackFn = character.movementCallbacks.shift();
          callBackFn();
        }
      }
    }
  }

  character.state = CHARACTER_STATE.IDLE;

  if (!character.isMoving && character.forcedMovements.length > 0) {
    const nextDirection = character.forcedMovements.shift();

    const directions = {
      up: { dx: 0, dy: -1 },
      down: { dx: 0, dy: 1 },
      left: { dx: -1, dy: 0 },
      right: { dx: 1, dy: 0 },
    };

    const dir = directions[nextDirection];

    character.setFacing(nextDirection);
    character.moveToTile(character, dir.dx, dir.dy, game, null);
  }
};
