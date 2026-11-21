export class LickAnimation {
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

    this.frame = 0;
    this.isFinished = false;
    this.phase = "PREPARE";
    this.phaseFrame = 0;

    this.attackerCenter = this.getCenter(this.attacker);
    this.targetCenter = this.getCenter(this.target);

    const dx = this.targetCenter.x - this.attackerCenter.x;
    const dy = this.targetCenter.y - this.attackerCenter.y;
    const distance = Math.hypot(dx, dy) || 1;

    this.directionX = dx / distance;
    this.directionY = dy / distance;

    // Point de départ de la langue, devant la bouche.
    this.startX = this.attackerCenter.x + this.directionX * 12;
    this.startY = this.attackerCenter.y + this.directionY * 8;

    // La langue s'arrête légèrement avant le centre de la cible.
    this.endX = this.targetCenter.x - this.directionX * 9;
    this.endY = this.targetCenter.y - this.directionY * 5;

    this.distance = Math.hypot(
      this.endX - this.startX,
      this.endY - this.startY
    );

    this.tongueProgress = 0;
    this.tongueLength = 0;
    this.tongueThickness = 7;

    this.particles = [];
    this.sparks = [];

    this.flashOpacity = 0;
    this.auraOpacity = 0;
    this.contactPulse = 0;

    this.originalAttackerX = this.attacker.position.x;
    this.originalAttackerY = this.attacker.position.y;

    this.originalTargetX = this.target.position.x;
    this.originalTargetY = this.target.position.y;
  }

  getCenter(sprite) {
    return {
      x: sprite.position.x + (sprite.frameWidth * sprite.scale) / 2,
      y: sprite.position.y + (sprite.frameHeight * sprite.scale) / 2,
    };
  }

  update(context) {
    if (this.isFinished) return;

    this.frame++;
    this.phaseFrame++;

    // Actualise les centres pour suivre les éventuels déplacements.
    this.attackerCenter = this.getCenter(this.attacker);
    this.targetCenter = this.getCenter(this.target);

    switch (this.phase) {
      case "PREPARE":
        this.updatePrepare();
        break;

      case "EXTEND":
        this.updateExtend();
        break;

      case "CONTACT":
        this.updateContact();
        break;

      case "RETRACT":
        this.updateRetract();
        break;

      case "FINISH":
        this.updateFinish();
        break;
    }

    this.updateParticles();
    this.draw(context);
  }

  updatePrepare() {
    this.auraOpacity = Math.min(1, this.phaseFrame / 12);

    if (this.phaseFrame >= 15) {
      this.changePhase("EXTEND");
    }
  }

  updateExtend() {
    const progress = Math.min(1, this.phaseFrame / 17);

    // Accélération progressive de la langue.
    this.tongueProgress = 1 - Math.pow(1 - progress, 2);
    this.tongueLength = this.distance * this.tongueProgress;

    if (progress >= 1) {
      this.createContactParticles();
      this.game.canvas?.startShake?.(2, 100);
      this.changePhase("CONTACT");
    }
  }

  updateContact() {
    this.tongueProgress = 1;
    this.tongueLength = this.distance;

    this.contactPulse = Math.sin(this.phaseFrame * 0.65);
    this.flashOpacity = Math.max(0, 0.45 - this.phaseFrame * 0.055);

    if (this.phaseFrame % 3 === 0) {
      this.createContactParticles();
    }

    if (this.phaseFrame >= 40) {
      this.changePhase("RETRACT");
    }
  }

  updateRetract() {
    const progress = Math.min(1, this.phaseFrame / 13);

    this.tongueProgress = 1 - progress;
    this.tongueLength = this.distance * this.tongueProgress;
    this.auraOpacity = Math.max(0, 1 - progress);

    if (progress >= 1) {
      this.changePhase("FINISH");
    }
  }

  updateFinish() {
    this.flashOpacity = Math.max(0, this.flashOpacity - 0.1);

    if (this.phaseFrame >= 5) {
      this.isFinished = true;
    }
  }

  changePhase(nextPhase) {
    this.phase = nextPhase;
    this.phaseFrame = 0;
  }

  createContactParticles() {
    const contactX =
      this.startX + (this.endX - this.startX) * this.tongueProgress;

    const contactY =
      this.startY + (this.endY - this.startY) * this.tongueProgress;

    for (let i = 0; i < 3; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.8 + Math.random() * 1.8;

      this.particles.push({
        x: contactX + (Math.random() - 0.5) * 8,
        y: contactY + (Math.random() - 0.5) * 8,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 1 + Math.random() * 2,
        opacity: 0.9,
        color: Math.random() > 0.5 ? "#d85bff" : "#ff8bdc",
      });
    }

    for (let i = 0; i < 2; i++) {
      this.sparks.push({
        x: contactX,
        y: contactY,
        radius: 2 + Math.random() * 3,
        opacity: 0.9,
      });
    }
  }

  updateParticles() {
    this.particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      particle.vx *= 0.97;
      particle.vy *= 0.97;

      particle.opacity -= 0.035;
    });

    this.particles = this.particles.filter((particle) => particle.opacity > 0);

    this.sparks.forEach((spark) => {
      spark.radius += 1.2;
      spark.opacity -= 0.1;
    });

    this.sparks = this.sparks.filter((spark) => spark.opacity > 0);
  }

  getTonguePoint(progress) {
    const x = this.startX + (this.endX - this.startX) * progress;

    const y = this.startY + (this.endY - this.startY) * progress;

    // Ondulation de la langue.
    const wave = Math.sin(progress * Math.PI * 2.5 + this.frame * 0.18);

    const perpendicularX = -this.directionY;
    const perpendicularY = this.directionX;

    const amplitude = Math.sin(progress * Math.PI) * 11;

    return {
      x: x + perpendicularX * wave * amplitude,
      y: y + perpendicularY * wave * amplitude,
    };
  }

  draw(context) {
    const ctx = context;

    ctx.save();

    this.drawAura(ctx);

    if (
      this.phase === "EXTEND" ||
      this.phase === "CONTACT" ||
      this.phase === "RETRACT"
    ) {
      this.drawTongue(ctx);
    }

    this.drawParticles(ctx);
    this.drawSparks(ctx);
    this.drawFlash(ctx);

    ctx.restore();
  }

  drawAura(ctx) {
    if (this.auraOpacity <= 0) return;

    ctx.save();

    const pulse = 1 + Math.sin(this.frame * 0.25) * 0.12;

    const gradient = ctx.createRadialGradient(
      this.startX,
      this.startY,
      1,
      this.startX,
      this.startY,
      24 * pulse
    );

    gradient.addColorStop(0, `rgba(220, 100, 255, ${this.auraOpacity * 0.5})`);

    gradient.addColorStop(
      0.5,
      `rgba(140, 40, 190, ${this.auraOpacity * 0.25})`
    );

    gradient.addColorStop(1, "rgba(90, 20, 130, 0)");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.startX, this.startY, 24 * pulse, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  drawTongue(ctx) {
    const steps = 24;
    const points = [];

    for (let i = 0; i <= steps; i++) {
      const progress = (i / steps) * this.tongueProgress;

      points.push(this.getTonguePoint(progress));
    }

    if (points.length < 2) return;

    // Rétractation : l'extrémité reste arrondie.
    const tip = points[points.length - 1];

    const contact = this.phase === "CONTACT";
    const thickness =
      this.tongueThickness + (contact ? this.contactPulse * 1.2 : 0);

    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Ombre portée de la langue.
    ctx.beginPath();
    ctx.moveTo(points[0].x + 2, points[0].y + 2);

    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x + 2, points[i].y + 2);
    }

    ctx.strokeStyle = "rgba(30, 0, 45, 0.8)";
    ctx.lineWidth = thickness + 4;
    ctx.stroke();

    // Corps de la langue.
    const gradient = ctx.createLinearGradient(
      this.startX,
      this.startY,
      tip.x,
      tip.y
    );

    gradient.addColorStop(0, "#9b35d2");
    gradient.addColorStop(0.45, "#e76bdc");
    gradient.addColorStop(0.8, "#f39adf");
    gradient.addColorStop(1, "#ffb5ed");

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }

    ctx.strokeStyle = gradient;
    ctx.lineWidth = thickness;
    ctx.shadowColor = "#db55ff";
    ctx.shadowBlur = 8;
    ctx.stroke();

    // Reflet central.
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y - 1);

    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y - 1);
    }

    ctx.strokeStyle = "rgba(255, 220, 255, 0.65)";
    ctx.lineWidth = 1.5;
    ctx.shadowBlur = 0;
    ctx.stroke();

    // Extrémité arrondie.
    ctx.fillStyle = "#ffb5ed";
    ctx.beginPath();
    ctx.arc(tip.x, tip.y, thickness * 0.7, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  drawParticles(ctx) {
    ctx.save();

    this.particles.forEach((particle) => {
      ctx.globalAlpha = particle.opacity;
      ctx.fillStyle = particle.color;
      ctx.shadowColor = particle.color;
      ctx.shadowBlur = 6;

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  }

  drawSparks(ctx) {
    ctx.save();

    this.sparks.forEach((spark) => {
      ctx.globalAlpha = spark.opacity;
      ctx.strokeStyle = "#f4a1ff";
      ctx.lineWidth = 1.5;
      ctx.shadowColor = "#d84dff";
      ctx.shadowBlur = 8;

      ctx.beginPath();
      ctx.arc(spark.x, spark.y, spark.radius, 0, Math.PI * 2);
      ctx.stroke();
    });

    ctx.restore();
  }

  drawFlash(ctx) {
    if (this.flashOpacity <= 0) return;

    ctx.save();

    ctx.globalAlpha = this.flashOpacity;
    ctx.fillStyle = "#e8a0ff";

    ctx.beginPath();
    ctx.arc(this.endX, this.endY, 12 + this.phaseFrame * 0.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}
