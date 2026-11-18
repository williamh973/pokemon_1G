export class GuillotineAnimation {
  static PHASES = {
    PREPARE: "PREPARE",
    SUMMON: "SUMMON",
    SUSPENSE: "SUSPENSE",
    EXECUTION: "EXECUTION",
    IMPACT: "IMPACT",
    DISSIPATE: "DISSIPATE",
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

    this.direction =
      this.target.position.x >= this.attacker.position.x ? 1 : -1;

    this.phase = GuillotineAnimation.PHASES.PREPARE;
    this.timer = 0;
    this.isFinished = false;

    this.backgroundIntensity = 0;
    this.bladeOpacity = 0;
    this.bladePosition = 0;
    this.bladeShake = 0;

    this.impactFlash = 0;
    this.impactRingScale = 0;
    this.slashProgress = 0;

    this.vortexRotation = 0;

    this.particles = [];
    this.energyParticles = [];

    this.phaseDuration = {
      PREPARE: 12,
      SUMMON: 14,
      SUSPENSE: 16,
      EXECUTION: 7,
      IMPACT: 14,
      DISSIPATE: 15,
      RETURN: 12,
    };

    this.bladeWidth = 24;
    this.bladeHeight = 88;

    this.shakeTriggered = false;
  }

  // --------------------------------------------------
  // UPDATE
  // --------------------------------------------------

  update(context) {
    if (this.isFinished) return;

    this.timer++;

    switch (this.phase) {
      case GuillotineAnimation.PHASES.PREPARE:
        this.updatePrepare();
        break;

      case GuillotineAnimation.PHASES.SUMMON:
        this.updateSummon();
        break;

      case GuillotineAnimation.PHASES.SUSPENSE:
        this.updateSuspense();
        break;

      case GuillotineAnimation.PHASES.EXECUTION:
        this.updateExecution();
        break;

      case GuillotineAnimation.PHASES.IMPACT:
        this.updateImpact();
        break;

      case GuillotineAnimation.PHASES.DISSIPATE:
        this.updateDissipate();
        break;

      case GuillotineAnimation.PHASES.RETURN:
        this.updateReturn();
        break;
    }

    this.updateParticles();
    this.updateEnergyParticles();

    this.draw(context);
  }

  changePhase(phase) {
    this.phase = phase;
    this.timer = 0;
  }

  clamp(value) {
    return Math.max(0, Math.min(1, value));
  }

  easeOut(value) {
    return 1 - Math.pow(1 - value, 3);
  }

  easeIn(value) {
    return value * value * value;
  }

  easeInOut(value) {
    return value < 0.5
      ? 4 * value * value * value
      : 1 - Math.pow(-2 * value + 2, 3) / 2;
  }

  // --------------------------------------------------
  // PHASE: PREPARE
  // --------------------------------------------------

  updatePrepare() {
    const progress = this.clamp(this.timer / this.phaseDuration.PREPARE);

    this.backgroundIntensity = this.easeOut(progress) * 0.85;

    this.vortexRotation += 0.035;

    if (this.timer % 2 === 0) {
      this.createEnergyParticles();
    }

    if (this.timer >= this.phaseDuration.PREPARE) {
      this.changePhase(GuillotineAnimation.PHASES.SUMMON);
    }
  }

  // --------------------------------------------------
  // PHASE: SUMMON
  // --------------------------------------------------

  updateSummon() {
    const progress = this.clamp(this.timer / this.phaseDuration.SUMMON);

    this.backgroundIntensity = 0.85;
    this.bladeOpacity = this.easeOut(progress);

    // La lame descend légèrement depuis le haut.
    this.bladePosition = this.easeOut(progress) * 12;

    this.vortexRotation += 0.055;

    if (this.timer % 2 === 0) {
      this.createBladeParticles();
      this.createEnergyParticles();
    }

    if (this.timer >= this.phaseDuration.SUMMON) {
      this.bladeOpacity = 1;
      this.changePhase(GuillotineAnimation.PHASES.SUSPENSE);
    }
  }

  // --------------------------------------------------
  // PHASE: SUSPENSE
  // --------------------------------------------------

  updateSuspense() {
    const progress = this.clamp(this.timer / this.phaseDuration.SUSPENSE);

    this.backgroundIntensity = 0.85;

    // La lame tremble légèrement avant la chute.
    this.bladeShake = Math.sin(this.timer * 1.8) * (0.5 + progress);

    this.vortexRotation += 0.025;

    if (this.timer % 4 === 0) {
      this.createBladeParticles();
    }

    if (this.timer >= this.phaseDuration.SUSPENSE) {
      this.bladeShake = 0;
      this.changePhase(GuillotineAnimation.PHASES.EXECUTION);
    }
  }

  // --------------------------------------------------
  // PHASE: EXECUTION
  // --------------------------------------------------

  updateExecution() {
    const progress = this.clamp(this.timer / this.phaseDuration.EXECUTION);

    // Chute très rapide de la lame.
    this.bladePosition = 12 + this.easeIn(progress) * 105;

    this.bladeShake = Math.sin(this.timer * 2) * 1.5;

    if (this.timer % 2 === 0) {
      this.createBladeParticles();
    }

    if (this.timer >= this.phaseDuration.EXECUTION) {
      this.bladePosition = 117;

      this.createImpactParticles();

      if (!this.shakeTriggered && this.game.canvas.startShake) {
        this.game.canvas.startShake(15, 6);
        this.shakeTriggered = true;
      }

      this.changePhase(GuillotineAnimation.PHASES.IMPACT);
    }
  }

  // --------------------------------------------------
  // PHASE: IMPACT
  // --------------------------------------------------

  updateImpact() {
    const progress = this.clamp(this.timer / this.phaseDuration.IMPACT);

    this.backgroundIntensity = 0.85 * (1 - progress);
    this.impactRingScale = this.easeOut(progress);

    this.impactFlash =
      progress < 0.2 ? 1 : 1 - this.easeOut((progress - 0.2) / 0.8);

    this.slashProgress = this.easeOut(progress);

    if (this.timer === 3) {
      this.createImpactParticles();

      if (this.game.canvas.startShake) {
        this.game.canvas.startShake(9, 4);
      }
    }

    if (this.timer >= this.phaseDuration.IMPACT) {
      this.changePhase(GuillotineAnimation.PHASES.DISSIPATE);
    }
  }

  // --------------------------------------------------
  // PHASE: DISSIPATE
  // --------------------------------------------------

  updateDissipate() {
    const progress = this.clamp(this.timer / this.phaseDuration.DISSIPATE);

    this.backgroundIntensity = 0.25 * (1 - progress);
    this.bladeOpacity = 1 - this.easeOut(progress);

    this.impactFlash = 0;

    if (this.timer % 3 === 0) {
      this.createDissipationParticles();
    }

    if (this.timer >= this.phaseDuration.DISSIPATE) {
      this.bladeOpacity = 0;
      this.changePhase(GuillotineAnimation.PHASES.RETURN);
    }
  }

  // --------------------------------------------------
  // PHASE: RETURN
  // --------------------------------------------------

  updateReturn() {
    const progress = this.clamp(this.timer / this.phaseDuration.RETURN);

    this.backgroundIntensity = 0;
    this.bladeOpacity = 0;

    if (this.timer >= this.phaseDuration.RETURN) {
      this.attacker.position.x = this.originalX;
      this.attacker.position.y = this.originalY;

      this.isFinished = true;
    }
  }

  // --------------------------------------------------
  // POSITIONS
  // --------------------------------------------------

  getTargetCenter() {
    const scale = this.target.scale || 1;

    return {
      x: this.target.position.x + (this.target.frameWidth * scale) / 2,
      y: this.target.position.y + (this.target.frameHeight * scale) / 2,
    };
  }

  getTargetBounds() {
    const scale = this.target.scale || 1;

    return {
      x: this.target.position.x,
      y: this.target.position.y,
      width: this.target.frameWidth * scale,
      height: this.target.frameHeight * scale,
    };
  }

  getBladePosition() {
    const target = this.getTargetCenter();

    return {
      x: target.x,
      y: target.y - 105 + this.bladePosition,
    };
  }

  // --------------------------------------------------
  // PARTICLES
  // --------------------------------------------------

  createEnergyParticles() {
    const center = this.getTargetCenter();

    const angle = Math.random() * Math.PI * 2;
    const radius = 30 + Math.random() * 35;

    this.energyParticles.push({
      angle,
      radius,
      x: center.x + Math.cos(angle) * radius,
      y: center.y + Math.sin(angle) * radius,
      speed: 0.07 + Math.random() * 0.06,
      life: 35,
      maxLife: 35,
      size: 1 + Math.random() * 2,
    });
  }

  createBladeParticles() {
    const blade = this.getBladePosition();

    this.particles.push({
      x: blade.x + (Math.random() - 0.5) * 35,
      y: blade.y + Math.random() * 55,
      vx: (Math.random() - 0.5) * 1.5,
      vy: -0.5 - Math.random(),
      size: 1 + Math.random() * 2,
      life: 16,
      maxLife: 16,
      color: Math.random() > 0.5 ? "#ffffff" : "#ff777e",
    });
  }

  createImpactParticles() {
    const center = this.getTargetCenter();

    for (let i = 0; i < 45; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 5;

      this.particles.push({
        x: center.x,
        y: center.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 3,
        life: 24,
        maxLife: 24,
        color: i % 3 === 0 ? "#ffffff" : i % 2 === 0 ? "#ffb9bd" : "#e55c6b",
      });
    }
  }

  createDissipationParticles() {
    const center = this.getTargetCenter();

    this.particles.push({
      x: center.x + (Math.random() - 0.5) * 60,
      y: center.y + (Math.random() - 0.5) * 50,
      vx: (Math.random() - 0.5) * 2,
      vy: -Math.random() * 2,
      size: 1 + Math.random() * 2,
      life: 20,
      maxLife: 20,
      color: "#ffb9bd",
    });
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

  updateEnergyParticles() {
    const center = this.getTargetCenter();

    this.energyParticles.forEach((particle) => {
      particle.angle += particle.speed;
      particle.radius -= 0.08;

      particle.x = center.x + Math.cos(particle.angle) * particle.radius;

      particle.y = center.y + Math.sin(particle.angle) * particle.radius;

      particle.life--;
    });

    this.energyParticles = this.energyParticles.filter(
      (particle) => particle.life > 0
    );
  }

  // --------------------------------------------------
  // DRAW
  // --------------------------------------------------

  draw(context) {
    context.save();

    this.drawBackgroundEffect(context);
    this.drawEnergyParticles(context);

    if (
      this.phase === GuillotineAnimation.PHASES.SUMMON ||
      this.phase === GuillotineAnimation.PHASES.SUSPENSE ||
      this.phase === GuillotineAnimation.PHASES.EXECUTION
    ) {
      this.drawBladeAura(context);
      this.drawBlade(context);
    }

    this.drawParticles(context);

    if (this.phase === GuillotineAnimation.PHASES.IMPACT) {
      this.drawImpactEffect(context);
    }

    context.restore();
  }

  // --------------------------------------------------
  // BACKGROUND
  // --------------------------------------------------

  drawBackgroundEffect(context) {
    if (this.backgroundIntensity <= 0) return;

    const width = context.canvas.width;
    const height = context.canvas.height;

    const intensity = this.backgroundIntensity;
    const center = this.getTargetCenter();

    context.save();

    // Assombrissement du décor.
    context.fillStyle = `rgba(22, 2, 12, ${intensity * 0.78})`;
    context.fillRect(0, 0, width, height);

    // Halo rouge derrière la cible.
    const gradient = context.createRadialGradient(
      center.x,
      center.y,
      5,
      center.x,
      center.y,
      Math.max(width, height) * 0.6
    );

    gradient.addColorStop(0, `rgba(180, 25, 45, ${intensity * 0.25})`);

    gradient.addColorStop(0.5, `rgba(85, 5, 25, ${intensity * 0.18})`);

    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);

    // Lueur verticale au-dessus de la cible.
    context.globalAlpha = intensity * 0.5;

    const beam = context.createLinearGradient(center.x, 0, center.x, height);

    beam.addColorStop(0, "rgba(255, 100, 110, 0)");
    beam.addColorStop(0.4, "rgba(255, 80, 95, 0.5)");
    beam.addColorStop(1, "rgba(255, 30, 55, 0)");

    context.fillStyle = beam;
    context.fillRect(center.x - 24, 0, 48, height);

    context.restore();
  }

  // --------------------------------------------------
  // BLADE AURA
  // --------------------------------------------------

  drawBladeAura(context) {
    const blade = this.getBladePosition();

    context.save();

    context.translate(blade.x, blade.y);

    context.globalAlpha = this.bladeOpacity * 0.65;

    const gradient = context.createRadialGradient(0, 30, 2, 0, 30, 55);

    gradient.addColorStop(0, "rgba(255,255,255,0.6)");
    gradient.addColorStop(0.4, "rgba(255,80,100,0.3)");
    gradient.addColorStop(1, "rgba(255,20,40,0)");

    context.fillStyle = gradient;

    context.beginPath();
    context.ellipse(0, 30, 55, 75, 0, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }

  // --------------------------------------------------
  // BLADE
  // --------------------------------------------------

  drawBlade(context) {
    const blade = this.getBladePosition();

    const x = blade.x + this.bladeShake;
    const y = blade.y;

    const width = this.bladeWidth;
    const height = this.bladeHeight;

    context.save();

    context.globalAlpha = this.bladeOpacity;

    // Ombre portée.
    context.fillStyle = "rgba(0,0,0,0.45)";

    context.beginPath();
    context.moveTo(x - width / 2 + 5, y);
    context.lineTo(x + width / 2 + 5, y);
    context.lineTo(x + 5, y + height + 5);
    context.closePath();
    context.fill();

    // Manche supérieur.
    context.fillStyle = "#4c2630";
    context.fillRect(x - 5, y - 27, 10, 24);

    context.fillStyle = "#c18b55";
    context.fillRect(x - 8, y - 29, 16, 5);

    // Traverse supérieure.
    context.fillStyle = "#56616e";
    context.fillRect(x - 24, y - 9, 48, 8);

    context.strokeStyle = "#c3d3df";
    context.lineWidth = 1;
    context.strokeRect(x - 24, y - 9, 48, 8);

    // Corps principal de la lame.
    context.beginPath();
    context.moveTo(x - width / 2, y);
    context.lineTo(x + width / 2, y);
    context.lineTo(x + width * 0.42, y + height * 0.65);
    context.lineTo(x + width * 0.25, y + height * 0.88);
    context.lineTo(x, y + height);
    context.lineTo(x - width * 0.25, y + height * 0.88);
    context.lineTo(x - width * 0.42, y + height * 0.65);
    context.closePath();

    const gradient = context.createLinearGradient(
      x - width / 2,
      0,
      x + width / 2,
      0
    );

    gradient.addColorStop(0, "#35434e");
    gradient.addColorStop(0.2, "#8798a4");
    gradient.addColorStop(0.42, "#f1f8ff");
    gradient.addColorStop(0.55, "#ffffff");
    gradient.addColorStop(0.8, "#9aabb6");
    gradient.addColorStop(1, "#36434e");

    context.fillStyle = gradient;
    context.fill();

    context.strokeStyle = "#e6f5ff";
    context.lineWidth = 1.2;
    context.stroke();

    // Tranchant lumineux.
    context.beginPath();
    context.moveTo(x - width * 0.25, y + height * 0.88);
    context.lineTo(x, y + height);
    context.lineTo(x + width * 0.25, y + height * 0.88);

    context.strokeStyle = "#ffffff";
    context.lineWidth = 2;
    context.shadowColor = "#ffb8c2";
    context.shadowBlur = 8;
    context.stroke();

    // Reflet vertical.
    context.shadowBlur = 0;
    context.beginPath();
    context.moveTo(x - 3, y + 8);
    context.lineTo(x - 1, y + height * 0.75);

    context.strokeStyle = "rgba(255,255,255,0.8)";
    context.lineWidth = 1;
    context.stroke();

    context.restore();
  }

  // --------------------------------------------------
  // ENERGY PARTICLES
  // --------------------------------------------------

  drawEnergyParticles(context) {
    this.energyParticles.forEach((particle) => {
      context.save();

      context.globalAlpha = particle.life / particle.maxLife;

      context.fillStyle = "#ffd6dc";
      context.shadowColor = "#ff455f";
      context.shadowBlur = 8;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);

      context.fill();

      context.restore();
    });
  }

  // --------------------------------------------------
  // IMPACT
  // --------------------------------------------------

  drawImpactEffect(context) {
    const center = this.getTargetCenter();

    const width = context.canvas.width;
    const height = context.canvas.height;

    const radius = 10 + this.impactRingScale * 42;

    context.save();

    // Flash global.
    context.globalAlpha = this.impactFlash * 0.8;
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);

    // Halo de l'impact.
    context.globalAlpha = this.impactFlash;

    const gradient = context.createRadialGradient(
      center.x,
      center.y,
      2,
      center.x,
      center.y,
      radius * 2
    );

    gradient.addColorStop(0, "#ffffff");
    gradient.addColorStop(0.3, "#ffb8c2");
    gradient.addColorStop(1, "rgba(255,40,70,0)");

    context.fillStyle = gradient;

    context.beginPath();
    context.arc(center.x, center.y, radius * 2, 0, Math.PI * 2);
    context.fill();

    // Onde de choc horizontale.
    const slashWidth = this.slashProgress * width * 0.85;

    context.globalAlpha = this.impactRingScale;

    const slashGradient = context.createLinearGradient(
      center.x - slashWidth / 2,
      center.y,
      center.x + slashWidth / 2,
      center.y
    );

    slashGradient.addColorStop(0, "rgba(255,255,255,0)");
    slashGradient.addColorStop(0.5, "#ffffff");
    slashGradient.addColorStop(1, "rgba(255,255,255,0)");

    context.fillStyle = slashGradient;
    context.fillRect(center.x - slashWidth / 2, center.y - 2, slashWidth, 4);

    // Ondes circulaires.
    context.strokeStyle = "#ffe2e6";
    context.lineWidth = 2.5;

    for (let i = 0; i < 3; i++) {
      const ringRadius = radius + i * 10;

      context.beginPath();

      context.ellipse(
        center.x,
        center.y,
        ringRadius,
        ringRadius * 0.55,
        0,
        0,
        Math.PI * 2
      );

      context.stroke();
    }

    // Éclats radiaux.
    context.strokeStyle = "#ffffff";
    context.lineWidth = 2;

    for (let i = 0; i < 16; i++) {
      const angle = (Math.PI * 2 * i) / 16;

      context.beginPath();

      context.moveTo(
        center.x + Math.cos(angle) * radius * 0.3,
        center.y + Math.sin(angle) * radius * 0.3
      );

      context.lineTo(
        center.x + Math.cos(angle) * radius,
        center.y + Math.sin(angle) * radius
      );

      context.stroke();
    }

    context.restore();
  }

  // --------------------------------------------------
  // PARTICLES
  // --------------------------------------------------

  drawParticles(context) {
    this.particles.forEach((particle) => {
      context.save();

      context.globalAlpha = particle.life / particle.maxLife;

      context.fillStyle = particle.color;
      context.shadowColor = particle.color;
      context.shadowBlur = 5;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);

      context.fill();

      context.restore();
    });
  }
}
