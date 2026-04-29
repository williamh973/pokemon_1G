import { BUILDINGS } from "./world/building/buildingTilesets.database.js";
import { EFFECTS } from "./world/effect/effect.tilesets.js";
import { PROPS } from "./world/props/props.js";
import { TERRAIN } from "./world/terrain/terrainTilesets.database.js";

export const TILESETS_DATABASE = {
  ...TERRAIN, // 1 - 2000
  ...BUILDINGS, // 2001 - 5000
  ...PROPS, // 5001 - 6000
  ...EFFECTS, // 6001 - 7000
};
