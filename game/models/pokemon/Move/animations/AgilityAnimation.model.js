export class AgilityAnimation {
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

    this.originalPosition = {
      x: this.pokemon.position.x,
      y: this.pokemon.position.y,
    };

    this.phase = "RELAX";
    this.frame = 0;
    this.isFinished = false;

    this.duration = {
      RELAX: 16,
      FLOAT: 42,
      CHARGE: 42,
      BURST: 18,
      FINISH: 28,
    };

    this.totalFrames = 0;

    this.orbitParticles = [];
    this.speedLines = [];
    this.burstRings = [];
    this.sparks = [];

    this.orbitAngle = 0;
    this.orbitRadius = 9;
    this.orbitSpeed = 0.045;
    this.energy = 0;
    this.burstOpacity = 0;

    this.colors = {
      blue: "#35A9FF",
      cyan: "#8DEEFF",
      white: "#FFFFFF",
      paleBlue: "#D8F8FF",
      darkBlue: "#2876C8",
    };

    this.createOrbitParticles();
  }

  update(context) {
    if (this.isFinished) return;

    this.totalFrames++;

    switch (this.phase) {
      case "RELAX":
        this.updateRelax();
        break;

      case "FLOAT":
        this.updateFloat();
        break;

      case "CHARGE":
        this.updateCharge();
        break;

      case "BURST":
        this.updateBurst();
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

  createOrbitParticles() {
    for (let i = 0; i < 16; i++) {
      const angle = (Math.PI * 2 * i) / 16;

      this.orbitParticles.push({
        angle,
        radius: 12 + Math.random() * 9,
        size: 1.2 + Math.random() * 2,
        speed: 0.025 + Math.random() * 0.025,
        alpha: 0.4 + Math.random() * 0.5,
        offset: Math.random() * Math.PI * 2,
      });
    }
  }

  updateRelax() {
    const progress = this.getProgress();

    // Le Pokémon commence à se détendre.
    this.energy = progress * 0.12;

    // Légère inclinaison verticale avant de s'élever.
    this.pokemon.position.y =
      this.originalPosition.y + Math.sin(progress * Math.PI) * 2;

    if (Math.random() < 0.3) {
      this.createSpark();
    }

    this.frame++;

    if (this.frame >= this.duration.RELAX) {
      this.changePhase("FLOAT");
    }
  }

  updateFloat() {
    const progress = this.getProgress();

    // Élévation douce et progressive.
    const lift = Math.sin(progress * Math.PI * 0.5) * 13;

    // Oscillation légère donnant une impression de flottement.
    const oscillation = Math.sin(this.frame * 0.22) * 2.5;

    // Petit déplacement horizontal, comme si le corps était sans poids.
    const drift = Math.sin(progress * Math.PI * 2) * 5;

    this.pokemon.position.x = this.originalPosition.x + drift;
    this.pokemon.position.y = this.originalPosition.y - lift + oscillation;

    this.energy = 0.12 + progress * 0.18;
    this.orbitRadius = 11 + progress * 5;

    this.orbitAngle += 0.035;

    this.orbitParticles.forEach((particle) => {
      particle.angle += particle.speed * 1.5;
      particle.radius = this.orbitRadius;
      particle.alpha =
        0.35 + Math.sin(this.frame * 0.15 + particle.offset) * 0.2;
    });

    if (Math.random() < 0.3) {
      this.createSpark();
    }

    this.frame++;

    if (this.frame >= this.duration.FLOAT) {
      // Retour progressif à la position de départ avant la charge.
      this.pokemon.position.x = this.originalPosition.x;
      this.pokemon.position.y = this.originalPosition.y;

      this.changePhase("CHARGE");
    }
  }

  updatePrepare() {
    const progress = this.getProgress();

    this.energy = progress * 0.25;
    this.orbitRadius = 9 + progress * 5;

    this.orbitParticles.forEach((particle) => {
      particle.alpha = 0.25 + progress * 0.45;
    });

    this.frame++;

    if (this.frame >= this.duration.PREPARE) {
      this.changePhase("CHARGE");
    }
  }

  updateCharge() {
    const progress = this.getProgress();

    this.energy = 0.25 + progress * 0.75;
    this.orbitRadius = 14 + progress * 19;
    this.orbitSpeed = 0.055 + progress * 0.18;

    this.orbitAngle += this.orbitSpeed;

    this.orbitParticles.forEach((particle, index) => {
      particle.angle += particle.speed * (1 + progress * 5);

      particle.radius =
        this.orbitRadius + Math.sin(this.frame * 0.12 + particle.offset) * 4;

      particle.alpha = 0.45 + Math.sin(this.frame * 0.2 + index) * 0.3;
    });

    if (Math.random() < 0.35 + progress * 0.4) {
      this.createSpark();
    }

    if (Math.random() < 0.18 + progress * 0.5) {
      this.createSpeedLine();
    }

    this.frame++;

    if (this.frame >= this.duration.CHARGE) {
      this.createBurst();
      this.changePhase("BURST");
    }
  }

  updateBurst() {
    const progress = this.getProgress();

    this.burstOpacity = 1 - progress;
    this.energy = 1 - progress * 0.5;

    this.burstRings.forEach((ring) => {
      ring.radius += ring.speed;
      ring.alpha = Math.max(0, 1 - ring.radius / ring.maxRadius);
    });

    this.orbitParticles.forEach((particle) => {
      particle.alpha *= 0.88;
    });

    this.frame++;

    if (this.frame >= this.duration.BURST) {
      this.changePhase("FINISH");
    }
  }

  updateFinish() {
    this.energy *= 0.94;
    this.burstOpacity *= 0.9;

    this.orbitParticles.forEach((particle) => {
      particle.alpha *= 0.91;
    });

    this.frame++;

    if (this.frame >= this.duration.FINISH) {
      this.pokemon.position.x = this.originalPosition.x;
      this.pokemon.position.y = this.originalPosition.y;

      this.isFinished = true;
    }
  }

  createBurst() {
    for (let i = 0; i < 5; i++) {
      this.burstRings.push({
        radius: 8 + i * 3,
        maxRadius: 58 + i * 8,
        speed: 4 + i * 0.8,
        alpha: 1,
        width: 1.5 + Math.random(),
        angle: (Math.PI * 2 * i) / 5,
      });
    }

    for (let i = 0; i < 32; i++) {
      this.createSpark(true);
    }

    for (let i = 0; i < 12; i++) {
      this.createSpeedLine(true);
    }

    if (this.game.canvas?.startShake) {
      this.game.canvas.startShake(3, 100);
    }
  }

  createSpark(burst = false) {
    const angle = Math.random() * Math.PI * 2;
    const distance = burst ? 8 : this.orbitRadius;

    this.sparks.push({
      x: this.center.x + Math.cos(angle) * distance,
      y: this.center.y + Math.sin(angle) * distance,
      vx: Math.cos(angle) * (burst ? 1.5 + Math.random() * 3 : 0.5),
      vy: Math.sin(angle) * (burst ? 1.5 + Math.random() * 3 : 0.5),
      size: 1 + Math.random() * 2,
      alpha: 1,
      life: burst ? 18 + Math.random() * 12 : 12 + Math.random() * 12,
    });
  }

  createSpeedLine(burst = false) {
    const angle = Math.random() * Math.PI * 2;
    const radius = burst ? 10 : this.orbitRadius;

    this.speedLines.push({
      angle,
      radius,
      length: burst ? 12 + Math.random() * 18 : 5 + Math.random() * 10,
      alpha: 0.8 + Math.random() * 0.2,
      speed: burst ? 3 + Math.random() * 3 : 1 + Math.random() * 2,
      life: burst ? 16 : 12,
    });
  }

  updateParticles() {
    this.sparks = this.sparks.filter((spark) => spark.life > 0);

    this.sparks.forEach((spark) => {
      spark.x += spark.vx;
      spark.y += spark.vy;
      spark.vx *= 0.96;
      spark.vy *= 0.96;
      spark.alpha = spark.life / 24;
      spark.life--;
    });

    this.speedLines = this.speedLines.filter((line) => line.life > 0);

    this.speedLines.forEach((line) => {
      line.radius += line.speed;
      line.alpha *= 0.9;
      line.life--;
    });

    this.burstRings = this.burstRings.filter((ring) => ring.alpha > 0.03);
  }

  draw(context) {
    context.save();

    this.drawBurstRings(context);
    this.drawSpeedLines(context);
    this.drawOrbitParticles(context);
    this.drawSparks(context);
    this.drawEnergyAura(context);

    context.restore();
  }

  drawEnergyAura(context) {
    if (this.energy <= 0.01) return;

    const radius = 17 + this.energy * 13;
    const pulse = 1 + Math.sin(this.totalFrames * 0.25) * 0.08;

    context.save();

    const gradient = context.createRadialGradient(
      this.center.x,
      this.center.y,
      2,
      this.center.x,
      this.center.y,
      radius * pulse
    );

    gradient.addColorStop(0, `rgba(141, 238, 255, ${0.12 * this.energy})`);
    gradient.addColorStop(0.55, `rgba(53, 169, 255, ${0.1 * this.energy})`);
    gradient.addColorStop(1, "rgba(53, 169, 255, 0)");

    context.fillStyle = gradient;
    context.beginPath();
    context.arc(this.center.x, this.center.y, radius * pulse, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }

  drawOrbitParticles(context) {
    this.orbitParticles.forEach((particle) => {
      if (particle.alpha <= 0.02) return;

      const x = this.center.x + Math.cos(particle.angle) * particle.radius;

      const y =
        this.center.y + Math.sin(particle.angle) * particle.radius * 0.72;

      context.save();

      context.globalAlpha = Math.max(0, particle.alpha);
      context.fillStyle = this.colors.cyan;
      context.shadowColor = this.colors.blue;
      context.shadowBlur = 5;

      context.beginPath();
      context.arc(x, y, particle.size, 0, Math.PI * 2);
      context.fill();

      context.restore();
    });
  }

  drawSpeedLines(context) {
    this.speedLines.forEach((line) => {
      const x = this.center.x + Math.cos(line.angle) * line.radius;
      const y = this.center.y + Math.sin(line.angle) * line.radius * 0.72;

      const endX = x + Math.cos(line.angle) * line.length;
      const endY = y + Math.sin(line.angle) * line.length * 0.72;

      context.save();

      context.globalAlpha = Math.max(0, line.alpha);
      context.strokeStyle = this.colors.paleBlue;
      context.lineWidth = 1.5;
      context.shadowColor = this.colors.blue;
      context.shadowBlur = 4;

      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(endX, endY);
      context.stroke();

      context.restore();
    });
  }

  drawBurstRings(context) {
    this.burstRings.forEach((ring) => {
      context.save();

      context.globalAlpha = Math.max(0, ring.alpha);
      context.strokeStyle = this.colors.cyan;
      context.lineWidth = ring.width;
      context.shadowColor = this.colors.blue;
      context.shadowBlur = 7;

      context.beginPath();
      context.ellipse(
        this.center.x,
        this.center.y,
        ring.radius,
        ring.radius * 0.68,
        ring.angle,
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
      context.shadowColor = this.colors.cyan;
      context.shadowBlur = 6;

      context.beginPath();
      context.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2);
      context.fill();

      context.restore();
    });
  }
}
