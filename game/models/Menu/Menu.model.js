export class Menu {
  constructor(game) {
    this.game = game;
    this.canvas = this.game.canvas;
    this.position = {
      x: this.canvas.width - this.width,
      y: 0,
    };
    this.lineHeight = 40;
    this.height = this.lineHeight * this.items.length;
  }
}
