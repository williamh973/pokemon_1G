import { drawBox } from "../../shareds/utils/box/box.utils.js";
import { Cursor } from "../Cursor/Cursor.model.js";
import { textParams } from "../../shareds/utils/font/font.utils.js";

export class ChoiceMenu {
  constructor(game, source) {
    this.game = game;
    this.source = source;
    this.items = source.start.choices;
    this.canvas = this.game.canvas;
    this.width = this.source.setDimension.width;
    this.height = this.source.setDimension.height;
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
    textParams(context, "25px PixelOperator");

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

  saveCompleted() {
    this.source.finalize.action(this.game);
    this.game.openDialogBox(this.source.finalize.text, null);
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
        switch (this.currentIndex) {
          case 0:
            this.source.first.action(this.game);
            this.game.openDialogBox(this.source.first.text, null, null);

            if (this.game.isSaveCompleted) this.saveCompleted();
            break;
          case 1:
            this.source.second.action(this.game);

            if (this.source.second.text)
              this.game.openDialogBox(this.source.second.text, null);
            break;

          default:
            break;
        }
    }
  }
}
