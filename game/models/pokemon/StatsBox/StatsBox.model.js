import { drawBox } from "../../../shareds/utils/box/box.utils.js";
import { drawText } from "../../../shareds/utils/font/drawText.utils.js";
import { textParams } from "../../../shareds/utils/font/font.utils.js";

export class StatsBox {
  constructor(game, stats, params) {
    this.game = game;
    this.pastStats = stats.pastStats;
    this.newStats = stats.newStats;
    this.params = params;
    this.canvas = this.game.canvas;
    this.position = {
      x: params.x,
      y: params.y,
    };
    this.width = this.canvas.width / 1.5;
    this.height = this.canvas.height / 1.5;
    this.isOpen = true;
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

    this.drawStats(context);
  }

  drawStats(context, paddingX = 35) {
    textParams(context, "22");

    this.drawStatRow(
      context,
      "PV",
      this.pastStats.hp,
      this.newStats.hp,
      paddingX,
      15
    );

    this.drawStatRow(
      context,
      "Att",
      this.pastStats.attack,
      this.newStats.attack,
      paddingX,
      40
    );

    this.drawStatRow(
      context,
      "Def",
      this.pastStats.defense,
      this.newStats.defense,
      paddingX,
      65
    );

    this.drawStatRow(
      context,
      "AttSpc",
      this.pastStats.specialAtt,
      this.newStats.specialAtt,
      paddingX,
      90
    );

    this.drawStatRow(
      context,
      "DefSpc",
      this.pastStats.specialDef,
      this.newStats.specialDef,
      paddingX,
      115
    );

    this.drawStatRow(
      context,
      "Spd",
      this.pastStats.speed,
      this.newStats.speed,
      paddingX,
      140
    );
  }

  drawStatRow(context, titleStat, pastStat, newStat, paddingX, paddingY) {
    drawText(
      context,
      titleStat,
      this.position.x + 20,
      this.position.y + paddingY
    );

    drawText(
      context,
      pastStat,
      this.position.x + paddingX + 60,
      this.position.y + paddingY
    );

    drawText(
      context,
      "=>",
      this.position.x + paddingX + 95,
      this.position.y + paddingY
    );

    drawText(
      context,
      newStat,
      this.position.x + paddingX + 130,
      this.position.y + paddingY
    );
  }

  update(context, action) {
    if (!this.isOpen) return;

    this.draw(context);
  }
}
