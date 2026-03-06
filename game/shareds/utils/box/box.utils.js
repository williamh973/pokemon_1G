export const drawBox = (
  context,
  positionX,
  positionY,
  width,
  height,
  color,
  fillStyle
) => {
  const borderColor = color;
  context.fillStyle = fillStyle;
  context.fillRect(positionX, positionY, width, height);

  context.strokeStyle = borderColor;
  context.lineWidth = 2;
  context.strokeRect(positionX, positionY, width, height);
};
