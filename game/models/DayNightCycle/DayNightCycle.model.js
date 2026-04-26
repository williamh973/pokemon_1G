export class DayNightCycle {
  constructor() {
    this.darkness = 0;
    this.skyColor = null;
  }

  handleSkyColor(timeManager) {
    if (timeManager.isNight()) this.skyColor = "#2c3e50";
  }

  updateDarkness(timeManager) {
    const time = timeManager.normalizedTime;
    this.darkness = 0.3 - Math.sin(time * Math.PI * 2 - Math.PI / 2) * 0.3;
  }

  draw(canvas, timeManager) {
    canvas.context.save();

    this.handleSkyColor(timeManager);
    this.updateDarkness(timeManager);

    canvas.context.globalAlpha = this.darkness;
    canvas.context.fillStyle = this.skyColor;
    canvas.context.fillRect(0, 0, canvas.width, canvas.height);

    canvas.context.restore();
  }

  update(canvas, timeManager) {
    this.draw(canvas, timeManager);
  }
}
