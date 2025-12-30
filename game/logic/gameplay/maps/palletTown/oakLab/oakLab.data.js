import { oakLabCollision } from "./oakLab.collide.js";
import { oakLabLayout } from "./oakLab.layout.js";
import { oakLabWarps } from "./oakLab.warp.js";

export const oakLab = {
  id: "OAK_LAB",
  layout: oakLabLayout,
  collision: oakLabCollision,
  width: oakLabCollision[0].length,
  height: oakLabCollision.length,
  warps: oakLabWarps,
};
