export const TILES_SIZE = 32;
export const font = "PixelOperator";
export const FADING_TIME = 10;

export const PLAYER_STATE = {
  IDLE: "idle",
  WALK: "walk",
  RUN: "run",
  SURF: "surf",
  FISH: "fish",
  FLY: "fly",
  TELEPORT: "teleport",
};

export const PLAYER_ABILITIES = {
  surf: false,
  fish: false,
  cut: false,
  smash: false,
  fly: false,
  teleport: false,
};

export const createImg = (path) => {
  const image = new Image();
  image.src = path;
  return image;
};

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
export const drawBox = (context, positionX, positionY, width, height) => {
  const borderColor = "black";
  context.fillStyle = "white";
  context.fillRect(positionX, positionY, width, height);

  context.strokeStyle = borderColor;
  context.lineWidth = 2;
  context.strokeRect(positionX, positionY, width, height);
};
