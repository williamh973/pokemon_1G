import { TILES_SIZE, drawBox } from "../../shareds/utils.js";
import { Cursor } from "../Cursor/Cursor.model.js";

export class ChoiceMenu {
  constructor(game, source) {
    this.game = game;
    this.source = source;
    this.items = source.start.choices;
    this.canvas = this.game.canvas;
    this.width = TILES_SIZE * 2.3;
    this.height = TILES_SIZE * 2.1;
    this.position = {
      x: 0,
      y: this.canvas.height - this.height * 2,
    };
    this.isOpen = false;
    this.hasFocus = false;
    this.currentIndex = 0;
    this.lineHeight = 25;
    this.baseY = 10;
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
    const cursorY = this.position.y + this.currentIndex * this.lineHeight + 16;
    this.cursor.update(context, this.position.x + 7, cursorY);
  }

  drawText(context) {
    const padding = 10;
    context.font = `25px PixelOperator `;
    context.fillStyle = "black";
    context.textBaseline = "top";

    this.items.forEach((item, index) => {
      const positionX = this.position.x + padding + 15;
      const positionY = this.position.y + padding + index * this.lineHeight;
      context.fillText(item.label, positionX, positionY);
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

  getSelectedItem() {
    return this.items[this.currentIndex];
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
        const selectedItem = this.getSelectedItem();
        if (selectedItem.next === "no") {
          this.close();
          this.game.closeDialogBox();
          return;
        }

        this.source.yes.action(this.game);
        this.game.openDialogBox(this.source.yes.text, null);
        break;

      case "CANCEL":
        this.close();
        this.game.closeDialogBox();
        break;
    }
  }
}
