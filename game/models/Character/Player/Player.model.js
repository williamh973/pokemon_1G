import { Character } from "../Character.model.js";
import { keys } from "../../../logic/input/keyboard.js";
import { Party } from "../../MainMenu/items/Party/Party.model.js";
import { Inventory } from "../../MainMenu/items/Inventory/Inventory.model.js";
import { Pokedex } from "../../MainMenu/items/pokedex/pokedex.model.js";
import { PLAYER_PATHS } from "../../../logic/gameplay/character/player/paths.gameplay.js";
import { getSprites } from "../../../shareds/utils/character/player/player.utils.js";
import { TrainerCard } from "../../MainMenu/items/TrainerCard/TrainerCard.model.js";

export class Player extends Character {
  constructor(game, genderId, nickname) {
    super({
      id: "PLAYER",
      tileX: 7,
      tileY: 6,
      sprites: getSprites(genderId, "foot"),
    });
    this.gender = genderId;
    this.trainerId = Math.floor(Math.random() * 100_000);
    this.width = 29;
    this.height = 33;
    this.money = 0;
    this.entityType = "PLAYER";
    this.nickname = nickname;
    this.hasWon = false;
    this.hasLose = false;
    this.isOnBike = false;
    this.focusedStarter = {};
    this.gotPokedex = true;
    this.pokedex = new Pokedex(game);
    this.party = new Party(game);
    this.inventory = new Inventory(game);
    this.trainerCard = new TrainerCard(game, this.gender);
    this.paths = PLAYER_PATHS;
    this.badges = [];
    this.alreadyVisitedMaps = [];

    this.speed = {
      walkSpeed: 20,
      runSpeed: 15,
      bikeSpeed: 10,
      surfSpeed: 10,
    };
  }

  hasFocus(starter) {
    this.focusedStarter = starter;
  }

  getMovementSpeed() {
    if (this.isRunning) {
      this.framesElapsed = 0; // A garder
      return this.speed.runSpeed;
    }

    if (this.isOnBike) return this.speed.bikeSpeed;

    return this.speed.walkSpeed;
  }

  movementSpeed() {
    this.moveDuration = this.getMovementSpeed();
  }

  update(game, action) {
    if (!this.isMoving) {
      if (action === "ACTION") game.mapManager.checkInteraction(this);
      if (keys.up) this.attemptMove(0, -1, game);
      if (keys.down) this.attemptMove(0, 1, game);
      if (keys.left) this.attemptMove(-1, 0, game);
      if (keys.right) this.attemptMove(1, 0, game);

      if (keys.space) this.isRunning = true;
      else this.isRunning = false;
    }
    const wasMoving = this.isMoving;
    super.update(game);
    this.movementSpeed();
    if (wasMoving && !this.isMoving) game.mapManager.checkWarp(this, true);

    // this.isOnBike
    //   ? (this.sprites = getSprites(this.gender, "bike"))
    //   : (this.sprites = getSprites(this.gender, "foot"));

    this.sprites =
      this.isOnBike === true
        ? getSprites(this.gender, "bike")
        : getSprites(this.gender, "foot");
  }
}
