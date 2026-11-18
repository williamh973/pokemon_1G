export class HornAttackAnimation {
  static PHASES = {
    PREPARE: 12,
    CHARGE: 8,
    PROJECTILE: 18,
    IMPACT: 18,
    RECOIL: 10,
    RECOVER: 12,
  };

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

    this.phase = "PREPARE";
    this.timer = 0;
    this.isFinished = false;

    // Position de la corne sur le sprite attaquant.
    this.hornOffsetX = 0.58;
    this.hornOffsetY = 0.35;

    this.hornLength = 34;
    this.hornWidth = 9;

    this.particles = [];
    this.impactParticles = [];

    this.projectile = null;
    this.impactPosition = null;

    this.startPoint = this.getHornBase();
    this.targetPoint = this.getTargetCenter();

    this.angle = Math.atan2(
      this.targetPoint.y - this.startPoint.y,
      this.targetPoint.x - this.startPoint.x
    );

    this.distance = Math.hypot(
      this.targetPoint.x - this.startPoint.x,
      this.targetPoint.y - this.startPoint.y
    );

    this.createChargeParticles();
  }

  update(context) {
    if (this.isFinished) return;

    this.timer++;

    switch (this.phase) {
      case "PREPARE":
        if (this.timer >= HornAttackAnimation.PHASES.PREPARE) {
          this.nextPhase("CHARGE");
        }
        break;

      case "CHARGE":
        if (this.timer >= HornAttackAnimation.PHASES.CHARGE) {
          this.launchHorn();
          this.nextPhase("PROJECTILE");
        }
        break;

      case "PROJECTILE":
        this.updateProjectile();

        if (this.timer >= HornAttackAnimation.PHASES.PROJECTILE) {
          this.createImpact();
          this.nextPhase("IMPACT");
        }
        break;

      case "IMPACT":
        this.updateImpactParticles();

        if (this.timer >= HornAttackAnimation.PHASES.IMPACT) {
          this.nextPhase("RECOIL");
        }
        break;

      case "RECOIL":
        if (this.timer >= HornAttackAnimation.PHASES.RECOIL) {
          this.nextPhase("RECOVER");
        }
        break;

      case "RECOVER":
        if (this.timer >= HornAttackAnimation.PHASES.RECOVER) {
          this.isFinished = true;
        }
        break;
    }

    this.updateParticles();
    this.draw(context);
  }

  nextPhase(phase) {
    this.phase = phase;
    this.timer = 0;
  }

  getAttackerCenter() {
    return {
      x: this.attacker.position.x + this.attacker.frameWidth / 2,
      y: this.attacker.position.y + this.attacker.frameHeight / 2,
    };
  }

  getTargetCenter() {
    return {
      x: this.target.position.x + this.target.frameWidth / 2,
      y: this.target.position.y + this.target.frameHeight / 2,
    };
  }

  getHornBase() {
    const sprite = this.attacker;

    return {
      x: sprite.position.x + sprite.frameWidth * this.hornOffsetX,
      y: sprite.position.y + sprite.frameHeight * this.hornOffsetY,
    };
  }

  launchHorn() {
    this.projectile = {
      x: this.startPoint.x,
      y: this.startPoint.y,
      progress: 0,
    };

    this.createTrailParticles();
  }

  updateProjectile() {
    if (!this.projectile) return;

    const duration = HornAttackAnimation.PHASES.PROJECTILE;
    const progress = Math.min(this.timer / duration, 1);

    // Accélération progressive du projectile.
    const easedProgress = 1 - Math.pow(1 - progress, 2);

    this.projectile.progress = easedProgress;

    this.projectile.x =
      this.startPoint.x +
      (this.targetPoint.x - this.startPoint.x) * easedProgress;

    this.projectile.y =
      this.startPoint.y +
      (this.targetPoint.y - this.startPoint.y) * easedProgress;

    if (this.timer % 2 === 0) {
      this.particles.push({
        x: this.projectile.x,
        y: this.projectile.y,
        vx: -Math.cos(this.angle) * (Math.random() * 1.5),
        vy: -Math.sin(this.angle) * (Math.random() * 1.5),
        life: 10,
        maxLife: 10,
        size: Math.random() * 2 + 1,
      });
    }
  }

  createChargeParticles() {
    const base = this.getHornBase();

    for (let i = 0; i < 10; i++) {
      const angle = Math.random() * Math.PI * 2;

      this.particles.push({
        x: base.x,
        y: base.y,
        vx: Math.cos(angle) * (Math.random() * 1.5),
        vy: Math.sin(angle) * (Math.random() * 1.5),
        life: 12 + Math.random() * 8,
        maxLife: 20,
        size: Math.random() * 2 + 1,
      });
    }
  }

  createTrailParticles() {
    for (let i = 0; i < 8; i++) {
      this.particles.push({
        x: this.startPoint.x,
        y: this.startPoint.y,
        vx: -Math.cos(this.angle) * (Math.random() * 2),
        vy: -Math.sin(this.angle) * (Math.random() * 2),
        life: 12,
        maxLife: 12,
        size: Math.random() * 2 + 1,
      });
    }
  }

  createImpact() {
    this.impactPosition = {
      x: this.targetPoint.x,
      y: this.targetPoint.y,
    };

    this.projectile = null;

    if (this.game.canvas?.startShake) {
      this.game.canvas.startShake(3, 150);
    }

    for (let i = 0; i < 22; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 3.5;

      this.impactParticles.push({
        x: this.impactPosition.x,
        y: this.impactPosition.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 18 + Math.random() * 10,
        maxLife: 28,
        size: Math.random() * 3 + 1,
      });
    }
  }

  updateParticles() {
    this.particles = this.particles.filter((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life--;
      return particle.life > 0;
    });
  }

  updateImpactParticles() {
    this.impactParticles = this.impactParticles.filter((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vx *= 0.94;
      particle.vy *= 0.94;
      particle.life--;
      return particle.life > 0;
    });
  }

  draw(context) {
    this.drawParticles(context);

    if (this.phase === "PREPARE") {
      this.drawAttachedHorn(context);
      this.drawChargeAura(context);
    }

    if (this.phase === "CHARGE") {
      this.drawAttachedHorn(context);
      this.drawChargeAura(context);
    }

    if (this.phase === "PROJECTILE" && this.projectile) {
      this.drawProjectile(context);
    }

    if (this.phase === "IMPACT") {
      this.drawImpactEffect(context);
    }

    if (this.phase === "RECOIL" || this.phase === "RECOVER") {
      this.drawImpactParticles(context);
    }
  }

  drawAttachedHorn(context) {
    const base = this.getHornBase();

    context.save();
    context.translate(base.x, base.y);
    context.rotate(this.angle);

    this.drawHornShape(context, 1);

    context.restore();
  }

  drawProjectile(context) {
    const progress = this.projectile.progress;

    context.save();
    context.translate(this.projectile.x, this.projectile.y);
    context.rotate(this.angle);

    // Lueur qui accompagne la corne.
    context.shadowColor = "#ffe59a";
    context.shadowBlur = 14;

    context.globalAlpha = 0.45;
    context.fillStyle = "#fff2bd";
    context.beginPath();
    context.ellipse(-5, 0, 19, 7, 0, 0, Math.PI * 2);
    context.fill();

    context.globalAlpha = 1;

    // La corne conserve sa forme pendant toute sa trajectoire.
    this.drawHornShape(context, 1);

    // Petite traînée lumineuse derrière le projectile.
    context.globalAlpha = 0.5;
    context.fillStyle = "#ffe29a";
    context.beginPath();
    context.moveTo(-this.hornLength, -3);
    context.lineTo(-this.hornLength - 13, 0);
    context.lineTo(-this.hornLength, 3);
    context.closePath();
    context.fill();

    context.restore();
  }

  drawHornShape(context, scale = 1) {
    context.save();
    context.scale(scale, scale);

    // Aura.
    context.shadowColor = "#ffd45c";
    context.shadowBlur = 12;
    context.fillStyle = "rgba(255, 215, 100, 0.35)";

    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(-this.hornLength, -this.hornWidth);
    context.lineTo(-this.hornLength, this.hornWidth);
    context.closePath();
    context.fill();

    // Corps principal de la corne.
    const gradient = context.createLinearGradient(
      0,
      -this.hornWidth,
      0,
      this.hornWidth
    );

    gradient.addColorStop(0, "#fff2c0");
    gradient.addColorStop(0.35, "#e9bd59");
    gradient.addColorStop(0.7, "#bd812b");
    gradient.addColorStop(1, "#80501d");

    context.shadowBlur = 3;
    context.fillStyle = gradient;

    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(-this.hornLength, -this.hornWidth);
    context.lineTo(-this.hornLength * 0.72, 0);
    context.lineTo(-this.hornLength, this.hornWidth);
    context.closePath();
    context.fill();

    // Arête lumineuse.
    context.shadowBlur = 0;
    context.strokeStyle = "#fff5cf";
    context.lineWidth = 1.3;

    context.beginPath();
    context.moveTo(0, -0.5);
    context.lineTo(-this.hornLength, -this.hornWidth);
    context.stroke();

    // Base de la corne.
    context.fillStyle = "#fff0b0";
    context.beginPath();
    context.ellipse(0, 0, 3, this.hornWidth, 0, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }

  drawChargeAura(context) {
    const base = this.getHornBase();
    const pulse = 1 + Math.sin(this.timer * 0.45) * 0.2;

    context.save();
    context.globalAlpha = 0.35 + Math.sin(this.timer * 0.4) * 0.15;
    context.fillStyle = "#ffe49a";
    context.shadowColor = "#ffd45c";
    context.shadowBlur = 12;

    context.beginPath();
    context.arc(base.x, base.y, 8 * pulse, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }

  drawImpactEffect(context) {
    if (!this.impactPosition) return;

    const progress = Math.min(
      this.timer / HornAttackAnimation.PHASES.IMPACT,
      1
    );

    const radius = 5 + progress * 24;
    const alpha = 1 - progress;

    context.save();

    // Flash initial.
    if (this.timer < 5) {
      context.globalAlpha = 1 - this.timer / 5;
      context.fillStyle = "#ffffff";
      context.beginPath();
      context.arc(
        this.impactPosition.x,
        this.impactPosition.y,
        12 + this.timer * 3,
        0,
        Math.PI * 2
      );
      context.fill();
    }

    // Onde de choc.
    context.globalAlpha = alpha;
    context.strokeStyle = "#ffe39a";
    context.lineWidth = 3;

    context.beginPath();
    context.arc(
      this.impactPosition.x,
      this.impactPosition.y,
      radius,
      0,
      Math.PI * 2
    );
    context.stroke();

    context.strokeStyle = "#ffffff";
    context.lineWidth = 1.5;

    context.beginPath();
    context.arc(
      this.impactPosition.x,
      this.impactPosition.y,
      radius * 0.65,
      0,
      Math.PI * 2
    );
    context.stroke();

    context.restore();
  }

  drawParticles(context) {
    context.save();

    for (const particle of this.particles) {
      context.globalAlpha = particle.life / particle.maxLife;
      context.fillStyle = "#ffe39a";
      context.shadowColor = "#ffd45c";
      context.shadowBlur = 5;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fill();
    }

    context.restore();
  }

  drawImpactParticles(context) {
    context.save();

    for (const particle of this.impactParticles) {
      context.globalAlpha = particle.life / particle.maxLife;
      context.fillStyle = "#ffe8aa";

      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fill();
    }

    context.restore();
  }
}
