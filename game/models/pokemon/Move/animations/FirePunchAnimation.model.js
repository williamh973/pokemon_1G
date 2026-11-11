export class FirePunchAnimation {
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

    this.phase = "IGNITE";
    this.timer = 0;
    this.isFinished = false;

    this.direction = this.target.position.x > this.attacker.position.x ? 1 : -1;

    this.targetWidth = this.target.frameWidth * this.target.scale;
    this.targetHeight = this.target.frameHeight * this.target.scale;

    this.targetCenterX = this.target.position.x + this.targetWidth / 2;
    this.targetCenterY = this.target.position.y + this.targetHeight / 2;

    // Apparition directement devant le Pokémon ciblé.
    this.fistX =
      this.targetCenterX - this.direction * (this.targetWidth * 0.38);
    this.fistY = this.targetCenterY;

    // Légère avancée du poing au moment de l'impact.
    this.startX = this.fistX;
    this.startY = this.fistY;

    this.endX = this.targetCenterX - this.direction * (this.targetWidth * 0.12);
    this.endY = this.targetCenterY;

    this.progress = 0;
    this.fistSize = Math.max(24, this.targetHeight * 0.75);

    this.flames = [];
    this.embers = [];
    this.impactParticles = [];
    this.heatWaves = [];

    this.flashAlpha = 0;
    this.shockwaveRadius = 0;

    this.createFlames();
  }

  update(context) {
    if (this.isFinished) return;

    this.timer++;

    switch (this.phase) {
      case "IGNITE":
        this.updateFlames();

        if (this.timer >= 22) {
          this.phase = "PUNCH";
          this.timer = 0;
        }
        break;

      case "PUNCH": {
        this.progress = Math.min(1, this.timer / 12);

        const eased = 1 - Math.pow(1 - this.progress, 3);

        this.fistX = this.startX + (this.endX - this.startX) * eased;

        this.fistY = this.startY + (this.endY - this.startY) * eased;

        this.updateFlames();

        if (this.timer >= 12) {
          this.phase = "IMPACT";
          this.timer = 0;

          this.createImpactParticles();
          this.flashAlpha = 1;

          this.game.canvas.startShake(18, 7);
        }
        break;
      }

      case "IMPACT":
        this.updateImpactParticles();
        this.updateFlames();

        this.flashAlpha = Math.max(0, this.flashAlpha - 0.1);
        this.shockwaveRadius += 7;

        if (this.timer >= 22) {
          this.phase = "DISSIPATE";
          this.timer = 0;
        }
        break;

      case "DISSIPATE":
        this.updateImpactParticles();
        this.updateFlames();

        if (this.timer >= 28) {
          this.isFinished = true;
        }
        break;
    }

    this.draw(context);
  }

  draw(context) {
    context.save();

    switch (this.phase) {
      case "IGNITE":
        this.drawIgnition(context);
        break;

      case "PUNCH":
        this.drawPunch(context);
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

  // --------------------------------------------------
  // CRÉATION DES FLAMMES
  // --------------------------------------------------

  createFlames() {
    for (let i = 0; i < 24; i++) {
      this.flames.push({
        angle: Math.random() * Math.PI * 2,
        radius: 22 + Math.random() * 15,
        size: 5 + Math.random() * 9,
        speed: 0.04 + Math.random() * 0.06,
        offset: Math.random() * Math.PI * 2,
        alpha: 0.6 + Math.random() * 0.4,
      });
    }
  }

  updateFlames() {
    this.flames.forEach((flame) => {
      flame.angle += flame.speed;
      flame.offset += 0.12;

      flame.radius = 22 + Math.sin(flame.offset) * 8;
    });
  }

  // --------------------------------------------------
  // APPARITION ET EMBRASEMENT
  // --------------------------------------------------

  drawIgnition(context) {
    const progress = this.timer / 22;

    this.drawFireAura(
      context,
      this.startX,
      this.startY,
      22 + progress * 25,
      0.4 + progress * 0.5
    );

    this.drawFlames(context, this.startX, this.startY, 0.5 + progress * 0.5);

    this.drawFist(
      context,
      this.startX,
      this.startY,
      0.7 + progress * 0.3,
      -this.direction
    );

    this.drawEmbers(context, this.startX, this.startY);
  }

  // --------------------------------------------------
  // POING ENFLAMMÉ
  // --------------------------------------------------

  drawPunch(context) {
    const scale = 1 + Math.sin(this.timer * 0.8) * 0.05;

    this.drawFireAura(
      context,
      this.fistX,
      this.fistY,
      this.fistSize * 1.3,
      0.85
    );

    this.drawFlames(context, this.fistX, this.fistY, 1.3);

    this.drawFist(context, this.fistX, this.fistY, scale, -this.direction);

    this.drawFireTrail(context);
    this.drawEmbers(context, this.fistX, this.fistY);
  }

  drawFireTrail(context) {
    context.save();

    context.lineCap = "round";

    for (let i = 0; i < 6; i++) {
      const offset = i * 8;

      context.beginPath();

      context.moveTo(
        this.fistX - this.direction * (this.fistSize + offset),
        this.fistY + (i - 2.5) * 5
      );

      context.quadraticCurveTo(
        this.fistX - this.direction * (this.fistSize + offset + 15),
        this.fistY + Math.sin(this.timer + i) * 16,
        this.fistX - this.direction * (this.fistSize * 0.4 + offset),
        this.fistY + (i % 2 === 0 ? -12 : 12)
      );

      context.strokeStyle = i % 2 === 0 ? "#ff3b00" : "#ffb000";
      context.lineWidth = 7 - i * 0.6;
      context.shadowColor = "#ff4b00";
      context.shadowBlur = 12;
      context.stroke();
    }

    context.restore();
  }

  // --------------------------------------------------
  // DESSIN DU POING
  // --------------------------------------------------

  drawFist(context, x, y, scale = 1, direction = 1) {
    context.save();

    context.translate(x, y);
    context.scale(scale * direction, scale);

    context.shadowColor = "#ff4b00";
    context.shadowBlur = 18;

    // Silhouette du poing.
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

    context.fillStyle = "#211715";
    context.fill();

    context.shadowBlur = 0;

    // Contour rouge incandescent.
    context.strokeStyle = "#ff5a1f";
    context.lineWidth = 3;
    context.lineJoin = "round";
    context.stroke();

    // Articulations.
    const knuckles = [
      { x: -20, y: -24, r: 5 },
      { x: -6, y: -29, r: 5.5 },
      { x: 7, y: -30, r: 5.5 },
      { x: 18, y: -24, r: 5 },
    ];

    knuckles.forEach(({ x, y, r }) => {
      context.beginPath();
      context.ellipse(x, y, r, r * 0.85, -0.2, 0, Math.PI * 2);

      context.fillStyle = "#693024";
      context.fill();

      context.strokeStyle = "#ff9b45";
      context.lineWidth = 1.8;
      context.stroke();

      // Reflets incandescents.
      context.beginPath();
      context.ellipse(x - 1, y - 2, r * 0.55, 1.5, -0.3, 0, Math.PI * 2);

      context.fillStyle = "#ffd27a";
      context.fill();
    });

    // Séparation des doigts.
    context.strokeStyle = "#160d0b";
    context.lineWidth = 2;

    context.beginPath();
    context.moveTo(-13, -19);
    context.lineTo(-12, -8);
    context.moveTo(0, -23);
    context.lineTo(1, -10);
    context.moveTo(12, -20);
    context.lineTo(12, -8);
    context.stroke();

    // Pouce.
    context.beginPath();
    context.moveTo(-25, -8);
    context.quadraticCurveTo(-34, -1, -25, 7);
    context.quadraticCurveTo(-18, 13, -10, 7);
    context.lineTo(-3, 1);
    context.quadraticCurveTo(1, -5, -5, -9);
    context.quadraticCurveTo(-11, -12, -16, -6);
    context.closePath();

    context.fillStyle = "#49231b";
    context.fill();

    context.strokeStyle = "#ff7135";
    context.lineWidth = 2.5;
    context.stroke();

    // Reflet du pouce.
    context.beginPath();
    context.moveTo(-27, -5);
    context.quadraticCurveTo(-24, -10, -18, -7);
    context.strokeStyle = "#ffc078";
    context.lineWidth = 1.5;
    context.stroke();

    context.restore();
  }

  // --------------------------------------------------
  // FLAMMES AUTOUR DU POING
  // --------------------------------------------------

  drawFlames(context, x, y, intensity = 1) {
    this.flames.forEach((flame, index) => {
      const angle = flame.angle;

      const flameX = x + Math.cos(angle) * flame.radius * intensity;

      const flameY = y + Math.sin(angle) * flame.radius * intensity;

      const size = flame.size * intensity;

      context.save();
      context.globalAlpha = flame.alpha;

      context.translate(flameX, flameY);
      context.rotate(angle + Math.PI / 2);

      // Flamme extérieure.
      context.beginPath();
      context.moveTo(0, size);
      context.quadraticCurveTo(-size, 0, -size * 0.4, -size * 1.5);
      context.quadraticCurveTo(0, -size * 0.8, 0, -size * 2);
      context.quadraticCurveTo(size * 1.2, -size * 0.5, 0, size);

      context.closePath();

      context.fillStyle = index % 2 === 0 ? "#ff4500" : "#ff9d00";

      context.shadowColor = "#ff3b00";
      context.shadowBlur = 12;
      context.fill();

      // Cœur jaune de la flamme.
      context.beginPath();
      context.moveTo(0, size * 0.5);
      context.quadraticCurveTo(-size * 0.4, -size * 0.3, 0, -size * 1.1);
      context.quadraticCurveTo(size * 0.5, -size * 0.2, 0, size * 0.5);

      context.fillStyle = "#ffe76b";
      context.fill();

      context.restore();
    });
  }

  // --------------------------------------------------
  // AURA DE CHALEUR
  // --------------------------------------------------

  drawFireAura(context, x, y, radius, alpha) {
    context.save();
    context.globalAlpha = alpha;

    const gradient = context.createRadialGradient(x, y, 1, x, y, radius);

    gradient.addColorStop(0, "rgba(255, 255, 160, 0.95)");
    gradient.addColorStop(0.3, "rgba(255, 160, 0, 0.75)");
    gradient.addColorStop(0.7, "rgba(255, 65, 0, 0.35)");
    gradient.addColorStop(1, "rgba(255, 30, 0, 0)");

    context.fillStyle = gradient;

    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }

  // --------------------------------------------------
  // BRAISES
  // --------------------------------------------------

  drawEmbers(context, x, y) {
    if (this.phase === "IGNITE" || this.phase === "PUNCH") {
      for (let i = 0; i < 3; i++) {
        const angle = this.timer * 0.15 + i * 2.1;

        const emberX = x + Math.cos(angle) * 28;
        const emberY = y + Math.sin(angle) * 25;

        context.save();

        context.fillStyle = "#ffd45a";
        context.shadowColor = "#ff4b00";
        context.shadowBlur = 10;

        context.beginPath();
        context.arc(emberX, emberY, 2 + Math.random() * 2, 0, Math.PI * 2);
        context.fill();

        context.restore();
      }
    }
  }

  // --------------------------------------------------
  // IMPACT
  // --------------------------------------------------

  createImpactParticles() {
    for (let i = 0; i < 45; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 8;

      this.impactParticles.push({
        x: this.targetCenterX,
        y: this.targetCenterY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 2 + Math.random() * 5,
        life: 18 + Math.random() * 20,
        maxLife: 38,
        color: Math.random() > 0.5 ? "#ff4b00" : "#ffd45a",
      });
    }

    // Grandes langues de feu qui jaillissent à l'impact.
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 * i) / 12;

      this.heatWaves.push({
        angle,
        radius: 10,
        length: 25 + Math.random() * 25,
        life: 18,
        maxLife: 18,
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

    this.heatWaves.forEach((wave) => {
      wave.radius += 4;
      wave.life--;
    });

    this.heatWaves = this.heatWaves.filter((wave) => wave.life > 0);
  }

  drawImpact(context) {
    // Flash incandescent.
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
      gradient.addColorStop(0.25, "#fff4a0");
      gradient.addColorStop(0.55, "rgba(255, 120, 0, 0.8)");
      gradient.addColorStop(1, "rgba(255, 30, 0, 0)");

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
    this.drawHeatWaves(context);
    this.drawImpactParticles(context);
  }

  drawShockwave(context) {
    const alpha = Math.max(0, 1 - this.timer / 22);

    context.save();
    context.globalAlpha = alpha;

    context.strokeStyle = "#ffbd40";
    context.lineWidth = 4;
    context.shadowColor = "#ff4500";
    context.shadowBlur = 15;

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

  drawHeatWaves(context) {
    this.heatWaves.forEach((wave) => {
      const alpha = Math.max(0, wave.life / wave.maxLife);

      const x1 = this.targetCenterX + Math.cos(wave.angle) * wave.radius;

      const y1 = this.targetCenterY + Math.sin(wave.angle) * wave.radius;

      const x2 =
        this.targetCenterX + Math.cos(wave.angle) * (wave.radius + wave.length);

      const y2 =
        this.targetCenterY + Math.sin(wave.angle) * (wave.radius + wave.length);

      context.save();
      context.globalAlpha = alpha;

      context.strokeStyle = "#ffb52e";
      context.lineWidth = 5;
      context.shadowColor = "#ff3b00";
      context.shadowBlur = 12;

      context.beginPath();
      context.moveTo(x1, y1);
      context.lineTo(x2, y2);
      context.stroke();

      context.restore();
    });
  }

  drawImpactParticles(context) {
    this.impactParticles.forEach((particle) => {
      const alpha = Math.max(0, particle.life / particle.maxLife);

      context.save();
      context.globalAlpha = alpha;

      context.fillStyle = particle.color;
      context.shadowColor = "#ff4500";
      context.shadowBlur = 12;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);

      context.fill();
      context.restore();
    });
  }

  // --------------------------------------------------
  // DISSIPATION
  // --------------------------------------------------

  drawDissipation(context) {
    this.drawImpactParticles(context);
    this.drawHeatWaves(context);
  }
}
