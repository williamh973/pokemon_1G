import { INPUT_STATE } from "../../logic/input/inputs.state.js";
import { drawText } from "../../shareds/utils/font/drawText.utils.js";
import { textParams } from "../../shareds/utils/font/font.utils.js";
import { Cursor } from "../Cursor/Cursor.model.js";

export class Menu {
  constructor(game) {
    this.game = game;
    this.items = [];
    this.currentIndex = 0;
    this.cursor = new Cursor("MENU");
    this.isOpen = false;
    this.hasFocus = false;
    this.lineHeight = 25;
  }

  open() {
    this.isOpen = true;
    this.hasFocus = true;
    this.cursor.isVisible = true;
    this.cursor.state = "idle";
  }

  close() {
    this.isOpen = false;
    this.hasFocus = false;
    this.cursor.isVisible = false;
  }

  drawItems(context, paddingX = 35, paddingY = 15) {
    textParams(context, "25");

    this.items.forEach((item, index) => {
      const positionX = this.position.x + paddingX;
      const positionY = this.position.y + paddingY + index * this.lineHeight;
      drawText(context, item.name, positionX, positionY);
    });
  }

  showCursor(context, paddingX = 10, paddingY = 20, hasFocusedCursor = false) {
    const cursorY =
      this.position.y + this.currentIndex * this.lineHeight + paddingY;

    this.cursor.update(
      context,
      this.position.x + paddingX,
      cursorY,
      hasFocusedCursor
    );
  }

  openItem(returnItemFromInventory = null) {
    if (returnItemFromInventory) {
      const itemId = returnItemFromInventory;
      return this.game.handleMenuSelection(itemId, this);
    }

    const itemId = this.items[this.currentIndex].id;
    this.game.handleMenuSelection(itemId, this);
  }

  navigate(action) {
    switch (action) {
      case INPUT_STATE.UP:
        if (this.currentIndex > 0) this.currentIndex--;
        break;

      case INPUT_STATE.DOWN:
        if (this.currentIndex < this.items.length - 1) {
          this.currentIndex++;
        }
        break;

      case INPUT_STATE.ACTION:
        this.openItem();
        break;
    }
  }

  update(action) {
    if (!this.isOpen || !this.hasFocus) return;

    this.navigate(action);
  }
}
