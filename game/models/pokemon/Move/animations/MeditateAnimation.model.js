export class MeditateAnimation {
  constructor(game, viewers, turnAction) {
    this.game = game;
    this.turnAction = turnAction;

    if (viewers.front.slot.content === turnAction.pokemon) {
      this.pokemonViewer = viewers.front;
    } else {
      this.pokemonViewer = viewers.back;
    }

    this.pokemon = this.pokemonViewer.sprite;

    this.originalPosition = {
      x: this.pokemon.position.x,
      y: this.pokemon.position.y,
    };

    this.center = {
      x: this.originalPosition.x + this.pokemon.frameWidth / 2,
      y: this.originalPosition.y + this.pokemon.frameHeight / 2,
    };

    this.duration = {
      PREPARE: 20,
      MEDITATE: 48,
      FOCUS: 34,
      POWER: 20,
      FINISH: 28,
    };

    this.phase = "PREPARE";
    this.frame = 0;
    this.isFinished = false;

    this.aura = 0;
    this.energy = 0;
    this.flash = 0;
    this.rotation = 0;
    this.levitation = 0;

    this.particles = [];
    this.rings = [];
    this.energyOrbs = [];
    this.shockwaves = [];
    this.groundParticles = [];
    this.sparks = [];

    this.createMeditationParticles();
  }

  changePhase(phase) {
    this.phase = phase;
    this.frame = 0;
  }

  update(context) {
    if (this.isFinished) return;

    switch (this.phase) {
      case "PREPARE":
        this.updatePrepare();
        break;

      case "MEDITATE":
        this.updateMeditate();
        break;

      case "FOCUS":
        this.updateFocus();
        break;

      case "POWER":
        this.updatePower();
        break;

      case "FINISH":
        this.updateFinish();
        break;
    }

    this.updateParticles();
    this.updateRings();
    this.updateEnergyOrbs();
    this.updateShockwaves();
    this.updateGroundParticles();
    this.updateSparks();

    this.draw(context);
    this.frame++;
  }

  createMeditationParticles() {
    for (let i = 0; i < 24; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 17 + Math.random() * 18;

      this.particles.push({
        angle,
        radius,
        speed: 0.015 + Math.random() * 0.02,
        size: 1 + Math.random() * 1.8,
        alpha: 0.5 + Math.random() * 0.5,
        color: Math.random() > 0.5 ? "#ffb45c" : "#ffe0a3",
        phase: Math.random() * Math.PI * 2,
      });
    }
  }

  createRing(scale = 0.3, speed = 0.04, alpha = 0.7) {
    this.rings.push({
      scale,
      speed,
      alpha,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.025,
    });
  }

  createEnergyOrbs(count, power = 1.5) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 10 + Math.random() * 15;

      this.energyOrbs.push({
        angle,
        radius,
        speed: 0.035 + Math.random() * 0.045,
        size: 2 + Math.random() * 2.5,
        alpha: 1,
        power,
        color: Math.random() > 0.5 ? "#ff8c42" : "#ffd166",
      });
    }
  }

  createShockwave() {
    this.shockwaves.push({
      radius: 4,
      alpha: 1,
      width: 2 + Math.random() * 2,
    });
  }

  createGroundParticles(count, power = 3) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * power;

      this.groundParticles.push({
        x: this.center.x,
        y: this.originalPosition.y + this.pokemon.frameHeight,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed * 0.55 - 1,
        size: 1 + Math.random() * 3,
        alpha: 1,
        life: 18 + Math.random() * 18,
      });
    }
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
        size: 1 + Math.random() * 2.5,
        alpha: 1,
        life: 15 + Math.random() * 15,
      });
    }
  }

  updatePrepare() {
    const progress = this.frame / this.duration.PREPARE;

    this.aura = progress * 0.35;
    this.rotation += 0.025;

    this.particles.forEach((particle) => {
      particle.angle += particle.speed;
    });

    if (this.frame % 7 === 0) {
      this.createRing(0.25, 0.025, 0.35);
    }

    if (this.frame >= this.duration.PREPARE) {
      this.changePhase("MEDITATE");
    }
  }

  updateMeditate() {
    const progress = this.frame / this.duration.MEDITATE;

    this.aura = 0.35 + progress * 0.3;
    this.levitation = Math.sin(progress * Math.PI * 2.5) * 3;
    this.rotation += 0.035;

    this.particles.forEach((particle) => {
      particle.angle += particle.speed;
      particle.radius += Math.sin(this.frame * 0.06 + particle.phase) * 0.04;
    });

    if (this.frame % 10 === 0) {
      this.createEnergyOrbs(2, 1);
    }

    if (this.frame % 14 === 0) {
      this.createRing(0.3, 0.025, 0.35);
    }

    if (this.frame >= this.duration.MEDITATE) {
      this.changePhase("FOCUS");
    }
  }

  updateFocus() {
    const progress = this.frame / this.duration.FOCUS;
    const ease = progress * progress;

    this.aura = 0.65 + ease * 0.35;
    this.energy = ease;
    this.levitation = Math.sin(this.frame * 0.12) * 2;

    this.rotation += 0.08 + progress * 0.08;

    this.particles.forEach((particle) => {
      particle.angle += particle.speed * (1 + progress * 2);
      particle.radius *= 0.995;
    });

    this.energyOrbs.forEach((orb) => {
      orb.radius *= 0.985;
      orb.speed += 0.001;
    });

    if (this.frame % 5 === 0) {
      this.createEnergyOrbs(3, 2);
      this.createRing(0.2, 0.045, 0.6);
    }

    if (this.frame % 8 === 0) {
      this.createSparks(3, 1.5);
    }

    if (this.frame >= this.duration.FOCUS) {
      this.flash = 1;
      this.createShockwave();
      this.createGroundParticles(28, 4);
      this.createSparks(30, 4);
      this.game.canvas.startShake?.(8, 250);

      this.changePhase("POWER");
    }
  }

  updatePower() {
    const progress = this.frame / this.duration.POWER;

    this.flash *= 0.82;
    this.aura = Math.max(0.4, 1 - progress * 0.45);
    this.energy = 1 - progress * 0.5;

    this.rotation += 0.12;

    this.particles.forEach((particle) => {
      particle.angle += particle.speed * 3;
      particle.radius += 0.7;
      particle.alpha *= 0.96;
    });

    if (this.frame % 4 === 0) {
      this.createShockwave();
      this.createRing(0.2, 0.065, 0.75);
      this.createSparks(5, 3);
    }

    if (this.frame >= this.duration.POWER) {
      this.flash = 0;
      this.changePhase("FINISH");
    }
  }

  updateFinish() {
    const progress = this.frame / this.duration.FINISH;

    this.aura = 0.55 * (1 - progress);
    this.energy = 0;

    this.levitation *= 0.85;

    this.particles.forEach((particle) => {
      particle.alpha *= 0.94;
      particle.radius += 0.2;
    });

    if (this.frame >= this.duration.FINISH) {
      this.aura = 0;
      this.levitation = 0;

      this.pokemon.position.x = this.originalPosition.x;
      this.pokemon.position.y = this.originalPosition.y;

      this.isFinished = true;
    }
  }

  updateParticles() {
    this.particles.forEach((particle) => {
      particle.alpha = Math.max(0, particle.alpha);
    });

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
      ring.alpha -= 0.025;
      ring.rotation += ring.rotationSpeed;

      return ring.alpha > 0;
    });
  }

  updateEnergyOrbs() {
    this.energyOrbs = this.energyOrbs.filter((orb) => {
      orb.angle += orb.speed;
      orb.radius -= 0.08;
      orb.alpha -= 0.025;

      return orb.alpha > 0 && orb.radius > 0;
    });
  }

  updateShockwaves() {
    this.shockwaves = this.shockwaves.filter((wave) => {
      wave.radius += 3.2;
      wave.alpha -= 0.065;

      return wave.alpha > 0;
    });
  }

  updateGroundParticles() {
    this.groundParticles = this.groundParticles.filter((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += 0.12;
      particle.vx *= 0.97;
      particle.alpha -= 1 / particle.life;
      particle.life--;

      return particle.life > 0 && particle.alpha > 0;
    });
  }

  updateSparks() {
    // Les étincelles sont mises à jour dans updateParticles().
  }

  draw(context) {
    this.drawGroundEffects(context);
    this.drawRings(context);
    this.drawEnergyOrbs(context);
    this.drawAura(context);
    this.drawParticles(context);
    this.drawSparks(context);
    this.drawShockwaves(context);
    this.drawFlash(context);
  }

  drawGroundEffects(context) {
    if (this.aura <= 0) return;

    context.save();

    context.globalAlpha = this.aura * 0.45;
    context.strokeStyle = "#ffb45c";
    context.lineWidth = 1.5;

    context.beginPath();
    context.ellipse(
      this.center.x,
      this.originalPosition.y + this.pokemon.frameHeight,
      20 + this.energy * 16,
      5 + this.energy * 3,
      0,
      0,
      Math.PI * 2
    );
    context.stroke();

    context.restore();

    this.groundParticles.forEach((particle) => {
      context.save();
      context.globalAlpha = Math.max(0, particle.alpha);
      context.fillStyle = "#ffd166";
      context.shadowColor = "#ff8c42";
      context.shadowBlur = 5;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fill();

      context.restore();
    });
  }

  drawRings(context) {
    this.rings.forEach((ring) => {
      context.save();
      context.translate(this.center.x, this.center.y);
      context.rotate(ring.rotation);

      context.globalAlpha = Math.max(0, ring.alpha) * this.aura;
      context.strokeStyle = "#ffb45c";
      context.lineWidth = 1.5;

      context.beginPath();
      context.ellipse(
        0,
        0,
        17 * ring.scale * 2,
        24 * ring.scale * 2,
        0,
        0,
        Math.PI * 2
      );
      context.stroke();

      context.restore();
    });
  }

  drawEnergyOrbs(context) {
    this.energyOrbs.forEach((orb) => {
      const x = this.center.x + Math.cos(orb.angle) * orb.radius;
      const y = this.center.y + Math.sin(orb.angle) * orb.radius;

      context.save();
      context.globalAlpha = Math.max(0, orb.alpha) * this.aura;
      context.fillStyle = orb.color;
      context.shadowColor = orb.color;
      context.shadowBlur = 8;

      context.beginPath();
      context.arc(x, y, orb.size, 0, Math.PI * 2);
      context.fill();

      context.restore();
    });
  }

  drawAura(context) {
    if (this.aura <= 0) return;

    const pulse = 1 + Math.sin(this.frame * 0.12) * 0.06;
    const radius = 25 * pulse + this.energy * 9;

    context.save();
    context.translate(this.center.x, this.center.y + this.levitation);

    const gradient = context.createRadialGradient(0, 0, 3, 0, 0, radius);

    gradient.addColorStop(0, `rgba(255, 209, 102, ${0.3 * this.aura})`);
    gradient.addColorStop(0.45, `rgba(255, 140, 66, ${0.22 * this.aura})`);
    gradient.addColorStop(1, "rgba(255, 100, 40, 0)");

    context.fillStyle = gradient;

    context.beginPath();
    context.ellipse(0, 0, radius * 0.8, radius * 1.4, 0, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }

  drawParticles(context) {
    this.particles.forEach((particle) => {
      const x = this.center.x + Math.cos(particle.angle) * particle.radius;
      const y = this.center.y + Math.sin(particle.angle) * particle.radius;

      context.save();
      context.globalAlpha = particle.alpha * this.aura;
      context.fillStyle = particle.color;
      context.shadowColor = particle.color;
      context.shadowBlur = 6;

      context.beginPath();
      context.arc(x, y, particle.size, 0, Math.PI * 2);
      context.fill();

      context.restore();
    });
  }

  drawSparks(context) {
    this.sparks.forEach((spark) => {
      context.save();
      context.globalAlpha = Math.max(0, spark.alpha);
      context.fillStyle = "#fff1c2";
      context.shadowColor = "#ffb45c";
      context.shadowBlur = 7;

      context.beginPath();
      context.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2);
      context.fill();

      context.restore();
    });
  }

  drawShockwaves(context) {
    this.shockwaves.forEach((wave) => {
      context.save();
      context.globalAlpha = Math.max(0, wave.alpha);
      context.strokeStyle = "#ffd166";
      context.lineWidth = wave.width;

      context.beginPath();
      context.ellipse(
        this.center.x,
        this.originalPosition.y + this.pokemon.frameHeight,
        wave.radius,
        wave.radius * 0.28,
        0,
        0,
        Math.PI * 2
      );
      context.stroke();

      context.restore();
    });
  }

  drawFlash(context) {
    if (this.flash <= 0.01) return;

    context.save();
    context.globalAlpha = Math.min(1, this.flash) * 0.55;
    context.fillStyle = "#fff1c2";

    context.beginPath();
    context.arc(
      this.center.x,
      this.center.y,
      22 + this.flash * 22,
      0,
      Math.PI * 2
    );
    context.fill();

    context.restore();
  }
}
