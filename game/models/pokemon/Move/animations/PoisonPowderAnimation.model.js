export class PoisonPowderAnimation {
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

    this.attackerCenter = this.getCenter(this.attacker);
    this.targetCenter = this.getCenter(this.target);

    const dx = this.targetCenter.x - this.attackerCenter.x;
    const dy = this.targetCenter.y - this.attackerCenter.y;
    const distance = Math.hypot(dx, dy) || 1;

    this.directionX = dx / distance;
    this.directionY = dy / distance;

    this.perpendicularX = -this.directionY;
    this.perpendicularY = this.directionX;

    this.phase = "PREPARE";
    this.frame = 0;
    this.isFinished = false;

    this.duration = {
      PREPARE: 20,
      RELEASE: 28,
      POISON: 48,
      FINISH: 24,
    };

    this.projectile = null;

    this.spores = [];
    this.cloudParticles = [];
    this.orbitParticles = [];
    this.particles = [];
    this.ripples = [];

    this.charge = 0;
    this.cloudOpacity = 0;
    this.cloudScale = 0;
    this.cloudRotation = 0;
    this.pulse = 0;

    this.createInitialSpores();
  }

  // --------------------------------------------------
  // UTILITIES
  // --------------------------------------------------

  getCenter(sprite) {
    return {
      x: sprite.position.x + sprite.frameWidth / 2,
      y: sprite.position.y + sprite.frameHeight / 2,
    };
  }

  random(min, max) {
    return min + Math.random() * (max - min);
  }

  clamp(value) {
    return Math.max(0, Math.min(1, value));
  }

  easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  easeInOut(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  changePhase(phase) {
    this.phase = phase;
    this.frame = 0;
  }

  // --------------------------------------------------
  // UPDATE
  // --------------------------------------------------

  update(context) {
    if (this.isFinished) return;

    this.frame++;

    switch (this.phase) {
      case "PREPARE":
        this.updatePrepare();
        break;

      case "RELEASE":
        this.updateRelease();
        break;

      case "POISON":
        this.updatePoison();
        break;

      case "FINISH":
        this.updateFinish();
        break;
    }

    this.updateEffects();
    this.draw(context);
  }

  // --------------------------------------------------
  // PREPARE
  // --------------------------------------------------

  updatePrepare() {
    const progress = this.clamp(this.frame / this.duration.PREPARE);

    this.charge = this.easeOut(progress);

    if (this.frame % 2 === 0) {
      this.createOrbitParticle();
    }

    if (this.frame % 3 === 0) {
      this.createSpore(
        this.attackerCenter.x + this.random(-5, 5),
        this.attackerCenter.y + this.random(-5, 5)
      );
    }

    this.orbitParticles.forEach((particle) => {
      particle.angle += particle.speed;
      particle.radius += 0.08;
    });

    if (progress >= 1) {
      this.initializeProjectile();
      this.changePhase("RELEASE");
    }
  }

  createInitialSpores() {
    for (let i = 0; i < 8; i++) {
      const angle = Math.random() * Math.PI * 2;

      this.spores.push({
        x: this.attackerCenter.x,
        y: this.attackerCenter.y,
        vx: Math.cos(angle) * this.random(0.2, 0.7),
        vy: Math.sin(angle) * this.random(0.2, 0.7),
        size: this.random(1.5, 3),
        alpha: 0.6,
        life: this.random(15, 25),
        maxLife: 25,
        rotation: Math.random() * Math.PI,
        type: "SPORE",
      });
    }
  }

  createOrbitParticle() {
    this.orbitParticles.push({
      angle: Math.random() * Math.PI * 2,
      radius: this.random(8, 18),
      speed: this.random(0.06, 0.14),
      size: this.random(1.5, 3),
      alpha: 0.9,
    });
  }

  createSpore(x, y) {
    const angle = Math.random() * Math.PI * 2;

    this.spores.push({
      x,
      y,
      vx: Math.cos(angle) * this.random(0.2, 0.8),
      vy: Math.sin(angle) * this.random(0.2, 0.8),
      size: this.random(2, 4),
      alpha: 0.9,
      life: this.random(25, 40),
      maxLife: 40,
      rotation: Math.random() * Math.PI * 2,
      type: "SPORE",
    });
  }

  // --------------------------------------------------
  // RELEASE
  // --------------------------------------------------

  initializeProjectile() {
    this.projectile = {
      x: this.attackerCenter.x,
      y: this.attackerCenter.y,
      speed: 4.5,
      radius: 7,
      rotation: 0,
    };
  }

  updateRelease() {
    if (!this.projectile) return;

    const progress = this.clamp(this.frame / this.duration.RELEASE);

    const movement = this.easeInOut(progress);

    const distance = Math.hypot(
      this.targetCenter.x - this.attackerCenter.x,
      this.targetCenter.y - this.attackerCenter.y
    );

    const travelDistance = Math.max(0, distance - 10);

    this.projectile.x =
      this.attackerCenter.x + this.directionX * travelDistance * movement;

    this.projectile.y =
      this.attackerCenter.y + this.directionY * travelDistance * movement;

    this.projectile.rotation += 0.16;

    this.cloudOpacity = this.easeOut(progress);
    this.cloudScale = 0.5 + movement * 0.6;

    if (this.frame % 2 === 0) {
      this.createProjectileSpore();
      this.createProjectileSpore();
    }

    if (progress >= 1) {
      this.createPoisonCloud();
      this.changePhase("POISON");
    }
  }

  createProjectileSpore() {
    if (!this.projectile) return;

    this.spores.push({
      x: this.projectile.x + this.random(-5, 5),
      y: this.projectile.y + this.random(-5, 5),
      vx:
        this.directionX * this.random(-0.4, 0.8) +
        this.perpendicularX * this.random(-1.5, 1.5),
      vy:
        this.directionY * this.random(-0.4, 0.8) +
        this.perpendicularY * this.random(-1.5, 1.5),
      size: this.random(2, 4),
      alpha: 0.9,
      life: this.random(18, 30),
      maxLife: 30,
      rotation: Math.random() * Math.PI * 2,
      type: "SPORE",
    });
  }

  // --------------------------------------------------
  // POISON CLOUD
  // --------------------------------------------------

  createPoisonCloud() {
    this.cloudOpacity = 1;
    this.cloudScale = 1;

    for (let i = 0; i < 38; i++) {
      this.createCloudParticle(true);
    }

    for (let i = 0; i < 12; i++) {
      this.createRipple();
    }

    for (let i = 0; i < 18; i++) {
      this.createSpore(
        this.targetCenter.x + this.random(-25, 25),
        this.targetCenter.y + this.random(-25, 25)
      );
    }
  }

  updatePoison() {
    const progress = this.clamp(this.frame / this.duration.POISON);

    this.cloudOpacity = 1;
    this.cloudScale = 1 + Math.sin(this.frame * 0.12) * 0.06;

    this.cloudRotation += 0.025;
    this.pulse = Math.sin(this.frame * 0.22);

    if (this.frame % 2 === 0) {
      this.createCloudParticle();
    }

    if (this.frame % 4 === 0) {
      this.createSpore(
        this.targetCenter.x + this.random(-24, 24),
        this.targetCenter.y + this.random(-24, 24)
      );
    }

    if (this.frame % 8 === 0) {
      this.createRipple();
    }

    if (progress >= 1) {
      this.changePhase("FINISH");
    }
  }

  createCloudParticle(initial = false) {
    const angle = Math.random() * Math.PI * 2;
    const radius = initial ? this.random(5, 24) : this.random(14, 29);

    this.cloudParticles.push({
      x: this.targetCenter.x + Math.cos(angle) * radius,
      y: this.targetCenter.y + Math.sin(angle) * radius,
      angle,
      radius,
      speed: this.random(0.025, 0.065),
      size: this.random(3, 8),
      alpha: this.random(0.35, 0.75),
      life: this.random(30, 55),
      maxLife: 55,
      wobble: Math.random() * Math.PI * 2,
    });
  }

  createRipple() {
    this.ripples.push({
      x: this.targetCenter.x,
      y: this.targetCenter.y,
      radius: this.random(5, 12),
      speed: this.random(1.1, 2),
      alpha: 0.7,
      rotation: Math.random() * Math.PI,
    });
  }

  // --------------------------------------------------
  // FINISH
  // --------------------------------------------------

  updateFinish() {
    const progress = this.clamp(this.frame / this.duration.FINISH);

    this.cloudOpacity = 1 - this.easeOut(progress);
    this.cloudScale = 1 + progress * 0.3;

    if (this.frame % 3 === 0) {
      this.createSpore(
        this.targetCenter.x + this.random(-25, 25),
        this.targetCenter.y + this.random(-25, 25)
      );
    }

    if (this.frame >= this.duration.FINISH) {
      this.isFinished = true;
    }
  }

  // --------------------------------------------------
  // EFFECT UPDATE
  // --------------------------------------------------

  updateEffects() {
    this.spores.forEach((spore) => {
      spore.x += spore.vx;
      spore.y += spore.vy;

      spore.vx *= 0.97;
      spore.vy *= 0.97;

      spore.rotation += 0.08;
      spore.life--;

      spore.alpha = Math.min(1, spore.life / 10);
    });

    this.spores = this.spores.filter((spore) => spore.life > 0);

    this.cloudParticles.forEach((particle) => {
      particle.angle += particle.speed;
      particle.wobble += 0.1;

      particle.x =
        this.targetCenter.x +
        Math.cos(particle.angle) * particle.radius +
        Math.sin(particle.wobble) * 3;

      particle.y =
        this.targetCenter.y + Math.sin(particle.angle) * particle.radius * 0.65;

      particle.life--;

      particle.alpha = Math.min(particle.alpha, particle.life / 12);
    });

    this.cloudParticles = this.cloudParticles.filter(
      (particle) => particle.life > 0
    );

    this.ripples.forEach((ripple) => {
      ripple.radius += ripple.speed;
      ripple.alpha -= 0.035;
    });

    this.ripples = this.ripples.filter((ripple) => ripple.alpha > 0);
  }

  // --------------------------------------------------
  // DRAW
  // --------------------------------------------------

  draw(context) {
    this.drawProjectile(context);
    this.drawCloud(context);
    this.drawCloudParticles(context);
    this.drawRipples(context);
    this.drawSpores(context);
    this.drawOrbitParticles(context);
  }

  drawProjectile(context) {
    if (!this.projectile || this.phase !== "RELEASE") return;

    const projectile = this.projectile;

    context.save();

    context.translate(projectile.x, projectile.y);
    context.rotate(projectile.rotation);

    const gradient = context.createRadialGradient(
      0,
      0,
      1,
      0,
      0,
      projectile.radius * 2.2
    );

    gradient.addColorStop(0, "rgba(255,180,255,0.9)");
    gradient.addColorStop(0.45, "rgba(205,55,235,0.8)");
    gradient.addColorStop(1, "rgba(125,15,175,0)");

    context.fillStyle = gradient;

    context.beginPath();
    context.arc(0, 0, projectile.radius * 2.2, 0, Math.PI * 2);
    context.fill();

    context.fillStyle = "#e878ff";

    context.beginPath();
    context.arc(0, 0, projectile.radius * 0.6, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }

  drawCloud(context) {
    if (this.cloudOpacity <= 0) return;

    const radius = 28 * this.cloudScale;

    context.save();

    context.globalAlpha = this.cloudOpacity;

    const gradient = context.createRadialGradient(
      this.targetCenter.x,
      this.targetCenter.y,
      2,
      this.targetCenter.x,
      this.targetCenter.y,
      radius
    );

    gradient.addColorStop(0, "rgba(170,40,205,0.32)");
    gradient.addColorStop(0.55, "rgba(125,20,165,0.38)");
    gradient.addColorStop(1, "rgba(85,10,125,0)");

    context.fillStyle = gradient;

    context.beginPath();
    context.arc(
      this.targetCenter.x,
      this.targetCenter.y,
      radius,
      0,
      Math.PI * 2
    );
    context.fill();

    // Volutes violettes autour de la cible.
    for (let i = 0; i < 5; i++) {
      const angle = this.cloudRotation + (Math.PI * 2 * i) / 5;

      const x = this.targetCenter.x + Math.cos(angle) * radius * 0.55;

      const y = this.targetCenter.y + Math.sin(angle) * radius * 0.4;

      context.globalAlpha = this.cloudOpacity * (0.35 + this.pulse * 0.08);

      context.fillStyle = i % 2 === 0 ? "#d75bea" : "#9633bd";

      context.beginPath();
      context.arc(x, y, 5 + Math.sin(this.frame * 0.2 + i) * 2, 0, Math.PI * 2);
      context.fill();
    }

    context.restore();
  }

  drawCloudParticles(context) {
    context.save();

    this.cloudParticles.forEach((particle) => {
      context.globalAlpha = particle.alpha * this.cloudOpacity;

      const gradient = context.createRadialGradient(
        particle.x,
        particle.y,
        1,
        particle.x,
        particle.y,
        particle.size
      );

      gradient.addColorStop(0, "rgba(255,150,255,0.8)");
      gradient.addColorStop(0.5, "rgba(195,55,225,0.55)");
      gradient.addColorStop(1, "rgba(120,20,160,0)");

      context.fillStyle = gradient;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fill();
    });

    context.restore();
  }

  drawSpores(context) {
    context.save();

    this.spores.forEach((spore) => {
      context.save();

      context.translate(spore.x, spore.y);
      context.rotate(spore.rotation);

      context.globalAlpha = spore.alpha;

      context.fillStyle = "#e36cff";

      // Spore en forme de petite étoile organique.
      context.beginPath();
      context.moveTo(0, -spore.size);
      context.quadraticCurveTo(
        spore.size * 0.5,
        -spore.size * 0.4,
        spore.size,
        0
      );
      context.quadraticCurveTo(
        spore.size * 0.4,
        spore.size * 0.5,
        0,
        spore.size
      );
      context.quadraticCurveTo(
        -spore.size * 0.5,
        spore.size * 0.4,
        -spore.size,
        0
      );
      context.quadraticCurveTo(
        -spore.size * 0.4,
        -spore.size * 0.5,
        0,
        -spore.size
      );

      context.closePath();
      context.fill();

      context.restore();
    });

    context.restore();
  }

  drawOrbitParticles(context) {
    if (this.phase !== "PREPARE") return;

    context.save();

    this.orbitParticles.forEach((particle) => {
      const x =
        this.attackerCenter.x + Math.cos(particle.angle) * particle.radius;

      const y =
        this.attackerCenter.y +
        Math.sin(particle.angle) * particle.radius * 0.65;

      context.globalAlpha = particle.alpha * this.charge;
      context.fillStyle = "#d95cff";

      context.beginPath();
      context.arc(x, y, particle.size, 0, Math.PI * 2);
      context.fill();
    });

    context.restore();
  }

  drawRipples(context) {
    context.save();

    this.ripples.forEach((ripple) => {
      context.globalAlpha = ripple.alpha * this.cloudOpacity;
      context.strokeStyle = "#d96aff";
      context.lineWidth = 1.5;

      context.beginPath();
      context.ellipse(
        ripple.x,
        ripple.y,
        ripple.radius,
        ripple.radius * 0.6,
        ripple.rotation,
        0,
        Math.PI * 2
      );
      context.stroke();
    });

    context.restore();
  }
}
