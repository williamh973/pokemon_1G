export class DoubleSlapAnimation {
  constructor(game, viewers, turnAction) {
    this.game = game;
    this.turnAction = turnAction;

    // Identification des Pokémon
    if (viewers.front.slot.content === turnAction.pokemon) {
      this.pokemonViewer = viewers.front;
      this.targetViewer = viewers.back;
    } else {
      this.pokemonViewer = viewers.back;
      this.targetViewer = viewers.front;
    }

    this.attacker = this.pokemonViewer.sprite;
    this.target = this.targetViewer.sprite;

    // Positions initiales
    this.originalAttackerPosition = {
      x: this.attacker.position.x,
      y: this.attacker.position.y,
    };

    this.originalTargetPosition = {
      x: this.target.position.x,
      y: this.target.position.y,
    };

    this.attackerWidth = this.attacker.frameWidth * (this.attacker.scale || 1);

    this.targetWidth = this.target.frameWidth * (this.target.scale || 1);

    this.targetHeight = this.target.frameHeight * (this.target.scale || 1);

    // Nombre de frappes
    this.hitCount = Number.isInteger(turnAction.hitCount)
      ? Math.max(2, Math.min(5, turnAction.hitCount))
      : Math.floor(Math.random() * 4) + 2;

    // Direction de l'attaque
    this.direction =
      this.originalAttackerPosition.x < this.originalTargetPosition.x ? 1 : -1;

    // Centre de la cible
    this.targetCenter = {
      x: this.originalTargetPosition.x + this.targetWidth / 2,
      y: this.originalTargetPosition.y + this.targetHeight / 2,
    };

    // Phases
    this.phase = "PREPARE";
    this.timer = 0;

    this.phaseDuration = {
      PREPARE: 12,
      APPROACH: 8,
      SLAP: 7,
      IMPACT: 5,
      FINISH: 14,
      RETURN: 10,
    };

    this.hitIndex = 0;
    this.currentSlapDirection = 1;

    this.impactTimer = 0;
    this.flashAlpha = 0;

    this.stars = [];
    this.particles = [];

    this.impactPosition = {
      x: this.targetCenter.x,
      y: this.targetCenter.y,
    };

    this.isFinished = false;

    // Déplacement de l'attaquant
    this.approachDistance = 13;
    this.attackerStartX = this.originalAttackerPosition.x;
    this.attackerTargetX =
      this.originalAttackerPosition.x + this.direction * this.approachDistance;

    this.targetShakeOffset = 0;
  }

  update(context) {
    if (this.isFinished) return;

    this.timer++;

    switch (this.phase) {
      case "PREPARE":
        this.updatePrepare();
        break;

      case "APPROACH":
        this.updateApproach();
        break;

      case "SLAP":
        this.updateSlap();
        break;

      case "IMPACT":
        this.updateImpact();
        break;

      case "FINISH":
        this.updateFinish();
        break;

      case "RETURN":
        this.updateReturn();
        break;
    }

    this.updateParticles();
    this.draw(context);
  }

  changePhase(phase) {
    this.phase = phase;
    this.timer = 0;
  }

  updatePrepare() {
    if (this.timer >= this.phaseDuration.PREPARE) {
      this.changePhase("APPROACH");
    }
  }

  updateApproach() {
    const progress = Math.min(1, this.timer / this.phaseDuration.APPROACH);

    const eased = this.easeOutCubic(progress);

    this.attacker.position.x =
      this.attackerStartX +
      (this.attackerTargetX - this.attackerStartX) * eased;

    if (progress >= 1) {
      this.changePhase("SLAP");
    }
  }

  updateSlap() {
    const progress = Math.min(1, this.timer / this.phaseDuration.SLAP);

    // Mouvement alterné des frappes
    const movement = Math.sin(progress * Math.PI);

    const lateralOffset = this.currentSlapDirection * movement * 7;

    this.target.position.x = this.originalTargetPosition.x + lateralOffset;

    if (progress >= 1) {
      this.createImpact();
      this.changePhase("IMPACT");
    }
  }

  updateImpact() {
    if (this.timer >= this.phaseDuration.IMPACT) {
      this.hitIndex++;

      if (this.hitIndex < this.hitCount) {
        this.currentSlapDirection *= -1;
        this.changePhase("SLAP");
      } else {
        this.changePhase("FINISH");
      }
    }
  }

  createImpact() {
    const isFinalHit = this.hitIndex === this.hitCount - 1;

    const side = this.currentSlapDirection * this.direction;

    const x = this.targetCenter.x + side * (this.targetWidth * 0.25);

    const y = this.targetCenter.y - 3;

    this.impactPosition = { x, y };

    this.flashAlpha = isFinalHit ? 0.9 : 0.55;

    // Secousse du canvas
    if (this.game.canvas?.startShake) {
      this.game.canvas.startShake(isFinalHit ? 4 : 2, isFinalHit ? 160 : 80);
    }

    // Étoiles autour de l'impact
    const starCount = isFinalHit ? 7 : 4;

    for (let i = 0; i < starCount; i++) {
      const angle = (Math.PI * 2 * i) / starCount + Math.random() * 0.4;

      const speed = 1.5 + Math.random() * (isFinalHit ? 3 : 2);

      this.stars.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3 + Math.random() * 3,
        rotation: Math.random() * Math.PI,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        life: 1,
        decay: 0.07 + Math.random() * 0.04,
      });
    }

    // Petites particules lumineuses
    for (let i = 0; i < (isFinalHit ? 12 : 6); i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 2.5;

      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 1 + Math.random() * 2,
        life: 1,
        decay: 0.08 + Math.random() * 0.04,
      });
    }
  }

  updateFinish() {
    this.flashAlpha = Math.max(0, this.flashAlpha - 0.08);

    if (this.timer >= this.phaseDuration.FINISH) {
      this.changePhase("RETURN");
    }
  }

  updateReturn() {
    const progress = Math.min(1, this.timer / this.phaseDuration.RETURN);

    const eased = this.easeOutCubic(progress);

    // Retour de l'attaquant
    this.attacker.position.x =
      this.attackerTargetX +
      (this.originalAttackerPosition.x - this.attackerTargetX) * eased;

    // Retour de la cible
    this.target.position.x =
      this.originalTargetPosition.x +
      (this.target.position.x - this.originalTargetPosition.x) * eased;

    if (progress >= 1) {
      this.restorePositions();
      this.isFinished = true;
    }
  }

  updateParticles() {
    this.stars = this.stars.filter((star) => {
      star.x += star.vx;
      star.y += star.vy;

      star.vx *= 0.94;
      star.vy *= 0.94;
      star.rotation += star.rotationSpeed;

      star.life -= star.decay;

      return star.life > 0;
    });

    this.particles = this.particles.filter((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      particle.vx *= 0.92;
      particle.vy *= 0.92;

      particle.life -= particle.decay;

      return particle.life > 0;
    });
  }

  draw(context) {
    if (!context) return;

    this.drawStars(context);
    this.drawParticles(context);
    this.drawFlash(context);
  }

  drawStars(context) {
    context.save();

    for (const star of this.stars) {
      context.save();

      context.globalAlpha = star.life;
      context.translate(star.x, star.y);
      context.rotate(star.rotation);

      context.fillStyle = "#FFE66D";

      this.drawStarShape(context, 0, 0, star.size, star.size * 0.45);

      context.fill();

      context.restore();
    }

    context.restore();
  }

  drawParticles(context) {
    context.save();

    for (const particle of this.particles) {
      context.globalAlpha = particle.life;
      context.fillStyle = "#FFF1A6";

      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);

      context.fill();
    }

    context.restore();
  }

  drawFlash(context) {
    if (this.flashAlpha <= 0) return;

    context.save();

    context.globalAlpha = this.flashAlpha;
    context.fillStyle = "#FFFFFF";

    context.beginPath();
    context.arc(
      this.impactPosition.x,
      this.impactPosition.y,
      9,
      0,
      Math.PI * 2
    );

    context.fill();

    context.restore();
  }

  drawStarShape(context, x, y, outerRadius, innerRadius) {
    const spikes = 5;
    const step = Math.PI / spikes;

    context.beginPath();

    for (let i = 0; i < spikes * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;

      const angle = i * step - Math.PI / 2;

      const pointX = x + Math.cos(angle) * radius;
      const pointY = y + Math.sin(angle) * radius;

      if (i === 0) {
        context.moveTo(pointX, pointY);
      } else {
        context.lineTo(pointX, pointY);
      }
    }

    context.closePath();
  }

  restorePositions() {
    this.attacker.position.x = this.originalAttackerPosition.x;
    this.attacker.position.y = this.originalAttackerPosition.y;

    this.target.position.x = this.originalTargetPosition.x;
    this.target.position.y = this.originalTargetPosition.y;
  }

  easeOutCubic(value) {
    return 1 - Math.pow(1 - value, 3);
  }
}
