export class ThunderAnimation {
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

    this.phase = "PREPARE";
    this.timer = 0;

    this.projectile = null;
    this.particles = [];
    this.lightningArcs = [];

    this.duration = {
      PREPARE: 65,
      FIRE: 35,
      IMPACT: 55,
      FINISH: 35,
    };

    this.center = {
      x:
        this.pokemonViewer.sprite.position.x +
        this.pokemonViewer.sprite.frameWidth / 2,
      y:
        this.pokemonViewer.sprite.position.y +
        this.pokemonViewer.sprite.frameHeight / 2,
    };

    this.target = {
      x:
        this.targetViewer.sprite.position.x +
        this.targetViewer.sprite.frameWidth / 2,
      y:
        this.targetViewer.sprite.position.y +
        this.targetViewer.sprite.frameHeight / 2,
    };

    this.projectileStart = {
      x: this.center.x,
      y: this.center.y,
    };

    this.projectileEnd = {
      x: this.target.x,
      y: this.target.y,
    };

    this.projectilePosition = { ...this.projectileStart };

    this.projectileRadius = 0;
    this.impactRadius = 0;
    this.flashOpacity = 0;
    this.isFinished = false;

    this.initializeParticles();
  }

  initializeParticles() {
    for (let i = 0; i < 55; i++) {
      this.particles.push({
        x: this.center.x + (Math.random() - 0.5) * 50,
        y: this.center.y + (Math.random() - 0.5) * 50,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3,
        radius: Math.random() * 2 + 1,
        alpha: Math.random(),
        life: Math.random() * 40 + 20,
        maxLife: 60,
      });
    }
  }

  update(context) {
    if (this.isFinished) return;

    this.timer++;

    switch (this.phase) {
      case "PREPARE":
        this.updatePrepare();
        break;

      case "FIRE":
        this.updateFire();
        break;

      case "IMPACT":
        this.updateImpact();
        break;

      case "FINISH":
        this.updateFinish();
        break;
    }

    this.updateParticles();
    this.draw(context);
    this.updatePhase();
  }

  updatePhase() {
    if (this.timer < this.duration[this.phase]) return;

    this.timer = 0;

    switch (this.phase) {
      case "PREPARE":
        this.phase = "FIRE";
        break;

      case "FIRE":
        this.phase = "IMPACT";
        this.createImpactParticles();
        this.game.canvas.startShake(18, 8);
        break;

      case "IMPACT":
        this.phase = "FINISH";
        break;

      case "FINISH":
        this.phase = "DONE";
        this.isFinished = true;
        break;
    }
  }

  updatePrepare() {
    const progress = this.timer / this.duration.PREPARE;

    this.projectileRadius = 5 + progress * 24;

    this.center.x =
      this.pokemonViewer.sprite.position.x +
      this.pokemonViewer.sprite.frameWidth / 2;

    this.center.y =
      this.pokemonViewer.sprite.position.y +
      this.pokemonViewer.sprite.frameHeight / 2;

    this.projectilePosition.x = this.center.x;
    this.projectilePosition.y = this.center.y;

    this.createChargeArcs();
  }

  updateFire() {
    const progress = Math.min(this.timer / this.duration.FIRE, 1);

    const easedProgress = 1 - Math.pow(1 - progress, 2);

    this.projectilePosition.x =
      this.projectileStart.x +
      (this.projectileEnd.x - this.projectileStart.x) * easedProgress;

    this.projectilePosition.y =
      this.projectileStart.y +
      (this.projectileEnd.y - this.projectileStart.y) * easedProgress;

    this.projectileRadius = 24 + Math.sin(this.timer * 0.8) * 3;

    this.createProjectileArcs();
  }

  updateImpact() {
    const progress = this.timer / this.duration.IMPACT;

    this.impactRadius = 15 + progress * 85;

    this.flashOpacity = Math.max(0, 0.8 - progress * 2);

    if (this.timer % 3 === 0) {
      this.createImpactParticles();
    }

    if (this.timer % 5 === 0) {
      this.createImpactArcs();
    }
  }

  updateFinish() {
    this.flashOpacity = Math.max(
      0,
      0.15 - (this.timer / this.duration.FINISH) * 0.15
    );

    this.impactRadius *= 0.96;
  }

  updateParticles() {
    this.particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      particle.vx *= 0.96;
      particle.vy *= 0.96;

      particle.life--;
      particle.alpha = Math.max(0, particle.life / particle.maxLife);
    });

    this.particles = this.particles.filter((particle) => particle.life > 0);
  }

  createChargeArcs() {
    if (Math.random() > 0.55) return;

    const angle = Math.random() * Math.PI * 2;
    const radius = this.projectileRadius;

    this.lightningArcs.push({
      x: this.center.x + Math.cos(angle) * radius,
      y: this.center.y + Math.sin(angle) * radius,
      angle,
      length: Math.random() * 20 + 12,
      life: 8,
      color: Math.random() > 0.5 ? "#fff" : "#42d9ff",
    });
  }

  createProjectileArcs() {
    if (Math.random() > 0.4) return;

    const angle = Math.random() * Math.PI * 2;

    this.lightningArcs.push({
      x: this.projectilePosition.x,
      y: this.projectilePosition.y,
      angle,
      length: Math.random() * 28 + 15,
      life: 7,
      color: Math.random() > 0.5 ? "#fff" : "#ffe45c",
    });
  }

  createImpactArcs() {
    const angle = Math.random() * Math.PI * 2;

    this.lightningArcs.push({
      x: this.target.x,
      y: this.target.y,
      angle,
      length: Math.random() * 65 + 25,
      life: 12,
      color: Math.random() > 0.5 ? "#fff" : "#ffe45c",
    });
  }

  createImpactParticles() {
    for (let i = 0; i < 8; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5 + 2;

      this.particles.push({
        x: this.target.x,
        y: this.target.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: Math.random() * 3 + 1,
        alpha: 1,
        life: 30,
        maxLife: 30,
      });
    }
  }

  draw(context) {
    context.save();

    if (this.phase === "PREPARE") {
      this.drawCharge(context);
    }

    if (this.phase === "FIRE") {
      this.drawProjectile(context);
    }

    if (this.phase === "IMPACT" || this.phase === "FINISH") {
      this.drawImpact(context);
    }

    this.drawLightningArcs(context);
    this.drawParticles(context);

    if (this.flashOpacity > 0) {
      context.fillStyle = `rgba(255, 255, 255, ${this.flashOpacity})`;
      context.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);
    }

    context.restore();
  }

  drawCharge(context) {
    const pulse = 1 + Math.sin(this.timer * 0.25) * 0.12;
    const radius = this.projectileRadius * pulse;

    this.drawElectricSphere(context, this.center.x, this.center.y, radius);
  }

  drawProjectile(context) {
    this.drawElectricSphere(
      context,
      this.projectilePosition.x,
      this.projectilePosition.y,
      this.projectileRadius
    );

    this.drawElectricTrail(context);
  }

  drawElectricSphere(context, x, y, radius) {
    context.save();

    const gradient = context.createRadialGradient(
      x - radius * 0.25,
      y - radius * 0.25,
      1,
      x,
      y,
      radius
    );

    gradient.addColorStop(0, "#ffffff");
    gradient.addColorStop(0.25, "#dfffff");
    gradient.addColorStop(0.55, "#54dcff");
    gradient.addColorStop(0.8, "#168dff");
    gradient.addColorStop(1, "rgba(20, 100, 255, 0)");

    context.fillStyle = gradient;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();

    context.globalCompositeOperation = "lighter";

    context.strokeStyle = "rgba(255,255,255,0.9)";
    context.lineWidth = 2;

    context.beginPath();
    context.arc(
      x,
      y,
      radius * 0.75,
      this.timer * 0.12,
      this.timer * 0.12 + Math.PI * 1.5
    );
    context.stroke();

    context.strokeStyle = "rgba(80,220,255,0.8)";
    context.lineWidth = 3;

    context.beginPath();
    context.arc(
      x,
      y,
      radius * 1.1,
      -this.timer * 0.1,
      -this.timer * 0.1 + Math.PI
    );
    context.stroke();

    context.restore();
  }

  drawElectricTrail(context) {
    const x = this.projectilePosition.x;
    const y = this.projectilePosition.y;

    context.save();
    context.globalCompositeOperation = "lighter";

    const gradient = context.createLinearGradient(x - 70, y, x, y);

    gradient.addColorStop(0, "rgba(30,150,255,0)");
    gradient.addColorStop(0.6, "rgba(50,190,255,0.35)");
    gradient.addColorStop(1, "rgba(255,255,255,0.9)");

    context.fillStyle = gradient;
    context.beginPath();
    context.ellipse(x - 25, y, 55, 13, 0, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }

  drawImpact(context) {
    const progress = Math.min(this.timer / this.duration.IMPACT, 1);

    const radius = this.impactRadius;

    context.save();
    context.globalCompositeOperation = "lighter";

    const gradient = context.createRadialGradient(
      this.target.x,
      this.target.y,
      2,
      this.target.x,
      this.target.y,
      radius
    );

    gradient.addColorStop(0, "rgba(255,255,255,0.95)");
    gradient.addColorStop(0.25, "rgba(130,235,255,0.75)");
    gradient.addColorStop(0.65, "rgba(30,140,255,0.35)");
    gradient.addColorStop(1, "rgba(0,80,255,0)");

    context.fillStyle = gradient;
    context.beginPath();
    context.arc(this.target.x, this.target.y, radius, 0, Math.PI * 2);
    context.fill();

    context.strokeStyle = `rgba(220,250,255,${1 - progress})`;
    context.lineWidth = 4;

    context.beginPath();
    context.arc(this.target.x, this.target.y, radius * 0.7, 0, Math.PI * 2);
    context.stroke();

    context.restore();
  }

  drawLightningArcs(context) {
    this.lightningArcs = this.lightningArcs.filter((arc) => arc.life > 0);

    this.lightningArcs.forEach((arc) => {
      context.save();

      context.globalCompositeOperation = "lighter";
      context.globalAlpha = Math.min(1, arc.life / 8);

      context.strokeStyle = arc.color;
      context.lineWidth = 2;
      context.shadowColor = arc.color;
      context.shadowBlur = 12;

      context.beginPath();
      context.moveTo(arc.x, arc.y);

      let currentX = arc.x;
      let currentY = arc.y;

      const segments = 4;

      for (let i = 1; i <= segments; i++) {
        const distance = arc.length / segments;

        currentX += Math.cos(arc.angle) * distance + (Math.random() - 0.5) * 12;

        currentY += Math.sin(arc.angle) * distance + (Math.random() - 0.5) * 12;

        context.lineTo(currentX, currentY);
      }

      context.stroke();
      context.restore();

      arc.life--;
    });
  }

  drawParticles(context) {
    context.save();
    context.globalCompositeOperation = "lighter";

    this.particles.forEach((particle) => {
      context.globalAlpha = particle.alpha;

      context.fillStyle = "#b9f5ff";
      context.shadowColor = "#36caff";
      context.shadowBlur = 10;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fill();
    });

    context.restore();
  }
}
