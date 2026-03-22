import { Npc } from "../../../../models/Character/Npc/npc.model.js";

export const spawnNpc = (npcConfig, mapNpcs, map) => {
  const npc = new Npc({
    id: mapNpcs.id,
    tileX: mapNpcs.tileX,
    tileY: mapNpcs.tileY,
    sprites: npcConfig.sprites,
    facing: npcConfig.facing ?? "down",
    name: npcConfig.name,
    dialogTree: npcConfig.dialogTree,
    behavior: npcConfig.behavior,
    paths: npcConfig.paths,
  });
  map.npcs.push(npc);
  return npc;
};
