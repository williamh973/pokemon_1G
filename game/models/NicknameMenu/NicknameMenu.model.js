export class NicknameMenu {
  constructor(game) {
    this.game = game;
    this.canvas = this.game.canvas;
    this.position = {
      x: this.canvas.width - this.width,
      y: 0,
    };
    this.lineWidth = 40;
    this.lineHeight = 40;
    this.width = this.lineWidth * this.items.length;
    this.height = this.lineHeight * this.items.length;
  }
}
