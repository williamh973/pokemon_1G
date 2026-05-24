import { drawBox } from "../../shareds/utils/box/box.utils.js";
import { Menu } from "../Menu/Menu.model.js";

export class StartGameMenu extends Menu {
  constructor(game) {
    super(game);

    this.name = "START_GAME";
    this.game = game;
    this.position = {
      x: 0,
      y: 0,
    };
    this.width = canvas.width;
    this.height = canvas.height;
    this.lineHeight = 40;

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

    this.drawItems(context);
    this.showCursor(context);
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
