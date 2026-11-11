export class ThunderPunchAnimation {
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

    this.attacker = this.pokemonViewer.sprite;
    this.target = this.targetViewer.sprite;

    this.phase = "CHARGE";
    this.timer = 0;
    this.isFinished = false;

    // Direction de l'attaquant vers la cible.
    this.direction = this.target.position.x > this.attacker.position.x ? 1 : -1;

    this.targetWidth = this.target.frameWidth * this.target.scale;
    this.targetHeight = this.target.frameHeight * this.target.scale;

    this.targetCenterX = this.target.position.x + this.targetWidth / 2;
    this.targetCenterY = this.target.position.y + this.targetHeight / 2;

    // Le poing apparaît directement devant la cible,
    // du côté de l'attaquant.
    this.startX =
      this.targetCenterX - this.direction * (this.targetWidth * 0.38);
    this.startY = this.targetCenterY;

    // Le poing avance légèrement vers le centre de la cible.
    this.endX = this.targetCenterX - this.direction * (this.targetWidth * 0.12);
    this.endY = this.targetCenterY;

    this.fistX = this.startX;
    this.fistY = this.startY;

    this.progress = 0;
    this.fistSize = Math.max(24, this.targetHeight * 0.75);

    this.electricArcs = [];
    this.impactParticles = [];
    this.sparkParticles = [];

    this.arcTimer = 0;
    this.flashAlpha = 0;
    this.shockwaveRadius = 0;

    this.createElectricArcs();
  }

  update(context) {
    if (this.isFinished) return;

    this.timer++;

    switch (this.phase) {
      case "CHARGE":
        this.updateElectricArcs();

        if (this.timer >= 18) {
          this.phase = "PUNCH";
          this.timer = 0;
        }
        break;

      case "PUNCH": {
        this.progress = Math.min(1, this.timer / 12);

        const eased = 1 - Math.pow(1 - this.progress, 3);

        this.fistX = this.startX + (this.endX - this.startX) * eased;
        this.fistY = this.startY + (this.endY - this.startY) * eased;

        this.updateElectricArcs();

        if (this.timer >= 12) {
          this.phase = "IMPACT";
          this.timer = 0;

          this.createImpactParticles();
          this.flashAlpha = 1;

          this.game.canvas.startShake(16, 6);
        }
        break;
      }

      case "IMPACT":
        this.updateImpactParticles();
        this.updateElectricArcs();

        this.flashAlpha = Math.max(0, this.flashAlpha - 0.12);
        this.shockwaveRadius += 6;

        if (this.timer >= 20) {
          this.phase = "DISSIPATE";
          this.timer = 0;
        }
        break;

      case "DISSIPATE":
        this.updateImpactParticles();
        this.updateElectricArcs();

        this.flashAlpha = Math.max(0, this.flashAlpha - 0.1);

        if (this.timer >= 24) {
          this.isFinished = true;
        }
        break;
    }

    this.draw(context);
  }

  draw(context) {
    context.save();

    switch (this.phase) {
      case "CHARGE":
        this.drawChargingFist(context);
        break;

      case "PUNCH":
        this.drawFlyingFist(context);
        break;

      case "IMPACT":
        this.drawImpact(context);
        break;

      case "DISSIPATE":
        this.drawDissipation(context);
        break;
    }

    context.restore();
  }

  createElectricArcs() {
    for (let i = 0; i < 12; i++) {
      this.electricArcs.push({
        angle: (Math.PI * 2 * i) / 12,
        radius: 12 + Math.random() * 12,
        length: 12 + Math.random() * 18,
        alpha: 0.6 + Math.random() * 0.4,
        offset: Math.random() * Math.PI * 2,
      });
    }
  }

  updateElectricArcs() {
    this.arcTimer++;

    this.electricArcs.forEach((arc) => {
      arc.angle += 0.08;
      arc.offset += 0.2;
      arc.radius = 12 + Math.sin(arc.offset) * 6;
    });
  }

  drawChargingFist(context) {
    const progress = this.timer / 18;

    this.drawElectricAura(
      context,
      this.startX,
      this.startY,
      18 + progress * 16,
      0.4 + progress * 0.5
    );

    this.drawFist(
      context,
      this.startX,
      this.startY,
      0.7 + progress * 0.3,
      -this.direction
    );

    this.drawElectricArcs(context, this.startX, this.startY, 1);
  }

  drawFlyingFist(context) {
    const scale = 1 + Math.sin(this.timer * 0.8) * 0.05;

    this.drawElectricAura(
      context,
      this.fistX,
      this.fistY,
      this.fistSize * 1.1,
      0.75
    );

    this.drawElectricArcs(context, this.fistX, this.fistY, 1.3);

    this.drawFist(context, this.fistX, this.fistY, scale, -this.direction);

    // Traînée électrique jaune derrière le poing.
    context.save();

    context.strokeStyle = "#ffe000";
    context.lineWidth = 3;
    context.shadowColor = "#ffcc00";
    context.shadowBlur = 10;

    for (let i = 0; i < 5; i++) {
      const offset = i * 7;

      context.beginPath();
      context.moveTo(
        this.fistX - this.direction * (this.fistSize + offset),
        this.fistY + (i - 2) * 5
      );

      context.lineTo(
        this.fistX - this.direction * (this.fistSize * 0.5 + offset),
        this.fistY + (i % 2 === 0 ? -12 : 12)
      );

      context.lineTo(this.fistX - this.direction * offset, this.fistY);

      context.stroke();
    }

    context.restore();
  }

  drawFist(context, x, y, scale = 1, direction = 1) {
    context.save();

    context.translate(x, y);
    context.scale(scale * direction, scale);

    // Ombre générale.
    context.shadowColor = "rgba(0, 0, 0, 0.6)";
    context.shadowBlur = 7;
    context.shadowOffsetX = 3;
    context.shadowOffsetY = 4;

    // Silhouette principale du poing.
    context.beginPath();
    context.moveTo(-29, -8);
    context.lineTo(-27, -24);
    context.quadraticCurveTo(-26, -30, -20, -30);
    context.quadraticCurveTo(-15, -30, -14, -24);
    context.lineTo(-13, -32);
    context.quadraticCurveTo(-12, -38, -6, -37);
    context.quadraticCurveTo(0, -37, 0, -31);
    context.lineTo(1, -38);
    context.quadraticCurveTo(8, -42, 12, -35);
    context.lineTo(12, -29);
    context.quadraticCurveTo(20, -34, 24, -27);
    context.lineTo(23, -12);
    context.quadraticCurveTo(22, 4, 12, 13);
    context.lineTo(-12, 15);
    context.quadraticCurveTo(-27, 9, -29, -8);
    context.closePath();

    context.fillStyle = "#17191d";
    context.fill();

    context.shadowColor = "transparent";
    context.shadowBlur = 0;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;

    context.strokeStyle = "#aeb6c1";
    context.lineWidth = 3;
    context.lineJoin = "round";
    context.stroke();

    // Phalanges : quatre articulations.
    const knuckles = [
      { x: -20, y: -24, r: 5 },
      { x: -6, y: -29, r: 5.5 },
      { x: 7, y: -30, r: 5.5 },
      { x: 18, y: -24, r: 5 },
    ];

    knuckles.forEach(({ x, y, r }) => {
      context.beginPath();
      context.ellipse(x, y, r, r * 0.85, -0.2, 0, Math.PI * 2);
      context.fillStyle = "#383e47";
      context.fill();

      context.strokeStyle = "#c4cbd3";
      context.lineWidth = 1.8;
      context.stroke();

      // Reflet sur chaque articulation.
      context.beginPath();
      context.ellipse(x - 1, y - 2, r * 0.55, 1.5, -0.3, 0, Math.PI * 2);
      context.fillStyle = "#e0e4e9";
      context.fill();
    });

    // Séparation des doigts.
    context.strokeStyle = "#08090b";
    context.lineWidth = 2;

    context.beginPath();
    context.moveTo(-13, -19);
    context.lineTo(-12, -8);
    context.moveTo(0, -23);
    context.lineTo(1, -10);
    context.moveTo(12, -20);
    context.lineTo(12, -8);
    context.stroke();

    // Pouce replié sur le devant du poing.
    context.beginPath();
    context.moveTo(-25, -8);
    context.quadraticCurveTo(-34, -1, -25, 7);
    context.quadraticCurveTo(-18, 13, -10, 7);
    context.lineTo(-3, 1);
    context.quadraticCurveTo(1, -5, -5, -9);
    context.quadraticCurveTo(-11, -12, -16, -6);
    context.closePath();

    context.fillStyle = "#292e36";
    context.fill();
    context.strokeStyle = "#b5bdc7";
    context.lineWidth = 2.5;
    context.stroke();

    // Reflet du pouce.
    context.beginPath();
    context.moveTo(-27, -5);
    context.quadraticCurveTo(-24, -10, -18, -7);
    context.strokeStyle = "#e0e4e9";
    context.lineWidth = 1.5;
    context.stroke();

    // Ombre sous les phalanges.
    context.beginPath();
    context.moveTo(-19, 7);
    context.quadraticCurveTo(-4, 13, 13, 5);
    context.strokeStyle = "#08090b";
    context.lineWidth = 3;
    context.stroke();

    context.restore();
  }

  drawElectricAura(context, x, y, radius, alpha) {
    context.save();
    context.globalAlpha = alpha;

    const gradient = context.createRadialGradient(x, y, 1, x, y, radius);

    gradient.addColorStop(0, "rgba(255, 255, 190, 0.9)");
    gradient.addColorStop(0.35, "rgba(255, 220, 0, 0.65)");
    gradient.addColorStop(0.75, "rgba(255, 170, 0, 0.3)");
    gradient.addColorStop(1, "rgba(255, 190, 0, 0)");

    context.fillStyle = gradient;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }

  drawElectricArcs(context, x, y, intensity) {
    this.electricArcs.forEach((arc) => {
      const startX = x + Math.cos(arc.angle) * arc.radius;
      const startY = y + Math.sin(arc.angle) * arc.radius;

      const endX =
        x + Math.cos(arc.angle) * (arc.radius + arc.length * intensity);

      const endY =
        y + Math.sin(arc.angle) * (arc.radius + arc.length * intensity);

      const middleX = (startX + endX) / 2;
      const middleY = (startY + endY) / 2;

      context.save();
      context.globalAlpha = arc.alpha;

      context.strokeStyle = "#fffde0";
      context.lineWidth = 3;

      context.shadowColor = "#ffd000";
      context.shadowBlur = 12;

      context.beginPath();
      context.moveTo(startX, startY);
      context.lineTo(
        middleX + Math.sin(arc.offset) * 9,
        middleY + Math.cos(arc.offset) * 9
      );
      context.lineTo(endX, endY);
      context.stroke();

      context.strokeStyle = "#ffe000";
      context.lineWidth = 1.5;
      context.stroke();

      context.restore();
    });
  }

  createImpactParticles() {
    for (let i = 0; i < 40; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 7;

      this.impactParticles.push({
        x: this.targetCenterX,
        y: this.targetCenterY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 2 + Math.random() * 4,
        life: 15 + Math.random() * 18,
        maxLife: 33,
        electric: Math.random() > 0.35,
      });
    }

    for (let i = 0; i < 16; i++) {
      this.sparkParticles.push({
        x: this.targetCenterX + (Math.random() - 0.5) * this.targetWidth,
        y: this.targetCenterY + (Math.random() - 0.5) * this.targetHeight,
        vx: (Math.random() - 0.5) * 5,
        vy: (Math.random() - 0.5) * 5,
        life: 12 + Math.random() * 12,
      });
    }
  }

  updateImpactParticles() {
    this.impactParticles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      particle.vx *= 0.94;
      particle.vy *= 0.94;

      particle.life--;
    });

    this.impactParticles = this.impactParticles.filter(
      (particle) => particle.life > 0
    );

    this.sparkParticles.forEach((spark) => {
      spark.x += spark.vx;
      spark.y += spark.vy;

      spark.vx *= 0.9;
      spark.vy *= 0.9;

      spark.life--;
    });

    this.sparkParticles = this.sparkParticles.filter((spark) => spark.life > 0);
  }

  drawImpact(context) {
    if (this.flashAlpha > 0) {
      context.save();
      context.globalAlpha = this.flashAlpha;

      const gradient = context.createRadialGradient(
        this.targetCenterX,
        this.targetCenterY,
        1,
        this.targetCenterX,
        this.targetCenterY,
        this.targetWidth * 1.5
      );

      gradient.addColorStop(0, "#ffffff");
      gradient.addColorStop(0.3, "#fffbd0");
      gradient.addColorStop(0.65, "rgba(255, 220, 0, 0.7)");
      gradient.addColorStop(1, "rgba(255, 180, 0, 0)");

      context.fillStyle = gradient;
      context.beginPath();
      context.arc(
        this.targetCenterX,
        this.targetCenterY,
        this.targetWidth * 1.5,
        0,
        Math.PI * 2
      );
      context.fill();

      context.restore();
    }

    this.drawShockwave(context);
    this.drawImpactParticles(context);
    this.drawSparkParticles(context);
    this.drawImpactLightning(context);
  }

  drawShockwave(context) {
    const alpha = Math.max(0, 1 - this.timer / 20);

    context.save();
    context.globalAlpha = alpha;

    context.strokeStyle = "#fff4a0";
    context.lineWidth = 3;

    context.beginPath();
    context.ellipse(
      this.targetCenterX,
      this.targetCenterY,
      this.shockwaveRadius,
      this.shockwaveRadius * 0.65,
      0,
      0,
      Math.PI * 2
    );
    context.stroke();

    context.restore();
  }

  drawImpactParticles(context) {
    this.impactParticles.forEach((particle) => {
      const alpha = Math.max(0, particle.life / particle.maxLife);

      context.save();
      context.globalAlpha = alpha;

      context.fillStyle = particle.electric ? "#fff17a" : "#ffe2a0";

      context.shadowColor = "#ffce00";
      context.shadowBlur = 10;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fill();

      context.restore();
    });
  }

  drawSparkParticles(context) {
    this.sparkParticles.forEach((spark) => {
      const alpha = Math.max(0, spark.life / 24);

      context.save();
      context.globalAlpha = alpha;

      context.strokeStyle = "#fffbd0";
      context.lineWidth = 2;
      context.shadowColor = "#ffd000";
      context.shadowBlur = 8;

      context.beginPath();
      context.moveTo(spark.x - 5, spark.y - 5);
      context.lineTo(spark.x + 5, spark.y + 5);
      context.moveTo(spark.x + 5, spark.y - 5);
      context.lineTo(spark.x - 5, spark.y + 5);
      context.stroke();

      context.restore();
    });
  }

  drawImpactLightning(context) {
    const alpha = Math.max(0, 1 - this.timer / 20);

    context.save();
    context.globalAlpha = alpha;

    context.strokeStyle = "#fffbd0";
    context.lineWidth = 3;
    context.shadowColor = "#ffd000";
    context.shadowBlur = 14;

    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI * 2 * i) / 6;
      const length = this.targetWidth * 0.5;

      const x1 = this.targetCenterX + Math.cos(angle) * 8;
      const y1 = this.targetCenterY + Math.sin(angle) * 8;

      const x2 = this.targetCenterX + Math.cos(angle) * length;
      const y2 = this.targetCenterY + Math.sin(angle) * length;

      context.beginPath();
      context.moveTo(x1, y1);

      context.lineTo(
        (x1 + x2) / 2 + (Math.random() - 0.5) * 12,
        (y1 + y2) / 2 + (Math.random() - 0.5) * 12
      );

      context.lineTo(x2, y2);
      context.stroke();
    }

    context.restore();
  }

  drawDissipation(context) {
    this.drawImpactParticles(context);
    this.drawSparkParticles(context);
  }
}
