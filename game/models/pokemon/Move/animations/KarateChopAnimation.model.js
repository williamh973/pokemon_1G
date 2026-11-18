export class KarateChopAnimation {
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

    this.phase = "FIRST_STRIKE";
    this.timer = 0;
    this.isFinished = false;

    this.durations = {
      FIRST_STRIKE: 8,
      SECOND_STRIKE: 9,
      IMPACT: 12,
      RECOVER: 12,
    };

    this.slashes = [];
    this.particles = [];
    this.rings = [];

    this.flashAlpha = 0;
    this.impactScale = 0;
    this.shakeDone = false;

    this.calculatePositions();
  }

  calculatePositions() {
    const target = this.target;

    this.center = {
      x: target.position.x + target.frameWidth * target.scale * 0.5,
      y: target.position.y + target.frameHeight * target.scale * 0.45,
    };

    const attackerCenter = {
      x:
        this.attacker.position.x +
        this.attacker.frameWidth * this.attacker.scale * 0.5,
      y:
        this.attacker.position.y +
        this.attacker.frameHeight * this.attacker.scale * 0.5,
    };

    const dx = this.center.x - attackerCenter.x;
    const dy = this.center.y - attackerCenter.y;

    this.direction = Math.atan2(dy, dx);

    this.radius = Math.max(
      18,
      Math.min(this.target.frameWidth * this.target.scale * 0.42, 29)
    );
  }

  easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  changePhase(phase) {
    this.phase = phase;
    this.timer = 0;
  }

  update(context) {
    if (this.isFinished) return;

    this.timer++;

    switch (this.phase) {
      case "FIRST_STRIKE":
        this.updateFirstStrike();
        break;

      case "SECOND_STRIKE":
        this.updateSecondStrike();
        break;

      case "IMPACT":
        this.updateImpact();
        break;

      case "RECOVER":
        this.updateRecover();
        break;
    }

    this.updateSlashes();
    this.updateParticles();
    this.updateRings();

    this.draw(context);
  }

  updateFirstStrike() {
    const progress = Math.min(this.timer / this.durations.FIRST_STRIKE, 1);

    if (this.timer === 1) {
      this.slashes.push({
        angle: this.direction,
        progress: 0,
        alpha: 1,
        radius: this.radius,
        thickness: 5,
        color: "#ffffff",
        glow: "#fff0b5",
        duration: this.durations.FIRST_STRIKE,
        age: 0,
      });
    }

    if (this.timer >= this.durations.FIRST_STRIKE) {
      this.createSlashParticles(this.direction);
      this.changePhase("SECOND_STRIKE");
    }
  }

  updateSecondStrike() {
    const secondAngle = this.direction + Math.PI / 2;

    if (this.timer === 1) {
      this.slashes.push({
        angle: secondAngle,
        progress: 0,
        alpha: 1,
        radius: this.radius * 1.18,
        thickness: 7,
        color: "#ffffff",
        glow: "#ffe49b",
        duration: this.durations.SECOND_STRIKE,
        age: 0,
      });
    }

    if (this.timer === 3) {
      this.createSlashParticles(secondAngle);
    }

    if (this.timer >= this.durations.SECOND_STRIKE) {
      this.createImpact();
      this.changePhase("IMPACT");
    }
  }

  updateImpact() {
    const progress = Math.min(this.timer / this.durations.IMPACT, 1);

    this.impactScale = this.easeOut(progress);
    this.flashAlpha = Math.max(0, 0.9 - progress * 0.9);

    if (!this.shakeDone) {
      this.game.canvas?.startShake?.(4, 130);
      this.shakeDone = true;
    }

    if (this.timer >= this.durations.IMPACT) {
      this.changePhase("RECOVER");
    }
  }

  updateRecover() {
    if (this.timer >= this.durations.RECOVER) {
      this.isFinished = true;
    }
  }

  updateSlashes() {
    for (const slash of this.slashes) {
      slash.age++;

      slash.progress = Math.min(slash.age / slash.duration, 1);

      if (this.phase === "IMPACT" || this.phase === "RECOVER") {
        slash.alpha *= 0.84;
      }
    }

    this.slashes = this.slashes.filter((slash) => slash.alpha > 0.025);
  }

  createSlashParticles(angle) {
    const direction = angle + Math.PI / 2;

    for (let i = 0; i < 7; i++) {
      const spread = (Math.random() - 0.5) * this.radius * 1.5;

      this.particles.push({
        x: this.center.x + Math.cos(direction) * spread,
        y: this.center.y + Math.sin(direction) * spread,
        vx: Math.cos(angle) * (Math.random() * 2 - 1),
        vy: Math.sin(angle) * (Math.random() * 2 - 1),
        life: 10 + Math.random() * 5,
        maxLife: 15,
        radius: 1.5 + Math.random() * 2,
      });
    }
  }

  createImpact() {
    this.flashAlpha = 0.9;

    this.rings.push({
      radius: 4,
      alpha: 0.9,
      life: 12,
    });

    for (let i = 0; i < 18; i++) {
      const angle = (Math.PI * 2 * i) / 18;
      const speed = 1.5 + Math.random() * 3.5;

      this.particles.push({
        x: this.center.x,
        y: this.center.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 15,
        maxLife: 15,
        radius: 1.5 + Math.random() * 2.5,
      });
    }
  }

  updateParticles() {
    for (const particle of this.particles) {
      particle.x += particle.vx;
      particle.y += particle.vy;

      particle.vx *= 0.93;
      particle.vy *= 0.93;

      particle.life--;
    }

    this.particles = this.particles.filter((particle) => particle.life > 0);
  }

  updateRings() {
    for (const ring of this.rings) {
      ring.radius += 2.8;
      ring.alpha -= 0.08;
      ring.life--;
    }

    this.rings = this.rings.filter((ring) => ring.life > 0);
  }

  draw(context) {
    this.drawSlashes(context);
    this.drawRings(context);
    this.drawParticles(context);
    this.drawFlash(context);
  }

  drawSlashes(context) {
    context.save();

    for (const slash of this.slashes) {
      const progress = this.easeOut(slash.progress);

      const startAngle = slash.angle - 0.85;
      const endAngle = slash.angle + 0.85;

      const currentEnd = startAngle + (endAngle - startAngle) * progress;

      context.globalAlpha = slash.alpha;

      // Halo lumineux extérieur.
      context.strokeStyle = slash.glow;
      context.lineWidth = slash.thickness + 7;
      context.lineCap = "round";

      context.shadowColor = slash.glow;
      context.shadowBlur = 12;

      context.beginPath();
      context.arc(
        this.center.x,
        this.center.y,
        slash.radius,
        startAngle,
        currentEnd
      );
      context.stroke();

      // Traînée lumineuse principale.
      context.shadowBlur = 0;
      context.strokeStyle = slash.color;
      context.lineWidth = slash.thickness;

      context.beginPath();
      context.arc(
        this.center.x,
        this.center.y,
        slash.radius,
        startAngle,
        currentEnd
      );
      context.stroke();

      // Pointe brillante de la frappe.
      const tipX = this.center.x + Math.cos(currentEnd) * slash.radius;

      const tipY = this.center.y + Math.sin(currentEnd) * slash.radius;

      context.fillStyle = "#ffffff";

      context.beginPath();
      context.arc(tipX, tipY, 2.5, 0, Math.PI * 2);
      context.fill();
    }

    context.restore();
  }

  drawRings(context) {
    context.save();

    for (const ring of this.rings) {
      context.globalAlpha = ring.alpha;
      context.strokeStyle = "#fff1bf";
      context.lineWidth = 2;

      context.beginPath();
      context.ellipse(
        this.center.x,
        this.center.y,
        ring.radius,
        ring.radius * 0.65,
        0,
        0,
        Math.PI * 2
      );
      context.stroke();
    }

    context.restore();
  }

  drawParticles(context) {
    context.save();

    for (const particle of this.particles) {
      context.globalAlpha = particle.life / particle.maxLife;
      context.fillStyle = "#fff3d0";

      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fill();
    }

    context.restore();
  }

  drawFlash(context) {
    if (this.flashAlpha <= 0) return;

    context.save();

    context.globalAlpha = this.flashAlpha;
    context.fillStyle = "#ffffff";

    context.beginPath();
    context.arc(
      this.center.x,
      this.center.y,
      12 + this.impactScale * 7,
      0,
      Math.PI * 2
    );
    context.fill();

    context.restore();
  }
}
