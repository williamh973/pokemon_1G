import { Npc } from "../../npc.model.js";

export class FatKid extends Npc {
  constructor(tileX, tileY, facing) {
    const sprites = {
      idle: CHARACTER_SPRITES.mom.idle,
      walk: CHARACTER_SPRITES.mom.walk,
    };

    super({ tileX, tileY, sprites, facing });

    this.dialogTree = MOM_DIALOGS;
    this.name = "FatKid";
  }
}
