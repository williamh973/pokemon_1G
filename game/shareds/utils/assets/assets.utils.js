export const createImg = (path) => {
  const image = new Image();
  image.src = path;
  return image;
};

export const createSong = (path) => {
  const audio = new Audio();
  audio.src = path;
  return audio;
};
