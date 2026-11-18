export class SpikeCannonAnimation {
  constructor(game, viewers, turnAction) {
    this.game = game;
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

    this.originalAttackerPosition = {
      x: this.attacker.position.x,
      y: this.attacker.position.y,
    };

    this.originalTargetPosition = {
      x: this.target.position.x,
      y: this.target.position.y,
    };

    this.attackerWidth = this.attacker.frameWidth * (this.attacker.scale || 1);

    this.targetWidth = this.target.frameWidth * (this.target.scale || 1);

    this.targetHeight = this.target.frameHeight * (this.target.scale || 1);

    this.targetCenter = {
      x: this.originalTargetPosition.x + this.targetWidth / 2,
      y: this.originalTargetPosition.y + this.targetHeight / 2,
    };

    this.direction =
      this.originalAttackerPosition.x < this.originalTargetPosition.x ? 1 : -1;

    this.hitCount = Number.isInteger(turnAction.hitCount)
      ? Math.max(2, Math.min(5, turnAction.hitCount))
      : Math.floor(Math.random() * 4) + 2;

    this.phase = "PREPARE";
    this.timer = 0;

    this.phaseDuration = {
      PREPARE: 12,
      LAUNCH_INTERVAL: 7,
      FINISH: 12,
      RETURN: 8,
    };

    this.projectiles = [];
    this.particles = [];

    this.launchIndex = 0;
    this.launchTimer = 0;

    this.attackerStartX = this.originalAttackerPosition.x;
    this.attackerTargetX = this.originalAttackerPosition.x + this.direction * 7;

    this.flashAlpha = 0;

    this.isFinished = false;
  }

  update(context) {
    if (this.isFinished) return;

    this.timer++;

    switch (this.phase) {
      case "PREPARE":
        this.updatePrepare();
        break;

      case "LAUNCH":
        this.updateLaunch();
        break;

      case "FINISH":
        this.updateFinish();
        break;

      case "RETURN":
        this.updateReturn();
        break;
    }

    this.updateProjectiles();
    this.updateParticles();

    this.draw(context);
  }

  changePhase(phase) {
    this.phase = phase;
    this.timer = 0;
  }

  updatePrepare() {
    const progress = Math.min(1, this.timer / this.phaseDuration.PREPARE);

    const eased = this.easeOutCubic(progress);

    this.attacker.position.x =
      this.attackerStartX +
      (this.attackerTargetX - this.attackerStartX) * eased;

    if (progress >= 1) {
      this.changePhase("LAUNCH");
      this.launchProjectile();
    }
  }

  updateLaunch() {
    this.launchTimer++;

    if (this.launchTimer >= this.phaseDuration.LAUNCH_INTERVAL) {
      this.launchTimer = 0;
      this.launchProjectile();
    }

    if (this.launchIndex >= this.hitCount && this.projectiles.length === 0) {
      this.changePhase("FINISH");
    }
  }

  launchProjectile() {
    if (this.launchIndex >= this.hitCount) return;

    const isFinalHit = this.launchIndex === this.hitCount - 1;

    const startX =
      this.attacker.position.x + this.attackerWidth / 2 + this.direction * 8;

    const startY =
      this.originalAttackerPosition.y +
      (this.attacker.frameHeight * (this.attacker.scale || 1)) / 2;

    const spread = (Math.random() - 0.5) * 16;

    const endX = this.targetCenter.x;
    const endY = this.targetCenter.y + spread;

    const dx = endX - startX;
    const dy = endY - startY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const speed = 8 + Math.random() * 2;

    this.projectiles.push({
      x: startX,
      y: startY,
      vx: (dx / distance) * speed,
      vy: (dy / distance) * speed,
      angle: Math.atan2(dy, dx),
      rotation: 0,
      rotationSpeed: 0.12 * this.direction,
      size: isFinalHit ? 13 : 11,
      life: 1,
      isFinalHit,
    });

    this.launchIndex++;
  }

  updateProjectiles() {
    this.projectiles = this.projectiles.filter((projectile) => {
      projectile.x += projectile.vx;
      projectile.y += projectile.vy;

      projectile.rotation += projectile.rotationSpeed;

      const dx = projectile.x - this.targetCenter.x;
      const dy = projectile.y - this.targetCenter.y;

      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 12) {
        this.createImpact(projectile);
        return false;
      }

      return true;
    });
  }

  createImpact(projectile) {
    const particleCount = projectile.isFinalHit ? 10 : 5;

    if (projectile.isFinalHit) {
      this.flashAlpha = 0.75;

      if (this.game.canvas?.startShake) {
        this.game.canvas.startShake(4, 140);
      }
    }

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 3;

      this.particles.push({
        x: projectile.x,
        y: projectile.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 1 + Math.random() * 2,
        life: 1,
        decay: 0.1,
      });
    }
  }

  updateFinish() {
    this.flashAlpha = Math.max(0, this.flashAlpha - 0.1);

    if (this.timer >= this.phaseDuration.FINISH) {
      this.changePhase("RETURN");
    }
  }

  updateReturn() {
    const progress = Math.min(1, this.timer / this.phaseDuration.RETURN);

    const eased = this.easeOutCubic(progress);

    this.attacker.position.x =
      this.attackerTargetX +
      (this.originalAttackerPosition.x - this.attackerTargetX) * eased;

    if (progress >= 1) {
      this.restorePositions();
      this.isFinished = true;
    }
  }

  updateParticles() {
    this.particles = this.particles.filter((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      particle.vx *= 0.92;
      particle.vy *= 0.92;

      particle.life -= particle.decay;

      return particle.life > 0;
    });
  }

  draw(context) {
    if (!context) return;

    this.drawProjectiles(context);
    this.drawParticles(context);
    this.drawFlash(context);
  }

  drawProjectiles(context) {
    context.save();

    for (const projectile of this.projectiles) {
      context.save();

      context.translate(projectile.x, projectile.y);
      context.rotate(projectile.angle + projectile.rotation);

      // Traînée métallique
      context.globalAlpha = 0.35;
      context.fillStyle = "#AEB9C4";

      context.beginPath();
      context.moveTo(-projectile.size * 2, -projectile.size * 0.4);
      context.lineTo(0, -projectile.size * 0.4);
      context.lineTo(0, projectile.size * 0.4);
      context.lineTo(-projectile.size * 2, projectile.size * 0.4);
      context.closePath();
      context.fill();

      // Corps de la pointe
      context.globalAlpha = 1;
      context.fillStyle = "#8796A5";

      context.beginPath();
      context.moveTo(projectile.size * 1.8, 0);
      context.lineTo(-projectile.size, -projectile.size * 0.65);
      context.lineTo(-projectile.size * 0.55, 0);
      context.lineTo(-projectile.size, projectile.size * 0.65);
      context.closePath();
      context.fill();

      // Reflet blanc
      context.fillStyle = "#EAF2F8";

      context.beginPath();
      context.moveTo(projectile.size * 1.8, 0);
      context.lineTo(-projectile.size * 0.7, -projectile.size * 0.4);
      context.lineTo(-projectile.size * 0.2, 0);
      context.closePath();
      context.fill();

      context.restore();
    }

    context.restore();
  }

  drawParticles(context) {
    context.save();

    for (const particle of this.particles) {
      context.globalAlpha = particle.life;
      context.fillStyle = "#DCE8F0";

      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fill();
    }

    context.restore();
  }

  drawFlash(context) {
    if (this.flashAlpha <= 0) return;

    context.save();

    context.globalAlpha = this.flashAlpha;
    context.fillStyle = "#FFFFFF";

    context.beginPath();
    context.arc(this.targetCenter.x, this.targetCenter.y, 11, 0, Math.PI * 2);

    context.fill();
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
