import { EARTH_BORDER_TILESETS } from "../earth/earth.tilesets.js";
import { MOWN_GRASS_BORDERS_TILESETS } from "./lightGreenPath.tilesets.js";
import { SAND_BORDER_TILESETS } from "./sand.tilesets.js";
import { WET_GREEN_BORDERS_TILESETS } from "./wetGreenPath.tilesets.js";

export const BORDERS_TILESETS = {
  ...EARTH_BORDER_TILESETS, // 29 -38
  ...MOWN_GRASS_BORDERS_TILESETS, // 39-60
  ...WET_GREEN_BORDERS_TILESETS, // 61 -64
  ...SAND_BORDER_TILESETS, // 65 - 76
};
