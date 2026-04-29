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

  draw(game) {
    const canvas = game.canvas;
    const timeManager = game.timeManager;
    const map = game.mapManager.currentMap;

    canvas.context.save();

    this.handleSkyColor(timeManager);
    this.updateDarkness(timeManager);

    canvas.context.globalAlpha = this.darkness;
    canvas.context.fillStyle = this.skyColor;
    canvas.context.fillRect(0, 0, canvas.width, canvas.height);

    if (timeManager.isNight()) {
      canvas.context.globalCompositeOperation = "lighter";
      canvas.context.globalAlpha = 0.4;

      map.lights?.streetlamps.forEach((streetlamp) => {
        const gradient = canvas.context.createRadialGradient(
          streetlamp.x + game.camera.offsetX,
          streetlamp.y + game.camera.offsetY,
          0,
          streetlamp.x + game.camera.offsetX,
          streetlamp.y + game.camera.offsetY,
          streetlamp.radius
        );

        gradient.addColorStop(0, "#ffe000");
        gradient.addColorStop(1, "rgba(255, 179, 71,0)");

        canvas.context.fillStyle = gradient;
        const x = streetlamp.x + game.camera.offsetX;
        const y = streetlamp.y + game.camera.offsetY;
        canvas.context.fillRect(x - 60, y - 60, 120, 120);
      });

      map.lights?.windows.forEach((window) => {
        canvas.context.fillStyle = window.color;
        const x = window.x + game.camera.offsetX;
        const y = window.y + game.camera.offsetY;
        canvas.context.fillRect(x, y, window.width, window.height);
      });
    }

    canvas.context.restore();
  }

  update(game) {
    this.draw(game);
  }
}
