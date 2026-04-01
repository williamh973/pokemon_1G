import { EARTH_BORDER_TILESETS } from "../sand/earth.tilesets.js";
import { LIGHT_GREEN_BORDERS_TILESETS } from "./lightGreenPath.tilesets.js";
import { WET_GREEN_BORDERS_TILESETS } from "./wetGreenPath.tilesets.js";

export const BORDERS_TILESETS = {
  ...EARTH_BORDER_TILESETS, // 29 -38
  ...LIGHT_GREEN_BORDERS_TILESETS, // 39-53
  ...WET_GREEN_BORDERS_TILESETS, // 54 -57
};
