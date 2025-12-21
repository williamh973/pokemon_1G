import { TILES_SIZE } from "../../../../shareds/utils.js";
import { palletTownCollide } from "./palletTown.collide.js";
import { palletTownLayout } from "./palletTown.layout.js";

export const palletTown = {
  id: "PALLET_TOWN",
  layout: palletTownLayout,
  collision: palletTownCollide,
  width: palletTownCollide[0].length,
  height: palletTownCollide.length,
  tileSize: TILES_SIZE,
};
