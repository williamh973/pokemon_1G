export class ThunderBoltAnimation {
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

    this.state = "PREPARE";
    this.timer = 0;
    this.isFinished = false;

    this.prepareDuration = 20;
    this.strikeDuration = 20;
    this.impactDuration = 26;
    this.finishDuration = 20;

    this.sparkles = [];
    this.mainBolt = [];
    this.branches = [];
    this.impactBranches = [];
    this.particles = [];

    this.flashAlpha = 0;
    this.impactCreated = false;

    this.createSparkles();
  }

  update(context) {
    if (this.isFinished) return;

    switch (this.state) {
      case "PREPARE":
        this.updatePrepare(context);
        break;

      case "STRIKE":
        this.updateStrike(context);
        break;

      case "IMPACT":
        this.updateImpact(context);
        break;

      case "FINISH":
        this.updateFinish(context);
        break;
    }

    this.timer++;
  }

  getPositions() {
    const sprite = this.targetViewer.sprite;

    return {
      targetX: sprite.position.x + sprite.frameWidth / 2,
      targetY: sprite.position.y + sprite.frameHeight,
      targetWidth: sprite.frameWidth,
      targetHeight: sprite.frameHeight,
    };
  }

  createSparkles() {
    for (let i = 0; i < 28; i++) {
      this.sparkles.push({
        angle: Math.random() * Math.PI * 2,
        radius: 12 + Math.random() * 35,
        speed: 0.04 + Math.random() * 0.09,
        size: 1 + Math.random() * 2.5,
        alpha: 0.4 + Math.random() * 0.6,
      });
    }
  }

  updatePrepare(context) {
    this.updateSparkles();

    this.drawStormCharge(context);
    this.drawSparkles(context);

    if (this.timer >= this.prepareDuration) {
      this.generateBolt();
      this.setState("STRIKE");
    }
  }

  updateStrike(context) {
    // La foudre change de forme pendant sa frappe.
    if (this.timer % 3 === 0) {
      this.generateBolt();
    }

    this.drawBolt(context, 1);

    if (this.timer >= this.strikeDuration) {
      this.createImpact();
      this.game.canvas.startShake(280, 5);
      this.setState("IMPACT");
    }
  }

  updateImpact(context) {
    this.drawImpact(context, 1);
    this.updateParticles(context);

    if (this.timer % 4 === 0) {
      this.generateImpactBranches();
    }

    if (this.timer >= this.impactDuration) {
      this.setState("FINISH");
    }
  }

  updateFinish(context) {
    const progress = Math.min(this.timer / this.finishDuration, 1);

    const alpha = 1 - progress;

    this.drawImpact(context, alpha);
    this.updateParticles(context, alpha);

    if (this.timer >= this.finishDuration) {
      this.isFinished = true;
    }
  }

  setState(state) {
    this.state = state;
    this.timer = 0;
  }

  updateSparkles() {
    for (const sparkle of this.sparkles) {
      sparkle.angle += sparkle.speed;
    }
  }

  drawStormCharge(context) {
    const { targetX, targetY, targetHeight } = this.getPositions();

    const chargeY = targetY - targetHeight * 0.65;
    const pulse = 0.5 + Math.sin(this.timer * 0.4) * 0.5;

    context.save();

    const gradient = context.createRadialGradient(
      targetX,
      chargeY,
      1,
      targetX,
      chargeY,
      30 + pulse * 10
    );

    gradient.addColorStop(0, "rgba(255, 255, 220, 0.95)");
    gradient.addColorStop(0.25, "rgba(255, 220, 40, 0.7)");
    gradient.addColorStop(1, "rgba(255, 180, 0, 0)");

    context.fillStyle = gradient;
    context.beginPath();
    context.arc(targetX, chargeY, 30 + pulse * 10, 0, Math.PI * 2);
    context.fill();

    // Petits arcs électriques autour du point de frappe.
    for (let i = 0; i < 5; i++) {
      const angle = this.timer * 0.18 + (i * Math.PI * 2) / 5;

      const startX = targetX + Math.cos(angle) * 8;
      const startY = chargeY + Math.sin(angle) * 8;

      const endX = targetX + Math.cos(angle) * 25;
      const endY = chargeY + Math.sin(angle) * 25;

      this.drawSmallArc(context, startX, startY, endX, endY);
    }

    context.restore();
  }

  drawSmallArc(context, startX, startY, endX, endY) {
    context.save();

    context.beginPath();
    context.moveTo(startX, startY);

    const segments = 3;

    for (let i = 1; i < segments; i++) {
      const progress = i / segments;

      context.lineTo(
        startX + (endX - startX) * progress + (Math.random() - 0.5) * 10,
        startY + (endY - startY) * progress + (Math.random() - 0.5) * 10
      );
    }

    context.lineTo(endX, endY);

    context.strokeStyle = "#fff9a6";
    context.lineWidth = 2;
    context.shadowColor = "#ffdb00";
    context.shadowBlur = 10;
    context.stroke();

    context.restore();
  }

  drawSparkles(context) {
    const { targetX, targetY, targetHeight } = this.getPositions();

    const centerY = targetY - targetHeight * 0.65;

    context.save();
    context.shadowColor = "#ffec58";
    context.shadowBlur = 8;

    for (const sparkle of this.sparkles) {
      const x = targetX + Math.cos(sparkle.angle) * sparkle.radius;

      const y = centerY + Math.sin(sparkle.angle) * sparkle.radius * 0.5;

      context.globalAlpha = sparkle.alpha;
      context.fillStyle = "#fff8b0";

      context.beginPath();
      context.arc(x, y, sparkle.size, 0, Math.PI * 2);
      context.fill();
    }

    context.restore();
  }

  generateBolt() {
    const { targetX, targetY, targetHeight } = this.getPositions();

    const startY = -15;
    const endY = targetY - targetHeight * 0.15;
    const distance = endY - startY;

    const segments = Math.max(8, Math.floor(distance / 12));

    // Le point de départ et l'arrivée restent alignés
    // avec la cible ; les segments intermédiaires zigzaguent.
    this.mainBolt = [];

    const startX = targetX + (Math.random() - 0.5) * 12;

    for (let i = 0; i <= segments; i++) {
      const progress = i / segments;

      const x =
        i === 0 || i === segments
          ? startX
          : startX + (Math.random() - 0.5) * 48;

      const y = startY + distance * progress;

      this.mainBolt.push({ x, y });
    }

    this.mainBolt[this.mainBolt.length - 1].x = targetX;
    this.mainBolt[this.mainBolt.length - 1].y = endY;

    this.branches = [];

    for (let i = 2; i < segments; i++) {
      if (Math.random() < 0.55) {
        const direction = Math.random() < 0.5 ? -1 : 1;
        const length = 12 + Math.random() * 35;

        this.createBranch(
          this.mainBolt[i],
          direction * length,
          (Math.random() - 0.5) * length
        );
      }
    }
  }

  createBranch(origin, dx, dy) {
    const segments = 2 + Math.floor(Math.random() * 3);
    const points = [{ x: origin.x, y: origin.y }];

    let x = origin.x;
    let y = origin.y;

    for (let i = 1; i <= segments; i++) {
      const progress = i / segments;

      x =
        origin.x +
        dx * progress +
        (i === segments ? 0 : (Math.random() - 0.5) * 12);

      y =
        origin.y +
        dy * progress +
        (i === segments ? 0 : (Math.random() - 0.5) * 12);

      points.push({ x, y });
    }

    this.branches.push(points);
  }

  drawBolt(context, alpha = 1) {
    if (this.mainBolt.length < 2) return;

    context.save();
    context.globalAlpha = alpha;
    context.lineJoin = "round";
    context.lineCap = "round";

    this.drawLightningPath(context, this.mainBolt, 12, "#e6a500", 20);

    this.drawLightningPath(context, this.mainBolt, 7, "#ffe32b", 12);

    this.drawLightningPath(context, this.mainBolt, 3, "#ffffff", 5);

    for (const branch of this.branches) {
      this.drawLightningPath(context, branch, 4, "#ffd52b", 9);

      this.drawLightningPath(context, branch, 1.5, "#ffffff", 3);
    }

    context.restore();
  }

  drawLightningPath(context, points, width, color, blur) {
    if (points.length < 2) return;

    context.beginPath();
    context.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
      context.lineTo(points[i].x, points[i].y);
    }

    context.strokeStyle = color;
    context.lineWidth = width;
    context.shadowColor = "#ffdf00";
    context.shadowBlur = blur;
    context.stroke();
  }

  createImpact() {
    const { targetX, targetY } = this.getPositions();

    for (let i = 0; i < 38; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 5;

      this.particles.push({
        x: targetX,
        y: targetY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 1.5 + Math.random() * 3,
        life: 1,
      });
    }

    this.generateImpactBranches();
  }

  generateImpactBranches() {
    const { targetX, targetY, targetWidth, targetHeight } = this.getPositions();

    const origin = {
      x: targetX + (Math.random() - 0.5) * targetWidth * 0.8,
      y: targetY + (Math.random() - 0.5) * targetHeight * 0.8,
    };

    const direction = Math.random() < 0.5 ? -1 : 1;
    const length = 12 + Math.random() * 28;

    const points = [{ x: origin.x, y: origin.y }];

    let x = origin.x;
    let y = origin.y;

    const segments = 3;

    for (let i = 0; i < segments; i++) {
      x += (direction * length) / segments + (Math.random() - 0.5) * 12;

      y += (Math.random() - 0.5) * 20;

      points.push({ x, y });
    }

    this.impactBranches.push({
      points,
      life: 1,
    });
  }

  drawImpact(context, alpha = 1) {
    const { targetX, targetY, targetHeight } = this.getPositions();

    context.save();
    context.globalAlpha = alpha;

    const pulse = 0.7 + Math.sin(this.timer * 0.8) * 0.3;
    const radius = targetHeight * (0.35 + pulse * 0.2);

    const gradient = context.createRadialGradient(
      targetX,
      targetY,
      1,
      targetX,
      targetY,
      radius
    );

    gradient.addColorStop(0, "rgba(255, 255, 235, 0.95)");
    gradient.addColorStop(0.3, "rgba(255, 235, 90, 0.8)");
    gradient.addColorStop(1, "rgba(255, 190, 0, 0)");

    context.fillStyle = gradient;
    context.beginPath();
    context.arc(targetX, targetY, radius, 0, Math.PI * 2);
    context.fill();

    for (const branch of this.impactBranches) {
      context.globalAlpha = alpha * branch.life;

      this.drawLightningPath(context, branch.points, 4, "#ffdf35", 9);

      this.drawLightningPath(context, branch.points, 1.5, "#ffffff", 3);
    }

    context.restore();
  }

  updateParticles(context, intensity = 1) {
    context.save();

    for (const particle of this.particles) {
      particle.x += particle.vx;
      particle.y += particle.vy;

      particle.vx *= 0.97;
      particle.vy *= 0.97;
      particle.life -= 0.035;

      context.globalAlpha = Math.max(0, particle.life) * intensity;
      context.fillStyle = "#fff36b";
      context.shadowColor = "#ffdf00";
      context.shadowBlur = 8;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fill();
    }

    this.particles = this.particles.filter((particle) => particle.life > 0);

    for (const branch of this.impactBranches) {
      branch.life -= 0.025;
    }

    this.impactBranches = this.impactBranches.filter(
      (branch) => branch.life > 0
    );

    context.restore();
  }
}
