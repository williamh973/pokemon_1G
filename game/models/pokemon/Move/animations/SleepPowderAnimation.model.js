export class SleepPowderAnimation {
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

    this.attackerCenter = {
      x: this.attacker.position.x + this.attacker.frameWidth / 2,
      y: this.attacker.position.y + this.attacker.frameHeight / 2,
    };

    this.targetCenter = {
      x: this.target.position.x + this.target.frameWidth / 2,
      y: this.target.position.y + this.target.frameHeight / 2,
    };

    const dx = this.targetCenter.x - this.attackerCenter.x;
    const dy = this.targetCenter.y - this.attackerCenter.y;
    const distance = Math.hypot(dx, dy) || 1;

    this.directionX = dx / distance;
    this.directionY = dy / distance;
    this.distance = distance;

    this.phase = "PREPARE";
    this.frame = 0;
    this.isFinished = false;

    this.duration = {
      PREPARE: 22,
      RELEASE: 38,
      SLEEP: 55,
      FINISH: 26,
    };

    this.colors = [
      "#e6b6ff",
      "#c99aff",
      "#f5c9e8",
      "#b99aff",
      "#ffffff",
      "#e7a8dc",
    ];

    this.orbitParticles = [];
    this.powderParticles = [];
    this.cloudParticles = [];
    this.stars = [];
    this.bubbles = [];
    this.rings = [];

    this.cloudAlpha = 0;
    this.flashAlpha = 0;

    this.createOrbitParticles();
  }

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

      case "SLEEP":
        this.updateSleep();
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
    this.frame = 0;
  }

  clamp(value) {
    return Math.max(0, Math.min(1, value));
  }

  easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  random(min, max) {
    return min + Math.random() * (max - min);
  }

  randomColor() {
    return this.colors[Math.floor(Math.random() * this.colors.length)];
  }

  createOrbitParticles() {
    for (let i = 0; i < 22; i++) {
      this.orbitParticles.push({
        angle: Math.random() * Math.PI * 2,
        radius: this.random(12, 35),
        speed: this.random(0.025, 0.065),
        size: this.random(1.5, 3.5),
        alpha: this.random(0.4, 0.85),
        color: this.randomColor(),
        wobble: Math.random() * Math.PI * 2,
      });
    }
  }

  createPowderParticle(x, y, options = {}) {
    const angle = options.angle ?? Math.random() * Math.PI * 2;
    const speed = options.speed ?? this.random(0.5, 2);

    this.powderParticles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: options.size ?? this.random(1.5, 4),
      alpha: 1,
      color: options.color ?? this.randomColor(),
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: this.random(-0.05, 0.05),
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: this.random(0.04, 0.12),
      life: options.life ?? 55,
    });
  }

  updatePrepare() {
    const progress = this.clamp(this.frame / this.duration.PREPARE);

    this.orbitParticles.forEach((particle) => {
      particle.angle += particle.speed;
      particle.wobble += 0.05;
    });

    if (this.frame % 2 === 0) {
      const angle = Math.random() * Math.PI * 2;
      const radius = this.random(8, 24);

      this.createPowderParticle(
        this.attackerCenter.x + Math.cos(angle) * radius,
        this.attackerCenter.y + Math.sin(angle) * radius,
        {
          size: this.random(2, 4),
          speed: this.random(0.3, 1),
          life: 35,
        }
      );
    }

    this.cloudAlpha = progress * 0.75;

    if (this.frame >= this.duration.PREPARE) {
      this.changePhase("RELEASE");
    }
  }

  updateRelease() {
    const progress = this.clamp(this.frame / this.duration.RELEASE);

    this.cloudAlpha = 0.75 + progress * 0.25;

    // Nuage de poudre projeté vers l'adversaire.
    for (let i = 0; i < 4; i++) {
      const spread = this.random(-20, 20);

      const x =
        this.attackerCenter.x + this.directionX * 15 - this.directionY * spread;

      const y =
        this.attackerCenter.y + this.directionY * 15 + this.directionX * spread;

      this.createPowderParticle(x, y, {
        angle:
          Math.atan2(this.directionY, this.directionX) + this.random(-0.5, 0.5),
        speed: this.random(1.2, 2.8),
        size: this.random(2, 5),
        life: 65,
      });
    }

    // Légère ondulation du nuage.
    this.powderParticles.forEach((particle) => {
      particle.vx += this.directionX * 0.025;
      particle.vy += this.directionY * 0.025;
    });

    if (this.frame >= this.duration.RELEASE) {
      this.createSleepCloud();
      this.changePhase("SLEEP");
    }
  }

  createSleepCloud() {
    // Poudre qui enveloppe la cible.
    for (let i = 0; i < 52; i++) {
      this.cloudParticles.push({
        angle: Math.random() * Math.PI * 2,
        radius: this.random(25, 60),
        speed: this.random(0.025, 0.075),
        size: this.random(1.5, 4),
        alpha: 1,
        color: this.randomColor(),
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: this.random(0.04, 0.1),
        life: this.random(40, 65),
      });
    }

    // Anneaux hypnotiques.
    for (let i = 0; i < 3; i++) {
      this.rings.push({
        radius: 10 + i * 10,
        alpha: 0.7,
        speed: 1.5 + i * 0.4,
      });
    }

    this.flashAlpha = 0.5;
  }

  updateSleep() {
    const progress = this.clamp(this.frame / this.duration.SLEEP);

    // Les particules tournent lentement autour de la cible.
    this.cloudParticles.forEach((particle) => {
      particle.angle += particle.speed;
      particle.wobble += particle.wobbleSpeed;
      particle.life--;

      particle.alpha = Math.min(1, particle.life / 15);
    });

    this.cloudParticles = this.cloudParticles.filter(
      (particle) => particle.life > 0
    );

    // Étoiles qui apparaissent progressivement.
    if (this.frame % 7 === 0) {
      this.createStar();
    }

    // Bulles de sommeil flottantes.
    if (this.frame % 10 === 0) {
      this.createBubble();
    }

    this.flashAlpha = Math.max(0, this.flashAlpha - 0.035);

    if (this.frame >= this.duration.SLEEP) {
      this.changePhase("FINISH");
    }
  }

  createStar() {
    const angle = Math.random() * Math.PI * 2;
    const radius = this.random(18, 35);

    this.stars.push({
      x: this.targetCenter.x + Math.cos(angle) * radius,
      y: this.targetCenter.y + Math.sin(angle) * radius * 0.55,
      vx: this.random(-0.4, 0.4),
      vy: -this.random(0.4, 1.1),
      size: this.random(4, 8),
      rotation: Math.random() * Math.PI,
      rotationSpeed: this.random(-0.06, 0.06),
      alpha: 1,
      life: 30,
    });
  }

  createBubble() {
    this.bubbles.push({
      x: this.targetCenter.x + this.random(-22, 22),
      y: this.targetCenter.y + this.random(-18, 18),
      vx: this.random(-0.4, 0.4),
      vy: -this.random(0.5, 1.2),
      radius: this.random(2, 5),
      alpha: 0.8,
      life: 35,
    });
  }

  updateFinish() {
    const progress = this.clamp(this.frame / this.duration.FINISH);

    this.cloudAlpha = 1 - progress;

    this.cloudParticles.forEach((particle) => {
      particle.alpha *= 0.91;
      particle.radius += 0.5;
    });

    this.stars.forEach((star) => {
      star.alpha *= 0.94;
    });

    this.bubbles.forEach((bubble) => {
      bubble.alpha *= 0.93;
    });

    if (this.frame >= this.duration.FINISH) {
      this.isFinished = true;
    }
  }

  updateParticles() {
    this.powderParticles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      particle.wobble += particle.wobbleSpeed;
      particle.rotation += particle.rotationSpeed;

      particle.x += Math.sin(particle.wobble) * 0.35;
      particle.y += Math.cos(particle.wobble) * 0.35;

      particle.vx *= 0.985;
      particle.vy *= 0.985;

      particle.life--;
      particle.alpha = Math.min(1, particle.life / 15);
    });

    this.powderParticles = this.powderParticles.filter(
      (particle) => particle.life > 0
    );

    this.stars.forEach((star) => {
      star.x += star.vx;
      star.y += star.vy;

      star.rotation += star.rotationSpeed;
      star.life--;

      star.alpha = Math.min(1, star.life / 10);
    });

    this.stars = this.stars.filter((star) => star.life > 0);

    this.bubbles.forEach((bubble) => {
      bubble.x += bubble.vx;
      bubble.y += bubble.vy;

      bubble.life--;
      bubble.alpha = Math.min(1, bubble.life / 12);
    });

    this.bubbles = this.bubbles.filter((bubble) => bubble.life > 0);

    this.rings.forEach((ring) => {
      ring.radius += ring.speed;
      ring.alpha -= 0.035;
    });

    this.rings = this.rings.filter((ring) => ring.alpha > 0);
  }

  draw(context) {
    this.drawOrbitParticles(context);
    this.drawPowderParticles(context);
    this.drawSleepCloud(context);
    this.drawRings(context);
    this.drawStars(context);
    this.drawBubbles(context);
    this.drawFlash(context);
  }

  drawOrbitParticles(context) {
    if (this.phase !== "PREPARE" && this.phase !== "RELEASE") return;

    context.save();

    this.orbitParticles.forEach((particle) => {
      const x =
        this.attackerCenter.x + Math.cos(particle.angle) * particle.radius;

      const y =
        this.attackerCenter.y +
        Math.sin(particle.angle) * particle.radius * 0.65 +
        Math.sin(particle.wobble) * 3;

      context.globalAlpha = particle.alpha * this.cloudAlpha;

      context.fillStyle = particle.color;

      context.beginPath();
      context.arc(x, y, particle.size, 0, Math.PI * 2);
      context.fill();

      context.globalAlpha *= 0.3;

      context.beginPath();
      context.arc(x, y, particle.size * 2, 0, Math.PI * 2);
      context.fill();
    });

    context.restore();
  }

  drawPowderParticles(context) {
    context.save();

    this.powderParticles.forEach((particle) => {
      context.save();

      context.translate(particle.x, particle.y);
      context.rotate(particle.rotation);

      context.globalAlpha = particle.alpha;
      context.fillStyle = particle.color;

      context.beginPath();
      context.ellipse(
        0,
        0,
        particle.size,
        particle.size * 0.65,
        0,
        0,
        Math.PI * 2
      );
      context.fill();

      context.globalAlpha *= 0.25;

      context.beginPath();
      context.arc(0, 0, particle.size * 2.2, 0, Math.PI * 2);
      context.fill();

      context.restore();
    });

    context.restore();
  }

  drawSleepCloud(context) {
    if (this.phase !== "SLEEP" && this.phase !== "FINISH") return;

    context.save();

    this.cloudParticles.forEach((particle) => {
      const x =
        this.targetCenter.x + Math.cos(particle.angle) * particle.radius;

      const y =
        this.targetCenter.y +
        Math.sin(particle.angle) * particle.radius * 0.6 +
        Math.sin(particle.wobble) * 3;

      context.globalAlpha = particle.alpha * this.cloudAlpha;

      context.fillStyle = particle.color;

      context.beginPath();
      context.arc(x, y, particle.size, 0, Math.PI * 2);
      context.fill();

      context.globalAlpha *= 0.25;

      context.beginPath();
      context.arc(x, y, particle.size * 2.2, 0, Math.PI * 2);
      context.fill();
    });

    context.restore();
  }

  drawRings(context) {
    if (this.phase !== "SLEEP" && this.phase !== "FINISH") return;

    context.save();

    this.rings.forEach((ring) => {
      context.globalAlpha = ring.alpha;
      context.strokeStyle = "#e6b6ff";
      context.lineWidth = 2.5;

      context.beginPath();
      context.ellipse(
        this.targetCenter.x,
        this.targetCenter.y,
        ring.radius,
        ring.radius * 0.5,
        0,
        0,
        Math.PI * 2
      );
      context.stroke();
    });

    context.restore();
  }

  drawStars(context) {
    context.save();

    this.stars.forEach((star) => {
      context.save();

      context.translate(star.x, star.y);
      context.rotate(star.rotation);

      context.globalAlpha = star.alpha;
      context.fillStyle = "#fff4c9";

      this.drawStarShape(context, 0, 0, star.size, star.size * 0.45);

      context.restore();
    });

    context.restore();
  }

  drawStarShape(context, x, y, outerRadius, innerRadius) {
    context.beginPath();

    for (let i = 0; i < 10; i++) {
      const angle = -Math.PI / 2 + (i * Math.PI) / 5;
      const radius = i % 2 === 0 ? outerRadius : innerRadius;

      const px = x + Math.cos(angle) * radius;
      const py = y + Math.sin(angle) * radius;

      if (i === 0) {
        context.moveTo(px, py);
      } else {
        context.lineTo(px, py);
      }
    }

    context.closePath();
    context.fill();
  }

  drawBubbles(context) {
    context.save();

    this.bubbles.forEach((bubble) => {
      context.globalAlpha = bubble.alpha;
      context.strokeStyle = "#f5d9ff";
      context.lineWidth = 1.5;

      context.beginPath();
      context.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
      context.stroke();

      context.globalAlpha *= 0.35;
      context.fillStyle = "#ffffff";
      context.fill();
    });

    context.restore();
  }

  drawFlash(context) {
    if (this.flashAlpha <= 0) return;

    context.save();

    context.globalAlpha = this.flashAlpha * 0.2;
    context.fillStyle = "#e8c6ff";

    context.beginPath();
    context.arc(this.targetCenter.x, this.targetCenter.y, 38, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }
}
