import { redHouse1F_Collide } from "./redHouse.collide.js";
import { redHouse1F_Interactions } from "./redHouse.interaction.js";
import { redHouse1F_Layout } from "./redHouse.layout.js";
import { redHouse1F_NPCs } from "./redHouse.npc.js";
import { redHouse1F_Warps } from "./redHouse.warp.js";

export const redHouse1F = {
  id: "RED_HOUSE_1F",
  layout: redHouse1F_Layout,
  collision: redHouse1F_Collide,
  interactions: redHouse1F_Interactions,
  width: redHouse1F_Collide[0].length,
  height: redHouse1F_Collide.length,
  warps: redHouse1F_Warps,
  npcs: redHouse1F_NPCs,
};
