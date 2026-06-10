import { GAME_STATES } from "../../logic/gameplay/game/states/states.gameplay.js";

export class InputManager {
  constructor() {
    this.buffer = null;

    window.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "a":
          this.buffer = "ACTION";
          break;
        case "c":
          this.buffer = GAME_STATES.PLAYER_MENU;
          break;
        case "e":
          this.buffer = "ESCAPE";
          break;
        case "z":
          this.buffer = "UP";
          break;
        case "s":
          this.buffer = "DOWN";
          break;
        case "q":
          this.buffer = "LEFT";
          break;
        case "d":
          this.buffer = "RIGHT";
          break;
        case " ":
          this.buffer = "SPACE";
          break;
      }
    });
  }

  consume() {
    const action = this.buffer;
    this.buffer = null;
    return action;
  }
}
