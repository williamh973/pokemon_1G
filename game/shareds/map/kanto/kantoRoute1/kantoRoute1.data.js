import { kantoRoute1Collide } from "./kantoRoute1.collide.js";
import { kantoRoute1Encounters } from "./kantoRoute1.encounter.js";
import { kantoRoute1Interactions } from "./kantoRoute1.interaction.js";
import { kantoRoute1Layout } from "./kantoRoute1.layout.js";
import { KANTO_ROUTE_1_NPCS } from "./kantoRoute1.npc.js";
import { kantoRoute1Warps } from "./kantoRoute1.warp.js";

export const kantoRoute1 = {
  id: "KANTO_ROUTE_1",
  layout: kantoRoute1Layout,
  collision: kantoRoute1Collide,
  interactions: kantoRoute1Interactions,
  width: kantoRoute1Collide[0].length,
  height: kantoRoute1Collide.length,
  warps: kantoRoute1Warps,
  encounter: kantoRoute1Encounters,
  worldMap: { x: 3, y: 5, w: 1, h: 3 },
  flyable: false,
  npcs: KANTO_ROUTE_1_NPCS,
};
