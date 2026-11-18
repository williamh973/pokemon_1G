export class SonicBoomAnimation {
  static PHASES = {
    PREPARE: "PREPARE",
    CHARGE: "CHARGE",
    PROPAGATION: "PROPAGATION",
    IMPACT: "IMPACT",
    DISSIPATION: "DISSIPATION",
    RETURN: "RETURN",
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

    this.phase = SonicBoomAnimation.PHASES.PREPARE;
    this.timer = 0;
    this.isFinished = false;

    this.direction =
      this.target.position.x >= this.attacker.position.x ? 1 : -1;

    this.originX = 0;
    this.originY = 0;

    this.targetX = 0;
    this.targetY = 0;

    this.waveX = 0;
    this.waveY = 0;

    this.waveProgress = 0;
    this.impactFlash = 0;

    this.rings = [];
    this.trails = [];
    this.particles = [];

    this.phaseDuration = {
      PREPARE: 8,
      CHARGE: 12,
      PROPAGATION: 18,
      IMPACT: 12,
      DISSIPATION: 18,
      RETURN: 8,
    };

    this.waveSpeed = 0;
    this.waveScale = 1;
  }

  // --------------------------------------------------
  // UPDATE
  // --------------------------------------------------

  update(context) {
    if (this.isFinished) return;

    this.timer++;

    switch (this.phase) {
      case SonicBoomAnimation.PHASES.PREPARE:
        this.updatePrepare();
        break;

      case SonicBoomAnimation.PHASES.CHARGE:
        this.updateCharge();
        break;

      case SonicBoomAnimation.PHASES.PROPAGATION:
        this.updatePropagation();
        break;

      case SonicBoomAnimation.PHASES.IMPACT:
        this.updateImpact();
        break;

      case SonicBoomAnimation.PHASES.DISSIPATION:
        this.updateDissipation();
        break;

      case SonicBoomAnimation.PHASES.RETURN:
        this.updateReturn();
        break;
    }

    this.updateRings();
    this.updateTrails();
    this.updateParticles();

    this.draw(context);
  }

  changePhase(phase) {
    this.phase = phase;
    this.timer = 0;
  }

  // --------------------------------------------------
  // POSITIONS
  // --------------------------------------------------

  getSpriteCenter(sprite) {
    const scale = sprite.scale || 1;

    return {
      x: sprite.position.x + (sprite.frameWidth * scale) / 2,
      y: sprite.position.y + (sprite.frameHeight * scale) / 2,
    };
  }

  initializeWavePosition() {
    const attackerCenter = this.getSpriteCenter(this.attacker);
    const targetCenter = this.getSpriteCenter(this.target);

    this.originX = attackerCenter.x + this.direction * 20;

    this.originY = attackerCenter.y;

    this.targetX = targetCenter.x - this.direction * 15;

    this.targetY = targetCenter.y;

    this.waveX = this.originX;
    this.waveY = this.originY;
  }

  // --------------------------------------------------
  // PREPARE
  // --------------------------------------------------

  updatePrepare() {
    const duration = this.phaseDuration.PREPARE;
    const progress = Math.min(1, this.timer / duration);

    const anticipation = Math.sin(progress * Math.PI);

    this.attacker.position.x =
      this.originalX - this.direction * anticipation * 2;

    if (this.timer >= duration) {
      this.attacker.position.x = this.originalX;
      this.initializeWavePosition();

      this.changePhase(SonicBoomAnimation.PHASES.CHARGE);
    }
  }

  // --------------------------------------------------
  // CHARGE
  // --------------------------------------------------

  updateCharge() {
    const progress = Math.min(1, this.timer / this.phaseDuration.CHARGE);

    const pulse = Math.sin(this.timer * 0.9);

    this.waveScale = 0.5 + progress * 0.5 + pulse * 0.08;

    if (this.timer % 3 === 0) {
      this.createChargeParticles();
    }

    if (this.timer >= this.phaseDuration.CHARGE) {
      this.createInitialRings();

      this.changePhase(SonicBoomAnimation.PHASES.PROPAGATION);
    }
  }

  // --------------------------------------------------
  // PROPAGATION
  // --------------------------------------------------

  updatePropagation() {
    const duration = this.phaseDuration.PROPAGATION;
    const progress = Math.min(1, this.timer / duration);

    const eased = this.easeOut(progress);

    this.waveProgress = eased;

    this.waveX = this.originX + (this.targetX - this.originX) * eased;

    this.waveY = this.originY + (this.targetY - this.originY) * eased;

    this.waveSpeed = 1 + progress * 2;

    if (this.timer % 2 === 0) {
      this.createPropagationTrails();
    }

    if (this.timer % 4 === 0) {
      this.createPropagationRings();
    }

    if (this.timer >= duration) {
      this.waveX = this.targetX;
      this.waveY = this.targetY;

      this.createImpactParticles();

      if (this.game.canvas.startShake) {
        this.game.canvas.startShake(9, 4);
      }

      this.changePhase(SonicBoomAnimation.PHASES.IMPACT);
    }
  }

  // --------------------------------------------------
  // IMPACT
  // --------------------------------------------------

  updateImpact() {
    const progress = Math.min(1, this.timer / this.phaseDuration.IMPACT);

    this.impactFlash = Math.max(0, 1 - progress);

    if (this.timer >= this.phaseDuration.IMPACT) {
      this.changePhase(SonicBoomAnimation.PHASES.DISSIPATION);
    }
  }

  // --------------------------------------------------
  // DISSIPATION
  // --------------------------------------------------

  updateDissipation() {
    if (this.timer >= this.phaseDuration.DISSIPATION) {
      this.changePhase(SonicBoomAnimation.PHASES.RETURN);
    }
  }

  // --------------------------------------------------
  // RETURN
  // --------------------------------------------------

  updateReturn() {
    const progress = Math.min(1, this.timer / this.phaseDuration.RETURN);

    const eased = this.easeOut(progress);

    this.attacker.position.x =
      this.originalX - this.direction * 2 * (1 - eased);

    if (this.timer >= this.phaseDuration.RETURN) {
      this.attacker.position.x = this.originalX;
      this.attacker.position.y = this.originalY;

      this.isFinished = true;
    }
  }

  // --------------------------------------------------
  // EASING
  // --------------------------------------------------

  easeOut(value) {
    return 1 - Math.pow(1 - value, 3);
  }

  // --------------------------------------------------
  // CHARGE PARTICLES
  // --------------------------------------------------

  createChargeParticles() {
    const angle = Math.random() * Math.PI * 2;
    const radius = 10 + Math.random() * 12;

    this.particles.push({
      x: this.originX + Math.cos(angle) * radius,
      y: this.originY + Math.sin(angle) * radius,
      vx: Math.cos(angle) * -0.8,
      vy: Math.sin(angle) * -0.8,
      size: 2 + Math.random() * 2,
      life: 12,
      maxLife: 12,
      color: "#7eeaff",
    });
  }

  // --------------------------------------------------
  // INITIAL RINGS
  // --------------------------------------------------

  createInitialRings() {
    for (let i = 0; i < 3; i++) {
      this.rings.push({
        x: this.originX,
        y: this.originY,
        radiusX: 10 + i * 5,
        radiusY: 5 + i * 2,
        alpha: 0.9,
        life: 16,
        maxLife: 16,
        speed: 2.5 + i * 0.5,
      });
    }
  }

  // --------------------------------------------------
  // PROPAGATION RINGS
  // --------------------------------------------------

  createPropagationRings() {
    this.rings.push({
      x: this.waveX,
      y: this.waveY,
      radiusX: 7,
      radiusY: 15,
      alpha: 0.9,
      life: 13,
      maxLife: 13,
      speed: 2,
    });
  }

  // --------------------------------------------------
  // TRAILS
  // --------------------------------------------------

  createPropagationTrails() {
    for (let i = 0; i < 3; i++) {
      this.trails.push({
        x: this.waveX - this.direction * Math.random() * 8,
        y: this.waveY + (Math.random() - 0.5) * 22,
        length: 8 + Math.random() * 12,
        alpha: 0.8,
        life: 10,
        maxLife: 10,
      });
    }
  }

  // --------------------------------------------------
  // IMPACT PARTICLES
  // --------------------------------------------------

  createImpactParticles() {
    const center = this.getSpriteCenter(this.target);

    for (let i = 0; i < 24; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 3.5;

      this.particles.push({
        x: center.x,
        y: center.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 3,
        life: 18,
        maxLife: 18,
        color: i % 3 === 0 ? "#ffffff" : "#5deaff",
      });
    }

    // Onde de choc qui s'élargit autour de la cible.
    this.rings.push({
      x: center.x,
      y: center.y,
      radiusX: 8,
      radiusY: 5,
      alpha: 1,
      life: 18,
      maxLife: 18,
      speed: 3,
    });
  }

  // --------------------------------------------------
  // UPDATE EFFECTS
  // --------------------------------------------------

  updateRings() {
    this.rings.forEach((ring) => {
      ring.radiusX += ring.speed;
      ring.radiusY += ring.speed * 0.45;

      ring.alpha = ring.life / ring.maxLife;
      ring.life--;
    });

    this.rings = this.rings.filter((ring) => ring.life > 0);
  }

  updateTrails() {
    this.trails.forEach((trail) => {
      trail.alpha = trail.life / trail.maxLife;
      trail.life--;
    });

    this.trails = this.trails.filter((trail) => trail.life > 0);
  }

  updateParticles() {
    this.particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      particle.vx *= 0.94;
      particle.vy *= 0.94;

      particle.life--;
    });

    this.particles = this.particles.filter((particle) => particle.life > 0);
  }

  // --------------------------------------------------
  // DRAW
  // --------------------------------------------------

  draw(context) {
    context.save();

    if (this.phase === SonicBoomAnimation.PHASES.CHARGE) {
      this.drawCharge(context);
    }

    if (this.phase === SonicBoomAnimation.PHASES.PROPAGATION) {
      this.drawWave(context);
    }

    if (this.phase === SonicBoomAnimation.PHASES.IMPACT) {
      this.drawImpact(context);
    }

    if (this.phase === SonicBoomAnimation.PHASES.DISSIPATION) {
      this.drawDissipation(context);
    }

    this.drawRings(context);
    this.drawTrails(context);
    this.drawParticles(context);

    context.restore();
  }

  // --------------------------------------------------
  // DRAW CHARGE
  // --------------------------------------------------

  drawCharge(context) {
    context.save();

    context.translate(this.originX, this.originY);
    context.scale(this.waveScale, this.waveScale);

    for (let i = 0; i < 3; i++) {
      const radius = 10 + i * 6;

      context.beginPath();
      context.ellipse(0, 0, radius, radius * 0.45, 0, 0, Math.PI * 2);

      context.strokeStyle = i === 0 ? "#ffffff" : "#65eaff";

      context.lineWidth = 2;
      context.globalAlpha = 0.85 - i * 0.2;
      context.stroke();
    }

    context.restore();
  }

  // --------------------------------------------------
  // DRAW PROPAGATING WAVE
  // --------------------------------------------------

  drawWave(context) {
    context.save();

    context.translate(this.waveX, this.waveY);
    context.scale(this.direction, 1);

    const pulse = Math.sin(this.timer * 1.2) * 2;

    // Corps central de l'onde.
    context.beginPath();
    context.ellipse(0, 0, 9 + pulse, 22 + pulse, 0, 0, Math.PI * 2);

    context.fillStyle = "rgba(82, 226, 255, 0.25)";
    context.fill();

    // Anneau extérieur.
    context.beginPath();
    context.ellipse(0, 0, 13 + pulse, 27 + pulse, 0, 0, Math.PI * 2);

    context.strokeStyle = "#54eaff";
    context.lineWidth = 3;
    context.stroke();

    // Reflet intérieur.
    context.beginPath();
    context.ellipse(0, 0, 6 + pulse * 0.4, 17 + pulse, 0, 0, Math.PI * 2);

    context.strokeStyle = "#ffffff";
    context.lineWidth = 2;
    context.stroke();

    context.restore();
  }

  // --------------------------------------------------
  // DRAW IMPACT
  // --------------------------------------------------

  drawImpact(context) {
    const center = this.getSpriteCenter(this.target);

    context.save();

    context.globalAlpha = this.impactFlash;
    context.fillStyle = "#ffffff";

    context.beginPath();
    context.arc(
      center.x,
      center.y,
      24 * (1 - this.impactFlash) + 8,
      0,
      Math.PI * 2
    );

    context.fill();

    context.restore();
  }

  // --------------------------------------------------
  // DRAW DISSIPATION
  // --------------------------------------------------

  drawDissipation(context) {
    const center = this.getSpriteCenter(this.target);
    const progress = Math.min(1, this.timer / this.phaseDuration.DISSIPATION);

    context.save();

    context.globalAlpha = 1 - progress;
    context.strokeStyle = "#6deaff";
    context.lineWidth = 2;

    context.beginPath();
    context.ellipse(
      center.x,
      center.y,
      12 + progress * 35,
      7 + progress * 18,
      0,
      0,
      Math.PI * 2
    );

    context.stroke();

    context.restore();
  }

  // --------------------------------------------------
  // DRAW RINGS
  // --------------------------------------------------

  drawRings(context) {
    this.rings.forEach((ring) => {
      context.save();

      context.globalAlpha = ring.alpha;
      context.strokeStyle = "#83efff";
      context.lineWidth = 2;

      context.beginPath();
      context.ellipse(
        ring.x,
        ring.y,
        ring.radiusX,
        ring.radiusY,
        0,
        0,
        Math.PI * 2
      );

      context.stroke();

      context.restore();
    });
  }

  // --------------------------------------------------
  // DRAW TRAILS
  // --------------------------------------------------

  drawTrails(context) {
    this.trails.forEach((trail) => {
      context.save();

      context.globalAlpha = trail.alpha;
      context.strokeStyle = "#b5f7ff";
      context.lineWidth = 2;

      context.beginPath();

      context.moveTo(trail.x, trail.y);
      context.lineTo(trail.x - this.direction * trail.length, trail.y);

      context.stroke();

      context.restore();
    });
  }

  // --------------------------------------------------
  // DRAW PARTICLES
  // --------------------------------------------------

  drawParticles(context) {
    this.particles.forEach((particle) => {
      context.save();

      context.globalAlpha = particle.life / particle.maxLife;
      context.fillStyle = particle.color;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);

      context.fill();

      context.restore();
    });
  }
}
