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

  interact(game) {
    if (!game.flags.TALKED_TO_MOM) {
      game.flags.TALKED_TO_MOM = true;
      game.openDialogBox(
        "Tous les garçons partent un\njour de la maison. J'ai déjà\nvu ça à la TV."
      );
      return;
    } else {
      game.openDialogBox(
        "N'oublie pas de passer dire\nbonjour au professeur Chen."
      );
    }
  }
}
