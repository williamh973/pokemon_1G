export class WithdrawAnimation {
  static PHASES = {
    PREPARE: "PREPARE",
    RETRACT: "RETRACT",
    PROTECT: "PROTECT",
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

    this.originalX = this.attacker.position.x;
    this.originalY = this.attacker.position.y;
    this.originalRotation = this.attacker.rotation;

    this.phase = WithdrawAnimation.PHASES.PREPARE;
    this.timer = 0;
    this.isFinished = false;

    this.duration = {
      PREPARE: 10,
      RETRACT: 14,
      PROTECT: 24,
      RECOVER: 16,
      FINISH: 6,
    };

    this.contraction = 0;
    this.auraOpacity = 0;
    this.auraRadius = 0;
    this.particles = [];
    this.rings = [];

    this.centerX =
      this.originalX + (this.attacker.frameWidth * this.attacker.scale) / 2;

    this.centerY =
      this.originalY + (this.attacker.frameHeight * this.attacker.scale) / 2;
  }

  update(context) {
    if (this.isFinished) return;

    switch (this.phase) {
      case WithdrawAnimation.PHASES.PREPARE:
        this.updatePrepare();
        break;

      case WithdrawAnimation.PHASES.RETRACT:
        this.updateRetract();
        break;

      case WithdrawAnimation.PHASES.PROTECT:
        this.updateProtect();
        break;

      case WithdrawAnimation.PHASES.RECOVER:
        this.updateRecover();
        break;

      case WithdrawAnimation.PHASES.FINISH:
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

    // Le Pokémon abaisse son corps.
    this.attacker.position.y = this.originalY + progress * 3;

    this.attacker.rotation =
      this.originalRotation + Math.sin(progress * Math.PI) * 0.06;

    if (this.timer >= this.duration.PREPARE) {
      this.setPhase(WithdrawAnimation.PHASES.RETRACT);
    }
  }

  updateRetract() {
    const progress = Math.min(this.timer / this.duration.RETRACT, 1);

    const eased = this.easeOut(progress);

    this.contraction = eased;

    // Le Pokémon se replie sur lui-même.
    this.attacker.position.y = this.originalY + 3 + eased * 3;

    this.attacker.rotation =
      this.originalRotation + Math.sin(progress * Math.PI) * 0.1;

    this.auraOpacity = eased * 0.45;
    this.auraRadius = 10 + eased * 12;

    if (this.timer % 3 === 0) {
      this.createParticles();
    }

    if (this.timer >= this.duration.RETRACT) {
      this.createRing();
      this.setPhase(WithdrawAnimation.PHASES.PROTECT);
    }
  }

  updateProtect() {
    const progress = Math.min(this.timer / this.duration.PROTECT, 1);

    // Aura stable avec une légère pulsation.
    const pulse = Math.sin(this.timer * 0.25);

    this.contraction = 1;
    this.auraOpacity = 0.38 + pulse * 0.08;
    this.auraRadius = 22 + pulse * 2;

    if (this.timer % 8 === 0) {
      this.createRing();
    }

    if (this.timer % 4 === 0) {
      this.createParticles();
    }

    if (progress >= 1) {
      this.setPhase(WithdrawAnimation.PHASES.RECOVER);
    }
  }

  updateRecover() {
    const progress = Math.min(this.timer / this.duration.RECOVER, 1);

    const eased = this.easeOut(progress);

    // Le Pokémon reprend progressivement sa posture.
    this.contraction = 1 - eased;
    this.auraOpacity = 0.38 * (1 - eased);
    this.auraRadius = 22 * (1 - eased);

    this.attacker.position.y = this.originalY + 6 * (1 - eased);

    this.attacker.rotation =
      this.originalRotation + Math.sin(progress * Math.PI) * 0.1 * (1 - eased);

    if (this.timer >= this.duration.RECOVER) {
      this.restoreAttacker();
      this.setPhase(WithdrawAnimation.PHASES.FINISH);
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

    this.contraction = 0;
    this.auraOpacity = 0;
  }

  createParticles() {
    const angle = Math.random() * Math.PI * 2;
    const radius = 18 + Math.random() * 12;

    this.particles.push({
      x: this.centerX + Math.cos(angle) * radius,
      y: this.centerY + Math.sin(angle) * radius,
      vx: -Math.cos(angle) * (0.4 + Math.random()),
      vy: -Math.sin(angle) * (0.4 + Math.random()),
      size: 1.5 + Math.random() * 2,
      life: 20,
      maxLife: 20,
    });
  }

  createRing() {
    this.rings.push({
      radius: 10,
      life: 20,
      maxLife: 20,
    });
  }

  updateParticles() {
    for (const particle of this.particles) {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life--;
    }

    this.particles = this.particles.filter((particle) => particle.life > 0);

    for (const ring of this.rings) {
      ring.radius += 1.2;
      ring.life--;
    }

    this.rings = this.rings.filter((ring) => ring.life > 0);
  }

  draw(context) {
    this.drawAura(context);
    this.drawRings(context);
    this.drawParticles(context);
  }

  drawAura(context) {
    if (this.auraOpacity <= 0) return;

    context.save();

    const radius = this.auraRadius;

    const gradient = context.createRadialGradient(
      this.centerX,
      this.centerY,
      2,
      this.centerX,
      this.centerY,
      radius
    );

    gradient.addColorStop(0, "rgba(100, 190, 255, 0.12)");
    gradient.addColorStop(0.65, "rgba(65, 160, 255, 0.16)");
    gradient.addColorStop(1, "rgba(65, 160, 255, 0)");

    context.globalAlpha = this.auraOpacity;
    context.fillStyle = gradient;

    context.beginPath();
    context.ellipse(
      this.centerX,
      this.centerY,
      radius * 0.8,
      radius,
      0,
      0,
      Math.PI * 2
    );
    context.fill();

    context.restore();
  }

  drawRings(context) {
    context.save();

    for (const ring of this.rings) {
      context.globalAlpha = ring.life / ring.maxLife;
      context.strokeStyle = "#8bd5ff";
      context.lineWidth = 2;
      context.shadowColor = "#55baff";
      context.shadowBlur = 8;

      context.beginPath();
      context.ellipse(
        this.centerX,
        this.centerY,
        ring.radius * 1.3,
        ring.radius * 0.65,
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
      context.fillStyle = "#a9e4ff";
      context.shadowColor = "#55baff";
      context.shadowBlur = 7;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fill();
    }

    context.restore();
  }
}
