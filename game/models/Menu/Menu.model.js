import { drawText } from "../../shareds/utils/font/drawText.utils.js";
import { textParams } from "../../shareds/utils/font/font.utils.js";
import { Cursor } from "../Cursor/Cursor.model.js";

export class Menu {
  constructor(game) {
    this.game = game;
    this.items = [];
    this.currentIndex = 0;
    this.cursor = new Cursor();
    this.isOpen = false;
    this.hasFocus = false;
    this.lineHeight = 25;
  }

  open() {
    this.isOpen = true;
    this.hasFocus = true;
    this.cursor.isVisible = true;
  }

  close() {
    this.isOpen = false;
    this.hasFocus = false;
    this.cursor.isVisible = false;
  }

  drawItems(context) {
    textParams(context, "25");

    this.items.forEach((item, index) => {
      const positionX = this.position.x + 35;
      const positionY = this.position.y + 15 + index * this.lineHeight;
      drawText(context, item.name, positionX, positionY);
    });
  }

  showCursor(context) {
    const cursorY = this.position.y + this.currentIndex * this.lineHeight + 20;
    this.cursor.update(context, this.position.x + 10, cursorY);
  }

  openItem() {
    const itemId = this.items[this.currentIndex].id;
    this.game.handleMenuSelection(itemId, this);
  }

  navigate(action) {
    switch (action) {
      case "UP":
        if (this.currentIndex > 0) this.currentIndex--;
        break;

      case "DOWN":
        if (this.currentIndex < this.items.length - 1) {
          this.currentIndex++;
        }
        break;
    }
  }

  update(action) {
    if (!this.isOpen || !this.hasFocus) return;

    this.navigate(action);
  }
}
