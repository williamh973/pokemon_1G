import { drawBox } from "../../shareds/utils.js";
import { Cursor } from "../Cursor/Cursor.model.js";

export class Inventory {
  constructor(game) {
    this.game = game;
    this.position = {
      x: 0,
      y: 0,
    };
    this.canvas = this.game.canvas;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.categories = ["care", "ball", "key"];
    this.items = [];
    this.isOpen = false;
    this.hasFocus = false;
    this.lineHeight = 40;
    this.currentIndex = 0;
    this.baseY = 21;
    this.cursor = new Cursor();
  }

  add(item) {
    this.items.push(item);
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

  useItem() {
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
        this.useItem();
        break;

      case "MENU":
        this.close();
        this.game.resetCurrentScreen();
        this.game.openMenu();
        break;

      case "CANCEL":
        this.close();
        this.game.resetCurrentScreen();
        this.game.openMenu();
        break;
    }
  }
}
