import { palletTownWarps } from "./palletTown.warp.js";
import { palletTownCollide } from "./palletTown.collide.js";
import { palletTownInteractions } from "./palletTown.interaction.js";
import { palletTownLayout } from "./palletTown.layout.js";
import { PALLET_TOWN_NPCs } from "./palletTown.npc.js";
import { palletTownOverlayLayout } from "./oakLab/palletTown.overlayLayout.js";
import { PALLET_TOWN_MISSABLES_OBJECTS } from "./palletTown.missableObjects.js";
import { palletTownPuddlesLayout } from "./palletTown.puddlesLayout.js";
import { palletTownLights } from "./palletTown.lights.js";
import { palletTownEncounters } from "./palletTown.encounters.js";
import { palletTownOverworldPokemons } from "./palletTown.overworldPokemons.js";
import { palletTownWeathers } from "./palletTown.weather.js";

export const palletTown = {
  id: "PALLET_TOWN",
  name: "Bourg Palette",
  weathers: palletTownWeathers,
  backgLayout: palletTownLayout,
  overlayLayout: palletTownOverlayLayout,
  puddlesLayout: palletTownPuddlesLayout,
  collision: palletTownCollide,
  interactions: palletTownInteractions,
  width: palletTownCollide[0].length,
  height: palletTownCollide.length,
  warps: palletTownWarps,
  encounter: palletTownEncounters,
  encounterRate: 15,
  overworldPokemons: palletTownOverworldPokemons,
  maxOP: 2,
  worldMap: { x: 3, y: 6.5, w: 1, h: 1 },
  isFlyable: true,
  isIndoor: false,
  npcs: PALLET_TOWN_NPCs,
  missableObjects: PALLET_TOWN_MISSABLES_OBJECTS,
  lights: palletTownLights,
};
