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
      y: this.canvas.height - 70,
    };
    this.isHovered = false;
    this.height = 65;
    this.items = [
      { id: "ATTACK", name: "ATTACK", isHovered: false },
      { id: "SAC", name: "SAC", isHovered: false },
      { id: "POKEMON", name: "PKMN", isHovered: false },
      { id: "ESCAPE", name: "FUIR", isHovered: false },
    ];
  }

  open() {
    super.open();
  }

  draw(context) {
    this.drawItems(context);
  }

  resetCurrentIndex() {
    this.currentIndex = 0;
  }

  drawItems(context) {
    this.items.forEach((item, index) => {
      item.isHovered = index === this.currentIndex;

      const col = index % 2;
      const row = Math.floor(index / 2);
      const positionX = this.position.x + 10 + col * 75;
      const positionY = this.position.y + 10 + row * 30;
      const width = 70;
      const height = 25;

      drawBox(
        context,
        positionX,
        positionY,
        width,
        height,
        item.isHovered ? "red" : "rgba(120, 170, 220, 0.35)",
        "rgba(30, 60, 100, 0.65)"
      );

      textParams(context, "21", "rgb(255, 255, 255)");

      const textWidth = context.measureText(item.name).width;

      drawText(
        context,
        item.name,
        positionX + width / 2 - textWidth / 2,
        positionY
      );
    });
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
