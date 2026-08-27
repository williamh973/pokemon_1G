import { SPECIES_DATABASE } from "../../../../../shareds/pokemon/species/species.database.js";
import { drawText } from "../../../../../shareds/utils/font/drawText.utils.js";
import { textParams } from "../../../../../shareds/utils/font/font.utils.js";
import { getExpForLevel } from "../../../../../shareds/utils/pokemon/experience/experience.utils.js";

export class ExpBar {
  constructor(parent, currentExp, pokemon) {
    this.pokemon = pokemon;
    this.position = {
      x: parent.x,
      y: parent.y,
    };
    this.width = 90;
    this.height = 3;
    this.radius = 1;
    this.color = {
      gray: "#494B52",
      blue: "#27ADF5",
    };
    this.isAnimating = false;
    this.currentExp = currentExp;
    this.targetExp = currentExp;
    this.speciesGrowthRate = SPECIES_DATABASE[this.pokemon.id].growthRate;
  }

  setExp(exp) {
    console.log(
      "SET EXP",
      "current:",
      this.currentExp,
      "target avant:",
      this.targetExp,
      "nouvelle target:",
      exp
    );
    if (this.targetExp === exp) return;

    this.targetExp = exp;
    this.isAnimating = true;
  }

  animateExp() {
    if (this.currentExp === this.targetExp) {
      this.isAnimating = false;
      return;
    }

    const speed = 0.5;

    if (this.currentExp > this.targetExp) {
      this.currentExp = Math.max(this.targetExp, this.currentExp - speed);
    } else {
      this.currentExp = Math.min(this.targetExp, this.currentExp + speed);
    }
  }

  isAnimationFinished() {
    return !this.isAnimating;
  }

  getExpPercent() {
    const currentLevelExp = getExpForLevel(
      this.pokemon.level,
      this.speciesGrowthRate
    );

    const nextLevelExp = getExpForLevel(
      this.pokemon.level + 1,
      this.speciesGrowthRate
    );

    const levelExpRange = nextLevelExp - currentLevelExp;
    const currentLevelProgress = this.currentExp - currentLevelExp;

    return currentLevelProgress / levelExpRange;
  }

  drawExp(context) {
    drawText(context, "EXP", this.position.x - 26, this.position.y - 6);
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
    if (this.isAnimating) this.animateExp();

    this.draw(context);
  }
}
