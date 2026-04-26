export const checkCliffTrigger = (targetTile, character) => {
  if (
    targetTile.terrain === "cliff_down" &&
    character.facing === targetTile.direction
  ) {
    character.startForcedMovement([...Array(2).fill(targetTile.direction)]);
    character.isJumping = true;
  }
};
