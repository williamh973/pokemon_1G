import { GRASS_W_CUFF } from "./grassWithCuff.tilesets.js";
import { GRASS_W_FLOWER } from "./grassWithFlower.tilesets.js";
import { GRASS_W_SHADOW } from "./grassWithShadow.tilesets.js";
import { TALL_GRASS } from "./tallGrass.tilesets.js";

export const GRASS_TILESETS = {
  ...GRASS_W_CUFF, // 12 - 15
  ...GRASS_W_SHADOW, // 16 - 19
  ...GRASS_W_FLOWER, // 20
  ...TALL_GRASS, // 21 - 24
  25: {
    name: "mown_grass",
    type: "background",
    src: "game/assets/images/tilesets/world/terrain/grass/mown_grass.png",
  },
  26: {
    name: "wet_grass",
    type: "background",
    src: "game/assets/images/tilesets/world/terrain/grass/wet_grass.png",
  },
};
