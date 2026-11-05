export class ThunderShockAnimation {
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

    this.prepareDuration = 18;
    this.fireDuration = 16;
    this.impactDuration = 24;
    this.finishDuration = 20;

    this.sparkles = [];
    this.impacts = [];
    this.mainBolt = [];
    this.branches = [];

    this.createSparkles();
  }

  update(context) {
    if (this.isFinished) return;

    switch (this.state) {
      case "PREPARE":
        this.updatePrepare(context);
        break;

      case "FIRE":
        this.updateFire(context);
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
    const attacker = this.pokemonViewer.sprite;
    const target = this.targetViewer.sprite;

    const startX = attacker.position.x + attacker.frameWidth / 2;
    const startY = attacker.position.y + attacker.frameHeight / 2;
    const targetX = target.position.x + target.frameWidth / 2;
    const targetY = target.position.y + target.frameHeight / 2;

    return { startX, startY, targetX, targetY };
  }

  createSparkles() {
    for (let i = 0; i < 22; i++) {
      this.sparkles.push({
        angle: Math.random() * Math.PI * 2,
        radius: 10 + Math.random() * 25,
        speed: 0.08 + Math.random() * 0.08,
        size: 1 + Math.random() * 2,
        alpha: 0.5 + Math.random() * 0.5,
      });
    }
  }

  updatePrepare(context) {
    this.drawCharge(context);
    this.updateSparkles();
    this.drawSparkles(context);

    if (this.timer >= this.prepareDuration) {
      this.setState("FIRE");
      this.generateBolt();
    }
  }

  updateFire(context) {
    this.drawBolt(context);

    if (this.timer % 3 === 0) {
      this.generateBolt();
    }

    if (this.timer >= this.fireDuration) {
      this.createImpact();
      this.game.canvas.startShake(180, 3);
      this.setState("IMPACT");
    }
  }

  updateImpact(context) {
    this.drawImpact(context);
    this.updateImpactParticles(context);

    if (this.timer % 4 === 0) {
      this.generateImpactBranches();
    }

    if (this.timer >= this.impactDuration) {
      this.setState("FINISH");
    }
  }

  updateFinish(context) {
    const alpha = 1 - this.timer / this.finishDuration;

    this.drawImpact(context, alpha);
    this.updateImpactParticles(context);

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

  drawCharge(context) {
    const { startX, startY } = this.getPositions();

    context.save();

    const pulse = 0.7 + Math.sin(this.timer * 0.35) * 0.3;

    context.globalAlpha = pulse;
    context.fillStyle = "#ffe45e";
    context.shadowColor = "#fff000";
    context.shadowBlur = 18;

    context.beginPath();
    context.arc(startX, startY, 12 + pulse * 5, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }

  drawSparkles(context) {
    const { startX, startY } = this.getPositions();

    context.save();
    context.shadowColor = "#fff000";
    context.shadowBlur = 8;

    for (const sparkle of this.sparkles) {
      const x = startX + Math.cos(sparkle.angle) * sparkle.radius;
      const y = startY + Math.sin(sparkle.angle) * sparkle.radius;

      context.globalAlpha = sparkle.alpha;
      context.fillStyle = "#fff5a3";

      context.beginPath();
      context.arc(x, y, sparkle.size, 0, Math.PI * 2);
      context.fill();
    }

    context.restore();
  }

  generateBolt() {
    const { startX, startY, targetX, targetY } = this.getPositions();

    const dx = targetX - startX;
    const dy = targetY - startY;
    const distance = Math.hypot(dx, dy);

    const segments = Math.max(5, Math.floor(distance / 14));

    this.mainBolt = [];

    for (let i = 0; i <= segments; i++) {
      const progress = i / segments;

      const jitter = i === 0 || i === segments ? 0 : (Math.random() - 0.5) * 24;

      this.mainBolt.push({
        x: startX + dx * progress + (Math.random() - 0.5) * jitter,
        y: startY + dy * progress + (Math.random() - 0.5) * jitter,
      });
    }

    this.branches = [];

    for (let i = 1; i < segments; i++) {
      if (Math.random() < 0.45) {
        this.createBranch(this.mainBolt[i], dx, dy);
      }
    }
  }

  createBranch(origin, dx, dy) {
    const length = 10 + Math.random() * 24;
    const angle =
      Math.atan2(dy, dx) +
      (Math.random() < 0.5 ? -1 : 1) * (0.5 + Math.random() * 0.8);

    const segments = 2 + Math.floor(Math.random() * 3);
    const branch = [{ x: origin.x, y: origin.y }];

    let x = origin.x;
    let y = origin.y;

    for (let i = 0; i < segments; i++) {
      x += (Math.cos(angle) * length) / segments + (Math.random() - 0.5) * 8;
      y += (Math.sin(angle) * length) / segments + (Math.random() - 0.5) * 8;

      branch.push({ x, y });
    }

    this.branches.push(branch);
  }

  drawBolt(context) {
    if (this.mainBolt.length < 2) return;

    context.save();
    context.lineJoin = "round";
    context.lineCap = "round";

    this.drawLightningPath(context, this.mainBolt, 10, "#e9a900", 16);
    this.drawLightningPath(context, this.mainBolt, 5, "#ffe329", 8);
    this.drawLightningPath(context, this.mainBolt, 2, "#ffffff", 3);

    for (const branch of this.branches) {
      this.drawLightningPath(context, branch, 4, "#ffdf35", 7);
      this.drawLightningPath(context, branch, 1.5, "#ffffff", 2);
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
    context.shadowColor = "#fff000";
    context.shadowBlur = blur;
    context.stroke();
  }

  createImpact() {
    const { targetX, targetY } = this.getPositions();

    for (let i = 0; i < 28; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 4;

      this.impacts.push({
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
    const { targetX, targetY } = this.getPositions();

    const origin = {
      x: targetX + (Math.random() - 0.5) * 30,
      y: targetY + (Math.random() - 0.5) * 35,
    };

    const dx = Math.random() < 0.5 ? -1 : 1;
    const dy = Math.random() * 2 - 1;

    this.createBranch(origin, dx * 30, dy * 30);
  }

  drawImpact(context, alpha = 1) {
    const { targetX, targetY } = this.getPositions();

    context.save();
    context.globalAlpha = alpha;

    const pulse = 0.7 + Math.sin(this.timer * 0.7) * 0.3;

    context.fillStyle = "#fff9a6";
    context.shadowColor = "#ffdb00";
    context.shadowBlur = 20;

    context.beginPath();
    context.arc(targetX, targetY, 10 + pulse * 8, 0, Math.PI * 2);
    context.fill();

    for (const branch of this.branches) {
      this.drawLightningPath(context, branch, 4, "#ffdf35", 8);
      this.drawLightningPath(context, branch, 1.5, "#ffffff", 3);
    }

    context.restore();
  }

  updateImpactParticles(context) {
    context.save();

    for (const particle of this.impacts) {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += 0.04;
      particle.life -= 0.035;

      context.globalAlpha = Math.max(0, particle.life);
      context.fillStyle = "#fff064";
      context.shadowColor = "#ffdf00";
      context.shadowBlur = 8;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fill();
    }

    this.impacts = this.impacts.filter((particle) => particle.life > 0);

    context.restore();
  }
}
