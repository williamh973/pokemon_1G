import { CHARACTER_SPRITES } from "../../../../shareds/character/sprite/sprite.database.js";
import { MOM_DIALOGS } from "../../../../shareds/dialog/npc/mom.dialogTree.js";
import { Npc } from "../npc.model.js";

export class Mom extends Npc {
  constructor(tileX, tileY, facing) {
    const sprites = {
      idle: CHARACTER_SPRITES.mom.idle,
      walk: CHARACTER_SPRITES.mom.walk,
    };

    super({ tileX, tileY, sprites, facing });

    this.dialogTree = MOM_DIALOGS;
    this.name = "Mom";
  }
}
