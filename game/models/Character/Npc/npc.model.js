import { Character } from "../Character.model.js";

export class Npc extends Character {
  constructor({ tileX, tileY, sprites, facing = "down" }) {
    super({ tileX, tileY, sprites, facing });
    this.initialFacing = facing;
    this.restoreTimeout = null;
    this.dialogs = [];
  }

  setInitialFacing(facing) {
    this.initialFacing = facing;
  }

  restoreFacing() {
    this.setFacing(this.initialFacing);
    this.isInteracting = false;
    clearTimeout(this.restoreTimeout);
    this.restoreTimeout = null;
  }

  interact(game) {
    this.initialFacing ??= this.facing;
    this.isInteracting = true;
    this.setFacing(this.getFacingToward(game.player));

    switch (game.flags.TALKED_TO_MOM) {
      case true:
        game.openDialogBox(this.dialogs[1]);
        break;
      case false:
        game.flags.TALKED_TO_MOM = true;
        game.openDialogBox(this.dialogs[0]);
        break;
      default:
        break;
    }
  }

  update(game) {
    super.update(game);

    if (this.isInteracting && game.state === "WORLD" && !this.restoreTimeout) {
      this.restoreTimeout = setTimeout(() => {
        this.restoreFacing();
      }, 5000);
    }
  }
}
