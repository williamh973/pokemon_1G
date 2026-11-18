export class SoftBoiledAnimation {
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

    this.centerX =
      this.pokemon.position.x +
      (this.pokemon.frameWidth * this.pokemon.scale) / 2;

    this.centerY =
      this.pokemon.position.y +
      (this.pokemon.frameHeight * this.pokemon.scale) / 2;

    this.phase = "ORB";
    this.timer = 0;
    this.isFinished = false;

    this.particles = Array.from({ length: 14 }, (_, i) => ({
      angle: (Math.PI * 2 * i) / 14,
      radius: 25 + Math.random() * 12,
      speed: 0.025 + Math.random() * 0.025,
      size: 1.5 + Math.random() * 2,
      offset: Math.random() * Math.PI * 2,
    }));

    this.waveRadius = 0;
    this.waveAlpha = 1;
    this.auraAlpha = 0;
    this.orbAlpha = 0;
  }

  update(context) {
    if (this.isFinished) return;

    this.timer++;

    switch (this.phase) {
      case "ORB":
        this.updateOrb();
        break;

      case "PARTICLES":
        this.updateParticles();
        break;

      case "HEAL":
        this.updateHeal();
        break;

      case "AURA":
        this.updateAura();
        break;

      case "FADE":
        this.updateFade();
        break;
    }

    this.draw(context);
  }

  updateOrb() {
    this.orbAlpha = Math.min(1, this.timer / 12);

    if (this.timer >= 35) {
      this.phase = "PARTICLES";
      this.timer = 0;
    }
  }

  updateParticles() {
    this.particles.forEach((particle) => {
      particle.angle += particle.speed;
    });

    if (this.timer >= 45) {
      this.phase = "HEAL";
      this.timer = 0;
    }
  }

  updateHeal() {
    this.waveRadius = this.timer * 3;
    this.waveAlpha = Math.max(0, 1 - this.timer / 30);

    this.particles.forEach((particle) => {
      particle.angle += particle.speed * 1.5;
    });

    if (this.timer >= 30) {
      this.phase = "AURA";
      this.timer = 0;
    }
  }

  updateAura() {
    this.auraAlpha = Math.max(0, 1 - this.timer / 35);

    if (this.timer >= 35) {
      this.phase = "FADE";
      this.timer = 0;
    }
  }

  updateFade() {
    this.orbAlpha = Math.max(0, 1 - this.timer / 12);

    if (this.timer >= 12) {
      this.isFinished = true;
    }
  }

  draw(context) {
    context.save();

    switch (this.phase) {
      case "ORB":
        this.drawOrb(context);
        break;

      case "PARTICLES":
        this.drawOrb(context);
        this.drawParticles(context);
        break;

      case "HEAL":
        this.drawParticles(context);
        this.drawHealingWave(context);
        break;

      case "AURA":
        this.drawAura(context);
        this.drawParticles(context);
        break;

      case "FADE":
        this.drawOrb(context);
        this.drawParticles(context);
        break;
    }

    context.restore();
  }

  drawOrb(context) {
    const pulse = Math.sin(this.timer * 0.2) * 3;
    const radius = 7 + pulse;

    const x = this.centerX;
    const y = this.centerY - 42;

    context.globalAlpha = this.orbAlpha;
    context.shadowBlur = 18;
    context.shadowColor = "#ffe7a0";

    const gradient = context.createRadialGradient(x, y, 1, x, y, radius);

    gradient.addColorStop(0, "#ffffff");
    gradient.addColorStop(0.45, "#fff2c2");
    gradient.addColorStop(1, "rgba(255, 204, 92, 0)");

    context.fillStyle = gradient;
    context.beginPath();
    context.arc(x, y, radius * 1.8, 0, Math.PI * 2);
    context.fill();

    context.fillStyle = "#fffdf2";
    context.beginPath();
    context.arc(x, y, radius * 0.55, 0, Math.PI * 2);
    context.fill();
  }

  drawParticles(context) {
    this.particles.forEach((particle) => {
      const verticalOffset = Math.sin(this.timer * 0.12 + particle.offset) * 5;

      const x = this.centerX + Math.cos(particle.angle) * particle.radius;

      const y =
        this.centerY +
        Math.sin(particle.angle) * particle.radius * 0.7 +
        verticalOffset;

      const alpha = 0.5 + Math.sin(this.timer * 0.2 + particle.offset) * 0.35;

      context.globalAlpha = Math.max(0, alpha);
      context.fillStyle = "#ffe7a0";
      context.shadowBlur = 10;
      context.shadowColor = "#ffdb70";

      context.beginPath();
      context.arc(x, y, particle.size, 0, Math.PI * 2);
      context.fill();
    });
  }

  drawHealingWave(context) {
    context.globalAlpha = this.waveAlpha;
    context.strokeStyle = "#fff0b5";
    context.lineWidth = 3;
    context.shadowBlur = 15;
    context.shadowColor = "#ffdb70";

    context.beginPath();
    context.ellipse(
      this.centerX,
      this.centerY + 10,
      this.waveRadius,
      this.waveRadius * 0.55,
      0,
      0,
      Math.PI * 2
    );
    context.stroke();

    context.globalAlpha = this.waveAlpha * 0.45;
    context.strokeStyle = "#ffffff";
    context.lineWidth = 1.5;

    context.beginPath();
    context.ellipse(
      this.centerX,
      this.centerY + 10,
      this.waveRadius * 0.75,
      this.waveRadius * 0.42,
      0,
      0,
      Math.PI * 2
    );
    context.stroke();
  }

  drawAura(context) {
    const pulse = Math.sin(this.timer * 0.3) * 4;
    const radiusX = 27 + pulse;
    const radiusY = 38 + pulse;

    context.globalAlpha = this.auraAlpha * 0.35;

    const gradient = context.createRadialGradient(
      this.centerX,
      this.centerY,
      5,
      this.centerX,
      this.centerY,
      radiusY
    );

    gradient.addColorStop(0, "rgba(255, 255, 230, 0.9)");
    gradient.addColorStop(0.6, "rgba(255, 222, 130, 0.5)");
    gradient.addColorStop(1, "rgba(255, 205, 90, 0)");

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

    context.globalAlpha = this.auraAlpha;
    context.strokeStyle = "#ffe7a0";
    context.lineWidth = 2;
    context.shadowBlur = 12;
    context.shadowColor = "#ffd45c";

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
  }
}
