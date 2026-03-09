import { Character } from "../Character.model.js";

export class Npc extends Character {
  constructor({
    tileX,
    tileY,
    sprites,
    facing = "down",
    dialogTree = null,
    behavior = "static",
    paths = null,
    name = "NPC",
  }) {
    super({ tileX, tileY, sprites, facing });
    this.initialFacing = facing;
    this.name = name;
    this.behavior = behavior;
    this.dialogTree = dialogTree;
    this.isInteracting = false;
    this.behaviorCooldown = 0;
    this.restoreTimeout = 0;
    this.paths = paths;
    this.patrolIndex = 0;
  }

  handleBehavior(game) {
    switch (this.behavior) {
      case "wander":
        this.updateWander(game);
        break;
      case "lookAround":
        this.updateLookAround(game);
        break;
      case "patrol":
        this.updatePatrol(game);
        break;
      default:
        break;
    }
  }

  updateCooldown() {
    if (this.behaviorCooldown > 0) return this.behaviorCooldown--;
    else return false;
  }

  updatePatrol(game) {
    if (game.isPaused || this.isInteracting || this.isMoving || !this.paths)
      return;

    const directions = {
      up: { dx: 0, dy: -1 },
      down: { dx: 0, dy: 1 },
      right: { dx: 1, dy: 0 },
      left: { dx: -1, dy: 0 },
    };

    const patrolPath = this.paths.patrolPath;
    const currentDirection = patrolPath[this.patrolIndex];
    const dir = directions[currentDirection];

    const moved = this.attemptMove(dir.dx, dir.dy, game);

    if (moved) this.patrolIndex = (this.patrolIndex + 1) % patrolPath.length;
  }

  updateWander(game) {
    if (game.isPaused || this.isInteracting || this.isMoving) return;

    if (this.updateCooldown()) return;

    const directions = [
      { dx: 0, dy: -1 },
      { dx: 0, dy: 1 },
      { dx: 1, dy: 0 },
      { dx: -1, dy: 0 },
    ];

    const randomDir = directions[Math.floor(Math.random() * directions.length)];
    this.attemptMove(randomDir.dx, randomDir.dy, game);
    this.behaviorCooldown = 60 + Math.floor(Math.random() * 180);
  }

  updateLookAround(game) {
    if (game.isPaused || this.isInteracting) return;

    if (this.updateCooldown()) return;

    const facings = ["up", "down", "left", "right"];
    const randomFacing = facings[Math.floor(Math.random() * facings.length)];

    this.setFacing(randomFacing);

    this.behaviorCooldown = 60 + Math.floor(Math.random() * 120);
  }

  restoreFacing() {
    this.setFacing(this.initialFacing);
    this.isInteracting = false;
    this.restoreTimeout = 0;

    this.behaviorCooldown = 60;
  }

  interact(game) {
    game.activeNpc = this;
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

  isInteractionFinished(game) {
    return this.isInteracting && game.state === "WORLD";
  }

  update(game) {
    super.update(game);

    this.handleBehavior(game);

    if (this.isInteractionFinished(game) && this.restoreTimeout === 0)
      this.restoreTimeout = 300;

    if (this.restoreTimeout > 0) {
      this.restoreTimeout--;
      if (this.restoreTimeout === 0) this.restoreFacing();
    }
  }
}
