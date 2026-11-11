export class CrabhammerAnimation {
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

    this.phase = "PREPARE";
    this.timer = 0;
    this.isFinished = false;

    this.direction = this.target.position.x > this.attacker.position.x ? 1 : -1;

    this.attackerCenterX =
      this.attacker.position.x +
      (this.attacker.frameWidth * this.attacker.scale) / 2;

    this.attackerCenterY =
      this.attacker.position.y +
      (this.attacker.frameHeight * this.attacker.scale) / 2;

    this.targetWidth = this.target.frameWidth * this.target.scale;
    this.targetHeight = this.target.frameHeight * this.target.scale;

    this.targetCenterX = this.target.position.x + this.targetWidth / 2;
    this.targetCenterY = this.target.position.y + this.targetHeight / 2;

    // Centre de la pince, entre les deux Pokémon.
    this.clawX =
      this.attackerCenterX + (this.targetCenterX - this.attackerCenterX) * 0.72;

    this.clawY = this.targetCenterY;

    this.clawLength = Math.max(45, this.targetWidth * 1.35);
    this.clawWidth = Math.max(24, this.targetHeight * 0.75);

    this.closingProgress = 0;
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
          this.phase = "FORM";
          this.timer = 0;
        }
        break;

      case "FORM":
        if (this.timer >= 16) {
          this.phase = "CLOSE";
          this.timer = 0;
        }
        break;

      case "CLOSE":
        this.closingProgress = Math.min(1, this.timer / 9);

        if (this.timer >= 9) {
          this.phase = "IMPACT";
          this.timer = 0;

          this.createImpactParticles();
          this.game.canvas.startShake(18, 6);
        }
        break;

      case "IMPACT":
        this.updateParticles();
        this.shockwaveRadius += 7;

        if (this.timer >= 20) {
          this.phase = "RELEASE";
          this.timer = 0;
        }
        break;

      case "RELEASE":
        this.updateParticles();

        if (this.timer >= 25) {
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

      case "FORM":
        this.drawClaw(context, 0);
        break;

      case "CLOSE":
        this.drawClaw(context, this.closingProgress);
        break;

      case "IMPACT":
        this.drawImpact(context);
        break;

      case "RELEASE":
        this.drawRelease(context);
        break;
    }

    context.restore();
  }

  drawPreparation(context) {
    const progress = this.timer / 12;
    const radius = 8 + progress * 19;

    const gradient = context.createRadialGradient(
      this.attackerCenterX,
      this.attackerCenterY,
      1,
      this.attackerCenterX,
      this.attackerCenterY,
      radius
    );

    gradient.addColorStop(0, "rgba(245, 255, 255, 0.9)");
    gradient.addColorStop(0.5, "rgba(65, 185, 255, 0.75)");
    gradient.addColorStop(1, "rgba(0, 100, 220, 0)");

    context.fillStyle = gradient;
    context.beginPath();
    context.arc(
      this.attackerCenterX,
      this.attackerCenterY,
      radius,
      0,
      Math.PI * 2
    );
    context.fill();

    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI * 2 * i) / 6 + this.timer * 0.12;

      context.fillStyle = "rgba(190, 240, 255, 0.9)";
      context.beginPath();
      context.arc(
        this.attackerCenterX + Math.cos(angle) * (radius + 5),
        this.attackerCenterY + Math.sin(angle) * (radius + 5),
        2.5,
        0,
        Math.PI * 2
      );
      context.fill();
    }
  }

  drawClaw(context, progress) {
    const eased = progress * progress;

    const separation = this.clawWidth * (1 - eased);

    const upperAngle = -0.55 * (1 - eased);
    const lowerAngle = 0.55 * (1 - eased);

    const alpha = this.phase === "CLOSE" ? 1 : 0.95;

    this.drawClawArm(
      context,
      this.clawX,
      this.clawY - separation,
      upperAngle,
      true,
      alpha
    );

    this.drawClawArm(
      context,
      this.clawX,
      this.clawY + separation,
      lowerAngle,
      false,
      alpha
    );

    // Énergie au niveau de l'articulation.
    const glow = context.createRadialGradient(
      this.clawX,
      this.clawY,
      2,
      this.clawX,
      this.clawY,
      20
    );

    glow.addColorStop(0, "rgba(255, 255, 255, 0.9)");
    glow.addColorStop(0.5, "rgba(80, 195, 255, 0.65)");
    glow.addColorStop(1, "rgba(0, 100, 220, 0)");

    context.fillStyle = glow;
    context.beginPath();
    context.arc(this.clawX, this.clawY, 20, 0, Math.PI * 2);
    context.fill();
  }

  drawClawArm(context, x, y, angle, isUpper, alpha) {
    const length = this.clawLength;
    const width = this.clawWidth * 0.55;

    context.save();
    context.translate(x, y);
    context.scale(this.direction, 1);
    context.rotate(angle);

    context.globalAlpha = alpha;

    const gradient = context.createLinearGradient(0, -width, 0, width);

    gradient.addColorStop(0, "rgba(220, 250, 255, 0.98)");
    gradient.addColorStop(0.3, "rgba(90, 205, 255, 0.98)");
    gradient.addColorStop(0.7, "rgba(20, 135, 225, 0.98)");
    gradient.addColorStop(1, "rgba(0, 75, 180, 0.9)");

    context.fillStyle = gradient;
    context.strokeStyle = "rgba(225, 250, 255, 0.95)";
    context.lineWidth = 2;

    context.beginPath();

    if (isUpper) {
      context.moveTo(0, 0);
      context.quadraticCurveTo(
        length * 0.35,
        -width * 0.3,
        length * 0.7,
        -width * 0.9
      );
      context.lineTo(length, -width * 0.75);
      context.quadraticCurveTo(
        length * 0.85,
        width * 0.1,
        length * 0.55,
        width * 0.15
      );
      context.quadraticCurveTo(length * 0.2, width * 0.15, 0, 0);
    } else {
      context.moveTo(0, 0);
      context.quadraticCurveTo(
        length * 0.35,
        width * 0.3,
        length * 0.7,
        width * 0.9
      );
      context.lineTo(length, width * 0.75);
      context.quadraticCurveTo(
        length * 0.85,
        -width * 0.1,
        length * 0.55,
        -width * 0.15
      );
      context.quadraticCurveTo(length * 0.2, -width * 0.15, 0, 0);
    }

    context.closePath();
    context.fill();
    context.stroke();

    // Reflet lumineux sur chaque branche.
    context.strokeStyle = "rgba(255, 255, 255, 0.8)";
    context.lineWidth = 2;

    context.beginPath();
    context.moveTo(length * 0.15, isUpper ? -3 : 3);
    context.quadraticCurveTo(
      length * 0.4,
      isUpper ? -width * 0.2 : width * 0.2,
      length * 0.7,
      isUpper ? -width * 0.65 : width * 0.65
    );
    context.stroke();

    // Pointe de la pince.
    context.fillStyle = "rgba(235, 250, 255, 0.95)";
    context.beginPath();

    if (isUpper) {
      context.moveTo(length * 0.72, -width * 0.9);
      context.lineTo(length * 0.95, -width * 0.75);
      context.lineTo(length * 0.78, -width * 0.35);
    } else {
      context.moveTo(length * 0.72, width * 0.9);
      context.lineTo(length * 0.95, width * 0.75);
      context.lineTo(length * 0.78, width * 0.35);
    }

    context.closePath();
    context.fill();

    context.restore();
  }

  createImpactParticles() {
    for (let i = 0; i < 42; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 7;

      this.particles.push({
        x: this.targetCenterX,
        y: this.targetCenterY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 2 + Math.random() * 5,
        life: 18 + Math.random() * 18,
        maxLife: 36,
      });
    }

    for (let i = 0; i < 14; i++) {
      this.bubbles.push({
        x: this.targetCenterX + (Math.random() - 0.5) * this.targetWidth,
        y: this.targetCenterY + (Math.random() - 0.5) * this.targetHeight,
        radius: 2 + Math.random() * 4,
        speed: 1 + Math.random() * 3,
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
  }

  drawImpact(context) {
    const alpha = Math.max(0, 1 - this.timer / 20);

    // Flash blanc au moment du claquement.
    const flash = context.createRadialGradient(
      this.targetCenterX,
      this.targetCenterY,
      1,
      this.targetCenterX,
      this.targetCenterY,
      this.targetWidth * 1.4
    );

    flash.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
    flash.addColorStop(0.35, `rgba(160, 235, 255, ${alpha * 0.9})`);
    flash.addColorStop(1, "rgba(0, 120, 230, 0)");

    context.fillStyle = flash;
    context.beginPath();
    context.arc(
      this.targetCenterX,
      this.targetCenterY,
      this.targetWidth * 1.4,
      0,
      Math.PI * 2
    );
    context.fill();

    this.drawShockwave(context, alpha);
    this.drawParticles(context);
    this.drawBubbles(context);
  }

  drawRelease(context) {
    const alpha = Math.max(0, 1 - this.timer / 25);

    this.drawShockwave(context, alpha);
    this.drawParticles(context);
    this.drawBubbles(context);
  }

  drawShockwave(context, alpha) {
    context.save();

    context.globalAlpha = alpha * 0.8;
    context.strokeStyle = "rgba(185, 240, 255, 0.95)";
    context.lineWidth = 3;

    context.beginPath();
    context.ellipse(
      this.targetCenterX,
      this.targetCenterY,
      this.shockwaveRadius,
      this.shockwaveRadius * 0.55,
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
      context.fillStyle = "rgba(165, 230, 255, 0.95)";

      context.beginPath();
      context.ellipse(
        particle.x,
        particle.y,
        particle.radius * 0.8,
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
      context.strokeStyle = "rgba(225, 250, 255, 0.95)";
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
}
