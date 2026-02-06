import { CHARACTER_SPRITES } from "../../../../../shareds/character/sprite/sprite.database.js";
import { DIALOGS_TREE_DATABASE } from "../../../../../shareds/dialogTree/dialogTree.database.js";
import { Npc } from "../../npc.model.js";

export class Mom extends Npc {
  constructor(tileX, tileY, facing) {
    const sprites = {
      idle: CHARACTER_SPRITES.mom.idle,
      walk: CHARACTER_SPRITES.mom.walk,
    };

    super({ tileX, tileY, sprites, facing });

    this.dialogTree = DIALOGS_TREE_DATABASE.palletTown.mom;
    this.name = "Mom";
  }
}
