import { drawText } from "../../../shareds/utils/font/drawText.utils.js";
import { textParams } from "../../../shareds/utils/font/font.utils.js";

export class Move {
  constructor(move, slotConfig = null) {
    this.move = move;
    this.slotConfig = slotConfig;
  }

  moveName(context) {
    const textWidth = context.measureText(this.move.name).width;

    drawText(
      context,
      this.move.name,
      this.slotConfig.positionX + this.slotConfig.width / 2 - textWidth / 2,
      this.slotConfig.positionY + 2
    );
  }

  draw(context) {
    textParams(context, "20", "rgb(255, 255, 255, 0.9)");

    this.moveName(context);
  }

  update(context) {
    this.draw(context);
  }
}
