import { MissableObject } from "../../../../models/Character/Npc/object/missableObject.model.js";

export const spawnMO = (map, config, data) => {
  const item = new MissableObject({
    key: data.key,
    tileX: data.tileX,
    tileY: data.tileY,
    id: config.id,
    category: data.category,
    flagId: data.flagId,
    name: config.name,
  });
  map.missableObjects.push(item);
  return item;
};
