import { oakLabCollision } from "./oakLab.collide.js";
import { oakLabForegroundLayout } from "./oakLab.foregroundLayout.js";
import { oakLabBGLayout } from "./oakLab.backgLayout.js";
import { OAK_LAB_MISSABLE_OBJECTS } from "./oakLab.missableObject.js";
import { OAKLAB_NPCs } from "./oakLab.npc.js";
import { oakLabOverlayLayout } from "./oakLab.overlayLayout.js";
import { oakLabWarps } from "./oakLab.warp.js";

export const oakLab = {
  id: "OAK_LAB",
  backgLayout: oakLabBGLayout,
  foregroundLayout: oakLabForegroundLayout,
  overlayLayout: oakLabOverlayLayout,
  collision: oakLabCollision,
  width: oakLabCollision[0].length,
  height: oakLabCollision.length,
  warps: oakLabWarps,
  npcs: OAKLAB_NPCs,
  overworldPokemons: [],
  missableObjects: OAK_LAB_MISSABLE_OBJECTS,
  isFlayable: false,
  isIndoor: true,
};
