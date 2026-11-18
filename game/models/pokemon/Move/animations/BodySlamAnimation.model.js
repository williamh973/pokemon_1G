export class BodySlamAnimation {
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

    this.originalAttackerPosition = {
      x: this.attacker.position.x,
      y: this.attacker.position.y,
    };

    this.originalTargetPosition = {
      x: this.target.position.x,
      y: this.target.position.y,
    };

    this.attackerCenterX =
      this.attacker.position.x + this.attacker.frameWidth / 2;
    this.attackerCenterY =
      this.attacker.position.y + this.attacker.frameHeight / 2;

    this.targetCenterX = this.target.position.x + this.target.frameWidth / 2;
    this.targetCenterY = this.target.position.y + this.target.frameHeight / 2;

    this.directionX = this.targetCenterX - this.attackerCenterX;
    this.directionY = this.targetCenterY - this.attackerCenterY;

    this.distance = Math.hypot(this.directionX, this.directionY);

    if (this.distance > 0) {
      this.directionX /= this.distance;
      this.directionY /= this.distance;
    } else {
      this.directionX = 1;
      this.directionY = 0;
    }

    this.perpendicularX = -this.directionY;
    this.perpendicularY = this.directionX;

    this.frame = 0;
    this.phase = "PREPARE";
    this.isFinished = false;

    this.duration = {
      PREPARE: 12,
      JUMP: 18,
      SLAM: 8,
      IMPACT: 30,
      RETURN: 18,
    };

    this.jumpHeight = 100;
    this.advanceDistance = Math.min(this.distance * 0.48, 150);
    this.targetRecoil = 100;

    this.shadow = {
      alpha: 0.25,
      scale: 0.65,
    };

    this.impact = {
      x: this.targetCenterX,
      y: this.targetCenterY + 10,
      flash: 0,
      intensity: 0,
    };

    this.rings = [];
    this.debris = [];
    this.dust = [];
    this.particles = [];
    this.cracks = [];
    this.shockwaves = [];

    this.shakeTriggered = false;
    this.impactCreated = false;
    this.flashAlpha = 0;
  }

  easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  easeInCubic(t) {
    return t * t * t;
  }

  easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  update(context) {
    if (this.isFinished) return;

    this.frame++;

    switch (this.phase) {
      case "PREPARE":
        this.updatePrepare();
        break;

      case "JUMP":
        this.updateJump();
        break;

      case "SLAM":
        this.updateSlam();
        break;

      case "IMPACT":
        this.updateImpact();
        break;

      case "RETURN":
        this.updateReturn();
        break;
    }

    this.draw(context);
  }

  changePhase(phase) {
    this.phase = phase;
    this.frame = 0;
  }

  updatePrepare() {
    const progress = Math.min(this.frame / this.duration.PREPARE, 1);

    const compression = Math.sin(progress * Math.PI);

    // Le Pokémon se tasse avant de bondir.
    this.attacker.position.y =
      this.originalAttackerPosition.y + compression * 5;

    this.attacker.position.x =
      this.originalAttackerPosition.x + this.directionX * compression * 3;

    this.shadow.scale = 0.65 + compression * 0.15;
    this.shadow.alpha = 0.2 + compression * 0.15;

    if (this.frame % 2 === 0) {
      this.createPreparationDust();
    }

    this.updateParticles(this.dust);

    if (progress >= 1) {
      this.changePhase("JUMP");
    }
  }

  updateJump() {
    const progress = Math.min(this.frame / this.duration.JUMP, 1);

    const horizontal = this.easeOutCubic(progress);
    const vertical = Math.sin(progress * Math.PI);

    this.attacker.position.x =
      this.originalAttackerPosition.x +
      this.directionX * this.advanceDistance * horizontal;

    this.attacker.position.y =
      this.originalAttackerPosition.y - this.jumpHeight * vertical;

    this.shadow.scale = 0.55 + vertical * 0.45;
    this.shadow.alpha = 0.12 + vertical * 0.18;

    if (this.frame % 2 === 0) {
      this.createJumpParticles();
    }

    this.updateParticles(this.dust);

    if (progress >= 1) {
      this.changePhase("SLAM");
    }
  }

  updateSlam() {
    const progress = Math.min(this.frame / this.duration.SLAM, 1);

    const descent = this.easeInCubic(progress);
    const bounce = Math.sin(progress * Math.PI);

    const landingX =
      this.originalAttackerPosition.x + this.directionX * this.advanceDistance;

    const landingY = this.originalAttackerPosition.y;

    // Descente extrêmement rapide.
    this.attacker.position.x = landingX + this.directionX * 7 * descent;

    this.attacker.position.y = landingY - this.jumpHeight * (1 - descent);

    // Compression visuelle à l'approche de l'impact.
    if (progress > 0.75) {
      this.attacker.position.y += bounce * 3;
    }

    this.shadow.scale = 0.9 + descent * 0.45;
    this.shadow.alpha = 0.35 + descent * 0.3;

    if (progress >= 1) {
      this.attacker.position.y = landingY;

      this.createImpact();
      this.changePhase("IMPACT");
    }
  }

  createImpact() {
    if (this.impactCreated) return;

    this.impactCreated = true;

    this.game.canvas?.startShake?.(420, 10);

    this.flashAlpha = 1;

    // La cible est repoussée par la collision.
    this.target.position.x += this.directionX * this.targetRecoil;
    this.target.position.y += 5;

    this.impact.x =
      this.attacker.position.x +
      this.attacker.frameWidth / 2 +
      this.directionX * 12;

    this.impact.y =
      this.attacker.position.y + this.attacker.frameHeight / 2 + 12;

    // Onde de choc principale.
    for (let i = 0; i < 5; i++) {
      this.rings.push({
        radius: 8 + i * 5,
        speed: 4 + i * 0.8,
        alpha: 1,
        decay: 0.035,
        width: 3 + (i % 2),
      });
    }

    // Grandes projections de débris.
    for (let i = 0; i < 42; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 7;

      this.debris.push({
        x: this.impact.x,
        y: this.impact.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        size: 2 + Math.random() * 5,
        rotation: Math.random() * Math.PI,
        rotationSpeed: (Math.random() - 0.5) * 0.25,
        alpha: 1,
        decay: 0.025 + Math.random() * 0.02,
      });
    }

    // Fissures au sol.
    for (let i = 0; i < 10; i++) {
      const angle = ((Math.PI * 2) / 10) * i + (Math.random() - 0.5) * 0.3;

      this.cracks.push({
        angle,
        length: 15 + Math.random() * 24,
        alpha: 1,
        decay: 0.025,
      });
    }

    // Nuage de poussière.
    for (let i = 0; i < 30; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 4;

      this.dust.push({
        x: this.impact.x,
        y: this.impact.y + 5,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed * 0.5 - 1,
        radius: 3 + Math.random() * 6,
        alpha: 0.85,
        decay: 0.025 + Math.random() * 0.02,
      });
    }

    // Étincelles lumineuses.
    for (let i = 0; i < 26; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 6;

      this.particles.push({
        x: this.impact.x,
        y: this.impact.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 1 + Math.random() * 3,
        alpha: 1,
        decay: 0.045,
        color: Math.random() > 0.5 ? "#ffffff" : "#ffd98a",
      });
    }
  }

  updateImpact() {
    const progress = Math.min(this.frame / this.duration.IMPACT, 1);

    this.flashAlpha = Math.max(0, 1 - this.frame / 5);

    this.updateRings();
    this.updateDebris();
    this.updateParticles(this.dust);
    this.updateParticles(this.particles);
    this.updateCracks();

    if (progress >= 1) {
      this.changePhase("RETURN");
    }
  }

  updateReturn() {
    const progress = Math.min(this.frame / this.duration.RETURN, 1);

    const eased = this.easeInOutCubic(progress);

    this.attacker.position.x =
      this.originalAttackerPosition.x +
      this.directionX * this.advanceDistance * 0.2 * (1 - eased);

    this.attacker.position.y = this.originalAttackerPosition.y;

    this.target.position.x =
      this.originalTargetPosition.x +
      this.directionX * this.targetRecoil * (1 - eased);

    this.target.position.y = this.originalTargetPosition.y + 5 * (1 - eased);

    this.shadow.scale += (0.65 - this.shadow.scale) * 0.2;
    this.shadow.alpha += (0.25 - this.shadow.alpha) * 0.2;

    this.updateRings();
    this.updateDebris();
    this.updateParticles(this.dust);
    this.updateParticles(this.particles);
    this.updateCracks();

    if (progress >= 1) {
      this.restorePositions();
      this.isFinished = true;
    }
  }

  createPreparationDust() {
    this.dust.push({
      x: this.attackerCenterX + (Math.random() - 0.5) * 22,
      y: this.originalAttackerPosition.y + this.attacker.frameHeight,
      vx: (Math.random() - 0.5) * 1.5,
      vy: -Math.random() * 1.2,
      radius: 2 + Math.random() * 3,
      alpha: 0.6,
      decay: 0.07,
    });
  }

  createJumpParticles() {
    this.dust.push({
      x:
        this.attacker.position.x +
        this.attacker.frameWidth / 2 +
        (Math.random() - 0.5) * 18,
      y: this.attacker.position.y + this.attacker.frameHeight,
      vx: (Math.random() - 0.5) * 2,
      vy: 1 + Math.random() * 2,
      radius: 1 + Math.random() * 3,
      alpha: 0.7,
      decay: 0.06,
    });
  }

  updateRings() {
    this.rings.forEach((ring) => {
      ring.radius += ring.speed;
      ring.alpha -= ring.decay;
    });

    this.rings = this.rings.filter((ring) => ring.alpha > 0);
  }

  updateDebris() {
    this.debris.forEach((piece) => {
      piece.x += piece.vx;
      piece.y += piece.vy;

      piece.vy += 0.18;
      piece.vx *= 0.98;

      piece.rotation += piece.rotationSpeed;
      piece.alpha -= piece.decay;
    });

    this.debris = this.debris.filter((piece) => piece.alpha > 0);
  }

  updateCracks() {
    this.cracks.forEach((crack) => {
      crack.alpha -= crack.decay;
    });

    this.cracks = this.cracks.filter((crack) => crack.alpha > 0);
  }

  updateParticles(particles) {
    particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      particle.vx *= 0.96;
      particle.vy *= 0.96;

      particle.alpha -= particle.decay;
      particle.radius *= 0.985;
    });

    for (let i = particles.length - 1; i >= 0; i--) {
      if (particles[i].alpha <= 0) {
        particles.splice(i, 1);
      }
    }
  }

  draw(context) {
    context.save();

    this.drawShadow(context);
    this.drawRings(context);
    this.drawCracks(context);
    this.drawDebris(context);
    this.drawDust(context);
    this.drawParticles(context);
    this.drawFlash(context);

    context.restore();
  }

  drawShadow(context) {
    if (
      this.phase !== "JUMP" &&
      this.phase !== "SLAM" &&
      this.phase !== "PREPARE"
    ) {
      return;
    }

    const groundX =
      this.originalAttackerPosition.x +
      this.attacker.frameWidth / 2 +
      this.directionX * this.advanceDistance;

    const groundY =
      this.originalAttackerPosition.y + this.attacker.frameHeight - 3;

    const radiusX = this.attacker.frameWidth * this.shadow.scale * 0.65;

    const radiusY =
      Math.max(3, this.attacker.frameHeight * 0.1) * this.shadow.scale;

    context.save();

    context.globalAlpha = this.shadow.alpha;
    context.fillStyle = "#15151b";

    context.beginPath();
    context.ellipse(groundX, groundY, radiusX, radiusY, 0, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }

  drawRings(context) {
    this.rings.forEach((ring) => {
      context.save();

      context.globalAlpha = ring.alpha;
      context.strokeStyle = "#f4e5c8";
      context.lineWidth = ring.width;
      context.shadowColor = "#ffffff";
      context.shadowBlur = 8;

      context.beginPath();
      context.ellipse(
        this.impact.x,
        this.impact.y,
        ring.radius * 1.5,
        ring.radius * 0.65,
        0,
        0,
        Math.PI * 2
      );
      context.stroke();

      context.restore();
    });
  }

  drawCracks(context) {
    this.cracks.forEach((crack) => {
      context.save();

      context.translate(this.impact.x, this.impact.y);
      context.rotate(crack.angle);

      context.globalAlpha = crack.alpha;
      context.strokeStyle = "#55483c";
      context.lineWidth = 2;

      context.beginPath();
      context.moveTo(0, 0);
      context.lineTo(crack.length * 0.35, 2);
      context.lineTo(crack.length * 0.65, -2);
      context.lineTo(crack.length, 1);
      context.stroke();

      context.restore();
    });
  }

  drawDebris(context) {
    this.debris.forEach((piece) => {
      context.save();

      context.translate(piece.x, piece.y);
      context.rotate(piece.rotation);

      context.globalAlpha = piece.alpha;
      context.fillStyle = "#9b8062";

      context.fillRect(
        -piece.size / 2,
        -piece.size / 2,
        piece.size,
        piece.size
      );

      context.restore();
    });
  }

  drawDust(context) {
    this.dust.forEach((particle) => {
      context.save();

      context.globalAlpha = particle.alpha;
      context.fillStyle = "#c7b8a1";

      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fill();

      context.restore();
    });
  }

  drawParticles(context) {
    this.particles.forEach((particle) => {
      context.save();

      context.globalAlpha = particle.alpha;
      context.fillStyle = particle.color;
      context.shadowColor = particle.color;
      context.shadowBlur = 8;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fill();

      context.restore();
    });
  }

  drawFlash(context) {
    if (this.flashAlpha <= 0) return;

    context.save();

    context.globalAlpha = this.flashAlpha * 0.65;
    context.fillStyle = "#ffffff";

    context.beginPath();
    context.arc(this.impact.x, this.impact.y, 38, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }

  restorePositions() {
    this.attacker.position.x = this.originalAttackerPosition.x;
    this.attacker.position.y = this.originalAttackerPosition.y;

    this.target.position.x = this.originalTargetPosition.x;
    this.target.position.y = this.originalTargetPosition.y;
  }
}
