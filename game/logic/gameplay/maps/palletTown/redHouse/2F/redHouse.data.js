import { redHouse2FCollide } from "./redHouse.collide.js";
import { redHouse2FLayout } from "./redHouse.layout.js";
import { redHouse2FWarps } from "./redHouse.warp.js";

export const redHouse2F = {
  id: "RED_HOUSE_2F",
  layout: redHouse2FLayout,
  collision: redHouse2FCollide,
  width: redHouse2FCollide[0].length,
  height: redHouse2FCollide.length,
  warps: redHouse2FWarps,
};
