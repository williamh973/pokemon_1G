export class CometPunchAnimation {
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

    this.isFinished = false;

    this.phase = "PREPARE";
    this.timer = 0;

    this.hitCount = 7;
    this.hitIndex = 0;
    this.hitInterval = 8;
    this.impactTimer = 0;

    this.particles = [];
    this.stars = [];

    this.targetX =
      this.targetViewer.sprite.position.x +
      this.targetViewer.sprite.frameWidth / 2;

    this.targetY =
      this.targetViewer.sprite.position.y +
      this.targetViewer.sprite.frameHeight / 2;

    this.direction =
      this.pokemonViewer.sprite.position.x < this.targetViewer.sprite.position.x
        ? 1
        : -1;

    this.impactOffsets = [
      { x: -0.18, y: -0.25 },
      { x: 0.15, y: -0.12 },
      { x: -0.1, y: 0.08 },
      { x: 0.2, y: 0.18 },
      { x: -0.22, y: 0.25 },
      { x: 0.05, y: -0.3 },
      { x: 0, y: 0 },
    ];

    this.currentImpact = null;
    this.impactRadius = 0;
    this.flashOpacity = 0;
    this.shakeOffset = 0;
  }

  update(context) {
    this.timer++;

    switch (this.phase) {
      case "PREPARE":
        this.updatePrepare();
        break;

      case "BARRAGE":
        this.updateBarrage();
        break;

      case "FINISH":
        this.updateFinish();
        break;
    }

    this.updateParticles();
    this.draw(context);
  }

  updatePrepare() {
    if (this.timer >= 15) {
      this.timer = 0;
      this.phase = "BARRAGE";
    }
  }

  updateBarrage() {
    if (this.timer % this.hitInterval === 0) {
      this.createImpact(this.hitIndex);

      this.hitIndex++;

      if (this.hitIndex >= this.hitCount) {
        this.phase = "FINISH";
        this.timer = 0;
      }
    }
  }

  updateFinish() {
    this.flashOpacity = Math.max(0, this.flashOpacity - 0.08);
    this.impactRadius *= 0.9;

    if (this.timer >= 30) {
      this.isFinished = true;
    }
  }

  createImpact(index) {
    const offset = this.impactOffsets[index];

    const x =
      this.targetViewer.sprite.position.x +
      this.targetViewer.sprite.frameWidth / 2 +
      offset.x * this.targetViewer.sprite.frameWidth;

    const y =
      this.targetViewer.sprite.position.y +
      this.targetViewer.sprite.frameHeight / 2 +
      offset.y * this.targetViewer.sprite.frameHeight;

    this.currentImpact = { x, y };
    this.impactRadius = index === this.hitCount - 1 ? 24 : 15;
    this.impactTimer = 6;

    this.flashOpacity = index === this.hitCount - 1 ? 0.65 : 0.25;

    this.shakeOffset = index === this.hitCount - 1 ? 7 : 2;

    if (this.game.canvas?.startShake) {
      this.game.canvas.startShake(
        index === this.hitCount - 1 ? 8 : 3,
        index === this.hitCount - 1 ? 4 : 1.5
      );
    }

    this.createParticles(x, y, index);
  }

  createParticles(x, y, index) {
    const count = index === this.hitCount - 1 ? 16 : 8;

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;

      const speed =
        index === this.hitCount - 1
          ? 2 + Math.random() * 4
          : 1 + Math.random() * 2.5;

      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 2 + Math.random() * 3,
        life: 12 + Math.random() * 8,
        maxLife: 20,
        color: Math.random() > 0.5 ? "#ffcc55" : "#ffffff",
      });
    }

    this.stars.push({
      x,
      y,
      radius: index === this.hitCount - 1 ? 25 : 16,
      life: 9,
      maxLife: 9,
    });
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

    this.stars.forEach((star) => {
      star.life--;
      star.radius *= 0.9;
    });

    this.stars = this.stars.filter((star) => star.life > 0);

    if (this.impactTimer > 0) {
      this.impactTimer--;
    }

    if (this.phase !== "FINISH") {
      this.flashOpacity = Math.max(0, this.flashOpacity - 0.1);
    }
  }

  draw(context) {
    if (this.phase === "PREPARE") {
      this.drawPreparation(context);
    }

    if (this.phase === "BARRAGE") {
      this.drawBarrage(context);
    }

    this.drawStars(context);
    this.drawParticles(context);
    this.drawFlash(context);
  }

  drawPreparation(context) {
    const progress = this.timer / 15;

    const x =
      this.pokemonViewer.sprite.position.x +
      this.pokemonViewer.sprite.frameWidth / 2;

    const y =
      this.pokemonViewer.sprite.position.y +
      this.pokemonViewer.sprite.frameHeight / 2;

    context.save();

    context.globalAlpha = 0.3 + progress * 0.5;
    context.strokeStyle = "#ffb52e";
    context.lineWidth = 3;

    context.beginPath();
    context.arc(x, y, 8 + progress * 12, 0, Math.PI * 2);
    context.stroke();

    context.restore();
  }

  drawBarrage(context) {
    if (this.hitIndex === 0 || this.timer === 0) return;

    const x =
      this.targetViewer.sprite.position.x +
      this.targetViewer.sprite.frameWidth / 2;

    const y =
      this.targetViewer.sprite.position.y +
      this.targetViewer.sprite.frameHeight / 2;

    const offset =
      this.impactOffsets[
        Math.max(0, Math.min(this.hitIndex - 1, this.hitCount - 1))
      ];

    const impactX =
      this.targetViewer.sprite.position.x +
      this.targetViewer.sprite.frameWidth / 2 +
      offset.x * this.targetViewer.sprite.frameWidth;

    const impactY =
      this.targetViewer.sprite.position.y +
      this.targetViewer.sprite.frameHeight / 2 +
      offset.y * this.targetViewer.sprite.frameHeight;

    const attackerX =
      this.pokemonViewer.sprite.position.x +
      this.pokemonViewer.sprite.frameWidth / 2;

    const attackerY =
      this.pokemonViewer.sprite.position.y +
      this.pokemonViewer.sprite.frameHeight / 2;

    const progress = Math.min(this.timer / this.hitInterval, 1);

    const fistX = attackerX + (impactX - attackerX) * progress;
    const fistY = attackerY + (impactY - attackerY) * progress;

    context.save();

    // Traînée du coup de poing
    context.globalAlpha = 0.7;
    context.strokeStyle = "#ffb52e";
    context.lineWidth = 8;
    context.lineCap = "round";

    context.beginPath();
    context.moveTo(fistX - this.direction * 22, fistY + 8);
    context.lineTo(fistX, fistY);
    context.stroke();

    // Aura du poing
    context.globalAlpha = 0.9;
    context.fillStyle = "#ffdc70";

    context.beginPath();
    context.arc(fistX, fistY, 7, 0, Math.PI * 2);
    context.fill();

    context.fillStyle = "#ffffff";

    context.beginPath();
    context.arc(fistX, fistY, 3, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }

  drawStars(context) {
    this.stars.forEach((star) => {
      const alpha = star.life / star.maxLife;

      context.save();

      context.globalAlpha = alpha;
      context.translate(star.x, star.y);
      context.rotate((1 - alpha) * 0.8);

      context.fillStyle = "#fff2a6";

      context.beginPath();

      for (let i = 0; i < 8; i++) {
        const angle = (Math.PI * 2 * i) / 8 - Math.PI / 2;
        const radius = i % 2 === 0 ? star.radius : star.radius * 0.35;

        const px = Math.cos(angle) * radius;
        const py = Math.sin(angle) * radius;

        if (i === 0) {
          context.moveTo(px, py);
        } else {
          context.lineTo(px, py);
        }
      }

      context.closePath();
      context.fill();

      context.strokeStyle = "#ff9d24";
      context.lineWidth = 2;
      context.stroke();

      context.restore();
    });
  }

  drawParticles(context) {
    this.particles.forEach((particle) => {
      context.save();

      context.globalAlpha = Math.max(0, particle.life / particle.maxLife);
      context.fillStyle = particle.color;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);

      context.fill();
      context.restore();
    });
  }

  drawFlash(context) {
    if (this.flashOpacity <= 0 || !this.currentImpact) return;

    context.save();

    context.globalAlpha = this.flashOpacity;
    context.fillStyle = "#fff5c4";

    context.beginPath();
    context.arc(
      this.currentImpact.x,
      this.currentImpact.y,
      this.impactRadius,
      0,
      Math.PI * 2
    );

    context.fill();
    context.restore();
  }
}
