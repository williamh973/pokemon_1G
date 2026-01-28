import { redHouse1FCollide } from "./redHouse.collide.js";
import { redHouse1FInteractions } from "./redHouse.interaction.js";
import { redHouse1FLayout } from "./redHouse.layout.js";
import { redHouse1FNPCs } from "./redHouse.npc.js";
import { redHouse1FWarps } from "./redHouse.warp.js";

export const redHouse1F = {
  id: "RED_HOUSE_1F",
  layout: redHouse1FLayout,
  collision: redHouse1FCollide,
  interactions: redHouse1FInteractions,
  width: redHouse1FCollide[0].length,
  height: redHouse1FCollide.length,
  warps: redHouse1FWarps,
  npcs: redHouse1FNPCs,
};
