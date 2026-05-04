import { redHouse_2F_Collide } from "./redHouse2F.collide.js";
import { REDHOUSE_2F_INTERACTION } from "./redHouse2F.interaction.js";
import { redHouse_2F_Layout } from "./redHouse2F.layout.js";
import { REDHOUSE_2F_NPC } from "./redHouse2F.npc.js";
import { redHouse_2F_Warps } from "./redHouse2F.warp.js";
import { REDHOUSE_2F_MISSABLE_OBJECTS } from "./redHouse2F.missableObject.js";
import { redHouse_2F_ForegroundLayout } from "./redHouse2F.foregroundLayout.js";
import { redHouse_2F_overlayLayout } from "./redHouse2F.overlayLayout.js";

export const redHouse_2F = {
  id: "RED_HOUSE_2F",
  backgLayout: redHouse_2F_Layout,
  foregroundLayout: redHouse_2F_ForegroundLayout,
  overlayLayout: redHouse_2F_overlayLayout,
  collision: redHouse_2F_Collide,
  width: redHouse_2F_Collide[0].length,
  height: redHouse_2F_Collide.length,
  warps: redHouse_2F_Warps,
  overworldPokemons: [],
  npcs: REDHOUSE_2F_NPC,
  missableObjects: REDHOUSE_2F_MISSABLE_OBJECTS,
  interactions: REDHOUSE_2F_INTERACTION,
  isFlyable: false,
  isIndoor: true,
};
