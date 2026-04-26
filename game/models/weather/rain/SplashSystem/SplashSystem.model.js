export class SplashSystem {
  constructor() {
    this.particles = [];
  }

  spawn(x, y) {
    for (let i = 0; i < 4; i++) {
      this.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 1.5,
        vy: -Math.random() * 1.5,
        life: 20,
      });
    }
  }

  update(context) {
    this.particles = this.particles.filter((p) => p.life > 0);

    this.particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.05;
      p.life--;

      context.globalAlpha = p.life / 20;
      context.fillStyle = "#a8d0ff";
      context.fillRect(p.x, p.y, 3, 4);
    });

    context.globalAlpha = 1;
  }
}
