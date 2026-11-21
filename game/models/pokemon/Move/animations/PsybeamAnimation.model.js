export class PsybeamAnimation {
  constructor(game, viewers, turnAction) {
    this.game = game;
    this.turnAction = turnAction;

    this.battleBackgroundEffectManager =
      this.game.battleManager.battleRenderer.battleBackgroundEffectManager;

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

    this.distance = Math.hypot(dx, dy);
    this.directionX = dx / this.distance;
    this.directionY = dy / this.distance;
    this.angle = Math.atan2(dy, dx);

    this.duration = {
      CHARGE: 46,
      FIRING: 46,
      DISTORTION: 24,
      IMPACT: 60,
      FINISH: 40,
    };

    this.phase = "CHARGE";
    this.frame = 0;
    this.isFinished = false;

    this.projectile = {
      x: this.attackerCenter.x + this.directionX * 14,
      y: this.attackerCenter.y + this.directionY * 14,
      progress: 0,
    };

    this.charge = 0;
    this.flash = 0;
    this.impactRadius = 0;
    this.rotation = 0;

    this.orbs = [];
    this.beamParticles = [];
    this.impactParticles = [];
    this.rings = [];
    this.stars = [];
    this.shockwaves = [];

    this.battleBackgroundEffectManager.startWave({
      amplitude: 10,
      frequency: 0.08,
      speed: 0.1,
    });

    this.createChargeOrbs();
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

      case "FIRING":
        this.updateFiring();
        break;

      case "DISTORTION":
        this.updateDistortion();
        break;

      case "IMPACT":
        this.updateImpact();
        break;

      case "FINISH":
        this.updateFinish();
        break;
    }

    this.updateOrbs();
    this.updateBeamParticles();
    this.updateImpactParticles();
    this.updateRings();
    this.updateStars();
    this.updateShockwaves();

    this.draw(context);
    this.frame++;
  }

  createChargeOrbs() {
    for (let i = 0; i < 14; i++) {
      this.orbs.push({
        angle: Math.random() * Math.PI * 2,
        radius: 8 + Math.random() * 17,
        speed: 0.04 + Math.random() * 0.045,
        size: 1.5 + Math.random() * 2,
        alpha: 1,
        color: ["#ff65c3", "#a855f7", "#67e8f9", "#fde047"][
          Math.floor(Math.random() * 4)
        ],
      });
    }
  }

  createBeamParticles(x, y, count = 3) {
    for (let i = 0; i < count; i++) {
      const offset = (Math.random() - 0.5) * 14;

      this.beamParticles.push({
        x: x - this.directionY * offset,
        y: y + this.directionX * offset,
        vx: (Math.random() - 0.5) * 1.4,
        vy: (Math.random() - 0.5) * 1.4,
        size: 1 + Math.random() * 2.5,
        alpha: 1,
        life: 12 + Math.random() * 12,
        color: ["#ff65c3", "#c084fc", "#67e8f9", "#fde047"][
          Math.floor(Math.random() * 4)
        ],
      });
    }
  }

  createImpactParticles(count, power = 3) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.8 + Math.random() * power;

      this.impactParticles.push({
        x: this.targetCenter.x,
        y: this.targetCenter.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 1.5 + Math.random() * 3,
        alpha: 1,
        life: 20 + Math.random() * 20,
        color: ["#ff65c3", "#c084fc", "#67e8f9", "#fde047", "#ffffff"][
          Math.floor(Math.random() * 5)
        ],
      });
    }
  }

  createRing(x, y, scale = 0.2, speed = 0.08, color = "#ff65c3") {
    this.rings.push({
      x,
      y,
      scale,
      speed,
      alpha: 1,
      rotation: Math.random() * Math.PI,
      color,
    });
  }

  updateCharge() {
    const progress = this.frame / this.duration.CHARGE;

    this.charge = progress;
    this.rotation += 0.12 + progress * 0.12;

    this.orbs.forEach((orb) => {
      orb.angle += orb.speed * (1 + progress);
      orb.radius = 9 + Math.sin(this.frame * 0.12 + orb.angle) * 5;
    });

    if (this.frame % 7 === 0) {
      this.createRing(
        this.attackerCenter.x + this.directionX * 15,
        this.attackerCenter.y + this.directionY * 15,
        0.2,
        0.04,
        "#c084fc"
      );
    }

    if (this.frame >= this.duration.CHARGE) {
      this.flash = 0.8;
      this.changePhase("FIRING");
    }
  }

  updateFiring() {
    const progress = this.frame / this.duration.FIRING;

    this.projectile.progress = Math.min(1, progress);
    this.projectile.x =
      this.attackerCenter.x + this.directionX * (this.distance * progress);

    this.projectile.y =
      this.attackerCenter.y + this.directionY * (this.distance * progress);

    if (this.frame % 2 === 0) {
      this.createBeamParticles(this.projectile.x, this.projectile.y, 3);
    }

    if (this.frame % 6 === 0) {
      this.createRing(
        this.projectile.x,
        this.projectile.y,
        0.15,
        0.06,
        "#67e8f9"
      );
    }

    this.flash *= 0.8;

    if (this.frame >= this.duration.FIRING) {
      this.projectile.progress = 1;
      this.projectile.x = this.targetCenter.x;
      this.projectile.y = this.targetCenter.y;

      this.createImpactParticles(20, 3);
      this.createRing(
        this.targetCenter.x,
        this.targetCenter.y,
        0.2,
        0.1,
        "#ff65c3"
      );

      this.changePhase("DISTORTION");
    }
  }

  updateDistortion() {
    this.flash = Math.max(this.flash, 0.3);
    this.rotation += 0.25;

    if (this.frame % 3 === 0) {
      this.createRing(
        this.targetCenter.x,
        this.targetCenter.y,
        0.15,
        0.11,
        ["#ff65c3", "#67e8f9", "#fde047"][Math.floor(Math.random() * 3)]
      );
    }

    if (this.frame >= this.duration.DISTORTION) {
      this.createImpactParticles(38, 4);
      this.createImpactBurst();
      this.game.canvas.startShake?.(5, 180);
      this.flash = 1;

      this.changePhase("IMPACT");
    }
  }

  createImpactBurst() {
    for (let i = 0; i < 3; i++) {
      this.createRing(
        this.targetCenter.x,
        this.targetCenter.y,
        0.15 + i * 0.2,
        0.12,
        ["#ff65c3", "#67e8f9", "#fde047"][i]
      );
    }

    for (let i = 0; i < 8; i++) {
      this.stars.push({
        angle: ((Math.PI * 2) / 8) * i,
        radius: 5,
        speed: 2 + Math.random() * 2,
        size: 3 + Math.random() * 3,
        alpha: 1,
        rotation: Math.random() * Math.PI,
      });
    }
  }

  updateImpact() {
    const progress = this.frame / this.duration.IMPACT;

    this.impactRadius = progress * 38;
    this.flash *= 0.82;

    if (this.frame % 5 === 0) {
      this.createImpactParticles(5, 2);
    }

    if (this.frame >= this.duration.IMPACT) {
      this.flash = 0;
      this.changePhase("FINISH");
    }
  }

  updateFinish() {
    this.flash *= 0.8;

    if (this.frame >= this.duration.FINISH) {
      this.isFinished = true;
      this.battleBackgroundEffectManager.stopWave();
    }
  }

  updateOrbs() {
    this.orbs = this.orbs.filter((orb) => {
      orb.alpha -= 0.025;
      return orb.alpha > 0;
    });
  }

  updateBeamParticles() {
    this.beamParticles = this.beamParticles.filter((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.alpha -= 1 / particle.life;
      particle.life--;

      return particle.life > 0 && particle.alpha > 0;
    });
  }

  updateImpactParticles() {
    this.impactParticles = this.impactParticles.filter((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vx *= 0.97;
      particle.vy *= 0.97;
      particle.alpha -= 1 / particle.life;
      particle.life--;

      return particle.life > 0 && particle.alpha > 0;
    });
  }

  updateRings() {
    this.rings = this.rings.filter((ring) => {
      ring.scale += ring.speed;
      ring.alpha -= 0.045;
      ring.rotation += 0.04;

      return ring.alpha > 0;
    });
  }

  updateStars() {
    this.stars = this.stars.filter((star) => {
      star.radius += star.speed;
      star.alpha -= 0.045;
      star.rotation += 0.08;

      return star.alpha > 0;
    });
  }

  updateShockwaves() {
    this.shockwaves = this.shockwaves.filter((wave) => {
      wave.radius += 3;
      wave.alpha -= 0.06;

      return wave.alpha > 0;
    });
  }

  draw(context) {
    this.drawRings(context);
    this.drawBeam(context);
    this.drawBeamParticles(context);
    this.drawChargeOrbs(context);
    this.drawImpactParticles(context);
    this.drawStars(context);
    this.drawFlash(context);
  }

  drawChargeOrbs(context) {
    if (this.phase !== "CHARGE") return;

    const x = this.attackerCenter.x + this.directionX * 15;
    const y = this.attackerCenter.y + this.directionY * 15;

    const radius = 3 + this.charge * 7;

    context.save();
    context.translate(x, y);
    context.rotate(this.rotation);

    const gradient = context.createRadialGradient(0, 0, 1, 0, 0, radius * 2);

    gradient.addColorStop(0, "#ffffff");
    gradient.addColorStop(0.35, "#ff65c3");
    gradient.addColorStop(0.7, "#a855f7");
    gradient.addColorStop(1, "rgba(168,85,247,0)");

    context.fillStyle = gradient;
    context.beginPath();
    context.arc(0, 0, radius * 2, 0, Math.PI * 2);
    context.fill();

    this.orbs.forEach((orb) => {
      const ox = Math.cos(orb.angle) * orb.radius;
      const oy = Math.sin(orb.angle) * orb.radius;

      context.globalAlpha = orb.alpha;
      context.fillStyle = orb.color;
      context.shadowColor = orb.color;
      context.shadowBlur = 7;

      context.beginPath();
      context.arc(ox, oy, orb.size, 0, Math.PI * 2);
      context.fill();
    });

    context.restore();
  }

  drawBeam(context) {
    if (this.phase !== "FIRING" && this.phase !== "DISTORTION") return;

    const endX = this.projectile.x;
    const endY = this.projectile.y;

    const progress = this.projectile.progress;
    const length = this.distance * progress;

    if (length <= 0) return;

    context.save();
    context.lineCap = "round";
    context.lineJoin = "round";

    const colors = [
      { color: "#ff65c3", offset: 0 },
      { color: "#a855f7", offset: 1.5 },
      { color: "#67e8f9", offset: -1.5 },
      { color: "#fde047", offset: 3 },
    ];

    colors.forEach((layer, index) => {
      context.beginPath();

      for (let i = 0; i <= 24; i++) {
        const t = i / 24;
        const distance = length * t;

        const wave =
          Math.sin(t * 18 + this.frame * 0.35 + index) * (2.5 + progress * 1.5);

        const x =
          this.attackerCenter.x +
          this.directionX * distance -
          this.directionY * (wave + layer.offset);

        const y =
          this.attackerCenter.y +
          this.directionY * distance +
          this.directionX * (wave + layer.offset);

        if (i === 0) {
          context.moveTo(x, y);
        } else {
          context.lineTo(x, y);
        }
      }

      context.strokeStyle = layer.color;
      context.lineWidth = index === 0 ? 8 : 4;
      context.globalAlpha = index === 0 ? 0.5 : 0.8;
      context.shadowColor = layer.color;
      context.shadowBlur = 10;
      context.stroke();
    });

    // Noyau blanc du faisceau.
    context.beginPath();
    context.moveTo(this.attackerCenter.x, this.attackerCenter.y);
    context.lineTo(endX, endY);
    context.strokeStyle = "#ffffff";
    context.lineWidth = 2;
    context.globalAlpha = 0.85;
    context.shadowColor = "#ffffff";
    context.shadowBlur = 12;
    context.stroke();

    context.restore();
  }

  drawBeamParticles(context) {
    this.beamParticles.forEach((particle) => {
      context.save();
      context.globalAlpha = Math.max(0, particle.alpha);
      context.fillStyle = particle.color;
      context.shadowColor = particle.color;
      context.shadowBlur = 7;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fill();

      context.restore();
    });
  }

  drawRings(context) {
    this.rings.forEach((ring) => {
      context.save();
      context.translate(ring.x, ring.y);
      context.rotate(ring.rotation);

      context.globalAlpha = Math.max(0, ring.alpha);
      context.strokeStyle = ring.color;
      context.lineWidth = 2;
      context.shadowColor = ring.color;
      context.shadowBlur = 8;

      context.beginPath();
      context.ellipse(
        0,
        0,
        9 * ring.scale * 2,
        6 * ring.scale * 2,
        0,
        0,
        Math.PI * 2
      );
      context.stroke();

      context.restore();
    });
  }

  drawImpactParticles(context) {
    this.impactParticles.forEach((particle) => {
      context.save();
      context.globalAlpha = Math.max(0, particle.alpha);
      context.fillStyle = particle.color;
      context.shadowColor = particle.color;
      context.shadowBlur = 8;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fill();

      context.restore();
    });
  }

  drawStars(context) {
    this.stars.forEach((star) => {
      const x = this.targetCenter.x + Math.cos(star.angle) * star.radius;
      const y = this.targetCenter.y + Math.sin(star.angle) * star.radius;

      context.save();
      context.translate(x, y);
      context.rotate(star.rotation);
      context.globalAlpha = Math.max(0, star.alpha);
      context.fillStyle = "#fff1a8";
      context.shadowColor = "#ff65c3";
      context.shadowBlur = 8;

      context.beginPath();

      for (let i = 0; i < 10; i++) {
        const radius = i % 2 === 0 ? star.size : star.size * 0.4;
        const angle = (Math.PI * 2 * i) / 10;

        const px = Math.cos(angle) * radius;
        const py = Math.sin(angle) * radius;

        if (i === 0) context.moveTo(px, py);
        else context.lineTo(px, py);
      }

      context.closePath();
      context.fill();

      context.restore();
    });
  }

  drawFlash(context) {
    if (this.flash <= 0.01) return;

    context.save();
    context.globalAlpha = Math.min(1, this.flash) * 0.5;
    context.fillStyle = "#ffffff";

    context.beginPath();
    context.arc(
      this.targetCenter.x,
      this.targetCenter.y,
      18 + this.flash * 22,
      0,
      Math.PI * 2
    );
    context.fill();

    context.restore();
  }
}
