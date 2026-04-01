import { BIG_TREE_STYLE_1 } from "./bigTree.tilesets.js";
import { MIDDLE_TREE } from "./middleTree.tilesets.js";

export const TREE_TILESETS = {
  ...BIG_TREE_STYLE_1, // 108 - 115
  ...MIDDLE_TREE, // 116 - 118
  119: {
    name: "small_tree",
    type: "ground",
    src: "game/assets/images/tilesets/world/terrain/tree/small_tree.png",
  },
};
