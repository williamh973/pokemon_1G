import { Character } from "../Character/Character.model.js";
import { keys } from "../../logic/input/keyboard.js";
import { CHARACTER_SPRITES } from "../../shareds/character/sprite/sprite.database.js";
import { Inventory } from "../Inventory/Inventory.model.js";

export class Player extends Character {
  constructor() {
    const playerSprites = {
      idle: CHARACTER_SPRITES.player.idle,
      walk: CHARACTER_SPRITES.player.walk,
    };

    super({
      tileX: 4,
      tileY: 3,
      sprites: playerSprites,
    });

    this.name = "";
    this.abilities = "";
    this.hasWon = false;
    this.hasLose = false;
    this.pokedex = [];
    this.team = [];
    this.trainerCard = {};
  }

  update(game, action) {
    if (!this.isMoving) {
      if (action === "ACTION") game.mapManager.checkInteraction(this);
      if (keys.up) this.attemptMove(0, -1, game);
      if (keys.down) this.attemptMove(0, 1, game);
      if (keys.left) this.attemptMove(-1, 0, game);
      if (keys.right) this.attemptMove(1, 0, game);
    }
    const wasMoving = this.isMoving;
    super.update(game);

    if (wasMoving && !this.isMoving) game.mapManager.checkWarp(this);
  }
}
