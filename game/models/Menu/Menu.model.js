import { Cursor } from "../Cursor/Cursor.model.js";

export class Menu {
  constructor(game) {
    this.game = game;
    this.items = [];
    this.currentIndex = 0;
    this.cursor = new Cursor();
    this.isOpen = false;
    this.hasFocus = false;
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
