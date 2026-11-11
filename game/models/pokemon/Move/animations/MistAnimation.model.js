export class MistAnimation {
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

    this.pokemon = this.pokemonViewer.sprite;

    this.phase = "EMIT";
    this.timer = 0;
    this.isFinished = false;

    this.duration = {
      EMIT: 35,
      ENVELOP: 65,
      PROTECT: 45,
      DISSIPATE: 35,
    };

    this.particles = [];
    this.mistWaves = [];

    this.initializeParticles();
  }

  initializeParticles() {
    const position = this.pokemon.position;
    const width = this.pokemon.frameWidth * this.pokemon.scale;
    const height = this.pokemon.frameHeight * this.pokemon.scale;

    this.centerX = position.x + width / 2;
    this.centerY = position.y + height / 2;

    this.radiusX = width * 0.85;
    this.radiusY = height * 0.8;

    // Particules de brume.
    for (let i = 0; i < 42; i++) {
      this.particles.push({
        angle: Math.random() * Math.PI * 2,
        radius: 0.4 + Math.random() * 0.8,
        speed: 0.008 + Math.random() * 0.012,
        size: 3 + Math.random() * 7,
        alpha: 0.15 + Math.random() * 0.3,
        offset: Math.random() * Math.PI * 2,
        height: Math.random(),
      });
    }

    // Volutes circulaires.
    for (let i = 0; i < 7; i++) {
      this.mistWaves.push({
        angle: ((Math.PI * 2) / 7) * i,
        radius: 0.35 + Math.random() * 0.25,
        speed: 0.012 + Math.random() * 0.01,
        size: 18 + Math.random() * 18,
        alpha: 0.2 + Math.random() * 0.15,
      });
    }
  }

  update(context) {
    if (this.isFinished) return;

    this.timer++;

    switch (this.phase) {
      case "EMIT":
        this.updateEmit();
        break;

      case "ENVELOP":
        this.updateEnvelop();
        break;

      case "PROTECT":
        this.updateProtect();
        break;

      case "DISSIPATE":
        this.updateDissipate();
        break;
    }

    this.draw(context);
  }

  updateEmit() {
    if (this.timer >= this.duration.EMIT) {
      this.nextPhase("ENVELOP");
    }
  }

  updateEnvelop() {
    this.updateParticles();
    this.updateMistWaves();

    if (this.timer >= this.duration.ENVELOP) {
      this.nextPhase("PROTECT");
    }
  }

  updateProtect() {
    this.updateParticles();
    this.updateMistWaves();

    if (this.timer >= this.duration.PROTECT) {
      this.nextPhase("DISSIPATE");
    }
  }

  updateDissipate() {
    this.updateParticles();
    this.updateMistWaves();

    if (this.timer >= this.duration.DISSIPATE) {
      this.isFinished = true;
    }
  }

  nextPhase(phase) {
    this.phase = phase;
    this.timer = 0;
  }

  updateParticles() {
    this.particles.forEach((particle) => {
      particle.angle += particle.speed;
      particle.offset += 0.025;
    });
  }

  updateMistWaves() {
    this.mistWaves.forEach((wave) => {
      wave.angle += wave.speed;
    });
  }

  getProgress() {
    return Math.min(this.timer / this.duration[this.phase], 1);
  }

  getOpacity() {
    const progress = this.getProgress();

    switch (this.phase) {
      case "EMIT":
        return progress;

      case "ENVELOP":
        return 1;

      case "PROTECT":
        return 0.85;

      case "DISSIPATE":
        return 1 - progress;

      default:
        return 0;
    }
  }

  draw(context) {
    const opacity = this.getOpacity();

    if (opacity <= 0) return;

    context.save();

    context.globalCompositeOperation = "source-over";

    this.drawGroundMist(context, opacity);
    this.drawMistClouds(context, opacity);
    this.drawMistWaves(context, opacity);
    this.drawParticles(context, opacity);

    if (this.phase === "PROTECT") {
      this.drawProtectiveAura(context, opacity);
    }

    if (this.phase === "DISSIPATE") {
      this.drawProtectiveAura(context, opacity * 0.35);
    }

    context.restore();
  }

  drawGroundMist(context, opacity) {
    const progress = this.getProgress();

    let scale = 1;

    if (this.phase === "EMIT") {
      scale = progress;
    }

    const gradient = context.createRadialGradient(
      this.centerX,
      this.centerY + this.radiusY * 0.65,
      2,
      this.centerX,
      this.centerY + this.radiusY * 0.65,
      this.radiusX * 1.3 * scale
    );

    gradient.addColorStop(0, `rgba(220, 250, 255, ${0.38 * opacity})`);
    gradient.addColorStop(0.5, `rgba(135, 210, 235, ${0.2 * opacity})`);
    gradient.addColorStop(1, "rgba(135, 210, 235, 0)");

    context.fillStyle = gradient;
    context.beginPath();

    context.ellipse(
      this.centerX,
      this.centerY + this.radiusY * 0.65,
      this.radiusX * 1.3 * scale,
      this.radiusY * 0.35 * scale,
      0,
      0,
      Math.PI * 2
    );

    context.fill();
  }

  drawMistClouds(context, opacity) {
    const time = this.timer;

    let envelopProgress = 1;

    if (this.phase === "EMIT") {
      envelopProgress = this.getProgress() * 0.45;
    } else if (this.phase === "ENVELOP") {
      envelopProgress = 0.45 + this.getProgress() * 0.55;
    }

    this.particles.forEach((particle, index) => {
      const angle = particle.angle + time * 0.005;

      const verticalMovement = Math.sin(time * 0.045 + particle.offset) * 8;

      const horizontalMovement = Math.cos(time * 0.035 + particle.offset) * 5;

      const x =
        this.centerX +
        Math.cos(angle) * this.radiusX * particle.radius * envelopProgress +
        horizontalMovement;

      const y =
        this.centerY +
        Math.sin(angle) * this.radiusY * particle.radius * envelopProgress +
        verticalMovement;

      const size = particle.size * (0.8 + envelopProgress * 0.5);

      const gradient = context.createRadialGradient(x, y, 1, x, y, size);

      gradient.addColorStop(
        0,
        `rgba(235, 252, 255, ${particle.alpha * opacity})`
      );

      gradient.addColorStop(
        0.45,
        `rgba(175, 225, 240, ${particle.alpha * 0.65 * opacity})`
      );

      gradient.addColorStop(1, "rgba(180, 235, 250, 0)");

      context.fillStyle = gradient;
      context.beginPath();
      context.arc(x, y, size, 0, Math.PI * 2);
      context.fill();
    });
  }

  drawMistWaves(context, opacity) {
    let scale = 1;

    if (this.phase === "EMIT") {
      scale = this.getProgress() * 0.5;
    } else if (this.phase === "ENVELOP") {
      scale = 0.5 + this.getProgress() * 0.5;
    }

    this.mistWaves.forEach((wave) => {
      const x =
        this.centerX +
        Math.cos(wave.angle) * this.radiusX * wave.radius * scale;

      const y =
        this.centerY +
        Math.sin(wave.angle) * this.radiusY * wave.radius * scale;

      context.save();

      context.translate(x, y);
      context.rotate(wave.angle);

      context.strokeStyle = `rgba(210, 247, 255, ${wave.alpha * opacity})`;
      context.lineWidth = 3;
      context.shadowColor = "rgba(125, 220, 255, 0.8)";
      context.shadowBlur = 12;

      context.beginPath();

      context.ellipse(
        0,
        0,
        wave.size * 1.5,
        wave.size * 0.55,
        0,
        0,
        Math.PI * 1.5
      );

      context.stroke();

      context.restore();
    });
  }

  drawParticles(context, opacity) {
    const time = this.timer;

    this.particles.forEach((particle, index) => {
      const angle = particle.angle * 2 + particle.offset;

      const x =
        this.centerX + Math.cos(angle) * this.radiusX * particle.radius * 0.8;

      const y =
        this.centerY + Math.sin(angle) * this.radiusY * particle.radius * 0.8;

      const pulse = 0.5 + Math.sin(time * 0.12 + index) * 0.5;

      context.fillStyle = `rgba(235, 255, 255, ${pulse * 0.7 * opacity})`;
      context.shadowColor = "#b8f2ff";
      context.shadowBlur = 9;

      context.beginPath();
      context.arc(x, y, 1.5 + pulse * 1.5, 0, Math.PI * 2);
      context.fill();
    });

    context.shadowBlur = 0;
  }

  drawProtectiveAura(context, opacity) {
    const pulse = 0.5 + Math.sin(this.timer * 0.12) * 0.5;

    const radiusX = this.radiusX * (1.05 + pulse * 0.06);
    const radiusY = this.radiusY * (1.05 + pulse * 0.06);

    const gradient = context.createRadialGradient(
      this.centerX,
      this.centerY,
      this.radiusY * 0.25,
      this.centerX,
      this.centerY,
      this.radiusX * 1.2
    );

    gradient.addColorStop(0, "rgba(190, 245, 255, 0)");
    gradient.addColorStop(0.7, `rgba(135, 220, 255, ${0.08 * opacity})`);
    gradient.addColorStop(1, `rgba(100, 200, 255, ${0.3 * opacity})`);

    context.fillStyle = gradient;

    context.beginPath();
    context.ellipse(
      this.centerX,
      this.centerY,
      radiusX,
      radiusY,
      0,
      0,
      Math.PI * 2
    );

    context.fill();

    context.strokeStyle = `rgba(205, 250, 255, ${0.65 * opacity})`;
    context.lineWidth = 2;
    context.shadowColor = "#8ceaff";
    context.shadowBlur = 15;

    context.beginPath();

    context.ellipse(
      this.centerX,
      this.centerY,
      radiusX,
      radiusY,
      0,
      0,
      Math.PI * 2
    );

    context.stroke();

    context.shadowBlur = 0;
  }
}
