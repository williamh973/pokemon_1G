export class MawashiGeriAnimation {
  static PHASES = {
    PREPARE: "PREPARE",
    ROTATE: "ROTATE",
    STRIKE: "STRIKE",
    IMPACT: "IMPACT",
    RETURN: "RETURN",
    FINISH: "FINISH",
  };

  constructor(game, viewers, turnAction) {
    this.game = game;
    this.viewers = viewers;
    this.turnAction = turnAction;

    if (viewers.front.slot.content === turnAction.pokemon) {
      this.pokemonViewer = viewers.front;
      this.targetViewer = viewers.back;
    } else {
      this.pokemonViewer = viewers.back;
      this.targetViewer = viewers.front;
    }

    this.attacker = this.pokemonViewer.sprite;
    this.target = this.targetViewer.sprite;

    this.originalX = this.attacker.position.x;
    this.originalY = this.attacker.position.y;
    this.originalRotation = this.attacker.rotation;

    this.direction = this.target.position.x > this.attacker.position.x ? 1 : -1;

    this.phase = MawashiGeriAnimation.PHASES.PREPARE;
    this.timer = 0;
    this.isFinished = false;

    this.duration = {
      PREPARE: 12,
      ROTATE: 10,
      STRIKE: 6,
      IMPACT: 14,
      RETURN: 14,
      FINISH: 6,
    };

    this.particles = [];
    this.shockwaves = [];

    this.impactX =
      this.target.position.x + (this.target.frameWidth * this.target.scale) / 2;

    this.impactY =
      this.target.position.y +
      (this.target.frameHeight * this.target.scale) / 2;
  }

  update(context) {
    if (this.isFinished) return;

    switch (this.phase) {
      case MawashiGeriAnimation.PHASES.PREPARE:
        this.updatePrepare();
        break;

      case MawashiGeriAnimation.PHASES.ROTATE:
        this.updateRotate();
        break;

      case MawashiGeriAnimation.PHASES.STRIKE:
        this.updateStrike();
        break;

      case MawashiGeriAnimation.PHASES.IMPACT:
        this.updateImpact();
        break;

      case MawashiGeriAnimation.PHASES.RETURN:
        this.updateReturn();
        break;

      case MawashiGeriAnimation.PHASES.FINISH:
        this.updateFinish();
        break;
    }

    this.updateParticles();
    this.draw(context);

    this.timer++;
  }

  setPhase(phase) {
    this.phase = phase;
    this.timer = 0;
  }

  easeOut(value) {
    return 1 - Math.pow(1 - value, 3);
  }

  easeInOut(value) {
    return value < 0.5
      ? 4 * value * value * value
      : 1 - Math.pow(-2 * value + 2, 3) / 2;
  }

  updatePrepare() {
    const progress = Math.min(this.timer / this.duration.PREPARE, 1);

    // Le Pokémon prend appui avant son coup.
    this.attacker.position.x = this.originalX - this.direction * progress * 4;

    this.attacker.position.y =
      this.originalY + Math.sin((progress * Math.PI) / 2) * 3;

    this.attacker.rotation = this.direction * progress * 0.12;

    if (this.timer >= this.duration.PREPARE) {
      this.setPhase(MawashiGeriAnimation.PHASES.ROTATE);
    }
  }

  updateRotate() {
    const progress = Math.min(this.timer / this.duration.ROTATE, 1);
    const eased = this.easeInOut(progress);

    // Rotation rapide du corps pour préparer le coup circulaire.
    this.attacker.rotation = this.direction * (0.12 + eased * 0.85);

    this.attacker.position.x =
      this.originalX - this.direction * 4 + this.direction * eased * 8;

    this.attacker.position.y =
      this.originalY + 3 - Math.sin(progress * Math.PI) * 5;

    if (progress > 0.4 && this.timer % 2 === 0) {
      this.createTrail();
    }

    if (this.timer >= this.duration.ROTATE) {
      this.setPhase(MawashiGeriAnimation.PHASES.STRIKE);
    }
  }

  updateStrike() {
    const progress = Math.min(this.timer / this.duration.STRIKE, 1);
    const eased = this.easeOut(progress);

    // Extension du mouvement vers l'adversaire.
    this.attacker.rotation = this.direction * (0.97 - eased * 0.35);

    this.attacker.position.x =
      this.originalX + this.direction * (4 + eased * 13);

    this.attacker.position.y =
      this.originalY - 2 - Math.sin(progress * Math.PI) * 5;

    if (this.timer % 2 === 0) {
      this.createTrail();
    }

    if (this.timer >= this.duration.STRIKE) {
      this.createImpact();
      this.game.canvas.startShake(10, 4);

      this.setPhase(MawashiGeriAnimation.PHASES.IMPACT);
    }
  }

  updateImpact() {
    if (this.timer % 3 === 0) {
      this.createSparks();
    }

    if (this.timer >= this.duration.IMPACT) {
      this.setPhase(MawashiGeriAnimation.PHASES.RETURN);
    }
  }

  updateReturn() {
    const progress = Math.min(this.timer / this.duration.RETURN, 1);
    const eased = this.easeOut(progress);

    this.attacker.rotation = this.direction * 0.62 * (1 - eased);

    this.attacker.position.x =
      this.originalX + this.direction * 17 * (1 - eased);

    this.attacker.position.y = this.originalY - 2 * (1 - eased);

    if (this.timer >= this.duration.RETURN) {
      this.restoreAttacker();
      this.setPhase(MawashiGeriAnimation.PHASES.FINISH);
    }
  }

  updateFinish() {
    if (this.timer >= this.duration.FINISH) {
      this.restoreAttacker();
      this.isFinished = true;
    }
  }

  restoreAttacker() {
    this.attacker.position.x = this.originalX;
    this.attacker.position.y = this.originalY;
    this.attacker.rotation = this.originalRotation;
  }

  createTrail() {
    const width = this.attacker.frameWidth * this.attacker.scale;
    const height = this.attacker.frameHeight * this.attacker.scale;

    const centerX = this.attacker.position.x + width / 2;
    const centerY = this.attacker.position.y + height / 2;

    this.particles.push({
      x: centerX + this.direction * (8 + Math.random() * 12),
      y: centerY + (Math.random() - 0.5) * 15,
      vx: this.direction * (1 + Math.random() * 2),
      vy: (Math.random() - 0.5) * 2,
      size: 2 + Math.random() * 3,
      life: 12,
      maxLife: 12,
    });
  }

  createImpact() {
    this.shockwaves.push({
      x: this.impactX,
      y: this.impactY,
      radius: 5,
      life: 12,
      maxLife: 12,
    });

    this.createSparks();
  }

  createSparks() {
    for (let i = 0; i < 5; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 3;

      this.particles.push({
        x: this.impactX,
        y: this.impactY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 2,
        life: 14,
        maxLife: 14,
      });
    }
  }

  updateParticles() {
    for (const particle of this.particles) {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vx *= 0.94;
      particle.vy *= 0.94;
      particle.life--;
    }

    this.particles = this.particles.filter((particle) => particle.life > 0);

    for (const wave of this.shockwaves) {
      wave.radius += 3;
      wave.life--;
    }

    this.shockwaves = this.shockwaves.filter((wave) => wave.life > 0);
  }

  draw(context) {
    this.drawShockwaves(context);
    this.drawParticles(context);
  }

  drawShockwaves(context) {
    context.save();

    for (const wave of this.shockwaves) {
      context.globalAlpha = wave.life / wave.maxLife;
      context.strokeStyle = "#fff1cf";
      context.lineWidth = 3;

      context.beginPath();
      context.ellipse(
        wave.x,
        wave.y,
        wave.radius,
        wave.radius * 0.55,
        0,
        0,
        Math.PI * 2
      );
      context.stroke();
    }

    context.restore();
  }

  drawParticles(context) {
    context.save();

    for (const particle of this.particles) {
      context.globalAlpha = particle.life / particle.maxLife;
      context.fillStyle = "#ffe5a3";
      context.shadowColor = "#ffb347";
      context.shadowBlur = 8;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fill();
    }

    context.restore();
  }
}
