import { Menu } from "../Menu/Menu.model.js";

export class NicknameMenu extends Menu {
  constructor(game) {
    super(game);

    this.game = game;
    this.canvas = this.game.canvas;
    this.position = {
      x: this.canvas.width - this.width,
      y: 0,
    };
    this.lineWidth = 40;
    this.lineHeight = 40;
    this.width = this.lineWidth * this.items.length;
    this.height = this.lineHeight * this.items.length;

    this.items = [];
    this.openDialogBox();
  }

  openDialogBox() {
    const text = "Comment t'appele tu ?";
    this.game.dialogBox.open(text, true);
  }
  draw(context) {
    drawBox(context, 0, 0, this.width, this.height, "black", "white");

    this.drawItems(context);
    this.showCursor(context);
  }

  update(context, action) {
    if (!this.isOpen) return;
    this.draw(context);

    if (!this.isOpen || !this.hasFocus) return;

    if (this.game.dialogBox.isOpen)
      this.game.dialogBox.update(this.game.canvas.context, action);

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
