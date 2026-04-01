import { BUSH_TILESETS } from "./bush.tilesets.js";
import { CAVE_TILESETS } from "./cave/cave.tilesets.js";
import { CLIFF_TILESETS } from "./cliffs/cliff.tilesets.js";
import { FLOWER_TILESETS } from "./flower.tilesets.js";
import { GROUND_TILESETS } from "./ground/ground.tilesets.js";
import { TREE_TILESETS } from "./trees/tree.tilesets.js";
import { WATER_TILESETS } from "./water.tilesets.js";

export const TERRAIN_EXT = {
  ...GROUND_TILESETS,
  ...FLOWER_TILESETS, // 100 - 106
  ...BUSH_TILESETS, // 107
  ...TREE_TILESETS, // 108 - 119
  ...CLIFF_TILESETS, // 120 - 125
  ...CAVE_TILESETS, // 126 - 141
  ...WATER_TILESETS, // 142 - 154
};
