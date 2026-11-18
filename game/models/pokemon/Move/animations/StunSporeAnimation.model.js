export class StunSporeAnimation {
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
      RELEASE: 34,
      PARALYZE: 42,
      FINISH: 22,
    };

    this.sporeColors = ["#eaff83", "#d5f45b", "#f5e878", "#b9db54", "#fff5b0"];

    this.orbitParticles = [];
    this.spores = [];
    this.targetSpores = [];
    this.sparkles = [];
    this.electricArcs = [];
    this.rings = [];

    this.cloudAlpha = 0;
    this.impactFlash = 0;

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

      case "PARALYZE":
        this.updateParalyze();
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
    return this.sporeColors[
      Math.floor(Math.random() * this.sporeColors.length)
    ];
  }

  createOrbitParticles() {
    for (let i = 0; i < 18; i++) {
      const angle = Math.random() * Math.PI * 2;

      this.orbitParticles.push({
        angle,
        radius: this.random(13, 34),
        speed: this.random(0.035, 0.09),
        size: this.random(1.5, 3.5),
        alpha: this.random(0.4, 0.9),
        color: this.randomColor(),
        wobble: Math.random() * Math.PI * 2,
      });
    }
  }

  createSpore(x, y, options = {}) {
    const angle = options.angle ?? Math.random() * Math.PI * 2;
    const speed = options.speed ?? this.random(0.5, 2.2);

    this.spores.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: options.size ?? this.random(1.5, 4),
      alpha: 1,
      color: options.color ?? this.randomColor(),
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: this.random(-0.08, 0.08),
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: this.random(0.08, 0.18),
      life: options.life ?? this.random(35, 65),
      maxLife: options.life ?? 50,
    });
  }

  updatePrepare() {
    const progress = this.clamp(this.frame / this.duration.PREPARE);

    const centerX = this.attackerCenter.x;
    const centerY = this.attackerCenter.y;

    this.orbitParticles.forEach((particle) => {
      particle.angle += particle.speed;
      particle.wobble += 0.08;
    });

    if (this.frame % 2 === 0) {
      const angle = Math.random() * Math.PI * 2;
      const radius = this.random(8, 22);

      this.createSpore(
        centerX + Math.cos(angle) * radius,
        centerY + Math.sin(angle) * radius,
        {
          size: this.random(2, 4),
          speed: this.random(0.3, 1.2),
          life: 30,
        }
      );
    }

    this.cloudAlpha = progress * 0.7;

    if (this.frame >= this.duration.PREPARE) {
      this.changePhase("RELEASE");
    }
  }

  updateRelease() {
    const progress = this.clamp(this.frame / this.duration.RELEASE);

    this.cloudAlpha = 0.7 + progress * 0.3;

    // Libération progressive des spores.
    for (let i = 0; i < 4; i++) {
      const spread = this.random(-17, 17);

      const x =
        this.attackerCenter.x +
        this.directionX * 18 +
        -this.directionY * spread;

      const y =
        this.attackerCenter.y + this.directionY * 18 + this.directionX * spread;

      this.createSpore(x, y, {
        angle:
          Math.atan2(this.directionY, this.directionX) +
          this.random(-0.45, 0.45),
        speed: this.random(1.5, 3.5),
        size: this.random(2, 4.5),
        life: 55,
      });
    }

    this.spores.forEach((spore) => {
      spore.vx += this.directionX * 0.035;
      spore.vy += this.directionY * 0.035;
    });

    if (this.frame >= this.duration.RELEASE) {
      this.createParalysisCloud();
      this.changePhase("PARALYZE");
    }
  }

  createParalysisCloud() {
    // Les spores convergent autour de la cible.
    for (let i = 0; i < 46; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = this.random(28, 58);

      this.targetSpores.push({
        angle,
        radius,
        speed: this.random(0.045, 0.12),
        size: this.random(1.5, 4),
        alpha: 1,
        color: this.randomColor(),
        wobble: Math.random() * Math.PI * 2,
        life: this.random(35, 55),
      });
    }

    for (let i = 0; i < 3; i++) {
      this.rings.push({
        radius: 12 + i * 8,
        alpha: 0.85,
        speed: 2.5 + i * 0.7,
      });
    }

    this.impactFlash = 0.8;
  }

  updateParalyze() {
    const progress = this.clamp(this.frame / this.duration.PARALYZE);

    this.targetSpores.forEach((spore) => {
      spore.angle += spore.speed;
      spore.wobble += 0.12;
      spore.life--;
      spore.alpha = Math.min(1, spore.life / 12);
    });

    // Quelques spores s'échappent du nuage.
    if (this.frame % 3 === 0) {
      const angle = Math.random() * Math.PI * 2;

      this.createSpore(
        this.targetCenter.x + Math.cos(angle) * 20,
        this.targetCenter.y + Math.sin(angle) * 20,
        {
          speed: this.random(0.4, 1.4),
          size: this.random(1.5, 3),
          life: 30,
        }
      );
    }

    // Arcs électriques courts et irréguliers.
    if (this.frame % 8 === 0) {
      this.createElectricArc();
    }

    this.electricArcs.forEach((arc) => {
      arc.life--;
    });

    this.electricArcs = this.electricArcs.filter((arc) => arc.life > 0);

    this.impactFlash = Math.max(0, this.impactFlash - 0.07);

    if (this.frame >= this.duration.PARALYZE) {
      this.changePhase("FINISH");
    }
  }

  createElectricArc() {
    const angle = Math.random() * Math.PI * 2;
    const radius = this.random(15, 30);

    this.electricArcs.push({
      x: this.targetCenter.x + Math.cos(angle) * radius,
      y: this.targetCenter.y + Math.sin(angle) * radius,
      angle,
      length: this.random(10, 20),
      life: 7,
      maxLife: 7,
    });
  }

  updateFinish() {
    const progress = this.clamp(this.frame / this.duration.FINISH);

    this.cloudAlpha = 1 - progress;

    this.targetSpores.forEach((spore) => {
      spore.alpha *= 0.92;
      spore.radius += 0.6;
    });

    this.electricArcs = [];

    if (this.frame >= this.duration.FINISH) {
      this.isFinished = true;
    }
  }

  updateParticles() {
    this.spores.forEach((spore) => {
      spore.x += spore.vx;
      spore.y += spore.vy;

      spore.wobble += spore.wobbleSpeed;
      spore.rotation += spore.rotationSpeed;

      spore.x += Math.sin(spore.wobble) * 0.3;
      spore.y += Math.cos(spore.wobble) * 0.3;

      spore.vx *= 0.985;
      spore.vy *= 0.985;

      spore.life--;
      spore.alpha = Math.min(1, spore.life / 12);
    });

    this.spores = this.spores.filter((spore) => spore.life > 0);

    this.sparkles.forEach((sparkle) => {
      sparkle.x += sparkle.vx;
      sparkle.y += sparkle.vy;
      sparkle.alpha -= 0.06;
    });

    this.sparkles = this.sparkles.filter((sparkle) => sparkle.alpha > 0);

    this.rings.forEach((ring) => {
      ring.radius += ring.speed;
      ring.alpha -= 0.045;
    });

    this.rings = this.rings.filter((ring) => ring.alpha > 0);
  }

  draw(context) {
    this.drawOrbitParticles(context);
    this.drawSpores(context);
    this.drawTargetCloud(context);
    this.drawElectricArcs(context);
    this.drawRings(context);
    this.drawImpactFlash(context);
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

      context.globalAlpha *= 0.4;
      context.beginPath();
      context.arc(x - 1, y - 1, particle.size * 1.8, 0, Math.PI * 2);
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
      context.fillStyle = spore.color;

      // Petites spores ovales.
      context.beginPath();
      context.ellipse(0, 0, spore.size, spore.size * 0.7, 0, 0, Math.PI * 2);
      context.fill();

      // Halo discret.
      context.globalAlpha = spore.alpha * 0.25;
      context.beginPath();
      context.arc(0, 0, spore.size * 2.2, 0, Math.PI * 2);
      context.fill();

      context.restore();
    });

    context.restore();
  }

  drawTargetCloud(context) {
    if (this.phase !== "PARALYZE" && this.phase !== "FINISH") return;

    context.save();

    this.targetSpores.forEach((spore) => {
      const x = this.targetCenter.x + Math.cos(spore.angle) * spore.radius;

      const y =
        this.targetCenter.y +
        Math.sin(spore.angle) * spore.radius * 0.65 +
        Math.sin(spore.wobble) * 3;

      context.globalAlpha = spore.alpha * this.cloudAlpha;

      context.fillStyle = spore.color;

      context.beginPath();
      context.arc(x, y, spore.size, 0, Math.PI * 2);
      context.fill();
    });

    context.restore();
  }

  drawElectricArcs(context) {
    context.save();

    this.electricArcs.forEach((arc) => {
      const progress = arc.life / arc.maxLife;

      context.globalAlpha = progress;
      context.strokeStyle = "#fff5a3";
      context.lineWidth = 2.5;
      context.lineCap = "round";

      context.beginPath();
      context.moveTo(arc.x, arc.y);

      let x = arc.x;
      let y = arc.y;

      for (let i = 0; i < 4; i++) {
        x += (Math.cos(arc.angle) * arc.length) / 4 + this.random(-4, 4);

        y += (Math.sin(arc.angle) * arc.length) / 4 + this.random(-4, 4);

        context.lineTo(x, y);
      }

      context.stroke();

      context.strokeStyle = "#f0d94b";
      context.lineWidth = 1;
      context.stroke();
    });

    context.restore();
  }

  drawRings(context) {
    context.save();

    this.rings.forEach((ring) => {
      context.globalAlpha = ring.alpha;
      context.strokeStyle = "#e8ed83";
      context.lineWidth = 3;

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

  drawImpactFlash(context) {
    if (this.impactFlash <= 0) return;

    context.save();

    context.globalAlpha = this.impactFlash * 0.22;
    context.fillStyle = "#f7ffad";

    context.beginPath();
    context.arc(this.targetCenter.x, this.targetCenter.y, 42, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }
}
