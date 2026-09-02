import { drawBox } from "../../../shareds/utils/box/box.utils.js";
import { drawText } from "../../../shareds/utils/font/drawText.utils.js";
import { textParams } from "../../../shareds/utils/font/font.utils.js";

export class BattleStatsBox {
  constructor(game, pokemon, params, side) {
    this.game = game;
    this.pokemon = pokemon;
    this.stats = this.pokemon.stats;
    this.statStages = this.pokemon.statStages;
    this.params = params;
    this.side = side;
    this.canvas = this.game.canvas;
    this.position = {
      x: params.x,
      y: params.y,
    };
    this.width = 120;
    this.height = 120;
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

    drawBox(
      context,
      this.position.x + this.width + 20,
      this.position.y,
      this.width,
      this.height,
      "black",
      "white"
    );

    this.drawStats(context);
  }

  drawStats(context, paddingX = 20) {
    textParams(context, "20");

    this.drawStatRow(context, "PV", this.stats.hp, paddingX, 15);

    this.drawStatRow(context, "Att", this.stats.attack, paddingX, 30);
    this.drawStatRow(context, "", this.statStages.attack, paddingX + 30, 30);

    this.drawStatRow(context, "Def", this.stats.defense, paddingX, 45);
    this.drawStatRow(context, "", this.statStages.defense, paddingX + 30, 45);

    this.drawStatRow(context, "AttSpc", this.stats.specialAtt, paddingX, 60);
    this.drawStatRow(
      context,
      "",
      this.statStages.specialAtt,
      paddingX + 30,
      60
    );

    this.drawStatRow(context, "DefSpc", this.stats.specialDef, paddingX, 75);
    this.drawStatRow(
      context,
      "",
      this.statStages.specialDef,
      paddingX + 30,
      75
    );

    this.drawStatRow(context, "Spd", this.stats.speed, paddingX, 90);
    this.drawStatRow(context, "", this.statStages.speed, paddingX + 30, 90);

    this.drawStatRow(
      context,
      "accur. stg",
      this.statStages.accuracy,
      paddingX + 30,
      105
    );
  }

  drawStatRow(context, titleStat, stat, paddingX, paddingY) {
    drawText(context, titleStat, this.position.x, this.position.y + paddingY);

    drawText(
      context,
      stat,
      this.position.x + paddingX + 50,
      this.position.y + paddingY
    );
  }

  update(context) {
    if (!this.isOpen) return;

    this.draw(context);
  }
}
