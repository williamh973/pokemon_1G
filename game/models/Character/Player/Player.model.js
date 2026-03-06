import { Character } from "../Character.model.js";
import { keys } from "../../../logic/input/keyboard.js";
import { CHARACTER_SPRITES } from "../../../shareds/character/sprite/characterSprite.database.js";
import { Team } from "../../Team/Team.model.js";
import { Inventory } from "../../MainMenu/items/Inventory/Inventory.model.js";
import { Pokedex } from "../../MainMenu/items/pokedex/pokedex.model.js";

export class Player extends Character {
  constructor(game, playedWith) {
    const playerSprites = {
      idle: CHARACTER_SPRITES[playedWith].idle,
      walk: CHARACTER_SPRITES[playedWith].walk,
    };

    super({
      tileX: 5,
      tileY: 4,
      sprites: playerSprites,
    });
    this.name = "red";
    this.nickname = "";
    this.abilities = "";
    this.hasWon = false;
    this.hasLose = false;
    this.starter = {};
    this.gotPokedex = true;
    this.pokedex = new Pokedex(game);
    this.team = new Team(this);
    this.inventory = new Inventory(game);
    this.trainerCard = {};
    this.paths = {
      exit: [...Array(1).fill(this.facing)],
      escortedByOak_A: [
        ...Array(1).fill("right"),
        ...Array(11).fill("down"),
        ...Array(3).fill("right"),
        ...Array(1).fill("up"),
      ],
      escortedByOak_B: [
        ...Array(1).fill("left"),
        ...Array(11).fill("down"),
        ...Array(4).fill("right"),
        ...Array(1).fill("up"),
      ],
    };
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
