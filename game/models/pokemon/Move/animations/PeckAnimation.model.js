export class PeckAnimation {
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

    this.sprite = this.pokemonViewer.sprite;

    this.originalX = this.sprite.position.x;
    this.originalY = this.sprite.position.y;

    this.attackerX = this.originalX + this.sprite.frameWidth / 2;

    this.attackerY = this.originalY + this.sprite.frameHeight / 2;

    this.targetX =
      this.targetViewer.sprite.position.x +
      this.targetViewer.sprite.frameWidth / 2;

    this.targetY =
      this.targetViewer.sprite.position.y +
      this.targetViewer.sprite.frameHeight / 2;

    this.direction = this.attackerX < this.targetX ? 1 : -1;

    this.distance = 0;
    this.impactOpacity = 0;
    this.impactScale = 0;

    this.particles = [];
    this.slashLines = [];

    this.createSlashLines();
  }

  update(context) {
    this.timer++;

    switch (this.phase) {
      case "PREPARE":
        this.updatePrepare();
        break;

      case "STRIKE":
        this.updateStrike();
        break;

      case "IMPACT":
        this.updateImpact();
        break;

      case "RECOVER":
        this.updateRecover();
        break;
    }

    this.updateParticles();

    this.draw(context);
  }

  updatePrepare() {
    this.distance = -3;

    if (this.timer >= 5) {
      this.timer = 0;
      this.phase = "STRIKE";
    }
  }

  updateStrike() {
    const progress = Math.min(1, this.timer / 6);

    // Accélération très rapide vers la cible
    const eased = 1 - Math.pow(1 - progress, 3);

    this.distance = 28 * eased;

    if (this.timer >= 6) {
      this.timer = 0;
      this.phase = "IMPACT";

      this.createImpactParticles();

      if (this.game.canvas?.startShake) {
        this.game.canvas.startShake(5, 2);
      }
    }
  }

  updateImpact() {
    this.distance = 28;

    this.impactOpacity = Math.max(0, 1 - this.timer / 9);

    this.impactScale = Math.min(1.4, this.timer / 4);

    if (this.timer >= 9) {
      this.timer = 0;
      this.phase = "RECOVER";
    }
  }

  updateRecover() {
    const progress = Math.min(1, this.timer / 7);

    const eased = progress * progress * (3 - 2 * progress);

    this.distance = 28 * (1 - eased);

    if (this.timer >= 7) {
      this.sprite.position.x = this.originalX;
      this.sprite.position.y = this.originalY;

      this.isFinished = true;
    }
  }

  createSlashLines() {
    for (let i = 0; i < 4; i++) {
      this.slashLines.push({
        offsetY: (i - 1.5) * 9,
        length: 12 + Math.random() * 9,
        opacity: 0.7 + Math.random() * 0.3,
      });
    }
  }

  createImpactParticles() {
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 * i) / 12;

      const speed = 1.5 + Math.random() * 3;

      this.particles.push({
        x: this.targetX,
        y: this.targetY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 2 + Math.random() * 2,
        life: 12 + Math.random() * 5,
        maxLife: 17,
      });
    }
  }

  updateParticles() {
    this.particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      particle.vx *= 0.92;
      particle.vy *= 0.92;

      particle.life--;
    });

    this.particles = this.particles.filter((particle) => particle.life > 0);
  }

  draw(context) {
    // Déplacement temporaire du Pokémon attaquant
    this.sprite.position.x = this.originalX + this.direction * this.distance;

    this.sprite.position.y = this.originalY;

    if (this.phase === "STRIKE" || this.phase === "IMPACT") {
      this.drawMotionLines(context);
    }

    if (this.phase === "IMPACT") {
      this.drawImpact(context);
    }

    this.drawParticles(context);
  }

  drawMotionLines(context) {
    const progress = this.phase === "STRIKE" ? this.timer / 6 : 1;

    context.save();

    context.globalAlpha = Math.min(1, progress * 1.5);

    const startX = this.attackerX + this.direction * this.distance * 0.4;

    const startY = this.attackerY - 3;

    this.slashLines.forEach((line) => {
      context.strokeStyle = "#fff4c2";
      context.lineWidth = 2;
      context.lineCap = "round";

      context.beginPath();

      context.moveTo(
        startX - this.direction * line.length,
        startY + line.offsetY
      );

      context.lineTo(startX, startY + line.offsetY);

      context.stroke();
    });

    context.restore();
  }

  drawImpact(context) {
    context.save();

    context.globalAlpha = this.impactOpacity;

    const radius = 15 * this.impactScale;

    // Éclair d'impact
    context.strokeStyle = "#ffffff";
    context.lineWidth = 3;
    context.lineCap = "round";

    context.beginPath();
    context.moveTo(this.targetX - radius, this.targetY - radius * 0.5);

    context.lineTo(this.targetX - radius * 0.25, this.targetY - radius * 0.15);

    context.lineTo(this.targetX + radius * 0.2, this.targetY - radius);

    context.stroke();

    context.beginPath();
    context.moveTo(this.targetX + radius * 0.2, this.targetY + radius);

    context.lineTo(this.targetX + radius * 0.35, this.targetY + radius * 0.15);

    context.lineTo(this.targetX + radius, this.targetY + radius * 0.4);

    context.stroke();

    // Étoile centrale
    this.drawStar(context, this.targetX, this.targetY, 7 * this.impactScale);

    context.restore();
  }

  drawStar(context, x, y, radius) {
    context.save();

    context.translate(x, y);

    context.beginPath();

    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8;

      const r = i % 2 === 0 ? radius : radius * 0.25;

      const px = Math.cos(angle) * r;
      const py = Math.sin(angle) * r;

      if (i === 0) {
        context.moveTo(px, py);
      } else {
        context.lineTo(px, py);
      }
    }

    context.closePath();

    context.fillStyle = "#fff4a8";
    context.fill();

    context.strokeStyle = "#ffffff";
    context.lineWidth = 1;
    context.stroke();

    context.restore();
  }

  drawParticles(context) {
    this.particles.forEach((particle) => {
      context.save();

      context.globalAlpha = particle.life / particle.maxLife;
      context.fillStyle = "#fff4b0";

      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);

      context.fill();

      context.restore();
    });
  }
}
