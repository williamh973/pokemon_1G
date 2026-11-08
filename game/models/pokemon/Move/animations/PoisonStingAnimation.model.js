export class PoisonStingAnimation {
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

    this.projectileX = this.attackerX;
    this.projectileY = this.attackerY;

    this.startX = this.attackerX;
    this.startY = this.attackerY - 5;

    this.progress = 0;
    this.projectileSize = 1;

    this.particles = [];
    this.impactRings = [];

    this.flashOpacity = 0;
    this.impactScale = 0;
  }

  update(context) {
    this.timer++;

    switch (this.phase) {
      case "PREPARE":
        this.updatePrepare();
        break;

      case "PROJECTILE":
        this.updateProjectile();
        break;

      case "IMPACT":
        this.updateImpact();
        break;

      case "FINISH":
        this.updateFinish();
        break;
    }

    this.updateParticles();
    this.updateImpactRings();

    this.draw(context);
  }

  updatePrepare() {
    this.projectileSize = Math.min(1, this.timer / 6);

    if (this.timer >= 6) {
      this.timer = 0;
      this.phase = "PROJECTILE";
    }
  }

  updateProjectile() {
    this.progress = Math.min(1, this.timer / 12);

    const eased = this.progress * this.progress * (3 - 2 * this.progress);

    // Trajectoire légèrement courbée
    this.projectileX = this.startX + (this.targetX - this.startX) * eased;

    this.projectileY =
      this.startY +
      (this.targetY - this.startY) * eased -
      Math.sin(this.progress * Math.PI) * 15;

    this.createToxicTrail();

    if (this.timer >= 12) {
      this.timer = 0;
      this.phase = "IMPACT";

      this.projectileX = this.targetX;
      this.projectileY = this.targetY;

      this.createImpact();

      if (this.game.canvas?.startShake) {
        this.game.canvas.startShake(5, 2);
      }
    }
  }

  updateImpact() {
    this.impactScale = Math.min(1.5, this.timer / 4);
    this.flashOpacity = Math.max(0, 0.75 - this.timer * 0.09);

    if (this.timer >= 10) {
      this.timer = 0;
      this.phase = "FINISH";
    }
  }

  updateFinish() {
    this.flashOpacity = Math.max(0, this.flashOpacity - 0.08);

    if (this.timer >= 15) {
      this.isFinished = true;
    }
  }

  createToxicTrail() {
    if (Math.random() > 0.6) return;

    this.particles.push({
      x: this.projectileX,
      y: this.projectileY,
      vx: -this.direction * (0.5 + Math.random()),
      vy: (Math.random() - 0.5) * 1.5,
      radius: 1.5 + Math.random() * 2,
      life: 9 + Math.random() * 5,
      maxLife: 14,
      color: Math.random() > 0.5 ? "#c45be8" : "#8e32b8",
    });
  }

  createImpact() {
    // Éclaboussures violettes
    for (let i = 0; i < 14; i++) {
      const angle = (Math.PI * 2 * i) / 14;
      const speed = 1.5 + Math.random() * 3;

      this.particles.push({
        x: this.targetX,
        y: this.targetY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 2 + Math.random() * 2,
        life: 12 + Math.random() * 8,
        maxLife: 20,
        color: Math.random() > 0.5 ? "#d77aff" : "#8c35b8",
      });
    }

    // Petites gouttelettes toxiques
    for (let i = 0; i < 6; i++) {
      this.particles.push({
        x: this.targetX + (Math.random() - 0.5) * 12,
        y: this.targetY + (Math.random() - 0.5) * 12,
        vx: (Math.random() - 0.5) * 3,
        vy: -1 - Math.random() * 2,
        radius: 3 + Math.random() * 2,
        life: 20,
        maxLife: 20,
        color: "#a64bc8",
      });
    }

    this.impactRings.push({
      radius: 5,
      life: 12,
      maxLife: 12,
    });
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

  updateImpactRings() {
    this.impactRings.forEach((ring) => {
      ring.radius += 2.5;
      ring.life--;
    });

    this.impactRings = this.impactRings.filter((ring) => ring.life > 0);
  }

  draw(context) {
    if (this.phase === "PREPARE") {
      this.drawPreparation(context);
    }

    if (this.phase === "PROJECTILE") {
      this.drawProjectile(context);
    }

    if (this.phase === "IMPACT") {
      this.drawImpact(context);
    }

    if (this.phase === "FINISH") {
      this.drawFinish(context);
    }

    this.drawImpactRings(context);
    this.drawParticles(context);
    this.drawFlash(context);
  }

  drawPreparation(context) {
    context.save();

    const gradient = context.createRadialGradient(
      this.attackerX,
      this.attackerY - 5,
      1,
      this.attackerX,
      this.attackerY - 5,
      16
    );

    gradient.addColorStop(0, "rgba(240,190,255,0.9)");
    gradient.addColorStop(0.4, "rgba(160,65,205,0.65)");
    gradient.addColorStop(1, "rgba(110,30,160,0)");

    context.fillStyle = gradient;

    context.beginPath();
    context.arc(
      this.attackerX,
      this.attackerY - 5,
      16 * this.projectileSize,
      0,
      Math.PI * 2
    );
    context.fill();

    this.drawDart(
      context,
      this.attackerX,
      this.attackerY - 5,
      0.6 + this.projectileSize * 0.4
    );

    context.restore();
  }

  drawProjectile(context) {
    context.save();

    // Traînée toxique
    const gradient = context.createLinearGradient(
      this.projectileX - this.direction * 25,
      this.projectileY,
      this.projectileX,
      this.projectileY
    );

    gradient.addColorStop(0, "rgba(130,40,180,0)");
    gradient.addColorStop(0.5, "rgba(180,80,220,0.45)");
    gradient.addColorStop(1, "rgba(235,190,255,0.9)");

    context.strokeStyle = gradient;
    context.lineWidth = 5;
    context.lineCap = "round";

    context.beginPath();
    context.moveTo(this.projectileX - this.direction * 25, this.projectileY);
    context.lineTo(this.projectileX, this.projectileY);
    context.stroke();

    this.drawDart(context, this.projectileX, this.projectileY, 1);

    context.restore();
  }

  drawDart(context, x, y, scale) {
    context.save();

    context.translate(x, y);
    context.scale(scale * this.direction, scale);

    // Halo
    const gradient = context.createRadialGradient(0, 0, 1, 0, 0, 15);

    gradient.addColorStop(0, "rgba(245,210,255,0.9)");
    gradient.addColorStop(1, "rgba(145,45,190,0)");

    context.fillStyle = gradient;

    context.beginPath();
    context.arc(0, 0, 15, 0, Math.PI * 2);
    context.fill();

    // Corps du dard
    context.beginPath();
    context.moveTo(13, 0);
    context.lineTo(-7, -5);
    context.lineTo(-4, 0);
    context.lineTo(-7, 5);
    context.closePath();

    const dartGradient = context.createLinearGradient(0, -5, 0, 5);

    dartGradient.addColorStop(0, "#f3c5ff");
    dartGradient.addColorStop(0.5, "#b35ad7");
    dartGradient.addColorStop(1, "#67228f");

    context.fillStyle = dartGradient;
    context.fill();

    context.strokeStyle = "#f9e7ff";
    context.lineWidth = 1;
    context.stroke();

    // Reflet
    context.strokeStyle = "#ffffff";
    context.lineWidth = 1.5;

    context.beginPath();
    context.moveTo(7, -1);
    context.lineTo(-3, -3);
    context.stroke();

    context.restore();
  }

  drawImpact(context) {
    context.save();

    context.globalAlpha = this.flashOpacity;

    const radius = 18 * this.impactScale;

    const gradient = context.createRadialGradient(
      this.targetX,
      this.targetY,
      1,
      this.targetX,
      this.targetY,
      radius
    );

    gradient.addColorStop(0, "#ffffff");
    gradient.addColorStop(0.3, "#e8b5ff");
    gradient.addColorStop(0.7, "#a84ed0");
    gradient.addColorStop(1, "rgba(120,35,160,0)");

    context.fillStyle = gradient;

    context.beginPath();
    context.arc(this.targetX, this.targetY, radius, 0, Math.PI * 2);
    context.fill();

    // Étoile d'impact
    this.drawImpactStar(
      context,
      this.targetX,
      this.targetY,
      8 * this.impactScale
    );

    context.restore();
  }

  drawImpactStar(context, x, y, radius) {
    context.save();

    context.translate(x, y);

    context.beginPath();

    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8 - Math.PI / 2;
      const r = i % 2 === 0 ? radius : radius * 0.3;

      const px = Math.cos(angle) * r;
      const py = Math.sin(angle) * r;

      if (i === 0) {
        context.moveTo(px, py);
      } else {
        context.lineTo(px, py);
      }
    }

    context.closePath();

    context.fillStyle = "#ffffff";
    context.fill();

    context.strokeStyle = "#d58bf0";
    context.lineWidth = 1;
    context.stroke();

    context.restore();
  }

  drawFinish(context) {
    // Les dernières particules toxiques restent visibles
    // pendant leur dissipation.
  }

  drawImpactRings(context) {
    this.impactRings.forEach((ring) => {
      context.save();

      context.globalAlpha = ring.life / ring.maxLife;
      context.strokeStyle = "#d58bf0";
      context.lineWidth = 2;

      context.beginPath();
      context.arc(this.targetX, this.targetY, ring.radius, 0, Math.PI * 2);
      context.stroke();

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

    context.globalAlpha = this.flashOpacity * 0.35;
    context.fillStyle = "#dca0ff";

    context.beginPath();
    context.arc(this.targetX, this.targetY, 25, 0, Math.PI * 2);

    context.fill();

    context.restore();
  }
}
