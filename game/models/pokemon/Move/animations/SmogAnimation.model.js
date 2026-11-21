export class SmogAnimation {
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

    this.distance = distance;

    this.phase = "PREPARE";
    this.frame = 0;
    this.isFinished = false;

    this.duration = {
      PREPARE: 40,
      EXPLOSION: 48,
      SMOG: 80,
      DISSIPATE: 70,
    };

    this.projectile = null;

    this.smoke = [];
    this.fragments = [];
    this.sparks = [];
    this.ripples = [];

    this.charge = 0;
    this.explosionFlash = 0;
    this.cloudOpacity = 0;
    this.cloudScale = 0;
    this.cloudRotation = 0;
    this.pulse = 0;

    this.shakeTriggered = false;

    this.createInitialSmoke();
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

  randomSmokeColor() {
    const colors = [
      "#473757",
      "#453357",
      "#453159",
      "#452e5c",
      "#492c66",
      "#502e73",
    ];

    return colors[Math.floor(Math.random() * colors.length)];
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

      case "EXPLOSION":
        this.updateExplosion();
        break;

      case "SMOG":
        this.updateSmog();
        break;

      case "DISSIPATE":
        this.updateDissipate();
        break;
    }

    this.updateEffects();
    this.draw(context);
  }

  // --------------------------------------------------
  // PREPARE
  // --------------------------------------------------

  createInitialSmoke() {
    for (let i = 0; i < 8; i++) {
      const angle = Math.random() * Math.PI * 2;

      this.smoke.push({
        x: this.attackerCenter.x,
        y: this.attackerCenter.y,
        vx: Math.cos(angle) * this.random(0.2, 0.7),
        vy: Math.sin(angle) * this.random(0.2, 0.7),
        size: this.random(3, 6),
        alpha: 0.45,
        life: this.random(18, 28),
        maxLife: 28,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: this.random(-0.04, 0.04),
        color: this.randomSmokeColor(),
        type: "PREPARE",
      });
    }
  }

  updatePrepare() {
    const progress = this.clamp(this.frame / this.duration.PREPARE);

    this.charge = this.easeInOut(progress);

    if (this.frame % 2 === 0) {
      this.createChargeSmoke();
    }

    if (this.frame % 4 === 0) {
      this.createSpark(this.attackerCenter);
    }

    if (progress >= 1) {
      this.initializeProjectile();
      this.changePhase("EXPLOSION");
    }
  }

  createChargeSmoke() {
    const angle = Math.random() * Math.PI * 2;
    const radius = this.random(3, 10);

    this.smoke.push({
      x: this.attackerCenter.x + Math.cos(angle) * radius,
      y: this.attackerCenter.y + Math.sin(angle) * radius,
      vx: Math.cos(angle) * -0.35,
      vy: Math.sin(angle) * -0.35,
      size: this.random(4, 8),
      alpha: 0.7,
      life: 22,
      maxLife: 22,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: this.random(-0.06, 0.06),
      color: this.randomSmokeColor(),
      type: "PREPARE",
    });
  }

  initializeProjectile() {
    this.projectile = {
      x: this.attackerCenter.x,
      y: this.attackerCenter.y,
      radius: 8,
      rotation: 0,
    };
  }

  // --------------------------------------------------
  // EXPLOSION
  // --------------------------------------------------

  updateExplosion() {
    const progress = this.clamp(this.frame / this.duration.EXPLOSION);

    const movement = this.easeOut(progress);

    const travelDistance = Math.max(0, this.distance - 12);

    this.projectile.x =
      this.attackerCenter.x + this.directionX * travelDistance * movement;

    this.projectile.y =
      this.attackerCenter.y + this.directionY * travelDistance * movement;

    this.projectile.radius = 8 + movement * 9;
    this.projectile.rotation += 0.18;

    if (this.frame % 2 === 0) {
      this.createProjectileSmoke();
    }

    if (progress >= 1) {
      this.createExplosion();
      this.changePhase("SMOG");
    }
  }

  createProjectileSmoke() {
    const angle = Math.random() * Math.PI * 2;

    this.smoke.push({
      x: this.projectile.x + Math.cos(angle) * 4,
      y: this.projectile.y + Math.sin(angle) * 4,
      vx: this.directionX * -0.4 + this.perpendicularX * this.random(-1.2, 1.2),
      vy: this.directionY * -0.4 + this.perpendicularY * this.random(-1.2, 1.2),
      size: this.random(5, 10),
      alpha: 0.75,
      life: 24,
      maxLife: 24,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: this.random(-0.08, 0.08),
      color: this.randomSmokeColor(),
      type: "TRAIL",
    });
  }

  createExplosion() {
    this.cloudOpacity = 1;
    this.cloudScale = 0.35;
    this.explosionFlash = 1;

    if (!this.shakeTriggered && this.game.canvas?.startShake) {
      this.game.canvas.startShake(11, 300);
      this.shakeTriggered = true;
    }

    // Première déflagration de fumée.
    for (let i = 0; i < 32; i++) {
      this.createSmokeBurst();
    }

    // Fragments de gaz projetés dans toutes les directions.
    for (let i = 0; i < 22; i++) {
      this.createFragment();
    }

    // Ondes de choc.
    for (let i = 0; i < 4; i++) {
      this.ripples.push({
        x: this.targetCenter.x,
        y: this.targetCenter.y,
        radius: 8 + i * 5,
        speed: 3 + i * 0.7,
        alpha: 0.85,
        rotation: Math.random() * Math.PI,
      });
    }

    for (let i = 0; i < 12; i++) {
      this.createSpark(this.targetCenter);
    }
  }

  createSmokeBurst() {
    const angle = Math.random() * Math.PI * 2;
    const speed = this.random(0.8, 3.2);

    this.smoke.push({
      x: this.targetCenter.x,
      y: this.targetCenter.y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: this.random(10, 19),
      alpha: this.random(0.55, 0.9),
      life: this.random(35, 55),
      maxLife: 55,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: this.random(-0.07, 0.07),
      color: this.randomSmokeColor(),
      type: "CLOUD",
    });
  }

  createFragment() {
    const angle = Math.random() * Math.PI * 2;
    const speed = this.random(1.5, 4.5);

    this.fragments.push({
      x: this.targetCenter.x,
      y: this.targetCenter.y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: this.random(3, 7),
      alpha: 1,
      life: this.random(16, 28),
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: this.random(-0.15, 0.15),
    });
  }

  // --------------------------------------------------
  // SMOG
  // --------------------------------------------------

  updateSmog() {
    const progress = this.clamp(this.frame / this.duration.SMOG);

    this.cloudOpacity = 1;
    this.cloudScale = 1 + Math.sin(this.frame * 0.32) * 0.0;
    this.cloudRotation += 0.018;
    this.pulse = Math.sin(this.frame * 0.18);

    // Le nuage continue de se renouveler.
    if (this.frame % 2 === 0) {
      this.createCloudPuff();
    }

    if (this.frame % 5 === 0) {
      this.createGasBubble();
    }

    if (this.frame % 9 === 0) {
      this.createRipple();
    }

    if (progress >= 1) {
      this.changePhase("DISSIPATE");
    }
  }

  createCloudPuff() {
    const angle = Math.random() * Math.PI * 2;
    const radius = this.random(18, 34);

    this.smoke.push({
      x: this.targetCenter.x + Math.cos(angle) * radius,
      y: this.targetCenter.y + Math.sin(angle) * radius * 0.65,
      vx: this.random(-0.35, 0.35),
      vy: this.random(-0.8, -0.15),
      size: this.random(15, 27),
      alpha: this.random(0.5, 0.8),
      life: this.random(38, 60),
      maxLife: 60,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: this.random(-0.05, 0.05),
      color: this.randomSmokeColor(),
      type: "CLOUD",
    });
  }

  createGasBubble() {
    const angle = Math.random() * Math.PI * 2;
    const radius = this.random(20, 34);

    this.fragments.push({
      x: this.targetCenter.x + Math.cos(angle) * radius,
      y: this.targetCenter.y + Math.sin(angle) * radius,
      vx: this.random(-0.4, 0.4),
      vy: this.random(-1.1, -0.4),
      size: this.random(2, 4),
      alpha: 0.8,
      life: this.random(15, 25),
      rotation: 0,
      rotationSpeed: 0,
      type: "BUBBLE",
    });
  }

  createRipple() {
    this.ripples.push({
      x: this.targetCenter.x,
      y: this.targetCenter.y,
      radius: this.random(8, 15),
      speed: this.random(1.2, 2),
      alpha: 0.55,
      rotation: Math.random() * Math.PI,
    });
  }

  // --------------------------------------------------
  // DISSIPATE
  // --------------------------------------------------

  updateDissipate() {
    const progress = this.clamp(this.frame / this.duration.DISSIPATE);

    this.cloudOpacity = 1 - this.easeOut(progress);
    this.cloudScale = 1 + progress * 0.45;

    // Quelques volutes s'élèvent avant de disparaître.
    if (this.frame % 4 === 0) {
      this.createDissipatingPuff();
    }

    if (this.frame >= this.duration.DISSIPATE) {
      this.isFinished = true;
    }
  }

  createDissipatingPuff() {
    this.smoke.push({
      x: this.targetCenter.x + this.random(-18, 18),
      y: this.targetCenter.y + this.random(-18, 18),
      vx: this.random(-0.5, 0.5),
      vy: this.random(-1.2, -0.4),
      size: this.random(6, 12),
      alpha: 0.45,
      life: 24,
      maxLife: 24,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: this.random(-0.06, 0.06),
      color: this.randomSmokeColor(),
      type: "CLOUD",
    });
  }

  // --------------------------------------------------
  // PARTICLES
  // --------------------------------------------------

  createSpark(center) {
    this.sparks.push({
      x: center.x + this.random(-10, 10),
      y: center.y + this.random(-10, 10),
      vx: this.random(-1.5, 1.5),
      vy: this.random(-1.5, 1.5),
      size: this.random(1, 3),
      alpha: 0.9,
      life: 12,
    });
  }

  updateEffects() {
    this.explosionFlash = Math.max(0, this.explosionFlash - 0.09);

    this.smoke.forEach((puff) => {
      puff.x += puff.vx;
      puff.y += puff.vy;

      puff.vx *= 0.985;
      puff.vy *= 0.985;

      puff.rotation += puff.rotationSpeed;

      if (puff.type === "CLOUD") {
        puff.size += 0.08;
      }

      puff.life--;

      puff.alpha = Math.min(puff.alpha, puff.life / 14);
    });

    this.smoke = this.smoke.filter((puff) => puff.life > 0);

    this.fragments.forEach((fragment) => {
      fragment.x += fragment.vx;
      fragment.y += fragment.vy;

      fragment.vx *= 0.96;
      fragment.vy *= 0.96;

      fragment.rotation += fragment.rotationSpeed;
      fragment.life--;

      fragment.alpha = Math.min(1, fragment.life / 8);
    });

    this.fragments = this.fragments.filter((fragment) => fragment.life > 0);

    this.sparks.forEach((spark) => {
      spark.x += spark.vx;
      spark.y += spark.vy;

      spark.vx *= 0.94;
      spark.vy *= 0.94;

      spark.life--;
      spark.alpha = Math.min(1, spark.life / 5);
    });

    this.sparks = this.sparks.filter((spark) => spark.life > 0);

    this.ripples.forEach((ripple) => {
      ripple.radius += ripple.speed;
      ripple.alpha -= 0.04;
    });

    this.ripples = this.ripples.filter((ripple) => ripple.alpha > 0);
  }

  // --------------------------------------------------
  // DRAW
  // --------------------------------------------------

  draw(context) {
    this.drawProjectile(context);
    this.drawSmoke(context);
    this.drawFragments(context);
    this.drawRipples(context);
    this.drawSparks(context);
    this.drawExplosionFlash(context);
  }

  drawProjectile(context) {
    if (!this.projectile || this.phase !== "EXPLOSION") return;

    const p = this.projectile;

    context.save();
    context.translate(p.x, p.y);
    context.rotate(p.rotation);

    const gradient = context.createRadialGradient(
      0,
      0,
      1,
      0,
      0,
      p.radius * 2.2
    );

    gradient.addColorStop(0, "rgba(145,125,105,0.95)");
    gradient.addColorStop(0.5, "rgba(85,75,85,0.85)");
    gradient.addColorStop(1, "rgba(55,45,65,0)");

    context.fillStyle = gradient;

    context.beginPath();
    context.arc(0, 0, p.radius * 2.2, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }

  drawSmoke(context) {
    context.save();

    this.smoke.forEach((puff) => {
      context.save();

      context.translate(puff.x, puff.y);
      context.rotate(puff.rotation);

      const scale =
        this.phase === "PREPARE"
          ? 0.7 + this.charge * 0.5
          : this.phase === "DISSIPATE"
          ? this.cloudScale
          : 1;

      const radius = puff.size * scale;

      const gradient = context.createRadialGradient(
        -radius * 0.25,
        -radius * 0.3,
        1,
        0,
        0,
        radius
      );

      gradient.addColorStop(0, "rgba(125,110,120,0.8)");

      gradient.addColorStop(0.5, "rgba(75,65,80,0.75)");

      gradient.addColorStop(1, "rgba(45,40,52,0)");

      context.globalAlpha =
        puff.alpha * (puff.type === "CLOUD" ? this.cloudOpacity || 1 : 1);

      context.fillStyle = gradient;

      context.beginPath();
      context.arc(0, 0, radius, 0, Math.PI * 2);
      context.fill();

      // Une seconde masse décalée donne du volume à la fumée.
      context.globalAlpha *= 0.55;
      context.fillStyle = puff.color;

      context.beginPath();
      context.arc(radius * 0.35, -radius * 0.25, radius * 0.58, 0, Math.PI * 2);
      context.fill();

      context.restore();
    });

    context.restore();
  }

  drawFragments(context) {
    context.save();

    this.fragments.forEach((fragment) => {
      context.save();

      context.translate(fragment.x, fragment.y);
      context.rotate(fragment.rotation);

      context.globalAlpha = fragment.alpha;

      if (fragment.type === "BUBBLE") {
        context.fillStyle = "rgba(145,110,125,0.7)";
        context.strokeStyle = "rgba(205,175,180,0.65)";
        context.lineWidth = 1;

        context.beginPath();
        context.arc(0, 0, fragment.size, 0, Math.PI * 2);
        context.fill();
        context.stroke();
      } else {
        context.fillStyle = "#817078";

        context.beginPath();
        context.ellipse(
          0,
          0,
          fragment.size * 1.4,
          fragment.size * 0.75,
          0,
          0,
          Math.PI * 2
        );
        context.fill();
      }

      context.restore();
    });

    context.restore();
  }

  drawRipples(context) {
    context.save();

    this.ripples.forEach((ripple) => {
      context.globalAlpha = ripple.alpha;
      context.strokeStyle = "#a69a9b";
      context.lineWidth = 2;

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

  drawSparks(context) {
    context.save();

    this.sparks.forEach((spark) => {
      context.globalAlpha = spark.alpha;
      context.fillStyle = "#c4a7a0";

      context.beginPath();
      context.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2);
      context.fill();
    });

    context.restore();
  }

  drawExplosionFlash(context) {
    if (this.explosionFlash <= 0) return;

    context.save();

    context.globalAlpha = this.explosionFlash * 0.3;
    context.fillStyle = "#d5c4b9";

    context.beginPath();
    context.arc(
      this.targetCenter.x,
      this.targetCenter.y,
      42 * this.explosionFlash,
      0,
      Math.PI * 2
    );
    context.fill();

    context.restore();
  }
}
