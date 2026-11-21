export class NightShadeAnimation {
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

    this.phase = "DARKNESS";
    this.phaseFrame = 0;

    this.originalTargetX = this.target.position.x;
    this.originalTargetY = this.target.position.y;

    this.centerX =
      this.target.position.x + (this.target.frameWidth * this.target.scale) / 2;
    this.centerY =
      this.target.position.y +
      (this.target.frameHeight * this.target.scale) / 2;

    this.radiusX = (this.target.frameWidth / 3) * this.target.scale;
    this.radiusY = (this.target.frameHeight / 3) * this.target.scale;

    this.filaments = Array.from({ length: 9 }, (_, i) => ({
      angle: (Math.PI * 2 * i) / 9,
      length: 0,
      speed: 2 + Math.random() * 2,
      offset: Math.random() * Math.PI * 2,
      width: 1 + Math.random() * 2,
    }));

    this.particles = [];
    this.rings = [];

    this.shadowScale = 0;
    this.shadowOpacity = 0;
    this.darknessOpacity = 0;
    this.flashOpacity = 0;
  }

  update(context) {
    if (this.isFinished) return;

    this.frame++;
    this.phaseFrame++;

    switch (this.phase) {
      case "DARKNESS":
        this.updateDarkness();
        break;

      case "EMBRACE":
        this.updateEmbrace();
        break;

      case "ABSORPTION":
        this.updateAbsorption();
        break;

      case "EXPLOSION":
        this.updateExplosion();
        break;

      case "DISSIPATE":
        this.updateDissipate();
        break;
    }

    this.draw(context);
  }

  updateDarkness() {
    this.darknessOpacity = Math.min(0.48, this.phaseFrame * 0.025);
    this.shadowOpacity = Math.min(0.9, this.phaseFrame * 0.045);

    if (this.phaseFrame >= 40) {
      this.changePhase("EMBRACE");
    }
  }

  updateEmbrace() {
    this.shadowScale = Math.min(1, this.phaseFrame / 24);
    this.shadowOpacity = Math.min(1, 0.9 + this.phaseFrame * 0.005);

    if (this.phaseFrame >= 50) {
      this.changePhase("ABSORPTION");
    }
  }

  updateAbsorption() {
    this.filaments.forEach((filament) => {
      filament.length = Math.min(
        this.radiusX * 1.4,
        filament.length + filament.speed
      );
    });

    if (this.phaseFrame % 4 === 0) {
      this.createParticle();
    }

    if (this.phaseFrame >= 70) {
      this.changePhase("EXPLOSION");
    }
  }

  updateExplosion() {
    const progress = this.phaseFrame / 18;

    this.shadowScale = Math.max(0, 1 - progress);
    this.flashOpacity = Math.max(0, 0.65 - progress * 0.65);

    if (this.phaseFrame === 2) {
      this.game.canvas?.startShake(500, 5);
      this.createExplosion();
    }

    this.rings.forEach((ring) => {
      ring.radius += ring.speed;
      ring.opacity -= 0.035;
    });

    this.particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.opacity -= 0.025;
    });

    this.rings = this.rings.filter((ring) => ring.opacity > 0);
    this.particles = this.particles.filter((particle) => particle.opacity > 0);

    if (this.phaseFrame >= 40) {
      this.changePhase("DISSIPATE");
    }
  }

  updateDissipate() {
    this.shadowOpacity = Math.max(0, 1 - this.phaseFrame / 20);
    this.darknessOpacity = Math.max(0, 0.48 - this.phaseFrame * 0.025);

    this.particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.opacity -= 0.035;
    });

    this.particles = this.particles.filter((particle) => particle.opacity > 0);

    if (this.phaseFrame >= 44) {
      this.isFinished = true;
    }
  }

  changePhase(nextPhase) {
    this.phase = nextPhase;
    this.phaseFrame = 0;
  }

  createParticle() {
    const angle = Math.random() * Math.PI * 2;
    const distance = this.radiusX * (0.5 + Math.random() * 0.6);

    this.particles.push({
      x: this.centerX + Math.cos(angle) * distance,
      y: this.centerY + Math.sin(angle) * distance,
      vx: (this.centerX - (this.centerX + Math.cos(angle) * distance)) * 0.035,
      vy: (this.centerY - (this.centerY + Math.sin(angle) * distance)) * 0.035,
      radius: 1 + Math.random() * 2,
      opacity: 0.9,
    });
  }

  createExplosion() {
    for (let i = 0; i < 28; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 3.5;

      this.particles.push({
        x: this.centerX,
        y: this.centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 1 + Math.random() * 3,
        opacity: 1,
      });
    }

    for (let i = 0; i < 3; i++) {
      this.rings.push({
        radius: 8 + i * 5,
        speed: 2.5 + i * 0.7,
        opacity: 0.85 - i * 0.15,
      });
    }
  }

  draw(context) {
    const ctx = context;
    ctx.save();

    // Assombrissement général autour de la cible.
    if (this.darknessOpacity > 0) {
      ctx.fillStyle = `rgba(12, 3, 28, ${this.darknessOpacity})`;
      ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);
    }

    // Ombre spectrale derrière le Pokémon.
    if (this.shadowOpacity > 0 && this.shadowScale > 0) {
      this.drawShadow(ctx);
    }

    // Filaments qui enveloppent la cible.
    if (this.phase === "ABSORPTION") {
      this.drawFilaments(ctx);
    }

    // Onde d'énergie lors de l'explosion.
    this.drawRings(ctx);

    // Particules spectrales.
    this.drawParticles(ctx);

    // Éclair violet au moment de l'impact.
    if (this.flashOpacity > 0) {
      ctx.fillStyle = `rgba(190, 90, 255, ${this.flashOpacity})`;
      ctx.beginPath();
      ctx.ellipse(
        this.centerX,
        this.centerY,
        this.radiusX * 0.8,
        this.radiusY * 0.8,
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    ctx.restore();
  }

  drawShadow(ctx) {
    const scale = this.shadowScale;
    const pulse = Math.sin(this.frame * 0.13);
    const breathe = 1 + Math.sin(this.frame * 0.08) * 0.035;

    const width = this.radiusX * 1.85 * scale * breathe;
    const height = this.radiusY * 2.15 * scale * breathe;

    const jawOpen =
      this.phase === "ABSORPTION"
        ? Math.min(1, this.phaseFrame / 18)
        : this.phase === "EXPLOSION"
        ? Math.max(0, 1 - this.phaseFrame / 18)
        : 0.55 + pulse * 0.08;

    ctx.save();
    ctx.translate(this.centerX, this.centerY - 8);
    ctx.globalAlpha = this.shadowOpacity;

    // Bras et griffes placés derrière le corps.
    // this.drawShadowTendrils(ctx, width, height, scale);

    // Aura sombre autour de la créature.
    const aura = ctx.createRadialGradient(
      0,
      0,
      height * 0.1,
      0,
      0,
      height * 1.2
    );

    aura.addColorStop(0, "rgba(95, 20, 135, 0.35)");
    aura.addColorStop(0.55, "rgba(48, 8, 70, 0.2)");
    aura.addColorStop(1, "rgba(10, 0, 18, 0)");

    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.ellipse(0, 0, width * 1.2, height * 1.2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Corps principal.
    const bodyGradient = ctx.createRadialGradient(
      -width * 0.12,
      -height * 0.75,
      2,
      0,
      0,
      height
    );

    bodyGradient.addColorStop(0, "#421050");
    bodyGradient.addColorStop(0.3, "#23052f");
    bodyGradient.addColorStop(0.7, "#100318");
    bodyGradient.addColorStop(1, "#030106");

    ctx.fillStyle = bodyGradient;
    ctx.strokeStyle = "#100318";
    ctx.lineWidth = 0;
    ctx.shadowColor = "#a82be3";
    ctx.shadowBlur = 50;

    // Silhouette avec crâne déformé et épaules irrégulières.
    ctx.beginPath();
    ctx.moveTo(-width * 0.52, height * 0.48);

    ctx.lineTo(-width * 0.7, height * 0.12);
    ctx.lineTo(-width * 0.58, -height * 0.12);
    ctx.lineTo(-width * 0.68, -height * 0.48);
    ctx.lineTo(-width * 0.4, -height * 0.4);

    ctx.quadraticCurveTo(
      -width * 0.48,
      -height * 0.85,
      -width * 0.12,
      -height * 0.82
    );

    ctx.lineTo(width * 0.08, -height * 0.98);
    ctx.lineTo(width * 0.2, -height * 0.78);

    ctx.quadraticCurveTo(
      width * 0.58,
      -height * 0.8,
      width * 0.55,
      -height * 0.38
    );

    ctx.lineTo(width * 0.75, -height * 0.15);
    ctx.lineTo(width * 0.62, height * 0.15);
    ctx.lineTo(width * 0.55, height * 0.48);

    ctx.quadraticCurveTo(
      width * 0.25,
      height * 0.72,
      width * 0.05,
      height * 0.58
    );

    ctx.lineTo(-width * 0.15, height * 0.75);
    ctx.quadraticCurveTo(
      -width * 0.4,
      height * 0.68,
      -width * 0.52,
      height * 0.48
    );

    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.shadowBlur = 0;

    // Crêtes et pointes du crâne.
    // this.drawShadowHorns(ctx, width, height);

    // Volutes internes.
    this.drawShadowWisps(ctx, width, height, pulse);

    // Cavités profondes des yeux.
    ctx.fillStyle = "#050008";

    ctx.beginPath();
    ctx.ellipse(
      -width * 0.23,
      -height * 0.25,
      width * 0.105,
      height * 0.13,
      -0.35,
      0,
      Math.PI * 2
    );

    ctx.ellipse(
      width * 0.22,
      -height * 0.25,
      width * 0.095,
      height * 0.13,
      0.35,
      0,
      Math.PI * 2
    );

    ctx.fill();

    // Yeux étroits et menaçants.
    ctx.save();

    ctx.shadowColor = "#ff16db";
    ctx.shadowBlur = 30;
    ctx.fillStyle = "#ff55eb";

    // Œil gauche : forme allongée et inclinée.
    ctx.beginPath();
    ctx.moveTo(-width * 0.34, -height * 0.25);
    ctx.lineTo(-width * 0.13, -height * 0.22);
    ctx.lineTo(-width * 0.19, -height * 0.29);
    ctx.closePath();

    // Œil droit : inclinaison inversée.
    ctx.moveTo(width * 0.13, -height * 0.22);
    ctx.lineTo(width * 0.34, -height * 0.25);
    ctx.lineTo(width * 0.19, -height * 0.29);
    ctx.closePath();

    ctx.fill();
    ctx.restore();

    // Mâchoire monstrueuse.
    this.drawShadowMouth(ctx, width, height, jawOpen);

    ctx.restore();
  }

  drawShadowHorns(ctx, width, height) {
    ctx.save();

    const hornGradient = ctx.createLinearGradient(0, -height, 0, -height * 0.5);

    hornGradient.addColorStop(0, "#08020e");
    hornGradient.addColorStop(0.7, "#270638");
    hornGradient.addColorStop(1, "#8d31b3");

    ctx.fillStyle = hornGradient;
    ctx.strokeStyle = "#68218c";
    ctx.lineWidth = 1.5;

    // Corne gauche.
    ctx.beginPath();
    ctx.moveTo(-width * 0.35, -height * 0.55);
    ctx.quadraticCurveTo(
      -width * 0.65,
      -height * 0.85,
      -width * 0.8,
      -height * 1.05
    );
    ctx.quadraticCurveTo(
      -width * 0.52,
      -height * 0.95,
      -width * 0.25,
      -height * 0.65
    );
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Corne droite.
    ctx.beginPath();
    ctx.moveTo(width * 0.28, -height * 0.58);
    ctx.quadraticCurveTo(
      width * 0.62,
      -height * 0.9,
      width * 0.78,
      -height * 1.02
    );
    ctx.quadraticCurveTo(
      width * 0.68,
      -height * 0.72,
      width * 0.45,
      -height * 0.5
    );
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }

  drawShadowMouth(ctx, width, height, opening) {
    ctx.save();

    const mouthWidth = width * (0.34 + opening * 0.12);
    const mouthHeight = height * (0.1 + opening * 0.2);
    const mouthY = height * 0.12;

    // Contour de la gueule.
    ctx.fillStyle = "#030006";
    ctx.strokeStyle = "#8e2ab2";
    ctx.lineWidth = 2;
    ctx.shadowColor = "#b52cdb";
    ctx.shadowBlur = 10;

    ctx.beginPath();
    ctx.moveTo(-mouthWidth, mouthY);

    ctx.quadraticCurveTo(0, mouthY - mouthHeight * 0.25, mouthWidth, mouthY);

    ctx.quadraticCurveTo(
      mouthWidth * 0.8,
      mouthY + mouthHeight,
      0,
      mouthY + mouthHeight * 1.15
    );

    ctx.quadraticCurveTo(
      -mouthWidth * 0.8,
      mouthY + mouthHeight,
      -mouthWidth,
      mouthY
    );

    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.shadowBlur = 0;

    // Fond de la gorge.
    ctx.fillStyle = "#180322";
    ctx.beginPath();
    ctx.ellipse(
      0,
      mouthY + mouthHeight * 0.55,
      mouthWidth * 0.7,
      mouthHeight * 0.38,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Crocs supérieurs.
    ctx.fillStyle = "#1f1c21";

    const toothCount = 5;

    for (let i = 0; i < toothCount; i++) {
      const x =
        -mouthWidth * 0.78 + i * ((mouthWidth * 1.56) / (toothCount - 1));

      const toothWidth = 3 + (i % 2);

      ctx.beginPath();
      ctx.moveTo(x - toothWidth, mouthY);
      ctx.lineTo(x + toothWidth, mouthY);
      ctx.lineTo(x, mouthY + mouthHeight * 0.42);
      ctx.closePath();
      ctx.fill();
    }

    // Crocs inférieurs.
    for (let i = 0; i < 4; i++) {
      const x = -mouthWidth * 0.65 + i * ((mouthWidth * 1.3) / 3);

      ctx.beginPath();
      ctx.moveTo(x - 3, mouthY + mouthHeight);
      ctx.lineTo(x + 3, mouthY + mouthHeight);
      ctx.lineTo(x, mouthY + mouthHeight * 0.65);
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();
  }

  drawShadowTendrils(ctx, width, height, scale) {
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const tendrils = [
      { side: -1, x: 0.5, y: -0.25, length: 1.15, angle: -0.8 },
      { side: -1, x: 0.6, y: 0.1, length: 1.25, angle: -0.25 },
      { side: -1, x: 0.3, y: 0.45, length: 0.95, angle: 0.55 },
      { side: 1, x: 0.5, y: -0.3, length: 1.2, angle: -0.65 },
      { side: 1, x: 0.65, y: 0.05, length: 1.35, angle: 0.2 },
      { side: 1, x: 0.35, y: 0.4, length: 1.0, angle: 0.65 },
    ];

    tendrils.forEach((tendril, i) => {
      const wave = Math.sin(this.frame * 0.11 + i * 1.7);

      const startX = tendril.side * width * tendril.x * 0.65;
      const startY = height * tendril.y;

      const reach = tendril.length * (0.85 + wave * 0.12);

      const endX =
        startX + Math.cos(tendril.angle) * width * 0.45 * reach * tendril.side;

      const endY = startY + Math.sin(tendril.angle) * height * 0.55 * reach;

      const controlX = startX + tendril.side * width * (0.35 + wave * 0.08);

      const controlY = startY - height * (0.25 + wave * 0.1);

      ctx.globalAlpha = 0.8;
      ctx.strokeStyle = "#16051f";
      ctx.lineWidth = Math.max(2, 7 * scale);
      ctx.shadowColor = "#7023a3";
      ctx.shadowBlur = 9;

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.quadraticCurveTo(controlX, controlY, endX, endY);
      ctx.stroke();

      // Pointe effilée de chaque appendice.

      // Trois griffes effilées au bout de chaque appendice.
      ctx.fillStyle = "#08020d";
      ctx.strokeStyle = "#9d39c8";
      ctx.lineWidth = 1;

      for (let claw = -1; claw <= 1; claw++) {
        const clawX = endX + claw * 4;
        const clawY = endY + Math.abs(claw) * 2;

        ctx.beginPath();
        ctx.moveTo(clawX, clawY);

        ctx.quadraticCurveTo(
          clawX + tendril.side * 7,
          clawY - 8,
          clawX + tendril.side * 12,
          clawY - 16
        );

        ctx.quadraticCurveTo(
          clawX + tendril.side * 9,
          clawY - 5,
          clawX + tendril.side * 3,
          clawY + 3
        );

        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
    });

    ctx.restore();
  }

  drawShadowWisps(ctx, width, height, pulse) {
    ctx.save();
    ctx.globalCompositeOperation = "screen";

    // Plusieurs volutes qui donnent une texture fumée.
    for (let i = 0; i < 5; i++) {
      const offset = this.frame * 0.035 + i * 1.25;

      const x = Math.sin(offset) * width * 0.25;
      const y = Math.cos(offset * 1.3) * height * 0.3;

      ctx.globalAlpha = 0.12 + (pulse + 1) * 0.045;
      ctx.strokeStyle = i % 2 === 0 ? "#a63bd1" : "#66208d";
      ctx.lineWidth = 2 + (i % 2);
      ctx.shadowColor = "#a52bdf";
      ctx.shadowBlur = 8;

      ctx.beginPath();
      ctx.moveTo(x - width * 0.2, y + height * 0.2);

      ctx.bezierCurveTo(
        x - width * 0.12,
        y - height * 0.2,
        x + width * 0.18,
        y + height * 0.15,
        x + width * 0.2,
        y - height * 0.25
      );

      ctx.stroke();
    }

    ctx.restore();
  }

  drawFilaments(ctx) {
    ctx.save();
    ctx.lineCap = "round";

    this.filaments.forEach((filament) => {
      const startX =
        this.centerX + Math.cos(filament.angle) * this.radiusX * 0.85;
      const startY =
        this.centerY + Math.sin(filament.angle) * this.radiusY * 0.85;

      const endX =
        this.centerX + Math.cos(filament.angle + 0.5) * filament.length;
      const endY =
        this.centerY + Math.sin(filament.angle + 0.5) * filament.length * 0.65;

      ctx.globalAlpha =
        0.65 + Math.sin(this.frame * 0.2 + filament.offset) * 0.25;
      ctx.strokeStyle = "#bd4cff";
      ctx.lineWidth = filament.width;
      ctx.shadowColor = "#d94dff";
      ctx.shadowBlur = 9;

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.quadraticCurveTo(
        this.centerX + Math.cos(filament.angle + 1) * this.radiusX,
        this.centerY + Math.sin(filament.angle + 1) * this.radiusY,
        endX,
        endY
      );
      ctx.stroke();
    });

    ctx.restore();
  }

  drawRings(ctx) {
    ctx.save();

    this.rings.forEach((ring) => {
      ctx.globalAlpha = ring.opacity;
      ctx.strokeStyle = "#c45aff";
      ctx.lineWidth = 2;
      ctx.shadowColor = "#9b35d6";
      ctx.shadowBlur = 8;

      ctx.beginPath();
      ctx.ellipse(
        this.centerX,
        this.centerY,
        ring.radius,
        ring.radius * 0.55,
        0,
        0,
        Math.PI * 2
      );
      ctx.stroke();
    });

    ctx.restore();
  }

  drawParticles(ctx) {
    ctx.save();

    this.particles.forEach((particle) => {
      ctx.globalAlpha = particle.opacity;
      ctx.fillStyle = "#d77aff";
      ctx.shadowColor = "#a52cff";
      ctx.shadowBlur = 7;

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  }
}
