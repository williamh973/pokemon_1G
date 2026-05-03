export const getFacingToward = (character, target) => {
  const dx = target.tileX - character.tileX;
  const dy = target.tileY - character.tileY;

  if (Math.abs(dx) > Math.abs(dy)) return dx > 0 ? "right" : "left";
  else return dy > 0 ? "down" : "up";
};
