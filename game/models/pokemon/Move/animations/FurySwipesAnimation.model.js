export class FurySwipesAnimation {
  constructor(game, viewers, turnAction) {
    this.game = game;
    this.turnAction = turnAction;

    // Identification de l'attaquant et de la cible
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

    this.targetCenter = {
      x: this.originalTargetPosition.x + this.targetWidth / 2,
      y: this.originalTargetPosition.y + this.targetHeight / 2,
    };

    // Nombre de coups
    this.hitCount = Number.isInteger(turnAction.hitCount)
      ? Math.max(2, Math.min(5, turnAction.hitCount))
      : Math.floor(Math.random() * 4) + 2;

    // Direction de l'attaque
    this.direction =
      this.originalAttackerPosition.x < this.originalTargetPosition.x ? 1 : -1;

    // Phases
    this.phase = "PREPARE";
    this.timer = 0;

    this.phaseDuration = {
      PREPARE: 10,
      APPROACH: 8,
      SLASH: 20,
      IMPACT: 5,
      FINISH: 15,
      RETURN: 10,
    };

    this.hitIndex = 0;
    this.slashProgress = 0;

    this.slashMarks = [];
    this.particles = [];

    this.flashAlpha = 0;

    this.attackerStartX = this.originalAttackerPosition.x;
    this.attackerTargetX =
      this.originalAttackerPosition.x + this.direction * 10;

    this.targetShakeOffset = 0;

    this.isFinished = false;
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

      case "SLASH":
        this.updateSlash();
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

    this.updateEffects();
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
      this.changePhase("SLASH");
    }
  }

  updateSlash() {
    const progress = Math.min(1, this.timer / this.phaseDuration.SLASH);

    this.slashProgress = progress;

    // Chaque coup génère trois griffures
    if (progress >= 0.75 && !this.hasCreatedSlash) {
      this.createSlash();
      this.hasCreatedSlash = true;
    }

    if (progress >= 1) {
      this.createImpact();
      this.changePhase("IMPACT");
    }
  }

  createSlash() {
    const isFinalHit = this.hitIndex === this.hitCount - 1;

    const slashDirection = this.hitIndex % 2 === 0 ? 1 : -1;

    this.slashMarks.push({
      x: this.targetCenter.x,
      y: this.targetCenter.y,
      length: isFinalHit ? 58 : 46,
      angle: slashDirection * (Math.PI / 4),
      progress: 0,
      life: 1,
      decay: 0.09,
      width: isFinalHit ? 5 : 4,
    });
  }

  createImpact() {
    const isFinalHit = this.hitIndex === this.hitCount - 1;

    this.flashAlpha = isFinalHit ? 0.9 : 0.55;

    if (this.game.canvas?.startShake) {
      this.game.canvas.startShake(isFinalHit ? 5 : 2, isFinalHit ? 180 : 80);
    }

    const particleCount = isFinalHit ? 15 : 8;

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 3;

      this.particles.push({
        x: this.targetCenter.x,
        y: this.targetCenter.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 1 + Math.random() * 2.5,
        life: 1,
        decay: 0.07 + Math.random() * 0.04,
      });
    }
  }

  updateImpact() {
    if (this.timer >= this.phaseDuration.IMPACT) {
      this.hitIndex++;

      if (this.hitIndex < this.hitCount) {
        this.hasCreatedSlash = false;
        this.changePhase("SLASH");
      } else {
        this.changePhase("FINISH");
      }
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

    this.attacker.position.x =
      this.attackerTargetX +
      (this.originalAttackerPosition.x - this.attackerTargetX) * eased;

    if (progress >= 1) {
      this.restorePositions();
      this.isFinished = true;
    }
  }

  updateEffects() {
    this.slashMarks = this.slashMarks.filter((slash) => {
      slash.progress = Math.min(1, slash.progress + 0.25);
      slash.life -= slash.decay;

      return slash.life > 0;
    });

    this.particles = this.particles.filter((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      particle.vx *= 0.93;
      particle.vy *= 0.93;

      particle.life -= particle.decay;

      return particle.life > 0;
    });
  }

  draw(context) {
    if (!context) return;

    this.drawSlashes(context);
    this.drawParticles(context);
  }

  drawSlashes(context) {
    context.save();

    for (const slash of this.slashMarks) {
      const progress = slash.progress;
      const length = slash.length * progress;

      context.globalAlpha = slash.life;

      context.translate(slash.x, slash.y);
      context.rotate(slash.angle);

      const clawCount = 3;
      const spacing = 10;

      for (let i = 0; i < clawCount; i++) {
        const offset = (i - 1) * spacing;

        this.drawClawMark(context, offset, length, slash.width);
      }

      context.restore();
      context.save();
    }

    context.restore();
  }

  drawClawMark(context, offset, length, width) {
    const halfLength = length / 2;

    context.save();
    context.translate(0, offset);

    // Contour clair de la griffure
    context.beginPath();
    context.moveTo(-halfLength, -width);
    context.quadraticCurveTo(0, -width * 1.8, halfLength, -width * 0.25);
    context.quadraticCurveTo(
      halfLength - 3,
      width * 0.2,
      halfLength - 7,
      width * 0.5
    );
    context.quadraticCurveTo(0, width * 1.5, -halfLength, width);
    context.closePath();

    context.fillStyle = "#ebebeb";
    context.fill();

    // Intérieur lumineux
    context.beginPath();
    context.moveTo(-halfLength + 2, -width * 0.35);
    context.quadraticCurveTo(0, -width * 0.9, halfLength - 3, 0);
    context.quadraticCurveTo(0, width * 0.65, -halfLength + 2, width * 0.35);
    context.closePath();

    context.fillStyle = "#e30202";
    context.fill();

    context.restore();
  }

  drawParticles(context) {
    context.save();

    for (const particle of this.particles) {
      context.globalAlpha = particle.life;
      context.fillStyle = "#FFD477";

      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);

      context.fill();
    }

    context.restore();
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
