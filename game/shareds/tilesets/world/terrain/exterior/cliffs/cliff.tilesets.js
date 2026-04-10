import { EARTH_LITTLE_CLIFF } from "./brownCliff.tilesets.js";
import { GRASS_LITTLE_CLIFF } from "./greenCliff.tilesets.js";

export const CLIFF_TILESETS = {
  ...GRASS_LITTLE_CLIFF, // 120 - 122
  ...EARTH_LITTLE_CLIFF, // 123 - 125

  126: {
    name: "little_cliff_bottom_w_sand_w_inner_grass_left",
    type: "background",
    src: "game/assets/images/tilesets/world/terrain/cliff/grassWithSand/little_cliff_bottom_w_sand_w_inner_grass_left.png",
  },
  127: {
    name: "little_cliff_bottom_w_sand",
    type: "background",
    src: "game/assets/images/tilesets/world/terrain/cliff/sand/little_cliff_bottom_w_sand.png",
  },
  128: {
    name: "little_cliff_inner_bottom_right_w_grass",
    type: "background",
    src: "game/assets/images/tilesets/world/terrain/cliff/grass/little_cliff_inner_bottom_right_w_grass.png",
  },
  129: {
    name: "little_cliff_inner_bottom_left_w_grass",
    type: "background",
    src: "game/assets/images/tilesets/world/terrain/cliff/grass/little_cliff_inner_bottom_left_w_grass.png",
  },
  130: {
    name: "little_cliff_inner_bottom_right_w_grass_left",
    type: "background",
    src: "game/assets/images/tilesets/world/terrain/cliff/grassWithSand/little_cliff_inner_bottom_right_w_grass_left.png",
  },
  131: {
    name: "little_cliff_inner_bottom_left_w_grass_right",
    type: "background",
    src: "game/assets/images/tilesets/world/terrain/cliff/grassWithSand/little_cliff_inner_bottom_left_w_grass_right.png",
  },

  132: {
    name: "little_cliff_bottom_w_sand_w_inner_grass_right",
    type: "background",
    src: "game/assets/images/tilesets/world/terrain/cliff/grassWithSand/little_cliff_bottom_w_sand_w_inner_grass_right.png",
  },
};
