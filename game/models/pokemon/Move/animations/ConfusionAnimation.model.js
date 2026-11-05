export class ConfusionAnimation {
  constructor(game, viewers, turnAction) {
    this.game = game;
    this.viewers = viewers;
    this.turnAction = turnAction;

    if (this.viewers.front.slot.content === turnAction.pokemon) {
      this.pokemonViewer = this.viewers.front;
      this.targetViewer = this.viewers.back;
    } else {
      this.pokemonViewer = this.viewers.back;
      this.targetViewer = this.viewers.front;
    }

    const sprite = this.targetViewer.sprite;

    this.centerX = sprite.position.x + sprite.frameWidth / 2;
    this.centerY = sprite.position.y + sprite.frameHeight / 2;

    this.phase = "PREPARE";
    this.timer = 0;
    this.isFinished = false;

    this.chargeParticles = [];
    this.waves = [];
    this.impactParticles = [];
    this.stars = [];
    this.distortionRings = [];

    this.auraOpacity = 0;
    this.flashOpacity = 0;
    this.impactRadius = 0;

    this.createChargeParticles();
  }

  update(context) {
    this.timer++;

    switch (this.phase) {
      case "PREPARE":
        this.updatePrepare();
        break;

      case "PSYCHIC_WAVE":
        this.updatePsychicWave();
        break;

      case "IMPACT":
        this.updateImpact();
        break;

      case "DISSIPATION":
        this.updateDissipation();
        break;
    }

    this.draw(context);
  }

  // --------------------------------------------------
  // PHASE 1 : PREPARE
  // --------------------------------------------------

  updatePrepare() {
    this.auraOpacity = Math.min(1, this.timer / 25);

    this.updateChargeParticles();

    if (this.timer >= 30) {
      this.nextPhase("PSYCHIC_WAVE");
      this.createPsychicWaves();
    }
  }

  // --------------------------------------------------
  // PHASE 2 : PSYCHIC WAVE
  // --------------------------------------------------

  updatePsychicWave() {
    this.updateWaves();
    this.updateChargeParticles();

    if (this.timer >= 35) {
      this.nextPhase("IMPACT");

      this.createImpactParticles();
      this.createDistortionRings();

      this.flashOpacity = 0.9;

      if (this.game.canvas?.startShake) {
        this.game.canvas.startShake(12, 2);
      }
    }
  }

  // --------------------------------------------------
  // PHASE 3 : IMPACT
  // --------------------------------------------------

  updateImpact() {
    this.updateImpactParticles();
    this.updateDistortionRings();

    this.impactRadius = Math.min(65, this.timer * 4);

    this.flashOpacity = Math.max(0, this.flashOpacity - 0.09);

    if (this.timer >= 25) {
      this.nextPhase("DISSIPATION");
    }
  }

  // --------------------------------------------------
  // PHASE 4 : DISSIPATION
  // --------------------------------------------------

  updateDissipation() {
    this.updateImpactParticles();
    this.updateDistortionRings();
    this.updateWaves();

    this.auraOpacity = Math.max(0, this.auraOpacity - 0.035);

    this.flashOpacity = 0;

    if (this.timer >= 45) {
      this.isFinished = true;
    }
  }

  // --------------------------------------------------
  // PHASE MANAGEMENT
  // --------------------------------------------------

  nextPhase(phase) {
    this.phase = phase;
    this.timer = 0;
  }

  // --------------------------------------------------
  // PARTICLE CREATION
  // --------------------------------------------------

  createChargeParticles() {
    for (let i = 0; i < 24; i++) {
      this.chargeParticles.push({
        angle: Math.random() * Math.PI * 2,
        radius: 30 + Math.random() * 30,
        speed: 0.035 + Math.random() * 0.045,
        size: 1.5 + Math.random() * 2.5,
      });
    }
  }

  createPsychicWaves() {
    for (let i = 0; i < 4; i++) {
      this.waves.push({
        radius: 5 + i * 12,
        speed: 3 + i * 0.6,
        opacity: 0.9 - i * 0.12,
        width: 4 - i * 0.5,
      });
    }
  }

  createImpactParticles() {
    for (let i = 0; i < 55; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 5;

      this.impactParticles.push({
        x: this.centerX,
        y: this.centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 4,
        life: 25 + Math.random() * 25,
        maxLife: 50,
        color: Math.random() > 0.5 ? "#f4a6ff" : "#8d4cff",
      });
    }

    for (let i = 0; i < 12; i++) {
      this.stars.push({
        angle: Math.random() * Math.PI * 2,
        radius: 15 + Math.random() * 35,
        size: 3 + Math.random() * 4,
        rotation: Math.random() * Math.PI,
        life: 30 + Math.random() * 20,
      });
    }
  }

  createDistortionRings() {
    for (let i = 0; i < 5; i++) {
      this.distortionRings.push({
        radius: 8 + i * 8,
        speed: 2.5 + i * 0.7,
        opacity: 0.8 - i * 0.1,
        width: 3,
      });
    }
  }

  // --------------------------------------------------
  // PARTICLE UPDATES
  // --------------------------------------------------

  updateChargeParticles() {
    this.chargeParticles.forEach((particle) => {
      particle.angle += particle.speed;
      particle.radius -= 0.12;

      if (particle.radius < 12) {
        particle.radius = 45 + Math.random() * 15;
      }
    });
  }

  updateWaves() {
    this.waves.forEach((wave) => {
      wave.radius += wave.speed;
      wave.opacity -= 0.018;
    });

    this.waves = this.waves.filter((wave) => wave.opacity > 0);
  }

  updateImpactParticles() {
    this.impactParticles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      particle.vx *= 0.96;
      particle.vy *= 0.96;

      particle.life--;
    });

    this.impactParticles = this.impactParticles.filter(
      (particle) => particle.life > 0
    );

    this.stars.forEach((star) => {
      star.radius += 1.2;
      star.rotation += 0.12;
      star.life--;
    });

    this.stars = this.stars.filter((star) => star.life > 0);
  }

  updateDistortionRings() {
    this.distortionRings.forEach((ring) => {
      ring.radius += ring.speed;
      ring.opacity -= 0.035;
    });

    this.distortionRings = this.distortionRings.filter(
      (ring) => ring.opacity > 0
    );
  }

  // --------------------------------------------------
  // MAIN DRAW
  // --------------------------------------------------

  draw(context) {
    this.drawPsychicAura(context);
    this.drawChargeParticles(context);
    this.drawPsychicWaves(context);
    this.drawImpact(context);
    this.drawDistortionRings(context);
    this.drawImpactParticles(context);
    this.drawStars(context);
    this.drawFlash(context);
  }

  // --------------------------------------------------
  // PSYCHIC AURA
  // --------------------------------------------------

  drawPsychicAura(context) {
    if (this.auraOpacity <= 0) return;

    const pulse = 1 + Math.sin(this.timer * 0.25) * 0.08;

    context.save();

    const gradient = context.createRadialGradient(
      this.centerX,
      this.centerY,
      3,
      this.centerX,
      this.centerY,
      55 * pulse
    );

    gradient.addColorStop(0, `rgba(255,220,255,${this.auraOpacity * 0.8})`);

    gradient.addColorStop(0.4, `rgba(190,90,255,${this.auraOpacity * 0.5})`);

    gradient.addColorStop(1, "rgba(130,30,255,0)");

    context.fillStyle = gradient;

    context.beginPath();
    context.arc(this.centerX, this.centerY, 55 * pulse, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }

  // --------------------------------------------------
  // CHARGE PARTICLES
  // --------------------------------------------------

  drawChargeParticles(context) {
    if (this.phase !== "PREPARE" && this.phase !== "PSYCHIC_WAVE") {
      return;
    }

    context.save();

    this.chargeParticles.forEach((particle) => {
      const x = this.centerX + Math.cos(particle.angle) * particle.radius;

      const y = this.centerY + Math.sin(particle.angle) * particle.radius;

      context.globalAlpha = this.auraOpacity;
      context.fillStyle = "#f7c6ff";

      context.beginPath();
      context.arc(x, y, particle.size, 0, Math.PI * 2);
      context.fill();
    });

    context.restore();
  }

  // --------------------------------------------------
  // PSYCHIC WAVES
  // --------------------------------------------------

  drawPsychicWaves(context) {
    if (this.waves.length === 0) return;

    context.save();

    this.waves.forEach((wave) => {
      context.globalAlpha = wave.opacity;
      context.strokeStyle = "#d9a0ff";
      context.lineWidth = wave.width;

      context.beginPath();
      context.arc(this.centerX, this.centerY, wave.radius, 0, Math.PI * 2);
      context.stroke();
    });

    context.restore();
  }

  // --------------------------------------------------
  // IMPACT
  // --------------------------------------------------

  drawImpact(context) {
    if (this.impactRadius <= 0) return;

    context.save();

    const gradient = context.createRadialGradient(
      this.centerX,
      this.centerY,
      0,
      this.centerX,
      this.centerY,
      this.impactRadius
    );

    gradient.addColorStop(0, "rgba(255,255,255,0.9)");
    gradient.addColorStop(0.3, "rgba(240,190,255,0.75)");
    gradient.addColorStop(0.7, "rgba(160,70,255,0.45)");
    gradient.addColorStop(1, "rgba(100,20,220,0)");

    context.fillStyle = gradient;

    context.beginPath();
    context.arc(this.centerX, this.centerY, this.impactRadius, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }

  // --------------------------------------------------
  // DISTORTION RINGS
  // --------------------------------------------------

  drawDistortionRings(context) {
    if (this.distortionRings.length === 0) return;

    context.save();

    this.distortionRings.forEach((ring) => {
      context.globalAlpha = ring.opacity;
      context.strokeStyle = "#e8b5ff";
      context.lineWidth = ring.width;

      context.beginPath();
      context.ellipse(
        this.centerX,
        this.centerY,
        ring.radius,
        ring.radius * 0.72,
        0,
        0,
        Math.PI * 2
      );
      context.stroke();
    });

    context.restore();
  }

  // --------------------------------------------------
  // IMPACT PARTICLES
  // --------------------------------------------------

  drawImpactParticles(context) {
    context.save();

    this.impactParticles.forEach((particle) => {
      const alpha = Math.min(1, particle.life / 15);

      context.globalAlpha = alpha;
      context.fillStyle = particle.color;

      context.beginPath();
      context.arc(
        particle.x,
        particle.y,
        particle.size * alpha,
        0,
        Math.PI * 2
      );
      context.fill();
    });

    context.restore();
  }

  // --------------------------------------------------
  // STARS
  // --------------------------------------------------

  drawStars(context) {
    if (this.stars.length === 0) return;

    context.save();

    this.stars.forEach((star) => {
      context.save();

      const x = this.centerX + Math.cos(star.angle) * star.radius;

      const y = this.centerY + Math.sin(star.angle) * star.radius;

      context.translate(x, y);
      context.rotate(star.rotation);

      context.globalAlpha = Math.min(1, star.life / 15);
      context.fillStyle = "#fff4ff";

      context.beginPath();
      context.moveTo(0, -star.size);
      context.lineTo(star.size * 0.3, -star.size * 0.3);
      context.lineTo(star.size, 0);
      context.lineTo(star.size * 0.3, star.size * 0.3);
      context.lineTo(0, star.size);
      context.lineTo(-star.size * 0.3, star.size * 0.3);
      context.lineTo(-star.size, 0);
      context.lineTo(-star.size * 0.3, -star.size * 0.3);
      context.closePath();
      context.fill();

      context.restore();
    });

    context.restore();
  }

  // --------------------------------------------------
  // FLASH
  // --------------------------------------------------

  drawFlash(context) {
    if (this.flashOpacity <= 0) return;

    context.save();

    context.globalAlpha = this.flashOpacity * 0.45;
    context.fillStyle = "#f5e6ff";

    context.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);

    context.restore();
  }
}
