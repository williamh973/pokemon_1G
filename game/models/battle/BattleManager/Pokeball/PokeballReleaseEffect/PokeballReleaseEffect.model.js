export class PokeballReleaseEffect {
  constructor(x, y) {
    this.position = { x, y };

    this.flashAlpha = 1;
    this.radius = 10;

    this.particles = [];

    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 * i) / 12;

      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * 3,
        vy: Math.sin(angle) * 3,
        alpha: 1,
        size: 4,
      });
    }

    this.isFinished = false;
  }

  update(context) {
    if (this.isFinished) return;

    this.draw(context);

    this.radius += 5;
    this.flashAlpha -= 0.05;

    for (const particle of this.particles) {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.alpha -= 0.03;
    }

    if (this.flashAlpha <= 0) {
      this.isFinished = true;
    }
  }

  draw(context) {
    // Flash central
    context.save();

    context.globalAlpha = Math.max(this.flashAlpha, 0);

    context.beginPath();
    context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);

    context.fillStyle = "white";
    context.fill();

    context.restore();

    // Particules
    for (const particle of this.particles) {
      context.save();

      context.globalAlpha = Math.max(particle.alpha, 0);

      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);

      context.fillStyle = "white";
      context.fill();

      context.restore();
    }
  }
}
