import { drawBox } from "../../shareds/utils.js";
import { Cursor } from "../Cursor/Cursor.model.js";

export class Menu {
  constructor(game) {
    this.game = game;
    this.canvas = this.game.canvas;
    this.width = this.canvas.width / 2 - 32;
    this.height = this.canvas.height - 32;
    this.position = {
      x: this.canvas.width - this.width,
      y: 0,
    };
    this.isOpen = false;
    this.items = [
      { id: "POKEDEX", name: "POKEDEX" },
      { id: "POKEMON", name: "POKEMON" },
      { id: "SAC", name: "SAC" },
      { id: "SACHA", name: "SACHA" },
      { id: "SAUVER", name: "SAUVER" },
      { id: "OPTIONS", name: "OPTIONS" },
      { id: "RETOUR", name: "RETOUR" },
    ];
    this.currentIndex = 0;
    this.lineHeight = 40;
    this.heightLine = 40;
    this.baseY = 21;
    this.cursor = new Cursor(false);
  }

  draw(context) {
    if (!this.isOpen) return;
    drawBox(context, this.position.x, this.position.y, this.width, this.height);
    this.drawText(context);

    const cursorY = this.position.y + this.currentIndex * this.lineHeight + 20;

    this.cursor.draw(context, this.position.x + 10, cursorY);
  }

  drawText(context) {
    const padding = 15;
    context.font = `25px PixelOperator `;
    context.fillStyle = "black";
    context.textBaseline = "top";

    this.items.forEach((item, index) => {
      const positionX = this.position.x + padding + 20;
      const positionY = this.position.y + padding + index * this.lineHeight;
      context.fillText(item.name, positionX, positionY);
    });
  }

  update(context) {
    this.draw(context);
  }

  openItem() {
    const itemId = this.items[this.currentIndex].id;
    this.game.showMenuSelectedItem(itemId);
  }
}
