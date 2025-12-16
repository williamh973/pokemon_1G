import { idle } from "../../assets/images/player/player.assets.js";
import { PLAYER_STATE } from "../../logic/gameplay/player/playerStates.js";
import { keys } from "../../logic/gameplay/player/keyboard.js";
import { game } from "../../../main.js";

export class Player {
  constructor(game) {
    this.width = 32;
    this.height = 32;
    this.speed = 1;
    this.position = {
      x: game.canvas.width / 2 - this.width / 2,
      y: game.canvas.height / 2 - this.height / 2,
    };
    this.name = "";
    this.hasWon = false;
    this.hasLose = false;
    this.isCanMove = true;
    this.pokedex = [];
    this.team = [];
    this.inventory = {};
    this.trainerCard = {};
    this.state = PLAYER_STATE.IDLE;
    this.image = idle;
    this.abilities = {
      surf: false,
      fish: false,
      cut: false,
      smash: false,
      fly: false,
      teleport: false,
    };
  }

  draw(canvas) {
    canvas.context.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update(canvas) {
    if (keys.left) {
      game.camera.offsetX += this.speed;
      this.state = PLAYER_STATE.WALK;
    }

    if (keys.right) {
      game.camera.offsetX -= this.speed;
      this.state = PLAYER_STATE.WALK;
    }

    if (keys.up) {
      game.camera.offsetY += this.speed;
      this.state = PLAYER_STATE.WALK;
    }

    if (keys.down) {
      game.camera.offsetY -= this.speed;
      this.state = PLAYER_STATE.WALK;
    }

    this.draw(canvas);
  }
}
