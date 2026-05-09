import { kantoRoute1Collide } from "./kantoRoute1.collide.js";
import { kantoRoute1Encounters } from "./kantoRoute1.encounter.js";
import { kantoRoute1Interactions } from "./kantoRoute1.interaction.js";
import { kantoRoute1Layout } from "./kantoRoute1.layout.js";
import { KANTO_ROUTE_1_NPCS } from "./kantoRoute1.npc.js";
import { kantoRoute1OverlayLayout } from "./kantoRoute1.overlayLayout.js";
import { kantoRoute1OverworldPokemons } from "./kantoRoute1.overworldPokemons.js";
import { kantoRoute1PuddlesLayout } from "./kantoRoute1.puddlesLayout.js";
import { kantoRoute1Warps } from "./kantoRoute1.warp.js";

export const kantoRoute1 = {
  id: "KANTO_ROUTE_1",
  mapNameWindow: "Route 1",
  weathers: ["sun", "rain"],
  backgLayout: kantoRoute1Layout,
  overlayLayout: kantoRoute1OverlayLayout,
  puddlesLayout: kantoRoute1PuddlesLayout,
  collision: kantoRoute1Collide,
  interactions: kantoRoute1Interactions,
  width: kantoRoute1Collide[0].length,
  height: kantoRoute1Collide.length,
  warps: kantoRoute1Warps,
  encounter: kantoRoute1Encounters,
  encounterRate: 100,
  overworldPokemons: kantoRoute1OverworldPokemons,
  worldMap: { x: 3, y: 5, w: 1, h: 3 },
  isFlyable: false,
  isIndoor: false,
  npcs: KANTO_ROUTE_1_NPCS,
};
