import { GAME_STATES } from "../../logic/gameplay/game/states/states.gameplay.js";
import { INPUT_STATE } from "../../logic/input/inputs.state.js";

export class InputManager {
  constructor() {
    this.buffer = null;

    window.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "a":
          this.buffer = INPUT_STATE.ACTION;
          break;
        case "c":
          this.buffer = GAME_STATES.PLAYER_MENU;
          break;
        case "e":
          this.buffer = INPUT_STATE.ESCAPE;
          break;
        case "z":
          this.buffer = INPUT_STATE.UP;
          break;
        case "s":
          this.buffer = INPUT_STATE.DOWN;
          break;
        case "q":
          this.buffer = INPUT_STATE.LEFT;
          break;
        case "d":
          this.buffer = INPUT_STATE.RIGHT;
          break;
        case " ":
          this.buffer = INPUT_STATE.SPACE;
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
