import { CHARACTER_SPRITES } from "../../../../../shareds/character/sprite/sprite.database.js";
import { DIALOGS_TREE_DATABASE } from "../../../../../shareds/dialogTree/dialogTree.database.js";
import { Npc } from "../../npc.model.js";

export class Oak extends Npc {
  constructor(tileX, tileY, facing) {
    const sprites = {
      idle: CHARACTER_SPRITES.oak.idle,
      walk: CHARACTER_SPRITES.oak.walk,
    };

    super({ tileX, tileY, sprites, facing });

    this.dialogTree = DIALOGS_TREE_DATABASE.palletTown.oak;
    this.name = "Oak";
  }
}
