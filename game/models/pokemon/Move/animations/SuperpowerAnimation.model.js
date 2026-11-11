export class SuperpowerAnimation {
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
      CHARGE: 48,
      EXPLOSION: 36,
      DASH: 44,
      IMPACT: 32,
      RECOVER: 35,
    };

    this.attackerCenter = this.getCenter(this.pokemonViewer);
    this.targetCenter = this.getCenter(this.targetViewer);

    this.direction = this.targetCenter.x >= this.attackerCenter.x ? 1 : -1;

    this.particles = [];
    this.shockwaves = [];
    this.lightning = [];

    this.dashProgress = 0;
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

      case "EXPLOSION":
        this.explosion();
        break;

      case "DASH":
        this.dash();
        break;

      case "IMPACT":
        this.impact();
        break;

      case "RECOVER":
        this.recover();
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
      this.createChargeParticles();
    }

    if (this.timer % 7 === 0) {
      this.createLightning();
    }

    if (this.timer >= this.duration.CHARGE) {
      this.changePhase("EXPLOSION");
      this.game.canvas.startShake(1000, 5);
    }
  }

  explosion() {
    if (this.timer === 1) {
      this.createExplosionParticles();
      this.createShockwave(20, 8);
      this.game.canvas.startShake(1000, 9);
    }

    if (this.timer >= this.duration.EXPLOSION) {
      this.changePhase("DASH");
    }
  }

  dash() {
    this.dashProgress = Math.min(1, this.timer / this.duration.DASH);

    if (this.timer % 2 === 0) {
      this.createDashParticles();
    }

    if (this.timer >= this.duration.DASH) {
      this.changePhase("IMPACT");
      this.triggerImpact();
    }
  }

  triggerImpact() {
    if (this.impactTriggered) return;

    this.impactTriggered = true;

    this.createShockwave(15, 10);
    this.createImpactParticles();
    this.game.canvas.startShake(2400, 12);
  }

  impact() {
    if (this.timer >= this.duration.IMPACT) {
      this.changePhase("RECOVER");
    }
  }

  recover() {
    if (this.timer >= this.duration.RECOVER) {
      this.isFinished = true;
    }
  }

  createChargeParticles() {
    const angle = Math.random() * Math.PI * 2;
    const radius = 35 + Math.random() * 35;

    this.particles.push({
      x: this.attackerCenter.x + Math.cos(angle) * radius,
      y: this.attackerCenter.y + Math.sin(angle) * radius,
      vx: -Math.cos(angle) * (1.5 + Math.random() * 2),
      vy: -Math.sin(angle) * (1.5 + Math.random() * 2),
      size: 2 + Math.random() * 4,
      alpha: 1,
      color: Math.random() > 0.5 ? "#ffcf55" : "#ff6338",
      type: "charge",
    });
  }

  createLightning() {
    const angle = Math.random() * Math.PI * 2;
    const radius = 30 + Math.random() * 15;

    this.lightning.push({
      angle,
      radius,
      length: 18 + Math.random() * 25,
      alpha: 1,
    });
  }

  createExplosionParticles() {
    for (let i = 0; i < 38; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 7;

      this.particles.push({
        x: this.attackerCenter.x,
        y: this.attackerCenter.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3 + Math.random() * 5,
        alpha: 1,
        color: Math.random() > 0.5 ? "#fff0a6" : "#ff6538",
        type: "explosion",
      });
    }

    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 * i) / 12;

      this.particles.push({
        x: this.attackerCenter.x,
        y: this.attackerCenter.y,
        vx: Math.cos(angle) * 5,
        vy: Math.sin(angle) * 5,
        size: 5,
        alpha: 1,
        color: "#ffffff",
        type: "burst",
      });
    }
  }

  createDashParticles() {
    const offsetY = (Math.random() - 0.5) * 65;

    this.particles.push({
      x: this.attackerCenter.x,
      y: this.attackerCenter.y + offsetY,
      vx: this.direction * (5 + Math.random() * 5),
      vy: (Math.random() - 0.5) * 2,
      size: 2 + Math.random() * 4,
      alpha: 1,
      color: Math.random() > 0.5 ? "#ffb347" : "#fff0a6",
      type: "dash",
    });
  }

  createImpactParticles() {
    for (let i = 0; i < 45; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 9;

      this.particles.push({
        x: this.targetCenter.x,
        y: this.targetCenter.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 5,
        alpha: 1,
        color: ["#ffffff", "#ffe18a", "#ff9a38", "#f34a32"][
          Math.floor(Math.random() * 4)
        ],
        type: "impact",
      });
    }
  }

  createShockwave(radius, speed) {
    this.shockwaves.push({
      x:
        this.phase === "EXPLOSION"
          ? this.attackerCenter.x
          : this.targetCenter.x,
      y:
        this.phase === "EXPLOSION"
          ? this.attackerCenter.y
          : this.targetCenter.y,
      radius,
      speed,
      alpha: 1,
    });
  }

  updateEffects() {
    this.particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      particle.vx *= 0.97;
      particle.vy *= 0.97;

      particle.alpha -= particle.type === "charge" ? 0.025 : 0.035;
    });

    this.particles = this.particles.filter((particle) => particle.alpha > 0);

    this.shockwaves.forEach((wave) => {
      wave.radius += wave.speed;
      wave.alpha -= 0.035;
    });

    this.shockwaves = this.shockwaves.filter((wave) => wave.alpha > 0);

    this.lightning.forEach((bolt) => {
      bolt.alpha -= 0.12;
    });

    this.lightning = this.lightning.filter((bolt) => bolt.alpha > 0);
  }

  draw(context) {
    context.save();

    switch (this.phase) {
      case "CHARGE":
        this.drawChargeAura(context);
        this.drawLightning(context);
        break;

      case "EXPLOSION":
        this.drawExplosion(context);
        this.drawShockwaves(context);
        break;

      case "DASH":
        this.drawDash(context);
        break;

      case "IMPACT":
        this.drawImpact(context);
        this.drawShockwaves(context);
        break;

      case "RECOVER":
        this.drawRecover(context);
        this.drawShockwaves(context);
        break;
    }

    this.drawParticles(context);

    context.restore();
  }

  drawChargeAura(context) {
    const progress = this.timer / this.duration.CHARGE;
    const pulse = 1 + Math.sin(this.timer * 0.55) * 0.09;
    const radius = 35 + progress * 17;

    context.save();
    context.translate(this.attackerCenter.x, this.attackerCenter.y);
    context.scale(pulse, pulse);

    // Aura extérieure
    context.beginPath();
    context.ellipse(0, 0, radius * 1.15, radius * 1.35, 0, 0, Math.PI * 2);
    context.fillStyle = "rgba(255, 75, 30, 0.16)";
    context.fill();

    // Premier cercle énergétique
    context.beginPath();
    context.ellipse(0, 0, radius, radius * 1.2, 0, 0, Math.PI * 2);
    context.strokeStyle = "rgba(255, 100, 35, 0.9)";
    context.lineWidth = 4;
    context.stroke();

    // Cercle intérieur
    context.beginPath();
    context.ellipse(0, 0, radius * 0.72, radius * 0.9, 0, 0, Math.PI * 2);
    context.strokeStyle = "rgba(255, 215, 115, 0.8)";
    context.lineWidth = 2;
    context.stroke();

    // Lueur centrale
    const glow = context.createRadialGradient(0, 0, 5, 0, 0, radius);
    glow.addColorStop(0, "rgba(255, 220, 120, 0.3)");
    glow.addColorStop(1, "rgba(255, 70, 25, 0)");

    context.beginPath();
    context.arc(0, 0, radius, 0, Math.PI * 2);
    context.fillStyle = glow;
    context.fill();

    context.restore();
  }

  drawLightning(context) {
    this.lightning.forEach((bolt) => {
      const startX = this.attackerCenter.x + Math.cos(bolt.angle) * bolt.radius;
      const startY = this.attackerCenter.y + Math.sin(bolt.angle) * bolt.radius;

      const endX =
        this.attackerCenter.x +
        Math.cos(bolt.angle) * (bolt.radius + bolt.length);
      const endY =
        this.attackerCenter.y +
        Math.sin(bolt.angle) * (bolt.radius + bolt.length);

      const middleX = (startX + endX) / 2 + (Math.random() - 0.5) * 16;
      const middleY = (startY + endY) / 2 + (Math.random() - 0.5) * 16;

      context.beginPath();
      context.moveTo(startX, startY);
      context.lineTo(middleX, middleY);
      context.lineTo(endX, endY);

      context.strokeStyle = `rgba(255, 225, 135, ${bolt.alpha})`;
      context.lineWidth = 3;
      context.shadowColor = "#ff7138";
      context.shadowBlur = 12;
      context.stroke();
      context.shadowBlur = 0;
    });
  }

  drawExplosion(context) {
    const progress = this.timer / this.duration.EXPLOSION;
    const radius = 20 + progress * 85;
    const alpha = Math.max(0, 1 - progress);

    const gradient = context.createRadialGradient(
      this.attackerCenter.x,
      this.attackerCenter.y,
      0,
      this.attackerCenter.x,
      this.attackerCenter.y,
      radius
    );

    gradient.addColorStop(0, `rgba(255, 255, 225, ${alpha})`);
    gradient.addColorStop(0.3, `rgba(255, 205, 95, ${alpha * 0.9})`);
    gradient.addColorStop(0.7, `rgba(255, 90, 35, ${alpha * 0.5})`);
    gradient.addColorStop(1, "rgba(255, 60, 20, 0)");

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

  drawDash(context) {
    const progress = this.dashProgress;

    const currentX =
      this.attackerCenter.x +
      (this.targetCenter.x - this.attackerCenter.x) * progress;

    const currentY =
      this.attackerCenter.y +
      (this.targetCenter.y - this.attackerCenter.y) * progress;

    // Traînées de vitesse
    for (let i = 0; i < 8; i++) {
      const offset = i * 9;

      context.beginPath();
      context.moveTo(currentX - this.direction * offset, currentY - 30 + i * 8);
      context.lineTo(
        currentX - this.direction * (offset + 28),
        currentY - 30 + i * 8
      );

      context.strokeStyle =
        i % 2 === 0 ? "rgba(255, 120, 40, 0.85)" : "rgba(255, 225, 140, 0.7)";

      context.lineWidth = 4 - i * 0.25;
      context.stroke();
    }

    // Aura de charge
    context.beginPath();
    context.arc(currentX, currentY, 28, 0, Math.PI * 2);
    context.fillStyle = "rgba(255, 130, 45, 0.25)";
    context.fill();
  }

  drawImpact(context) {
    const progress = this.timer / this.duration.IMPACT;
    const alpha = Math.max(0, 1 - progress);

    // Flash initial
    if (this.timer < 7) {
      const flashAlpha = 1 - this.timer / 7;

      context.fillStyle = `rgba(255, 255, 235, ${flashAlpha * 0.85})`;
      context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    }

    // Explosion centrale
    const radius = 35 + progress * 55;

    const gradient = context.createRadialGradient(
      this.targetCenter.x,
      this.targetCenter.y,
      0,
      this.targetCenter.x,
      this.targetCenter.y,
      radius
    );

    gradient.addColorStop(0, `rgba(255, 255, 240, ${alpha})`);
    gradient.addColorStop(0.35, `rgba(255, 200, 95, ${alpha * 0.9})`);
    gradient.addColorStop(0.75, `rgba(255, 85, 35, ${alpha * 0.4})`);
    gradient.addColorStop(1, "rgba(255, 60, 20, 0)");

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
  }

  drawRecover(context) {
    const progress = this.timer / this.duration.RECOVER;
    const alpha = Math.max(0, 1 - progress);

    context.beginPath();
    context.ellipse(
      this.attackerCenter.x,
      this.attackerCenter.y,
      48,
      55,
      0,
      0,
      Math.PI * 2
    );

    context.strokeStyle = `rgba(255, 120, 55, ${alpha * 0.65})`;
    context.lineWidth = 3;
    context.stroke();

    context.beginPath();
    context.ellipse(
      this.attackerCenter.x,
      this.attackerCenter.y,
      34,
      42,
      0,
      0,
      Math.PI * 2
    );

    context.strokeStyle = `rgba(255, 220, 135, ${alpha * 0.4})`;
    context.lineWidth = 2;
    context.stroke();
  }

  drawShockwaves(context) {
    this.shockwaves.forEach((wave) => {
      context.beginPath();
      context.ellipse(
        wave.x,
        wave.y,
        wave.radius,
        wave.radius * 0.55,
        0,
        0,
        Math.PI * 2
      );

      context.strokeStyle = `rgba(255, 195, 100, ${wave.alpha})`;
      context.lineWidth = 4;
      context.stroke();

      context.beginPath();
      context.ellipse(
        wave.x,
        wave.y,
        wave.radius * 0.75,
        wave.radius * 0.4,
        0,
        0,
        Math.PI * 2
      );

      context.strokeStyle = `rgba(255, 245, 205, ${wave.alpha * 0.7})`;
      context.lineWidth = 2;
      context.stroke();
    });
  }

  drawParticles(context) {
    this.particles.forEach((particle) => {
      context.globalAlpha = particle.alpha;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);

      context.fillStyle = particle.color;
      context.shadowColor = particle.color;
      context.shadowBlur = 8;
      context.fill();
    });

    context.globalAlpha = 1;
    context.shadowBlur = 0;
  }
}
