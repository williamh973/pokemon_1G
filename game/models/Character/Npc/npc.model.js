import { Character } from "../Character.model.js";

export class Npc extends Character {
  constructor({
    tileX,
    tileY,
    sprites,
    facing = "down",
    dialogTree = null,
    behavior = "static",
    name = "NPC",
  }) {
    super({ tileX, tileY, sprites, facing });
    this.initialFacing = facing;
    this.name = name;
    this.behavior = behavior;
    this.dialogTree = dialogTree;
    this.interval = null;
    this.restoreTimeout = null;
    this.isTimeoutDestroyed = false;
    this.handleBehavior();
  }

  handleBehavior() {
    switch (this.behavior) {
      case "static":
        break;
      case "lookAround":
        console.log("lookAround");
        this.startLookAround();
        break;
      case "wander":
        // this.startWander();
        break;
      case "patrol":
        // this.startPatrol();
        break;
      default:
        break;
    }
  }

  startLookAround() {
    if (this.isTimeoutDestroyed) return;

    const facings = ["up", "down", "right", "left"];
    const turn = () => {
      const randomFacing = facings[Math.floor(Math.random() * facings.length)];
      console.log("ca tourne");

      this.setFacing(randomFacing);
      const delay = 1000 + Math.random() * 10_000;
      this.interval = setTimeout(turn, delay);
    };

    turn();
  }

  destroyTimeout() {
    clearTimeout(this.interval);
    this.interval = null;
  }

  setInitialFacing(facing) {
    this.initialFacing = facing;
  }

  randomNumber() {
    return Math.random() * 10_000;
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

    let nodeKey = "start";
    if (this.dialogTree.start.flagCheck) {
      const { flag, trueNode, falseNode } = this.dialogTree.start.flagCheck;
      nodeKey = game.flags[flag] ? trueNode : falseNode;
    }

    const node = this.dialogTree[nodeKey];

    if (node.setFlag) game.flags[node.setFlag] = true;
    if (node.action) node.action(game);

    game.openDialogBox(node.text);
  }

  update(game) {
    super.update(game);

    if (this.isInteracting && game.state === "WORLD" && !this.restoreTimeout)
      this.restoreTimeout = setTimeout(() => this.restoreFacing(), 5000);
  }
}
