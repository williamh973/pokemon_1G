export class BarrageAnimation {
  constructor(game, viewers, turnAction) {
    this.game = game;
    this.turnAction = turnAction;

    // Identification de l'attaquant et de la cible
    if (viewers.front.slot.content === turnAction.pokemon) {
      this.pokemonViewer = viewers.front;
      this.targetViewer = viewers.back;
    } else {
      this.pokemonViewer = viewers.back;
      this.targetViewer = viewers.front;
    }

    this.attacker = this.pokemonViewer.sprite;
    this.target = this.targetViewer.sprite;

    // Positions initiales
    this.originalAttackerPosition = {
      x: this.attacker.position.x,
      y: this.attacker.position.y,
    };

    this.originalTargetPosition = {
      x: this.target.position.x,
      y: this.target.position.y,
    };

    this.attackerScale = this.attacker.scale || 1;
    this.targetScale = this.target.scale || 1;

    this.attackerWidth = this.attacker.frameWidth * this.attackerScale;
    this.attackerHeight = this.attacker.frameHeight * this.attackerScale;

    this.targetWidth = this.target.frameWidth * this.targetScale;
    this.targetHeight = this.target.frameHeight * this.targetScale;

    this.attackerCenter = {
      x: this.originalAttackerPosition.x + this.attackerWidth / 2,
      y: this.originalAttackerPosition.y + this.attackerHeight / 2,
    };

    this.targetCenter = {
      x: this.originalTargetPosition.x + this.targetWidth / 2,
      y: this.originalTargetPosition.y + this.targetHeight / 2,
    };

    // Nombre de projectiles : 2 à 5 en première génération
    this.hitCount = Number.isInteger(turnAction.hitCount)
      ? Math.max(2, Math.min(5, turnAction.hitCount))
      : Math.floor(Math.random() * 4) + 2;

    this.phase = "PREPARE";
    this.timer = 0;

    this.phaseDuration = {
      PREPARE: 10,
      PROJECTILE: 8,
      IMPACT: 5,
      FINISH: 12,
    };

    this.hitIndex = 0;
    this.projectileProgress = 0;
    this.impactTimer = 0;

    this.projectile = null;
    this.particles = [];
    this.isFinished = false;

    this.impactPosition = {
      x: this.targetCenter.x,
      y: this.targetCenter.y,
    };

    this.flashAlpha = 0;
    this.finalImpact = false;
  }

  update(context) {
    if (this.isFinished) return;

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
    this.draw(context);
  }

  changePhase(phase) {
    this.phase = phase;
    this.timer = 0;
  }

  updatePrepare() {
    if (this.timer >= this.phaseDuration.PREPARE) {
      this.startProjectile();
      this.changePhase("PROJECTILE");
    }
  }

  startProjectile() {
    const offsetX = (Math.random() - 0.5) * 24;
    const offsetY = (Math.random() - 0.5) * 22;

    this.projectile = {
      startX: this.attackerCenter.x,
      startY: this.attackerCenter.y,
      endX: this.targetCenter.x + offsetX,
      endY: this.targetCenter.y + offsetY,
      x: this.attackerCenter.x,
      y: this.attackerCenter.y,
      size: 5 + Math.random() * 3,
      rotation: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.3,
    };

    this.projectileProgress = 0;
  }

  updateProjectile() {
    this.projectileProgress = Math.min(
      1,
      this.timer / this.phaseDuration.PROJECTILE
    );

    const progress = this.easeOutCubic(this.projectileProgress);

    this.projectile.x =
      this.projectile.startX +
      (this.projectile.endX - this.projectile.startX) * progress;

    this.projectile.y =
      this.projectile.startY +
      (this.projectile.endY - this.projectile.startY) * progress;

    this.projectile.rotation += this.projectile.spin;

    if (this.projectileProgress >= 1) {
      this.createImpact();
      this.changePhase("IMPACT");
    }
  }

  updateImpact() {
    this.impactTimer = this.timer;

    if (this.timer >= this.phaseDuration.IMPACT) {
      this.hitIndex++;

      if (this.hitIndex < this.hitCount) {
        this.startProjectile();
        this.changePhase("PROJECTILE");
      } else {
        this.finalImpact = true;
        this.changePhase("FINISH");
      }
    }
  }

  createImpact() {
    const x = this.projectile.endX;
    const y = this.projectile.endY;

    this.impactPosition = { x, y };

    const isLastHit = this.hitIndex === this.hitCount - 1;

    this.flashAlpha = isLastHit ? 0.9 : 0.55;

    // Secousse du canvas
    if (this.game.canvas?.startShake) {
      this.game.canvas.startShake(isLastHit ? 4 : 2, isLastHit ? 180 : 90);
    }

    // Particules d'impact
    const particleCount = isLastHit ? 16 : 9;

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const speed = 1.5 + Math.random() * (isLastHit ? 3 : 2);

      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 1.5 + Math.random() * 2,
        life: 1,
        decay: 0.06 + Math.random() * 0.04,
      });
    }
  }

  updateFinish() {
    this.flashAlpha = Math.max(0, this.flashAlpha - 0.08);

    if (this.timer >= this.phaseDuration.FINISH) {
      this.restorePositions();
      this.isFinished = true;
    }
  }

  updateParticles() {
    this.particles = this.particles.filter((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      particle.vx *= 0.94;
      particle.vy *= 0.94;
      particle.vy += 0.08;

      particle.life -= particle.decay;

      return particle.life > 0;
    });
  }

  draw(context) {
    if (!context) return;

    if (this.phase === "PROJECTILE" && this.projectile) {
      this.drawProjectile(context);
    }

    if (this.phase === "IMPACT" || this.phase === "FINISH") {
      this.drawImpact(context);
    }

    this.drawParticles(context);
  }

  drawProjectile(context) {
    const { x, y, size, rotation } = this.projectile;

    context.save();

    // Traînée lumineuse
    const gradient = context.createLinearGradient(x - 15, y, x + 4, y);

    gradient.addColorStop(0, "rgba(255, 180, 60, 0)");
    gradient.addColorStop(1, "rgba(255, 220, 130, 0.9)");

    context.strokeStyle = gradient;
    context.lineWidth = size * 1.2;
    context.lineCap = "round";

    context.beginPath();
    context.moveTo(x - 17, y);
    context.lineTo(x, y);
    context.stroke();

    // Projectile
    context.translate(x, y);
    context.rotate(rotation);

    context.fillStyle = "#9B7045";
    context.strokeStyle = "#51351F";
    context.lineWidth = 1;

    context.beginPath();
    context.ellipse(0, 0, size, size * 0.8, 0, 0, Math.PI * 2);
    context.fill();
    context.stroke();

    // Reflet
    context.fillStyle = "rgba(255, 225, 160, 0.8)";
    context.beginPath();
    context.ellipse(
      -size * 0.25,
      -size * 0.25,
      size * 0.35,
      size * 0.2,
      0,
      0,
      Math.PI * 2
    );
    context.fill();

    context.restore();
  }

  drawImpact(context) {
    const progress =
      this.phase === "IMPACT"
        ? this.timer / this.phaseDuration.IMPACT
        : 1 - this.timer / this.phaseDuration.FINISH;

    const alpha = Math.max(0, 1 - progress);
    const radius = this.finalImpact ? 20 : 12;

    context.save();

    // Flash d'impact
    context.globalAlpha = alpha * 0.65;
    context.fillStyle = "#FFF4B0";

    context.beginPath();
    context.arc(
      this.impactPosition.x,
      this.impactPosition.y,
      radius * (0.5 + progress),
      0,
      Math.PI * 2
    );
    context.fill();

    // Onde de choc
    context.globalAlpha = alpha;
    context.strokeStyle = this.finalImpact ? "#FFB52E" : "#F5D18A";
    context.lineWidth = this.finalImpact ? 2 : 1.5;

    context.beginPath();
    context.arc(
      this.impactPosition.x,
      this.impactPosition.y,
      radius * (0.5 + progress * 1.5),
      0,
      Math.PI * 2
    );
    context.stroke();

    context.restore();
  }

  drawParticles(context) {
    context.save();

    for (const particle of this.particles) {
      context.globalAlpha = particle.life;
      context.fillStyle = "#FFD36A";

      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fill();
    }

    context.restore();
  }

  restorePositions() {
    this.attacker.position.x = this.originalAttackerPosition.x;
    this.attacker.position.y = this.originalAttackerPosition.y;

    this.target.position.x = this.originalTargetPosition.x;
    this.target.position.y = this.originalTargetPosition.y;
  }

  easeOutCubic(value) {
    return 1 - Math.pow(1 - value, 3);
  }
}
