import { TILE_TYPES } from "../../shareds/tile/tile.type.js";
import { TILES_SIZE } from "../../shareds/utils/tile/tile.utils.js";
import { CHARACTER_STATE } from "../../shareds/utils/character/character.utils.js";
import { moveToTile } from "../../logic/gameplay/character/moveToTile.gameplay.js";
import { attemptMove } from "../../logic/gameplay/character/attemptMove.gameplay.js";
import { checkCliffTrigger } from "../../logic/gameplay/character/checkCliffTrigger.gameplay.js";
import { update } from "../../logic/gameplay/character/update.gameplay.js";
import { moveEffects } from "../../logic/gameplay/character/moveEffects.gameplay.js";
import { walkingOnTallGrass } from "../../logic/gameplay/character/tileEffects/walkingOnGrass/walkingOnGrass.gameplay.js";

export class Character {
  constructor({ id, tileX, tileY, sprites, facing = "down" }) {
    this.id = id;
    this.width = 32;
    this.height = 32;
    this.tileX = tileX;
    this.tileY = tileY;
    this.previousTile = {};
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
    this.isJumping = false;
    this.justStartedMoving = false;
    this.state = CHARACTER_STATE.IDLE;
    this.sprites = sprites;
    this.facing = facing;
    this.initialFacing = facing;
    this.forcedMovements = [];
    this.movementCallbacks = [];
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

  moveToTile(character, dx, dy, game) {
    moveToTile(character, dx, dy, game);
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

  moInFrontOfPlayer(game, targetX, targetY) {
    return game.mapManager.currentMap.missableObjects?.some((mo) => {
      return mo.tileX === targetX && mo.tileY === targetY;
    });
  }

  playerInFrontOfPnc(game, targetX, targetY) {
    return game.player.tileX === targetX && game.player.tileY === targetY;
  }

  startForcedMovement(path) {
    this.forcedMovements = [...path];
  }

  checkCliffTrigger(targetTile) {
    checkCliffTrigger(targetTile, this);
  }

  walkableTile(game, targetX, targetY) {
    const tile = game.mapManager.currentMap.collision[targetY][targetX];
    const collision = TILE_TYPES[tile];
    return collision;
  }

  backgLayoutTile(game, targetX, targetY) {
    const tile = game.mapManager.currentMap.backgLayout[targetY][targetX];
    const layout = game.tileManager.tilesets[tile];
    return layout;
  }

  overlayLayoutTile(game, targetX, targetY) {
    const tile = game.mapManager.currentMap.overlayLayout[targetY][targetX];
    const layout = game.tileManager.tilesets[tile];
    return layout;
  }

  tileEffects(game, character) {
    walkingOnTallGrass(game, character);
  }

  moveEffects(game, footX, footY) {
    moveEffects(game, footX, footY);
  }

  getFacingToward(target) {
    const dx = target.tileX - this.tileX;
    const dy = target.tileY - this.tileY;

    if (Math.abs(dx) > Math.abs(dy)) return dx > 0 ? "right" : "left";
    else return dy > 0 ? "down" : "up";
  }

  attemptMove(dx, dy, game) {
    attemptMove(this, dx, dy, game);
  }

  addMovementCallback(callback) {
    this.movementCallbacks.push(callback);
  }

  update(game) {
    update(this, game);
  }
}
