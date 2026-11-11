export class HazeAnimation {
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

    this.direction = this.target.position.x > this.attacker.position.x ? 1 : -1;

    this.phase = "INVOCATION";
    this.timer = 0;
    this.isFinished = false;

    this.durations = {
      INVOCATION: 60,
      PROPAGATION: 55,
      CONTAMINATION: 90,
      DISSIPATION: 45,
    };

    this.clouds = [];
    this.particles = [];
    this.lightning = [];

    this.initializeEffect();
  }

  initializeEffect() {
    const attackerWidth = this.attacker.frameWidth * this.attacker.scale;
    const attackerHeight = this.attacker.frameHeight * this.attacker.scale;

    const targetWidth = this.target.frameWidth * this.target.scale;
    const targetHeight = this.target.frameHeight * this.target.scale;

    this.attackerCenter = {
      x: this.attacker.position.x + attackerWidth / 2,
      y: this.attacker.position.y + attackerHeight / 2,
    };

    this.targetCenter = {
      x: this.target.position.x + targetWidth / 2,
      y: this.target.position.y + targetHeight / 2,
    };

    this.midX = (this.attackerCenter.x + this.targetCenter.x) / 2;
    this.midY = (this.attackerCenter.y + this.targetCenter.y) / 2;

    this.startX = this.attackerCenter.x;
    this.endX = this.targetCenter.x;

    this.distance = Math.abs(this.endX - this.startX);

    this.groundY = Math.max(
      this.attacker.position.y + attackerHeight * 0.88,
      this.target.position.y + targetHeight * 0.88
    );

    // Nuages de fumée.
    for (let i = 0; i < 38; i++) {
      this.clouds.push({
        x: this.attackerCenter.x,
        y: this.attackerCenter.y,
        offsetX: (Math.random() - 0.5) * 60,
        offsetY: (Math.random() - 0.5) * 55,
        size: 12 + Math.random() * 25,
        speed: 0.5 + Math.random() * 1.2,
        rotation: Math.random() * Math.PI * 2,
        alpha: 0.25 + Math.random() * 0.35,
        phase: Math.random() * Math.PI * 2,
      });
    }

    // Particules violettes.
    for (let i = 0; i < 35; i++) {
      this.particles.push({
        x: this.attackerCenter.x,
        y: this.attackerCenter.y,
        offsetX: (Math.random() - 0.5) * 100,
        offsetY: (Math.random() - 0.5) * 80,
        size: 1.5 + Math.random() * 3,
        speed: 0.02 + Math.random() * 0.04,
        angle: Math.random() * Math.PI * 2,
        alpha: 0.3 + Math.random() * 0.5,
      });
    }

    // Éclairs violets.
    for (let i = 0; i < 9; i++) {
      this.lightning.push({
        x: this.midX,
        y: this.midY,
        life: 0,
        maxLife: 8 + Math.random() * 8,
        delay: Math.random() * 30,
        length: 12 + Math.random() * 25,
        angle: Math.random() * Math.PI * 2,
      });
    }
  }

  update(context) {
    if (this.isFinished) return;

    this.timer++;

    switch (this.phase) {
      case "INVOCATION":
        this.updateInvocation();
        break;

      case "PROPAGATION":
        this.updatePropagation();
        break;

      case "CONTAMINATION":
        this.updateContamination();
        break;

      case "DISSIPATION":
        this.updateDissipation();
        break;
    }

    this.draw(context);
  }

  updateInvocation() {
    this.updateClouds();

    if (this.timer >= this.durations.INVOCATION) {
      this.nextPhase("PROPAGATION");
    }
  }

  updatePropagation() {
    this.updateClouds();
    this.updateParticles();

    if (this.timer >= this.durations.PROPAGATION) {
      this.nextPhase("CONTAMINATION");
    }
  }

  updateContamination() {
    this.updateClouds();
    this.updateParticles();
    this.updateLightning();

    if (this.timer >= this.durations.CONTAMINATION) {
      this.nextPhase("DISSIPATION");
    }
  }

  updateDissipation() {
    this.updateClouds();
    this.updateParticles();

    if (this.timer >= this.durations.DISSIPATION) {
      this.isFinished = true;
    }
  }

  nextPhase(phase) {
    this.phase = phase;
    this.timer = 0;
  }

  updateClouds() {
    const progress = this.getPropagationProgress();

    this.clouds.forEach((cloud, index) => {
      const wave = Math.sin(this.timer * 0.07 + cloud.phase);

      if (this.phase === "INVOCATION") {
        cloud.x = this.attackerCenter.x + cloud.offsetX * 0.5;
        cloud.y = this.attackerCenter.y + cloud.offsetY * 0.5;
      } else if (
        this.phase === "PROPAGATION" ||
        this.phase === "CONTAMINATION"
      ) {
        const spread = this.phase === "CONTAMINATION" ? 1 : progress;

        cloud.x =
          this.startX +
          (this.endX - this.startX) * spread * (index / this.clouds.length) +
          cloud.offsetX * 0.35;

        cloud.y = this.midY + cloud.offsetY * 0.7 + wave * 12;
      } else {
        cloud.x += Math.cos(cloud.phase + this.timer * 0.04) * 1.5;
        cloud.y -= cloud.speed * 0.8;
      }

      cloud.rotation += 0.015 * cloud.speed;
    });
  }

  updateParticles() {
    this.particles.forEach((particle) => {
      particle.angle += particle.speed;

      particle.x += Math.cos(particle.angle) * 0.8;
      particle.y += Math.sin(particle.angle) * 0.8;
    });
  }

  updateLightning() {
    this.lightning.forEach((bolt) => {
      if (this.timer > bolt.delay) {
        bolt.life++;

        if (bolt.life > bolt.maxLife) {
          bolt.life = 0;
          bolt.delay = this.timer + 5 + Math.random() * 15;
          bolt.angle = Math.random() * Math.PI * 2;
        }
      }
    });
  }

  getProgress() {
    return Math.min(this.timer / this.durations[this.phase], 1);
  }

  getPropagationProgress() {
    return this.getProgress();
  }

  getOpacity() {
    const progress = this.getProgress();

    switch (this.phase) {
      case "INVOCATION":
        return progress;

      case "PROPAGATION":
      case "CONTAMINATION":
        return 1;

      case "DISSIPATION":
        return 1 - progress;

      default:
        return 0;
    }
  }

  draw(context) {
    const opacity = this.getOpacity();

    if (opacity <= 0) return;

    context.save();

    this.drawGroundSmoke(context, opacity);
    this.drawClouds(context, opacity);
    this.drawPurpleParticles(context, opacity);

    if (this.phase === "CONTAMINATION") {
      this.drawLightning(context, opacity);
      this.drawDarkPulse(context, opacity);
    }

    context.restore();
  }

  drawGroundSmoke(context, opacity) {
    let progress = 1;

    if (this.phase === "INVOCATION") {
      progress = this.getProgress();
    } else if (this.phase === "PROPAGATION") {
      progress = this.getProgress();
    }

    const width = this.distance * progress + 35;

    const gradient = context.createLinearGradient(
      this.startX,
      this.groundY,
      this.endX,
      this.groundY
    );

    gradient.addColorStop(0, `rgba(35, 20, 55, ${0.45 * opacity})`);

    gradient.addColorStop(0.5, `rgba(55, 25, 80, ${0.3 * opacity})`);

    gradient.addColorStop(1, `rgba(25, 15, 40, ${0.45 * opacity})`);

    context.fillStyle = gradient;

    context.beginPath();

    context.ellipse(
      this.midX,
      this.groundY,
      width / 2,
      18 + Math.sin(this.timer * 0.1) * 5,
      0,
      0,
      Math.PI * 2
    );

    context.fill();
  }

  drawClouds(context, opacity) {
    this.clouds.forEach((cloud, index) => {
      const pulse = 0.75 + Math.sin(this.timer * 0.08 + cloud.phase) * 0.25;

      const alpha = cloud.alpha * opacity * pulse;

      const gradient = context.createRadialGradient(
        cloud.x,
        cloud.y,
        1,
        cloud.x,
        cloud.y,
        cloud.size
      );

      gradient.addColorStop(0, `rgba(22, 13, 35, ${alpha})`);

      gradient.addColorStop(0.45, `rgba(65, 30, 95, ${alpha * 0.75})`);

      gradient.addColorStop(0.8, `rgba(100, 45, 135, ${alpha * 0.25})`);

      gradient.addColorStop(1, "rgba(60, 20, 90, 0)");

      context.fillStyle = gradient;

      context.beginPath();

      context.ellipse(
        cloud.x,
        cloud.y,
        cloud.size * 1.25,
        cloud.size * 0.85,
        cloud.rotation,
        0,
        Math.PI * 2
      );

      context.fill();
    });
  }

  drawPurpleParticles(context, opacity) {
    this.particles.forEach((particle, index) => {
      const pulse = 0.5 + Math.sin(this.timer * 0.15 + index) * 0.5;

      context.fillStyle = `rgba(190, 110, 255, ${
        particle.alpha * pulse * opacity
      })`;

      context.shadowColor = "#a64dff";
      context.shadowBlur = 10;

      context.beginPath();

      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);

      context.fill();
    });

    context.shadowBlur = 0;
  }

  drawLightning(context, opacity) {
    this.lightning.forEach((bolt) => {
      if (bolt.life <= 0) return;

      const intensity = 1 - bolt.life / bolt.maxLife;

      context.save();

      context.translate(bolt.x, bolt.y);
      context.rotate(bolt.angle);

      context.strokeStyle = `rgba(210, 140, 255, ${intensity * opacity})`;

      context.lineWidth = 2;
      context.shadowColor = "#b65cff";
      context.shadowBlur = 12;

      context.beginPath();
      context.moveTo(-bolt.length / 2, 0);
      context.lineTo(-bolt.length / 4, -5);
      context.lineTo(0, 4);
      context.lineTo(bolt.length / 4, -5);
      context.lineTo(bolt.length / 2, 0);
      context.stroke();

      context.restore();
    });
  }

  drawDarkPulse(context, opacity) {
    const pulse = 0.5 + Math.sin(this.timer * 0.25) * 0.5;

    const gradient = context.createRadialGradient(
      this.midX,
      this.midY,
      5,
      this.midX,
      this.midY,
      this.distance * 0.6
    );

    gradient.addColorStop(0, `rgba(45, 15, 65, ${0.25 * pulse * opacity})`);

    gradient.addColorStop(0.7, `rgba(75, 25, 105, ${0.12 * pulse * opacity})`);

    gradient.addColorStop(1, "rgba(35, 10, 55, 0)");

    context.fillStyle = gradient;

    context.beginPath();

    context.ellipse(
      this.midX,
      this.midY,
      this.distance * 0.6,
      65,
      0,
      0,
      Math.PI * 2
    );

    context.fill();
  }
}
