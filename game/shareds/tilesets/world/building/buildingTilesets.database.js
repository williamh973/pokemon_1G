import { BUILDING_EXT } from "./exterior/buildingExt.js";
import { BUILDING_INT } from "./interior/buildingInt.js";

export const BUILDINGS = {
  ...BUILDING_EXT,
  ...BUILDING_INT,
};
