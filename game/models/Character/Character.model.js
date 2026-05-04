import { TILE_TYPES } from "../../shareds/tile/tile.type.js";
import { TILES_SIZE } from "../../shareds/utils/tile/tile.utils.js";
import { CHARACTER_STATE } from "../../shareds/utils/character/character.utils.js";
import { moveToTile } from "../../logic/gameplay/character/moveToTile.gameplay.js";
import { attemptMove } from "../../logic/gameplay/character/attemptMove.gameplay.js";
import { checkCliffTrigger } from "../../logic/gameplay/character/checkCliffTrigger.gameplay.js";
import { update } from "../../logic/gameplay/character/update.gameplay.js";
import { walkingOnTallGrass } from "../../logic/gameplay/character/tileEffects/walkingOnGrass/walkingOnGrass.gameplay.js";
import { walkingOnPuddles } from "../../logic/gameplay/character/tileEffects/walkingOnPuddles/walkingOnPuddles.gameplay.js";
import { getFacingToward } from "../../logic/gameplay/character/getFacingToward.gameplay.js";
import { updateSprite } from "../../logic/gameplay/character/updateSprite.gameplay.js";
import { isEntityAt } from "../../logic/gameplay/character/isEntityAt.gameplay.js";
import { getFrontTile } from "../../logic/gameplay/character/getFrontTile.gameplay.js";

export class Character {
  constructor({ id, tileX, tileY, sprites, facing = "down" }) {
    this.id = id;
    this.width = 32;
    this.height = 32;
    this.tileX = tileX;
    this.tileY = tileY;
    this.previousTile = {};
    this.shadow = {};
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
    this.alwaysAnimate = false;
    this.state = CHARACTER_STATE.IDLE;
    this.sprites = sprites;
    this.facing = facing;
    this.initialFacing = facing;
    this.forcedMovements = [];
    this.movementCallbacks = [];
    this.updateSprite();
  }

  updateSprite() {
    updateSprite(this);
  }

  setFacing(facing) {
    this.facing = facing;
    this.updateSprite();
  }

  moveToTile(character, dx, dy, game) {
    moveToTile(character, dx, dy, game);
  }

  draw(canvas, camera) {
    const screenX = this.position.x + camera.offsetX + 2;
    let screenY = this.position.y + camera.offsetY;
    const frameWidth = this.image.width / this.framesMax;

    if (this.movementType === "fly") screenY -= 15;

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
    return getFrontTile(this);
  }

  isEntityAt(game, x, y, filterFn) {
    return isEntityAt(game, x, y, filterFn, this);
  }

  isPlayerAt(game, targetX, targetY) {
    return game.player.tileX === targetX && game.player.tileY === targetY;
  }

  startForcedMovement(path) {
    this.forcedMovements = [...path];
  }

  checkCliffTrigger(game, targetTile) {
    checkCliffTrigger(game, targetTile, this);
  }

  walkableTile(game, targetX, targetY) {
    const tile = game.mapManager.currentMap.collision[targetY][targetX];
    const collision = TILE_TYPES[tile];
    return collision;
  }

  getTileData(game, x, y, mapLayout) {
    const tile = mapLayout[y][x];
    const layout = game.tileManager.tilesets[tile];
    return layout;
  }

  tileEffects(game, character) {
    if (this.movementType === "fly") return;

    const map = game.mapManager.currentMap;
    const x = character.tileX;
    const y = character.tileY;
    walkingOnTallGrass(game, character, map, x, y);
    walkingOnPuddles(game, character, map, x, y);
  }

  getFacingToward(target) {
    return getFacingToward(this, target);
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
