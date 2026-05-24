import { drawBox } from "../../shareds/utils/box/box.utils.js";
import { drawText } from "../../shareds/utils/font/drawText.utils.js";
import { textParams } from "../../shareds/utils/font/font.utils.js";

export class MapNameWindow {
  constructor(game) {
    this.game = game;
    this.isOpen = false;
    this.width = 160;
    this.height = 48;
    this.position = {
      x: 0,
      y: 0 - this.height,
    };
    this.count = 0;
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
  }

  drawText(context) {
    textParams(context, "26");
    drawText(
      context,
      this.game.mapManager.currentMap.name,
      this.position.x + 10,
      this.position.y + 10
    );
  }

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }

  openAnimation() {
    if (this.position.y >= 0) return;
    this.position.y += 3;
  }

  closeAnimation() {
    this.position.y -= 3;
  }

  update(context) {
    if (!this.isOpen) return;

    this.draw(context);
    let cooldown = 150;
    this.count++;
    if (this.count >= cooldown) this.closeAnimation();
    else this.openAnimation();

    if (this.count >= cooldown && this.position.y <= -this.height) {
      this.close();
      this.count = 0;
    }
  }
}
