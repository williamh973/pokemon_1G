import { redHouse_1F_Collide } from "./redHouse1F.collide.js";
import { redHouse_1F_foregroundLayout } from "./redHouse1F.foregroundLayout.js";
import { redHouse_1F_Interactions } from "./redHouse1F.interaction.js";
import { redHouse_1F_Layout } from "./redHouse1F.backgLayout.js";
import { redHouse_1F_NPCs } from "./redHouse1F.npc.js";
import { redHouse_1F_Warps } from "./redHouse1F.warp.js";
import { redHouse_1F_overlayLayout } from "./redHouse1F.overlayLayout.js";

export const redHouse_1F = {
  id: "RED_HOUSE_1F",
  backgLayout: redHouse_1F_Layout,
  foregroundLayout: redHouse_1F_foregroundLayout,
  overlayLayout: redHouse_1F_overlayLayout,
  collision: redHouse_1F_Collide,
  interactions: redHouse_1F_Interactions,
  width: redHouse_1F_Collide[0].length,
  height: redHouse_1F_Collide.length,
  warps: redHouse_1F_Warps,
  overworldPokemons: [],
  npcs: redHouse_1F_NPCs,
  isFlyable: false,
  isIndoor: true,
};
