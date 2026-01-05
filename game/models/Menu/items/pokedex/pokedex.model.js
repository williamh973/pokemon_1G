export class Pokedex {
  constructor(game, isOpen) {
    this.position = {
      x: 0,
      y: 0,
    };
    this.width = game.canvas.width;
    this.height = game.canvas.height;
    this.isOpen = isOpen;
  }

  draw(context) {
    context.fillStyle = "white";
    context.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update(context) {
    if (!this.isOpen) return;
    this.draw(context);
  }
}
