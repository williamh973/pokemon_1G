import { palletTownWarps } from "./palletTown.warp.js";
import { palletTownCollide } from "./palletTown.collide.js";
import { palletTownInteractions } from "./palletTown.interaction.js";
import { palletTownLayout } from "./palletTown.layout.js";
import { PALLET_TOWN_NPCs } from "./palletTown.npc.js";

export const palletTown = {
  id: "PALLET_TOWN",
  layout: palletTownLayout,
  collision: palletTownCollide,
  interactions: palletTownInteractions,
  width: palletTownCollide[0].length,
  height: palletTownCollide.length,
  warps: palletTownWarps,
  worldMap: { x: 3, y: 6.5, w: 1, h: 1 },
  flyable: true,
  npcs: PALLET_TOWN_NPCs,
};
