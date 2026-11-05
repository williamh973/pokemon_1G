export class PsychicAnimation {
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

    this.targetWidth = target.frameWidth;
    this.targetHeight = target.frameHeight;

    this.phase = "PREPARE";
    this.timer = 0;
    this.isFinished = false;

    this.duration = {
      PREPARE: 30,
      GRIP: 35,
      DOMINATION: 55,
      RELEASE: 25,
      DISSIPATION: 45,
    };

    this.liftOffset = 0;
    this.energyRadius = 0;
    this.energyOpacity = 0;
    this.flashOpacity = 0;

    this.targetRotation = 0;
    this.targetOffsetX = 0;
    this.targetOffsetY = 0;

    this.particles = [];
    this.stars = [];
    this.tendrils = [];

    this.hasShaken = false;

    this.createInitialParticles();
    this.createTendrils();
  }

  createInitialParticles() {
    for (let i = 0; i < 24; i++) {
      this.particles.push({
        angle: Math.random() * Math.PI * 2,
        radius: 15 + Math.random() * 45,
        speed: 0.025 + Math.random() * 0.04,
        size: 1.5 + Math.random() * 3,
        opacity: 0.5 + Math.random() * 0.5,
      });
    }
  }

  createTendrils() {
    for (let i = 0; i < 5; i++) {
      this.tendrils.push({
        angle: (Math.PI * 2 * i) / 5,
        phase: Math.random() * Math.PI * 2,
        amplitude: 8 + Math.random() * 12,
      });
    }
  }

  nextPhase() {
    const phases = Object.keys(this.duration);
    const currentIndex = phases.indexOf(this.phase);

    this.phase = phases[currentIndex + 1];
    this.timer = 0;

    if (this.phase === "RELEASE" && !this.hasShaken) {
      this.game.canvas.startShake(20, 5);
      this.hasShaken = true;
    }

    if (this.phase === "DISSIPATION") {
      this.createReleaseParticles();
    }
  }

  createReleaseParticles() {
    for (let i = 0; i < 55; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 4.5;

      this.stars.push({
        x: this.targetCenterX,
        y: this.targetCenterY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 4,
        life: 35 + Math.random() * 20,
        maxLife: 55,
        rotation: Math.random() * Math.PI,
      });
    }
  }

  update(context) {
    if (this.isFinished) return;

    this.timer++;

    switch (this.phase) {
      case "PREPARE":
        this.updatePrepare();
        break;

      case "GRIP":
        this.updateGrip();
        break;

      case "DOMINATION":
        this.updateDomination();
        break;

      case "RELEASE":
        this.updateRelease();
        break;

      case "DISSIPATION":
        this.updateDissipation();
        break;
    }

    this.updateParticles();
    this.updateStars();

    this.updateTargetPosition();

    this.draw(context);
  }

  updatePrepare() {
    const progress = Math.min(this.timer / 30, 1);

    this.energyRadius = 12 + progress * 30;
    this.energyOpacity = progress;

    this.updateEnergyParticles();

    if (this.timer >= this.duration.PREPARE) {
      this.nextPhase();
    }
  }

  updateGrip() {
    const progress = Math.min(this.timer / 35, 1);

    // Le Pokémon est progressivement soulevé.
    this.liftOffset = 24 * this.easeOut(progress);

    this.energyRadius = 40 + Math.sin(this.timer * 0.3) * 5;
    this.energyOpacity = 1;

    this.updateEnergyParticles();

    if (this.timer >= this.duration.GRIP) {
      this.nextPhase();
    }
  }

  updateDomination() {
    const progress = this.timer / this.duration.DOMINATION;

    // Le déplacement devient de plus en plus imprévisible.
    const intensity = 1 + progress * 1.5;

    const horizontalMovement =
      Math.sin(this.timer * 0.27) * 9 * intensity +
      Math.sin(this.timer * 0.73) * 3 * intensity;

    const verticalMovement =
      Math.sin(this.timer * 0.19) * 5 + Math.sin(this.timer * 0.61) * 2;

    this.targetOffsetX = horizontalMovement;
    this.targetOffsetY = verticalMovement;

    // Inclinaisons successives du corps.
    this.targetRotation =
      Math.sin(this.timer * 0.22) * 0.12 + Math.sin(this.timer * 0.57) * 0.035;

    // L'énergie comprime progressivement la cible.
    this.energyRadius = 44 - progress * 17 + Math.sin(this.timer * 0.3) * 3;

    this.energyOpacity = 1;

    this.liftOffset = 24 + Math.sin(this.timer * 0.18) * 3;

    // Quelques secousses plus brutales.
    if (this.timer % 13 < 3) {
      this.targetOffsetX += Math.sin(this.timer * 2.5) * 5;
    }

    this.updateEnergyParticles();

    if (this.timer >= this.duration.DOMINATION) {
      this.nextPhase();
    }
  }

  updateRelease() {
    const progress = Math.min(this.timer / 25, 1);

    this.targetOffsetX *= 0.65;
    this.targetOffsetY *= 0.65;
    this.targetRotation *= 0.65;

    this.liftOffset = 24 * (1 - this.easeIn(progress));

    this.energyRadius = 25 + progress * 100;
    this.energyOpacity = 1 - progress;

    this.flashOpacity = Math.max(0, 1 - progress * 1.5);

    if (this.timer >= this.duration.RELEASE) {
      this.nextPhase();
    }
  }

  updateDissipation() {
    this.targetOffsetX *= 0.75;
    this.targetOffsetY *= 0.75;
    this.targetRotation *= 0.75;

    this.liftOffset *= 0.75;

    this.energyRadius *= 1.08;
    this.energyOpacity *= 0.88;

    this.flashOpacity = Math.max(0, this.flashOpacity - 0.08);

    if (this.timer >= this.duration.DISSIPATION) {
      this.restoreTargetPosition();
      this.isFinished = true;
    }
  }

  updateTargetPosition() {
    const sprite = this.targetViewer.sprite;

    sprite.position.x = this.targetOriginalPosition.x + this.targetOffsetX;

    sprite.position.y =
      this.targetOriginalPosition.y - this.liftOffset + this.targetOffsetY;
  }

  restoreTargetPosition() {
    const sprite = this.targetViewer.sprite;

    sprite.position.x = this.targetOriginalPosition.x;
    sprite.position.y = this.targetOriginalPosition.y;
  }

  easeOut(value) {
    return 1 - Math.pow(1 - value, 3);
  }

  easeIn(value) {
    return value * value * value;
  }

  updateEnergyParticles() {
    this.particles.forEach((particle) => {
      particle.angle += particle.speed;
    });
  }

  updateParticles() {
    this.stars.forEach((star) => {
      star.x += star.vx;
      star.y += star.vy;

      star.vx *= 0.97;
      star.vy *= 0.97;

      star.life--;
      star.rotation += 0.08;
    });
  }

  updateStars() {
    this.stars = this.stars.filter((star) => star.life > 0);
  }

  draw(context) {
    this.drawAttackerAura(context);
    this.drawEnergyConnection(context);
    this.drawTendrils(context);
    this.drawTargetRings(context);
    this.drawEnergySphere(context);
    this.drawReleaseWave(context);
    this.drawParticles(context);
    this.drawFlash(context);
  }

  drawAttackerAura(context) {
    if (this.phase !== "PREPARE") return;

    const pulse = Math.sin(this.timer * 0.25) * 5;

    context.save();

    const gradient = context.createRadialGradient(
      this.attackerCenterX,
      this.attackerCenterY,
      5,
      this.attackerCenterX,
      this.attackerCenterY,
      this.energyRadius + pulse
    );

    gradient.addColorStop(0, "rgba(255,255,255,0.8)");
    gradient.addColorStop(0.35, "rgba(190,120,255,0.5)");
    gradient.addColorStop(1, "rgba(120,40,220,0)");

    context.fillStyle = gradient;

    context.beginPath();
    context.arc(
      this.attackerCenterX,
      this.attackerCenterY,
      this.energyRadius + pulse,
      0,
      Math.PI * 2
    );

    context.fill();
    context.restore();
  }

  drawEnergyConnection(context) {
    if (this.phase !== "GRIP" && this.phase !== "DOMINATION") {
      return;
    }

    context.save();

    context.globalAlpha = 0.55;
    context.lineWidth = 3;
    context.strokeStyle = "#d9a7ff";
    context.shadowColor = "#a34dff";
    context.shadowBlur = 15;

    context.beginPath();
    context.moveTo(this.attackerCenterX, this.attackerCenterY);

    context.lineTo(
      this.targetCenterX + this.targetOffsetX,
      this.targetCenterY - this.liftOffset + this.targetOffsetY
    );

    context.stroke();
    context.restore();
  }

  drawTendrils(context) {
    if (this.phase !== "GRIP" && this.phase !== "DOMINATION") {
      return;
    }

    const targetX = this.targetCenterX + this.targetOffsetX;
    const targetY = this.targetCenterY - this.liftOffset + this.targetOffsetY;

    context.save();

    this.tendrils.forEach((tendril, index) => {
      const angle =
        tendril.angle + Math.sin(this.timer * 0.12 + tendril.phase) * 0.2;

      const startX = this.attackerCenterX + Math.cos(angle) * 12;

      const startY = this.attackerCenterY + Math.sin(angle) * 12;

      const endX = targetX + Math.cos(angle + index * 0.4) * 24;

      const endY = targetY + Math.sin(angle + index * 0.4) * 24;

      const controlX =
        (startX + endX) / 2 +
        Math.sin(this.timer * 0.2 + tendril.phase) * tendril.amplitude;

      const controlY =
        (startY + endY) / 2 +
        Math.cos(this.timer * 0.2 + tendril.phase) * tendril.amplitude;

      context.beginPath();
      context.moveTo(startX, startY);
      context.quadraticCurveTo(controlX, controlY, endX, endY);

      context.strokeStyle = "rgba(190,120,255,0.85)";
      context.lineWidth = 2.5;
      context.shadowColor = "#b76cff";
      context.shadowBlur = 12;
      context.stroke();
    });

    context.restore();
  }

  drawTargetRings(context) {
    if (
      this.phase !== "GRIP" &&
      this.phase !== "DOMINATION" &&
      this.phase !== "RELEASE"
    ) {
      return;
    }

    const targetX = this.targetCenterX + this.targetOffsetX;
    const targetY = this.targetCenterY - this.liftOffset + this.targetOffsetY;

    context.save();

    for (let i = 0; i < 4; i++) {
      const rotation = this.timer * (i % 2 === 0 ? 0.045 : -0.045);

      const radius = this.energyRadius - i * 7;

      context.save();
      context.translate(targetX, targetY);
      context.rotate(rotation);

      context.strokeStyle =
        i % 2 === 0 ? "rgba(220,170,255,0.85)" : "rgba(140,70,230,0.8)";

      context.lineWidth = 2.5;
      context.shadowColor = "#b76cff";
      context.shadowBlur = 12;

      context.beginPath();
      context.ellipse(
        0,
        0,
        Math.max(0, radius),
        Math.max(0, radius * 0.42),
        0,
        0,
        Math.PI * 2
      );

      context.stroke();
      context.restore();
    }

    context.restore();
  }

  drawEnergySphere(context) {
    if (
      this.phase !== "GRIP" &&
      this.phase !== "DOMINATION" &&
      this.phase !== "RELEASE" &&
      this.phase !== "DISSIPATION"
    ) {
      return;
    }

    const radius = Math.max(0, this.energyRadius);

    const targetX = this.targetCenterX + this.targetOffsetX;
    const targetY = this.targetCenterY - this.liftOffset + this.targetOffsetY;

    context.save();
    context.globalAlpha = this.energyOpacity;

    const gradient = context.createRadialGradient(
      targetX - radius * 0.2,
      targetY - radius * 0.2,
      2,
      targetX,
      targetY,
      radius
    );

    gradient.addColorStop(0, "rgba(255,255,255,0.65)");
    gradient.addColorStop(0.25, "rgba(220,170,255,0.4)");
    gradient.addColorStop(0.65, "rgba(150,70,230,0.2)");
    gradient.addColorStop(1, "rgba(100,30,180,0)");

    context.fillStyle = gradient;
    context.beginPath();
    context.arc(targetX, targetY, radius, 0, Math.PI * 2);

    context.fill();
    context.restore();
  }

  drawReleaseWave(context) {
    if (this.phase !== "RELEASE" && this.phase !== "DISSIPATION") {
      return;
    }

    const progress =
      this.phase === "RELEASE" ? this.timer / 25 : 1 + this.timer / 45;

    const radius = 20 + progress * 75;

    context.save();

    context.globalAlpha =
      this.phase === "RELEASE"
        ? 1 - progress
        : Math.max(0, 1 - this.timer / 45);

    context.strokeStyle = "#e5c5ff";
    context.lineWidth = 4;
    context.shadowColor = "#a34dff";
    context.shadowBlur = 18;

    context.beginPath();
    context.arc(this.targetCenterX, this.targetCenterY, radius, 0, Math.PI * 2);

    context.stroke();
    context.restore();
  }

  drawParticles(context) {
    context.save();

    this.particles.forEach((particle) => {
      if (this.phase === "PREPARE") {
        const x =
          this.attackerCenterX + Math.cos(particle.angle) * particle.radius;

        const y =
          this.attackerCenterY + Math.sin(particle.angle) * particle.radius;

        context.globalAlpha = particle.opacity;
        context.fillStyle = "#e6c5ff";
        context.shadowColor = "#b76cff";
        context.shadowBlur = 10;

        context.beginPath();
        context.arc(x, y, particle.size, 0, Math.PI * 2);
        context.fill();
      } else if (this.phase === "GRIP" || this.phase === "DOMINATION") {
        const x =
          this.targetCenterX +
          this.targetOffsetX +
          Math.cos(particle.angle) * particle.radius;

        const y =
          this.targetCenterY -
          this.liftOffset +
          this.targetOffsetY +
          Math.sin(particle.angle) * particle.radius;

        context.globalAlpha = 0.8;
        context.fillStyle = "#f2dfff";

        context.beginPath();
        context.arc(x, y, particle.size, 0, Math.PI * 2);
        context.fill();
      }
    });

    this.stars.forEach((star) => {
      context.save();

      context.globalAlpha = Math.max(0, star.life / star.maxLife);

      context.translate(star.x, star.y);
      context.rotate(star.rotation);

      context.fillStyle = "#ead4ff";
      context.shadowColor = "#a34dff";
      context.shadowBlur = 12;

      context.beginPath();
      context.moveTo(0, -star.size);
      context.lineTo(star.size * 0.35, -star.size * 0.35);
      context.lineTo(star.size, 0);
      context.lineTo(star.size * 0.35, star.size * 0.35);
      context.lineTo(0, star.size);
      context.lineTo(-star.size * 0.35, star.size * 0.35);
      context.lineTo(-star.size, 0);
      context.lineTo(-star.size * 0.35, -star.size * 0.35);
      context.closePath();
      context.fill();

      context.restore();
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
