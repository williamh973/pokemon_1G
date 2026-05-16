export class HealthBar {
  constructor(hud, currentHp, maxHp) {
    this.currentHp = currentHp;
    this.maxHp = maxHp;
    this.position = {
      x: hud.position.x + 55,
      y: hud.position.y + 29,
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

  handleHPColor(context, hpPercent) {
    if (hpPercent > 0.5) context.fillStyle = this.color.green;
    else if (hpPercent > 0.2) context.fillStyle = this.color.orange;
    else context.fillStyle = this.color.red;
  }

  draw(context) {
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

    const hpPercent = Math.max(0, this.currentHp / this.maxHp);
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
  }

  update(context) {
    this.draw(context);
  }
}
