export class ConstrictAnimation {
  static PHASES = {
    PREPARE: "PREPARE",
    EXTEND: "EXTEND",
    WRAP: "WRAP",
    SQUEEZE: "SQUEEZE",
    IMPACT: "IMPACT",
    RELEASE: "RELEASE",
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

    this.phase = ConstrictAnimation.PHASES.PREPARE;
    this.timer = 0;
    this.isFinished = false;

    this.phaseDuration = {
      PREPARE: 10,
      EXTEND: 14,
      WRAP: 22,
      SQUEEZE: 18,
      IMPACT: 10,
      RELEASE: 16,
      RETURN: 10,
    };

    this.totalDuration = 100;

    this.vines = [];
    this.particles = [];

    this.energy = 0;
    this.extensionProgress = 0;
    this.wrapProgress = 0;
    this.squeezeProgress = 0;
    this.impactFlash = 0;
    this.releaseProgress = 0;

    this.targetShake = 0;
    this.originalTargetX = this.target.position.x;
    this.originalTargetY = this.target.position.y;

    this.vineCount = 3;
    this.vineWidth = 4;

    this.createVines();
  }

  // --------------------------------------------------
  // INITIALIZATION
  // --------------------------------------------------

  createVines() {
    for (let i = 0; i < this.vineCount; i++) {
      this.vines.push({
        index: i,
        angle: (Math.PI * 2 * i) / this.vineCount,
        phaseOffset: (Math.PI * 2 * i) / this.vineCount,
        rotation: 0,
        opacity: 0,
      });
    }
  }

  // --------------------------------------------------
  // UPDATE
  // --------------------------------------------------

  update(context) {
    if (this.isFinished) return;

    this.timer++;

    switch (this.phase) {
      case ConstrictAnimation.PHASES.PREPARE:
        this.updatePrepare();
        break;

      case ConstrictAnimation.PHASES.EXTEND:
        this.updateExtend();
        break;

      case ConstrictAnimation.PHASES.WRAP:
        this.updateWrap();
        break;

      case ConstrictAnimation.PHASES.SQUEEZE:
        this.updateSqueeze();
        break;

      case ConstrictAnimation.PHASES.IMPACT:
        this.updateImpact();
        break;

      case ConstrictAnimation.PHASES.RELEASE:
        this.updateRelease();
        break;

      case ConstrictAnimation.PHASES.RETURN:
        this.updateReturn();
        break;
    }

    this.updateVines();
    this.updateParticles();

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

    this.energy = this.easeOut(progress);

    if (this.timer % 3 === 0) {
      this.createEnergyParticles();
    }

    if (this.timer >= this.phaseDuration.PREPARE) {
      this.changePhase(ConstrictAnimation.PHASES.EXTEND);
    }
  }

  // --------------------------------------------------
  // PHASE: EXTEND
  // --------------------------------------------------

  updateExtend() {
    const progress = this.clamp(this.timer / this.phaseDuration.EXTEND);

    this.extensionProgress = this.easeOut(progress);
    this.energy = 1;

    this.vines.forEach((vine) => {
      vine.opacity = this.extensionProgress;
    });

    if (this.timer % 2 === 0) {
      this.createExtensionParticles();
    }

    if (this.timer >= this.phaseDuration.EXTEND) {
      this.extensionProgress = 1;
      this.changePhase(ConstrictAnimation.PHASES.WRAP);
    }
  }

  // --------------------------------------------------
  // PHASE: WRAP
  // --------------------------------------------------

  updateWrap() {
    const progress = this.clamp(this.timer / this.phaseDuration.WRAP);

    this.wrapProgress = this.easeInOut(progress);

    this.vines.forEach((vine) => {
      vine.opacity = 1;
      vine.rotation += 0.12;
    });

    if (this.timer % 3 === 0) {
      this.createWrapParticles();
    }

    if (this.timer >= this.phaseDuration.WRAP) {
      this.wrapProgress = 1;
      this.changePhase(ConstrictAnimation.PHASES.SQUEEZE);
    }
  }

  // --------------------------------------------------
  // PHASE: SQUEEZE
  // --------------------------------------------------

  updateSqueeze() {
    const progress = this.clamp(this.timer / this.phaseDuration.SQUEEZE);

    this.squeezeProgress = this.easeInOut(progress);

    this.vines.forEach((vine) => {
      vine.rotation += 0.045;
    });

    // La cible est légèrement comprimée visuellement.
    const shake = Math.sin(this.timer * 1.8) * 1.4;

    this.target.position.x = this.originalTargetX + shake;

    if (this.timer % 3 === 0) {
      this.createSqueezeParticles();
    }

    if (this.timer >= this.phaseDuration.SQUEEZE) {
      this.target.position.x = this.originalTargetX;

      this.changePhase(ConstrictAnimation.PHASES.IMPACT);
    }
  }

  // --------------------------------------------------
  // PHASE: IMPACT
  // --------------------------------------------------

  updateImpact() {
    const progress = this.clamp(this.timer / this.phaseDuration.IMPACT);

    this.impactFlash =
      progress < 0.25 ? 1 : 1 - this.easeOut((progress - 0.25) / 0.75);

    if (this.timer === 1) {
      this.createImpactParticles();

      if (this.game.canvas.startShake) {
        this.game.canvas.startShake(9, 4);
      }
    }

    if (this.timer >= this.phaseDuration.IMPACT) {
      this.impactFlash = 0;
      this.changePhase(ConstrictAnimation.PHASES.RELEASE);
    }
  }

  // --------------------------------------------------
  // PHASE: RELEASE
  // --------------------------------------------------

  updateRelease() {
    const progress = this.clamp(this.timer / this.phaseDuration.RELEASE);

    this.releaseProgress = this.easeOut(progress);

    this.vines.forEach((vine) => {
      vine.opacity = 1 - this.releaseProgress;
    });

    if (this.timer % 2 === 0) {
      this.createReleaseParticles();
    }

    if (this.timer >= this.phaseDuration.RELEASE) {
      this.vines.forEach((vine) => {
        vine.opacity = 0;
      });

      this.changePhase(ConstrictAnimation.PHASES.RETURN);
    }
  }

  // --------------------------------------------------
  // PHASE: RETURN
  // --------------------------------------------------

  updateReturn() {
    const progress = this.clamp(this.timer / this.phaseDuration.RETURN);

    this.energy = 1 - this.easeOut(progress);

    if (this.timer >= this.phaseDuration.RETURN) {
      this.attacker.position.x = this.originalX;
      this.attacker.position.y = this.originalY;

      this.target.position.x = this.originalTargetX;
      this.target.position.y = this.originalTargetY;

      this.isFinished = true;
    }
  }

  // --------------------------------------------------
  // VINES
  // --------------------------------------------------

  updateVines() {
    this.vines.forEach((vine) => {
      if (this.phase === ConstrictAnimation.PHASES.WRAP) {
        vine.rotation += 0.015;
      }
    });
  }

  getTargetCenter() {
    const scale = this.target.scale || 1;

    return {
      x: this.target.position.x + (this.target.frameWidth * scale) / 2,
      y: this.target.position.y + (this.target.frameHeight * scale) / 2,
    };
  }

  getTargetDimensions() {
    const scale = this.target.scale || 1;

    return {
      width: this.target.frameWidth * scale,
      height: this.target.frameHeight * scale,
    };
  }

  // --------------------------------------------------
  // PARTICLES
  // --------------------------------------------------

  createEnergyParticles() {
    const center = this.getTargetCenter();

    this.particles.push({
      x: this.attacker.position.x + this.attacker.frameWidth / 2,
      y: this.attacker.position.y + this.attacker.frameHeight / 2,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
      size: 1 + Math.random() * 2,
      life: 20,
      maxLife: 20,
      color: "#a7ff80",
    });
  }

  createExtensionParticles() {
    const center = this.getTargetCenter();

    const progress = this.extensionProgress;

    this.particles.push({
      x: center.x + (Math.random() - 0.5) * 20,
      y: center.y + (Math.random() - 0.5) * 20,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: 1 + Math.random() * 2,
      life: 16,
      maxLife: 16,
      color: "#baff8e",
    });
  }

  createWrapParticles() {
    const center = this.getTargetCenter();

    this.particles.push({
      x: center.x + (Math.random() - 0.5) * 40,
      y: center.y + (Math.random() - 0.5) * 40,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
      size: 1 + Math.random() * 2,
      life: 18,
      maxLife: 18,
      color: "#d7ffb4",
    });
  }

  createSqueezeParticles() {
    const center = this.getTargetCenter();

    this.particles.push({
      x: center.x + (Math.random() - 0.5) * 35,
      y: center.y + (Math.random() - 0.5) * 35,
      vx: (Math.random() - 0.5) * 2,
      vy: -Math.random() * 2,
      size: 1 + Math.random() * 2,
      life: 14,
      maxLife: 14,
      color: "#a6ff8c",
    });
  }

  createImpactParticles() {
    const center = this.getTargetCenter();

    for (let i = 0; i < 28; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 3;

      this.particles.push({
        x: center.x,
        y: center.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 2,
        life: 20,
        maxLife: 20,
        color: i % 2 === 0 ? "#ffffff" : "#9dff74",
      });
    }
  }

  createReleaseParticles() {
    const center = this.getTargetCenter();

    this.particles.push({
      x: center.x + (Math.random() - 0.5) * 50,
      y: center.y + (Math.random() - 0.5) * 50,
      vx: (Math.random() - 0.5) * 2,
      vy: -1 - Math.random() * 2,
      size: 1 + Math.random() * 2,
      life: 18,
      maxLife: 18,
      color: "#c5ffa6",
    });
  }

  updateParticles() {
    this.particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      particle.vx *= 0.96;
      particle.vy *= 0.96;

      particle.life--;
    });

    this.particles = this.particles.filter((particle) => particle.life > 0);
  }

  // --------------------------------------------------
  // DRAW
  // --------------------------------------------------

  draw(context) {
    context.save();

    this.drawEnergyAura(context);
    this.drawVines(context);
    this.drawParticles(context);
    this.drawImpactFlash(context);

    context.restore();
  }

  // --------------------------------------------------
  // ENERGY AURA
  // --------------------------------------------------

  drawEnergyAura(context) {
    if (this.energy <= 0) return;

    const center = this.getTargetCenter();

    context.save();

    context.globalAlpha = this.energy * 0.5;

    const gradient = context.createRadialGradient(
      center.x,
      center.y,
      5,
      center.x,
      center.y,
      65
    );

    gradient.addColorStop(0, "rgba(170,255,120,0.35)");
    gradient.addColorStop(0.6, "rgba(100,220,80,0.15)");
    gradient.addColorStop(1, "rgba(100,220,80,0)");

    context.fillStyle = gradient;

    context.beginPath();
    context.ellipse(center.x, center.y, 60, 55, 0, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }

  // --------------------------------------------------
  // VINE PATHS
  // --------------------------------------------------

  drawVines(context) {
    if (this.extensionProgress <= 0) return;

    const center = this.getTargetCenter();
    const dimensions = this.getTargetDimensions();

    const width = dimensions.width;
    const height = dimensions.height;

    const progress =
      this.phase === ConstrictAnimation.PHASES.RELEASE
        ? 1 - this.releaseProgress
        : this.wrapProgress || this.extensionProgress;

    if (progress <= 0) return;

    const extension = this.extensionProgress;

    this.vines.forEach((vine, index) => {
      const opacity = vine.opacity;

      if (opacity <= 0) return;

      context.save();

      context.globalAlpha = opacity;

      const direction = index % 2 === 0 ? 1 : -1;
      const phase = vine.phaseOffset + vine.rotation;

      const startX =
        this.attacker.position.x +
        (this.attacker.frameWidth * (this.attacker.scale || 1)) / 2;

      const startY =
        this.attacker.position.y +
        (this.attacker.frameHeight * (this.attacker.scale || 1)) / 2;

      const endX = center.x;
      const endY = center.y;

      // Progression de la liane entre les deux Pokémon.
      const currentX = startX + (endX - startX) * extension;

      const currentY = startY + (endY - startY) * extension;

      if (this.phase === ConstrictAnimation.PHASES.EXTEND) {
        this.drawExtendingVine(
          context,
          startX,
          startY,
          currentX,
          currentY,
          phase,
          direction
        );
      } else {
        this.drawWrappedVine(
          context,
          center.x,
          center.y,
          width,
          height,
          phase,
          direction,
          progress
        );
      }

      context.restore();
    });
  }

  drawExtendingVine(context, startX, startY, endX, endY, phase, direction) {
    const controlX = (startX + endX) / 2;
    const controlY = (startY + endY) / 2 + Math.sin(phase) * 18;

    context.beginPath();
    context.moveTo(startX, startY);
    context.quadraticCurveTo(controlX, controlY, endX, endY);

    this.strokeVine(context, 4);
  }

  drawWrappedVine(
    context,
    centerX,
    centerY,
    width,
    height,
    phase,
    direction,
    progress
  ) {
    const squeeze =
      this.phase === ConstrictAnimation.PHASES.SQUEEZE
        ? this.squeezeProgress * 0.18
        : 0;

    const radiusX = Math.max(9, width * (0.48 - squeeze));
    const radiusY = Math.max(9, height * (0.42 - squeeze));

    const turns = 1.6;
    const steps = 80;

    context.beginPath();

    for (let i = 0; i <= steps * progress; i++) {
      const t = i / steps;
      const angle = t * Math.PI * 2 * turns * direction + phase;

      const x = centerX + Math.cos(angle) * radiusX;

      const y = centerY + Math.sin(angle) * radiusY * 0.75;

      if (i === 0) {
        context.moveTo(x, y);
      } else {
        context.lineTo(x, y);
      }
    }

    this.strokeVine(context, this.vineWidth);
  }

  strokeVine(context, width) {
    context.lineCap = "round";
    context.lineJoin = "round";

    // Contour sombre.
    context.strokeStyle = "#164d26";
    context.lineWidth = width + 3;
    context.stroke();

    // Corps vert.
    context.strokeStyle = "#63bd48";
    context.lineWidth = width;
    context.stroke();

    // Reflet lumineux.
    context.strokeStyle = "#d6ff9d";
    context.lineWidth = Math.max(1, width * 0.25);
    context.stroke();

    // Lueur.
    context.shadowColor = "#8dff5b";
    context.shadowBlur = 7;
    context.strokeStyle = "rgba(160,255,110,0.45)";
    context.lineWidth = width + 1;
    context.stroke();

    context.shadowBlur = 0;
  }

  // --------------------------------------------------
  // PARTICLES
  // --------------------------------------------------

  drawParticles(context) {
    this.particles.forEach((particle) => {
      context.save();

      context.globalAlpha = particle.life / particle.maxLife;

      context.fillStyle = particle.color;
      context.shadowColor = "#9aff75";
      context.shadowBlur = 5;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);

      context.fill();

      context.restore();
    });
  }

  // --------------------------------------------------
  // IMPACT FLASH
  // --------------------------------------------------

  drawImpactFlash(context) {
    if (this.impactFlash <= 0) return;

    const center = this.getTargetCenter();

    context.save();

    const gradient = context.createRadialGradient(
      center.x,
      center.y,
      2,
      center.x,
      center.y,
      60
    );

    gradient.addColorStop(0, `rgba(255,255,255,${this.impactFlash * 0.7})`);

    gradient.addColorStop(0.5, `rgba(160,255,120,${this.impactFlash * 0.35})`);

    gradient.addColorStop(1, "rgba(120,255,80,0)");

    context.fillStyle = gradient;

    context.beginPath();
    context.arc(center.x, center.y, 60, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }
}
