export class EggBombAnimation {
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

    this.originalAttackerPosition = {
      x: this.attacker.position.x,
      y: this.attacker.position.y,
    };

    this.originalTargetPosition = {
      x: this.target.position.x,
      y: this.target.position.y,
    };

    this.attackerCenterX =
      this.attacker.position.x + this.attacker.frameWidth / 2;
    this.attackerCenterY =
      this.attacker.position.y + this.attacker.frameHeight / 2;

    this.targetCenterX = this.target.position.x + this.target.frameWidth / 2;
    this.targetCenterY = this.target.position.y + this.target.frameHeight / 2;

    this.directionX = this.targetCenterX - this.attackerCenterX;
    this.directionY = this.targetCenterY - this.attackerCenterY;

    this.distance = Math.hypot(this.directionX, this.directionY);

    if (this.distance > 0) {
      this.directionX /= this.distance;
      this.directionY /= this.distance;
    } else {
      this.directionX = 1;
      this.directionY = 0;
    }

    this.perpendicularX = -this.directionY;
    this.perpendicularY = this.directionX;

    this.phase = "PREPARE";
    this.frame = 0;
    this.isFinished = false;

    this.duration = {
      PREPARE: 16,
      THROW: 9,
      FLIGHT: 50,
      EXPLOSION: 38,
      FINISH: 18,
    };

    this.projectile = {
      x: this.attackerCenterX,
      y: this.attackerCenterY,
      startX: this.attackerCenterX,
      startY: this.attackerCenterY,
      progress: 0,
      rotation: 0,
      radius: 12,
      scale: 0.5,
      flight: null,
    };

    this.eggParticles = [];
    this.trailParticles = [];
    this.shellFragments = [];
    this.yolkParticles = [];
    this.splashDrops = [];
    this.rings = [];
    this.flashParticles = [];
    this.smokeParticles = [];

    this.explosion = {
      x: this.targetCenterX,
      y: this.targetCenterY,
      scale: 0,
      alpha: 1,
      flash: 0,
    };

    this.flashAlpha = 0;
    this.shakeTriggered = false;
    this.explosionCreated = false;
    this.attackerRecoil = 0;
  }

  easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  easeInCubic(t) {
    return t * t * t;
  }

  easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  update(context) {
    if (this.isFinished) return;

    this.frame++;

    switch (this.phase) {
      case "PREPARE":
        this.updatePrepare();
        break;

      case "THROW":
        this.updateThrow();
        break;

      case "FLIGHT":
        this.updateFlight();
        break;

      case "EXPLOSION":
        this.updateExplosion();
        break;

      case "FINISH":
        this.updateFinish();
        break;
    }

    this.draw(context);
  }

  changePhase(phase) {
    this.phase = phase;
    this.frame = 0;
  }

  updatePrepare() {
    const progress = Math.min(this.frame / this.duration.PREPARE, 1);

    const pulse = Math.sin(progress * Math.PI * 4);

    this.projectile.x = this.attackerCenterX + this.directionX * 15;

    this.projectile.y = this.attackerCenterY - 9 + pulse * 2;

    this.projectile.scale = 0.5 + progress * 0.5;
    this.projectile.radius = 8 + progress * 4;

    if (this.frame % 2 === 0) {
      this.createEggParticles();
    }

    this.updateParticles(this.eggParticles);

    if (progress >= 1) {
      this.projectile.startX = this.projectile.x;
      this.projectile.startY = this.projectile.y;

      this.changePhase("THROW");
    }
  }

  updateThrow() {
    const progress = Math.min(this.frame / this.duration.THROW, 1);

    const movement = this.easeOutCubic(progress);

    // Petit mouvement de recul du lanceur.
    this.attackerRecoil = Math.sin(progress * Math.PI) * 5;

    this.attacker.position.x =
      this.originalAttackerPosition.x - this.directionX * this.attackerRecoil;

    this.attacker.position.y =
      this.originalAttackerPosition.y + this.attackerRecoil * 0.3;

    this.projectile.x = this.projectile.startX + this.directionX * 5 * movement;

    this.projectile.y =
      this.projectile.startY +
      this.directionY * 5 * movement -
      Math.sin(progress * Math.PI) * 3;

    this.projectile.rotation += 0.18;

    this.updateParticles(this.eggParticles);

    if (progress >= 1) {
      this.initializeBallisticFlight();
      this.changePhase("FLIGHT");
    }
  }

  updateFlight() {
    const flight = this.projectile.flight;

    if (!flight) return;

    const elapsed = Math.min(this.frame, flight.duration);

    // Physique balistique : vitesse initiale + gravité.
    this.projectile.x = flight.startX + flight.velocityX * elapsed;

    this.projectile.y =
      flight.startY +
      flight.velocityY * elapsed +
      0.5 * flight.gravity * elapsed * elapsed;

    // Rotation de l'œuf pendant son vol.
    this.projectile.rotation += 0.24;

    // L'œuf accélère visuellement en approchant de la cible.
    const progress = elapsed / flight.duration;

    this.projectile.scale = 1 + Math.sin(progress * Math.PI) * 0.12;

    if (this.frame % 2 === 0) {
      this.createTrailParticle();
    }

    this.updateParticles(this.trailParticles);

    if (elapsed >= flight.duration) {
      // Garantit une position exacte à l'arrivée.
      this.projectile.x = flight.endX;
      this.projectile.y = flight.endY;

      this.createExplosion();
      this.changePhase("EXPLOSION");
    }
  }

  initializeBallisticFlight() {
    const duration = this.duration.FLIGHT;
    const arcHeight = 200;

    const startX = this.projectile.x;
    const startY = this.projectile.y;

    // Point d'arrivée légèrement en retrait du centre de la cible.
    const endX = this.targetCenterX - this.directionX * 12;
    const endY = this.targetCenterY - this.directionY * 12;

    const distanceX = endX - startX;
    const distanceY = endY - startY;

    // Gravité calculée pour obtenir la hauteur souhaitée.
    const gravity = (8 * arcHeight) / (duration * duration);

    this.projectile.flight = {
      startX,
      startY,
      endX,
      endY,
      velocityX: distanceX / duration,
      velocityY: distanceY / duration - (gravity * duration) / 2,
      gravity,
      duration,
    };
  }

  createEggParticles() {
    const angle = Math.random() * Math.PI * 2;

    this.eggParticles.push({
      x: this.projectile.x + Math.cos(angle) * 10,
      y: this.projectile.y + Math.sin(angle) * 10,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      radius: 1 + Math.random() * 2,
      alpha: 0.9,
      decay: 0.07,
      color: Math.random() > 0.5 ? "#fff4c9" : "#ffe38b",
    });
  }

  createTrailParticle() {
    const spread = (Math.random() - 0.5) * 13;

    this.trailParticles.push({
      x: this.projectile.x + this.perpendicularX * spread,
      y: this.projectile.y + this.perpendicularY * spread,
      vx: -this.directionX * (1 + Math.random() * 2),
      vy: -this.directionY * (1 + Math.random() * 2),
      radius: 1 + Math.random() * 2.5,
      alpha: 0.85,
      decay: 0.065,
      color: Math.random() > 0.5 ? "#fff6cf" : "#ffd95c",
    });
  }

  createExplosion() {
    if (this.explosionCreated) return;

    this.explosionCreated = true;

    this.explosion.x = this.targetCenterX;
    this.explosion.y = this.targetCenterY;

    this.game.canvas?.startShake?.(500, 15);

    this.flashAlpha = 1;
    this.explosion.flash = 1;

    // Trois ondes de choc.
    for (let i = 0; i < 5; i++) {
      this.rings.push({
        radius: 7 + i * 5,
        speed: 4 + i * 0.8,
        alpha: 1,
        decay: 0.035,
        width: 2 + (i % 2),
        color: i % 2 === 0 ? "#fff4d2" : "#ffd54f",
      });
    }

    // Grande projection centrale de jaune.
    for (let i = 0; i < 38; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 6;

      this.yolkParticles.push({
        x: this.explosion.x,
        y: this.explosion.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 3 + Math.random() * 8,
        alpha: 1,
        decay: 0.022 + Math.random() * 0.015,
      });
    }

    // Fragments de coquille.
    for (let i = 0; i < 32; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 8;

      this.shellFragments.push({
        x: this.explosion.x,
        y: this.explosion.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        size: 3 + Math.random() * 7,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.35,
        alpha: 1,
        decay: 0.022 + Math.random() * 0.018,
      });
    }

    // Gouttes de jaune projetées.
    for (let i = 0; i < 24; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 6;

      this.splashDrops.push({
        x: this.explosion.x,
        y: this.explosion.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        radius: 2 + Math.random() * 4,
        alpha: 1,
        decay: 0.035,
      });
    }

    // Étincelles lumineuses.
    for (let i = 0; i < 30; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 7;

      this.flashParticles.push({
        x: this.explosion.x,
        y: this.explosion.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 1 + Math.random() * 3,
        alpha: 1,
        decay: 0.045,
      });
    }

    // Petits nuages de fumée.
    for (let i = 0; i < 15; i++) {
      const angle = Math.random() * Math.PI * 2;

      this.smokeParticles.push({
        x: this.explosion.x,
        y: this.explosion.y,
        vx: Math.cos(angle) * (1 + Math.random() * 3),
        vy: Math.sin(angle) * (1 + Math.random() * 3),
        radius: 4 + Math.random() * 5,
        alpha: 0.5,
        decay: 0.025,
      });
    }
  }

  updateExplosion() {
    const progress = Math.min(this.frame / this.duration.EXPLOSION, 1);

    this.explosion.scale = this.easeOutCubic(progress);
    this.explosion.alpha = 1 - progress;

    this.flashAlpha = Math.max(0, 1 - this.frame / 6);

    this.updateRings();
    this.updateShellFragments();
    this.updateYolkParticles();
    this.updateParticles(this.splashDrops);
    this.updateParticles(this.flashParticles);
    this.updateParticles(this.smokeParticles);

    if (progress >= 1) {
      this.changePhase("FINISH");
    }
  }

  updateFinish() {
    const progress = Math.min(this.frame / this.duration.FINISH, 1);

    this.explosion.alpha = 1 - progress;

    this.updateRings();
    this.updateShellFragments();
    this.updateYolkParticles();
    this.updateParticles(this.splashDrops);
    this.updateParticles(this.flashParticles);
    this.updateParticles(this.smokeParticles);

    if (progress >= 1) {
      this.restorePositions();
      this.isFinished = true;
    }
  }

  updateRings() {
    this.rings.forEach((ring) => {
      ring.radius += ring.speed;
      ring.alpha -= ring.decay;
    });

    this.rings = this.rings.filter((ring) => ring.alpha > 0);
  }

  updateShellFragments() {
    this.shellFragments.forEach((fragment) => {
      fragment.x += fragment.vx;
      fragment.y += fragment.vy;

      fragment.vy += 0.22;
      fragment.vx *= 0.985;

      fragment.rotation += fragment.rotationSpeed;
      fragment.alpha -= fragment.decay;
    });

    this.shellFragments = this.shellFragments.filter(
      (fragment) => fragment.alpha > 0
    );
  }

  updateYolkParticles() {
    this.yolkParticles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      particle.vx *= 0.95;
      particle.vy *= 0.95;

      particle.radius *= 0.98;
      particle.alpha -= particle.decay;
    });

    this.yolkParticles = this.yolkParticles.filter(
      (particle) => particle.alpha > 0
    );
  }

  updateParticles(particles) {
    particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      particle.vx *= 0.96;
      particle.vy *= 0.96;

      particle.alpha -= particle.decay;
      particle.radius *= 0.985;
    });

    for (let i = particles.length - 1; i >= 0; i--) {
      if (particles[i].alpha <= 0) {
        particles.splice(i, 1);
      }
    }
  }

  draw(context) {
    context.save();

    switch (this.phase) {
      case "PREPARE":
      case "THROW":
        this.drawPreparation(context);
        break;

      case "FLIGHT":
        this.drawFlight(context);
        break;

      case "EXPLOSION":
      case "FINISH":
        this.drawExplosion(context);
        break;
    }

    context.restore();
  }

  drawPreparation(context) {
    this.drawParticles(context, this.eggParticles);

    context.save();

    context.translate(this.projectile.x, this.projectile.y);

    context.scale(this.projectile.scale, this.projectile.scale);

    this.drawEgg(context, 0, 0, this.projectile.rotation);

    context.restore();
  }

  drawFlight(context) {
    this.drawParticles(context, this.trailParticles);

    context.save();

    context.translate(this.projectile.x, this.projectile.y);

    context.rotate(this.projectile.rotation);

    this.drawEgg(context, 0, 0, 0);

    context.restore();
  }

  drawEgg(context, x, y) {
    context.save();

    context.translate(x, y);

    // Halo lumineux.
    context.globalAlpha = 0.3;
    context.fillStyle = "#fff1a8";
    context.shadowColor = "#fff1a8";
    context.shadowBlur = 18;

    context.beginPath();
    context.ellipse(0, 0, 17, 22, 0, 0, Math.PI * 2);
    context.fill();

    context.shadowBlur = 0;
    context.globalAlpha = 1;

    // Silhouette de l'œuf.
    const gradient = context.createLinearGradient(-10, -18, 10, 18);
    gradient.addColorStop(0, "#ffffff");
    gradient.addColorStop(0.5, "#fff7dc");
    gradient.addColorStop(1, "#e6d6b1");

    context.fillStyle = gradient;
    context.strokeStyle = "#b9a77f";
    context.lineWidth = 1.2;

    context.beginPath();
    context.moveTo(0, -15);
    context.bezierCurveTo(12, -13, 15, 2, 11, 13);
    context.bezierCurveTo(7, 23, -7, 23, -11, 13);
    context.bezierCurveTo(-15, 2, -12, -13, 0, -15);
    context.closePath();

    context.fill();
    context.stroke();

    // Reflet.
    context.fillStyle = "rgba(255,255,255,0.85)";
    context.beginPath();
    context.ellipse(-5, -6, 3, 7, -0.3, 0, Math.PI * 2);
    context.fill();

    // Petit éclat jaune.
    context.fillStyle = "#ffdc59";
    context.beginPath();
    context.arc(4, 8, 2.5, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }

  drawExplosion(context) {
    this.drawFlash(context);

    this.drawRings(context);
    this.drawSmoke(context);
    this.drawYolk(context);
    this.drawSplashDrops(context);
    this.drawShellFragments(context);
    this.drawParticles(context, this.flashParticles);
  }

  drawFlash(context) {
    if (this.flashAlpha <= 0) return;

    context.save();

    context.globalAlpha = this.flashAlpha * 0.65;
    context.fillStyle = "#ffffff";

    context.beginPath();
    context.arc(this.explosion.x, this.explosion.y, 42, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }

  drawRings(context) {
    this.rings.forEach((ring) => {
      context.save();

      context.globalAlpha = ring.alpha;
      context.strokeStyle = ring.color;
      context.lineWidth = ring.width;
      context.shadowColor = ring.color;
      context.shadowBlur = 10;

      context.beginPath();
      context.ellipse(
        this.explosion.x,
        this.explosion.y,
        ring.radius * 1.45,
        ring.radius * 0.65,
        0,
        0,
        Math.PI * 2
      );
      context.stroke();

      context.restore();
    });
  }

  drawYolk(context) {
    this.yolkParticles.forEach((particle) => {
      context.save();

      context.globalAlpha = particle.alpha;

      const gradient = context.createRadialGradient(
        particle.x - particle.radius * 0.3,
        particle.y - particle.radius * 0.3,
        1,
        particle.x,
        particle.y,
        particle.radius
      );

      gradient.addColorStop(0, "#fff6a4");
      gradient.addColorStop(0.55, "#ffd83d");
      gradient.addColorStop(1, "#f1a900");

      context.fillStyle = gradient;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fill();

      context.restore();
    });
  }

  drawSplashDrops(context) {
    this.splashDrops.forEach((drop) => {
      context.save();

      context.globalAlpha = drop.alpha;
      context.fillStyle = "#ffd52e";
      context.shadowColor = "#ffb900";
      context.shadowBlur = 5;

      context.beginPath();
      context.ellipse(
        drop.x,
        drop.y,
        drop.radius * 0.7,
        drop.radius * 1.4,
        Math.atan2(drop.vy, drop.vx),
        0,
        Math.PI * 2
      );
      context.fill();

      context.restore();
    });
  }

  drawShellFragments(context) {
    this.shellFragments.forEach((fragment) => {
      context.save();

      context.translate(fragment.x, fragment.y);
      context.rotate(fragment.rotation);

      context.globalAlpha = fragment.alpha;
      context.fillStyle = "#fff4d7";
      context.strokeStyle = "#c6b68f";
      context.lineWidth = 1;

      context.beginPath();
      context.moveTo(-fragment.size, -fragment.size * 0.4);
      context.lineTo(fragment.size * 0.8, -fragment.size);
      context.lineTo(fragment.size, fragment.size * 0.5);
      context.lineTo(-fragment.size * 0.4, fragment.size);
      context.closePath();

      context.fill();
      context.stroke();

      context.restore();
    });
  }

  drawSmoke(context) {
    this.smokeParticles.forEach((particle) => {
      context.save();

      context.globalAlpha = particle.alpha;
      context.fillStyle = "#b8a991";

      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fill();

      context.restore();
    });
  }

  drawParticles(context, particles) {
    particles.forEach((particle) => {
      context.save();

      context.globalAlpha = particle.alpha;
      context.fillStyle = particle.color || "#ffffff";
      context.shadowColor = particle.color || "#ffffff";
      context.shadowBlur = 8;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fill();

      context.restore();
    });
  }

  restorePositions() {
    this.attacker.position.x = this.originalAttackerPosition.x;
    this.attacker.position.y = this.originalAttackerPosition.y;

    this.target.position.x = this.originalTargetPosition.x;
    this.target.position.y = this.originalTargetPosition.y;
  }
}
