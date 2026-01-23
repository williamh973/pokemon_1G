import {
  idleDown,
  idleLeft,
  idleRight,
  idleUp,
  walkDown,
  walkLeft,
  walkRight,
  walkUp,
} from "../../assets/images/player/player.assets.js";
import { PLAYER_STATE, TILES_SIZE } from "../../shareds/utils.js";
import { SQUARE_TYPES } from "../../logic/gameplay/square/square.type.js";
import { keys } from "../../logic/gameplay/player/keyboard.js";

export class Player {
  constructor() {
    this.width = 32;
    this.height = 32;
    this.frames = {
      idle: { max: 1 },
      walk: { max: 4 },
    };

    this.framesMax = this.frames.idle.max;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 10;
    this.tileX = 3;
    this.tileY = 6;
    this.moveProgress = 0;
    this.moveDuration = 20;
    this.position = {
      x: TILES_SIZE * this.tileX,
      y: TILES_SIZE * this.tileY,
    };
    this.startX = this.position.x;
    this.startY = this.position.y;
    this.targetX = this.position.x;
    this.targetY = this.position.y;
    this.name = "";
    this.abilities = "";
    this.facing = "down";
    this.hasWon = false;
    this.hasLose = false;
    this.isCanMove = true;
    this.isMoving = false;
    this.pokedex = [];
    this.team = [];
    this.inventory = {};
    this.trainerCard = {};
    this.state = PLAYER_STATE.IDLE;
    this.sprites = {
      idle: {
        up: idleUp,
        down: idleDown,
        left: idleLeft,
        right: idleRight,
      },
      walk: {
        up: walkUp,
        down: walkDown,
        left: walkLeft,
        right: walkRight,
      },
    };
    this.image = this.sprites.idle[this.facing];
  }

  outOfMap(targetX, targetY, currentMap) {
    return (
      targetX < 0 ||
      targetY < 0 ||
      targetX >= currentMap.width ||
      targetY >= currentMap.height
    );
  }

  draw(canvas) {
    const centerX = canvas.width / 2 - this.width / 2;
    const centerY = canvas.height / 2 - this.height / 2;

    const frameWidth = this.image.width / this.framesMax;

    canvas.context.drawImage(
      this.image,
      this.framesCurrent * frameWidth,
      0,
      frameWidth,
      this.image.height,
      centerX,
      centerY,
      this.width,
      this.height
    );
  }

  animateFrames() {
    this.framesElapsed++;

    if (this.framesElapsed % this.framesHold === 0)
      this.framesCurrent = (this.framesCurrent + 1) % this.framesMax;
  }

  setFacing(facing) {
    this.facing = facing;
    this.image = this.sprites.idle[this.facing];
  }

  getFacingFromDelta(dx, dy) {
    if (dx === 1) return "right";
    if (dx === -1) return "left";
    if (dy === 1) return "down";
    if (dy === -1) return "up";
  }

  moveToTile(dx, dy) {
    this.isMoving = true;
    this.framesCurrent = 0;
    this.framesMax = this.frames.walk.max;
    this.image = this.sprites.walk[this.facing];
    this.state = PLAYER_STATE.WALK;
    this.moveProgress = 0;

    this.tileX += dx;
    this.tileY += dy;

    this.startX = this.position.x;
    this.startY = this.position.y;

    this.targetX = this.tileX * TILES_SIZE;
    this.targetY = this.tileY * TILES_SIZE;
  }

  attemptMove(dx, dy, game) {
    this.image = this.sprites.idle[this.facing];
    this.state = PLAYER_STATE.IDLE;

    if (this.isMoving || game.isPaused) return;

    this.setFacing(this.getFacingFromDelta(dx, dy));
    const targetX = this.tileX + dx;
    const targetY = this.tileY + dy;

    if (this.outOfMap(targetX, targetY, game.currentMap)) return;

    const tile = game.currentMap.collision[targetY][targetX];
    const collision = SQUARE_TYPES[tile];

    if (!collision.walkable) return;

    this.moveToTile(dx, dy);
  }

  update(game, action) {
    if (this.isCanMove && this.isMoving) {
      this.moveProgress++;
      this.animateFrames();

      const t = this.moveProgress / this.moveDuration;
      this.position.x = this.startX + (this.targetX - this.startX) * t;
      this.position.y = this.startY + (this.targetY - this.startY) * t;

      if (this.moveProgress >= this.moveDuration) {
        this.position.x = this.targetX;
        this.position.y = this.targetY;

        this.isMoving = false;
        this.framesCurrent = 0;
        this.framesMax = this.frames.idle.max;
        this.image = this.sprites.idle[this.facing];
        this.state = PLAYER_STATE.IDLE;
        game.mapManager.checkWarp(this);
      }
    } else {
      if (!this.isMoving) {
        switch (action) {
          case "ACTION":
            game.mapManager.checkInteraction(this);
            break;
          case "UP":
            this.attemptMove(0, -1, game);
            break;
          case "DOWN":
            this.attemptMove(0, 1, game);
            break;
          case "LEFT":
            this.attemptMove(-1, 0, game);
            break;
          case "RIGHT":
            this.attemptMove(1, 0, game);
            break;
          default:
            break;
        }
      }

      if (!this.isMoving) {
        if (keys.up) this.attemptMove(0, -1, game);
        if (keys.down) this.attemptMove(0, 1, game);
        if (keys.left) this.attemptMove(-1, 0, game);
        if (keys.right) this.attemptMove(1, 0, game);
      }
    }
    this.draw(game.canvas);
  }

  getFrontTile() {
    let x = this.tileX;
    let y = this.tileY;

    if (this.facing === "up") y--;
    if (this.facing === "down") y++;
    if (this.facing === "left") x--;
    if (this.facing === "right") x++;

    return { x, y };
  }
}
