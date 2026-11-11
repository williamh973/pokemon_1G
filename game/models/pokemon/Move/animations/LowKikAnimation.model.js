export class LowKikAnimation {
  static PHASES = {
    PREPARE: "PREPARE",
    SWEEP: "SWEEP",
    FALL: "FALL",
    IMPACT: "IMPACT",
    RECOVER: "RECOVER",
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

    this.targetOriginalX = this.target.position.x;
    this.targetOriginalY = this.target.position.y;

    this.direction =
      this.target.position.x >= this.attacker.position.x ? 1 : -1;

    this.phase = LowKikAnimation.PHASES.PREPARE;
    this.timer = 0;
    this.isFinished = false;

    this.duration = {
      PREPARE: 14,
      SWEEP: 12,
      FALL: 12,
      IMPACT: 18,
      RECOVER: 20,
      FINISH: 8,
    };

    this.targetRotation = 0;
    this.sweepProgress = 0;
    this.attackerOffset = 0;

    this.particles = [];
    this.dustParticles = [];

    this.sweepX = this.originalX + this.attacker.frameWidth / 2;
    this.sweepY = this.originalY + this.attacker.frameHeight - 3;

    this.impactX = this.targetOriginalX + this.target.frameWidth / 2;
    this.impactY = this.targetOriginalY + this.target.frameHeight - 3;
  }

  update(context) {
    if (this.isFinished) return;

    switch (this.phase) {
      case LowKikAnimation.PHASES.PREPARE:
        this.updatePrepare();
        break;

      case LowKikAnimation.PHASES.SWEEP:
        this.updateSweep();
        break;

      case LowKikAnimation.PHASES.FALL:
        this.updateFall();
        break;

      case LowKikAnimation.PHASES.IMPACT:
        this.updateImpact();
        break;

      case LowKikAnimation.PHASES.RECOVER:
        this.updateRecover();
        break;

      case LowKikAnimation.PHASES.FINISH:
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

    // L'attaquant abaisse légèrement son corps.
    this.attacker.position.x = this.originalX - this.direction * progress * 3;

    this.attacker.position.y = this.originalY + progress * 3;

    if (this.timer >= this.duration.PREPARE) {
      this.setPhase(LowKikAnimation.PHASES.SWEEP);
    }
  }

  updateSweep() {
    const progress = Math.min(this.timer / this.duration.SWEEP, 1);
    const eased = this.easeOut(progress);

    // Petit mouvement vers l'adversaire.
    this.attacker.position.x = this.originalX + this.direction * eased * 13;

    this.attacker.position.y =
      this.originalY + 3 - Math.sin(progress * Math.PI) * 3;

    this.sweepProgress = progress;

    if (this.timer % 2 === 0) {
      this.createSweepParticles();
    }

    if (this.timer >= this.duration.SWEEP) {
      this.setPhase(LowKikAnimation.PHASES.FALL);
    }
  }

  updateFall() {
    const progress = Math.min(this.timer / this.duration.FALL, 1);
    const eased = this.easeInOut(progress);

    // La cible perd son équilibre et tombe vers l'arrière.
    this.targetRotation = -this.direction * (Math.PI / 2) * eased;

    if (this.timer >= this.duration.FALL) {
      this.targetRotation = -this.direction * (Math.PI / 2);

      this.createDust();
      this.game.canvas.startShake(9, 3);

      this.setPhase(LowKikAnimation.PHASES.IMPACT);
    }
  }

  updateImpact() {
    if (this.timer % 4 === 0) {
      this.createDust();
    }

    if (this.timer >= this.duration.IMPACT) {
      this.setPhase(LowKikAnimation.PHASES.RECOVER);
    }
  }

  updateRecover() {
    const progress = Math.min(this.timer / this.duration.RECOVER, 1);
    const eased = this.easeOut(progress);

    // Le Pokémon se relève progressivement.
    this.targetRotation = -this.direction * (Math.PI / 2) * (1 - eased);

    this.attacker.position.x =
      this.originalX + this.direction * 13 * (1 - eased);

    this.attacker.position.y = this.originalY + 3 * (1 - eased);

    if (this.timer >= this.duration.RECOVER) {
      this.restorePositions();
      this.setPhase(LowKikAnimation.PHASES.FINISH);
    }
  }

  updateFinish() {
    if (this.timer >= this.duration.FINISH) {
      this.restorePositions();
      this.isFinished = true;
    }
  }

  restorePositions() {
    this.attacker.position.x = this.originalX;
    this.attacker.position.y = this.originalY;

    this.target.position.x = this.targetOriginalX;
    this.target.position.y = this.targetOriginalY;

    this.targetRotation = 0;
  }

  createSweepParticles() {
    for (let i = 0; i < 3; i++) {
      this.particles.push({
        x: this.sweepX + this.direction * (Math.random() * 25),
        y: this.sweepY + (Math.random() - 0.5) * 5,
        vx: this.direction * (1.5 + Math.random() * 2),
        vy: -Math.random() * 1.2,
        size: 1.5 + Math.random() * 2,
        life: 10,
        maxLife: 10,
        color: "#e5edf2",
      });
    }
  }

  createDust() {
    for (let i = 0; i < 12; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.8 + Math.random() * 2.5;

      this.dustParticles.push({
        x: this.impactX + (Math.random() - 0.5) * 15,
        y: this.impactY,
        vx: Math.cos(angle) * speed,
        vy: -Math.abs(Math.sin(angle) * speed) - 0.5,
        size: 2 + Math.random() * 3,
        life: 20 + Math.random() * 10,
        maxLife: 30,
      });
    }
  }

  updateParticles() {
    for (const particle of this.particles) {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += 0.05;
      particle.life--;
    }

    this.particles = this.particles.filter((particle) => particle.life > 0);

    for (const particle of this.dustParticles) {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += 0.1;
      particle.vx *= 0.96;
      particle.life--;
    }

    this.dustParticles = this.dustParticles.filter(
      (particle) => particle.life > 0
    );
  }

  draw(context) {
    this.drawSweep(context);
    this.drawImpact(context);
    this.drawParticles(context);
    this.drawDust(context);
  }

  drawSweep(context) {
    if (this.phase !== LowKikAnimation.PHASES.SWEEP) return;

    const progress = this.sweepProgress;

    const startX = this.sweepX - this.direction * 12;
    const endX = startX + this.direction * progress * 45;

    context.save();

    context.globalAlpha = 1 - progress * 0.5;
    context.strokeStyle = "#e7f3f7";
    context.lineWidth = 4;
    context.lineCap = "round";
    context.shadowColor = "#ffffff";
    context.shadowBlur = 10;

    context.beginPath();
    context.moveTo(startX, this.sweepY);
    context.lineTo(endX, this.sweepY);
    context.stroke();

    context.restore();
  }

  drawImpact(context) {
    if (this.phase !== LowKikAnimation.PHASES.IMPACT) return;

    const progress = Math.min(this.timer / this.duration.IMPACT, 1);
    const radius = 8 + progress * 24;
    const alpha = 1 - progress;

    context.save();

    context.globalAlpha = alpha;
    context.strokeStyle = "#e8e0d0";
    context.lineWidth = 3;

    context.beginPath();
    context.ellipse(
      this.impactX,
      this.impactY,
      radius,
      radius * 0.3,
      0,
      0,
      Math.PI * 2
    );
    context.stroke();

    context.restore();
  }

  drawParticles(context) {
    context.save();

    for (const particle of this.particles) {
      context.globalAlpha = particle.life / particle.maxLife;
      context.fillStyle = particle.color;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fill();
    }

    context.restore();
  }

  drawDust(context) {
    context.save();

    for (const particle of this.dustParticles) {
      context.globalAlpha = particle.life / particle.maxLife;
      context.fillStyle = "#b8aa91";

      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fill();
    }

    context.restore();
  }

  drawTarget(context) {
    const sprite = this.target;

    const pivotX = sprite.position.x + sprite.frameWidth / 2;
    const pivotY = sprite.position.y + sprite.frameHeight;

    context.save();

    context.translate(pivotX, pivotY);
    context.rotate(this.targetRotation);
    context.translate(-pivotX, -pivotY);

    this.targetViewer.update(context);

    context.restore();
  }
}
