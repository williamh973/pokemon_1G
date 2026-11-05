export class PsywaveAnimation {
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

    const attacker = this.pokemonViewer.sprite;
    const target = this.targetViewer.sprite;

    this.attackerCenterX = attacker.position.x + attacker.frameWidth / 2;

    this.attackerCenterY = attacker.position.y + attacker.frameHeight / 2;

    this.targetOriginalPosition = {
      x: target.position.x,
      y: target.position.y,
    };

    this.targetCenterX = target.position.x + target.frameWidth / 2;

    this.targetCenterY = target.position.y + target.frameHeight / 2;

    this.phase = "CHARGE";
    this.timer = 0;
    this.isFinished = false;

    this.duration = {
      CHARGE: 25,
      PROPAGATION: 55,
      IMPACT: 25,
      DISSIPATION: 35,
    };

    this.orbRadius = 0;
    this.orbOpacity = 0;

    this.waves = [];
    this.particles = [];
    this.impactParticles = [];

    this.targetDistortionX = 0;
    this.targetDistortionY = 0;

    this.flashOpacity = 0;
    this.hasShaken = false;

    this.createParticles();
    this.createWaves();
  }

  createParticles() {
    for (let i = 0; i < 28; i++) {
      this.particles.push({
        angle: Math.random() * Math.PI * 2,
        radius: 10 + Math.random() * 30,
        speed: 0.04 + Math.random() * 0.05,
        size: 1.5 + Math.random() * 3,
        opacity: 0.5 + Math.random() * 0.5,
      });
    }
  }

  createWaves() {
    const startX = this.attackerCenterX;
    const startY = this.attackerCenterY;

    const endX = this.targetCenterX;
    const endY = this.targetCenterY;

    const dx = endX - startX;
    const dy = endY - startY;

    const distance = Math.sqrt(dx * dx + dy * dy);

    this.directionX = dx / distance;
    this.directionY = dy / distance;

    this.perpendicularX = -this.directionY;
    this.perpendicularY = this.directionX;

    this.distance = distance;

    for (let i = 0; i < 5; i++) {
      this.waves.push({
        progress: -i * 0.16,
        speed: 0.018 + Math.random() * 0.006,
        radius: 12 + Math.random() * 8,
        opacity: 0.9,
        thickness: 2 + Math.random() * 2,
        distortion: 3 + Math.random() * 5,
        rotation: Math.random() * Math.PI * 2,
      });
    }
  }

  nextPhase() {
    const phases = Object.keys(this.duration);
    const currentIndex = phases.indexOf(this.phase);

    this.phase = phases[currentIndex + 1];
    this.timer = 0;

    if (this.phase === "IMPACT" && !this.hasShaken) {
      this.game.canvas.startShake(12, 3);
      this.hasShaken = true;

      this.createImpactParticles();
    }
  }

  createImpactParticles() {
    for (let i = 0; i < 35; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 4;

      this.impactParticles.push({
        x: this.targetCenterX,
        y: this.targetCenterY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 1.5 + Math.random() * 3,
        life: 25 + Math.random() * 20,
        maxLife: 45,
      });
    }
  }

  update(context) {
    if (this.isFinished) return;

    this.timer++;

    switch (this.phase) {
      case "CHARGE":
        this.updateCharge();
        break;

      case "PROPAGATION":
        this.updatePropagation();
        break;

      case "IMPACT":
        this.updateImpact();
        break;

      case "DISSIPATION":
        this.updateDissipation();
        break;
    }

    this.updateParticles();
    this.updateImpactParticles();

    this.draw(context);
  }

  updateCharge() {
    const progress = Math.min(this.timer / this.duration.CHARGE, 1);

    this.orbRadius = 5 + progress * 23;
    this.orbOpacity = progress;

    this.updateEnergyParticles();

    if (this.timer >= this.duration.CHARGE) {
      this.nextPhase();
    }
  }

  updatePropagation() {
    this.orbRadius *= 0.92;
    this.orbOpacity *= 0.9;

    this.waves.forEach((wave) => {
      wave.progress += wave.speed;

      wave.radius += 0.5;
      wave.rotation += 0.04;

      wave.opacity = Math.max(0, 1 - wave.progress * 0.35);
    });

    if (this.timer >= this.duration.PROPAGATION) {
      this.nextPhase();
    }
  }

  updateImpact() {
    const progress = Math.min(this.timer / this.duration.IMPACT, 1);

    // Distorsion irrégulière du sprite adverse.
    const intensity = Math.sin(progress * Math.PI);

    this.targetDistortionX = Math.sin(this.timer * 0.9) * 7 * intensity;

    this.targetDistortionY = Math.cos(this.timer * 0.7) * 3 * intensity;

    this.flashOpacity = Math.max(0, 0.65 - progress * 0.65);

    if (this.timer >= this.duration.IMPACT) {
      this.targetDistortionX = 0;
      this.targetDistortionY = 0;

      this.nextPhase();
    }
  }

  updateDissipation() {
    this.flashOpacity = Math.max(0, this.flashOpacity - 0.08);

    this.targetDistortionX *= 0.7;
    this.targetDistortionY *= 0.7;

    if (this.timer >= this.duration.DISSIPATION) {
      this.restoreTargetPosition();
      this.isFinished = true;
    }
  }

  updateEnergyParticles() {
    this.particles.forEach((particle) => {
      particle.angle += particle.speed;
      particle.radius += Math.sin(this.timer * 0.15) * 0.2;
    });
  }

  updateParticles() {
    this.particles = this.particles.filter(
      (particle) => particle.opacity > 0.05
    );
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
  }

  restoreTargetPosition() {
    this.targetViewer.sprite.position.x = this.targetOriginalPosition.x;

    this.targetViewer.sprite.position.y = this.targetOriginalPosition.y;
  }

  draw(context) {
    this.drawChargeOrb(context);
    this.drawPropagationWaves(context);
    this.drawImpactWaves(context);
    this.drawEnergyParticles(context);
    this.drawImpactParticles(context);
    this.drawFlash(context);
  }

  drawChargeOrb(context) {
    if (this.phase !== "CHARGE") return;

    const pulse = Math.sin(this.timer * 0.35) * 3;

    context.save();

    const gradient = context.createRadialGradient(
      this.attackerCenterX,
      this.attackerCenterY,
      2,
      this.attackerCenterX,
      this.attackerCenterY,
      this.orbRadius + pulse
    );

    gradient.addColorStop(0, "rgba(255,255,255,0.95)");
    gradient.addColorStop(0.3, "rgba(220,170,255,0.9)");
    gradient.addColorStop(0.7, "rgba(150,70,230,0.65)");
    gradient.addColorStop(1, "rgba(100,30,180,0)");

    context.fillStyle = gradient;

    context.beginPath();
    context.arc(
      this.attackerCenterX,
      this.attackerCenterY,
      this.orbRadius + pulse,
      0,
      Math.PI * 2
    );

    context.fill();

    context.restore();
  }

  drawPropagationWaves(context) {
    if (this.phase !== "PROPAGATION") return;

    context.save();

    this.waves.forEach((wave) => {
      if (wave.progress < 0 || wave.progress > 1) return;

      const x =
        this.attackerCenterX + this.directionX * this.distance * wave.progress;

      const y =
        this.attackerCenterY + this.directionY * this.distance * wave.progress;

      const radius = wave.radius + Math.sin(wave.progress * Math.PI) * 10;

      const distortion =
        Math.sin(this.timer * 0.25 + wave.rotation) * wave.distortion;

      context.save();

      context.translate(x, y);
      context.rotate(
        Math.atan2(this.directionY, this.directionX) + distortion * 0.02
      );

      context.globalAlpha = wave.opacity;

      context.strokeStyle = "#d9a7ff";
      context.lineWidth = wave.thickness;
      context.shadowColor = "#a34dff";
      context.shadowBlur = 14;

      context.beginPath();
      context.ellipse(
        0,
        0,
        radius + distortion,
        radius * 0.55,
        0,
        0,
        Math.PI * 2
      );

      context.stroke();

      // Deuxième contour lumineux.
      context.globalAlpha *= 0.45;
      context.strokeStyle = "#ffffff";
      context.lineWidth = 1.5;

      context.beginPath();
      context.ellipse(0, 0, radius * 0.7, radius * 0.35, 0, 0, Math.PI * 2);

      context.stroke();

      context.restore();
    });

    context.restore();
  }

  drawImpactWaves(context) {
    if (this.phase !== "IMPACT" && this.phase !== "DISSIPATION") {
      return;
    }

    const progress =
      this.phase === "IMPACT"
        ? this.timer / this.duration.IMPACT
        : 1 + this.timer / this.duration.DISSIPATION;

    context.save();

    for (let i = 0; i < 3; i++) {
      const radius = 15 + progress * 65 + i * 12;

      context.globalAlpha = Math.max(0, 1 - progress);

      context.strokeStyle = i % 2 === 0 ? "#e9caff" : "#a45be8";

      context.lineWidth = 3 - i * 0.5;
      context.shadowColor = "#b76cff";
      context.shadowBlur = 16;

      context.beginPath();
      context.arc(
        this.targetCenterX,
        this.targetCenterY,
        radius,
        0,
        Math.PI * 2
      );

      context.stroke();
    }

    context.restore();
  }

  drawEnergyParticles(context) {
    context.save();

    this.particles.forEach((particle) => {
      if (this.phase !== "CHARGE") return;

      const x =
        this.attackerCenterX + Math.cos(particle.angle) * particle.radius;

      const y =
        this.attackerCenterY + Math.sin(particle.angle) * particle.radius;

      context.globalAlpha = particle.opacity;
      context.fillStyle = "#ead4ff";
      context.shadowColor = "#a34dff";
      context.shadowBlur = 10;

      context.beginPath();
      context.arc(x, y, particle.size, 0, Math.PI * 2);

      context.fill();
    });

    context.restore();
  }

  drawImpactParticles(context) {
    context.save();

    this.impactParticles.forEach((particle) => {
      context.globalAlpha = Math.max(0, particle.life / particle.maxLife);

      context.fillStyle = "#e8caff";
      context.shadowColor = "#a34dff";
      context.shadowBlur = 10;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);

      context.fill();
    });

    context.restore();
  }

  drawFlash(context) {
    if (this.flashOpacity <= 0) return;

    context.save();

    context.globalAlpha = this.flashOpacity;
    context.fillStyle = "#e8d0ff";

    context.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);

    context.restore();
  }
}
