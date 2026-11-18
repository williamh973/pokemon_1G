export class ScratchAnimation {
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

    this.direction =
      this.originalAttackerPosition.x < this.originalTargetPosition.x ? 1 : -1;

    this.phase = "PREPARE";
    this.timer = 0;

    this.phaseDuration = {
      PREPARE: 8,
      APPROACH: 20,
      SLASH: 20,
      IMPACT: 10,
      FINISH: 8,
      RETURN: 9,
    };

    this.attackerStartX = this.originalAttackerPosition.x;
    this.attackerTargetX =
      this.originalAttackerPosition.x + this.direction * 12;

    this.slashes = [];
    this.particles = [];

    this.flashAlpha = 0;
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
    if (!this.hasCreatedSlashes) {
      this.createSlashes();
      this.hasCreatedSlashes = true;
    }

    if (this.timer >= this.phaseDuration.SLASH) {
      this.createImpact();
      this.changePhase("IMPACT");
    }
  }

  createSlashes() {
    const baseAngle = -Math.PI / 4;

    for (let i = 0; i < 3; i++) {
      this.slashes.push({
        x: this.targetCenter.x,
        y: this.targetCenter.y,
        length: 48,
        angle: baseAngle,
        offset: (i - 1) * 10,
        progress: 0,
        life: 2,
        decay: 0.12,
        width: 4,
      });
    }
  }

  createImpact() {
    this.flashAlpha = 0.8;

    if (this.game.canvas?.startShake) {
      this.game.canvas.startShake(500, 5);
    }

    for (let i = 0; i < 12; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 3;

      this.particles.push({
        x: this.targetCenter.x,
        y: this.targetCenter.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 1 + Math.random() * 2,
        life: 1,
        decay: 0.08 + Math.random() * 0.04,
      });
    }
  }

  updateImpact() {
    if (this.timer >= this.phaseDuration.IMPACT) {
      this.changePhase("FINISH");
    }
  }

  updateFinish() {
    this.flashAlpha = Math.max(0, this.flashAlpha - 0.12);

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
    this.slashes = this.slashes.filter((slash) => {
      slash.progress = Math.min(1, slash.progress + 0.35);
      slash.life -= slash.decay;

      return slash.life > 0;
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

    this.drawSlashes(context);
    this.drawParticles(context);
    this.drawFlash(context);
  }

  drawSlashes(context) {
    context.save();

    for (const slash of this.slashes) {
      const length = slash.length * slash.progress;

      context.save();
      context.globalAlpha = slash.life;
      context.translate(slash.x, slash.y);
      context.rotate(slash.angle);

      this.drawClawMark(context, slash.offset, length, slash.width);

      context.restore();
    }

    context.restore();
  }

  drawClawMark(context, offset, length, width) {
    const halfLength = length / 2;

    context.save();
    context.translate(0, offset);

    // Contour blanc de la griffure
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

    context.fillStyle = "#EBEBEB";
    context.fill();

    // Trace rouge au centre
    context.beginPath();
    context.moveTo(-halfLength + 2, -width * 0.35);
    context.quadraticCurveTo(0, -width * 0.9, halfLength - 3, 0);
    context.quadraticCurveTo(0, width * 0.65, -halfLength + 2, width * 0.35);
    context.closePath();

    context.fillStyle = "#E30202";
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

  drawFlash(context) {
    if (this.flashAlpha <= 0) return;

    context.save();

    context.globalAlpha = this.flashAlpha;
    context.fillStyle = "#FFF3C0";

    context.beginPath();
    context.arc(this.targetCenter.x, this.targetCenter.y, 9, 0, Math.PI * 2);

    context.fill();
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
