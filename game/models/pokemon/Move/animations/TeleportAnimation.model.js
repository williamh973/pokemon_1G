export class TeleportAnimation {
  constructor(game, viewers, turnAction) {
    this.game = game;
    this.turnAction = turnAction;

    if (viewers.front.slot.content === turnAction.pokemon) {
      this.pokemonViewer = viewers.front;
    } else {
      this.pokemonViewer = viewers.back;
    }

    this.pokemon = this.pokemonViewer.sprite;

    this.originalScale = this.pokemon.scale ?? 1;

    this.center = {
      x: this.pokemon.position.x + this.pokemon.frameWidth / 2,
      y: this.pokemon.position.y + this.pokemon.frameHeight / 2,
    };

    this.duration = {
      CHARGE: 32,
      DISTORTION: 20,
      DISAPPEAR: 18,
      REAPPEAR: 24,
      FINISH: 24,
    };

    this.phase = "CHARGE";
    this.frame = 0;
    this.isFinished = false;

    this.opacity = 1;
    this.scaleX = 1;
    this.scaleY = 1;
    this.flash = 0;
    this.rotation = 0;

    this.particles = [];
    this.rings = [];
    this.sparks = [];
    this.dimensionFragments = [];

    this.createInitialParticles();
  }

  changePhase(phase) {
    this.phase = phase;
    this.frame = 0;
  }

  update(context) {
    if (this.isFinished) return;

    switch (this.phase) {
      case "CHARGE":
        this.updateCharge();
        break;

      case "DISTORTION":
        this.updateDistortion();
        break;

      case "DISAPPEAR":
        this.updateDisappear();
        break;

      case "REAPPEAR":
        this.updateReappear();
        break;

      case "FINISH":
        this.updateFinish();
        break;
    }

    this.updateParticles();
    this.updateRings();
    this.updateSparks();
    this.updateFragments();

    this.draw(context);
    this.frame++;
  }

  createInitialParticles() {
    for (let i = 0; i < 26; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 12 + Math.random() * 24;

      this.particles.push({
        angle,
        radius,
        speed: 0.025 + Math.random() * 0.035,
        size: 1 + Math.random() * 2,
        alpha: 0.5 + Math.random() * 0.5,
        color: Math.random() > 0.5 ? "#c77dff" : "#8065ff",
      });
    }
  }

  createRing(scale = 0.2, speed = 0.035, alpha = 0.8) {
    this.rings.push({
      scale,
      speed,
      alpha,
      rotation: Math.random() * Math.PI,
      rotationSpeed: (Math.random() - 0.5) * 0.04,
    });
  }

  createSparks(count, power = 2) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = power * (0.5 + Math.random());

      this.sparks.push({
        x: this.center.x,
        y: this.center.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 1 + Math.random() * 2,
        alpha: 1,
        life: 18 + Math.random() * 14,
      });
    }
  }

  createFragments(count) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 3;

      this.dimensionFragments.push({
        x: this.center.x,
        y: this.center.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        size: 2 + Math.random() * 4,
        alpha: 1,
        life: 20 + Math.random() * 15,
      });
    }
  }

  updateCharge() {
    const progress = this.frame / this.duration.CHARGE;

    this.rotation += 0.09 + progress * 0.13;

    this.particles.forEach((particle) => {
      particle.angle += particle.speed * (1 + progress * 2);
      particle.radius += Math.sin(this.frame * 0.12 + particle.angle) * 0.08;
    });

    if (this.frame % 8 === 0) {
      this.createRing(0.25, 0.025, 0.45);
      this.createSparks(3, 1.3);
    }

    if (this.frame >= this.duration.CHARGE) {
      this.createRing(0.15, 0.07, 1);
      this.flash = 0.65;
      this.changePhase("DISTORTION");
    }
  }

  updateDistortion() {
    const progress = this.frame / this.duration.DISTORTION;
    const ease = progress * progress;

    this.pokemon.scale = this.originalScale * (1 - ease);

    this.scaleX = 1 - ease * 0.82;
    this.scaleY = 1 + Math.sin(progress * Math.PI) * 0.18;

    this.opacity = 1 - ease * 0.45;
    this.rotation += 0.2 + progress * 0.2;

    this.particles.forEach((particle) => {
      particle.radius *= 0.965;
      particle.angle += 0.16;
    });

    if (this.frame % 4 === 0) {
      this.createRing(0.15 + progress * 0.3, 0.06, 0.75);
      this.createSparks(4, 2);
    }

    if (this.frame === 10) {
      this.game.canvas.startShake?.(3, 100);
    }

    if (this.frame >= this.duration.DISTORTION) {
      this.opacity = 0;
      this.scaleX = 0.08;
      this.flash = 1;

      this.createFragments(22);
      this.createSparks(18, 3);
      this.game.canvas.startShake?.(7, 220);

      this.changePhase("DISAPPEAR");
    }
  }

  updateDisappear() {
    this.pokemon.scale = 0;

    this.opacity = 0;
    this.scaleX = 0.08;
    this.scaleY = 0.08;

    this.particles.forEach((particle) => {
      particle.radius *= 0.94;
      particle.angle += 0.12;
      particle.alpha *= 0.92;
    });

    if (this.frame % 4 === 0) {
      this.createRing(0.1, 0.045, 0.5);
    }

    if (this.frame >= this.duration.DISAPPEAR) {
      this.opacity = 0;
      this.flash = 0;
      this.createReappearanceEffect();
      this.changePhase("REAPPEAR");
    }
  }

  createReappearanceEffect() {
    this.createRing(0.1, 0.085, 1);
    this.createRing(0.25, 0.065, 0.8);
    this.createSparks(28, 3.5);
    this.createFragments(14);

    this.particles.forEach((particle) => {
      particle.radius = 8 + Math.random() * 12;
      particle.alpha = 1;
    });

    this.game.canvas.startShake?.(6, 180);
    this.flash = 1;
  }

  updateReappear() {
    const progress = this.frame / this.duration.REAPPEAR;
    const ease = 1 - Math.pow(1 - progress, 3);

    this.opacity = Math.min(1, ease * 1.5);

    this.pokemon.scale = this.originalScale * ease;

    this.scaleX = 0.08 + ease * 0.92;
    this.scaleY = 0.08 + ease * 0.92;

    this.rotation *= 0.88;

    this.particles.forEach((particle) => {
      particle.angle += particle.speed * 2;
      particle.radius += 0.7;
      particle.alpha *= 0.97;
    });

    this.flash *= 0.86;

    if (this.frame % 5 === 0) {
      this.createRing(0.15, 0.065, 0.8);
    }

    if (this.frame >= this.duration.REAPPEAR) {
      this.opacity = 1;
      this.scaleX = 1;
      this.scaleY = 1;
      this.flash = 0;

      this.pokemon.scale = this.originalScale;

      this.changePhase("FINISH");
    }
  }

  updateFinish() {
    const progress = this.frame / this.duration.FINISH;

    this.particles.forEach((particle) => {
      particle.alpha *= 0.94;
      particle.radius += 0.3;
    });

    this.opacity = 1;

    if (this.frame >= this.duration.FINISH) {
      this.pokemon.scale = this.originalScale;
      this.opacity = 1;
      this.isFinished = true;
    }
  }

  updateParticles() {
    this.sparks = this.sparks.filter((spark) => {
      spark.x += spark.vx;
      spark.y += spark.vy;
      spark.vx *= 0.96;
      spark.vy *= 0.96;
      spark.alpha -= 1 / spark.life;
      spark.life--;
      return spark.life > 0 && spark.alpha > 0;
    });
  }

  updateRings() {
    this.rings = this.rings.filter((ring) => {
      ring.scale += ring.speed;
      ring.alpha -= 0.035;
      ring.rotation += ring.rotationSpeed;
      return ring.alpha > 0;
    });
  }

  updateSparks() {
    // Les étincelles sont mises à jour dans updateParticles().
  }

  updateFragments() {
    this.dimensionFragments = this.dimensionFragments.filter((fragment) => {
      fragment.x += fragment.vx;
      fragment.y += fragment.vy;
      fragment.vx *= 0.96;
      fragment.vy *= 0.96;
      fragment.rotation += fragment.rotationSpeed;
      fragment.alpha -= 1 / fragment.life;
      fragment.life--;

      return fragment.life > 0 && fragment.alpha > 0;
    });
  }

  draw(context) {
    this.drawRings(context);
    this.drawParticles(context);
    this.drawFragments(context);
    this.drawAura(context);
    this.drawFlash(context);
  }

  drawRings(context) {
    this.rings.forEach((ring) => {
      context.save();
      context.translate(this.center.x, this.center.y);
      context.rotate(ring.rotation);

      context.globalAlpha = Math.max(0, ring.alpha);
      context.strokeStyle = "#c084fc";
      context.lineWidth = 2;

      context.beginPath();
      context.ellipse(
        0,
        0,
        16 * ring.scale * 2,
        23 * ring.scale * 2,
        0,
        0,
        Math.PI * 2
      );
      context.stroke();

      context.strokeStyle = "#7c3aed";
      context.lineWidth = 1;

      context.beginPath();
      context.ellipse(
        0,
        0,
        12 * ring.scale * 2,
        19 * ring.scale * 2,
        0,
        0,
        Math.PI * 2
      );
      context.stroke();

      context.restore();
    });
  }

  drawParticles(context) {
    this.particles.forEach((particle) => {
      const x = this.center.x + Math.cos(particle.angle) * particle.radius;
      const y = this.center.y + Math.sin(particle.angle) * particle.radius;

      context.save();
      context.globalAlpha = particle.alpha * this.opacity;
      context.fillStyle = particle.color;
      context.shadowColor = particle.color;
      context.shadowBlur = 6;

      context.beginPath();
      context.arc(x, y, particle.size, 0, Math.PI * 2);
      context.fill();

      context.restore();
    });

    this.sparks.forEach((spark) => {
      context.save();
      context.globalAlpha = Math.max(0, spark.alpha);
      context.fillStyle = "#e9d5ff";
      context.shadowColor = "#a855f7";
      context.shadowBlur = 8;

      context.beginPath();
      context.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2);
      context.fill();

      context.restore();
    });
  }

  drawFragments(context) {
    this.dimensionFragments.forEach((fragment) => {
      context.save();
      context.translate(fragment.x, fragment.y);
      context.rotate(fragment.rotation);
      context.globalAlpha = Math.max(0, fragment.alpha);
      context.fillStyle = "#c084fc";
      context.shadowColor = "#9333ea";
      context.shadowBlur = 5;

      context.beginPath();
      context.moveTo(0, -fragment.size);
      context.lineTo(fragment.size * 0.7, 0);
      context.lineTo(0, fragment.size);
      context.lineTo(-fragment.size * 0.7, 0);
      context.closePath();
      context.fill();

      context.restore();
    });
  }

  drawAura(context) {
    if (this.phase === "DISAPPEAR" || this.opacity <= 0) return;

    context.save();
    context.translate(this.center.x, this.center.y);
    context.rotate(this.rotation);

    const radius = 22 * this.scaleY;

    const gradient = context.createRadialGradient(0, 0, 2, 0, 0, radius);

    gradient.addColorStop(0, `rgba(192, 132, 252, ${0.3 * this.opacity})`);
    gradient.addColorStop(0.6, `rgba(124, 58, 237, ${0.2 * this.opacity})`);
    gradient.addColorStop(1, "rgba(124, 58, 237, 0)");

    context.globalAlpha = this.opacity;
    context.fillStyle = gradient;

    context.beginPath();
    context.ellipse(
      0,
      0,
      radius * this.scaleX,
      radius * 1.5,
      0,
      0,
      Math.PI * 2
    );
    context.fill();

    context.restore();
  }

  drawFlash(context) {
    if (this.flash <= 0.01) return;

    context.save();
    context.globalAlpha = Math.min(1, this.flash) * 0.65;
    context.fillStyle = "#e9d5ff";

    context.beginPath();
    context.arc(
      this.center.x,
      this.center.y,
      18 + this.flash * 22,
      0,
      Math.PI * 2
    );
    context.fill();

    context.restore();
  }
}
