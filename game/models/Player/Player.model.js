import { idle } from "../../assets/images/player/player.assets.js";
import { keys } from "../../logic/gameplay/player/keyboard.js";
import { game } from "../../../main.js";
import { PLAYER_STATE, TILES_SIZE } from "../../shareds/utils.js";
import { SQUARE_TYPES } from "../../logic/gameplay/square/square.type.js";

export class Player {
  constructor() {
    this.width = 32;
    this.height = 32;
    this.speed = 1;
    this.screenX = 4;
    this.screenY = 5;
    this.tileX = 4;
    this.tileY = 5;
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
    this.hasWon = false;
    this.hasLose = false;
    this.isCanMove = true;
    this.isMoving = false;
    this.pokedex = [];
    this.team = [];
    this.inventory = {};
    this.trainerCard = {};
    this.state = PLAYER_STATE.IDLE;
    this.image = idle;
    this.currentSprite = idle;
    this.abilities = "";
  }

  draw(canvas) {
    const centerX = canvas.width / 2 - this.width / 2;
    const centerY = canvas.height / 2 - this.height / 2;

    canvas.context.drawImage(
      this.image,
      centerX,
      centerY,
      this.width,
      this.height
    );
  }

  attemptMove(dx, dy, currentMap, camera) {
    if (this.isMoving) return;

    const targetX = this.tileX + dx;
    const targetY = this.tileY + dy;

    if (
      targetX < 0 ||
      targetY < 0 ||
      targetX >= currentMap.width ||
      targetY >= currentMap.height
    ) {
      return console.log("Tile out of map");
    }

    const tile = currentMap.collision[targetY][targetX];
    const collision = SQUARE_TYPES[tile];

    if (!collision.walkable) {
      return console.log("Tile no walkable");
    }

    this.isMoving = true;
    this.moveProgress = 0;

    this.tileX += dx;
    this.tileY += dy;

    this.startX = this.position.x;
    this.startY = this.position.y;

    this.targetX = this.tileX * TILES_SIZE;
    this.targetY = this.tileY * TILES_SIZE;
  }

  update(canvas) {
    if (this.isMoving) {
      this.moveProgress++;

      const t = this.moveProgress / this.moveDuration;

      this.position.x = this.startX + (this.targetX - this.startX) * t;
      this.position.y = this.startY + (this.targetY - this.startY) * t;

      if (this.moveProgress >= this.moveDuration) {
        this.position.x = this.targetX;
        this.position.y = this.targetY;
        this.isMoving = false;
        game.mapManager.checkWarp(this);
      }
    } else {
      if (keys.up) this.attemptMove(0, -1, game.currentMap);
      if (keys.down) this.attemptMove(0, 1, game.currentMap);
      if (keys.left) this.attemptMove(-1, 0, game.currentMap);
      if (keys.right) this.attemptMove(1, 0, game.currentMap);
    }

    this.draw(canvas);
  }
}
