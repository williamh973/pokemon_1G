export class StringShotAnimation {
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

    this.attackerX =
      this.pokemonViewer.sprite.position.x +
      this.pokemonViewer.sprite.frameWidth / 2;

    this.attackerY =
      this.pokemonViewer.sprite.position.y +
      this.pokemonViewer.sprite.frameHeight / 2;

    this.targetX =
      this.targetViewer.sprite.position.x +
      this.targetViewer.sprite.frameWidth / 2;

    this.targetY =
      this.targetViewer.sprite.position.y +
      this.targetViewer.sprite.frameHeight / 2;

    this.direction = this.attackerX < this.targetX ? 1 : -1;

    this.targetWidth = this.targetViewer.sprite.frameWidth;
    this.targetHeight = this.targetViewer.sprite.frameHeight;

    this.strands = [];
    this.particles = [];
    this.threads = [];

    this.projectileProgress = 0;
    this.wrapProgress = 0;
    this.tightenProgress = 0;
    this.opacity = 1;

    this.pulse = 0;
    this.silkGlow = 0;

    this.createStrands();
  }

  createStrands() {
    const count = 9;

    for (let i = 0; i < count; i++) {
      const startX = this.attackerX + this.direction * 12;
      const startY = this.attackerY - 5 + (Math.random() - 0.5) * 12;

      const endX =
        this.targetX + (Math.random() - 0.5) * this.targetWidth * 0.8;

      const endY =
        this.targetY + (Math.random() - 0.5) * this.targetHeight * 0.9;

      this.strands.push({
        startX,
        startY,
        endX,
        endY,
        controlX: (startX + endX) / 2,
        controlY: (startY + endY) / 2 + (Math.random() - 0.5) * 35,
        offset: Math.random() * Math.PI * 2,
        thickness: 1 + Math.random() * 1.5,
        speed: 0.04 + Math.random() * 0.025,
        progress: 0,
      });
    }
  }

  update(context) {
    this.timer++;

    switch (this.phase) {
      case "PREPARE":
        this.updatePrepare();
        break;

      case "SHOOT":
        this.updateShoot();
        break;

      case "WRAP":
        this.updateWrap();
        break;

      case "TIGHTEN":
        this.updateTighten();
        break;

      case "FINISH":
        this.updateFinish();
        break;
    }

    this.updateParticles();
    this.updateThreads();
    this.draw(context);
  }

  updatePrepare() {
    this.silkGlow = Math.min(1, this.timer / 15);

    if (this.timer >= 15) {
      this.timer = 0;
      this.phase = "SHOOT";
    }
  }

  updateShoot() {
    this.projectileProgress = Math.min(1, this.timer / 24);

    this.strands.forEach((strand) => {
      strand.progress = Math.min(1, strand.progress + strand.speed);
    });

    if (this.timer % 3 === 0) {
      this.createSilkParticles();
    }

    if (this.timer >= 24) {
      this.timer = 0;
      this.phase = "WRAP";
      this.createWrappingThreads();
    }
  }

  updateWrap() {
    this.wrapProgress = Math.min(1, this.timer / 28);

    this.pulse += 0.12;

    this.threads.forEach((thread) => {
      thread.progress = Math.min(1, thread.progress + thread.speed);
    });

    if (this.timer % 5 === 0) {
      this.createSilkParticles();
    }

    if (this.timer >= 28) {
      this.timer = 0;
      this.phase = "TIGHTEN";
    }
  }

  updateTighten() {
    this.tightenProgress = Math.min(1, this.timer / 24);

    this.pulse += 0.2;

    if (this.timer % 6 === 0) {
      this.createSilkParticles();
    }

    if (this.timer >= 24) {
      this.timer = 0;
      this.phase = "FINISH";
    }
  }

  updateFinish() {
    this.opacity = Math.max(0, 1 - this.timer / 30);

    if (this.timer >= 30) {
      this.isFinished = true;
    }
  }

  createWrappingThreads() {
    const count = 13;

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;

      const radiusX = this.targetWidth * 0.55;
      const radiusY = this.targetHeight * 0.55;

      const startX = this.targetX + Math.cos(angle) * radiusX;
      const startY = this.targetY + Math.sin(angle) * radiusY;

      const endAngle = angle + Math.PI * 1.5;

      const endX = this.targetX + Math.cos(endAngle) * radiusX;
      const endY = this.targetY + Math.sin(endAngle) * radiusY;

      this.threads.push({
        startX,
        startY,
        endX,
        endY,
        controlX: this.targetX + Math.cos(angle + 0.8) * radiusX * 1.2,
        controlY: this.targetY + Math.sin(angle + 0.8) * radiusY * 1.2,
        progress: 0,
        speed: 0.035 + Math.random() * 0.02,
        offset: Math.random() * Math.PI * 2,
        thickness: 1 + Math.random() * 1.5,
      });
    }
  }

  createSilkParticles() {
    for (let i = 0; i < 3; i++) {
      const x =
        this.attackerX +
        (this.targetX - this.attackerX) * this.projectileProgress;

      const y =
        this.attackerY +
        (this.targetY - this.attackerY) * this.projectileProgress;

      this.particles.push({
        x: x + (Math.random() - 0.5) * 35,
        y: y + (Math.random() - 0.5) * 35,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        radius: 1 + Math.random() * 2,
        life: 18 + Math.random() * 12,
        maxLife: 30,
      });
    }
  }

  updateThreads() {
    this.strands.forEach((strand) => {
      strand.offset += 0.08;
    });

    this.threads.forEach((thread) => {
      thread.offset += 0.08;
    });
  }

  updateParticles() {
    this.particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      particle.vx *= 0.98;
      particle.vy *= 0.98;

      particle.life--;
    });

    this.particles = this.particles.filter((particle) => particle.life > 0);
  }

  draw(context) {
    if (this.phase === "PREPARE") {
      this.drawPreparation(context);
    }

    if (this.phase === "SHOOT") {
      this.drawProjection(context);
    }

    if (
      this.phase === "WRAP" ||
      this.phase === "TIGHTEN" ||
      this.phase === "FINISH"
    ) {
      this.drawWeb(context);
    }

    this.drawParticles(context);
  }

  drawPreparation(context) {
    const progress = this.silkGlow;

    context.save();

    context.globalAlpha = progress * 0.8;

    const gradient = context.createRadialGradient(
      this.attackerX,
      this.attackerY,
      1,
      this.attackerX,
      this.attackerY,
      22
    );

    gradient.addColorStop(0, "rgba(255,255,255,0.9)");
    gradient.addColorStop(0.5, "rgba(210,235,255,0.5)");
    gradient.addColorStop(1, "rgba(210,235,255,0)");

    context.fillStyle = gradient;

    context.beginPath();
    context.arc(this.attackerX, this.attackerY, 22, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }

  drawProjection(context) {
    const progress = this.projectileProgress;

    context.save();

    this.strands.forEach((strand) => {
      const x = strand.startX + (strand.endX - strand.startX) * progress;

      const y = strand.startY + (strand.endY - strand.startY) * progress;

      const wave = Math.sin(strand.offset + this.timer * 0.15) * 5;

      const controlX =
        strand.startX + (strand.controlX - strand.startX) * progress;

      const controlY =
        strand.startY + (strand.controlY - strand.startY) * progress + wave;

      context.beginPath();
      context.moveTo(strand.startX, strand.startY);
      context.quadraticCurveTo(controlX, controlY, x, y);

      context.strokeStyle = "rgba(235,245,255,0.85)";
      context.lineWidth = strand.thickness;
      context.lineCap = "round";
      context.stroke();

      context.strokeStyle = "rgba(255,255,255,0.65)";
      context.lineWidth = 0.7;
      context.stroke();
    });

    context.restore();
  }

  drawWeb(context) {
    const progress = this.phase === "FINISH" ? 1 : this.wrapProgress;

    const tighten =
      this.phase === "TIGHTEN"
        ? this.tightenProgress
        : this.phase === "FINISH"
        ? 1
        : 0;

    const opacity = this.phase === "FINISH" ? this.opacity : 1;

    context.save();

    context.globalAlpha = opacity;

    // Toile extérieure
    const radiusX = this.targetWidth * (0.48 - tighten * 0.08);

    const radiusY = this.targetHeight * (0.48 - tighten * 0.08);

    context.strokeStyle = "rgba(235,245,255,0.85)";
    context.lineWidth = 1.8;
    context.lineCap = "round";

    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8;

      const x1 = this.targetX + Math.cos(angle) * radiusX;
      const y1 = this.targetY + Math.sin(angle) * radiusY;

      const x2 = this.targetX - Math.cos(angle) * radiusX;
      const y2 = this.targetY - Math.sin(angle) * radiusY;

      context.beginPath();
      context.moveTo(x1, y1);
      context.lineTo(x2, y2);
      context.stroke();
    }

    // Fils qui s'enroulent
    this.threads.forEach((thread) => {
      const p = Math.min(1, thread.progress * progress);

      const x = thread.startX + (thread.endX - thread.startX) * p;

      const y = thread.startY + (thread.endY - thread.startY) * p;

      const wave = Math.sin(thread.offset + this.timer * 0.12) * 4;

      context.beginPath();
      context.moveTo(thread.startX, thread.startY);

      context.quadraticCurveTo(
        thread.controlX + wave,
        thread.controlY + wave,
        x,
        y
      );

      context.strokeStyle = "rgba(255,255,255,0.9)";
      context.lineWidth = thread.thickness;
      context.stroke();
    });

    // Cercles de soie autour de la cible
    for (let i = 0; i < 4; i++) {
      const angle = this.timer * 0.035 + (i * Math.PI) / 2;

      context.beginPath();
      context.ellipse(
        this.targetX,
        this.targetY,
        radiusX * (0.45 + i * 0.16),
        radiusY * (0.45 + i * 0.16),
        angle,
        0,
        Math.PI * 2
      );

      context.strokeStyle = `rgba(235,245,255,${0.65 - i * 0.1})`;
      context.lineWidth = 1.2;
      context.stroke();
    }

    // Reflets de la soie
    context.globalAlpha *= 0.5 + Math.sin(this.pulse) * 0.2;
    context.fillStyle = "#ffffff";

    for (let i = 0; i < 10; i++) {
      const angle = (Math.PI * 2 * i) / 10;

      const x = this.targetX + Math.cos(angle) * radiusX;
      const y = this.targetY + Math.sin(angle) * radiusY;

      context.beginPath();
      context.arc(x, y, 2, 0, Math.PI * 2);
      context.fill();
    }

    context.restore();
  }

  drawParticles(context) {
    this.particles.forEach((particle) => {
      context.save();

      context.globalAlpha = particle.life / particle.maxLife;
      context.fillStyle = "#ffffff";

      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fill();

      context.restore();
    });
  }
}
