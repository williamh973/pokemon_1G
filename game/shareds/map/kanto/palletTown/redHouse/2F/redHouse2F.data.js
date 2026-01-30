import { redHouse_2F_Collide } from "./redHouse2F.collide.js";
import { redHouse_2F_Layout } from "./redHouse2F.layout.js";
import { redHouse_2F_Warps } from "./redHouse2F.warp.js";

export const redHouse_2F = {
  id: "RED_HOUSE_2F",
  layout: redHouse_2F_Layout,
  collision: redHouse_2F_Collide,
  width: redHouse_2F_Collide[0].length,
  height: redHouse_2F_Collide.length,
  warps: redHouse_2F_Warps,
};
