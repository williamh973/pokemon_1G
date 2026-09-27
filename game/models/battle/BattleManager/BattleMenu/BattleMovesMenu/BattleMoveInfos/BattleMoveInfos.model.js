import { TYPES_LOGO_CONFIG } from "../../../../../../render/config/pokemon/type/typesLogo.config.js";
import { drawBox } from "../../../../../../shareds/utils/box/box.utils.js";
import { drawText } from "../../../../../../shareds/utils/font/drawText.utils.js";
import { textParams } from "../../../../../../shareds/utils/font/font.utils.js";

export class BattleMoveInfo {
  constructor() {
    this.move = null;

    this.config = {
      positionX: 233,
      positionY: 257,
      width: 82,
      height: 62,
    };
  }

  setMove(move) {
    this.move = move;
  }

  drawMoveType(context) {
    const LOGO = TYPES_LOGO_CONFIG;
    const textWidth = context.measureText(LOGO[this.move.type].image).width;

    context.drawImage(
      LOGO[this.move.type].image,
      this.config.positionX + this.config.width / 2 - 17,
      this.config.positionY + 8,
      LOGO.dimensions.width * LOGO.dimensions.scale,
      LOGO.dimensions.height * LOGO.dimensions.scale
    );
  }

  drawPP(context) {
    textParams(context, "18", "rgb(255, 255, 255, 0.9)");
    const textWidth = context.measureText(
      `PP ${this.move.currentPP}/${this.move.maxPP}`
    ).width;

    drawText(
      context,
      `PP ${this.move.currentPP}/${this.move.maxPP}`,
      this.config.positionX + this.config.width / 2 - textWidth / 2,
      this.config.positionY + 35
    );
  }

  draw(context) {
    if (!this.move) return;

    const { positionX, positionY, width, height } = this.config;

    drawBox(
      context,
      positionX,
      positionY,
      width,
      height,
      "rgba(120, 170, 220, 0.35)",
      "rgba(30, 60, 100, 1)"
    );

    this.drawMoveType(context);
    this.drawPP(context);
  }

  update(context) {
    this.draw(context);
  }
}
