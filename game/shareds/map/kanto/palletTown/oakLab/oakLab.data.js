import { oakLabCollision } from "./oakLab.collide.js";
import { oakLabLayout } from "./oakLab.layout.js";
import { OAK_LAB_MISSABLE_OBJECTS } from "./oakLab.missableObject.js";
import { OAKLAB_NPCs } from "./oakLab.npc.js";
import { oakLabWarps } from "./oakLab.warp.js";

export const oakLab = {
  id: "OAK_LAB",
  layout: oakLabLayout,
  collision: oakLabCollision,
  width: oakLabCollision[0].length,
  height: oakLabCollision.length,
  warps: oakLabWarps,
  npcs: OAKLAB_NPCs,
  missableObjects: OAK_LAB_MISSABLE_OBJECTS,
  isFlayable: false,
  isIndoor: true,
};
