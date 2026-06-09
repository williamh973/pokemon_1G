import { drawBox } from "../../../../shareds/utils/box/box.utils.js";
import { drawText } from "../../../../shareds/utils/font/drawText.utils.js";
import { textParams } from "../../../../shareds/utils/font/font.utils.js";
import { Menu } from "../../../Menu/Menu.model.js";

export class BattleMenu extends Menu {
  constructor(game) {
    super(game);

    this.canvas = this.game.canvas;
    this.width = this.canvas.width / 2;
    this.position = {
      x: this.canvas.width / 2,
      y: this.canvas.height - 65,
    };
    this.height = 65;
    this.items = [
      { id: "ATTACK", name: "ATTACK" },
      { id: "SAC", name: "SAC" },
      { id: "POKEMON", name: "POKEMON" },
      { id: "ESCAPE", name: "FUIR" },
    ];
  }

  open() {
    super.open();
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

  drawItems(context) {
    textParams(context, "23");

    this.items.forEach((item, index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);

      const positionX = this.position.x + 15 + col * 90;

      const positionY = this.position.y + 10 + row * 25;

      drawText(context, item.name, positionX, positionY);
    });
  }

  showCursor(context) {
    const column = this.currentIndex % 2;
    const row = Math.floor(this.currentIndex / 2);

    const x = this.position.x + 2 + column * 90;
    const y = this.position.y + 16 + row * 25;

    this.cursor.update(context, x, y);
  }

  update(context, action) {
    if (!this.isOpen || !this.hasFocus) return;

    this.draw(context);

    switch (action) {
      case "ACTION":
        this.openItem();
        break;
      case "RIGHT":
        if (this.currentIndex % 2 === 0) this.currentIndex++;
        break;

      case "LEFT":
        if (this.currentIndex % 2 === 1) this.currentIndex--;
        break;

      case "DOWN":
        if (this.currentIndex < 2) this.currentIndex += 2;
        break;

      case "UP":
        if (this.currentIndex >= 2) this.currentIndex -= 2;
        break;
    }
  }
}
