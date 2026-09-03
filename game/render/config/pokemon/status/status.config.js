import { createImg } from "../../../../shareds/utils/assets/assets.utils.js";

export const STATUS_CONFIG = {
  dimensions: {
    width: 20,
    height: 8,
    scale: 1.3,
  },
  BURN: {
    image: createImg("game/assets/images/status/burn.png"),
  },
  PARALYSIS: {
    image: createImg("game/assets/images/status/par.png"),
  },
  POISON: {
    image: createImg("game/assets/images/status/poison.png"),
  },
  SLEEP: {
    image: createImg("game/assets/images/status/slp.png"),
  },
  FREEZE: {
    image: createImg("game/assets/images/status/frz.png"),
  },
};
