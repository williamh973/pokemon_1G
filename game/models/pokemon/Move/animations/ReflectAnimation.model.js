export class ReflectAnimation {
  constructor(game, viewers, turnAction) {
    this.game = game;
    this.viewers = viewers;
    this.turnAction = turnAction;

    if (viewers.front.slot.content === turnAction.pokemon) {
      this.pokemonViewer = viewers.front;
    } else {
      this.pokemonViewer = viewers.back;
    }

    this.pokemon = this.pokemonViewer.sprite;

    this.center = {
      x: this.pokemon.position.x + this.pokemon.frameWidth / 2,
      y: this.pokemon.position.y + this.pokemon.frameHeight / 2,
    };

    this.phase = "GATHER";
    this.frame = 0;
    this.totalFrames = 0;
    this.isFinished = false;

    this.duration = {
      GATHER: 36,
      FORM: 64,
      ACTIVATE: 48,
      FINISH: 56,
    };

    this.shield = {
      width: this.pokemon.frameWidth * 0.85,
      height: this.pokemon.frameHeight * 1.35,
      scale: 0.2,
      opacity: 0,
      rotation: 0,
    };

    this.energy = 0;
    this.flash = 0;

    this.particles = [];
    this.facets = [];
    this.waves = [];
    this.reflections = [];
    this.sparks = [];

    this.colors = {
      blue: "#318CE7",
      cyan: "#76E5FF",
      light: "#C8F7FF",
      white: "#FFFFFF",
      deep: "#2462B4",
      pale: "#E8FCFF",
    };

    this.createParticles();
    this.createFacets();
    this.createReflections();
  }

  update(context) {
    if (this.isFinished) return;

    this.totalFrames++;

    switch (this.phase) {
      case "GATHER":
        this.updateGather();
        break;

      case "FORM":
        this.updateForm();
        break;

      case "ACTIVATE":
        this.updateActivate();
        break;

      case "FINISH":
        this.updateFinish();
        break;
    }

    this.updateParticles();
    this.draw(context);
  }

  changePhase(phase) {
    this.phase = phase;
    this.frame = 0;
  }

  getProgress() {
    return Math.min(this.frame / this.duration[this.phase], 1);
  }

  easeOut(progress) {
    return 1 - Math.pow(1 - progress, 3);
  }

  easeInOut(progress) {
    return progress < 0.5
      ? 2 * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;
  }

  createParticles() {
    for (let i = 0; i < 28; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 25 + Math.random() * 35;

      this.particles.push({
        x: this.center.x + Math.cos(angle) * distance,
        y: this.center.y + Math.sin(angle) * distance,
        angle,
        speed: 0.025 + Math.random() * 0.035,
        size: 1 + Math.random() * 2,
        alpha: 0,
        life: 1,
      });
    }
  }

  createFacets() {
    const count = 18;

    for (let i = 0; i < count; i++) {
      this.facets.push({
        angle: (Math.PI * 2 * i) / count,
        length: 0.75 + Math.random() * 0.4,
        alpha: 0,
        offset: Math.random() * Math.PI * 2,
      });
    }
  }

  createReflections() {
    for (let i = 0; i < 5; i++) {
      this.reflections.push({
        angle: -1.1 + i * 0.45,
        width: 2 + Math.random() * 3,
        offset: Math.random() * Math.PI * 2,
        alpha: 0,
      });
    }
  }

  createSpark() {
    const angle = Math.random() * Math.PI * 2;
    const rx = this.shield.width * this.shield.scale * 0.5;
    const ry = this.shield.height * this.shield.scale * 0.5;

    this.sparks.push({
      x: this.center.x + Math.cos(angle) * rx,
      y: this.center.y + Math.sin(angle) * ry,
      vx: (Math.random() - 0.5) * 1.8,
      vy: (Math.random() - 0.5) * 1.8,
      size: 1 + Math.random() * 2,
      alpha: 1,
      life: 12 + Math.random() * 14,
    });
  }

  createWave() {
    this.waves.push({
      scale: 0.65,
      alpha: 1,
      speed: 0.035,
    });
  }

  updateGather() {
    const progress = this.getProgress();

    this.energy = progress * 0.45;
    this.shield.opacity = progress * 0.3;

    this.particles.forEach((particle) => {
      particle.alpha = Math.min(1, progress * 1.4);

      particle.x += (this.center.x - particle.x) * particle.speed;

      particle.y += (this.center.y - particle.y) * particle.speed;
    });

    if (Math.random() < 0.35) {
      this.createSpark();
    }

    this.frame++;

    if (this.frame >= this.duration.GATHER) {
      this.changePhase("FORM");
    }
  }

  updateForm() {
    const progress = this.easeOut(this.getProgress());

    this.energy = 0.45 + progress * 0.55;

    this.shield.scale = 0.2 + progress * 0.8;
    this.shield.opacity = 0.25 + progress * 0.55;

    this.shield.rotation = Math.sin(this.frame * 0.08) * 0.025;

    this.facets.forEach((facet) => {
      facet.alpha = Math.min(1, progress * 1.4);
    });

    this.reflections.forEach((reflection) => {
      reflection.alpha = Math.min(0.8, progress);
    });

    this.particles.forEach((particle) => {
      particle.alpha *= 0.9;
    });

    if (Math.random() < 0.45) {
      this.createSpark();
    }

    this.frame++;

    if (this.frame >= this.duration.FORM) {
      this.createWave();
      this.changePhase("ACTIVATE");
    }
  }

  updateActivate() {
    const progress = this.getProgress();

    this.energy = 1;
    this.shield.opacity = 0.8 + Math.sin(this.frame * 0.25) * 0.08;

    this.shield.rotation = Math.sin(this.frame * 0.12) * 0.025;

    if (this.frame === 0) {
      this.flash = 1;

      if (this.game.canvas?.startShake) {
        this.game.canvas.startShake(3, 100);
      }
    }

    if (this.frame % 8 === 0) {
      this.createWave();
    }

    if (Math.random() < 0.55) {
      this.createSpark();
    }

    this.facets.forEach((facet) => {
      facet.alpha =
        0.65 + Math.sin(this.totalFrames * 0.15 + facet.offset) * 0.25;
    });

    this.reflections.forEach((reflection) => {
      reflection.alpha =
        0.35 + Math.sin(this.totalFrames * 0.12 + reflection.offset) * 0.35;
    });

    this.flash *= 0.85;

    this.frame++;

    if (this.frame >= this.duration.ACTIVATE) {
      this.changePhase("FINISH");
    }
  }

  updateFinish() {
    const progress = this.getProgress();

    this.shield.opacity = 0.8 * (1 - this.easeOut(progress));
    this.energy *= 0.94;

    this.facets.forEach((facet) => {
      facet.alpha *= 0.88;
    });

    this.reflections.forEach((reflection) => {
      reflection.alpha *= 0.88;
    });

    this.flash *= 0.85;

    this.frame++;

    if (this.frame >= this.duration.FINISH) {
      this.isFinished = true;
    }
  }

  updateParticles() {
    this.waves = this.waves.filter((wave) => wave.alpha > 0.03);

    this.waves.forEach((wave) => {
      wave.scale += wave.speed;
      wave.alpha -= 0.045;
    });

    this.sparks = this.sparks.filter((spark) => spark.life > 0);

    this.sparks.forEach((spark) => {
      spark.x += spark.vx;
      spark.y += spark.vy;

      spark.vx *= 0.96;
      spark.vy *= 0.96;

      spark.alpha = spark.life / 26;
      spark.life--;
    });
  }

  draw(context) {
    context.save();

    this.drawEnergyAura(context);
    this.drawWaves(context);
    this.drawShield(context);
    this.drawFacets(context);
    this.drawReflections(context);
    this.drawParticles(context);
    this.drawFlash(context);

    context.restore();
  }

  drawEnergyAura(context) {
    if (this.energy <= 0.01) return;

    const rx = this.shield.width * this.shield.scale * 0.62;
    const ry = this.shield.height * this.shield.scale * 0.62;

    context.save();

    const gradient = context.createRadialGradient(
      this.center.x,
      this.center.y,
      2,
      this.center.x,
      this.center.y,
      Math.max(rx, ry)
    );

    gradient.addColorStop(0, `rgba(118, 229, 255, ${0.1 * this.energy})`);
    gradient.addColorStop(0.6, `rgba(49, 140, 231, ${0.12 * this.energy})`);
    gradient.addColorStop(1, "rgba(49, 140, 231, 0)");

    context.fillStyle = gradient;

    context.beginPath();
    context.ellipse(
      this.center.x,
      this.center.y,
      rx,
      ry,
      this.shield.rotation,
      0,
      Math.PI * 2
    );
    context.fill();

    context.restore();
  }

  drawShield(context) {
    if (this.shield.opacity <= 0.01) return;

    const rx = this.shield.width * this.shield.scale * 0.5;
    const ry = this.shield.height * this.shield.scale * 0.5;

    context.save();

    context.translate(this.center.x, this.center.y);
    context.rotate(this.shield.rotation);

    // Surface extérieure lumineuse.
    context.globalAlpha = this.shield.opacity * 0.3;
    context.fillStyle = this.colors.cyan;
    context.shadowColor = this.colors.blue;
    context.shadowBlur = 18;

    context.beginPath();
    context.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
    context.fill();

    // Intérieur translucide.
    context.globalAlpha = this.shield.opacity * 0.22;
    const gradient = context.createRadialGradient(
      -rx * 0.3,
      -ry * 0.3,
      2,
      0,
      0,
      ry
    );

    gradient.addColorStop(0, "rgba(255, 255, 255, 0.65)");
    gradient.addColorStop(0.4, "rgba(118, 229, 255, 0.3)");
    gradient.addColorStop(1, "rgba(36, 98, 180, 0.45)");

    context.fillStyle = gradient;
    context.shadowBlur = 0;

    context.beginPath();
    context.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
    context.fill();

    // Contour du bouclier.
    context.globalAlpha = this.shield.opacity;
    context.strokeStyle = this.colors.light;
    context.lineWidth = 1.6;
    context.shadowColor = this.colors.cyan;
    context.shadowBlur = 9;

    context.beginPath();
    context.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
    context.stroke();

    // Contour intérieur.
    context.globalAlpha = this.shield.opacity * 0.55;
    context.strokeStyle = this.colors.white;
    context.lineWidth = 0.7;

    context.beginPath();
    context.ellipse(rx * 0.82, 0, rx * 0.15, ry * 0.88, 0, 0, Math.PI * 2);
    context.stroke();

    context.restore();
  }

  drawFacets(context) {
    if (this.shield.scale < 0.4) return;

    const rx = this.shield.width * this.shield.scale * 0.5;
    const ry = this.shield.height * this.shield.scale * 0.5;

    this.facets.forEach((facet) => {
      if (facet.alpha <= 0.02) return;

      const x1 = Math.cos(facet.angle) * rx;
      const y1 = Math.sin(facet.angle) * ry;

      const x2 = Math.cos(facet.angle + 0.2) * rx * 0.72;
      const y2 = Math.sin(facet.angle + 0.2) * ry * 0.72;

      context.save();

      context.globalAlpha = facet.alpha * this.shield.opacity * 0.65;
      context.strokeStyle = this.colors.light;
      context.lineWidth = 0.8;
      context.shadowColor = this.colors.cyan;
      context.shadowBlur = 4;

      context.beginPath();
      context.moveTo(this.center.x + x1, this.center.y + y1);
      context.lineTo(this.center.x + x2, this.center.y + y2);
      context.stroke();

      context.restore();
    });
  }

  drawReflections(context) {
    const rx = this.shield.width * this.shield.scale * 0.5;
    const ry = this.shield.height * this.shield.scale * 0.5;

    this.reflections.forEach((reflection) => {
      if (reflection.alpha <= 0.02) return;

      const offset =
        Math.sin(this.totalFrames * 0.08 + reflection.offset) * 0.12;

      context.save();

      context.translate(this.center.x, this.center.y);
      context.rotate(reflection.angle + offset);

      context.globalAlpha = reflection.alpha * this.shield.opacity;
      context.strokeStyle = this.colors.white;
      context.lineWidth = reflection.width;
      context.shadowColor = this.colors.cyan;
      context.shadowBlur = 7;

      context.beginPath();
      context.ellipse(0, 0, rx * 0.72, ry * 0.72, 0, -0.35, 0.35);
      context.stroke();

      context.restore();
    });
  }

  drawWaves(context) {
    const rx = this.shield.width * this.shield.scale * 0.5;
    const ry = this.shield.height * this.shield.scale * 0.5;

    this.waves.forEach((wave) => {
      context.save();

      context.globalAlpha = wave.alpha * this.shield.opacity;
      context.strokeStyle = this.colors.white;
      context.lineWidth = 1.5;
      context.shadowColor = this.colors.cyan;
      context.shadowBlur = 8;

      context.beginPath();
      context.ellipse(
        this.center.x,
        this.center.y,
        rx * wave.scale,
        ry * wave.scale,
        0,
        0,
        Math.PI * 2
      );
      context.stroke();

      context.restore();
    });
  }

  drawParticles(context) {
    this.sparks.forEach((spark) => {
      context.save();

      context.globalAlpha = Math.max(0, spark.alpha);
      context.fillStyle = this.colors.white;
      context.shadowColor = this.colors.cyan;
      context.shadowBlur = 6;

      context.beginPath();
      context.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2);
      context.fill();

      context.restore();
    });
  }

  drawFlash(context) {
    if (this.flash <= 0.02) return;

    context.save();

    context.globalAlpha = this.flash * 0.3;
    context.fillStyle = this.colors.white;

    context.beginPath();
    context.arc(
      this.center.x,
      this.center.y,
      20 + (1 - this.flash) * 15,
      0,
      Math.PI * 2
    );
    context.fill();

    context.restore();
  }
}
