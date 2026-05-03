export const getFrontTile = (character) => {
  let x = character.tileX;
  let y = character.tileY;

  if (character.facing === "up") y--;
  if (character.facing === "down") y++;
  if (character.facing === "left") x--;
  if (character.facing === "right") x++;

  return { x, y };
};
