import { drawBox } from "../../shareds/utils/box/box.utils.js";
import { textParams } from "../../shareds/utils/font/font.utils.js";
import { Cursor } from "../Cursor/Cursor.model.js";

export class TitleScreen {
  constructor(game, isOpen) {
    this.name = "TITLE";
    this.game = game;
    this.position = {
      x: 0,
      y: 0,
    };
    this.width = canvas.width;
    this.height = canvas.height;
    this.isOpen = isOpen;
    this.hasFocus = false;
    this.currentIndex = 0;
    this.lineHeight = 40;
    this.baseY = 21;
    this.cursor = new Cursor();

    this.items = [
      { id: "NEW_GAME", name: "NOUVELLE PARTIE" },
      { id: "CONTINUE", name: "CONTINUER" },
      { id: "OPTIONS", name: "OPTIONS" },
    ];
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
    const paddingX = 20;
    const paddingY = 10;
    const cursorY =
      this.position.y + this.currentIndex * this.lineHeight + paddingX;

    this.cursor.update(context, this.position.x + paddingY, cursorY);
  }

  drawText(context) {
    const paddingX = 35;
    const paddingY = 15;
    textParams(context, "25");

    this.items.forEach((item, index) => {
      const positionX = this.position.x + paddingX;
      const positionY = this.position.y + paddingY + index * this.lineHeight;
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
    }
  }
}
