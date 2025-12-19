import { palletTownCollide } from "./palletTown.collide.js";
import { palletTownLayout } from "./palletTown.layout.js";

export const palletTown = {
  layout: palletTownLayout,
  collision: palletTownCollide,
  width: palletTownCollide[0].length,
  height: palletTownCollide.length,
};
