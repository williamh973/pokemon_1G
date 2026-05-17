import { Character } from "../Character.model.js";
import { keys } from "../../../logic/input/keyboard.js";
import { CHARACTER_SPRITES } from "../../../shareds/character/sprite/characterSprite.database.js";
import { Party } from "../../MainMenu/items/Party/Party.model.js";
import { Inventory } from "../../MainMenu/items/Inventory/Inventory.model.js";
import { Pokedex } from "../../MainMenu/items/pokedex/pokedex.model.js";
import { PLAYER_PATHS } from "../../../logic/gameplay/character/player/paths.gameplay.js";

export class Player extends Character {
  constructor(game, playedWith) {
    const playerSprites = {
      idle: CHARACTER_SPRITES[playedWith].idle,
      walk: CHARACTER_SPRITES[playedWith].walk,
    };

    super({
      id: "PLAYER",
      tileX: 7,
      tileY: 6,
      sprites: playerSprites,
    });

    this.width = 29;
    this.height = 33;
    this.entityType = "PLAYER";
    this.name = "red";
    this.nickname = "RED";
    this.abilities = "";
    this.hasWon = false;
    this.hasLose = false;
    this.focusedStarter = {};
    this.gotPokedex = true;
    this.pokedex = new Pokedex(game);
    this.party = new Party(game);
    this.inventory = new Inventory(game);
    this.trainerCard = {};
    this.paths = PLAYER_PATHS;
  }

  hasFocus(starter) {
    this.focusedStarter = starter;
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
    if (wasMoving && !this.isMoving) game.mapManager.checkWarp(this, true);
  }
}
