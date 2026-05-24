import { drawText } from "../../../../../shareds/utils/font/drawText.utils.js";
import { textParams } from "../../../../../shareds/utils/font/font.utils.js";
import { getExpForLevel } from "../../../../../shareds/utils/pokemon/experience/experience.utils.js";

export class ExpBar {
  constructor(hud, pokemon) {
    this.pokemon = pokemon;
    this.position = {
      x: hud.position.x + 34,
      y: hud.position.y + 57,
    };
    this.width = 90;
    this.height = 3;
    this.radius = 1;
    this.color = {
      gray: "#494B52",
      blue: "#27ADF5",
    };
  }

  drawExp(context) {
    drawText(context, "EXP", this.position.x - 26, this.position.y - 6);
  }

  getExpPercent() {
    const currentLevelExp = getExpForLevel(
      this.pokemon.level,
      this.pokemon.growthRate
    );

    const nextLevelExp = getExpForLevel(
      this.pokemon.level + 1,
      this.pokemon.growthRate
    );

    const currentExp = this.pokemon.exp;

    return (currentExp - currentLevelExp) / (nextLevelExp - currentLevelExp);
  }

  draw(context) {
    textParams(context, "15", "gold");
    this.drawExp(context);

    context.fillStyle = this.color.gray;

    context.beginPath();
    context.roundRect(
      this.position.x,
      this.position.y,
      this.width,
      this.height,
      this.radius
    );
    context.fill();

    const expPercent = Math.max(0, Math.min(1, this.getExpPercent()));

    const expWidth = this.width * expPercent;

    context.fillStyle = this.color.blue;

    context.beginPath();

    context.roundRect(
      this.position.x,
      this.position.y,
      expWidth,
      this.height,
      2
    );

    context.fill();
  }

  update(context) {
    this.draw(context);
  }
}
