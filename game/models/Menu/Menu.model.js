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
    this.items = [
      { id: "POKEDEX", name: "POKEDEX" },
      { id: "POKEMON", name: "POKEMON" },
      { id: "SAC", name: "SAC" },
      { id: "SACHA", name: "SACHA" },
      { id: "SAUVER", name: "SAUVER" },
      { id: "OPTIONS", name: "OPTIONS" },
      { id: "RETOUR", name: "RETOUR" },
    ];
    this.isOpen = false;
    this.hasFocus = false;
    this.currentIndex = 0;
    this.lineHeight = 40;
    this.baseY = 21;
    this.cursor = new Cursor();
  }

  draw(context) {
    drawBox(
      context,
      this.position.x,
      this.position.y,
      this.width,
      this.height,
      "black",
      "white"
    );
    this.drawText(context);
    this.showCursor(context);
  }

  showCursor(context) {
    const cursorY = this.position.y + this.currentIndex * this.lineHeight + 20;
    this.cursor.update(context, this.position.x + 10, cursorY);
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

  open() {
    this.isOpen = true;
    this.cursor.isVisible = true;
    this.hasFocus = true;
  }

  close() {
    this.isOpen = false;
    this.cursor.isVisible = false;
    this.hasFocus = false;
  }

  openItem() {
    const itemId = this.items[this.currentIndex].id;
    this.game.showMenuSelectedItem(itemId);
  }

  handleIndex() {
    if (!this.isOpen || !this.hasFocus) return;

    if (keys.up && this.currentIndex > 0) {
      this.currentIndex--;
      keys.up = false;
    }

    if (keys.down && this.currentIndex < this.items.length - 1) {
      this.currentIndex++;
      keys.down = false;
    }
  }

  handleItems() {
    if (!this.isOpen || !this.hasFocus) return;

    if (keys.action) {
      this.openItem();
      keys.action = false;
    }
  }

  update(context) {
    if (!this.isOpen) return;
    this.draw(context);

    this.handleIndex();
    this.handleItems();
  }
}
