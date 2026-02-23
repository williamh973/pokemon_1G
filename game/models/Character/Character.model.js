import { TILE_TYPES } from "../../shareds/tile/tile.type.js";
import { TILES_SIZE } from "../../shareds/utils/tile/tile.utils.js";
import { CHARACTER_STATE } from "../../shareds/utils/character/character.utils.js";

export class Character {
  constructor({ tileX, tileY, sprites, facing = "down" }) {
    this.width = 32;
    this.height = 32;
    this.tileX = tileX;
    this.tileY = tileY;
    this.frames = {
      idle: { max: 1 },
      walk: { max: 2 },
    };

    this.framesMax = this.frames.idle.max;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.step = 0;
    this.framesHold = 10;
    this.position = {
      x: TILES_SIZE * this.tileX,
      y: TILES_SIZE * this.tileY,
    };
    this.moveProgress = 10;
    this.moveDuration = 20;
    this.startX = this.position.x;
    this.startY = this.position.y;
    this.targetX = this.position.x;
    this.targetY = this.position.y;
    this.isCanMove = true;
    this.isMoving = false;
    this.justStartedMoving = false;
    this.state = CHARACTER_STATE.IDLE;
    this.sprites = sprites;
    this.facing = facing;
    this.initialFacing = facing;
    this.forcedMovementQueue = [];
    this.updateSprite();
  }

  updateSprite() {
    this.image = this.sprites[this.state][this.facing];
    this.framesMax = this.frames[this.state].max;
  }

  setFacing(facing) {
    this.facing = facing;
    this.updateSprite();
  }

  moveToTile(dx, dy) {
    this.isMoving = true;
    this.state = CHARACTER_STATE.WALK;
    this.step = 1 - this.step;
    this.framesMax = this.frames.walk.max;
    this.image = this.sprites.walk[this.facing][this.step];
    this.moveProgress = 0;

    this.tileX += dx;
    this.tileY += dy;

    this.startX = this.position.x;
    this.startY = this.position.y;

    this.targetX = this.tileX * TILES_SIZE;
    this.targetY = this.tileY * TILES_SIZE;
  }

  draw(canvas, camera) {
    const screenX = this.position.x + camera.offsetX;
    const screenY = this.position.y + camera.offsetY;
    const frameWidth = this.image.width / this.framesMax;

    canvas.context.drawImage(
      this.image,
      this.framesCurrent * frameWidth,
      0,
      frameWidth,
      this.image.height,
      screenX,
      screenY,
      this.width,
      this.height
    );
  }

  animateFrames() {
    this.framesElapsed++;

    if (this.framesElapsed % this.framesHold === 0)
      this.framesCurrent = (this.framesCurrent + 1) % this.framesMax;
  }

  outOfMap(targetX, targetY, currentMap) {
    return (
      targetX < 0 ||
      targetY < 0 ||
      targetX >= currentMap.width ||
      targetY >= currentMap.height
    );
  }

  getFacingFromDelta(dx, dy) {
    if (dx === 1) return "right";
    if (dx === -1) return "left";
    if (dy === 1) return "down";
    if (dy === -1) return "up";
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

  npcInFrontOfPlayer(game, targetX, targetY) {
    return game.mapManager.currentMap.npcs?.some((npc) => {
      return npc.tileX === targetX && npc.tileY === targetY;
    });
  }

  playerInFrontOfPnc(game, targetX, targetY) {
    return game.player.tileX === targetX && game.player.tileY === targetY;
  }

  startForcedMovement(path) {
    this.forcedMovementQueue = [...path];
  }

  checkCliffTrigger(game, targetX, targetY) {
    const targetTile = game.mapManager.currentMap.collision[targetY][targetX];
    const collision = TILE_TYPES[targetTile];
    if (collision.terrain === "cliff")
      if (this.facing === "down")
        this.startForcedMovement([...Array(2).fill("down")]);
  }

  walkableTile(game, targetX, targetY) {
    const tile = game.mapManager.currentMap.collision[targetY][targetX];
    const collision = TILE_TYPES[tile];
    return collision.walkable;
  }

  getFacingToward(target) {
    const dx = target.tileX - this.tileX;
    const dy = target.tileY - this.tileY;

    if (Math.abs(dx) > Math.abs(dy)) return dx > 0 ? "right" : "left";
    else return dy > 0 ? "down" : "up";
  }

  attemptMove(dx, dy, game) {
    if (this.isMoving || game.isPaused) return;
    this.setFacing(this.getFacingFromDelta(dx, dy));
    this.updateSprite();

    const targetX = this.tileX + dx;
    const targetY = this.tileY + dy;

    if (this.outOfMap(targetX, targetY, game.mapManager.currentMap)) return;

    if (
      this.checkCliffTrigger(game, targetX, targetY) ||
      !this.walkableTile(game, targetX, targetY) ||
      this.npcInFrontOfPlayer(game, targetX, targetY) ||
      this.playerInFrontOfPnc(game, targetX, targetY)
    )
      return;

    this.moveToTile(dx, dy);
    return true;
  }

  update(game) {
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
        this.state = CHARACTER_STATE.IDLE;
      }
    }

    if (!this.isMoving && this.forcedMovementQueue.length > 0) {
      const nextDirection = this.forcedMovementQueue.shift();

      const directions = {
        up: { dx: 0, dy: -1 },
        down: { dx: 0, dy: 1 },
        left: { dx: -1, dy: 0 },
        right: { dx: 1, dy: 0 },
      };

      const dir = directions[nextDirection];

      this.setFacing(nextDirection);
      this.moveToTile(dir.dx, dir.dy);
    }

    this.draw(game.canvas, game.camera);
  }
}
