import { BUILDING_EXT } from "./exterior/buildingExt.js";
import { BUILDING_INT } from "./interior/buildingInt.js";

export const BUILDINGS = {
  ...BUILDING_EXT, //2001 - 3500
  ...BUILDING_INT, // 3501 - 5000
};
