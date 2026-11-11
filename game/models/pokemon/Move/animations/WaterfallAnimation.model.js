export class WaterfallAnimation {
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

    this.screenWidth = this.game.canvas.width;
    this.screenHeight = this.game.canvas.height;

    this.waterWidth = this.targetWidth * 2.3;
    this.waterHeight = this.targetHeight * 3.2;

    this.particles = [];
    this.bubbles = [];
    this.ripples = [];

    this.streamOffset = 0;
    this.impactRadius = 0;
  }

  update(context) {
    if (this.isFinished) return;

    this.timer++;

    switch (this.phase) {
      case "PREPARE":
        if (this.timer >= 28) {
          this.phase = "FALL";
          this.timer = 0;
        }
        break;

      case "FALL":
        this.streamOffset += 12;

        if (this.timer >= 26) {
          this.phase = "IMPACT";
          this.timer = 0;

          this.createImpactParticles();
          this.game.canvas.startShake(1000, 6);
        }
        break;

      case "IMPACT":
        this.updateParticles();
        this.impactRadius += 9;

        if (this.timer >= 50) {
          this.phase = "RETREAT";
          this.timer = 0;
        }
        break;

      case "RETREAT":
        this.updateParticles();

        if (this.timer >= 26) {
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

      case "FALL":
        this.drawWaterfall(context);
        break;

      case "IMPACT":
        this.drawImpact(context);
        break;

      case "RETREAT":
        this.drawRetreat(context);
        break;
    }

    context.restore();
  }

  drawPreparation(context) {
    const progress = this.timer / 14;
    const radius = 10 + progress * 25;

    const gradient = context.createRadialGradient(
      this.centerX,
      this.centerY,
      1,
      this.centerX,
      this.centerY,
      radius
    );

    gradient.addColorStop(0, "rgba(235, 255, 255, 0.9)");
    gradient.addColorStop(0.5, "rgba(80, 195, 255, 0.65)");
    gradient.addColorStop(1, "rgba(0, 100, 230, 0)");

    context.fillStyle = gradient;
    context.beginPath();
    context.arc(this.centerX, this.centerY, radius, 0, Math.PI * 2);
    context.fill();

    // Gouttelettes qui remontent autour de la cible.
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8 + this.timer * 0.1;
      const distance = radius + 6;

      context.fillStyle = "rgba(190, 240, 255, 0.9)";
      context.beginPath();
      context.arc(
        this.centerX + Math.cos(angle) * distance,
        this.centerY + Math.sin(angle) * distance,
        2 + progress * 1.5,
        0,
        Math.PI * 2
      );
      context.fill();
    }
  }

  drawWaterfall(context) {
    const progress = this.timer / 13;
    const width = this.waterWidth * (0.65 + progress * 0.35);

    const top = -this.waterHeight;
    const bottom = this.centerY + this.targetHeight * 0.8;

    const left = this.centerX - width / 2;
    const right = this.centerX + width / 2;

    // Corps principal du torrent.
    const gradient = context.createLinearGradient(left, 0, right, 0);

    gradient.addColorStop(0, "rgba(0, 95, 205, 0)");
    gradient.addColorStop(0.12, "rgba(40, 150, 240, 0.75)");
    gradient.addColorStop(0.3, "rgba(160, 230, 255, 0.9)");
    gradient.addColorStop(0.5, "rgba(240, 255, 255, 0.98)");
    gradient.addColorStop(0.7, "rgba(130, 215, 255, 0.9)");
    gradient.addColorStop(0.88, "rgba(30, 135, 230, 0.75)");
    gradient.addColorStop(1, "rgba(0, 95, 205, 0)");

    context.fillStyle = gradient;

    context.beginPath();
    context.moveTo(left, top);
    context.lineTo(right, top);
    context.lineTo(right + 8, bottom);
    context.quadraticCurveTo(this.centerX, bottom + 18, left - 8, bottom);
    context.closePath();
    context.fill();

    // Filets d'eau qui défilent vers le bas.
    for (let i = 0; i < 9; i++) {
      const x = left + (width / 9) * i;

      const offset = (this.streamOffset + i * 27) % 75;
      const y = top + offset;

      context.strokeStyle =
        i % 2 === 0 ? "rgba(255, 255, 255, 0.85)" : "rgba(75, 180, 255, 0.8)";

      context.lineWidth = i % 3 === 0 ? 4 : 2;

      context.beginPath();
      context.moveTo(x, y);
      context.bezierCurveTo(x + 8, y + 20, x - 7, y + 40, x + 3, y + 65);
      context.stroke();
    }

    // Éclaboussures latérales à la base du torrent.
    this.drawBaseSplash(context, 0.8);

    // Quelques grosses gouttes projetées vers le bas.
    for (let i = 0; i < 10; i++) {
      const x = left + Math.random() * width;
      const y = bottom - Math.random() * 45;

      context.fillStyle = "rgba(210, 245, 255, 0.9)";
      context.beginPath();
      context.ellipse(x, y, 2.5, 5, 0.2, 0, Math.PI * 2);
      context.fill();
    }
  }

  drawBaseSplash(context, opacity) {
    context.save();
    context.globalAlpha = opacity;

    const width = this.waterWidth * 0.8;
    const y = this.centerY + this.targetHeight * 0.55;

    const gradient = context.createRadialGradient(
      this.centerX,
      y,
      2,
      this.centerX,
      y,
      width * 0.65
    );

    gradient.addColorStop(0, "rgba(255, 255, 255, 0.95)");
    gradient.addColorStop(0.4, "rgba(120, 220, 255, 0.8)");
    gradient.addColorStop(1, "rgba(0, 110, 230, 0)");

    context.fillStyle = gradient;
    context.beginPath();
    context.ellipse(
      this.centerX,
      y,
      width * 0.65,
      this.targetHeight * 0.65,
      0,
      0,
      Math.PI * 2
    );
    context.fill();

    context.restore();
  }

  createImpactParticles() {
    for (let i = 0; i < 48; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 7;

      this.particles.push({
        x: this.centerX,
        y: this.centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        radius: 2 + Math.random() * 5,
        life: 18 + Math.random() * 20,
        maxLife: 38,
      });
    }

    for (let i = 0; i < 16; i++) {
      this.bubbles.push({
        x: this.centerX + (Math.random() - 0.5) * this.waterWidth,
        y: this.centerY + (Math.random() - 0.5) * this.targetHeight,
        radius: 2 + Math.random() * 5,
        speed: 1 + Math.random() * 3,
        life: 25 + Math.random() * 20,
      });
    }

    for (let i = 0; i < 3; i++) {
      this.ripples.push({
        radius: 10 + i * 15,
        alpha: 1,
      });
    }
  }

  updateParticles() {
    this.particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      particle.vx *= 0.96;
      particle.vy += 0.12;

      particle.life--;
    });

    this.particles = this.particles.filter((particle) => particle.life > 0);

    this.bubbles.forEach((bubble) => {
      bubble.y -= bubble.speed;
      bubble.life--;
    });

    this.bubbles = this.bubbles.filter((bubble) => bubble.life > 0);

    this.ripples.forEach((ripple) => {
      ripple.radius += 5;
      ripple.alpha -= 0.045;
    });

    this.ripples = this.ripples.filter((ripple) => ripple.alpha > 0);
  }

  drawImpact(context) {
    const progress = this.timer / 24;
    const alpha = Math.max(0, 1 - progress);

    // Gerbe lumineuse centrale.
    const gradient = context.createRadialGradient(
      this.centerX,
      this.centerY,
      2,
      this.centerX,
      this.centerY,
      this.waterWidth
    );

    gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
    gradient.addColorStop(0.3, `rgba(160, 235, 255, ${alpha})`);
    gradient.addColorStop(0.7, `rgba(40, 155, 245, ${alpha * 0.7})`);
    gradient.addColorStop(1, "rgba(0, 100, 220, 0)");

    context.fillStyle = gradient;
    context.beginPath();
    context.arc(this.centerX, this.centerY, this.waterWidth, 0, Math.PI * 2);
    context.fill();

    this.drawParticles(context);
    this.drawBubbles(context);
    this.drawRipples(context);
  }

  drawRetreat(context) {
    const alpha = Math.max(0, 1 - this.timer / 26);

    this.drawParticles(context);
    this.drawBubbles(context);
    this.drawRipples(context);

    // Dernier voile d'eau qui se dissipe.
    context.globalAlpha = alpha * 0.45;

    const gradient = context.createLinearGradient(
      this.centerX - this.waterWidth / 2,
      0,
      this.centerX + this.waterWidth / 2,
      0
    );

    gradient.addColorStop(0, "rgba(0, 120, 220, 0)");
    gradient.addColorStop(0.5, "rgba(150, 230, 255, 0.8)");
    gradient.addColorStop(1, "rgba(0, 120, 220, 0)");

    context.fillStyle = gradient;
    context.fillRect(
      this.centerX - this.waterWidth / 2,
      this.centerY - this.waterHeight * 0.45,
      this.waterWidth,
      this.waterHeight * 0.9
    );

    context.globalAlpha = 1;
  }

  drawParticles(context) {
    this.particles.forEach((particle) => {
      const alpha = Math.max(0, particle.life / particle.maxLife);

      context.globalAlpha = alpha;
      context.fillStyle = "rgba(175, 235, 255, 0.95)";

      context.beginPath();
      context.ellipse(
        particle.x,
        particle.y,
        particle.radius * 0.75,
        particle.radius * 1.3,
        0,
        0,
        Math.PI * 2
      );
      context.fill();
    });

    context.globalAlpha = 1;
  }

  drawBubbles(context) {
    this.bubbles.forEach((bubble) => {
      const alpha = Math.min(1, bubble.life / 15);

      context.globalAlpha = alpha;
      context.strokeStyle = "rgba(215, 245, 255, 0.95)";
      context.lineWidth = 1.5;

      context.beginPath();
      context.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
      context.stroke();

      context.fillStyle = "rgba(255, 255, 255, 0.7)";
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

  drawRipples(context) {
    this.ripples.forEach((ripple) => {
      context.globalAlpha = ripple.alpha;
      context.strokeStyle = "rgba(190, 240, 255, 0.9)";
      context.lineWidth = 3;

      context.beginPath();
      context.ellipse(
        this.centerX,
        this.centerY + this.targetHeight * 0.35,
        ripple.radius,
        ripple.radius * 0.4,
        0,
        0,
        Math.PI * 2
      );
      context.stroke();
    });

    context.globalAlpha = 1;
  }
}
