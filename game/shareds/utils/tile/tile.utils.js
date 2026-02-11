export const TILES_SIZE = 32;

export const drawDebugCollisionSquare = (element, context, enabled) => {
  if (!enabled) return;

  if (element && context) {
    context.beginPath();
    context.strokeStyle = "red";
    context.lineWidth = 1;

    context.rect(
      element.position.x,
      element.position.y,
      element.width,
      element.height
    );

    context.stroke();
  }
};
