import { drawText } from "../../../../../shareds/utils/font/drawText.utils.js";
import { textParams } from "../../../../../shareds/utils/font/font.utils.js";

export class HealthBar {
  constructor(parent, currentHp, maxHp) {
    this.currentHp = currentHp;
    this.targetHp = currentHp;
    this.maxHp = maxHp;
    this.isAnimating = false;

    this.position = {
      x: parent.x,
      y: parent.y,
    };
    this.width = 70;
    this.height = 5;
    this.radius = this.height / 2;
    this.color = {
      green: "#48d048",
      orange: "#f0c040",
      red: "#e04040",
    };
  }

  setHp(hp) {
    if (this.targetHp === hp) return;

    this.targetHp = hp;
    this.isAnimating = true;
  }

  animateHp() {
    if (this.currentHp === this.targetHp) {
      this.isAnimating = false;
      return;
    }

    const speed = 0.15;

    if (this.currentHp > this.targetHp) {
      this.currentHp = Math.max(this.targetHp, this.currentHp - speed);
    } else {
      this.currentHp = Math.min(this.targetHp, this.currentHp + speed);
    }
  }

  isAnimationFinished() {
    return !this.isAnimating;
  }

  handleHPColor(context, hpPercent) {
    if (hpPercent > 0.5) context.fillStyle = this.color.green;
    else if (hpPercent > 0.2) context.fillStyle = this.color.orange;
    else context.fillStyle = this.color.red;
  }

  draw(context) {
    context.strokeStyle = "white";
    context.lineWidth = 2;
    context.strokeRect(
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );

    context.fillStyle = "#3a3a3a";
    context.beginPath();
    context.roundRect(
      this.position.x,
      this.position.y,
      this.width,
      this.height,
      this.radius
    );
    context.fill();

    const hpPercent = Math.min(1, Math.max(0, this.currentHp / this.maxHp));
    const hpWidth = this.width * hpPercent;

    this.handleHPColor(context, hpPercent);

    context.beginPath();

    context.roundRect(
      this.position.x,
      this.position.y,
      hpWidth,
      this.height,
      this.radius
    );
    context.fill();

    this.drawHP(context);
  }

  drawHP(context) {
    textParams(context, "18", "white");
    drawText(context, "PV", this.position.x - 20, this.position.y - 7);

    const displayedHp = Math.ceil(this.currentHp);
    const currentHpWidth = context.measureText(displayedHp).width;

    drawText(
      context,
      displayedHp,
      this.position.x + this.width / 2 - currentHpWidth - 7,
      this.position.y + 5
    );

    drawText(
      context,
      "/",
      this.position.x + this.width / 2 - 2,
      this.position.y + 5
    );

    drawText(
      context,
      this.maxHp,
      this.position.x + this.width / 2 + 8,
      this.position.y + 5
    );
  }

  update(context) {
    this.animateHp();
    this.draw(context);
  }
}
