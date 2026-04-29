import { PUDDLE_TILESETS } from "./ground/puddle/puddle.tilesets.js";

export const WATER_TILESETS = {
  166: {
    name: "light_blue_water_top_left",
    type: "water",
    src: "game/assets/images/tilesets/world/terrain/water/light_blue_water_top_left.png",
  },
  167: {
    name: "light_blue_water_top_center",
    type: "ground",
    src: "game/assets/images/tilesets/world/terrain/water/light_blue_water_top_center.png",
  },
  168: {
    name: "light_blue_water_top_right",
    type: "ground",
    src: "game/assets/images/tilesets/world/terrain/water/light_blue_water_top_right.png",
  },
  169: {
    name: "light_blue_water_middle_left",
    type: "ground",
    src: "game/assets/images/tilesets/world/terrain/water/light_blue_water_middle_left.png",
  },
  170: {
    name: "light_blue_water_middle_center",
    type: "ground",
    src: "game/assets/images/tilesets/world/terrain/water/light_blue_water_middle_center.png",
  },
  171: {
    name: "light_blue_water_middle_right",
    type: "ground",
    src: "game/assets/images/tilesets/world/terrain/water/light_blue_water_middle_right.png",
  },
  172: {
    name: "sea",
    type: "background",
    src: "game/assets/images/tilesets/world/terrain/water/sea.png",
    animated: true,
    frames: 8,
    frameDuration: 30,
  },
  173: {
    name: "sea_border_top_right",
    type: "background",
    src: "game/assets/images/tilesets/world/terrain/water/sea_border_top_right.png",
    animated: true,
    frames: 8,
    frameDuration: 30,
  },
  174: {
    name: "sea_border_top_left",
    type: "background",
    src: "game/assets/images/tilesets/world/terrain/water/sea_border_top_left.png",
    animated: true,
    frames: 8,
    frameDuration: 30,
  },
  175: {
    name: "sea_border_left",
    type: "background",
    src: "game/assets/images/tilesets/world/terrain/water/sea_border_left.png",
    animated: true,
    frames: 8,
    frameDuration: 30,
  },
  176: {
    name: "sea_border_right",
    type: "background",
    src: "game/assets/images/tilesets/world/terrain/water/sea_border_right.png",
    animated: true,
    frames: 8,
    frameDuration: 30,
  },
  177: {
    name: "sea_border_top",
    type: "background",
    src: "game/assets/images/tilesets/world/terrain/water/sea_border_top.png",
    animated: true,
    frames: 8,
    frameDuration: 30,
  },

  ...PUDDLE_TILESETS, // 180 -
};
