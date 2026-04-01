import { TERRAIN_EXT } from "./exterior/terrainExt.js";
import { TERRAIN_INT } from "./interior/terrainInt.js";

export const TERRAIN = {
  ...TERRAIN_EXT,
  ...TERRAIN_INT,
};
