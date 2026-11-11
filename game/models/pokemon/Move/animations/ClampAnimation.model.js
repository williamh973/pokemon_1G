export class ClampAnimation {
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

    this.target = this.targetViewer.sprite;

    this.phase = "PREPARE";
    this.timer = 0;
    this.isFinished = false;

    this.targetWidth = this.target.frameWidth * this.target.scale;
    this.targetHeight = this.target.frameHeight * this.target.scale;

    this.centerX = this.target.position.x + this.targetWidth / 2;
    this.centerY = this.target.position.y + this.targetHeight / 2;

    this.jawDistance = this.targetHeight * 0.85;
    this.jawWidth = this.targetWidth * 1.65;

    this.particles = [];
    this.bubbles = [];
    this.shockwaveRadius = 0;
  }

  update(context) {
    if (this.isFinished) return;

    this.timer++;

    switch (this.phase) {
      case "PREPARE":
        if (this.timer >= 12) {
          this.phase = "OPENING";
          this.timer = 0;
        }
        break;

      case "OPENING":
        if (this.timer >= 14) {
          this.phase = "CLOSING";
          this.timer = 0;
        }
        break;

      case "CLOSING":
        if (this.timer >= 10) {
          this.phase = "IMPACT";
          this.timer = 0;
          this.createImpactParticles();
          this.game.canvas.startShake(800, 10);
        }
        break;

      case "IMPACT":
        this.updateParticles();

        if (this.timer >= 22) {
          this.phase = "DISSIPATE";
          this.timer = 0;
        }
        break;

      case "DISSIPATE":
        this.updateParticles();

        if (this.timer >= 24) {
          this.isFinished = true;
        }
        break;
    }

    this.draw(context);
  }

  draw(context) {
    context.save();

    switch (this.phase) {
      case "PREPARE":
        this.drawPreparation(context);
        break;

      case "OPENING":
        this.drawOpening(context);
        break;

      case "CLOSING":
        this.drawClosing(context);
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

  drawPreparation(context) {
    const progress = this.timer / 12;
    const radius = 8 + progress * 16;

    context.globalAlpha = 0.35 + progress * 0.4;

    const gradient = context.createRadialGradient(
      this.centerX,
      this.centerY,
      1,
      this.centerX,
      this.centerY,
      radius
    );

    gradient.addColorStop(0, "rgba(220, 250, 255, 0.9)");
    gradient.addColorStop(0.5, "rgba(55, 175, 255, 0.6)");
    gradient.addColorStop(1, "rgba(0, 100, 220, 0)");

    context.fillStyle = gradient;
    context.beginPath();
    context.arc(this.centerX, this.centerY, radius, 0, Math.PI * 2);
    context.fill();

    // Petites gouttelettes autour de la cible.
    for (let i = 0; i < 5; i++) {
      const angle = (Math.PI * 2 * i) / 5 + this.timer * 0.08;
      const distance = radius + 5;

      context.fillStyle = "rgba(180, 235, 255, 0.9)";
      context.beginPath();
      context.arc(
        this.centerX + Math.cos(angle) * distance,
        this.centerY + Math.sin(angle) * distance,
        2.5,
        0,
        Math.PI * 2
      );
      context.fill();
    }
  }

  drawOpening(context) {
    const progress = this.timer / 14;
    const distance = this.jawDistance * (0.45 + progress * 0.55);

    this.drawWaterJaw(context, this.centerY - distance, true, 0.9);
    this.drawWaterJaw(context, this.centerY + distance, false, 0.9);
  }

  drawClosing(context) {
    const progress = this.timer / 10;
    const eased = progress * progress;

    const distance = this.jawDistance * (1 - eased);

    this.drawWaterJaw(context, this.centerY - distance, true, 1);
    this.drawWaterJaw(context, this.centerY + distance, false, 1);
  }

  drawWaterJaw(context, y, isUpper, opacity) {
    const halfWidth = this.jawWidth / 2;
    const x = this.centerX;

    const thickness = this.targetHeight * 0.35;
    const direction = isUpper ? 1 : -1;

    context.save();
    context.globalAlpha = opacity;

    const gradient = context.createLinearGradient(
      x,
      y - thickness,
      x,
      y + thickness
    );

    gradient.addColorStop(0, "rgba(190, 245, 255, 0.95)");
    gradient.addColorStop(0.35, "rgba(45, 175, 245, 0.95)");
    gradient.addColorStop(0.75, "rgba(15, 105, 220, 0.9)");
    gradient.addColorStop(1, "rgba(0, 65, 175, 0.75)");

    context.fillStyle = gradient;
    context.strokeStyle = "rgba(220, 250, 255, 0.95)";
    context.lineWidth = 2;

    context.beginPath();

    if (isUpper) {
      context.moveTo(x - halfWidth, y - thickness * 0.25);
      context.quadraticCurveTo(
        x,
        y - thickness * 1.7,
        x + halfWidth,
        y - thickness * 0.25
      );
      context.quadraticCurveTo(
        x + halfWidth * 0.7,
        y + thickness * 0.8,
        x,
        y + thickness * 0.45
      );
      context.quadraticCurveTo(
        x - halfWidth * 0.7,
        y + thickness * 0.8,
        x - halfWidth,
        y - thickness * 0.25
      );
    } else {
      context.moveTo(x - halfWidth, y + thickness * 0.25);
      context.quadraticCurveTo(
        x,
        y + thickness * 1.7,
        x + halfWidth,
        y + thickness * 0.25
      );
      context.quadraticCurveTo(
        x + halfWidth * 0.7,
        y - thickness * 0.8,
        x,
        y - thickness * 0.45
      );
      context.quadraticCurveTo(
        x - halfWidth * 0.7,
        y - thickness * 0.8,
        x - halfWidth,
        y + thickness * 0.25
      );
    }

    context.closePath();
    context.fill();
    context.stroke();

    // Reflets sur la surface de l'eau.
    context.strokeStyle = "rgba(255, 255, 255, 0.8)";
    context.lineWidth = 2;

    context.beginPath();
    context.moveTo(x - halfWidth * 0.55, y);
    context.quadraticCurveTo(
      x,
      y + direction * thickness * 0.45,
      x + halfWidth * 0.55,
      y
    );
    context.stroke();

    context.restore();
  }

  createImpactParticles() {
    for (let i = 0; i < 28; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 5;

      this.particles.push({
        x: this.centerX,
        y: this.centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 2 + Math.random() * 4,
        life: 18 + Math.random() * 12,
        maxLife: 30,
      });
    }

    for (let i = 0; i < 20; i++) {
      this.bubbles.push({
        x: this.centerX + (Math.random() - 0.5) * this.targetWidth,
        y: this.centerY + (Math.random() - 0.5) * this.targetHeight,
        radius: 2 + Math.random() * 4,
        speed: 1 + Math.random() * 2,
        life: 25 + Math.random() * 15,
      });
    }
  }

  updateParticles() {
    this.particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vx *= 0.94;
      particle.vy *= 0.94;
      particle.life--;
    });

    this.particles = this.particles.filter((particle) => particle.life > 0);

    this.bubbles.forEach((bubble) => {
      bubble.y -= bubble.speed;
      bubble.life--;
    });

    this.bubbles = this.bubbles.filter((bubble) => bubble.life > 0);

    this.shockwaveRadius += 3;
  }

  drawImpact(context) {
    const progress = this.timer / 22;
    const alpha = Math.max(0, 1 - progress);

    // Éclat central.
    const gradient = context.createRadialGradient(
      this.centerX,
      this.centerY,
      2,
      this.centerX,
      this.centerY,
      this.targetWidth
    );

    gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
    gradient.addColorStop(0.35, `rgba(125, 220, 255, ${alpha * 0.9})`);
    gradient.addColorStop(1, "rgba(0, 120, 255, 0)");

    context.fillStyle = gradient;
    context.beginPath();
    context.arc(this.centerX, this.centerY, this.targetWidth, 0, Math.PI * 2);
    context.fill();

    this.drawShockwave(context, alpha);
    this.drawParticles(context);
    this.drawBubbles(context);
  }

  drawDissipation(context) {
    const alpha = Math.max(0, 1 - this.timer / 24);

    this.drawParticles(context);
    this.drawBubbles(context);
    this.drawShockwave(context, alpha);
  }

  drawShockwave(context, alpha) {
    context.save();

    context.globalAlpha = alpha * 0.8;
    context.strokeStyle = "rgba(160, 235, 255, 0.9)";
    context.lineWidth = 3;

    context.beginPath();
    context.ellipse(
      this.centerX,
      this.centerY,
      this.shockwaveRadius,
      this.shockwaveRadius * 0.65,
      0,
      0,
      Math.PI * 2
    );
    context.stroke();

    context.restore();
  }

  drawParticles(context) {
    this.particles.forEach((particle) => {
      const alpha = Math.max(0, particle.life / particle.maxLife);

      context.globalAlpha = alpha;
      context.fillStyle = "rgba(130, 220, 255, 0.95)";

      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fill();
    });

    context.globalAlpha = 1;
  }

  drawBubbles(context) {
    this.bubbles.forEach((bubble) => {
      const alpha = Math.min(1, bubble.life / 15);

      context.globalAlpha = alpha;
      context.strokeStyle = "rgba(210, 245, 255, 0.95)";
      context.lineWidth = 1.5;

      context.beginPath();
      context.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
      context.stroke();

      context.fillStyle = "rgba(255, 255, 255, 0.6)";
      context.beginPath();
      context.arc(
        bubble.x - bubble.radius * 0.3,
        bubble.y - bubble.radius * 0.3,
        bubble.radius * 0.25,
        0,
        Math.PI * 2
      );
      context.fill();
    });

    context.globalAlpha = 1;
  }
}
