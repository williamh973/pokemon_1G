import { GRASS_TILESETS } from "./grass/grass.tilesets.js";
import { BORDERS_TILESETS } from "./borders/borders.tilesets.js";

export const GROUND_TILESETS = {
  ...GRASS_TILESETS,
  27: {
    name: "sand",
    type: "background",
    src: "game/assets/images/tilesets/world/terrain/sand/sand.png",
  },
  28: {
    name: "earth",
    type: "background",
    src: "game/assets/images/tilesets/world/terrain/earth/earth.png",
  },

  ...BORDERS_TILESETS,
};
