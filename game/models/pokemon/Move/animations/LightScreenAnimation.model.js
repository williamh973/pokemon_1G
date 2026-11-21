export class LightScreenAnimation {
  constructor(game, viewers, turnAction) {
    this.game = game;
    this.viewers = viewers;
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

    this.center = {
      x: this.attacker.position.x + this.attacker.frameWidth / 2,
      y: this.attacker.position.y + this.attacker.frameHeight / 2,
    };

    this.targetCenter = {
      x: this.target.position.x + this.target.frameWidth / 2,
      y: this.target.position.y + this.target.frameHeight / 2,
    };

    // Le mur se place entre les deux Pokémon.
    this.direction = this.targetCenter.x >= this.center.x ? 1 : -1;

    this.wall = {
      x: (this.center.x + this.targetCenter.x) / 2,
      y: (this.center.y + this.targetCenter.y) / 2,
      width: 0,
      height: 0,
      maxWidth: 52,
      maxHeight: 114,
      opacity: 0,
    };

    this.phase = "GATHER";
    this.frame = 0;
    this.isFinished = false;

    this.duration = {
      GATHER: 36,
      FORM: 60,
      ACTIVATE: 48,
      FINISH: 36,
    };

    this.totalFrames = 0;
    this.energy = 0;
    this.activationFlash = 0;

    this.orbs = [];
    this.particles = [];
    this.hexagons = [];
    this.waves = [];
    this.sparks = [];

    this.colors = {
      gold: "#F9D66B",
      lightGold: "#FFF0AE",
      white: "#FFFFFF",
      pale: "#FFF9DC",
      orange: "#E8AC3D",
      blue: "#C9F3FF",
    };

    this.createParticles();
    this.createHexagons();
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

  createParticles() {
    for (let i = 0; i < 24; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 20 + Math.random() * 30;

      this.particles.push({
        x: this.center.x + Math.cos(angle) * distance,
        y: this.center.y + Math.sin(angle) * distance,
        targetX: this.wall.x,
        targetY: this.wall.y,
        speed: 0.025 + Math.random() * 0.025,
        size: 1 + Math.random() * 2,
        alpha: 0,
        phase: Math.random() * Math.PI * 2,
      });
    }
  }

  createHexagons() {
    const rows = 7;
    const columns = 4;

    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {
        this.hexagons.push({
          row,
          column,
          size: 5.5,
          alpha: 0,
          offset: Math.random() * 0.5,
          pulse: Math.random() * Math.PI * 2,
        });
      }
    }
  }

  createOrb() {
    this.orbs.push({
      x: this.center.x + this.direction * 15,
      y: this.center.y,
      radius: 3,
      alpha: 1,
      pulse: 0,
    });
  }

  createWave() {
    this.waves.push({
      progress: 0,
      alpha: 1,
      width: this.wall.width,
      height: this.wall.height,
    });
  }

  createSpark() {
    const x = this.wall.x + (Math.random() - 0.5) * this.wall.width;

    const y = this.wall.y + (Math.random() - 0.5) * this.wall.height;

    this.sparks.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 1.5,
      vy: -0.5 - Math.random() * 1.5,
      size: 1 + Math.random() * 2,
      alpha: 1,
      life: 12 + Math.random() * 15,
    });
  }

  updateGather() {
    const progress = this.getProgress();

    this.energy = progress * 0.6;

    if (this.frame === 0) {
      this.createOrb();
    }

    this.orbs.forEach((orb) => {
      orb.radius = 3 + progress * 5;
      orb.alpha = 0.5 + Math.sin(this.frame * 0.3) * 0.3;
    });

    this.particles.forEach((particle) => {
      particle.alpha = Math.min(1, progress * 1.5);

      particle.x += (this.wall.x - particle.x) * particle.speed;
      particle.y += (this.wall.y - particle.y) * particle.speed;
    });

    if (Math.random() < 0.4) {
      this.createSpark();
    }

    this.frame++;

    if (this.frame >= this.duration.GATHER) {
      this.changePhase("FORM");
    }
  }

  updateForm() {
    const progress = this.easeOut(this.getProgress());

    this.energy = 0.6 + progress * 0.4;

    this.wall.width = this.wall.maxWidth * progress;
    this.wall.height = this.wall.maxHeight * progress;
    this.wall.opacity = progress;

    this.orbs.forEach((orb) => {
      orb.alpha *= 0.88;
    });

    this.hexagons.forEach((hexagon) => {
      hexagon.alpha = Math.min(1, Math.max(0, progress * 1.5 - hexagon.offset));
    });

    this.particles.forEach((particle) => {
      particle.alpha *= 0.91;
    });

    if (Math.random() < 0.35) {
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

    this.wall.opacity = 1;
    this.energy = 1;

    if (this.frame === 0) {
      this.activationFlash = 1;

      if (this.game.canvas?.startShake) {
        this.game.canvas.startShake(3, 100);
      }
    }

    if (this.frame % 7 === 0) {
      this.createWave();
    }

    if (Math.random() < 0.6) {
      this.createSpark();
    }

    this.hexagons.forEach((hexagon) => {
      hexagon.alpha =
        0.65 + Math.sin(this.totalFrames * 0.12 + hexagon.pulse) * 0.25;
    });

    this.activationFlash *= 0.86;

    this.frame++;

    if (this.frame >= this.duration.ACTIVATE) {
      this.changePhase("FINISH");
    }
  }

  updateFinish() {
    const progress = this.getProgress();

    this.wall.opacity = 1 - this.easeOut(progress);
    this.energy *= 0.94;

    this.hexagons.forEach((hexagon) => {
      hexagon.alpha *= 0.9;
    });

    this.activationFlash *= 0.85;

    this.frame++;

    if (this.frame >= this.duration.FINISH) {
      this.isFinished = true;
    }
  }

  updateParticles() {
    this.waves = this.waves.filter((wave) => wave.alpha > 0.03);

    this.waves.forEach((wave) => {
      wave.progress += 0.055;
      wave.alpha = 1 - wave.progress;
    });

    this.sparks = this.sparks.filter((spark) => spark.life > 0);

    this.sparks.forEach((spark) => {
      spark.x += spark.vx;
      spark.y += spark.vy;
      spark.alpha = spark.life / 27;
      spark.life--;
    });
  }

  draw(context) {
    context.save();

    this.drawGatherOrb(context);
    this.drawEnergyParticles(context);
    this.drawWall(context);
    this.drawHexagons(context);
    this.drawWaves(context);
    this.drawSparks(context);
    this.drawActivationFlash(context);

    context.restore();
  }

  drawGatherOrb(context) {
    this.orbs.forEach((orb) => {
      if (orb.alpha <= 0.02) return;

      context.save();

      context.globalAlpha = orb.alpha;
      context.fillStyle = this.colors.white;
      context.shadowColor = this.colors.gold;
      context.shadowBlur = 12;

      context.beginPath();
      context.arc(this.wall.x, this.wall.y, orb.radius, 0, Math.PI * 2);
      context.fill();

      context.restore();
    });
  }

  drawEnergyParticles(context) {
    this.particles.forEach((particle) => {
      if (particle.alpha <= 0.02) return;

      context.save();

      context.globalAlpha = particle.alpha;
      context.fillStyle = this.colors.lightGold;
      context.shadowColor = this.colors.gold;
      context.shadowBlur = 5;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fill();

      context.restore();
    });
  }

  drawWall(context) {
    if (this.wall.opacity <= 0.01) return;

    const { x, y, width, height } = this.wall;

    context.save();
    context.globalAlpha = this.wall.opacity;

    // Halo extérieur.
    const halo = context.createLinearGradient(
      x - width / 2,
      y,
      x + width / 2,
      y
    );

    halo.addColorStop(0, "rgba(255, 222, 125, 0.05)");
    halo.addColorStop(0.5, "rgba(255, 255, 225, 0.35)");
    halo.addColorStop(1, "rgba(255, 222, 125, 0.05)");

    context.fillStyle = halo;
    context.shadowColor = this.colors.gold;
    context.shadowBlur = 15;

    context.fillRect(x - width / 2, y - height / 2, width, height);

    // Surface translucide.
    const surface = context.createLinearGradient(
      x - width / 2,
      y,
      x + width / 2,
      y
    );

    surface.addColorStop(0, "rgba(255, 222, 125, 0.12)");
    surface.addColorStop(0.5, "rgba(255, 255, 255, 0.32)");
    surface.addColorStop(1, "rgba(255, 222, 125, 0.12)");

    context.shadowBlur = 0;
    context.fillStyle = surface;

    context.fillRect(x - width / 2, y - height / 2, width, height);

    // Contour lumineux.
    context.strokeStyle = this.colors.lightGold;
    context.lineWidth = 1.5;
    context.shadowColor = this.colors.white;
    context.shadowBlur = 8;

    context.strokeRect(x - width / 2, y - height / 2, width, height);

    // Axe central.
    context.globalAlpha *= 0.6;
    context.strokeStyle = this.colors.white;
    context.lineWidth = 0.8;

    context.beginPath();
    context.moveTo(x, y - height / 2);
    context.lineTo(x, y + height / 2);
    context.stroke();

    context.restore();
  }

  drawHexagons(context) {
    if (this.wall.width <= 1) return;

    const { x, y, width, height } = this.wall;

    const spacingX = width / 4;
    const spacingY = height / 7;

    this.hexagons.forEach((hexagon) => {
      if (hexagon.alpha <= 0.02) return;

      const offsetX = hexagon.row % 2 === 0 ? 0 : spacingX * 0.5;

      const hx = x - width / 2 + spacingX * (hexagon.column + 0.5) + offsetX;

      const hy = y - height / 2 + spacingY * (hexagon.row + 0.5);

      context.save();

      context.globalAlpha = hexagon.alpha * this.wall.opacity;
      context.strokeStyle = this.colors.lightGold;
      context.lineWidth = 0.8;
      context.shadowColor = this.colors.gold;
      context.shadowBlur = 4;

      context.beginPath();

      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const px = hx + Math.cos(angle) * hexagon.size;
        const py = hy + Math.sin(angle) * hexagon.size;

        if (i === 0) {
          context.moveTo(px, py);
        } else {
          context.lineTo(px, py);
        }
      }

      context.closePath();
      context.stroke();

      context.restore();
    });
  }

  drawWaves(context) {
    const { x, y } = this.wall;

    this.waves.forEach((wave) => {
      const scale = 1 + wave.progress * 0.8;

      context.save();

      context.globalAlpha = wave.alpha * this.wall.opacity;
      context.strokeStyle = this.colors.white;
      context.lineWidth = 1.5;
      context.shadowColor = this.colors.gold;
      context.shadowBlur = 8;

      context.beginPath();

      context.ellipse(
        x,
        y,
        Math.max(2, wave.width * 0.5 * scale),
        Math.max(2, wave.height * 0.5 * scale),
        0,
        0,
        Math.PI * 2
      );

      context.stroke();

      context.restore();
    });
  }

  drawSparks(context) {
    this.sparks.forEach((spark) => {
      context.save();

      context.globalAlpha = Math.max(0, spark.alpha);
      context.fillStyle = this.colors.white;
      context.shadowColor = this.colors.gold;
      context.shadowBlur = 6;

      context.beginPath();
      context.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2);
      context.fill();

      context.restore();
    });
  }

  drawActivationFlash(context) {
    if (this.activationFlash <= 0.02) return;

    context.save();

    context.globalAlpha = this.activationFlash * 0.35;
    context.fillStyle = this.colors.white;

    context.beginPath();
    context.arc(
      this.wall.x,
      this.wall.y,
      25 * (1 - this.activationFlash) + 5,
      0,
      Math.PI * 2
    );
    context.fill();

    context.restore();
  }
}
