export class BonemerangAnimation {
  constructor(game, viewers, turnAction) {
    this.game = game;
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

    this.distance = Math.hypot(dx, dy) || 1;
    this.directionX = dx / this.distance;
    this.directionY = dy / this.distance;

    this.perpendicularX = -this.directionY;
    this.perpendicularY = this.directionX;

    this.phase = "LAUNCH";
    this.frame = 0;
    this.isFinished = false;

    this.duration = {
      LAUNCH: 28,
      FIRST_IMPACT: 12,
      RETURN: 38,
      SECOND_IMPACT: 12,
      FINISH: 12,
    };

    this.projectile = {
      x: this.attackerCenter.x,
      y: this.attackerCenter.y,
      angle: 0,
      rotationSpeed: 0.32,
      radius: 12,
    };

    this.trail = [];
    this.particles = [];
    this.rings = [];
    this.stars = [];

    this.flash = 0;
    this.impactScale = 0;
    this.shakeTriggered = false;
  }

  changePhase(phase) {
    this.phase = phase;
    this.frame = 0;
  }

  update(context) {
    if (this.isFinished) return;

    switch (this.phase) {
      case "LAUNCH":
        this.updateLaunch();
        break;

      case "FIRST_IMPACT":
        this.updateFirstImpact();
        break;

      case "RETURN":
        this.updateReturn();
        break;

      case "SECOND_IMPACT":
        this.updateSecondImpact();
        break;

      case "FINISH":
        this.updateFinish();
        break;
    }

    this.updateTrail();
    this.updateParticles();
    this.updateRings();
    this.updateStars();

    this.draw(context);
    this.frame++;
  }

  easeInOut(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  getLaunchPosition(t) {
    const progress = this.easeInOut(t);

    const arc = Math.sin(t * Math.PI) * 13;

    return {
      x:
        this.attackerCenter.x +
        (this.targetCenter.x - this.attackerCenter.x) * progress,

      y:
        this.attackerCenter.y +
        (this.targetCenter.y - this.attackerCenter.y) * progress -
        arc,
    };
  }

  getReturnPosition(t) {
    const progress = this.easeInOut(t);

    const arc = Math.sin(t * Math.PI) * 30;

    return {
      x:
        this.targetCenter.x +
        (this.attackerCenter.x - this.targetCenter.x) * progress,

      y:
        this.targetCenter.y +
        (this.attackerCenter.y - this.targetCenter.y) * progress -
        arc,
    };
  }

  updateLaunch() {
    const progress = Math.min(1, this.frame / this.duration.LAUNCH);

    const position = this.getLaunchPosition(progress);

    this.projectile.x = position.x;
    this.projectile.y = position.y;
    this.projectile.angle += this.projectile.rotationSpeed;

    this.addTrailPoint();

    if (this.frame >= this.duration.LAUNCH) {
      this.projectile.x = this.targetCenter.x;
      this.projectile.y = this.targetCenter.y;

      this.triggerImpact();
      this.changePhase("FIRST_IMPACT");
    }
  }

  updateFirstImpact() {
    const progress = this.frame / this.duration.FIRST_IMPACT;

    this.flash = Math.max(0, 1 - progress);
    this.impactScale = Math.sin(progress * Math.PI);

    this.projectile.angle += 0.5;

    if (this.frame === 1) {
      this.createImpactParticles(16, 3);
      this.createRing(this.targetCenter.x, this.targetCenter.y);
      this.game.canvas.startShake?.(4, 130);
    }

    if (this.frame >= this.duration.FIRST_IMPACT) {
      this.changePhase("RETURN");
    }
  }

  updateReturn() {
    const progress = Math.min(1, this.frame / this.duration.RETURN);

    const position = this.getReturnPosition(progress);

    this.projectile.x = position.x;
    this.projectile.y = position.y;
    this.projectile.angle += this.projectile.rotationSpeed;

    this.addTrailPoint();

    if (this.frame >= this.duration.RETURN) {
      this.projectile.x = this.attackerCenter.x;
      this.projectile.y = this.attackerCenter.y;

      this.triggerImpact();
      this.changePhase("SECOND_IMPACT");
    }
  }

  updateSecondImpact() {
    const progress = this.frame / this.duration.SECOND_IMPACT;

    this.flash = Math.max(0, 1 - progress);
    this.impactScale = Math.sin(progress * Math.PI);

    this.projectile.angle += 0.5;

    if (this.frame === 1) {
      this.createImpactParticles(14, 2.5);
      this.createRing(this.attackerCenter.x, this.attackerCenter.y);
      this.game.canvas.startShake?.(3, 100);
    }

    if (this.frame >= this.duration.SECOND_IMPACT) {
      this.changePhase("FINISH");
    }
  }

  updateFinish() {
    this.trail.forEach((point) => {
      point.alpha *= 0.85;
    });

    this.flash *= 0.8;

    if (this.frame >= this.duration.FINISH) {
      this.isFinished = true;
    }
  }

  triggerImpact() {
    this.flash = 1;
    this.impactScale = 1;
    this.createImpactParticles(8, 2);
  }

  addTrailPoint() {
    this.trail.push({
      x: this.projectile.x,
      y: this.projectile.y,
      angle: this.projectile.angle,
      alpha: 0.8,
      radius: 4 + Math.random() * 2,
    });

    if (this.trail.length > 12) {
      this.trail.shift();
    }
  }

  createImpactParticles(count, power) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.7 + Math.random() * power;

      this.particles.push({
        x: this.projectile.x,
        y: this.projectile.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 1.5 + Math.random() * 2.5,
        alpha: 1,
        life: 15 + Math.random() * 12,
        color: Math.random() > 0.5 ? "#f5deb3" : "#ffffff",
      });
    }
  }

  createRing(x, y) {
    this.rings.push({
      x,
      y,
      radius: 5,
      alpha: 1,
    });
  }

  updateTrail() {
    this.trail = this.trail.filter((point) => {
      point.alpha -= 0.055;
      point.radius *= 0.97;

      return point.alpha > 0;
    });
  }

  updateParticles() {
    this.particles = this.particles.filter((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      particle.vx *= 0.94;
      particle.vy *= 0.94;

      particle.alpha -= 1 / particle.life;
      particle.life--;

      return particle.life > 0 && particle.alpha > 0;
    });
  }

  updateRings() {
    this.rings = this.rings.filter((ring) => {
      ring.radius += 2;
      ring.alpha -= 0.09;

      return ring.alpha > 0;
    });
  }

  updateStars() {
    this.stars = this.stars.filter((star) => {
      star.x += star.vx;
      star.y += star.vy;
      star.alpha -= 0.05;

      return star.alpha > 0;
    });
  }

  draw(context) {
    this.drawTrail(context);
    this.drawRings(context);
    this.drawParticles(context);
    this.drawStars(context);
    this.drawProjectile(context);
    this.drawImpact(context);
  }

  drawTrail(context) {
    this.trail.forEach((point, index) => {
      context.save();

      context.globalAlpha = Math.max(0, point.alpha * 0.65);
      context.translate(point.x, point.y);
      context.rotate(point.angle);

      context.fillStyle = "#f5deb3";
      context.shadowColor = "#ffffff";
      context.shadowBlur = 7;

      context.beginPath();
      context.ellipse(
        0,
        0,
        point.radius * 1.8,
        point.radius * 0.65,
        0,
        0,
        Math.PI * 2
      );
      context.fill();

      context.restore();
    });
  }

  drawProjectile(context) {
    if (this.phase === "FINISH") return;

    const x = this.projectile.x;
    const y = this.projectile.y;

    context.save();
    context.translate(x, y);
    context.rotate(this.projectile.angle);

    const length = this.projectile.radius;

    // Ombre de l'os.
    context.fillStyle = "rgba(70, 45, 25, 0.35)";
    context.beginPath();
    context.ellipse(1, 2, length + 2, 5, 0, 0, Math.PI * 2);
    context.fill();

    // Corps central de l'os.
    const gradient = context.createLinearGradient(0, -5, 0, 5);

    gradient.addColorStop(0, "#fff5d9");
    gradient.addColorStop(0.5, "#e8d2a5");
    gradient.addColorStop(1, "#b99a68");

    context.fillStyle = gradient;
    context.strokeStyle = "#8f7049";
    context.lineWidth = 1;

    context.beginPath();
    context.moveTo(-length, -2);
    context.lineTo(-length + 3, -4);
    context.lineTo(-length + 5, -2);
    context.lineTo(length - 5, -2);
    context.lineTo(length - 3, -4);
    context.lineTo(length, -2);
    context.lineTo(length + 1, 0);
    context.lineTo(length, 2);
    context.lineTo(length - 3, 4);
    context.lineTo(length - 5, 2);
    context.lineTo(-length + 5, 2);
    context.lineTo(-length + 3, 4);
    context.lineTo(-length, 2);
    context.closePath();

    context.fill();
    context.stroke();

    // Extrémités arrondies.
    context.fillStyle = "#fff0c9";
    context.strokeStyle = "#9e8055";

    [-length, length].forEach((end) => {
      context.beginPath();
      context.arc(end, 0, 3.8, 0, Math.PI * 2);
      context.fill();
      context.stroke();
    });

    // Reflet central.
    context.strokeStyle = "rgba(255,255,255,0.75)";
    context.lineWidth = 1;

    context.beginPath();
    context.moveTo(-length + 5, -1);
    context.lineTo(length - 5, -1);
    context.stroke();

    context.restore();
  }

  drawRings(context) {
    this.rings.forEach((ring) => {
      context.save();

      context.globalAlpha = Math.max(0, ring.alpha);
      context.strokeStyle = "#fff0c9";
      context.lineWidth = 2;

      context.beginPath();
      context.ellipse(
        ring.x,
        ring.y,
        ring.radius * 1.3,
        ring.radius * 0.7,
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
      context.save();

      context.globalAlpha = Math.max(0, particle.alpha);
      context.fillStyle = particle.color;
      context.shadowColor = "#fff0c9";
      context.shadowBlur = 6;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fill();

      context.restore();
    });
  }

  drawStars(context) {
    this.stars.forEach((star) => {
      context.save();

      context.globalAlpha = Math.max(0, star.alpha);
      context.fillStyle = "#fff0c9";

      context.beginPath();
      context.arc(star.x, star.y, 2, 0, Math.PI * 2);
      context.fill();

      context.restore();
    });
  }

  drawImpact(context) {
    if (this.flash <= 0.01) return;

    const x =
      this.phase === "FIRST_IMPACT"
        ? this.targetCenter.x
        : this.attackerCenter.x;

    const y =
      this.phase === "FIRST_IMPACT"
        ? this.targetCenter.y
        : this.attackerCenter.y;

    context.save();

    context.globalAlpha = this.flash * 0.55;
    context.fillStyle = "#fff5d9";

    context.beginPath();
    context.arc(x, y, 9 + this.impactScale * 13, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }
}
