export const TILES_SIZE = 32;

export const createImg = (path) => {
  const image = new Image();
  image.src = path;
  return image;
};
