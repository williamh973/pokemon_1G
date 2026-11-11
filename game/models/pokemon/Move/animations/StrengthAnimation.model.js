export class StrengthAnimation {
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

    this.phase = "CHARGE";
    this.timer = 0;
    this.isFinished = false;

    this.duration = {
      CHARGE: 30,
      RUPTURE: 18,
      ROCKS: 32,
      IMPACT: 22,
      FINISH: 35,
    };

    this.attackerCenter = this.getCenter(this.pokemonViewer);
    this.targetCenter = this.getCenter(this.targetViewer);

    this.direction = this.targetCenter.x >= this.attackerCenter.x ? 1 : -1;

    this.rocks = [];
    this.particles = [];
    this.shockwaves = [];
    this.impactTriggered = false;
  }

  getCenter(viewer) {
    const sprite = viewer.sprite;

    return {
      x: sprite.position.x + (sprite.frameWidth * sprite.scale) / 2,
      y: sprite.position.y + (sprite.frameHeight * sprite.scale) / 2,
    };
  }

  update(context) {
    if (this.isFinished) return;

    this.timer++;

    switch (this.phase) {
      case "CHARGE":
        this.charge();
        break;

      case "RUPTURE":
        this.rupture();
        break;

      case "ROCKS":
        this.launchRocks();
        break;

      case "IMPACT":
        this.impact();
        break;

      case "FINISH":
        this.finish();
        break;
    }

    this.updateEffects();
    this.draw(context);
  }

  changePhase(phase) {
    this.phase = phase;
    this.timer = 0;
  }

  charge() {
    if (this.timer % 3 === 0) {
      this.createChargeParticle();
    }

    if (this.timer % 8 === 0) {
      this.createChargeRing();
    }

    if (this.timer >= this.duration.CHARGE) {
      this.changePhase("RUPTURE");
      this.game.canvas.startShake(1200, 5);
    }
  }

  rupture() {
    if (this.timer === 1) {
      this.createShockwave(this.attackerCenter, 15, 8);
      this.createDustBurst(this.attackerCenter, 20);
      this.game.canvas.startShake(1800, 9);
    }

    if (this.timer >= this.duration.RUPTURE) {
      this.changePhase("ROCKS");
      this.createRocks();
    }
  }

  launchRocks() {
    if (this.timer >= this.duration.ROCKS) {
      this.changePhase("IMPACT");
    }
  }

  impact() {
    if (!this.impactTriggered) {
      this.impactTriggered = true;

      this.createRockImpact();
      this.createShockwave(this.targetCenter, 12, 7);
      this.game.canvas.startShake(1000, 10);
    }

    if (this.timer >= this.duration.IMPACT) {
      this.changePhase("FINISH");
    }
  }

  finish() {
    if (
      this.timer >= this.duration.FINISH &&
      this.rocks.length === 0 &&
      this.particles.length === 0 &&
      this.shockwaves.length === 0
    ) {
      this.isFinished = true;
    }
  }

  createChargeParticle() {
    const angle = Math.random() * Math.PI * 2;
    const radius = 35 + Math.random() * 20;

    this.particles.push({
      x: this.attackerCenter.x + Math.cos(angle) * radius,
      y: this.attackerCenter.y + Math.sin(angle) * radius,
      vx: -Math.cos(angle) * 1.5,
      vy: -Math.sin(angle) * 1.5,
      size: 2 + Math.random() * 3,
      alpha: 1,
      color: "#ffb45c",
      type: "charge",
    });
  }

  createChargeRing() {
    this.shockwaves.push({
      x: this.attackerCenter.x,
      y: this.attackerCenter.y,
      radius: 15,
      speed: 2,
      alpha: 0.6,
      color: "#ffb45c",
    });
  }

  createShockwave(center, radius, speed) {
    this.shockwaves.push({
      x: center.x,
      y: center.y,
      radius,
      speed,
      alpha: 1,
      color: "#d9b58a",
    });
  }

  createDustBurst(center, count) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 4;

      this.particles.push({
        x: center.x,
        y: center.y + 25,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed * 0.5,
        size: 3 + Math.random() * 5,
        alpha: 0.9,
        color: "#b99b7b",
        type: "dust",
      });
    }
  }

  createRocks() {
    for (let i = 0; i < 7; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      const offset = 25 + Math.random() * 55;

      const startX = this.targetCenter.x + side * offset;

      const startY = this.targetCenter.y + 55;

      this.rocks.push({
        x: startX,
        y: startY,
        startX,
        startY,
        targetX: this.targetCenter.x + (Math.random() - 0.5) * 35,
        targetY: this.targetCenter.y + (Math.random() - 0.5) * 35,
        size: 9 + Math.random() * 12,
        rotation: Math.random() * Math.PI,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        progress: 0,
        speed: 0.025 + Math.random() * 0.015,
        alpha: 1,
      });
    }
  }

  createRockImpact() {
    for (let i = 0; i < 35; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 7;

      this.particles.push({
        x: this.targetCenter.x,
        y: this.targetCenter.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3 + Math.random() * 6,
        alpha: 1,
        color: Math.random() > 0.5 ? "#a88b70" : "#d4b18c",
        type: "debris",
      });
    }

    this.createDustBurst(this.targetCenter, 20);

    this.rocks.forEach((rock) => {
      rock.alpha = 0;
    });
  }

  updateEffects() {
    this.rocks.forEach((rock) => {
      if (rock.alpha <= 0) return;

      rock.progress = Math.min(1, rock.progress + rock.speed);

      const progress = rock.progress;
      const eased = 1 - Math.pow(1 - progress, 2);

      rock.x = rock.startX + (rock.targetX - rock.startX) * eased;

      rock.y =
        rock.startY +
        (rock.targetY - rock.startY) * eased -
        Math.sin(progress * Math.PI) * 65;

      rock.rotation += rock.rotationSpeed;
    });

    this.particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      particle.vx *= 0.97;
      particle.vy *= 0.97;

      particle.alpha -= particle.type === "dust" ? 0.025 : 0.035;

      if (particle.type === "dust") {
        particle.size += 0.15;
      }
    });

    this.particles = this.particles.filter((particle) => particle.alpha > 0);

    this.shockwaves.forEach((wave) => {
      wave.radius += wave.speed;
      wave.alpha -= 0.04;
    });

    this.shockwaves = this.shockwaves.filter((wave) => wave.alpha > 0);

    this.rocks = this.rocks.filter((rock) => rock.alpha > 0);
  }

  draw(context) {
    context.save();

    if (this.phase === "CHARGE") {
      this.drawChargeAura(context);
    }

    if (this.phase === "RUPTURE") {
      this.drawRupture(context);
    }

    if (this.phase === "ROCKS") {
      this.drawRocks(context);
      this.drawShockwaves(context);
    }

    if (this.phase === "IMPACT") {
      this.drawRocks(context);
      this.drawImpactFlash(context);
      this.drawShockwaves(context);
    }

    if (this.phase === "FINISH") {
      this.drawShockwaves(context);
    }

    this.drawParticles(context);

    context.restore();
  }

  drawChargeAura(context) {
    const progress = this.timer / this.duration.CHARGE;
    const pulse = 1 + Math.sin(this.timer * 0.4) * 0.08;
    const radius = 32 + progress * 14;

    context.save();
    context.translate(this.attackerCenter.x, this.attackerCenter.y);
    context.scale(pulse, pulse);

    context.beginPath();
    context.ellipse(0, 0, radius, radius * 1.2, 0, 0, Math.PI * 2);

    context.fillStyle = "rgba(255, 155, 65, 0.15)";
    context.fill();

    context.strokeStyle = "rgba(255, 190, 100, 0.9)";
    context.lineWidth = 3;
    context.stroke();

    context.beginPath();
    context.ellipse(0, 0, radius * 0.7, radius * 0.85, 0, 0, Math.PI * 2);

    context.strokeStyle = "rgba(255, 235, 180, 0.7)";
    context.lineWidth = 2;
    context.stroke();

    context.restore();
  }

  drawRupture(context) {
    const progress = this.timer / this.duration.RUPTURE;
    const radius = 25 + progress * 65;
    const alpha = Math.max(0, 1 - progress);

    const gradient = context.createRadialGradient(
      this.attackerCenter.x,
      this.attackerCenter.y,
      0,
      this.attackerCenter.x,
      this.attackerCenter.y,
      radius
    );

    gradient.addColorStop(0, `rgba(255, 235, 185, ${alpha})`);
    gradient.addColorStop(0.4, `rgba(220, 170, 115, ${alpha * 0.7})`);
    gradient.addColorStop(1, "rgba(180, 130, 90, 0)");

    context.beginPath();
    context.arc(
      this.attackerCenter.x,
      this.attackerCenter.y,
      radius,
      0,
      Math.PI * 2
    );

    context.fillStyle = gradient;
    context.fill();
  }

  drawRocks(context) {
    this.rocks.forEach((rock) => {
      context.save();

      context.translate(rock.x, rock.y);
      context.rotate(rock.rotation);
      context.globalAlpha = rock.alpha;

      context.beginPath();
      context.moveTo(-rock.size, -rock.size * 0.4);
      context.lineTo(-rock.size * 0.3, -rock.size);
      context.lineTo(rock.size * 0.8, -rock.size * 0.6);
      context.lineTo(rock.size, rock.size * 0.3);
      context.lineTo(rock.size * 0.2, rock.size);
      context.lineTo(-rock.size * 0.8, rock.size * 0.6);
      context.closePath();

      context.fillStyle = "#8f755d";
      context.fill();

      context.strokeStyle = "#d0ad87";
      context.lineWidth = 2;
      context.stroke();

      context.beginPath();
      context.moveTo(-rock.size * 0.3, -rock.size * 0.4);
      context.lineTo(rock.size * 0.3, rock.size * 0.2);

      context.strokeStyle = "rgba(255, 225, 190, 0.5)";
      context.lineWidth = 2;
      context.stroke();

      context.restore();
    });
  }

  drawImpactFlash(context) {
    const progress = this.timer / this.duration.IMPACT;
    const alpha = Math.max(0, 1 - progress * 1.8);
    const radius = 35 + progress * 60;

    const gradient = context.createRadialGradient(
      this.targetCenter.x,
      this.targetCenter.y,
      0,
      this.targetCenter.x,
      this.targetCenter.y,
      radius
    );

    gradient.addColorStop(0, `rgba(255, 255, 225, ${alpha})`);
    gradient.addColorStop(0.4, `rgba(255, 205, 140, ${alpha * 0.8})`);
    gradient.addColorStop(1, "rgba(180, 120, 70, 0)");

    context.beginPath();
    context.arc(
      this.targetCenter.x,
      this.targetCenter.y,
      radius,
      0,
      Math.PI * 2
    );

    context.fillStyle = gradient;
    context.fill();

    if (this.timer < 5) {
      context.fillStyle = `rgba(255, 255, 255, ${0.6 - this.timer * 0.12})`;
      context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    }
  }

  drawShockwaves(context) {
    this.shockwaves.forEach((wave) => {
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

      context.strokeStyle = `rgba(205, 170, 135, ${wave.alpha})`;
      context.lineWidth = 4;
      context.stroke();
    });
  }

  drawParticles(context) {
    this.particles.forEach((particle) => {
      context.globalAlpha = particle.alpha;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);

      context.fillStyle = particle.color;
      context.fill();
    });

    context.globalAlpha = 1;
  }
}
