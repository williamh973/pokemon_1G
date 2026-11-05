export class DragonRageAnimation {
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

    const attacker = this.pokemonViewer.sprite;
    const target = this.targetViewer.sprite;

    this.attackerCenterX = attacker.position.x + attacker.frameWidth / 2;

    this.attackerCenterY = attacker.position.y + attacker.frameHeight / 2;

    this.targetCenterX = target.position.x + target.frameWidth / 2;

    this.targetCenterY = target.position.y + target.frameHeight / 2;

    this.phase = "CHARGE";
    this.timer = 0;
    this.isFinished = false;

    this.duration = {
      CHARGE: 25,
      PROJECTILE: 24,
      IMPACT: 20,
      DISSIPATION: 30,
    };

    this.directionX = this.targetCenterX - this.attackerCenterX;

    this.directionY = this.targetCenterY - this.attackerCenterY;

    this.distance = Math.sqrt(this.directionX ** 2 + this.directionY ** 2);

    this.directionX /= this.distance;
    this.directionY /= this.distance;

    this.perpendicularX = -this.directionY;
    this.perpendicularY = this.directionX;

    this.projectileX = this.attackerCenterX;
    this.projectileY = this.attackerCenterY;

    this.projectileProgress = 0;

    this.chargeRadius = 0;
    this.chargeOpacity = 0;

    this.projectileRadius = 0;
    this.projectileOpacity = 1;

    this.impactRadius = 0;
    this.flashOpacity = 0;

    this.embers = [];
    this.particles = [];
    this.impactParticles = [];

    this.hasShaken = false;

    this.createChargeParticles();
  }

  createChargeParticles() {
    for (let i = 0; i < 25; i++) {
      this.particles.push({
        angle: Math.random() * Math.PI * 2,
        radius: 12 + Math.random() * 35,
        speed: 0.04 + Math.random() * 0.06,
        size: 2 + Math.random() * 3,
        opacity: 0.5 + Math.random() * 0.5,
      });
    }
  }

  createProjectileEmbers() {
    for (let i = 0; i < 18; i++) {
      this.embers.push({
        offset: (Math.random() - 0.5) * 25,
        speed: 1 + Math.random() * 2,
        size: 2 + Math.random() * 3,
        life: 20 + Math.random() * 20,
        maxLife: 40,
      });
    }
  }

  createImpactParticles() {
    for (let i = 0; i < 45; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 4.5;

      this.impactParticles.push({
        x: this.targetCenterX,
        y: this.targetCenterY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 4,
        life: 25 + Math.random() * 20,
        maxLife: 45,
      });
    }
  }

  nextPhase() {
    const phases = Object.keys(this.duration);
    const currentIndex = phases.indexOf(this.phase);

    this.phase = phases[currentIndex + 1];
    this.timer = 0;

    if (this.phase === "PROJECTILE") {
      this.createProjectileEmbers();
    }

    if (this.phase === "IMPACT" && !this.hasShaken) {
      this.game.canvas.startShake(20, 6);
      this.hasShaken = true;

      this.createImpactParticles();
    }
  }

  update(context) {
    if (this.isFinished) return;

    this.timer++;

    switch (this.phase) {
      case "CHARGE":
        this.updateCharge();
        break;

      case "PROJECTILE":
        this.updateProjectile();
        break;

      case "IMPACT":
        this.updateImpact();
        break;

      case "DISSIPATION":
        this.updateDissipation();
        break;
    }

    this.updateParticles();
    this.updateEmbers();
    this.updateImpactParticles();

    this.draw(context);
  }

  updateCharge() {
    const progress = Math.min(this.timer / this.duration.CHARGE, 1);

    this.chargeRadius = 8 + progress * 28;
    this.chargeOpacity = progress;

    this.particles.forEach((particle) => {
      particle.angle += particle.speed;
      particle.radius -= 0.15;
    });

    if (this.timer >= this.duration.CHARGE) {
      this.nextPhase();
    }
  }

  updateProjectile() {
    const progress = Math.min(this.timer / this.duration.PROJECTILE, 1);

    this.projectileProgress = progress;

    this.projectileX =
      this.attackerCenterX + this.directionX * this.distance * progress;

    this.projectileY =
      this.attackerCenterY + this.directionY * this.distance * progress;

    this.projectileRadius = 19 + Math.sin(this.timer * 0.4) * 4;

    this.projectileOpacity = 1;

    this.embers.forEach((ember) => {
      ember.offset += ember.speed;
      ember.life--;
    });

    if (this.timer >= this.duration.PROJECTILE) {
      this.nextPhase();
    }
  }

  updateImpact() {
    const progress = Math.min(this.timer / this.duration.IMPACT, 1);

    this.impactRadius = 12 + progress * 75;

    this.flashOpacity = Math.max(0, 0.8 - progress * 0.8);

    if (this.timer >= this.duration.IMPACT) {
      this.nextPhase();
    }
  }

  updateDissipation() {
    this.impactRadius *= 1.08;

    this.flashOpacity = Math.max(0, this.flashOpacity - 0.08);

    if (this.timer >= this.duration.DISSIPATION) {
      this.isFinished = true;
    }
  }

  updateParticles() {
    if (this.phase !== "CHARGE") return;

    this.particles = this.particles.filter((particle) => particle.radius > 0);
  }

  updateEmbers() {
    this.embers = this.embers.filter((ember) => ember.life > 0);
  }

  updateImpactParticles() {
    this.impactParticles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      particle.vx *= 0.96;
      particle.vy *= 0.96;

      particle.life--;
    });

    this.impactParticles = this.impactParticles.filter(
      (particle) => particle.life > 0
    );
  }

  draw(context) {
    this.drawCharge(context);
    this.drawProjectileTrail(context);
    this.drawProjectile(context);
    this.drawDragonHead(context);
    this.drawImpact(context);
    this.drawParticles(context);
    this.drawEmbers(context);
    this.drawImpactParticles(context);
    this.drawFlash(context);
  }

  drawCharge(context) {
    if (this.phase !== "CHARGE") return;

    const pulse = Math.sin(this.timer * 0.4) * 4;

    context.save();

    const gradient = context.createRadialGradient(
      this.attackerCenterX,
      this.attackerCenterY,
      2,
      this.attackerCenterX,
      this.attackerCenterY,
      this.chargeRadius + pulse
    );

    gradient.addColorStop(0, "rgba(255,255,220,1)");
    gradient.addColorStop(0.3, "rgba(255,190,80,0.95)");
    gradient.addColorStop(0.65, "rgba(255,75,30,0.75)");
    gradient.addColorStop(1, "rgba(180,20,20,0)");

    context.fillStyle = gradient;

    context.beginPath();
    context.arc(
      this.attackerCenterX,
      this.attackerCenterY,
      this.chargeRadius + pulse,
      0,
      Math.PI * 2
    );

    context.fill();

    context.restore();
  }

  drawProjectileTrail(context) {
    if (this.phase !== "PROJECTILE") return;

    const angle = Math.atan2(this.directionY, this.directionX);

    context.save();

    context.translate(this.projectileX, this.projectileY);

    context.rotate(angle);

    const gradient = context.createLinearGradient(-75, 0, 15, 0);

    gradient.addColorStop(0, "rgba(180,20,10,0)");
    gradient.addColorStop(0.35, "rgba(255,60,20,0.3)");
    gradient.addColorStop(0.7, "rgba(255,135,35,0.75)");
    gradient.addColorStop(1, "rgba(255,235,160,0.9)");

    context.fillStyle = gradient;

    context.beginPath();
    context.moveTo(-75, -10);
    context.quadraticCurveTo(-35, -25, 15, 0);
    context.quadraticCurveTo(-35, 25, -75, 10);
    context.closePath();

    context.fill();

    context.restore();
  }

  drawProjectile(context) {
    if (this.phase !== "PROJECTILE") return;

    const pulse = Math.sin(this.timer * 0.5) * 3;

    context.save();

    const gradient = context.createRadialGradient(
      this.projectileX - 5,
      this.projectileY - 5,
      2,
      this.projectileX,
      this.projectileY,
      this.projectileRadius + pulse
    );

    gradient.addColorStop(0, "#ffffff");
    gradient.addColorStop(0.25, "#fff3b0");
    gradient.addColorStop(0.55, "#ff9638");
    gradient.addColorStop(0.8, "#ed3d1d");
    gradient.addColorStop(1, "rgba(160,15,15,0)");

    context.fillStyle = gradient;
    context.shadowColor = "#ff5125";
    context.shadowBlur = 22;

    context.beginPath();
    context.arc(
      this.projectileX,
      this.projectileY,
      this.projectileRadius + pulse,
      0,
      Math.PI * 2
    );

    context.fill();

    context.restore();
  }

  drawDragonHead(context) {
    if (this.phase !== "PROJECTILE") return;

    const angle = Math.atan2(this.directionY, this.directionX);

    const x = this.projectileX;
    const y = this.projectileY;

    context.save();

    context.translate(x, y);
    context.rotate(angle);

    context.shadowColor = "#ff5a28";
    context.shadowBlur = 15;

    // Silhouette de la tête.
    context.fillStyle = "#b92520";

    context.beginPath();
    context.moveTo(17, 0);
    context.lineTo(7, -9);
    context.lineTo(-3, -13);
    context.lineTo(-10, -22);
    context.lineTo(-12, -9);
    context.lineTo(-19, -13);
    context.lineTo(-15, -3);
    context.lineTo(-22, 0);
    context.lineTo(-15, 5);
    context.lineTo(-19, 13);
    context.lineTo(-8, 10);
    context.lineTo(-2, 15);
    context.lineTo(8, 9);
    context.closePath();

    context.fill();

    // Mâchoire incandescente.
    context.fillStyle = "#ff9b42";

    context.beginPath();
    context.moveTo(-15, 4);
    context.lineTo(-5, 6);
    context.lineTo(10, 4);
    context.lineTo(3, 11);
    context.lineTo(-8, 9);
    context.closePath();

    context.fill();

    // Yeux lumineux.
    context.fillStyle = "#fff6a6";
    context.shadowColor = "#fff1a0";
    context.shadowBlur = 12;

    context.beginPath();
    context.arc(5, -5, 2.5, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }

  drawImpact(context) {
    if (this.phase !== "IMPACT" && this.phase !== "DISSIPATION") {
      return;
    }

    const radius = this.impactRadius;

    context.save();

    const gradient = context.createRadialGradient(
      this.targetCenterX,
      this.targetCenterY,
      2,
      this.targetCenterX,
      this.targetCenterY,
      radius
    );

    gradient.addColorStop(0, "rgba(255,255,220,0.95)");
    gradient.addColorStop(0.3, "rgba(255,175,65,0.85)");
    gradient.addColorStop(0.7, "rgba(255,65,25,0.45)");
    gradient.addColorStop(1, "rgba(180,15,15,0)");

    context.fillStyle = gradient;

    context.beginPath();
    context.arc(this.targetCenterX, this.targetCenterY, radius, 0, Math.PI * 2);

    context.fill();

    // Onde de choc.
    context.globalAlpha =
      this.phase === "IMPACT"
        ? Math.max(0, 1 - this.timer / 20)
        : Math.max(0, 1 - this.timer / 30);

    context.strokeStyle = "#ffd08a";
    context.lineWidth = 4;
    context.shadowColor = "#ff4b1f";
    context.shadowBlur = 18;

    context.beginPath();
    context.arc(
      this.targetCenterX,
      this.targetCenterY,
      radius * 0.85,
      0,
      Math.PI * 2
    );

    context.stroke();

    context.restore();
  }

  drawParticles(context) {
    context.save();

    this.particles.forEach((particle) => {
      if (this.phase !== "CHARGE") return;

      const x =
        this.attackerCenterX + Math.cos(particle.angle) * particle.radius;

      const y =
        this.attackerCenterY + Math.sin(particle.angle) * particle.radius;

      context.globalAlpha = particle.opacity;
      context.fillStyle = "#ffd28a";
      context.shadowColor = "#ff5a25";
      context.shadowBlur = 10;

      context.beginPath();
      context.arc(x, y, particle.size, 0, Math.PI * 2);

      context.fill();
    });

    context.restore();
  }

  drawEmbers(context) {
    if (this.phase !== "PROJECTILE") return;

    context.save();

    this.embers.forEach((ember) => {
      const x = this.projectileX - this.directionX * ember.offset;

      const y =
        this.projectileY -
        this.directionY * ember.offset +
        Math.sin(ember.offset * 0.15) * 8;

      context.globalAlpha = Math.max(0, ember.life / ember.maxLife);

      context.fillStyle = "#ffb34f";
      context.shadowColor = "#ff4b1f";
      context.shadowBlur = 12;

      context.beginPath();
      context.arc(x, y, ember.size, 0, Math.PI * 2);

      context.fill();
    });

    context.restore();
  }

  drawImpactParticles(context) {
    context.save();

    this.impactParticles.forEach((particle) => {
      context.globalAlpha = Math.max(0, particle.life / particle.maxLife);

      context.fillStyle = "#ffc46e";
      context.shadowColor = "#ff4b1f";
      context.shadowBlur = 12;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);

      context.fill();
    });

    context.restore();
  }

  drawFlash(context) {
    if (this.flashOpacity <= 0) return;

    context.save();

    context.globalAlpha = this.flashOpacity;
    context.fillStyle = "#fff0c0";

    context.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);

    context.restore();
  }
}
