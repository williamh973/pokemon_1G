import { drawBox } from "../../shareds/utils.js";
import { Cursor } from "../Cursor/Cursor.model.js";

export class Menu {
  constructor(canvas) {
    this.canvas = canvas;
    this.width = canvas.width / 2 - 16;
    this.height = canvas.height - 32;
    this.position = {
      x: canvas.width - this.width,
      y: 0,
    };
    this.isOpen = false;
    this.items = [
      "POKEDEX",
      "POKEMON",
      "SAC",
      "SACHA",
      "SAUVER",
      "OPTIONS",
      "RETOUR",
    ];
    this.currentIndex = 0;
    this.lineHeight = 40;
    this.baseY = 15;
    this.cursor = new Cursor(this.heightLine);
  }

  draw(context) {
    if (!this.isOpen) return;
    drawBox(context, this.position.x, this.position.y, this.width, this.height);
    this.drawText(context);
    this.cursor.draw(
      context,
      this.position.x + 10,
      this.baseY,
      this.currentIndex * this.lineHeight
    );
  }

  drawText(context) {
    const padding = 15;
    context.font = "22px monospace";
    context.fillStyle = "black";
    context.textBaseline = "top";

    this.items.forEach((item, index) => {
      const positionX = this.position.x + padding + 35;
      const positionY = this.position.y + padding + index * this.lineHeight;
      context.fillText(item, positionX, positionY);
    });
  }

  update(context) {
    this.draw(context);
  }
}
