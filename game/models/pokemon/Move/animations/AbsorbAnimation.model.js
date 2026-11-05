export class AbsorbAnimation {
  constructor(game, viewers, turnAction) {
    this.game = game;
    this.viewers = viewers;
    this.turnAction = turnAction;

    if (this.viewers.front.slot.content === turnAction.pokemon) {
      this.pokemonViewer = this.viewers.front;
      this.targetViewer = this.viewers.back;
    } else {
      this.pokemonViewer = this.viewers.back;
      this.targetViewer = this.viewers.front;
    }

    this.state = "PREPARE";
    this.timer = 0;
    this.isFinished = false;

    this.prepareDuration = 30;
    this.fireDuration = 55;
    this.impactDuration = 85;
    this.finishDuration = 40;

    this.particles = [];

    this.particleCount = 24;

    this.initializeParticles();
  }

  initializeParticles() {
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        progress: Math.random(),
        offset: Math.random() * Math.PI * 2,
        size: 1.5 + Math.random() * 2.5,
        speed: 0.012 + Math.random() * 0.009,
        wave: 4 + Math.random() * 12,
      });
    }
  }

  setState(state) {
    this.state = state;
    this.timer = 0;
  }

  update(context) {
    if (this.isFinished) return;

    switch (this.state) {
      case "PREPARE":
        this.updatePrepare(context);
        break;

      case "FIRE":
        this.updateFire(context);
        break;

      case "IMPACT":
        this.updateImpact(context);
        break;

      case "FINISH":
        this.updateFinish(context);
        break;
    }

    this.timer++;
  }

  getCenter(viewer) {
    const sprite = viewer.sprite;

    return {
      x: sprite.position.x + sprite.frameWidth / 2,
      y: sprite.position.y + sprite.frameHeight / 2,
    };
  }

  // --------------------------------------------------
  // PREPARE : apparition de l'énergie vitale
  // --------------------------------------------------

  updatePrepare(context) {
    const origin = this.getCenter(this.pokemonViewer);

    const progress = this.timer / this.prepareDuration;

    const x = origin.x;
    const y = origin.y - 12;

    const pulse = 1 + Math.sin(this.timer * 0.3) * 0.15;
    const radius = 5 + progress * 7;

    context.save();

    // Aura verte
    const aura = context.createRadialGradient(x, y, 2, x, y, 35 * pulse);

    aura.addColorStop(0, "rgba(180, 255, 130, 0.5)");
    aura.addColorStop(0.4, "rgba(70, 220, 80, 0.25)");
    aura.addColorStop(1, "rgba(20, 150, 40, 0)");

    context.fillStyle = aura;
    context.beginPath();
    context.arc(x, y, 35 * pulse, 0, Math.PI * 2);
    context.fill();

    // Sphère d'énergie
    const orb = context.createRadialGradient(x - 3, y - 3, 1, x, y, radius);

    orb.addColorStop(0, "#ffffff");
    orb.addColorStop(0.35, "#d8ffb8");
    orb.addColorStop(0.7, "#72ec55");
    orb.addColorStop(1, "rgba(30, 160, 40, 0)");

    context.fillStyle = orb;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();

    // Particules en orbite
    for (let i = 0; i < 6; i++) {
      const angle = this.timer * 0.16 + (i * Math.PI) / 3;
      const orbitRadius = 15 + Math.sin(this.timer * 0.2 + i) * 3;

      const px = x + Math.cos(angle) * orbitRadius;
      const py = y + Math.sin(angle) * orbitRadius;

      this.drawParticle(context, px, py, 2.5);
    }

    context.restore();

    if (this.timer >= this.prepareDuration) {
      this.setState("FIRE");
    }
  }

  // --------------------------------------------------
  // FIRE : le flux d'énergie rejoint la cible
  // --------------------------------------------------

  updateFire(context) {
    const origin = this.getCenter(this.pokemonViewer);
    const target = this.getCenter(this.targetViewer);

    const progress = Math.min(this.timer / this.fireDuration, 1);

    context.save();

    // Flux principal
    this.drawEnergyStream(context, origin, target, progress, 1);

    // Flux secondaires
    for (let i = 0; i < 3; i++) {
      const offset = Math.sin(this.timer * 0.12 + i * 2) * 12;

      this.drawEnergyStream(
        context,
        {
          x: origin.x,
          y: origin.y + offset,
        },
        {
          x: target.x,
          y: target.y + offset,
        },
        progress,
        0.45
      );
    }

    // Particules circulant dans le flux
    for (const particle of this.particles) {
      const particleProgress = (particle.progress + progress * 0.85) % 1;

      const x = target.x + (origin.x - target.x) * particleProgress;
      const y = target.y + (origin.y - target.y) * particleProgress;

      const wave =
        Math.sin(this.timer * 0.18 + particle.offset) * particle.wave;

      this.drawParticle(context, x, y + wave, particle.size);
    }

    context.restore();

    if (this.timer >= this.fireDuration) {
      this.setState("IMPACT");
    }
  }

  // --------------------------------------------------
  // IMPACT : absorption de l'énergie de la cible
  // --------------------------------------------------

  updateImpact(context) {
    const origin = this.getCenter(this.pokemonViewer);
    const target = this.getCenter(this.targetViewer);

    const progress = this.timer / this.impactDuration;
    const fadeOut = Math.max(0, 1 - Math.max(0, progress - 0.75) / 0.25);

    const pulse = 1 + Math.sin(this.timer * 0.2) * 0.12;

    context.save();
    context.globalAlpha = fadeOut;

    // Aura autour de la cible
    const width = this.targetViewer.sprite.frameWidth;
    const height = this.targetViewer.sprite.frameHeight;

    const aura = context.createRadialGradient(
      target.x,
      target.y,
      3,
      target.x,
      target.y,
      Math.max(width, height) * 0.8
    );

    aura.addColorStop(0, "rgba(190, 255, 130, 0.45)");
    aura.addColorStop(0.5, "rgba(60, 220, 80, 0.2)");
    aura.addColorStop(1, "rgba(20, 150, 40, 0)");

    context.fillStyle = aura;
    context.beginPath();
    context.ellipse(
      target.x,
      target.y,
      width * 0.85 * pulse,
      height * 0.8 * pulse,
      0,
      0,
      Math.PI * 2
    );
    context.fill();

    // Filaments qui entourent la cible
    for (let i = 0; i < 5; i++) {
      const angle = this.timer * 0.1 + (i * Math.PI * 2) / 5;

      const start = {
        x: target.x + Math.cos(angle) * width * 0.35,
        y: target.y + Math.sin(angle) * height * 0.35,
      };

      const end = {
        x: target.x + Math.cos(angle + 0.6) * width * 0.48,
        y: target.y + Math.sin(angle + 0.6) * height * 0.48,
      };

      this.drawEnergyThread(context, start, end);
    }

    // Flux d'énergie qui quitte la cible
    this.drawEnergyStream(context, target, origin, 1, 0.9);

    // Particules aspirées vers l'attaquant
    for (let i = 0; i < this.particles.length; i++) {
      const particle = this.particles[i];

      const progress = (particle.progress + this.timer * particle.speed) % 1;

      const x = target.x + (origin.x - target.x) * progress;
      const y = target.y + (origin.y - target.y) * progress;

      const wave =
        Math.sin(this.timer * 0.16 + particle.offset) * particle.wave;

      this.drawParticle(context, x, y + wave, particle.size);
    }

    // Énergie qui se concentre autour de l'attaquant
    const recoveryRadius = 12 + Math.sin(this.timer * 0.25) * 5;

    const recovery = context.createRadialGradient(
      origin.x,
      origin.y,
      1,
      origin.x,
      origin.y,
      recoveryRadius * 2
    );

    recovery.addColorStop(0, "rgba(255, 255, 220, 0.8)");
    recovery.addColorStop(0.4, "rgba(150, 255, 100, 0.45)");
    recovery.addColorStop(1, "rgba(50, 200, 50, 0)");

    context.fillStyle = recovery;
    context.beginPath();
    context.arc(origin.x, origin.y, recoveryRadius * 2, 0, Math.PI * 2);
    context.fill();

    context.restore();

    if (this.timer >= this.impactDuration) {
      this.setState("FINISH");
    }
  }

  // --------------------------------------------------
  // FINISH : récupération de l'énergie
  // --------------------------------------------------

  updateFinish(context) {
    const origin = this.getCenter(this.pokemonViewer);

    const progress = this.timer / this.finishDuration;
    const alpha = Math.max(0, 1 - progress);

    context.save();
    context.globalAlpha = alpha;

    // Explosion douce d'énergie autour de l'attaquant
    const radius = 15 + this.timer * 1.3;

    const aura = context.createRadialGradient(
      origin.x,
      origin.y,
      1,
      origin.x,
      origin.y,
      radius
    );

    aura.addColorStop(0, "rgba(240, 255, 210, 0.7)");
    aura.addColorStop(0.35, "rgba(120, 255, 90, 0.45)");
    aura.addColorStop(1, "rgba(30, 160, 40, 0)");

    context.fillStyle = aura;
    context.beginPath();
    context.arc(origin.x, origin.y, radius, 0, Math.PI * 2);
    context.fill();

    // Particules qui s'élèvent
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI * 2) / 12;

      const distance = 10 + this.timer * 1.1;

      const x = origin.x + Math.cos(angle) * distance;
      const y = origin.y + Math.sin(angle) * distance - this.timer * 0.3;

      this.drawParticle(
        context,
        x,
        y,
        2 + Math.sin(this.timer * 0.2 + i) * 1.5
      );
    }

    context.restore();

    if (this.timer >= this.finishDuration) {
      this.isFinished = true;
    }
  }

  // --------------------------------------------------
  // Utilitaire : flux d'énergie
  // --------------------------------------------------

  drawEnergyStream(context, start, end, progress, opacity = 1) {
    const dx = end.x - start.x;
    const dy = end.y - start.y;

    const headX = start.x + dx * progress;
    const headY = start.y + dy * progress;

    const tailProgress = Math.max(0, progress - 0.22);

    const tailX = start.x + dx * tailProgress;
    const tailY = start.y + dy * tailProgress;

    context.save();

    context.globalAlpha *= opacity;

    // Halo extérieur
    context.lineCap = "round";
    context.strokeStyle = "rgba(60, 220, 70, 0.25)";
    context.lineWidth = 15;
    context.shadowColor = "#65ff50";
    context.shadowBlur = 18;

    context.beginPath();
    context.moveTo(tailX, tailY);
    context.lineTo(headX, headY);
    context.stroke();

    // Flux lumineux
    context.shadowBlur = 8;
    context.strokeStyle = "#8cff68";
    context.lineWidth = 6;

    context.beginPath();
    context.moveTo(tailX, tailY);
    context.lineTo(headX, headY);
    context.stroke();

    // Cœur lumineux
    context.strokeStyle = "#f1ffd9";
    context.lineWidth = 2;

    context.beginPath();
    context.moveTo(tailX, tailY);
    context.lineTo(headX, headY);
    context.stroke();

    // Ondulations
    for (let i = 0; i < 4; i++) {
      const t = (i + 1) / 5;

      const x = tailX + (headX - tailX) * t;
      const y = tailY + (headY - tailY) * t;

      const wave = Math.sin(this.timer * 0.25 + i * 2) * 7;

      this.drawParticle(context, x, y + wave, 2.5);
    }

    context.restore();
  }

  // --------------------------------------------------
  // Utilitaire : filaments d'énergie
  // --------------------------------------------------

  drawEnergyThread(context, start, end) {
    context.save();

    context.strokeStyle = "rgba(150, 255, 100, 0.9)";
    context.lineWidth = 2;
    context.shadowColor = "#70ff50";
    context.shadowBlur = 8;

    context.beginPath();
    context.moveTo(start.x, start.y);

    const middleX = (start.x + end.x) / 2;
    const middleY = (start.y + end.y) / 2;

    context.lineTo(
      middleX + Math.sin(this.timer * 0.2) * 5,
      middleY + Math.cos(this.timer * 0.2) * 5
    );

    context.lineTo(end.x, end.y);
    context.stroke();

    context.restore();
  }

  // --------------------------------------------------
  // Utilitaire : particule lumineuse
  // --------------------------------------------------

  drawParticle(context, x, y, size) {
    context.save();

    const gradient = context.createRadialGradient(x, y, 0, x, y, size * 2.5);

    gradient.addColorStop(0, "#ffffff");
    gradient.addColorStop(0.35, "#dfffbb");
    gradient.addColorStop(0.7, "#79f45c");
    gradient.addColorStop(1, "rgba(60, 200, 50, 0)");

    context.fillStyle = gradient;
    context.shadowColor = "#70ff50";
    context.shadowBlur = 8;

    context.beginPath();
    context.arc(x, y, size * 2.5, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }
}
