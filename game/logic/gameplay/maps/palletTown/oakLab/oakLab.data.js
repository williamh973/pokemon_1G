import { oakLabCollision } from "./oakLab.collide";
import { oakLabLayout } from "./oakLab.layout";

export const oakLab = {
  layout: oakLabLayout,
  collision: oakLabCollision,
  width: oakLabCollision[0].length,
  height: oakLabCollision.length,
};
