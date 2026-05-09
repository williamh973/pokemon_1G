export const draw = (canvas, camera, character) => {
  const screenX = character.position.x + camera.offsetX + 2;
  let screenY = character.position.y + camera.offsetY;
  const frameWidth = character.image.width / character.framesMax;

  if (character.movementType === "fly") screenY -= 15;

  canvas.context.drawImage(
    character.image,
    character.framesCurrent * frameWidth,
    0,
    frameWidth,
    character.image.height,
    screenX,
    screenY,
    character.width,
    character.height
  );
};
