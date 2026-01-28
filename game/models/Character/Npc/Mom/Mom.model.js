import {
  idleMomDown,
  idleMomLeft,
  idleMomRight,
  idleMomUp,
} from "../../../../assets/images/npcs/girl/redMom/redMom.assets.js";
import { Character } from "../../Character.model.js";

export class Mom extends Character {
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
    this.name = "Mom";
  }

  update(game) {
    super.update(game);
  }
}
