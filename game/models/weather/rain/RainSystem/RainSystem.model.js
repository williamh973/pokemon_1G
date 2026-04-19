export class RainSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.drops = [];
    this.maxDrops = 120;
    this.active = false;
    this.intensity = 0;
    this.targetIntensity = 0;
    this.wind = 1;
    this.speed = 4;
    this.lightningCooldown = 0;
    this.flashAlpha = 0;

    this.initDrops();
  }

  initDrops() {
    this.drops = Array.from({ length: this.maxDrops }, () => ({
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      speed: this.speed + Math.random() * 2,
    }));
  }

  start(intensity) {
    this.active = true;
    this.targetIntensity = intensity;
  }

  stop() {
    this.targetIntensity = 0;
  }

  update(context) {
    this.intensity += (this.targetIntensity - this.intensity) * 0.02;

    if (this.intensity < 0.01 && this.targetIntensity === 0) {
      this.active = false;
      return;
    }
    this.updateRain();
    this.updateLightning();
    this.draw(context);
  }

  updateRain() {
    const activeDrops = Math.floor(this.maxDrops * this.intensity);

    for (let i = 0; i < activeDrops; i++) {
      const drop = this.drops[i];

      drop.y += drop.speed;
      drop.x += this.wind;

      if (drop.y > this.canvas.height) {
        drop.y = -5;
        drop.x = Math.random() * this.canvas.width;
      }

      if (drop.x > this.canvas.width) drop.x = 0;
    }
  }

  updateLightning() {
    if (this.intensity < 0.7) return;

    if (this.lightningCooldown > 0) {
      this.lightningCooldown--;
      return;
    }

    if (Math.random() < 0.0005) {
      this.flashAlpha = 0.8;
      this.lightningCooldown = 5;
    }

    if (this.flashAlpha > 0) this.flashAlpha *= 0.9;
  }

  draw(context) {
    context.save();
    context.globalAlpha = 0.8 * this.intensity;
    context.fillStyle = "#a8d0ff";

    const activeDrops = Math.floor(this.maxDrops * this.intensity);

    for (let i = 0; i < activeDrops; i++) {
      const d = this.drops[i];
      context.fillRect(d.x, d.y, 1, 10);
    }

    context.restore();

    context.save();
    context.fillStyle = `rgba(0,0,40,${0.2 * this.intensity})`;
    context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    context.restore();

    if (this.flashAlpha > 0) {
      context.save();
      context.fillStyle = `rgba(255,255,255,${this.flashAlpha})`;
      context.fillRect(0, 0, this.canvas.width, this.canvas.height);
      context.restore();
    }
  }
}
