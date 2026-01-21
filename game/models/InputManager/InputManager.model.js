export class InputManager {
  constructor() {
    this.buffer = null;
    this.held = null;

    const KEY_MAP = {
      a: "ACTION",
      c: "MENU",
      e: "CANCEL",
      z: "UP",
      s: "DOWN",
      q: "LEFT",
      d: "RIGHT",
    };

    window.addEventListener("keydown", (e) => {
      if (e.repeat) return;

      switch (e.key) {
        case "a":
          this.buffer = "ACTION";
          break;
        case "c":
          this.buffer = "MENU";
          break;
        case "e":
          this.buffer = "CANCEL";
          break;

        case "z":
          this.held = "UP";
          break;
        case "s":
          this.held = "DOWN";
          break;
        case "q":
          this.held = "LEFT";
          break;
        case "d":
          this.held = "RIGHT";
          break;
      }
    });

    window.addEventListener("keyup", (e) => {
      if (["z", "s", "q", "d"].includes(e.key)) {
        this.held = null;
      }
    });
  }

  consume() {
    const action = this.buffer;
    this.buffer = null;
    return action;
  }
}
