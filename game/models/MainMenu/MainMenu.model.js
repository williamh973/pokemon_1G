import { TILES_SIZE } from "../../shareds/utils/tile/tile.utils.js";
import { drawBox } from "../../shareds/utils/box/box.utils.js";
import { Cursor } from "../Cursor/Cursor.model.js";
import { textParams } from "../../shareds/utils/font/font.utils.js";

export class MainMenu {
  constructor(game) {
    this.game = game;
    this.canvas = this.game.canvas;
    this.width = this.canvas.width / 2 - TILES_SIZE;
    this.items = [
      { id: "POKEDEX", name: "POKEDEX" },
      //       { id: "POKEMON", name: "POKEMON" },
      { id: "SAC", name: "SAC" },
      { id: "SACHA", name: "SACHA" },
      { id: "SAUVER", name: "SAUVER" },
      { id: "OPTIONS", name: "OPTIONS" },
      { id: "RETOUR", name: "RETOUR" },
    ];
    this.position = {
      x: this.canvas.width - this.width,
      y: 0,
    };
    this.lineHeight = 40;
    this.height = this.lineHeight * this.items.length;

    this.isOpen = false;
    this.hasFocus = false;
    this.currentIndex = 0;
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
    textParams(context, "25px PixelOperator");

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
    this.game.handleMenuSelection(itemId, this);
  }

  update(context, action) {
    if (!this.isOpen) return;
    this.draw(context);

    if (!this.isOpen || !this.hasFocus) return;

    switch (action) {
      case "UP":
        if (this.currentIndex > 0) this.currentIndex--;
        break;

      case "DOWN":
        if (this.currentIndex < this.items.length - 1) this.currentIndex++;
        break;

      case "ACTION":
        this.openItem();
        break;

      case "MENU":
        this.game.closeMenu();
        break;
    }
  }
}
