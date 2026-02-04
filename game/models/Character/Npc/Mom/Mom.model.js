import {
  idleMomDown,
  idleMomLeft,
  idleMomRight,
  idleMomUp,
} from "../../../../assets/images/npcs/girl/redMom/redMom.assets.js";
import { MOM_DIALOGS } from "../../../../shareds/dialog/npc/mom.dialogTree.js";
import { Npc } from "../npc.model.js";

export class Mom extends Npc {
  constructor(tileX, tileY, facing) {
    const sprites = {
      idle: {
        up: idleMomUp,
        down: idleMomDown,
        left: idleMomLeft,
        right: idleMomRight,
      },
      walk: {
        up: [idleMomUp],
        down: [idleMomDown],
        left: [idleMomLeft],
        right: [idleMomRight],
      },
    };

    super({ tileX, tileY, sprites, facing });

    this.dialogTree = MOM_DIALOGS;
    this.name = "Mom";
  }
}
