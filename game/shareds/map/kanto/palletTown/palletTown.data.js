import { palletTownWarps } from "./palletTown.warp.js";
import { palletTownCollide } from "./palletTown.collide.js";
import { palletTownInteractions } from "./palletTown.interaction.js";
import { palletTownLayout } from "./palletTown.layout.js";
import { PALLET_TOWN_NPCs } from "./palletTown.npc.js";
import { palletTownOverlayLayout } from "./oakLab/palletTown.overlayLayout.js";
import { PALLET_TOWN_MISSABLES_OBJECTS } from "./palletTown.missableObjects.js";

export const palletTown = {
  id: "PALLET_TOWN",
  mapNameWindow: "Bourg Palette",
  weathers: ["rain", "sun"],
  backgLayout: palletTownLayout,
  overlayLayout: palletTownOverlayLayout,
  collision: palletTownCollide,
  interactions: palletTownInteractions,
  width: palletTownCollide[0].length,
  height: palletTownCollide.length,
  warps: palletTownWarps,
  worldMap: { x: 3, y: 6.5, w: 1, h: 1 },
  isFlyable: true,
  isIndoor: false,
  npcs: PALLET_TOWN_NPCs,
  missableObjects: PALLET_TOWN_MISSABLES_OBJECTS,
};
