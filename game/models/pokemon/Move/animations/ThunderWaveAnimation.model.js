export class ThunderWaveAnimation {
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

    this.originalAttackerX = this.attacker.position.x;
    this.originalAttackerY = this.attacker.position.y;

    this.originalTargetX = this.target.position.x;
    this.originalTargetY = this.target.position.y;

    this.pokemonCenter = this.getCenter(this.pokemonViewer);
    this.targetCenter = this.getCenter(this.targetViewer);

    this.startX = this.pokemonCenter.x;
    this.startY = this.pokemonCenter.y - 5;

    this.endX = this.targetCenter.x;
    this.endY = this.targetCenter.y;

    this.direction = this.endX >= this.startX ? 1 : -1;

    this.angle = Math.atan2(this.endY - this.startY, this.endX - this.startX);

    this.distance = Math.hypot(
      this.endX - this.startX,
      this.endY - this.startY
    );

    this.phase = "CHARGE";
    this.timer = 0;
    this.isFinished = false;

    this.chargeDuration = 12;
    this.dischargeDuration = 16;
    this.impactDuration = 24;
    this.finishDuration = 12;

    this.chargeParticles = [];
    this.lightningBolts = [];
    this.impactBolts = [];
    this.particles = [];

    this.dischargeProgress = 0;

    this.createChargeParticles();
    this.createLightningBolts();
  }

  getCenter(viewer) {
    return {
      x: viewer.sprite.position.x + viewer.sprite.frameWidth / 2,
      y: viewer.sprite.position.y + viewer.sprite.frameHeight / 2,
    };
  }

  // --------------------------------------------------
  // Création des particules
  // --------------------------------------------------

  createChargeParticles() {
    for (let i = 0; i < 18; i++) {
      this.chargeParticles.push({
        angle: Math.random() * Math.PI * 2,
        radius: 7 + Math.random() * 17,
        speed: 0.08 + Math.random() * 0.12,
        size: 1 + Math.random() * 2.5,
      });
    }
  }

  createLightningBolts() {
    for (let i = 0; i < 4; i++) {
      this.lightningBolts.push({
        offset: (Math.random() - 0.5) * 18,
        width: 1.5 + Math.random() * 2,
        seed: Math.random() * 100,
        segments: 9 + Math.floor(Math.random() * 4),
      });
    }
  }

  generateLightningPoints(length, offset = 0, segments = 10) {
    const points = [];

    points.push({ x: 0, y: offset });

    for (let i = 1; i < segments; i++) {
      const progress = i / segments;

      points.push({
        x: length * progress,
        y: offset + (Math.random() - 0.5) * 16,
      });
    }

    points.push({
      x: length,
      y: offset,
    });

    return points;
  }

  createImpactBolts() {
    this.impactBolts = [];

    for (let i = 0; i < 9; i++) {
      const angle = (Math.PI * 2 * i) / 9;

      this.impactBolts.push({
        angle,
        length: 12 + Math.random() * 17,
        width: 1.5 + Math.random() * 2,
        seed: Math.random() * 100,
      });
    }
  }

  createImpactParticles() {
    for (let i = 0; i < 22; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.8 + Math.random() * 3;

      this.particles.push({
        x: this.endX,
        y: this.endY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 1 + Math.random() * 2.5,
        life: 1,
      });
    }
  }

  // --------------------------------------------------
  // Mise à jour des phases
  // --------------------------------------------------

  update(context) {
    if (this.isFinished) return;

    this.timer++;

    switch (this.phase) {
      case "CHARGE":
        this.updateCharge();
        break;

      case "DISCHARGE":
        this.updateDischarge();
        break;

      case "IMPACT":
        this.updateImpact();
        break;

      case "FINISH":
        this.updateFinish();
        break;
    }

    this.updateParticles();

    this.draw(context);

    if (this.isFinished) {
      this.restorePositions();
    }
  }

  updateCharge() {
    for (const particle of this.chargeParticles) {
      particle.angle += particle.speed;
      particle.radius = Math.max(3, particle.radius - 0.12);
    }

    if (this.timer >= this.chargeDuration) {
      this.phase = "DISCHARGE";
      this.timer = 0;

      if (this.game.canvas?.startShake) {
        this.game.canvas.startShake(2, 70);
      }
    }
  }

  updateDischarge() {
    this.dischargeProgress = Math.min(1, this.timer / 5);

    if (this.timer >= this.dischargeDuration) {
      this.phase = "IMPACT";
      this.timer = 0;

      this.createImpactBolts();
      this.createImpactParticles();

      if (this.game.canvas?.startShake) {
        this.game.canvas.startShake(3, 130);
      }
    }
  }

  updateImpact() {
    if (this.timer >= this.impactDuration) {
      this.phase = "FINISH";
      this.timer = 0;
    }
  }

  updateFinish() {
    if (this.timer >= this.finishDuration) {
      this.isFinished = true;
    }
  }

  updateParticles() {
    for (const particle of this.particles) {
      particle.x += particle.vx;
      particle.y += particle.vy;

      particle.vx *= 0.96;
      particle.vy *= 0.96;

      particle.life -= 0.055;
    }

    this.particles = this.particles.filter((particle) => particle.life > 0);
  }

  // --------------------------------------------------
  // Dessin général
  // --------------------------------------------------

  draw(context) {
    if (this.isFinished) return;

    switch (this.phase) {
      case "CHARGE":
        this.drawCharge(context);
        break;

      case "DISCHARGE":
        this.drawDischarge(context);
        break;

      case "IMPACT":
        this.drawImpact(context);
        break;

      case "FINISH":
        this.drawFinish(context);
        break;
    }
  }

  // --------------------------------------------------
  // CHARGE : accumulation électrique
  // --------------------------------------------------

  drawCharge(context) {
    const x = this.startX + this.direction * 14;
    const y = this.startY;

    const pulse = 1 + Math.sin(this.timer * 0.7) * 0.2;
    const radius = 4 * pulse;

    context.save();

    // Halo électrique.
    context.globalAlpha = 0.5;
    context.fillStyle = "#ffe45c";
    context.shadowColor = "#ffcc00";
    context.shadowBlur = 16;

    context.beginPath();
    context.arc(x, y, radius * 2.2, 0, Math.PI * 2);
    context.fill();

    // Noyau lumineux.
    context.globalAlpha = 1;
    context.fillStyle = "#fff5a6";
    context.shadowBlur = 8;

    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();

    context.shadowBlur = 0;

    // Étincelles orbitales.
    for (const particle of this.chargeParticles) {
      const px = x + Math.cos(particle.angle) * particle.radius;

      const py = y + Math.sin(particle.angle) * particle.radius;

      context.fillStyle = "#fff9c4";
      context.globalAlpha = 0.6 + Math.random() * 0.4;

      context.fillRect(px, py, particle.size, particle.size);
    }

    context.restore();
  }

  // --------------------------------------------------
  // DISCHARGE : éclairs zigzag
  // --------------------------------------------------

  drawDischarge(context) {
    const length = this.distance * this.dischargeProgress;

    context.save();

    context.translate(this.startX, this.startY);
    context.rotate(this.angle);

    // Halo global.
    context.globalAlpha = 0.3;
    context.strokeStyle = "#ffe44d";
    context.lineWidth = 12;
    context.lineCap = "round";
    context.shadowColor = "#ffdb00";
    context.shadowBlur = 18;

    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(length, 0);
    context.stroke();

    context.shadowBlur = 0;

    // Plusieurs éclairs indépendants.
    for (const bolt of this.lightningBolts) {
      const points = this.generateLightningPoints(
        length,
        bolt.offset,
        bolt.segments
      );

      this.drawBolt(context, points, bolt.width);
    }

    context.restore();
  }

  drawBolt(context, points, width) {
    if (points.length < 2) return;

    // Halo jaune.
    context.save();

    context.globalAlpha = 0.65;
    context.strokeStyle = "#ffcf00";
    context.lineWidth = width * 3;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.shadowColor = "#ffdf00";
    context.shadowBlur = 10;

    context.beginPath();
    context.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
      context.lineTo(points[i].x, points[i].y);
    }

    context.stroke();

    // Corps lumineux.
    context.globalAlpha = 1;
    context.strokeStyle = "#fff16a";
    context.lineWidth = width;

    context.beginPath();
    context.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
      context.lineTo(points[i].x, points[i].y);
    }

    context.stroke();

    // Cœur blanc.
    context.strokeStyle = "#ffffff";
    context.lineWidth = Math.max(0.8, width * 0.35);
    context.shadowBlur = 4;

    context.beginPath();
    context.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
      context.lineTo(points[i].x, points[i].y);
    }

    context.stroke();

    context.restore();
  }

  // --------------------------------------------------
  // IMPACT : électrocution
  // --------------------------------------------------

  drawImpact(context) {
    const progress = this.timer / this.impactDuration;
    const pulse = Math.sin(this.timer * 0.9);

    const radius = 60 + Math.abs(pulse) * 5;

    context.save();

    // Flash autour de la cible.
    context.globalAlpha = 0.4 * (1 - progress * 0.4);
    context.fillStyle = "#fff36a";
    context.shadowColor = "#ffdb00";
    context.shadowBlur = 20;

    context.beginPath();
    context.arc(this.endX, this.endY, radius, 0, Math.PI * 2);
    context.fill();

    // Onde électrique.
    context.globalAlpha = 1 - progress;
    context.strokeStyle = "#fff3a0";
    context.lineWidth = 2.5;
    context.shadowBlur = 8;

    context.beginPath();
    context.arc(this.endX, this.endY, 8 + progress * 24, 0, Math.PI * 2);
    context.stroke();

    context.restore();

    this.drawImpactBolts(context);
    this.drawParticles(context);
  }

  drawImpactBolts(context) {
    const pulse = 1 + Math.sin(this.timer * 1.3) * 0.2;

    context.save();

    for (const bolt of this.impactBolts) {
      const length = bolt.length * pulse;

      const startX = this.endX;
      const startY = this.endY;

      const endX = startX + Math.cos(bolt.angle) * length;

      const endY = startY + Math.sin(bolt.angle) * length;

      const points = [
        { x: startX, y: startY },
        {
          x:
            startX +
            Math.cos(bolt.angle) * length * 0.35 +
            (Math.random() - 0.5) * 5,
          y:
            startY +
            Math.sin(bolt.angle) * length * 0.35 +
            (Math.random() - 0.5) * 5,
        },
        {
          x:
            startX +
            Math.cos(bolt.angle) * length * 0.7 +
            (Math.random() - 0.5) * 5,
          y:
            startY +
            Math.sin(bolt.angle) * length * 0.7 +
            (Math.random() - 0.5) * 5,
        },
        { x: endX, y: endY },
      ];

      this.drawBolt(context, points, bolt.width);
    }

    context.restore();
  }

  // --------------------------------------------------
  // FINISH : dissipation
  // --------------------------------------------------

  drawFinish(context) {
    this.drawParticles(context);
  }

  drawParticles(context) {
    context.save();

    for (const particle of this.particles) {
      context.globalAlpha = particle.life;
      context.fillStyle = "#fff7a6";
      context.shadowColor = "#ffdc38";
      context.shadowBlur = 7;

      context.beginPath();
      context.arc(
        particle.x,
        particle.y,
        particle.size * particle.life,
        0,
        Math.PI * 2
      );
      context.fill();
    }

    context.restore();
  }

  restorePositions() {
    this.attacker.position.x = this.originalAttackerX;
    this.attacker.position.y = this.originalAttackerY;

    this.target.position.x = this.originalTargetX;
    this.target.position.y = this.originalTargetY;
  }
}
