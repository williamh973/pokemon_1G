export class PetalDanceAnimation {
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

    this.getCenter = (sprite) => ({
      x: sprite.position.x + sprite.frameWidth / 2,
      y: sprite.position.y + sprite.frameHeight / 2,
    });

    this.attackerCenter = this.getCenter(this.attacker);
    this.targetCenter = this.getCenter(this.target);

    const dx = this.targetCenter.x - this.attackerCenter.x;
    const dy = this.targetCenter.y - this.attackerCenter.y;
    const distance = Math.hypot(dx, dy) || 1;

    this.directionX = dx / distance;
    this.directionY = dy / distance;
    this.distance = distance;

    this.perpendicularX = -this.directionY;
    this.perpendicularY = this.directionX;

    this.phase = "CHARGE";
    this.frame = 0;
    this.isFinished = false;

    this.duration = {
      CHARGE: 35,
      PREPARE: 20,
      DANCE: 38,
      IMPACT: 42,
      FINISH: 28,
    };

    this.petals = [];
    this.trails = [];
    this.rings = [];
    this.sparkles = [];
    this.impactParticles = [];
    this.windParticles = [];

    this.vortex = {
      x: this.attackerCenter.x,
      y: this.attackerCenter.y,
      radius: 8,
      rotation: 0,
      intensity: 0,
      alpha: 0,
    };

    this.impactFlash = 0;
    this.shakeTriggered = false;

    this.createInitialPetals();
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

  update(context) {
    if (this.isFinished) return;

    this.frame++;

    switch (this.phase) {
      case "CHARGE":
        this.updateCharge();
        break;

      case "PREPARE":
        this.updatePrepare();
        break;

      case "DANCE":
        this.updateDance();
        break;

      case "IMPACT":
        this.updateImpact();
        break;

      case "FINISH":
        this.updateFinish();
        break;
    }

    this.updatePetals();
    this.updateEffects();

    this.draw(context);
  }

  createInitialPetals() {
    for (let i = 0; i < 24; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = this.random(8, 30);

      this.petals.push({
        x: this.attackerCenter.x + Math.cos(angle) * radius,
        y: this.attackerCenter.y + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        angle,
        radius,
        orbitSpeed: this.random(0.04, 0.12),
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: this.random(-0.2, 0.2),
        size: this.random(3, 6),
        alpha: 1,
        life: 200,
        maxLife: 200,
        type: "ORBIT",
        color: this.randomPetalColor(),
      });
    }
  }

  randomPetalColor() {
    const colors = [
      "#ff9fcf",
      "#ffb5dc",
      "#f77eb9",
      "#ffd0e7",
      "#e96cae",
      "#fff0f7",
    ];

    return colors[Math.floor(Math.random() * colors.length)];
  }

  createPetal(x, y, vx, vy, size = null) {
    this.petals.push({
      x,
      y,
      vx,
      vy,
      angle: 0,
      radius: 0,
      orbitSpeed: 0,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: this.random(-0.2, 0.2),
      size: size ?? this.random(3, 7),
      alpha: 1,
      life: this.random(35, 70),
      maxLife: 70,
      type: "FLYING",
      color: this.randomPetalColor(),
    });
  }

  updatePrepare() {
    const progress = this.clamp(this.frame / this.duration.PREPARE);

    this.vortex.radius = 8 + progress * 19;
    this.vortex.rotation += 0.12;
    this.vortex.intensity = progress;
    this.vortex.alpha = progress;

    this.petals.forEach((petal) => {
      if (petal.type !== "ORBIT") return;

      petal.angle += petal.orbitSpeed;
      petal.radius += 0.15;

      petal.x = this.attackerCenter.x + Math.cos(petal.angle) * petal.radius;

      petal.y =
        this.attackerCenter.y + Math.sin(petal.angle) * petal.radius * 0.7;
    });

    if (this.frame % 2 === 0) {
      const angle = Math.random() * Math.PI * 2;

      this.createPetal(
        this.attackerCenter.x,
        this.attackerCenter.y,
        Math.cos(angle) * this.random(1, 3),
        Math.sin(angle) * this.random(1, 3)
      );
    }

    if (this.frame >= this.duration.PREPARE) {
      this.changePhase("DANCE");
    }
  }

  updateCharge() {
    const progress = this.clamp(this.frame / this.duration.CHARGE);

    const acceleration = this.easeInOut(progress);

    // Le tourbillon se forme progressivement autour du lanceur.
    this.vortex.x = this.attackerCenter.x;
    this.vortex.y = this.attackerCenter.y;

    this.vortex.radius = 8 + acceleration * 24;
    this.vortex.rotation += 0.12 + acceleration * 0.3;
    this.vortex.intensity = acceleration;
    this.vortex.alpha = acceleration;

    // Apparition progressive des pétales.
    if (this.frame % 2 === 0) {
      const angle = Math.random() * Math.PI * 2;
      const radius = this.random(12, 30);

      const petal = {
        x: this.attackerCenter.x + Math.cos(angle) * radius,
        y: this.attackerCenter.y + Math.sin(angle) * radius * 0.7,
        vx: 0,
        vy: 0,
        angle,
        radius,
        orbitSpeed: 0.035 + acceleration * 0.12,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: this.random(-0.2, 0.2),
        size: this.random(3, 7),
        alpha: 1,
        life: 200,
        maxLife: 200,
        type: "ORBIT",
        color: this.randomPetalColor(),
      };

      this.petals.push(petal);
    }

    // Les pétales tournent de plus en plus vite.
    this.petals.forEach((petal) => {
      if (petal.type !== "ORBIT") return;

      petal.orbitSpeed += 0.0015;

      petal.angle += petal.orbitSpeed;
      petal.radius += 0.08 + acceleration * 0.12;

      petal.x = this.attackerCenter.x + Math.cos(petal.angle) * petal.radius;

      petal.y =
        this.attackerCenter.y + Math.sin(petal.angle) * petal.radius * 0.7;

      petal.rotation += petal.rotationSpeed;
    });

    if (this.frame >= this.duration.CHARGE) {
      this.changePhase("PREPARE");
    }
  }

  updateDance() {
    const progress = this.clamp(this.frame / this.duration.DANCE);

    const movement = this.easeInOut(progress);

    this.vortex.x =
      this.attackerCenter.x +
      (this.targetCenter.x - this.attackerCenter.x) * movement;

    this.vortex.y =
      this.attackerCenter.y +
      (this.targetCenter.y - this.attackerCenter.y) * movement;

    this.vortex.radius = 12 + progress * 27;
    this.vortex.rotation += 0.24;
    this.vortex.intensity = 1;
    this.vortex.alpha = 1;

    // Les pétales orbitaux deviennent des pétales lancés.
    this.petals.forEach((petal) => {
      if (petal.type !== "ORBIT") return;

      petal.type = "FLYING";

      const side = this.random(-1, 1);
      petal.vx =
        this.directionX * this.random(1.5, 3.5) +
        this.perpendicularX * side * 2;

      petal.vy =
        this.directionY * this.random(1.5, 3.5) +
        this.perpendicularY * side * 2;
    });

    // Nouvelles vagues de pétales.
    if (this.frame % 2 === 0) {
      this.createPetalWave(progress);
    }

    // Particules de vent autour de la tornade.
    if (this.frame % 3 === 0) {
      this.createWindParticle();
    }

    if (this.frame >= this.duration.DANCE) {
      this.createImpact();
      this.changePhase("IMPACT");
    }
  }

  createPetalWave(progress) {
    const count = 4;

    for (let i = 0; i < count; i++) {
      const spread = this.random(-1, 1);
      const speed = this.random(2.5, 5);

      const x = this.vortex.x + this.perpendicularX * spread * 15;

      const y = this.vortex.y + this.perpendicularY * spread * 15;

      const curve = this.random(-1, 1);

      this.createPetal(
        x,
        y,
        this.directionX * speed + this.perpendicularX * curve * 2.5,
        this.directionY * speed + this.perpendicularY * curve * 2.5,
        this.random(3, 7)
      );
    }
  }

  createWindParticle() {
    const angle = Math.random() * Math.PI * 2;
    const radius = this.random(15, 40);

    this.windParticles.push({
      x: this.vortex.x + Math.cos(angle) * radius,
      y: this.vortex.y + Math.sin(angle) * radius,
      angle,
      radius,
      speed: this.random(0.08, 0.16),
      alpha: 0.7,
      life: 35,
      size: this.random(1, 3),
    });
  }

  createImpact() {
    this.impactFlash = 1;

    if (!this.shakeTriggered) {
      this.game.canvas?.startShake?.(10, 320);
      this.shakeTriggered = true;
    }

    for (let i = 0; i < 5; i++) {
      this.rings.push({
        radius: 8 + i * 8,
        alpha: 0.9,
        speed: 4 + i * 0.5,
        width: 2 + Math.random(),
      });
    }

    // Grande explosion florale.
    for (let i = 0; i < 55; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = this.random(1.5, 6);

      this.impactParticles.push({
        x: this.targetCenter.x,
        y: this.targetCenter.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: this.random(2, 5),
        alpha: 1,
        life: this.random(25, 45),
        color: this.randomPetalColor(),
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: this.random(-0.2, 0.2),
      });
    }

    // Dernière vague de pétales autour de la cible.
    for (let i = 0; i < 24; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = this.random(1, 4);

      this.createPetal(
        this.targetCenter.x,
        this.targetCenter.y,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed,
        this.random(4, 7)
      );
    }
  }

  updateImpact() {
    const progress = this.clamp(this.frame / this.duration.IMPACT);

    this.impactFlash = Math.max(0, this.impactFlash - 0.065);

    // Plusieurs pulsations de pétales frappent la cible.
    if (this.frame % 7 === 0 && this.frame < 29) {
      this.createImpactWave();
    }

    if (this.frame % 4 === 0) {
      this.createImpactSparkle();
    }

    if (this.frame >= this.duration.IMPACT) {
      this.changePhase("FINISH");
    }
  }

  createImpactWave() {
    for (let i = 0; i < 12; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = this.random(1, 4);

      this.impactParticles.push({
        x: this.targetCenter.x,
        y: this.targetCenter.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: this.random(2, 4),
        alpha: 1,
        life: 22,
        color: this.randomPetalColor(),
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: this.random(-0.2, 0.2),
      });
    }
  }

  createImpactSparkle() {
    this.sparkles.push({
      x: this.targetCenter.x + this.random(-30, 30),
      y: this.targetCenter.y + this.random(-25, 25),
      size: this.random(2, 5),
      alpha: 1,
      life: 18,
    });
  }

  updateFinish() {
    const progress = this.clamp(this.frame / this.duration.FINISH);

    this.vortex.radius *= 0.96;
    this.vortex.alpha = 1 - this.easeOut(progress);

    // Les derniers pétales retombent doucement.
    if (this.frame % 3 === 0) {
      this.createPetal(
        this.targetCenter.x + this.random(-30, 30),
        this.targetCenter.y - this.random(10, 30),
        this.random(-1, 1),
        this.random(0.5, 2),
        this.random(3, 6)
      );
    }

    if (this.frame >= this.duration.FINISH) {
      this.isFinished = true;
    }
  }

  updatePetals() {
    this.petals.forEach((petal) => {
      if (petal.type === "FLYING") {
        petal.x += petal.vx;
        petal.y += petal.vy;

        petal.vx *= 0.985;
        petal.vy *= 0.985;

        // Léger mouvement ondulatoire.
        petal.x += Math.sin(petal.rotation) * 0.6;
      }

      petal.rotation += petal.rotationSpeed;

      if (petal.type === "FLYING") {
        petal.life--;
        petal.alpha = Math.min(1, petal.life / 12);
      }
    });

    this.petals = this.petals.filter((petal) => petal.life > 0);
  }

  updateEffects() {
    this.rings.forEach((ring) => {
      ring.radius += ring.speed;
      ring.alpha -= 0.035;
    });

    this.rings = this.rings.filter((ring) => ring.alpha > 0);

    this.impactParticles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      particle.vx *= 0.96;
      particle.vy *= 0.96;

      particle.rotation += particle.rotationSpeed;
      particle.life--;
      particle.alpha = Math.min(1, particle.life / 10);
    });

    this.impactParticles = this.impactParticles.filter(
      (particle) => particle.life > 0
    );

    this.windParticles.forEach((particle) => {
      particle.angle += particle.speed;

      particle.x = this.vortex.x + Math.cos(particle.angle) * particle.radius;

      particle.y =
        this.vortex.y + Math.sin(particle.angle) * particle.radius * 0.65;

      particle.life--;
      particle.alpha = Math.min(1, particle.life / 10);
    });

    this.windParticles = this.windParticles.filter(
      (particle) => particle.life > 0
    );

    this.sparkles.forEach((sparkle) => {
      sparkle.life--;
      sparkle.alpha = Math.min(1, sparkle.life / 6);
    });

    this.sparkles = this.sparkles.filter((sparkle) => sparkle.life > 0);
  }

  draw(context) {
    this.drawWind(context);
    this.drawVortex(context);
    this.drawPetals(context);
    this.drawImpactParticles(context);
    this.drawRings(context);
    this.drawSparkles(context);
    this.drawFlash(context);
  }

  drawWind(context) {
    if (this.phase !== "DANCE" && this.phase !== "IMPACT") return;

    context.save();

    this.windParticles.forEach((particle) => {
      context.globalAlpha = particle.alpha * 0.6;
      context.strokeStyle = "#ffd4e9";
      context.lineWidth = particle.size;

      context.beginPath();
      context.arc(
        particle.x,
        particle.y,
        particle.size * 2,
        particle.angle,
        particle.angle + Math.PI * 0.7
      );
      context.stroke();
    });

    context.restore();
  }

  drawVortex(context) {
    if (
      this.phase !== "CHARGE" &&
      this.phase !== "PREPARE" &&
      this.phase !== "DANCE"
    )
      return;

    context.save();

    const radius = this.vortex.radius;

    // Halo extérieur.
    const gradient = context.createRadialGradient(
      this.vortex.x,
      this.vortex.y,
      1,
      this.vortex.x,
      this.vortex.y,
      radius * 1.8
    );

    gradient.addColorStop(0, "rgba(255,190,220,0.22)");

    gradient.addColorStop(0.55, "rgba(255,120,180,0.13)");

    gradient.addColorStop(1, "rgba(255,120,180,0)");

    context.globalAlpha = this.vortex.alpha;
    context.fillStyle = gradient;

    context.beginPath();
    context.arc(this.vortex.x, this.vortex.y, radius * 1.8, 0, Math.PI * 2);
    context.fill();

    // Spirale florale.
    for (let i = 0; i < 3; i++) {
      context.beginPath();

      context.strokeStyle = i % 2 === 0 ? "#ffb4d8" : "#f77eb9";

      context.lineWidth = 2;
      context.globalAlpha = this.vortex.alpha * 0.6;

      const startAngle = this.vortex.rotation + (i * Math.PI * 2) / 3;

      for (let j = 0; j <= 30; j++) {
        const t = j / 30;
        const angle = startAngle + t * Math.PI * 1.8;
        const r = radius * t;

        const x = this.vortex.x + Math.cos(angle) * r;

        const y = this.vortex.y + Math.sin(angle) * r * 0.65;

        if (j === 0) {
          context.moveTo(x, y);
        } else {
          context.lineTo(x, y);
        }
      }

      context.stroke();
    }

    context.restore();
  }

  drawPetals(context) {
    context.save();

    this.petals.forEach((petal) => {
      context.save();

      context.translate(petal.x, petal.y);
      context.rotate(petal.rotation);

      context.globalAlpha = petal.alpha;
      context.fillStyle = petal.color;

      // Forme de pétale allongé.
      context.beginPath();
      context.moveTo(0, -petal.size);

      context.bezierCurveTo(
        petal.size * 1.4,
        -petal.size * 0.6,
        petal.size * 1.4,
        petal.size * 0.6,
        0,
        petal.size
      );

      context.bezierCurveTo(
        -petal.size * 1.4,
        petal.size * 0.6,
        -petal.size * 1.4,
        -petal.size * 0.6,
        0,
        -petal.size
      );

      context.fill();

      // Nervure centrale.
      context.strokeStyle = "#fff0f7";
      context.lineWidth = 0.6;
      context.globalAlpha = petal.alpha * 0.55;

      context.beginPath();
      context.moveTo(0, -petal.size * 0.7);
      context.lineTo(0, petal.size * 0.7);
      context.stroke();

      context.restore();
    });

    context.restore();
  }

  drawImpactParticles(context) {
    context.save();

    this.impactParticles.forEach((particle) => {
      context.save();

      context.translate(particle.x, particle.y);
      context.rotate(particle.rotation);

      context.globalAlpha = particle.alpha;
      context.fillStyle = particle.color;

      context.beginPath();
      context.ellipse(
        0,
        0,
        particle.size * 1.5,
        particle.size * 0.7,
        0,
        0,
        Math.PI * 2
      );
      context.fill();

      context.restore();
    });

    context.restore();
  }

  drawRings(context) {
    context.save();

    this.rings.forEach((ring) => {
      context.globalAlpha = ring.alpha;
      context.strokeStyle = "#ffb4d8";
      context.lineWidth = ring.width;

      context.beginPath();
      context.ellipse(
        this.targetCenter.x,
        this.targetCenter.y,
        ring.radius,
        ring.radius * 0.6,
        0,
        0,
        Math.PI * 2
      );
      context.stroke();
    });

    context.restore();
  }

  drawSparkles(context) {
    context.save();

    this.sparkles.forEach((sparkle) => {
      context.globalAlpha = sparkle.alpha;
      context.fillStyle = "#fff4fb";

      context.beginPath();
      context.arc(sparkle.x, sparkle.y, sparkle.size, 0, Math.PI * 2);
      context.fill();

      context.strokeStyle = "#ffffff";
      context.lineWidth = 1;

      context.beginPath();
      context.moveTo(sparkle.x - sparkle.size * 2, sparkle.y);
      context.lineTo(sparkle.x + sparkle.size * 2, sparkle.y);
      context.moveTo(sparkle.x, sparkle.y - sparkle.size * 2);
      context.lineTo(sparkle.x, sparkle.y + sparkle.size * 2);
      context.stroke();
    });

    context.restore();
  }

  drawFlash(context) {
    if (this.impactFlash <= 0) return;

    context.save();

    context.globalAlpha = this.impactFlash * 0.22;
    context.fillStyle = "#ffd5eb";

    context.beginPath();
    context.arc(this.targetCenter.x, this.targetCenter.y, 48, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }
}
