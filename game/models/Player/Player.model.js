import { Character } from "../Character/Character.model.js";
import {
  idleDown,
  idleLeft,
  idleRight,
  idleUp,
  walkDown_stepA,
  walkDown_stepB,
  walkLeft_stepA,
  walkLeft_stepB,
  walkRight_stepA,
  walkRight_stepB,
  walkUp_stepA,
  walkUp_stepB,
} from "../../assets/images/player/player.assets.js";
import { keys } from "../../logic/input/keyboard.js";

export class Player extends Character {
  constructor() {
    const playerSprites = {
      idle: {
        up: idleUp,
        down: idleDown,
        left: idleLeft,
        right: idleRight,
      },
      walk: {
        up: [walkUp_stepA, walkUp_stepB],
        down: [walkDown_stepA, walkDown_stepB],
        left: [walkLeft_stepA, walkLeft_stepB],
        right: [walkRight_stepA, walkRight_stepB],
      },
    };

    super({
      tileX: 8,
      tileY: 6,
      sprites: playerSprites,
    });

    this.name = "";
    this.abilities = "";
    this.hasWon = false;
    this.hasLose = false;
    this.pokedex = [];
    this.team = [];
    this.inventory = {};
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
