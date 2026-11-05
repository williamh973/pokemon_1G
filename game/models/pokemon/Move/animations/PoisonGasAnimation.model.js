export class PoisonGasAnimation {
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

    this.phase = "PREPARE";
    this.timer = 0;
    this.isFinished = false;

    this.centerX = 0;
    this.centerY = 0;

    this.startX = 0;
    this.startY = 0;

    this.clouds = [];
    this.particles = [];
    this.bubbles = [];
    this.gasWaves = [];

    this.intensity = 0;
    this.expansion = 0;
    this.flashOpacity = 0;
    this.rotation = 0;

    this.initializeClouds();
  }

  initializeClouds() {
    for (let i = 0; i < 18; i++) {
      this.clouds.push({
        x: 0,
        y: 0,
        offsetX: (Math.random() - 0.5) * 50,
        offsetY: (Math.random() - 0.5) * 40,
        size: 8 + Math.random() * 16,
        speed: 0.008 + Math.random() * 0.018,
        phase: Math.random() * Math.PI * 2,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.025,
        alpha: 0.25 + Math.random() * 0.25,
        layer: Math.random(),
      });
    }
  }

  update(context) {
    if (this.isFinished) return;

    this.timer++;
    this.rotation += 0.025;

    this.updatePositions();
    this.updateParticles();

    switch (this.phase) {
      case "PREPARE":
        this.updatePrepare();
        break;

      case "RELEASE":
        this.updateRelease();
        break;

      case "EXPANSION":
        this.updateExpansion();
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

  updatePositions() {
    const attacker = this.pokemonViewer.sprite;
    const target = this.targetViewer.sprite;

    this.startX = attacker.position.x + attacker.frameWidth / 2;
    this.startY = attacker.position.y + attacker.frameHeight / 2;

    this.centerX = target.position.x + target.frameWidth / 2;
    this.centerY = target.position.y + target.frameHeight / 2;
  }

  updatePrepare() {
    this.intensity = Math.min(1, this.timer / 25);

    if (this.timer % 3 === 0) {
      this.createParticle(this.startX, this.startY);
    }

    if (this.timer >= 25) {
      this.phase = "RELEASE";
      this.timer = 0;
    }
  }

  updateRelease() {
    this.intensity = Math.min(1, this.intensity + 0.04);

    if (this.timer % 2 === 0) {
      this.createGasParticle();
    }

    if (this.timer >= 30) {
      this.phase = "EXPANSION";
      this.timer = 0;
    }
  }

  updateExpansion() {
    this.expansion = Math.min(1, this.expansion + 0.025);
    this.intensity = 1;

    if (this.timer % 2 === 0) {
      this.createGasParticle();
    }

    if (this.timer % 5 === 0) {
      this.createBubble();
    }

    if (this.timer >= 40) {
      this.phase = "CONTAMINATION";
      this.timer = 0;
    }
  }

  updateContamination() {
    this.intensity = 1;
    this.expansion = 1;

    if (this.timer % 3 === 0) {
      this.createGasParticle();
    }

    if (this.timer % 8 === 0) {
      this.createBubble();
    }

    if (this.timer % 15 === 0) {
      this.createGasWave();
    }

    if (this.timer >= 90) {
      this.phase = "DISSIPATION";
      this.timer = 0;
    }
  }

  updateDissipation() {
    this.intensity = Math.max(0, this.intensity - 0.025);

    this.expansion = Math.min(1.2, this.expansion + 0.002);

    if (this.timer >= 45) {
      this.isFinished = true;
    }
  }

  createParticle(x, y) {
    this.particles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 1.5,
      vy: -0.5 - Math.random() * 1.5,
      size: 3 + Math.random() * 6,
      life: 25 + Math.random() * 20,
      maxLife: 45,
      color: Math.random() > 0.5 ? "#9c37c6" : "#b7e83e",
    });
  }

  createGasParticle() {
    const angle = Math.random() * Math.PI * 2;

    const radiusX = 15 + Math.random() * 20;
    const radiusY = 10 + Math.random() * 15;

    const x = this.centerX + Math.cos(angle) * radiusX;
    const y = this.centerY + Math.sin(angle) * radiusY;

    const particle = {
      x,
      y,
      vx: (Math.random() - 0.5) * 1.2,
      vy: -0.4 - Math.random() * 1.2,
      size: 5 + Math.random() * 10,
      life: 35 + Math.random() * 35,
      maxLife: 70,
      color: Math.random() > 0.7 ? "#a8dc35" : "#9636b7",
      wobble: Math.random() * Math.PI * 2,
    };

    this.particles.push(particle);
  }

  createBubble() {
    this.bubbles.push({
      x: this.centerX + (Math.random() - 0.5) * 60,
      y: this.centerY + (Math.random() - 0.5) * 45,
      vx: (Math.random() - 0.5) * 0.6,
      vy: -0.7 - Math.random(),
      size: 2 + Math.random() * 4,
      life: 30 + Math.random() * 20,
      maxLife: 50,
      wobble: Math.random() * Math.PI * 2,
    });
  }

  createGasWave() {
    this.gasWaves.push({
      radius: 10,
      maxRadius: 55 + Math.random() * 25,
      life: 35,
      maxLife: 35,
      rotation: Math.random() * Math.PI * 2,
    });
  }

  updateParticles() {
    this.clouds.forEach((cloud) => {
      cloud.phase += cloud.speed;
      cloud.rotation += cloud.rotationSpeed;

      cloud.x =
        this.centerX +
        cloud.offsetX * this.expansion +
        Math.sin(cloud.phase) * 5;

      cloud.y =
        this.centerY +
        cloud.offsetY * this.expansion +
        Math.cos(cloud.phase * 0.8) * 4;
    });

    this.particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      particle.vx += (Math.random() - 0.5) * 0.04;
      particle.vy *= 0.99;

      if (particle.wobble !== undefined) {
        particle.wobble += 0.1;
      }

      particle.life--;
    });

    this.particles = this.particles.filter((particle) => particle.life > 0);

    this.bubbles.forEach((bubble) => {
      bubble.x += bubble.vx;
      bubble.y += bubble.vy;
      bubble.wobble += 0.12;
      bubble.life--;
    });

    this.bubbles = this.bubbles.filter((bubble) => bubble.life > 0);

    this.gasWaves.forEach((wave) => {
      wave.radius += (wave.maxRadius - wave.radius) * 0.1;
      wave.life--;
    });

    this.gasWaves = this.gasWaves.filter((wave) => wave.life > 0);
  }

  draw(context) {
    context.save();

    this.drawGasAura(context);
    this.drawGasWaves(context);
    this.drawClouds(context);
    this.drawParticles(context);
    this.drawBubbles(context);

    context.restore();
  }

  drawGasAura(context) {
    if (this.intensity <= 0) return;

    const pulse = 1 + Math.sin(this.rotation * 3) * 0.06;

    const radiusX =
      this.targetViewer.sprite.frameWidth * 1.5 * this.expansion * pulse;

    const radiusY =
      this.targetViewer.sprite.frameHeight * 1.3 * this.expansion * pulse;

    context.save();

    context.globalAlpha = this.intensity * 0.3;

    const gradient = context.createRadialGradient(
      this.centerX,
      this.centerY,
      2,
      this.centerX,
      this.centerY,
      radiusX
    );

    gradient.addColorStop(0, "rgba(130, 30, 170, 0.65)");
    gradient.addColorStop(0.5, "rgba(100, 30, 140, 0.3)");
    gradient.addColorStop(1, "rgba(80, 0, 110, 0)");

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
    context.restore();
  }

  drawGasWaves(context) {
    this.gasWaves.forEach((wave) => {
      context.save();

      context.globalAlpha = (wave.life / wave.maxLife) * this.intensity * 0.5;

      context.strokeStyle = "#a64bc3";
      context.lineWidth = 2;
      context.shadowColor = "#a020d0";
      context.shadowBlur = 10;

      context.translate(this.centerX, this.centerY);
      context.rotate(wave.rotation);

      context.beginPath();
      context.ellipse(0, 0, wave.radius, wave.radius * 0.6, 0, 0, Math.PI * 2);

      context.stroke();
      context.restore();
    });
  }

  drawClouds(context) {
    if (this.intensity <= 0) return;

    this.clouds.forEach((cloud) => {
      const size = cloud.size * this.expansion;

      context.save();

      context.translate(cloud.x, cloud.y);
      context.rotate(cloud.rotation);

      context.globalAlpha = cloud.alpha * this.intensity * this.expansion;

      const gradient = context.createRadialGradient(
        -size * 0.2,
        -size * 0.2,
        1,
        0,
        0,
        size
      );

      gradient.addColorStop(0, "rgba(180, 90, 210, 0.9)");
      gradient.addColorStop(0.45, "rgba(120, 40, 160, 0.7)");
      gradient.addColorStop(1, "rgba(70, 0, 100, 0)");

      context.fillStyle = gradient;

      context.shadowColor = "#8e29b0";
      context.shadowBlur = 12;

      context.beginPath();

      context.ellipse(0, 0, size * 1.2, size * 0.8, 0, 0, Math.PI * 2);

      context.fill();

      context.restore();
    });
  }

  drawParticles(context) {
    this.particles.forEach((particle) => {
      context.save();

      context.globalAlpha =
        Math.max(0, particle.life / particle.maxLife) * this.intensity;

      context.fillStyle = particle.color;
      context.shadowColor = particle.color;
      context.shadowBlur = 12;

      context.beginPath();

      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);

      context.fill();

      context.restore();
    });
  }

  drawBubbles(context) {
    this.bubbles.forEach((bubble) => {
      context.save();

      context.globalAlpha = Math.min(1, bubble.life / 12) * this.intensity;

      context.fillStyle = "#a7e83d";
      context.strokeStyle = "#e0ff9a";
      context.lineWidth = 1;

      context.shadowColor = "#8cff00";
      context.shadowBlur = 8;

      context.beginPath();

      context.arc(
        bubble.x + Math.sin(bubble.wobble) * 2,
        bubble.y,
        bubble.size,
        0,
        Math.PI * 2
      );

      context.fill();
      context.stroke();

      context.restore();
    });
  }
}
