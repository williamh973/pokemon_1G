import { BUILDINGS } from "./world/building/buildingTilesets.database.js";
import { PROPS } from "./world/props/props.js";
import { TERRAIN } from "./world/terrain/terrainTilesets.database.js";

export const TILESETS_DATABASE = {
  ...TERRAIN, // 1 - 2000
  ...BUILDINGS, // 2001 - 5000
  ...PROPS, // 5001 -
};
