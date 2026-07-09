import { createImg } from "../../../../shareds/utils/assets/assets.utils.js";

export const TYPES_CONFIG = {
  dimensions: {
    width: 32,
    height: 12,
    scale: 1.1,
  },
  BUG: {
    image: createImg("game/assets/images/types/bug.png"),
  },
  GRASS: {
    image: createImg("game/assets/images/types/grass.png"),
  },
  POISON: {
    image: createImg("game/assets/images/types/poison.png"),
  },
  NORMAL: {
    image: createImg("game/assets/images/types/normal.png"),
  },
  FLIGHT: {
    image: createImg("game/assets/images/types/flying.png"),
  },
  INSECT: {
    image: createImg("game/assets/images/types/insect.png"),
  },
  ROCK: {
    image: createImg("game/assets/images/types/rock.png"),
  },
  FIRE: {
    image: createImg("game/assets/images/types/fire.png"),
  },
};
