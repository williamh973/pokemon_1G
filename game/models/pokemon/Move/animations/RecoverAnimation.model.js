export class RecoverAnimation {
  static PHASES = {
    PREPARE: "PREPARE",
    GATHER: "GATHER",
    HEAL: "HEAL",
    RELEASE: "RELEASE",
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

    this.pokemon = this.pokemonViewer.sprite;

    this.phase = RecoverAnimation.PHASES.PREPARE;
    this.timer = 0;
    this.isFinished = false;

    this.phaseDuration = {
      PREPARE: 20,
      GATHER: 60,
      HEAL: 50,
      RELEASE: 60,
      FINISH: 20,
    };

    this.particles = [];
    this.rings = [];
    this.lightBeams = [];

    this.auraIntensity = 0;
    this.healProgress = 0;
    this.releaseProgress = 0;

    this.centerX = 0;
    this.centerY = 0;

    this.radius = 0;
  }

  update(context) {
    if (this.isFinished) return;

    this.timer++;

    this.centerX = this.pokemon.position.x + this.pokemon.frameWidth / 2;

    this.centerY = this.pokemon.position.y + this.pokemon.frameHeight / 2;

    switch (this.phase) {
      case RecoverAnimation.PHASES.PREPARE:
        this.updatePrepare();
        break;

      case RecoverAnimation.PHASES.GATHER:
        this.updateGather();
        break;

      case RecoverAnimation.PHASES.HEAL:
        this.updateHeal();
        break;

      case RecoverAnimation.PHASES.RELEASE:
        this.updateRelease();
        break;

      case RecoverAnimation.PHASES.FINISH:
        this.updateFinish();
        break;
    }

    this.updateParticles();
    this.updateRings();
    this.updateLightBeams();

    this.draw(context);
  }

  changePhase(phase) {
    this.phase = phase;
    this.timer = 0;
  }

  easeOut(value) {
    return 1 - Math.pow(1 - value, 3);
  }

  updatePrepare() {
    const progress = Math.min(1, this.timer / this.phaseDuration.PREPARE);

    this.auraIntensity = this.easeOut(progress) * 0.35;

    if (this.timer >= this.phaseDuration.PREPARE) {
      this.changePhase(RecoverAnimation.PHASES.GATHER);
    }
  }

  updateGather() {
    const progress = Math.min(1, this.timer / this.phaseDuration.GATHER);

    this.auraIntensity = 0.35 + progress * 0.65;

    if (this.timer % 3 === 0) {
      this.createGatherParticles();
    }

    if (this.timer % 10 === 0) {
      this.createRing();
    }

    if (this.timer >= this.phaseDuration.GATHER) {
      this.createLightBeams();
      this.changePhase(RecoverAnimation.PHASES.HEAL);
    }
  }

  updateHeal() {
    const progress = Math.min(1, this.timer / this.phaseDuration.HEAL);

    this.healProgress = progress;
    this.auraIntensity = 1;

    if (this.timer % 2 === 0) {
      this.createHealingParticles();
    }

    if (this.timer >= this.phaseDuration.HEAL) {
      this.changePhase(RecoverAnimation.PHASES.RELEASE);
    }
  }

  updateRelease() {
    const progress = Math.min(1, this.timer / this.phaseDuration.RELEASE);

    this.releaseProgress = progress;
    this.auraIntensity = 1 - this.easeOut(progress);

    if (this.timer % 3 === 0) {
      this.createReleaseParticles();
    }

    if (this.timer >= this.phaseDuration.RELEASE) {
      this.changePhase(RecoverAnimation.PHASES.FINISH);
    }
  }

  updateFinish() {
    if (this.timer >= this.phaseDuration.FINISH) {
      this.isFinished = true;
    }
  }

  createGatherParticles() {
    const angle = Math.random() * Math.PI * 2;
    const distance = 35 + Math.random() * 25;

    const x = this.centerX + Math.cos(angle) * distance;
    const y = this.centerY + Math.sin(angle) * distance;

    const dx = this.centerX - x;
    const dy = this.centerY - y;
    const length = Math.sqrt(dx * dx + dy * dy) || 1;

    this.particles.push({
      x,
      y,
      vx: (dx / length) * (1.2 + Math.random()),
      vy: (dy / length) * (1.2 + Math.random()),
      size: 2 + Math.random() * 2,
      life: 28,
      maxLife: 28,
      color: Math.random() > 0.5 ? "#b9f58b" : "#ffe58b",
      type: "gather",
    });
  }

  createHealingParticles() {
    const angle = Math.random() * Math.PI * 2;
    const distance = 15 + Math.random() * 30;

    this.particles.push({
      x: this.centerX + Math.cos(angle) * distance,
      y: this.centerY + Math.sin(angle) * distance,
      vx: (Math.random() - 0.5) * 0.5,
      vy: -1 - Math.random() * 1.5,
      size: 2 + Math.random() * 3,
      life: 25,
      maxLife: 25,
      color: Math.random() > 0.5 ? "#ffffff" : "#c5ff9b",
      type: "heal",
    });
  }

  createReleaseParticles() {
    const angle = Math.random() * Math.PI * 2;
    const speed = 1 + Math.random() * 2;

    this.particles.push({
      x: this.centerX,
      y: this.centerY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 2 + Math.random() * 3,
      life: 18,
      maxLife: 18,
      color: "#fff1b0",
      type: "release",
    });
  }

  createRing() {
    this.rings.push({
      radius: 5,
      maxRadius: 55,
      life: 24,
      maxLife: 24,
      rotation: Math.random() * Math.PI,
    });
  }

  createLightBeams() {
    for (let i = 0; i < 7; i++) {
      this.lightBeams.push({
        x: this.centerX + (Math.random() - 0.5) * 45,
        y: this.centerY - 35 - Math.random() * 20,
        width: 2 + Math.random() * 3,
        height: 35 + Math.random() * 25,
        life: 18 + Math.random() * 8,
        maxLife: 26,
      });
    }
  }

  updateParticles() {
    this.particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.type === "gather") {
        particle.vx *= 0.98;
        particle.vy *= 0.98;
      } else {
        particle.vx *= 0.97;
        particle.vy *= 0.97;
      }

      particle.life--;
    });

    this.particles = this.particles.filter((particle) => particle.life > 0);
  }

  updateRings() {
    this.rings.forEach((ring) => {
      const progress = 1 - ring.life / ring.maxLife;

      ring.radius = ring.maxRadius * progress;
      ring.life--;
    });

    this.rings = this.rings.filter((ring) => ring.life > 0);
  }

  updateLightBeams() {
    this.lightBeams.forEach((beam) => {
      beam.life--;
    });

    this.lightBeams = this.lightBeams.filter((beam) => beam.life > 0);
  }

  draw(context) {
    context.save();

    this.drawRings(context);
    this.drawAura(context);
    this.drawLightBeams(context);
    this.drawParticles(context);
    this.drawHealingFlash(context);

    context.restore();
  }

  drawAura(context) {
    if (this.auraIntensity <= 0) return;

    const pulse = 1 + Math.sin(this.timer * 0.2) * 0.08;

    const radius =
      Math.max(this.pokemon.frameWidth, this.pokemon.frameHeight) *
      0.85 *
      pulse;

    context.save();
    context.globalAlpha = this.auraIntensity * 0.7;

    const gradient = context.createRadialGradient(
      this.centerX,
      this.centerY,
      radius * 0.1,
      this.centerX,
      this.centerY,
      radius
    );

    gradient.addColorStop(0, "rgba(255,255,255,0.35)");
    gradient.addColorStop(0.35, "rgba(195,255,145,0.35)");
    gradient.addColorStop(0.7, "rgba(115,220,100,0.2)");
    gradient.addColorStop(1, "rgba(90,190,90,0)");

    context.fillStyle = gradient;
    context.beginPath();
    context.arc(this.centerX, this.centerY, radius, 0, Math.PI * 2);
    context.fill();

    // Halo extérieur.
    context.strokeStyle = "rgba(210,255,170,0.7)";
    context.lineWidth = 2;

    context.beginPath();
    context.ellipse(
      this.centerX,
      this.centerY,
      radius * 0.9,
      radius * 0.55,
      0,
      0,
      Math.PI * 2
    );
    context.stroke();

    context.restore();
  }

  drawRings(context) {
    context.save();

    this.rings.forEach((ring) => {
      const alpha = ring.life / ring.maxLife;

      context.globalAlpha = alpha * 0.75;
      context.strokeStyle = "#d7ffad";
      context.lineWidth = 2;

      context.beginPath();
      context.ellipse(
        this.centerX,
        this.centerY + this.pokemon.frameHeight * 0.3,
        ring.radius,
        ring.radius * 0.3,
        ring.rotation,
        0,
        Math.PI * 2
      );
      context.stroke();
    });

    context.restore();
  }

  drawLightBeams(context) {
    context.save();

    this.lightBeams.forEach((beam) => {
      const alpha = beam.life / beam.maxLife;

      context.globalAlpha = alpha * 0.65;

      const gradient = context.createLinearGradient(
        beam.x,
        beam.y,
        beam.x,
        beam.y + beam.height
      );

      gradient.addColorStop(0, "rgba(255,255,255,0)");
      gradient.addColorStop(0.3, "#ffffff");
      gradient.addColorStop(0.7, "#e5ffbf");
      gradient.addColorStop(1, "rgba(255,255,255,0)");

      context.fillStyle = gradient;

      context.fillRect(beam.x, beam.y, beam.width, beam.height);
    });

    context.restore();
  }

  drawParticles(context) {
    context.save();

    this.particles.forEach((particle) => {
      const alpha = particle.life / particle.maxLife;

      context.globalAlpha = alpha;
      context.fillStyle = particle.color;

      context.shadowColor = particle.color;
      context.shadowBlur = 6;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fill();
    });

    context.restore();
  }

  drawHealingFlash(context) {
    if (this.phase !== RecoverAnimation.PHASES.HEAL) return;

    const pulse = Math.sin(this.timer * 0.45);

    const radius = 25 + pulse * 8;

    context.save();
    context.globalAlpha = 0.25 + pulse * 0.1;

    const gradient = context.createRadialGradient(
      this.centerX,
      this.centerY,
      0,
      this.centerX,
      this.centerY,
      radius
    );

    gradient.addColorStop(0, "#ffffff");
    gradient.addColorStop(0.5, "#e5ffc4");
    gradient.addColorStop(1, "rgba(190,255,150,0)");

    context.fillStyle = gradient;

    context.beginPath();
    context.arc(this.centerX, this.centerY, radius, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }
}
