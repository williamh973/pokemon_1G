import { TYPES_CONFIG } from "../../../render/config/pokemon/type/types.config.js";
import { drawText } from "../../../shareds/utils/font/drawText.utils.js";
import { textParams } from "../../../shareds/utils/font/font.utils.js";

export class Move {
  constructor(move, slotConfig = null) {
    this.move = move;
    this.slotConfig = slotConfig;
  }

  drawMoveType(context) {
    const TYPES = TYPES_CONFIG;

    context.drawImage(
      TYPES[this.move.type].image,
      this.slotConfig.positionX,
      this.slotConfig.positionY,
      TYPES.dimensions.width * TYPES.dimensions.scale,
      TYPES.dimensions.height * TYPES.dimensions.scale
    );
  }

  moveName(context) {
    drawText(
      context,
      this.move.name,
      this.slotConfig.positionX + 40,
      this.slotConfig.positionY
    );
  }

  moveCurrentPP(context) {
    drawText(
      context,
      this.move.currentPP,
      this.slotConfig.positionX + 80,
      this.slotConfig.positionY + this.slotConfig.height / 2
    );
  }

  moveMaxPP(context) {
    drawText(
      context,
      this.move.maxPP,
      this.slotConfig.positionX + 110,
      this.slotConfig.positionY + this.slotConfig.height / 2
    );
  }

  draw(context) {
    this.drawMoveType(context);

    textParams(context, "20");

    this.moveName(context);

    drawText(
      context,
      "PP",
      this.slotConfig.positionX + 60,
      this.slotConfig.positionY + this.slotConfig.height / 2
    );

    this.moveCurrentPP(context);

    drawText(
      context,
      "/",
      this.slotConfig.positionX + 100,
      this.slotConfig.positionY + this.slotConfig.height / 2
    );
    this.moveMaxPP(context);
  }

  update(context) {
    this.draw(context);
  }
}
