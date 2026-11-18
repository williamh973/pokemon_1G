export class MegaKickAnimation {
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

    this.originalAttacker = {
      x: this.attacker.position.x,
      y: this.attacker.position.y,
    };

    this.originalTarget = {
      x: this.target.position.x,
      y: this.target.position.y,
    };

    this.attackerCenter = {
      x: this.attacker.position.x + this.attacker.frameWidth / 2,
      y: this.attacker.position.y + this.attacker.frameHeight / 2,
    };

    this.targetCenter = {
      x: this.target.position.x + this.target.frameWidth / 2,
      y: this.target.position.y + this.target.frameHeight / 2,
    };

    this.direction = this.targetCenter.x >= this.attackerCenter.x ? 1 : -1;

    this.distance = Math.abs(this.targetCenter.x - this.attackerCenter.x);

    this.phase = "PREPARE";
    this.frame = 0;
    this.isFinished = false;

    this.duration = {
      PREPARE: 12,
      CHARGE: 13,
      IMPACT: 24,
      RECOIL: 16,
      RETURN: 18,
    };

    this.lungeDistance = 38;
    this.targetRecoil = 25;

    this.flashAlpha = 0;
    this.rings = [];
    this.particles = [];
    this.speedLines = [];
    this.debris = [];
    this.stars = [];

    this.impactPoint = {
      x: this.targetCenter.x,
      y: this.targetCenter.y,
    };

    this.createSpeedLines();
  }

  update(context) {
    if (this.isFinished) return;

    this.frame++;

    switch (this.phase) {
      case "PREPARE":
        this.updatePrepare();
        break;

      case "CHARGE":
        this.updateCharge();
        break;

      case "IMPACT":
        this.updateImpact();
        break;

      case "RECOIL":
        this.updateRecoil();
        break;

      case "RETURN":
        this.updateReturn();
        break;
    }

    this.updateEffects();
    this.draw(context);
  }

  changePhase(phase) {
    this.phase = phase;
    this.frame = 0;
  }

  easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  easeIn(t) {
    return t * t * t;
  }

  clamp(value) {
    return Math.max(0, Math.min(1, value));
  }

  updatePrepare() {
    const progress = this.clamp(this.frame / this.duration.PREPARE);

    // Le Pokémon recule pour armer son coup.
    const recoil = Math.sin((progress * Math.PI) / 2) * 9;

    this.attacker.position.x =
      this.originalAttacker.x - this.direction * recoil;

    this.attacker.position.y =
      this.originalAttacker.y - Math.sin(progress * Math.PI) * 4;

    if (this.frame >= this.duration.PREPARE) {
      this.changePhase("CHARGE");
    }
  }

  updateCharge() {
    const progress = this.clamp(this.frame / this.duration.CHARGE);

    const movement = this.easeIn(progress) * this.lungeDistance;

    this.attacker.position.x =
      this.originalAttacker.x + this.direction * movement;

    this.attacker.position.y =
      this.originalAttacker.y - Math.sin(progress * Math.PI) * 7;

    this.createChargeParticles();

    if (this.frame % 2 === 0) {
      this.createSpeedParticle();
    }

    if (this.frame >= this.duration.CHARGE) {
      this.triggerImpact();
      this.changePhase("IMPACT");
    }
  }

  triggerImpact() {
    this.impactPoint.x = this.targetCenter.x - this.direction * 8;

    this.impactPoint.y = this.targetCenter.y;

    this.target.position.x =
      this.originalTarget.x + this.direction * this.targetRecoil * 0.35;

    this.flashAlpha = 1;

    this.game.canvas?.startShake?.(500, 10);

    // Onde de choc principale.
    for (let i = 0; i < 5; i++) {
      this.rings.push({
        radius: 8 + i * 5,
        maxRadius: 75 + i * 12,
        alpha: 0.9 - i * 0.12,
        speed: 5 + i * 0.8,
        lineWidth: 5 - i * 0.55,
      });
    }

    // Explosion centrale.
    for (let i = 0; i < 42; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 8;

      this.particles.push({
        x: this.impactPoint.x,
        y: this.impactPoint.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 2 + Math.random() * 4,
        alpha: 1,
        decay: 0.025 + Math.random() * 0.025,
      });
    }

    // Débris projetés autour de l'impact.
    for (let i = 0; i < 28; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 7;

      this.debris.push({
        x: this.impactPoint.x,
        y: this.impactPoint.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        size: 2 + Math.random() * 5,
        rotation: Math.random() * Math.PI,
        rotationSpeed: (Math.random() - 0.5) * 0.3,
        alpha: 1,
      });
    }

    // Étoiles d'impact.
    for (let i = 0; i < 9; i++) {
      this.stars.push({
        angle: (Math.PI * 2 * i) / 9,
        radius: 15 + Math.random() * 15,
        rotation: Math.random() * Math.PI,
        alpha: 1,
        size: 5 + Math.random() * 7,
      });
    }
  }

  updateImpact() {
    const progress = this.clamp(this.frame / this.duration.IMPACT);

    // Le Pokémon reste engagé dans son coup.
    this.attacker.position.x =
      this.originalAttacker.x + this.direction * this.lungeDistance;

    if (this.frame === 1) {
      this.target.position.x =
        this.originalTarget.x + this.direction * this.targetRecoil;
    }

    this.flashAlpha = Math.max(0, 1 - progress * 2.8);

    if (this.frame % 3 === 0) {
      this.createImpactParticles();
    }

    if (this.frame >= this.duration.IMPACT) {
      this.changePhase("RECOIL");
    }
  }

  updateRecoil() {
    const progress = this.clamp(this.frame / this.duration.RECOIL);

    // La cible termine son mouvement de recul.
    const recoil = this.targetRecoil * (1 - this.easeOut(progress));

    this.target.position.x = this.originalTarget.x + this.direction * recoil;

    this.target.position.y =
      this.originalTarget.y - Math.sin(progress * Math.PI) * 5;

    if (this.frame >= this.duration.RECOIL) {
      this.changePhase("RETURN");
    }
  }

  updateReturn() {
    const progress = this.clamp(this.frame / this.duration.RETURN);

    const remaining = 1 - this.easeOut(progress);

    this.attacker.position.x =
      this.originalAttacker.x + this.direction * this.lungeDistance * remaining;

    this.attacker.position.y = this.originalAttacker.y;

    this.target.position.x = this.originalTarget.x;
    this.target.position.y = this.originalTarget.y;

    if (this.frame >= this.duration.RETURN) {
      this.attacker.position.x = this.originalAttacker.x;
      this.attacker.position.y = this.originalAttacker.y;

      this.target.position.x = this.originalTarget.x;
      this.target.position.y = this.originalTarget.y;

      this.isFinished = true;
    }
  }

  createSpeedLines() {
    for (let i = 0; i < 16; i++) {
      this.speedLines.push({
        x: Math.random() * 100,
        y: (Math.random() - 0.5) * 90,
        length: 15 + Math.random() * 35,
        speed: 4 + Math.random() * 7,
        alpha: 0.3 + Math.random() * 0.5,
      });
    }
  }

  createChargeParticles() {
    if (this.frame % 2 !== 0) return;

    const x =
      this.attacker.position.x +
      (this.direction === 1 ? 0 : this.attacker.frameWidth);

    const y =
      this.attacker.position.y +
      this.attacker.frameHeight * (0.3 + Math.random() * 0.4);

    this.particles.push({
      x,
      y,
      vx: -this.direction * (1 + Math.random() * 3),
      vy: (Math.random() - 0.5) * 3,
      radius: 2 + Math.random() * 3,
      alpha: 0.9,
      decay: 0.06,
    });
  }

  createSpeedParticle() {
    const x = this.attacker.position.x + this.attacker.frameWidth / 2;

    const y = this.attacker.position.y + this.attacker.frameHeight / 2;

    this.particles.push({
      x,
      y,
      vx: -this.direction * (3 + Math.random() * 5),
      vy: (Math.random() - 0.5) * 4,
      radius: 2 + Math.random() * 3,
      alpha: 0.8,
      decay: 0.045,
    });
  }

  createImpactParticles() {
    const angle = Math.random() * Math.PI * 2;
    const speed = 2 + Math.random() * 5;

    this.particles.push({
      x: this.impactPoint.x,
      y: this.impactPoint.y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: 2 + Math.random() * 3,
      alpha: 1,
      decay: 0.045,
    });
  }

  updateEffects() {
    this.rings.forEach((ring) => {
      ring.radius += ring.speed;
      ring.alpha -= 0.035;
    });

    this.rings = this.rings.filter(
      (ring) => ring.alpha > 0 && ring.radius < ring.maxRadius
    );

    this.particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      particle.vx *= 0.97;
      particle.vy *= 0.97;

      particle.alpha -= particle.decay;
    });

    this.particles = this.particles.filter((particle) => particle.alpha > 0);

    this.debris.forEach((piece) => {
      piece.x += piece.vx;
      piece.y += piece.vy;

      piece.vy += 0.22;
      piece.vx *= 0.98;

      piece.rotation += piece.rotationSpeed;
      piece.alpha -= 0.035;
    });

    this.debris = this.debris.filter((piece) => piece.alpha > 0);

    this.stars.forEach((star) => {
      star.radius += 2.2;
      star.rotation += 0.12;
      star.alpha -= 0.045;
    });

    this.stars = this.stars.filter((star) => star.alpha > 0);

    this.speedLines.forEach((line) => {
      line.x -= line.speed;

      if (line.x < -line.length) {
        line.x = 100 + Math.random() * 100;
        line.y = (Math.random() - 0.5) * 90;
      }
    });
  }

  draw(context) {
    this.drawSpeedLines(context);
    this.drawChargeAura(context);
    this.drawKickArc(context);
    this.drawImpactRings(context);
    this.drawParticles(context);
    this.drawDebris(context);
    this.drawStars(context);
    this.drawFlash(context);
  }

  drawSpeedLines(context) {
    if (this.phase !== "CHARGE") return;

    const centerX = this.attacker.position.x + this.attacker.frameWidth / 2;

    const centerY = this.attacker.position.y + this.attacker.frameHeight / 2;

    context.save();

    for (const line of this.speedLines) {
      context.globalAlpha = line.alpha;
      context.strokeStyle = "#ffffff";
      context.lineWidth = 2;

      context.beginPath();
      context.moveTo(centerX - this.direction * line.x, centerY + line.y);

      context.lineTo(
        centerX - this.direction * (line.x + line.length),
        centerY + line.y
      );

      context.stroke();
    }

    context.restore();
  }

  drawChargeAura(context) {
    if (this.phase !== "PREPARE" && this.phase !== "CHARGE") return;

    const centerX = this.attacker.position.x + this.attacker.frameWidth / 2;

    const centerY = this.attacker.position.y + this.attacker.frameHeight / 2;

    const progress =
      this.phase === "PREPARE" ? this.frame / this.duration.PREPARE : 1;

    const radius = 12 + progress * 15;

    context.save();
    context.globalAlpha = 0.25 + progress * 0.3;

    const gradient = context.createRadialGradient(
      centerX,
      centerY,
      2,
      centerX,
      centerY,
      radius
    );

    gradient.addColorStop(0, "#ffffff");
    gradient.addColorStop(0.4, "#ffd36b");
    gradient.addColorStop(1, "rgba(255,120,20,0)");

    context.fillStyle = gradient;
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }

  drawKickArc(context) {
    if (this.phase !== "CHARGE") return;

    const progress = this.clamp(this.frame / this.duration.CHARGE);

    const centerX = this.attacker.position.x + this.attacker.frameWidth / 2;

    const centerY = this.attacker.position.y + this.attacker.frameHeight / 2;

    const radius = 35 + progress * 30;

    context.save();
    context.translate(centerX, centerY);

    if (this.direction === -1) {
      context.scale(-1, 1);
    }

    context.globalAlpha = 0.9;

    // Grande trace lumineuse du coup de pied.
    context.strokeStyle = "#ffffff";
    context.lineWidth = 7;
    context.lineCap = "round";

    context.beginPath();
    context.arc(0, 0, radius, -Math.PI * 0.8, Math.PI * 0.15);
    context.stroke();

    context.strokeStyle = "#ffb52e";
    context.lineWidth = 4;

    context.beginPath();
    context.arc(0, 0, radius - 5, -Math.PI * 0.8, Math.PI * 0.15);
    context.stroke();

    context.restore();
  }

  drawImpactRings(context) {
    if (this.phase !== "IMPACT" && this.phase !== "RECOIL") return;

    context.save();

    for (const ring of this.rings) {
      context.globalAlpha = ring.alpha;
      context.strokeStyle = "#fff1bd";
      context.lineWidth = ring.lineWidth;

      context.beginPath();
      context.ellipse(
        this.impactPoint.x,
        this.impactPoint.y,
        ring.radius,
        ring.radius * 0.45,
        0,
        0,
        Math.PI * 2
      );
      context.stroke();
    }

    context.restore();
  }

  drawParticles(context) {
    context.save();

    for (const particle of this.particles) {
      context.globalAlpha = particle.alpha;
      context.fillStyle = "#fff0b0";

      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fill();
    }

    context.restore();
  }

  drawDebris(context) {
    context.save();

    for (const piece of this.debris) {
      context.save();

      context.translate(piece.x, piece.y);
      context.rotate(piece.rotation);

      context.globalAlpha = piece.alpha;
      context.fillStyle = "#d6a56b";

      context.fillRect(
        -piece.size / 2,
        -piece.size / 2,
        piece.size,
        piece.size
      );

      context.restore();
    }

    context.restore();
  }

  drawStars(context) {
    context.save();

    for (const star of this.stars) {
      const x = this.impactPoint.x + Math.cos(star.angle) * star.radius;

      const y = this.impactPoint.y + Math.sin(star.angle) * star.radius;

      context.save();
      context.translate(x, y);
      context.rotate(star.rotation);

      context.globalAlpha = star.alpha;
      context.fillStyle = "#ffffff";

      context.beginPath();
      context.moveTo(0, -star.size);
      context.lineTo(star.size * 0.25, -star.size * 0.25);
      context.lineTo(star.size, 0);
      context.lineTo(star.size * 0.25, star.size * 0.25);
      context.lineTo(0, star.size);
      context.lineTo(-star.size * 0.25, star.size * 0.25);
      context.lineTo(-star.size, 0);
      context.lineTo(-star.size * 0.25, -star.size * 0.25);
      context.closePath();
      context.fill();

      context.restore();
    }

    context.restore();
  }

  drawFlash(context) {
    if (this.flashAlpha <= 0) return;

    context.save();
    context.globalAlpha = this.flashAlpha * 0.65;
    context.fillStyle = "#ffffff";

    context.fillRect(0, 0, context.canvas.width, context.canvas.height);

    context.restore();
  }
}
