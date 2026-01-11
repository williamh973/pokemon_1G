import { drawBox } from "../../../../../shareds/utils.js";

export class PokemonDetail {
  constructor(canvas, isOpen) {
    this.position = {
      x: 0,
      y: 0,
    };
    this.width = canvas.width;
    this.height = canvas.height;
    this.isOpen = isOpen;
  }

  draw(context) {
    if (!this.isOpen) return;
    drawBox(context, this.position.x, this.position.y, this.width, this.height);
  }

  update(context) {
    if (!this.isOpen) return;
    this.draw(context);
  }
}
