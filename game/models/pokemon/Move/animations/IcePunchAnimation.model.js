export class IcePunchAnimation {
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

    this.phase = "FREEZE";
    this.timer = 0;
    this.isFinished = false;

    this.direction = this.target.position.x > this.attacker.position.x ? 1 : -1;

    this.targetWidth = this.target.frameWidth * this.target.scale;
    this.targetHeight = this.target.frameHeight * this.target.scale;

    this.targetCenterX = this.target.position.x + this.targetWidth / 2;
    this.targetCenterY = this.target.position.y + this.targetHeight / 2;

    // Le poing apparaît directement devant le Pokémon ciblé.
    this.startX =
      this.targetCenterX - this.direction * (this.targetWidth * 0.38);
    this.startY = this.targetCenterY;

    // Petite avancée du poing au moment de l'impact.
    this.endX = this.targetCenterX - this.direction * (this.targetWidth * 0.12);
    this.endY = this.targetCenterY;

    this.fistX = this.startX;
    this.fistY = this.startY;

    this.progress = 0;
    this.fistSize = Math.max(24, this.targetHeight * 0.75);

    this.iceCrystals = [];
    this.snowParticles = [];
    this.impactParticles = [];
    this.frostWaves = [];

    this.flashAlpha = 0;
    this.shockwaveRadius = 0;

    this.createIceCrystals();
  }

  update(context) {
    if (this.isFinished) return;

    this.timer++;

    switch (this.phase) {
      case "FREEZE":
        this.updateIceCrystals();

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

        this.updateIceCrystals();

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
        this.updateIceCrystals();

        this.flashAlpha = Math.max(0, this.flashAlpha - 0.1);
        this.shockwaveRadius += 7;

        if (this.timer >= 22) {
          this.phase = "DISSIPATE";
          this.timer = 0;
        }
        break;

      case "DISSIPATE":
        this.updateImpactParticles();
        this.updateIceCrystals();

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
      case "FREEZE":
        this.drawFreezingFist(context);
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
  // CRÉATION DES CRISTAUX
  // --------------------------------------------------

  createIceCrystals() {
    for (let i = 0; i < 20; i++) {
      this.iceCrystals.push({
        angle: Math.random() * Math.PI * 2,
        radius: 24 + Math.random() * 16,
        size: 4 + Math.random() * 7,
        speed: 0.025 + Math.random() * 0.045,
        offset: Math.random() * Math.PI * 2,
        alpha: 0.5 + Math.random() * 0.5,
      });
    }
  }

  updateIceCrystals() {
    this.iceCrystals.forEach((crystal) => {
      crystal.angle += crystal.speed;
      crystal.offset += 0.12;

      crystal.radius = 24 + Math.sin(crystal.offset) * 8;
    });
  }

  // --------------------------------------------------
  // APPARITION ET CONGÉLATION
  // --------------------------------------------------

  drawFreezingFist(context) {
    const progress = this.timer / 22;

    this.drawIceAura(
      context,
      this.startX,
      this.startY,
      22 + progress * 25,
      0.4 + progress * 0.5
    );

    this.drawCrystals(context, this.startX, this.startY, 0.5 + progress * 0.5);

    this.drawFist(
      context,
      this.startX,
      this.startY,
      0.7 + progress * 0.3,
      -this.direction
    );

    this.drawSnow(context, this.startX, this.startY);
  }

  // --------------------------------------------------
  // POING GLACIAL
  // --------------------------------------------------

  drawPunch(context) {
    const scale = 1 + Math.sin(this.timer * 0.8) * 0.05;

    this.drawIceAura(
      context,
      this.fistX,
      this.fistY,
      this.fistSize * 1.3,
      0.85
    );

    this.drawCrystals(context, this.fistX, this.fistY, 1.3);

    this.drawFist(context, this.fistX, this.fistY, scale, -this.direction);

    this.drawIceTrail(context);
    this.drawSnow(context, this.fistX, this.fistY);
  }

  drawIceTrail(context) {
    context.save();

    context.lineCap = "round";

    for (let i = 0; i < 6; i++) {
      const offset = i * 8;

      context.beginPath();

      context.moveTo(
        this.fistX - this.direction * (this.fistSize + offset),
        this.fistY + (i - 2.5) * 5
      );

      context.lineTo(
        this.fistX - this.direction * (this.fistSize * 0.5 + offset),
        this.fistY + (i % 2 === 0 ? -14 : 14)
      );

      context.lineTo(this.fistX - this.direction * offset, this.fistY);

      context.strokeStyle = i % 2 === 0 ? "#b8f5ff" : "#38cfff";

      context.lineWidth = 6 - i * 0.6;
      context.shadowColor = "#5deaff";
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

    // Ombre générale.
    context.shadowColor = "rgba(0, 20, 50, 0.7)";
    context.shadowBlur = 7;
    context.shadowOffsetX = 3;
    context.shadowOffsetY = 4;

    // Silhouette principale.
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

    context.fillStyle = "#17232e";
    context.fill();

    context.shadowColor = "transparent";
    context.shadowBlur = 0;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;

    // Contour argenté bleu glacier.
    context.strokeStyle = "#a9eaff";
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

      context.fillStyle = "#42677c";
      context.fill();

      context.strokeStyle = "#d5f7ff";
      context.lineWidth = 1.8;
      context.stroke();

      // Reflet glacé.
      context.beginPath();
      context.ellipse(x - 1, y - 2, r * 0.55, 1.5, -0.3, 0, Math.PI * 2);

      context.fillStyle = "#ffffff";
      context.fill();
    });

    // Séparation des doigts.
    context.strokeStyle = "#10212e";
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

    context.fillStyle = "#304c60";
    context.fill();

    context.strokeStyle = "#b9edff";
    context.lineWidth = 2.5;
    context.stroke();

    // Reflet du pouce.
    context.beginPath();
    context.moveTo(-27, -5);
    context.quadraticCurveTo(-24, -10, -18, -7);
    context.strokeStyle = "#ffffff";
    context.lineWidth = 1.5;
    context.stroke();

    // Petits cristaux sur les phalanges.
    this.drawKnuckleCrystals(context);

    context.restore();
  }

  drawKnuckleCrystals(context) {
    const positions = [
      { x: -20, y: -34, size: 5 },
      { x: -6, y: -39, size: 6 },
      { x: 8, y: -39, size: 5 },
      { x: 19, y: -32, size: 5 },
    ];

    positions.forEach(({ x, y, size }) => {
      context.beginPath();

      context.moveTo(x, y - size);
      context.lineTo(x + size * 0.6, y);
      context.lineTo(x, y + size);
      context.lineTo(x - size * 0.6, y);
      context.closePath();

      context.fillStyle = "#c9f8ff";
      context.fill();

      context.strokeStyle = "#ffffff";
      context.lineWidth = 1.2;
      context.stroke();
    });
  }

  // --------------------------------------------------
  // CRISTAUX AUTOUR DU POING
  // --------------------------------------------------

  drawCrystals(context, x, y, intensity = 1) {
    this.iceCrystals.forEach((crystal, index) => {
      const crystalX = x + Math.cos(crystal.angle) * crystal.radius * intensity;

      const crystalY = y + Math.sin(crystal.angle) * crystal.radius * intensity;

      const size = crystal.size * intensity;

      context.save();
      context.globalAlpha = crystal.alpha;

      context.translate(crystalX, crystalY);
      context.rotate(crystal.angle);

      context.beginPath();
      context.moveTo(0, -size);
      context.lineTo(size * 0.55, 0);
      context.lineTo(0, size);
      context.lineTo(-size * 0.55, 0);
      context.closePath();

      context.fillStyle = index % 2 === 0 ? "#d8fbff" : "#65dfff";

      context.strokeStyle = "#ffffff";
      context.lineWidth = 1.5;

      context.shadowColor = "#50dcff";
      context.shadowBlur = 12;

      context.fill();
      context.stroke();

      // Reflet intérieur.
      context.beginPath();
      context.moveTo(0, -size * 0.7);
      context.lineTo(size * 0.2, 0);
      context.lineTo(0, size * 0.4);

      context.strokeStyle = "#ffffff";
      context.lineWidth = 1;
      context.stroke();

      context.restore();
    });
  }

  // --------------------------------------------------
  // AURA GLACIALE
  // --------------------------------------------------

  drawIceAura(context, x, y, radius, alpha) {
    context.save();
    context.globalAlpha = alpha;

    const gradient = context.createRadialGradient(x, y, 1, x, y, radius);

    gradient.addColorStop(0, "rgba(255, 255, 255, 0.95)");
    gradient.addColorStop(0.3, "rgba(130, 235, 255, 0.75)");
    gradient.addColorStop(0.7, "rgba(30, 170, 255, 0.35)");
    gradient.addColorStop(1, "rgba(0, 110, 255, 0)");

    context.fillStyle = gradient;

    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }

  // --------------------------------------------------
  // NEIGE ET BRUME
  // --------------------------------------------------

  drawSnow(context, x, y) {
    for (let i = 0; i < 5; i++) {
      const angle = this.timer * 0.12 + i * 1.25;
      const radius = 28 + Math.sin(this.timer * 0.1 + i) * 8;

      const snowX = x + Math.cos(angle) * radius;
      const snowY = y + Math.sin(angle) * radius;

      context.save();

      context.globalAlpha = 0.7;
      context.strokeStyle = "#e6fcff";
      context.lineWidth = 1.8;
      context.shadowColor = "#7ceaff";
      context.shadowBlur = 8;

      context.beginPath();

      context.moveTo(snowX - 3, snowY);
      context.lineTo(snowX + 3, snowY);

      context.moveTo(snowX, snowY - 3);
      context.lineTo(snowX, snowY + 3);

      context.moveTo(snowX - 2, snowY - 2);
      context.lineTo(snowX + 2, snowY + 2);

      context.moveTo(snowX + 2, snowY - 2);
      context.lineTo(snowX - 2, snowY + 2);

      context.stroke();
      context.restore();
    }
  }

  // --------------------------------------------------
  // IMPACT
  // --------------------------------------------------

  createImpactParticles() {
    // Éclats de glace projetés dans toutes les directions.
    for (let i = 0; i < 45; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 8;

      this.impactParticles.push({
        x: this.targetCenterX,
        y: this.targetCenterY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3 + Math.random() * 7,
        life: 18 + Math.random() * 20,
        maxLife: 38,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.15,
      });
    }

    // Ondes de cristallisation.
    for (let i = 0; i < 12; i++) {
      this.frostWaves.push({
        angle: (Math.PI * 2 * i) / 12,
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

      particle.rotation += particle.rotationSpeed;
      particle.life--;
    });

    this.impactParticles = this.impactParticles.filter(
      (particle) => particle.life > 0
    );

    this.frostWaves.forEach((wave) => {
      wave.radius += 4;
      wave.life--;
    });

    this.frostWaves = this.frostWaves.filter((wave) => wave.life > 0);
  }

  drawImpact(context) {
    // Flash blanc et cyan.
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
      gradient.addColorStop(0.3, "#d8fbff");
      gradient.addColorStop(0.65, "rgba(80, 210, 255, 0.75)");
      gradient.addColorStop(1, "rgba(0, 130, 255, 0)");

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
    this.drawFrostWaves(context);
    this.drawImpactParticles(context);
  }

  drawShockwave(context) {
    const alpha = Math.max(0, 1 - this.timer / 22);

    context.save();
    context.globalAlpha = alpha;

    context.strokeStyle = "#d9fbff";
    context.lineWidth = 4;
    context.shadowColor = "#55dfff";
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

  drawFrostWaves(context) {
    this.frostWaves.forEach((wave) => {
      const alpha = Math.max(0, wave.life / wave.maxLife);

      const x1 = this.targetCenterX + Math.cos(wave.angle) * wave.radius;

      const y1 = this.targetCenterY + Math.sin(wave.angle) * wave.radius;

      const x2 =
        this.targetCenterX + Math.cos(wave.angle) * (wave.radius + wave.length);

      const y2 =
        this.targetCenterY + Math.sin(wave.angle) * (wave.radius + wave.length);

      context.save();
      context.globalAlpha = alpha;

      context.strokeStyle = "#c8f7ff";
      context.lineWidth = 5;
      context.shadowColor = "#40dfff";
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

      context.translate(particle.x, particle.y);
      context.rotate(particle.rotation);

      context.beginPath();
      context.moveTo(0, -particle.size);
      context.lineTo(particle.size * 0.55, 0);
      context.lineTo(0, particle.size);
      context.lineTo(-particle.size * 0.55, 0);
      context.closePath();

      context.fillStyle = "#c9f8ff";
      context.strokeStyle = "#ffffff";
      context.lineWidth = 1.5;

      context.shadowColor = "#55dfff";
      context.shadowBlur = 12;

      context.fill();
      context.stroke();

      context.restore();
    });
  }

  // --------------------------------------------------
  // DISSIPATION
  // --------------------------------------------------

  drawDissipation(context) {
    this.drawImpactParticles(context);
    this.drawFrostWaves(context);
  }
}
