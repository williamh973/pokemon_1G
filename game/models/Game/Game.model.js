import { Canvas } from "../Canvas/Canvas.model.js";

export class Game {
  constructor() {
    this.canvas = new Canvas(document.getElementById("canvas"));
    this.player = new Player();
    this.difficulty = null;
    this.selectionScreenList = [];
    this.isPaused = false;
    this.init();
  }
}
