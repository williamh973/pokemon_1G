export class PoundAnimation {
  constructor(game, viewers, turnAction) {
    this.game = game;
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

    this.originalAttackerPosition = {
      x: this.attacker.position.x,
      y: this.attacker.position.y,
    };

    this.originalTargetPosition = {
      x: this.target.position.x,
      y: this.target.position.y,
    };

    this.attackerWidth = this.attacker.frameWidth * (this.attacker.scale || 1);

    this.attackerHeight =
      this.attacker.frameHeight * (this.attacker.scale || 1);

    this.targetWidth = this.target.frameWidth * (this.target.scale || 1);

    this.targetHeight = this.target.frameHeight * (this.target.scale || 1);

    this.direction =
      this.originalAttackerPosition.x < this.originalTargetPosition.x ? 1 : -1;

    this.attackerStartX = this.originalAttackerPosition.x;
    this.attackerStartY = this.originalAttackerPosition.y;

    this.attackerEndX = this.attackerStartX + this.direction * 13;

    this.attackerEndY = this.attackerStartY + 5;

    this.targetStartX = this.originalTargetPosition.x;
    this.targetStartY = this.originalTargetPosition.y;

    this.targetEndX = this.targetStartX + this.direction * 9;

    this.targetCenter = {
      x: this.targetStartX + this.targetWidth / 2,
      y: this.targetStartY + this.targetHeight / 2,
    };

    this.attackerCenter = {
      x: this.attackerStartX + this.attackerWidth / 2,
      y: this.attackerStartY + this.attackerHeight / 2,
    };

    this.phase = "WINDUP";
    this.timer = 0;

    this.durations = {
      WINDUP: 12,
      STRIKE: 6,
      IMPACT: 10,
      RECOVERY: 14,
    };

    this.strikeProgress = 0;

    this.impact = {
      active: false,
      progress: 0,
      alpha: 0,
    };

    this.swingParticles = [];
    this.dustParticles = [];
    this.impactParticles = [];

    this.isFinished = false;
  }

  update(context) {
    if (this.isFinished) return;

    this.timer++;

    switch (this.phase) {
      case "WINDUP":
        this.updateWindup();
        break;

      case "STRIKE":
        this.updateStrike();
        break;

      case "IMPACT":
        this.updateImpact();
        break;

      case "RECOVERY":
        this.updateRecovery();
        break;
    }

    this.updateParticles();
  }

  draw(context) {
    if (!context) return;

    this.drawSwing(context);
    this.drawImpact(context);
    this.drawImpactParticles(context);
    this.drawDust(context);
  }

  changePhase(phase) {
    this.phase = phase;
    this.timer = 0;
  }

  // --------------------------------------------------
  // WINDUP
  // --------------------------------------------------

  updateWindup() {
    const progress = Math.min(1, this.timer / this.durations.WINDUP);

    const anticipation = Math.sin((progress * Math.PI) / 2);

    // Le Pokémon recule et se soulève légèrement.
    this.attacker.position.x =
      this.attackerStartX - this.direction * anticipation * 5;

    this.attacker.position.y = this.attackerStartY - anticipation * 4;

    if (progress >= 1) {
      this.changePhase("STRIKE");
    }
  }

  // --------------------------------------------------
  // STRIKE
  // --------------------------------------------------

  updateStrike() {
    const progress = Math.min(1, this.timer / this.durations.STRIKE);

    this.strikeProgress = progress;

    // Coup plongeant avec accélération brutale.
    const eased = this.easeInCubic(progress);

    this.attacker.position.x =
      this.attackerStartX - this.direction * 5 + this.direction * 18 * eased;

    this.attacker.position.y = this.attackerStartY - 4 + 9 * eased;

    if (progress >= 1) {
      this.createImpact();
      this.changePhase("IMPACT");
    }
  }

  // --------------------------------------------------
  // IMPACT
  // --------------------------------------------------

  createImpact() {
    this.impact.active = true;
    this.impact.progress = 0;
    this.impact.alpha = 1;

    this.target.position.x = this.targetEndX;
    this.target.position.y = this.targetStartY + 2;

    if (this.game.canvas?.startShake) {
      this.game.canvas.startShake(6, 180);
    }

    this.createImpactParticles();
    this.createDustParticles();
  }

  createImpactParticles() {
    const centerX = this.targetCenter.x;
    const centerY = this.targetCenter.y;

    // Éclats courts et épais autour du point de collision.
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 * i) / 12 + Math.random() * 0.2;

      const speed = 1.5 + Math.random() * 2.5;

      this.impactParticles.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 2,
        life: 1,
        decay: 0.065,
      });
    }
  }

  createDustParticles() {
    const groundX = this.attacker.position.x + this.attackerWidth / 2;

    const groundY = this.attackerStartY + this.attackerHeight - 1;

    for (let i = 0; i < 12; i++) {
      const angle = Math.PI + Math.random() * Math.PI;
      const speed = 0.8 + Math.random() * 2;

      this.dustParticles.push({
        x: groundX,
        y: groundY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed * 0.5,
        size: 2 + Math.random() * 3,
        life: 1,
        decay: 0.045 + Math.random() * 0.025,
      });
    }
  }

  updateImpact() {
    const progress = Math.min(1, this.timer / this.durations.IMPACT);

    this.impact.progress = progress;
    this.impact.alpha = 1 - progress;

    if (progress >= 1) {
      this.changePhase("RECOVERY");
    }
  }

  // --------------------------------------------------
  // RECOVERY
  // --------------------------------------------------

  updateRecovery() {
    const progress = Math.min(1, this.timer / this.durations.RECOVERY);

    const eased = this.easeOutCubic(progress);

    // Retour de l'attaquant avec un léger rebond.
    const bounce = Math.sin(progress * Math.PI) * 2;

    this.attacker.position.x =
      this.attackerEndX + (this.attackerStartX - this.attackerEndX) * eased;

    this.attacker.position.y = this.attackerStartY + 5 * (1 - eased) - bounce;

    // La cible reprend sa position.
    this.target.position.x =
      this.targetEndX + (this.targetStartX - this.targetEndX) * eased;

    this.target.position.y = this.targetStartY + 2 * (1 - eased);

    if (progress >= 1) {
      this.restorePositions();
      this.isFinished = true;
    }
  }

  // --------------------------------------------------
  // SWING
  // --------------------------------------------------

  drawSwing(context) {
    if (this.phase !== "STRIKE") return;

    const progress = this.strikeProgress;

    if (progress <= 0 || progress >= 1) return;

    const x = this.attackerCenter.x + this.direction * 8;
    const y = this.attackerCenter.y - 8;

    const length = 23 + progress * 12;

    context.save();

    context.globalAlpha = Math.sin(progress * Math.PI) * 0.9;

    // Large arc blanc : trajectoire du coup.
    context.beginPath();

    context.moveTo(x - this.direction * 10, y - 17);

    context.quadraticCurveTo(
      x + this.direction * 12,
      y - 13,
      x + this.direction * length,
      y + 15
    );

    context.strokeStyle = "#FFFFFF";
    context.lineWidth = 7;
    context.lineCap = "round";
    context.stroke();

    // Contour coloré pour renforcer la lisibilité.
    context.beginPath();

    context.moveTo(x - this.direction * 10, y - 17);

    context.quadraticCurveTo(
      x + this.direction * 12,
      y - 13,
      x + this.direction * length,
      y + 15
    );

    context.strokeStyle = "#F5B94B";
    context.lineWidth = 2;
    context.stroke();

    context.restore();
  }

  // --------------------------------------------------
  // IMPACT VISUAL
  // --------------------------------------------------

  drawImpact(context) {
    if (!this.impact.active || this.impact.alpha <= 0) return;

    const x = this.targetCenter.x;
    const y = this.targetCenter.y + 2;

    const progress = this.impact.progress;

    const radius = 8 + progress * 14;

    context.save();

    context.globalAlpha = this.impact.alpha;

    // Onde de choc aplatie.
    context.beginPath();

    context.ellipse(x, y + 7, radius * 1.4, radius * 0.45, 0, 0, Math.PI * 2);

    context.fillStyle = "#F6C65B";
    context.fill();

    // Impact central, plus large et plus compact.
    context.beginPath();

    context.ellipse(x, y, radius, radius * 0.72, 0, 0, Math.PI * 2);

    context.fillStyle = "#FFF5D0";
    context.fill();

    context.strokeStyle = "#E99B35";
    context.lineWidth = 2;
    context.stroke();

    // Traits de collision.
    context.strokeStyle = "#FFFFFF";
    context.lineWidth = 3;
    context.lineCap = "round";

    const impactLines = [
      { x: -1, y: -1, dx: -12, dy: -12 },
      { x: 2, y: 0, dx: 15, dy: -10 },
      { x: 0, y: 3, dx: 12, dy: 13 },
      { x: -2, y: 2, dx: -13, dy: 12 },
    ];

    for (const line of impactLines) {
      context.beginPath();

      context.moveTo(x + line.x * radius * 0.2, y + line.y * radius * 0.2);

      context.lineTo(
        x + line.dx * (1 - progress * 0.3),
        y + line.dy * (1 - progress * 0.3)
      );

      context.stroke();
    }

    context.restore();
  }

  // --------------------------------------------------
  // PARTICLES
  // --------------------------------------------------

  updateParticles() {
    this.impactParticles = this.impactParticles.filter((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      particle.vx *= 0.92;
      particle.vy *= 0.92;

      particle.life -= particle.decay;

      return particle.life > 0;
    });

    this.dustParticles = this.dustParticles.filter((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      particle.vx *= 0.96;
      particle.vy *= 0.96;

      particle.life -= particle.decay;

      return particle.life > 0;
    });
  }

  drawImpactParticles(context) {
    context.save();

    for (const particle of this.impactParticles) {
      context.globalAlpha = particle.life;
      context.fillStyle = "#F5B94B";

      context.beginPath();

      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);

      context.fill();
    }

    context.restore();
  }

  drawDust(context) {
    context.save();

    for (const particle of this.dustParticles) {
      context.globalAlpha = particle.life * 0.7;
      context.fillStyle = "#C8B99B";

      context.beginPath();

      context.ellipse(
        particle.x,
        particle.y,
        particle.size * 1.3,
        particle.size * 0.7,
        0,
        0,
        Math.PI * 2
      );

      context.fill();
    }

    context.restore();
  }

  // --------------------------------------------------
  // UTILITIES
  // --------------------------------------------------

  restorePositions() {
    this.attacker.position.x = this.originalAttackerPosition.x;
    this.attacker.position.y = this.originalAttackerPosition.y;

    this.target.position.x = this.originalTargetPosition.x;
    this.target.position.y = this.originalTargetPosition.y;
  }

  easeInCubic(value) {
    return value * value * value;
  }

  easeOutCubic(value) {
    return 1 - Math.pow(1 - value, 3);
  }
}
