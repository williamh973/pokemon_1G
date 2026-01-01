import { TILES_SIZE } from "../../../../shareds/utils.js";
import { palletTownWarps } from "./palletTown.warp.js";
import { palletTownCollide } from "./palletTown.collide.js";
import { palletTownInteractions } from "./palletTown.interaction.js";
import { palletTownLayout } from "./palletTown.layout.js";

export const palletTown = {
  id: "PALLET_TOWN",
  layout: palletTownLayout,
  collision: palletTownCollide,
  interactions: palletTownInteractions,
  width: palletTownCollide[0].length,
  height: palletTownCollide.length,
  warps: palletTownWarps,
};
