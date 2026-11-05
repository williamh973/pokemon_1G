export class MegaDrainAnimation {
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

    this.prepareDuration = 35;
    this.fireDuration = 50;
    this.impactDuration = 100;
    this.finishDuration = 40;

    this.particles = [];

    for (let i = 0; i < 30; i++) {
      this.particles.push({
        progress: Math.random(),
        offset: Math.random() * Math.PI * 2,
        size: 1.5 + Math.random() * 3,
        speed: 0.008 + Math.random() * 0.012,
        amplitude: 5 + Math.random() * 14,
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
  // PREPARE : concentration de l'énergie végétale
  // --------------------------------------------------

  updatePrepare(context) {
    const origin = this.getCenter(this.pokemonViewer);

    const progress = this.timer / this.prepareDuration;
    const pulse = 1 + Math.sin(this.timer * 0.3) * 0.12;

    const x = origin.x;
    const y = origin.y - 12;

    const radius = 7 + progress * 8;

    context.save();

    // Aura végétale
    const aura = context.createRadialGradient(x, y, 2, x, y, 42 * pulse);

    aura.addColorStop(0, "rgba(200, 255, 130, 0.65)");
    aura.addColorStop(0.4, "rgba(90, 230, 55, 0.3)");
    aura.addColorStop(1, "rgba(30, 150, 30, 0)");

    context.fillStyle = aura;
    context.beginPath();
    context.arc(x, y, 42 * pulse, 0, Math.PI * 2);
    context.fill();

    // Sphère centrale
    const orb = context.createRadialGradient(x - 4, y - 4, 1, x, y, radius);

    orb.addColorStop(0, "#ffffff");
    orb.addColorStop(0.3, "#eaffc9");
    orb.addColorStop(0.65, "#8aff45");
    orb.addColorStop(1, "rgba(30, 180, 20, 0)");

    context.fillStyle = orb;
    context.shadowColor = "#8cff40";
    context.shadowBlur = 14;

    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();

    context.shadowBlur = 0;

    // Filaments végétaux en rotation
    for (let i = 0; i < 5; i++) {
      const angle = this.timer * 0.14 + (i * Math.PI * 2) / 5;

      const start = {
        x: x + Math.cos(angle) * 10,
        y: y + Math.sin(angle) * 10,
      };

      const end = {
        x: x + Math.cos(angle + 0.8) * (22 + progress * 7),
        y: y + Math.sin(angle + 0.8) * (22 + progress * 7),
      };

      this.drawVine(context, start, end, 1.5);
    }

    // Particules en orbite
    for (let i = 0; i < 8; i++) {
      const angle = this.timer * 0.12 + (i * Math.PI) / 4;
      const orbit = 22 + Math.sin(this.timer * 0.2 + i) * 5;

      this.drawParticle(
        context,
        x + Math.cos(angle) * orbit,
        y + Math.sin(angle) * orbit,
        2 + Math.sin(this.timer * 0.15 + i) * 0.8
      );
    }

    context.restore();

    if (this.timer >= this.prepareDuration) {
      this.setState("FIRE");
    }
  }

  // --------------------------------------------------
  // FIRE : connexion énergétique avec la cible
  // --------------------------------------------------

  updateFire(context) {
    const origin = this.getCenter(this.pokemonViewer);
    const target = this.getCenter(this.targetViewer);

    const progress = Math.min(this.timer / this.fireDuration, 1);

    context.save();

    // Faisceau principal
    this.drawEnergyBeam(context, origin, target, progress, 1);

    // Deux flux secondaires spiralés
    for (let i = 0; i < 2; i++) {
      const angle = this.timer * 0.16 + i * Math.PI;

      const offset = Math.sin(angle) * 15;

      this.drawEnergyBeam(
        context,
        {
          x: origin.x,
          y: origin.y + offset,
        },
        {
          x: target.x,
          y: target.y - offset,
        },
        progress,
        0.45
      );
    }

    // Particules aspirées vers la cible
    for (const particle of this.particles) {
      const particleProgress = Math.min(1, progress + particle.progress * 0.25);

      const x = origin.x + (target.x - origin.x) * particleProgress;
      const y = origin.y + (target.y - origin.y) * particleProgress;

      const wave =
        Math.sin(this.timer * 0.2 + particle.offset) * particle.amplitude;

      this.drawParticle(context, x, y + wave, particle.size);
    }

    // Halo d'impact sur la cible
    const pulse = 1 + Math.sin(this.timer * 0.4) * 0.2;

    const impactAura = context.createRadialGradient(
      target.x,
      target.y,
      2,
      target.x,
      target.y,
      25 * pulse
    );

    impactAura.addColorStop(0, "rgba(240, 255, 210, 0.8)");
    impactAura.addColorStop(0.4, "rgba(130, 255, 70, 0.5)");
    impactAura.addColorStop(1, "rgba(50, 180, 30, 0)");

    context.fillStyle = impactAura;
    context.beginPath();
    context.arc(target.x, target.y, 25 * pulse, 0, Math.PI * 2);
    context.fill();

    context.restore();

    if (this.timer >= this.fireDuration) {
      this.setState("IMPACT");
    }
  }

  // --------------------------------------------------
  // IMPACT : siphonnage massif de l'énergie vitale
  // --------------------------------------------------

  updateImpact(context) {
    const origin = this.getCenter(this.pokemonViewer);
    const target = this.getCenter(this.targetViewer);

    const progress = this.timer / this.impactDuration;

    const fadeOut = Math.max(0, 1 - Math.max(0, progress - 0.8) / 0.2);

    const pulse = 1 + Math.sin(this.timer * 0.2) * 0.12;

    const width = this.targetViewer.sprite.frameWidth;
    const height = this.targetViewer.sprite.frameHeight;

    context.save();
    context.globalAlpha = fadeOut;

    // Aura massive autour de la cible
    const auraRadius = Math.max(width, height) * 0.9;

    const aura = context.createRadialGradient(
      target.x,
      target.y,
      3,
      target.x,
      target.y,
      auraRadius * pulse
    );

    aura.addColorStop(0, "rgba(200, 255, 120, 0.4)");
    aura.addColorStop(0.45, "rgba(80, 230, 50, 0.25)");
    aura.addColorStop(1, "rgba(20, 140, 20, 0)");

    context.fillStyle = aura;
    context.beginPath();
    context.ellipse(
      target.x,
      target.y,
      width * 0.9 * pulse,
      height * 0.85 * pulse,
      0,
      0,
      Math.PI * 2
    );
    context.fill();

    // Vortex autour de la cible
    this.drawVortex(context, target, width * 0.65, height * 0.55);

    // Filaments qui s'enroulent autour de la cible
    for (let i = 0; i < 7; i++) {
      const angle = this.timer * 0.13 + (i * Math.PI * 2) / 7;

      const start = {
        x: target.x + Math.cos(angle) * width * 0.3,
        y: target.y + Math.sin(angle) * height * 0.3,
      };

      const end = {
        x: target.x + Math.cos(angle + 1.1) * width * 0.55,
        y: target.y + Math.sin(angle + 1.1) * height * 0.55,
      };

      this.drawVine(context, start, end, 2);
    }

    // Faisceau de drainage vers l'attaquant
    this.drawEnergyBeam(context, target, origin, 1, 0.95);

    // Particules qui remontent le faisceau
    for (const particle of this.particles) {
      const particleProgress =
        (particle.progress + this.timer * particle.speed) % 1;

      const x = target.x + (origin.x - target.x) * particleProgress;
      const y = target.y + (origin.y - target.y) * particleProgress;

      const wave =
        Math.sin(this.timer * 0.17 + particle.offset) * particle.amplitude;

      this.drawParticle(context, x, y + wave, particle.size);
    }

    // Concentration d'énergie autour de l'attaquant
    const recoveryRadius = 20 + Math.sin(this.timer * 0.25) * 7;

    const recovery = context.createRadialGradient(
      origin.x,
      origin.y,
      2,
      origin.x,
      origin.y,
      recoveryRadius * 2
    );

    recovery.addColorStop(0, "rgba(255, 255, 230, 0.9)");
    recovery.addColorStop(0.35, "rgba(180, 255, 100, 0.55)");
    recovery.addColorStop(1, "rgba(50, 200, 30, 0)");

    context.fillStyle = recovery;
    context.beginPath();
    context.arc(origin.x, origin.y, recoveryRadius * 2, 0, Math.PI * 2);
    context.fill();

    // Particules qui se concentrent sur l'attaquant
    for (let i = 0; i < 8; i++) {
      const angle = this.timer * 0.15 + (i * Math.PI) / 4;
      const distance = 25 + Math.sin(this.timer * 0.2 + i) * 8;

      this.drawParticle(
        context,
        origin.x + Math.cos(angle) * distance,
        origin.y + Math.sin(angle) * distance,
        2.5
      );
    }

    context.restore();

    if (this.timer >= this.impactDuration) {
      this.setState("FINISH");
    }
  }

  // --------------------------------------------------
  // FINISH : explosion végétale et régénération
  // --------------------------------------------------

  updateFinish(context) {
    const origin = this.getCenter(this.pokemonViewer);

    const progress = this.timer / this.finishDuration;
    const alpha = Math.max(0, 1 - progress);

    const radius = 18 + this.timer * 1.5;

    context.save();
    context.globalAlpha = alpha;

    // Explosion douce d'énergie
    const aura = context.createRadialGradient(
      origin.x,
      origin.y,
      2,
      origin.x,
      origin.y,
      radius * 1.5
    );

    aura.addColorStop(0, "rgba(255, 255, 235, 0.9)");
    aura.addColorStop(0.35, "rgba(180, 255, 100, 0.65)");
    aura.addColorStop(0.7, "rgba(70, 210, 40, 0.25)");
    aura.addColorStop(1, "rgba(20, 150, 20, 0)");

    context.fillStyle = aura;
    context.beginPath();
    context.arc(origin.x, origin.y, radius * 1.5, 0, Math.PI * 2);
    context.fill();

    // Rayons lumineux
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4 + this.timer * 0.04;

      const start = {
        x: origin.x + Math.cos(angle) * 5,
        y: origin.y + Math.sin(angle) * 5,
      };

      const end = {
        x: origin.x + Math.cos(angle) * radius,
        y: origin.y + Math.sin(angle) * radius,
      };

      this.drawVine(context, start, end, 2);
    }

    // Particules qui s'élèvent
    for (let i = 0; i < 16; i++) {
      const angle = (i * Math.PI * 2) / 16;

      const distance = 10 + this.timer * 1.2;

      const x = origin.x + Math.cos(angle) * distance;
      const y = origin.y + Math.sin(angle) * distance - this.timer * 0.4;

      this.drawParticle(
        context,
        x,
        y,
        2 + Math.sin(this.timer * 0.2 + i) * 1.2
      );
    }

    context.restore();

    if (this.timer >= this.finishDuration) {
      this.isFinished = true;
    }
  }

  // --------------------------------------------------
  // Utilitaire : faisceau d'énergie spiralé
  // --------------------------------------------------

  drawEnergyBeam(context, start, end, progress, opacity = 1) {
    const dx = end.x - start.x;
    const dy = end.y - start.y;

    const headX = start.x + dx * progress;
    const headY = start.y + dy * progress;

    const tailProgress = Math.max(0, progress - 0.25);

    const tailX = start.x + dx * tailProgress;
    const tailY = start.y + dy * tailProgress;

    context.save();
    context.globalAlpha *= opacity;

    // Halo extérieur
    context.lineCap = "round";
    context.strokeStyle = "rgba(60, 210, 40, 0.3)";
    context.lineWidth = 20;
    context.shadowColor = "#75ff40";
    context.shadowBlur = 20;

    context.beginPath();
    context.moveTo(tailX, tailY);
    context.lineTo(headX, headY);
    context.stroke();

    // Faisceau central
    context.shadowBlur = 10;
    context.strokeStyle = "#8dff50";
    context.lineWidth = 9;

    context.beginPath();
    context.moveTo(tailX, tailY);
    context.lineTo(headX, headY);
    context.stroke();

    // Cœur lumineux
    context.strokeStyle = "#efffcf";
    context.lineWidth = 3;

    context.beginPath();
    context.moveTo(tailX, tailY);
    context.lineTo(headX, headY);
    context.stroke();

    // Spirale de particules autour du faisceau
    const dxTrail = headX - tailX;
    const dyTrail = headY - tailY;
    const length = Math.sqrt(dxTrail * dxTrail + dyTrail * dyTrail);

    const angle = Math.atan2(dyTrail, dxTrail);

    for (let i = 0; i < 7; i++) {
      const t = (i + 1) / 8;

      const spiralAngle = this.timer * 0.25 + i * 1.5;

      const wave = Math.sin(spiralAngle) * 9;

      const x = tailX + dxTrail * t - Math.sin(angle) * wave;

      const y = tailY + dyTrail * t + Math.cos(angle) * wave;

      this.drawParticle(context, x, y, 2.5);
    }

    context.restore();
  }

  // --------------------------------------------------
  // Utilitaire : vortex énergétique
  // --------------------------------------------------

  drawVortex(context, center, radiusX, radiusY) {
    context.save();

    context.lineCap = "round";
    context.lineJoin = "round";

    for (let i = 0; i < 4; i++) {
      const rotation = this.timer * 0.1 + (i * Math.PI) / 2;

      const startAngle = rotation;
      const endAngle = rotation + Math.PI * 1.35;

      context.beginPath();

      for (let j = 0; j <= 28; j++) {
        const progress = j / 28;
        const angle = startAngle + (endAngle - startAngle) * progress;

        const radius = 0.35 + progress * 0.65;

        const x = center.x + Math.cos(angle) * radiusX * radius;
        const y = center.y + Math.sin(angle) * radiusY * radius;

        if (j === 0) {
          context.moveTo(x, y);
        } else {
          context.lineTo(x, y);
        }
      }

      context.strokeStyle =
        i % 2 === 0 ? "rgba(150, 255, 80, 0.8)" : "rgba(220, 255, 170, 0.65)";

      context.lineWidth = i % 2 === 0 ? 2.5 : 1.5;
      context.shadowColor = "#80ff40";
      context.shadowBlur = 10;

      context.stroke();
    }

    context.restore();
  }

  // --------------------------------------------------
  // Utilitaire : filament végétal
  // --------------------------------------------------

  drawVine(context, start, end, lineWidth = 2) {
    const dx = end.x - start.x;
    const dy = end.y - start.y;

    const length = Math.sqrt(dx * dx + dy * dy);

    const perpX = length > 0 ? -dy / length : 0;
    const perpY = length > 0 ? dx / length : 0;

    const bend = Math.sin(this.timer * 0.15) * 5;

    context.save();

    context.beginPath();
    context.moveTo(start.x, start.y);

    context.quadraticCurveTo(
      (start.x + end.x) / 2 + perpX * bend,
      (start.y + end.y) / 2 + perpY * bend,
      end.x,
      end.y
    );

    context.strokeStyle = "#8cff50";
    context.lineWidth = lineWidth;
    context.lineCap = "round";
    context.shadowColor = "#70ff40";
    context.shadowBlur = 8;

    context.stroke();

    // Reflet lumineux
    context.strokeStyle = "rgba(230, 255, 190, 0.8)";
    context.lineWidth = Math.max(1, lineWidth * 0.35);
    context.shadowBlur = 0;

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
    gradient.addColorStop(0.3, "#eaffc9");
    gradient.addColorStop(0.7, "#8aff50");
    gradient.addColorStop(1, "rgba(60, 200, 30, 0)");

    context.fillStyle = gradient;
    context.shadowColor = "#8cff50";
    context.shadowBlur = 8;

    context.beginPath();
    context.arc(x, y, size * 2.5, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }
}
