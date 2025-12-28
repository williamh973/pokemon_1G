import { redHouse1FCollide } from "./redHouse.collide.js";
import { redHouse1FLayout } from "./redHouse.layout.js";

export const redHouse1F = {
  id: "RED_HOUSE_1F",
  layout: redHouse1FLayout,
  collision: redHouse1FCollide,
  width: redHouse1FCollide[0].length,
  height: redHouse1FCollide.length,
};
