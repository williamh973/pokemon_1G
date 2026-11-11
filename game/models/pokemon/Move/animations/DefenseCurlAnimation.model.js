export class DefenseCurlAnimation {
  constructor(game, viewers, turnAction) {
    this.game = game;
    this.viewers = viewers;
    this.turnAction = turnAction;

    this.pokemonViewer =
      this.viewers.front.slot.content === turnAction.pokemon
        ? this.viewers.front
        : this.viewers.back;

    this.phase = "PREPARE";
    this.timer = 0;
    this.isFinished = false;

    this.duration = {
      PREPARE: 36,
      CURL: 48,
      SHIELD: 45,
      FINISH: 36,
    };

    this.rings = [];
    this.particles = [];

    this.center = this.getPokemonCenter();
  }

  getPokemonCenter() {
    const sprite = this.pokemonViewer.sprite;

    return {
      x: sprite.position.x + (sprite.frameWidth * sprite.scale) / 2,
      y: sprite.position.y + (sprite.frameHeight * sprite.scale) / 2,
    };
  }

  update(context) {
    if (this.isFinished) return;

    this.timer++;

    switch (this.phase) {
      case "PREPARE":
        this.prepare(context);
        break;

      case "CURL":
        this.curl(context);
        break;

      case "SHIELD":
        this.shield(context);
        break;

      case "FINISH":
        this.finish(context);
        break;
    }

    this.draw(context);
  }

  prepare(context) {
    if (this.timer >= this.duration.PREPARE) {
      this.phase = "CURL";
      this.timer = 0;
    }
  }

  curl(context) {
    if (this.timer === 1) {
      this.game.canvas.startShake(8, 2);
    }

    if (this.timer >= this.duration.CURL) {
      this.phase = "SHIELD";
      this.timer = 0;
    }
  }

  shield(context) {
    if (this.timer % 9 === 0) {
      this.createRing();
    }

    if (this.timer % 5 === 0) {
      this.createParticle();
    }

    this.updateEffects();

    if (this.timer >= this.duration.SHIELD) {
      this.phase = "FINISH";
      this.timer = 0;
    }
  }

  finish(context) {
    this.updateEffects();

    if (this.timer >= this.duration.FINISH) {
      this.isFinished = true;
    }
  }

  createRing() {
    this.rings.push({
      radius: 12,
      alpha: 0.8,
      speed: 1.8,
    });
  }

  createParticle() {
    const angle = Math.random() * Math.PI * 2;
    const distance = 25 + Math.random() * 12;

    this.particles.push({
      x: this.center.x + Math.cos(angle) * distance,
      y: this.center.y + Math.sin(angle) * distance,
      vx: Math.cos(angle) * 0.5,
      vy: Math.sin(angle) * 0.5 - 0.5,
      alpha: 1,
      size: 2 + Math.random() * 2,
    });
  }

  updateEffects() {
    this.rings.forEach((ring) => {
      ring.radius += ring.speed;
      ring.alpha -= 0.025;
    });

    this.rings = this.rings.filter((ring) => ring.alpha > 0);

    this.particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.alpha -= 0.035;
    });

    this.particles = this.particles.filter((particle) => particle.alpha > 0);
  }

  draw(context) {
    context.save();

    const progress = this.timer;

    if (this.phase === "PREPARE") {
      this.drawPreparation(context, progress);
    }

    if (this.phase === "CURL") {
      this.drawCurl(context, progress);
    }

    if (this.phase === "SHIELD" || this.phase === "FINISH") {
      this.drawShield(context);
      this.drawRings(context);
      this.drawParticles(context);
    }

    context.restore();
  }

  drawPreparation(context, progress) {
    const pulse = 1 + Math.sin(progress * 0.35) * 0.06;

    context.translate(this.center.x, this.center.y);
    context.scale(pulse, pulse);

    context.beginPath();
    context.ellipse(0, 0, 32, 38, 0, 0, Math.PI * 2);
    context.strokeStyle = "rgba(150, 210, 255, 0.45)";
    context.lineWidth = 2;
    context.stroke();
  }

  drawCurl(context, progress) {
    const intensity = Math.sin((progress / this.duration.CURL) * Math.PI);

    context.beginPath();
    context.ellipse(
      this.center.x,
      this.center.y,
      30 + intensity * 7,
      36 + intensity * 7,
      0,
      0,
      Math.PI * 2
    );

    context.fillStyle = `rgba(120, 190, 255, ${intensity * 0.18})`;
    context.fill();

    context.strokeStyle = `rgba(190, 225, 255, ${intensity * 0.8})`;
    context.lineWidth = 3;
    context.stroke();
  }

  drawShield(context) {
    const fade =
      this.phase === "FINISH"
        ? Math.max(0, 1 - this.timer / this.duration.FINISH)
        : 1;

    const pulse = 1 + Math.sin(this.timer * 0.18) * 0.025;

    context.translate(this.center.x, this.center.y);
    context.scale(pulse, pulse);

    context.beginPath();
    context.ellipse(0, 0, 39, 46, 0, 0, Math.PI * 2);

    context.fillStyle = `rgba(80, 165, 255, ${0.12 * fade})`;
    context.fill();

    context.strokeStyle = `rgba(185, 225, 255, ${0.85 * fade})`;
    context.lineWidth = 3;
    context.stroke();

    context.beginPath();
    context.ellipse(0, 0, 33, 40, 0, 0, Math.PI * 2);
    context.strokeStyle = `rgba(110, 190, 255, ${0.5 * fade})`;
    context.lineWidth = 1.5;
    context.stroke();
  }

  drawRings(context) {
    this.rings.forEach((ring) => {
      context.beginPath();
      context.ellipse(
        this.center.x,
        this.center.y,
        ring.radius * 0.85,
        ring.radius,
        0,
        0,
        Math.PI * 2
      );

      context.strokeStyle = `rgba(160, 215, 255, ${ring.alpha})`;
      context.lineWidth = 2;
      context.stroke();
    });
  }

  drawParticles(context) {
    this.particles.forEach((particle) => {
      context.globalAlpha = particle.alpha;
      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fillStyle = "#d9f0ff";
      context.fill();
    });

    context.globalAlpha = 1;
  }
}
