export class AcidArmorAnimation {
  constructor(game, viewers, turnAction) {
    this.game = game;
    this.viewers = viewers;
    this.turnAction = turnAction;

    if (viewers.front.slot.content === turnAction.pokemon) {
      this.pokemonViewer = viewers.front;
    } else {
      this.pokemonViewer = viewers.back;
    }

    this.pokemon = this.pokemonViewer.sprite;

    this.center = {
      x: this.pokemon.position.x + this.pokemon.frameWidth / 2,
      y: this.pokemon.position.y + this.pokemon.frameHeight / 2,
    };

    this.phase = "PREPARE";
    this.frame = 0;
    this.isFinished = false;

    this.duration = {
      PREPARE: 20,
      MELT: 28,
      ARMOR: 38,
      FINISH: 30,
    };

    this.aura = 0;
    this.armorOpacity = 0;
    this.armorScale = 0.7;
    this.liquidWave = 0;
    this.rotation = 0;

    this.bubbles = [];
    this.droplets = [];
    this.particles = [];
    this.ripples = [];

    this.createInitialBubbles();
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

  getCenter() {
    return {
      x: this.pokemon.position.x + this.pokemon.frameWidth / 2,
      y: this.pokemon.position.y + this.pokemon.frameHeight / 2,
    };
  }

  changePhase(phase) {
    this.phase = phase;
    this.frame = 0;
  }

  update(context) {
    if (this.isFinished) return;

    this.frame++;

    switch (this.phase) {
      case "PREPARE":
        this.updatePrepare();
        break;

      case "MELT":
        this.updateMelt();
        break;

      case "ARMOR":
        this.updateArmor();
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

    this.aura = this.easeOut(progress) * 0.8;

    this.liquidWave += 0.12;

    if (this.frame % 3 === 0) {
      this.createBubble();
    }

    if (this.frame % 5 === 0) {
      this.createLiquidParticle();
    }

    if (progress >= 1) {
      this.changePhase("MELT");
    }
  }

  createInitialBubbles() {
    for (let i = 0; i < 12; i++) {
      this.createBubble(true);
    }
  }

  createBubble(initial = false) {
    const center = this.getCenter();

    const angle = Math.random() * Math.PI * 2;
    const radius = initial ? this.random(12, 32) : this.random(20, 36);

    this.bubbles.push({
      x: center.x + Math.cos(angle) * radius,
      y: center.y + Math.sin(angle) * radius,
      vx: this.random(-0.35, 0.35),
      vy: this.random(-0.9, -0.3),
      radius: this.random(1.5, 4),
      alpha: this.random(0.5, 0.9),
      life: this.random(30, 55),
      maxLife: 55,
      wobble: Math.random() * Math.PI * 2,
    });
  }

  createLiquidParticle() {
    const center = this.getCenter();
    const angle = Math.random() * Math.PI * 2;
    const radius = this.random(12, 28);

    this.particles.push({
      x: center.x + Math.cos(angle) * radius,
      y: center.y + Math.sin(angle) * radius,
      vx: Math.cos(angle) * this.random(0.3, 1),
      vy: Math.sin(angle) * this.random(0.3, 1),
      size: this.random(2, 5),
      alpha: 0.8,
      life: 25,
      maxLife: 25,
    });
  }

  // --------------------------------------------------
  // MELT
  // --------------------------------------------------

  updateMelt() {
    const progress = this.clamp(this.frame / this.duration.MELT);

    this.aura = 0.8 + progress * 0.4;
    this.liquidWave += 0.24;

    this.armorScale = 0.7 + this.easeOut(progress) * 0.35;
    this.armorOpacity = this.easeOut(progress) * 0.45;

    if (this.frame % 2 === 0) {
      this.createBubble();
      this.createLiquidParticle();
    }

    if (this.frame % 5 === 0) {
      this.createDroplet();
    }

    if (this.frame % 7 === 0) {
      this.createRipple();
    }

    if (progress >= 1) {
      this.changePhase("ARMOR");
    }
  }

  createDroplet() {
    const center = this.getCenter();

    const angle = Math.random() * Math.PI * 2;
    const radius = this.random(18, 34);

    this.droplets.push({
      x: center.x + Math.cos(angle) * radius,
      y: center.y + Math.sin(angle) * radius,
      vx: Math.cos(angle) * this.random(0.5, 1.8),
      vy: Math.sin(angle) * this.random(0.5, 1.8),
      size: this.random(2, 5),
      alpha: 1,
      life: this.random(18, 28),
    });
  }

  createRipple() {
    const center = this.getCenter();

    this.ripples.push({
      x: center.x,
      y: center.y,
      radius: 8,
      alpha: 0.8,
      speed: this.random(1.5, 2.5),
      rotation: Math.random() * Math.PI,
    });
  }

  // --------------------------------------------------
  // ARMOR
  // --------------------------------------------------

  updateArmor() {
    const progress = this.clamp(this.frame / this.duration.ARMOR);

    this.aura = 1.2;
    this.armorOpacity = 0.48 + Math.sin(this.frame * 0.12) * 0.08;
    this.armorScale = 1.05 + Math.sin(this.frame * 0.18) * 0.035;

    this.liquidWave += 0.16;
    this.rotation += 0.025;

    if (this.frame % 3 === 0) {
      this.createBubble();
    }

    if (this.frame % 5 === 0) {
      this.createLiquidParticle();
    }

    if (this.frame % 6 === 0) {
      this.createRipple();
    }

    if (progress >= 1) {
      this.changePhase("FINISH");
    }
  }

  // --------------------------------------------------
  // FINISH
  // --------------------------------------------------

  updateFinish() {
    const progress = this.clamp(this.frame / this.duration.FINISH);

    this.aura = 1.2 * (1 - this.easeOut(progress));
    this.armorOpacity = 0.48 * (1 - this.easeOut(progress));

    this.armorScale = 1.05 - progress * 0.1;

    if (this.frame % 4 === 0) {
      this.createDroplet();
    }

    if (this.frame >= this.duration.FINISH) {
      this.isFinished = true;
    }
  }

  // --------------------------------------------------
  // PARTICLE UPDATE
  // --------------------------------------------------

  updateEffects() {
    this.bubbles.forEach((bubble) => {
      bubble.x += bubble.vx;
      bubble.y += bubble.vy;

      bubble.wobble += 0.12;
      bubble.x += Math.sin(bubble.wobble) * 0.25;

      bubble.life--;
      bubble.alpha = Math.min(bubble.alpha, bubble.life / 12);
    });

    this.bubbles = this.bubbles.filter((bubble) => bubble.life > 0);

    this.particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      particle.vx *= 0.96;
      particle.vy *= 0.96;

      particle.life--;
      particle.alpha = Math.min(1, particle.life / 10);
    });

    this.particles = this.particles.filter((particle) => particle.life > 0);

    this.droplets.forEach((droplet) => {
      droplet.x += droplet.vx;
      droplet.y += droplet.vy;

      droplet.vy += 0.08;
      droplet.vx *= 0.98;

      droplet.life--;
      droplet.alpha = Math.min(1, droplet.life / 8);
    });

    this.droplets = this.droplets.filter((droplet) => droplet.life > 0);

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
    this.drawRipples(context);
    this.drawAura(context);
    this.drawLiquidArmor(context);
    this.drawLiquidWaves(context);
    this.drawBubbles(context);
    this.drawParticles(context);
    this.drawDroplets(context);
  }

  drawAura(context) {
    if (this.aura <= 0) return;

    const center = this.getCenter();
    const radius = 30 + this.aura * 12;

    context.save();

    const gradient = context.createRadialGradient(
      center.x,
      center.y,
      2,
      center.x,
      center.y,
      radius
    );

    gradient.addColorStop(0, "rgba(210,100,255,0.28)");

    gradient.addColorStop(0.5, "rgba(145,45,210,0.2)");

    gradient.addColorStop(1, "rgba(100,20,160,0)");

    context.globalAlpha = Math.min(1, this.aura);
    context.fillStyle = gradient;

    context.beginPath();
    context.arc(center.x, center.y, radius, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }

  drawLiquidArmor(context) {
    if (this.armorOpacity <= 0) return;

    const center = this.getCenter();

    const width = this.pokemon.frameWidth * 0.68 * this.armorScale;
    const height = this.pokemon.frameHeight * 0.68 * this.armorScale;

    context.save();

    context.translate(center.x, center.y);
    context.rotate(this.rotation);

    // Enveloppe liquide translucide.
    const gradient = context.createRadialGradient(
      0,
      -height * 0.2,
      2,
      0,
      0,
      height
    );

    gradient.addColorStop(0, "rgba(235,170,255,0.38)");

    gradient.addColorStop(0.55, "rgba(160,65,220,0.32)");

    gradient.addColorStop(1, "rgba(95,25,150,0.12)");

    context.globalAlpha = this.armorOpacity;
    context.fillStyle = gradient;

    context.beginPath();

    context.ellipse(0, 0, width, height, 0, 0, Math.PI * 2);

    context.fill();

    // Contour brillant de l'armure.
    context.globalAlpha = this.armorOpacity * 1.5;
    context.strokeStyle = "#e7a4ff";
    context.lineWidth = 2;

    context.beginPath();

    context.ellipse(0, 0, width, height, 0, 0, Math.PI * 2);

    context.stroke();

    context.restore();
  }

  drawLiquidWaves(context) {
    if (this.armorOpacity <= 0) return;

    const center = this.getCenter();

    const width = this.pokemon.frameWidth * 0.7 * this.armorScale;
    const height = this.pokemon.frameHeight * 0.7 * this.armorScale;

    context.save();

    context.translate(center.x, center.y);

    for (let layer = 0; layer < 3; layer++) {
      const phase = this.liquidWave + layer * 2.1;

      context.beginPath();

      for (let i = 0; i <= 40; i++) {
        const angle = (i / 40) * Math.PI * 2;

        const distortion =
          Math.sin(angle * 4 + phase) * 3 + Math.cos(angle * 7 - phase) * 2;

        const radiusX = width + distortion;
        const radiusY = height + distortion;

        const x = Math.cos(angle) * radiusX;
        const y = Math.sin(angle) * radiusY;

        if (i === 0) {
          context.moveTo(x, y);
        } else {
          context.lineTo(x, y);
        }
      }

      context.closePath();

      context.globalAlpha = this.armorOpacity * (0.65 - layer * 0.12);
      context.strokeStyle = layer === 0 ? "#f0c1ff" : "#bd70ed";

      context.lineWidth = layer === 0 ? 2 : 1.3;
      context.stroke();
    }

    context.restore();
  }

  drawBubbles(context) {
    context.save();

    this.bubbles.forEach((bubble) => {
      context.globalAlpha = bubble.alpha;

      context.fillStyle = "rgba(205,135,255,0.35)";
      context.strokeStyle = "#e8b7ff";
      context.lineWidth = 1;

      context.beginPath();
      context.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);

      context.fill();
      context.stroke();

      // Reflet sur la bulle.
      context.fillStyle = "rgba(255,255,255,0.75)";

      context.beginPath();
      context.arc(
        bubble.x - bubble.radius * 0.3,
        bubble.y - bubble.radius * 0.3,
        bubble.radius * 0.25,
        0,
        Math.PI * 2
      );

      context.fill();
    });

    context.restore();
  }

  drawParticles(context) {
    context.save();

    this.particles.forEach((particle) => {
      context.globalAlpha = particle.alpha;
      context.fillStyle = "#dca1ff";

      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);

      context.fill();
    });

    context.restore();
  }

  drawDroplets(context) {
    context.save();

    this.droplets.forEach((droplet) => {
      context.save();

      const angle = Math.atan2(droplet.vy, droplet.vx);

      context.translate(droplet.x, droplet.y);
      context.rotate(angle);

      context.globalAlpha = droplet.alpha;

      const gradient = context.createLinearGradient(
        -droplet.size,
        0,
        droplet.size,
        0
      );

      gradient.addColorStop(0, "#9235c8");
      gradient.addColorStop(0.5, "#e6a5ff");
      gradient.addColorStop(1, "#a14bd1");

      context.fillStyle = gradient;

      context.beginPath();
      context.moveTo(droplet.size * 1.5, 0);

      context.quadraticCurveTo(
        droplet.size * 0.5,
        -droplet.size,
        -droplet.size,
        -droplet.size * 0.5
      );

      context.quadraticCurveTo(
        -droplet.size * 1.5,
        0,
        -droplet.size,
        droplet.size * 0.5
      );

      context.quadraticCurveTo(
        droplet.size * 0.5,
        droplet.size,
        droplet.size * 1.5,
        0
      );

      context.closePath();
      context.fill();

      context.restore();
    });

    context.restore();
  }

  drawRipples(context) {
    context.save();

    this.ripples.forEach((ripple) => {
      context.globalAlpha = ripple.alpha;
      context.strokeStyle = "#dba0ff";
      context.lineWidth = 1.5;

      context.beginPath();

      context.ellipse(
        ripple.x,
        ripple.y,
        ripple.radius,
        ripple.radius * 0.65,
        ripple.rotation,
        0,
        Math.PI * 2
      );

      context.stroke();
    });

    context.restore();
  }
}
