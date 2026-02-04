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

    const nodeKey = game.flags.TALKED_TO_MOM ? "repeat" : "start";
    const node = this.dialogTree[nodeKey];

    if (node.setFlag) game.flags[node.setFlag] = true;

    game.openDialogBox(node.text);
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
