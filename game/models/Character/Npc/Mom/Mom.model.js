import {
  idleMomDown,
  idleMomLeft,
  idleMomRight,
  idleMomUp,
} from "../../../../assets/images/npcs/girl/redMom/redMom.assets.js";
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
    this.name = "Mom";
  }
  // this.dialogs = [
  //   "Tous les garçons partent un\njour de la maison. J'ai déjà\nvu ça à la TV.",
  //   "N'oublie pas de passer dire\nbonjour au professeur Chen.",
  // ];
}
