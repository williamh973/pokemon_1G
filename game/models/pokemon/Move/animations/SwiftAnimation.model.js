export class SwiftAnimation {
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

    this.starCount = 10;
    this.stars = [];
    this.particles = [];
    this.impacts = [];

    this.launchInterval = 5;
    this.launchIndex = 0;

    this.auraOpacity = 0;
    this.flashOpacity = 0;

    this.lastImpact = false;
    this.impactTimer = 0;

    this.createStars();
  }

  createStars() {
    for (let i = 0; i < this.starCount; i++) {
      const spread = (Math.random() - 0.5) * 0.8;
      const variation = (Math.random() - 0.5) * 45;

      this.stars.push({
        x: this.attackerX,
        y: this.attackerY,
        startX: this.attackerX,
        startY: this.attackerY,

        targetX: this.targetX + spread * this.targetViewer.sprite.frameWidth,

        targetY: this.targetY + variation,

        progress: 0,
        speed: 0.045 + Math.random() * 0.018,

        curve: (Math.random() - 0.5) * 70,

        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,

        size: 7 + Math.random() * 4,

        launched: false,
        finished: false,

        last: i === this.starCount - 1,
      });
    }
  }

  update(context) {
    this.timer++;

    switch (this.phase) {
      case "PREPARE":
        this.updatePrepare();
        break;

      case "FORMATION":
        this.updateFormation();
        break;

      case "BARRAGE":
        this.updateBarrage();
        break;

      case "FINISH":
        this.updateFinish();
        break;
    }

    this.updateParticles();
    this.updateImpacts();

    this.draw(context);
  }

  updatePrepare() {
    this.auraOpacity = Math.min(1, this.timer / 15);

    if (this.timer >= 15) {
      this.timer = 0;
      this.phase = "FORMATION";
    }
  }

  updateFormation() {
    this.auraOpacity = 1;

    if (this.timer >= 12) {
      this.timer = 0;
      this.phase = "BARRAGE";
    }
  }

  updateBarrage() {
    if (
      this.launchIndex < this.starCount &&
      this.timer % this.launchInterval === 0
    ) {
      const star = this.stars[this.launchIndex];

      star.launched = true;
      this.launchIndex++;
    }

    this.stars.forEach((star) => {
      if (!star.launched || star.finished) return;

      star.progress += star.speed;

      const progress = Math.min(1, star.progress);

      const eased = progress * progress * (3 - 2 * progress);

      const curveOffset = Math.sin(progress * Math.PI) * star.curve;

      star.x = star.startX + (star.targetX - star.startX) * eased + curveOffset;

      star.y = star.startY + (star.targetY - star.startY) * eased;

      star.rotation += star.rotationSpeed;

      if (progress >= 1) {
        star.finished = true;
        this.createImpact(star);
      }
    });

    if (
      this.launchIndex >= this.starCount &&
      this.stars.every((star) => star.finished)
    ) {
      this.timer = 0;
      this.phase = "FINISH";
    }
  }

  updateFinish() {
    this.auraOpacity = Math.max(0, this.auraOpacity - 0.08);
    this.flashOpacity = Math.max(0, this.flashOpacity - 0.06);

    if (this.timer >= 25) {
      this.isFinished = true;
    }
  }

  createImpact(star) {
    const x = star.targetX;
    const y = star.targetY;

    const isLast = star.last;

    this.impacts.push({
      x,
      y,
      radius: isLast ? 22 : 13,
      life: isLast ? 14 : 9,
      maxLife: isLast ? 14 : 9,
      rotation: Math.random() * Math.PI,
    });

    this.createImpactParticles(x, y, isLast);

    this.flashOpacity = isLast ? 0.8 : 0.2;

    if (isLast && this.game.canvas?.startShake) {
      this.game.canvas.startShake(8, 3);
    }
  }

  createImpactParticles(x, y, isLast) {
    const count = isLast ? 18 : 8;

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = isLast ? 2 + Math.random() * 4 : 1 + Math.random() * 2.5;

      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 1.5 + Math.random() * 2.5,
        life: 12 + Math.random() * 8,
        maxLife: 20,
        color: Math.random() > 0.5 ? "#fff4ad" : "#ffffff",
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
  }

  updateImpacts() {
    this.impacts.forEach((impact) => {
      impact.radius *= 1.12;
      impact.life--;
      impact.rotation += 0.08;
    });

    this.impacts = this.impacts.filter((impact) => impact.life > 0);
  }

  draw(context) {
    if (this.phase === "PREPARE") {
      this.drawPreparation(context);
    }

    if (this.phase === "FORMATION") {
      this.drawFormation(context);
    }

    if (this.phase === "BARRAGE") {
      this.drawBarrage(context);
    }

    if (this.phase === "FINISH") {
      this.drawBarrage(context);
    }

    this.drawImpacts(context);
    this.drawParticles(context);
    this.drawFlash(context);
  }

  drawPreparation(context) {
    context.save();

    const gradient = context.createRadialGradient(
      this.attackerX,
      this.attackerY,
      2,
      this.attackerX,
      this.attackerY,
      30
    );

    gradient.addColorStop(0, "rgba(255,255,230,0.9)");
    gradient.addColorStop(0.4, "rgba(255,210,80,0.5)");
    gradient.addColorStop(1, "rgba(255,180,30,0)");

    context.globalAlpha = this.auraOpacity;
    context.fillStyle = gradient;

    context.beginPath();
    context.arc(this.attackerX, this.attackerY, 30, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }

  drawFormation(context) {
    context.save();

    const positions = [
      { x: -18, y: -15 },
      { x: 0, y: -28 },
      { x: 18, y: -15 },
      { x: -25, y: 5 },
      { x: 25, y: 5 },
    ];

    positions.forEach((position, index) => {
      const angle = this.timer * 0.08 + index * 0.5;

      const x = this.attackerX + position.x + Math.cos(angle) * 3;

      const y = this.attackerY + position.y + Math.sin(angle) * 3;

      this.drawStar(context, x, y, 5 + Math.sin(angle) * 1.5, angle, 0.85);
    });

    context.restore();
  }

  drawBarrage(context) {
    this.stars.forEach((star) => {
      if (!star.launched || star.finished) return;

      const progress = star.progress;

      const alpha = Math.min(1, progress * 5);

      context.save();

      context.globalAlpha = alpha;

      // Traînée lumineuse
      const tailLength = star.last ? 38 : 23;

      const gradient = context.createLinearGradient(
        star.x - this.direction * tailLength,
        star.y,
        star.x,
        star.y
      );

      gradient.addColorStop(0, "rgba(255,190,40,0)");
      gradient.addColorStop(0.5, "rgba(255,215,90,0.5)");
      gradient.addColorStop(1, "rgba(255,255,230,0.95)");

      context.strokeStyle = gradient;
      context.lineWidth = star.last ? 5 : 3;
      context.lineCap = "round";

      context.beginPath();
      context.moveTo(star.x - this.direction * tailLength, star.y);
      context.lineTo(star.x, star.y);
      context.stroke();

      // Étoile
      this.drawStar(
        context,
        star.x,
        star.y,
        star.size * (star.last ? 1.6 : 1),
        star.rotation,
        1
      );

      context.restore();
    });
  }

  drawStar(context, x, y, radius, rotation, alpha) {
    context.save();

    context.translate(x, y);
    context.rotate(rotation);

    context.globalAlpha *= alpha;

    // Halo
    const gradient = context.createRadialGradient(0, 0, 1, 0, 0, radius * 2);

    gradient.addColorStop(0, "rgba(255,255,255,0.95)");
    gradient.addColorStop(0.4, "rgba(255,224,110,0.55)");
    gradient.addColorStop(1, "rgba(255,180,30,0)");

    context.fillStyle = gradient;

    context.beginPath();
    context.arc(0, 0, radius * 2, 0, Math.PI * 2);
    context.fill();

    // Étoile à cinq branches
    context.beginPath();

    for (let i = 0; i < 10; i++) {
      const angle = (Math.PI * 2 * i) / 10 - Math.PI / 2;
      const r = i % 2 === 0 ? radius : radius * 0.4;

      const px = Math.cos(angle) * r;
      const py = Math.sin(angle) * r;

      if (i === 0) {
        context.moveTo(px, py);
      } else {
        context.lineTo(px, py);
      }
    }

    context.closePath();

    context.fillStyle = "#ffe48a";
    context.fill();

    context.strokeStyle = "#ffffff";
    context.lineWidth = 1.5;
    context.stroke();

    // Centre blanc
    context.fillStyle = "#ffffff";

    context.beginPath();
    context.arc(0, 0, radius * 0.18, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }

  drawImpacts(context) {
    this.impacts.forEach((impact) => {
      const alpha = impact.life / impact.maxLife;

      context.save();

      context.translate(impact.x, impact.y);
      context.rotate(impact.rotation);

      context.globalAlpha = alpha;

      context.strokeStyle = "#fff0a0";
      context.lineWidth = 2;

      context.beginPath();

      context.arc(0, 0, impact.radius, 0, Math.PI * 2);

      context.stroke();

      context.fillStyle = "rgba(255,225,120,0.35)";

      context.beginPath();

      for (let i = 0; i < 10; i++) {
        const angle = (Math.PI * 2 * i) / 10 - Math.PI / 2;
        const radius = i % 2 === 0 ? impact.radius * 0.8 : impact.radius * 0.3;

        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        if (i === 0) {
          context.moveTo(x, y);
        } else {
          context.lineTo(x, y);
        }
      }

      context.closePath();
      context.fill();

      context.restore();
    });
  }

  drawParticles(context) {
    this.particles.forEach((particle) => {
      context.save();

      context.globalAlpha = particle.life / particle.maxLife;
      context.fillStyle = particle.color;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);

      context.fill();

      context.restore();
    });
  }

  drawFlash(context) {
    if (this.flashOpacity <= 0) return;

    context.save();

    context.globalAlpha = this.flashOpacity;
    context.fillStyle = "#fff8d8";

    context.beginPath();
    context.arc(this.targetX, this.targetY, 22, 0, Math.PI * 2);

    context.fill();

    context.restore();
  }
}
