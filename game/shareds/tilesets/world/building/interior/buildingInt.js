import { RED_HOUSE_1F } from "../house/redHouse/int/redHouse1F.js";
import { RED_HOUSE_2F } from "../house/redHouse/int/redHouse2F.js";
import { OAKLAB_INT } from "../oak_labo/oakLabInt.js";
import { GLOBALS } from "./globals.tilesets.js";

export const BUILDING_INT = {
  ...OAKLAB_INT, // 3508 - 3551
  ...GLOBALS, //
  ...RED_HOUSE_1F,
  ...RED_HOUSE_2F,
};
