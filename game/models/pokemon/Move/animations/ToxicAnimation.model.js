export class ToxicAnimation {
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

    this.radiusX = 0;
    this.radiusY = 0;

    this.intensity = 0;
    this.flashOpacity = 0;
    this.pulse = 0;

    this.clouds = [];
    this.bubbles = [];
    this.particles = [];
    this.rings = [];

    this.initializeClouds();
  }

  initializeClouds() {
    for (let i = 0; i < 12; i++) {
      this.clouds.push({
        angle: Math.random() * Math.PI * 2,
        radius: 0.5 + Math.random() * 0.8,
        size: 8 + Math.random() * 12,
        speed: 0.008 + Math.random() * 0.012,
        offset: Math.random() * Math.PI * 2,
        alpha: 0.3 + Math.random() * 0.3,
      });
    }
  }

  update(context) {
    if (this.isFinished) return;

    this.timer++;
    this.pulse += 0.08;

    this.updateTargetPosition();
    this.updateParticles();

    switch (this.phase) {
      case "PREPARE":
        this.updatePrepare();
        break;

      case "CONTAMINATION":
        this.updateContamination();
        break;

      case "INFILTRATION":
        this.updateInfiltration();
        break;

      case "FINISH":
        this.updateFinish();
        break;
    }

    this.draw(context);
  }

  updateTargetPosition() {
    const sprite = this.targetViewer.sprite;

    this.centerX = sprite.position.x + sprite.frameWidth / 2;

    this.centerY = sprite.position.y + sprite.frameHeight / 2;

    this.radiusX = Math.max(25, sprite.frameWidth * 0.8);
    this.radiusY = Math.max(20, sprite.frameHeight * 0.65);
  }

  updatePrepare() {
    this.intensity = Math.min(1, this.timer / 30);

    if (this.timer % 5 === 0) {
      this.createBubble();
    }

    if (this.timer >= 30) {
      this.phase = "CONTAMINATION";
      this.timer = 0;
    }
  }

  updateContamination() {
    this.intensity = Math.min(1, this.intensity + 0.025);

    if (this.timer % 3 === 0) {
      this.createCloud();
      this.createBubble();
    }

    if (this.timer % 5 === 0) {
      this.createParticle();
    }

    if (this.timer >= 75) {
      this.phase = "INFILTRATION";
      this.timer = 0;
    }
  }

  updateInfiltration() {
    this.intensity = 1;

    if (this.timer % 3 === 0) {
      this.createParticle();
    }

    if (this.timer % 6 === 0) {
      this.createRing();
      this.createBubble();
    }

    if (this.timer >= 60) {
      this.phase = "FINISH";
      this.timer = 0;
      this.flashOpacity = 0.45;
    }
  }

  updateFinish() {
    this.intensity = Math.max(0, this.intensity - 0.025);
    this.flashOpacity = Math.max(0, this.flashOpacity - 0.035);

    if (this.timer >= 45) {
      this.isFinished = true;
    }
  }

  createCloud() {
    const angle = Math.random() * Math.PI * 2;

    this.clouds.push({
      angle,
      radius: 0.6 + Math.random() * 0.8,
      size: 8 + Math.random() * 14,
      speed: 0.008 + Math.random() * 0.015,
      offset: Math.random() * Math.PI * 2,
      alpha: 0.3 + Math.random() * 0.3,
      life: 45 + Math.random() * 35,
      maxLife: 80,
    });
  }

  createBubble() {
    const angle = Math.random() * Math.PI * 2;

    this.bubbles.push({
      x: this.centerX + Math.cos(angle) * this.radiusX,
      y: this.centerY + Math.sin(angle) * this.radiusY,
      vx: (Math.random() - 0.5) * 1.5,
      vy: -0.8 - Math.random() * 1.2,
      size: 2 + Math.random() * 4,
      life: 30 + Math.random() * 25,
      maxLife: 55,
      wobble: Math.random() * Math.PI * 2,
    });
  }

  createParticle() {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * this.radiusX;

    this.particles.push({
      x: this.centerX + Math.cos(angle) * distance,
      y: this.centerY + Math.sin(angle) * distance * 0.6,
      vx: (Math.random() - 0.5) * 1.2,
      vy: (Math.random() - 0.5) * 1.2,
      size: 1 + Math.random() * 3,
      life: 20 + Math.random() * 20,
      maxLife: 40,
    });
  }

  createRing() {
    this.rings.push({
      radius: 5,
      maxRadius: this.radiusX * 1.4,
      life: 35,
      maxLife: 35,
      rotation: Math.random() * Math.PI,
    });
  }

  updateParticles() {
    this.clouds.forEach((cloud) => {
      cloud.angle += cloud.speed;
      cloud.offset += 0.04;

      if (cloud.life !== undefined) {
        cloud.life--;
      }
    });

    this.clouds = this.clouds.filter(
      (cloud) => cloud.life === undefined || cloud.life > 0
    );

    this.bubbles.forEach((bubble) => {
      bubble.x += bubble.vx;
      bubble.y += bubble.vy;
      bubble.vy -= 0.015;
      bubble.wobble += 0.12;
      bubble.life--;
    });

    this.bubbles = this.bubbles.filter((bubble) => bubble.life > 0);

    this.particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life--;
    });

    this.particles = this.particles.filter((particle) => particle.life > 0);

    this.rings.forEach((ring) => {
      ring.radius += (ring.maxRadius - ring.radius) * 0.12;
      ring.life--;
    });

    this.rings = this.rings.filter((ring) => ring.life > 0);
  }

  draw(context) {
    context.save();

    this.drawToxicAura(context);
    this.drawClouds(context);
    this.drawRings(context);
    this.drawBubbles(context);
    this.drawParticles(context);
    this.drawFlash(context);

    context.restore();
  }

  drawToxicAura(context) {
    if (this.intensity <= 0) return;

    const pulse = 1 + Math.sin(this.pulse) * 0.1;

    context.save();

    context.globalAlpha = this.intensity * 0.35;

    const gradient = context.createRadialGradient(
      this.centerX,
      this.centerY,
      2,
      this.centerX,
      this.centerY,
      this.radiusX * 1.8 * pulse
    );

    gradient.addColorStop(0, "rgba(130, 20, 190, 0.65)");
    gradient.addColorStop(0.45, "rgba(110, 30, 160, 0.35)");
    gradient.addColorStop(1, "rgba(70, 0, 100, 0)");

    context.fillStyle = gradient;

    context.beginPath();
    context.ellipse(
      this.centerX,
      this.centerY,
      this.radiusX * 1.8 * pulse,
      this.radiusY * 1.8 * pulse,
      0,
      0,
      Math.PI * 2
    );

    context.fill();
    context.restore();
  }

  drawClouds(context) {
    this.clouds.forEach((cloud) => {
      const x =
        this.centerX + Math.cos(cloud.angle) * this.radiusX * cloud.radius;

      const y =
        this.centerY +
        Math.sin(cloud.angle) * this.radiusY * cloud.radius -
        Math.sin(cloud.offset) * 5;

      const alpha =
        cloud.alpha *
        this.intensity *
        (cloud.life !== undefined ? cloud.life / cloud.maxLife : 1);

      context.save();

      context.globalAlpha = Math.max(0, alpha);

      const gradient = context.createRadialGradient(x, y, 1, x, y, cloud.size);

      gradient.addColorStop(0, "#b52de0");
      gradient.addColorStop(0.5, "#7213a5");
      gradient.addColorStop(1, "rgba(70, 0, 100, 0)");

      context.fillStyle = gradient;
      context.shadowColor = "#a020d0";
      context.shadowBlur = 12;

      context.beginPath();
      context.arc(x, y, cloud.size, 0, Math.PI * 2);
      context.fill();

      context.restore();
    });
  }

  drawRings(context) {
    this.rings.forEach((ring) => {
      context.save();

      context.globalAlpha = ring.life / ring.maxLife;

      context.translate(this.centerX, this.centerY);
      context.rotate(ring.rotation);

      context.strokeStyle = "#a72cdb";
      context.lineWidth = 2;
      context.shadowColor = "#c000ff";
      context.shadowBlur = 12;

      context.beginPath();
      context.ellipse(0, 0, ring.radius, ring.radius * 0.55, 0, 0, Math.PI * 2);
      context.stroke();

      context.restore();
    });
  }

  drawBubbles(context) {
    this.bubbles.forEach((bubble) => {
      context.save();

      context.globalAlpha = Math.min(1, bubble.life / 15);

      context.fillStyle = "#9bff37";
      context.strokeStyle = "#d8ff9a";
      context.lineWidth = 1;

      context.shadowColor = "#7dff00";
      context.shadowBlur = 9;

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

      context.fillStyle = "rgba(255,255,255,0.8)";

      context.beginPath();
      context.arc(
        bubble.x - bubble.size * 0.3,
        bubble.y - bubble.size * 0.3,
        bubble.size * 0.2,
        0,
        Math.PI * 2
      );
      context.fill();

      context.restore();
    });
  }

  drawParticles(context) {
    this.particles.forEach((particle) => {
      context.save();

      context.globalAlpha = particle.life / particle.maxLife;

      context.fillStyle = "#b7ff38";
      context.shadowColor = "#8dff00";
      context.shadowBlur = 8;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);

      context.fill();
      context.restore();
    });
  }

  drawFlash(context) {
    if (this.flashOpacity <= 0) return;

    context.save();

    context.globalAlpha = this.flashOpacity;
    context.fillStyle = "#a8ff35";

    context.beginPath();
    context.arc(this.centerX, this.centerY, this.radiusX * 1.2, 0, Math.PI * 2);

    context.fill();
    context.restore();
  }
}
