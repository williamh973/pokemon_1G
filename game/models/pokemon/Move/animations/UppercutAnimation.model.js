export class UppercutAnimation {
  constructor(game, viewers, turnAction) {
    this.game = game;
    this.viewers = viewers;
    this.turnAction = turnAction;

    if (viewers.front.slot.content === turnAction.pokemon) {
      this.pokemonViewer = viewers.front;
      this.targetViewer = viewers.back;
    } else {
      this.pokemonViewer = viewers.back;
      this.targetViewer = viewers.front;
    }

    this.attacker = this.pokemonViewer.sprite;
    this.target = this.targetViewer.sprite;

    this.originalAttacker = {
      x: this.attacker.position.x,
      y: this.attacker.position.y,
    };

    this.originalTarget = {
      x: this.target.position.x,
      y: this.target.position.y,
    };

    this.phase = "PREPARE";
    this.timer = 0;
    this.isFinished = false;

    this.particles = [];
    this.speedLines = [];
    this.shockwaves = [];
    this.stars = [];

    this.duration = {
      PREPARE: 12,
      ASCEND: 10,
      IMPACT: 8,
      LAUNCH: 16,
      FALL: 20,
      RETURN: 12,
    };

    this.elapsed = 0;

    this.attackerScale = this.attacker.scale || 1;
    this.targetScale = this.target.scale || 1;

    this.attackerWidth = this.attacker.frameWidth * this.attackerScale;
    this.attackerHeight = this.attacker.frameHeight * this.attackerScale;

    this.targetWidth = this.target.frameWidth * this.targetScale;
    this.targetHeight = this.target.frameHeight * this.targetScale;

    this.attackerCenter = {
      x: this.originalAttacker.x + this.attackerWidth / 2,
      y: this.originalAttacker.y + this.attackerHeight / 2,
    };

    this.targetCenter = {
      x: this.originalTarget.x + this.targetWidth / 2,
      y: this.originalTarget.y + this.targetHeight / 2,
    };

    this.impactPoint = {
      x: this.targetCenter.x,
      y: this.targetCenter.y + this.targetHeight * 0.25,
    };

    this.startAttacker = { ...this.originalAttacker };
    this.startTarget = { ...this.originalTarget };

    this.attackerPeak = {
      x:
        this.originalAttacker.x +
        (this.targetCenter.x - this.attackerCenter.x) * 0.45,
      y: this.originalAttacker.y - 32,
    };

    this.targetPeakY = this.originalTarget.y - 58;

    this.createSpeedLines();
  }

  easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  easeIn(t) {
    return t * t * t;
  }

  easeInOut(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  random(min, max) {
    return Math.random() * (max - min) + min;
  }

  createSpeedLines() {
    for (let i = 0; i < 18; i++) {
      this.speedLines.push({
        x: this.random(-35, 35),
        y: this.random(-70, 30),
        length: this.random(12, 30),
        alpha: this.random(0.25, 0.7),
        width: this.random(1, 2.5),
      });
    }
  }

  createParticles(x, y, count, color = "#ffd45c") {
    for (let i = 0; i < count; i++) {
      const angle = this.random(0, Math.PI * 2);
      const speed = this.random(1.5, 5);

      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: this.random(2, 5),
        life: 1,
        decay: this.random(0.025, 0.055),
        color,
      });
    }
  }

  createStars(x, y, count) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;

      this.stars.push({
        x,
        y,
        vx: Math.cos(angle) * this.random(1.5, 3),
        vy: Math.sin(angle) * this.random(1.5, 3),
        size: this.random(3, 6),
        rotation: this.random(0, Math.PI),
        life: 1,
      });
    }
  }

  createShockwave(x, y) {
    this.shockwaves.push({
      x,
      y,
      radius: 5,
      maxRadius: 45,
      alpha: 1,
      width: 4,
    });
  }

  changePhase(phase) {
    this.phase = phase;
    this.timer = 0;
  }

  update(context) {
    if (this.isFinished) return;

    this.elapsed++;
    this.timer++;

    this.updateParticles();
    this.updateShockwaves();
    this.updateStars();

    switch (this.phase) {
      case "PREPARE":
        this.updatePrepare();
        break;

      case "ASCEND":
        this.updateAscend();
        break;

      case "IMPACT":
        this.updateImpact();
        break;

      case "LAUNCH":
        this.updateLaunch();
        break;

      case "FALL":
        this.updateFall();
        break;

      case "RETURN":
        this.updateReturn();
        break;
    }

    this.draw(context);
  }

  updatePrepare() {
    const t = this.timer / this.duration.PREPARE;

    this.attacker.position.y =
      this.originalAttacker.y + Math.sin(t * Math.PI) * 7;

    this.attacker.position.x = this.originalAttacker.x - this.easeOut(t) * 5;

    if (this.timer >= this.duration.PREPARE) {
      this.changePhase("ASCEND");
    }
  }

  updateAscend() {
    const t = Math.min(this.timer / this.duration.ASCEND, 1);
    const eased = this.easeIn(t);

    this.attacker.position.x =
      this.originalAttacker.x +
      (this.attackerPeak.x - this.originalAttacker.x) * eased;

    this.attacker.position.y =
      this.originalAttacker.y +
      (this.attackerPeak.y - this.originalAttacker.y) * eased;

    if (this.timer % 2 === 0) {
      this.createParticles(
        this.attackerCenter.x,
        this.attacker.position.y + this.attackerHeight * 0.7,
        3,
        "#ffb52e"
      );
    }

    if (this.timer >= this.duration.ASCEND) {
      this.changePhase("IMPACT");
    }
  }

  updateImpact() {
    if (this.timer === 1) {
      this.game.canvas?.startShake?.(11, 350);

      this.createParticles(
        this.impactPoint.x,
        this.impactPoint.y,
        35,
        "#fff3a6"
      );

      this.createParticles(
        this.impactPoint.x,
        this.impactPoint.y,
        22,
        "#ff8b28"
      );

      this.createShockwave(this.impactPoint.x, this.impactPoint.y);

      this.createStars(this.impactPoint.x, this.impactPoint.y, 8);
    }

    if (this.timer >= this.duration.IMPACT) {
      this.changePhase("LAUNCH");
    }
  }

  updateLaunch() {
    const t = Math.min(this.timer / this.duration.LAUNCH, 1);
    const eased = this.easeOut(t);

    this.target.position.y =
      this.originalTarget.y +
      (this.targetPeakY - this.originalTarget.y) * eased;

    this.target.position.x = this.originalTarget.x + Math.sin(t * Math.PI) * 13;

    if (this.timer % 3 === 0) {
      this.createParticles(
        this.targetCenter.x,
        this.target.position.y + this.targetHeight,
        4,
        "#ffcf4b"
      );
    }

    if (this.timer >= this.duration.LAUNCH) {
      this.changePhase("FALL");
    }
  }

  updateFall() {
    const t = Math.min(this.timer / this.duration.FALL, 1);
    const eased = this.easeIn(t);

    this.target.position.y =
      this.targetPeakY + (this.originalTarget.y - this.targetPeakY) * eased;

    this.target.position.x = this.originalTarget.x + Math.sin(t * Math.PI) * 7;

    if (this.timer % 4 === 0 && t < 0.8) {
      this.createParticles(
        this.targetCenter.x,
        this.target.position.y + this.targetHeight,
        2,
        "#ffe88a"
      );
    }

    if (this.timer >= this.duration.FALL) {
      this.changePhase("RETURN");
    }
  }

  updateReturn() {
    const t = Math.min(this.timer / this.duration.RETURN, 1);
    const eased = this.easeOut(t);

    this.attacker.position.x =
      this.attackerPeak.x +
      (this.originalAttacker.x - this.attackerPeak.x) * eased;

    this.attacker.position.y =
      this.attackerPeak.y +
      (this.originalAttacker.y - this.attackerPeak.y) * eased;

    this.target.position.x = this.originalTarget.x;

    this.target.position.y = this.originalTarget.y;

    if (this.timer >= this.duration.RETURN) {
      this.restorePositions();
      this.isFinished = true;
    }
  }

  updateParticles() {
    this.particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += 0.08;
      particle.life -= particle.decay;
    });

    this.particles = this.particles.filter((particle) => particle.life > 0);
  }

  updateShockwaves() {
    this.shockwaves.forEach((wave) => {
      wave.radius += 3;
      wave.alpha -= 0.045;
    });

    this.shockwaves = this.shockwaves.filter((wave) => wave.alpha > 0);
  }

  updateStars() {
    this.stars.forEach((star) => {
      star.x += star.vx;
      star.y += star.vy;
      star.vy += 0.05;
      star.rotation += 0.12;
      star.life -= 0.025;
    });

    this.stars = this.stars.filter((star) => star.life > 0);
  }

  draw(context) {
    this.drawSpeedLines(context);
    this.drawShockwaves(context);
    this.drawParticles(context);
    this.drawStars(context);

    if (this.phase === "ASCEND" || this.phase === "IMPACT") {
      this.drawPunchAura(context);
    }

    if (this.phase === "IMPACT") {
      this.drawImpactFlash(context);
    }
  }

  drawSpeedLines(context) {
    if (this.phase !== "ASCEND") return;

    const t = Math.min(this.timer / this.duration.ASCEND, 1);

    context.save();
    context.translate(
      this.attackerCenter.x,
      this.attacker.position.y + this.attackerHeight * 0.5
    );

    this.speedLines.forEach((line) => {
      context.globalAlpha = line.alpha * (1 - t * 0.5);
      context.strokeStyle = "#ffe18a";
      context.lineWidth = line.width;

      context.beginPath();
      context.moveTo(line.x, line.y);
      context.lineTo(line.x - 4, line.y + line.length);
      context.stroke();
    });

    context.restore();
  }

  drawPunchAura(context) {
    const x = this.attackerCenter.x + this.attackerWidth * 0.25;
    const y = this.attacker.position.y + this.attackerHeight * 0.2;

    context.save();

    const gradient = context.createRadialGradient(x, y, 2, x, y, 22);

    gradient.addColorStop(0, "rgba(255,255,210,0.9)");
    gradient.addColorStop(0.4, "rgba(255,174,48,0.6)");
    gradient.addColorStop(1, "rgba(255,100,20,0)");

    context.fillStyle = gradient;
    context.beginPath();
    context.arc(x, y, 22, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }

  drawImpactFlash(context) {
    const alpha = Math.max(0, 1 - this.timer / this.duration.IMPACT);

    context.save();
    context.globalAlpha = alpha;

    const gradient = context.createRadialGradient(
      this.impactPoint.x,
      this.impactPoint.y,
      2,
      this.impactPoint.x,
      this.impactPoint.y,
      55
    );

    gradient.addColorStop(0, "#ffffff");
    gradient.addColorStop(0.25, "#fff5a0");
    gradient.addColorStop(0.65, "rgba(255,150,30,0.5)");
    gradient.addColorStop(1, "rgba(255,100,20,0)");

    context.fillStyle = gradient;
    context.beginPath();
    context.arc(this.impactPoint.x, this.impactPoint.y, 55, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }

  drawShockwaves(context) {
    context.save();

    this.shockwaves.forEach((wave) => {
      context.globalAlpha = Math.max(0, wave.alpha);
      context.strokeStyle = "#ffe18a";
      context.lineWidth = wave.width;

      context.beginPath();
      context.ellipse(
        wave.x,
        wave.y,
        wave.radius,
        wave.radius * 0.45,
        0,
        0,
        Math.PI * 2
      );
      context.stroke();
    });

    context.restore();
  }

  drawParticles(context) {
    context.save();

    this.particles.forEach((particle) => {
      context.globalAlpha = Math.max(0, particle.life);
      context.fillStyle = particle.color;

      context.beginPath();
      context.arc(
        particle.x,
        particle.y,
        particle.size * particle.life,
        0,
        Math.PI * 2
      );
      context.fill();
    });

    context.restore();
  }

  drawStars(context) {
    context.save();

    this.stars.forEach((star) => {
      context.save();
      context.translate(star.x, star.y);
      context.rotate(star.rotation);
      context.globalAlpha = Math.max(0, star.life);
      context.fillStyle = "#fff3a6";

      context.beginPath();
      context.moveTo(0, -star.size);
      context.lineTo(star.size * 0.35, -star.size * 0.35);
      context.lineTo(star.size, 0);
      context.lineTo(star.size * 0.35, star.size * 0.35);
      context.lineTo(0, star.size);
      context.lineTo(-star.size * 0.35, star.size * 0.35);
      context.lineTo(-star.size, 0);
      context.lineTo(-star.size * 0.35, -star.size * 0.35);
      context.closePath();
      context.fill();

      context.restore();
    });

    context.restore();
  }

  restorePositions() {
    this.attacker.position.x = this.originalAttacker.x;
    this.attacker.position.y = this.originalAttacker.y;

    this.target.position.x = this.originalTarget.x;
    this.target.position.y = this.originalTarget.y;
  }
}
