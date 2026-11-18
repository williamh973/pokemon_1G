export class FuryAttackAnimation {
  static PHASES = {
    PREPARE: "PREPARE",
    DASH: "DASH",
    COMBO: "COMBO",
    FINAL_HIT: "FINAL_HIT",
    RETURN: "RETURN",
  };

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

    this.originalX = this.attacker.position.x;
    this.originalY = this.attacker.position.y;

    this.originalTargetX = this.target.position.x;
    this.originalTargetY = this.target.position.y;

    this.direction =
      this.target.position.x >= this.attacker.position.x ? 1 : -1;

    this.phase = FuryAttackAnimation.PHASES.PREPARE;
    this.timer = 0;
    this.isFinished = false;

    // Nombre de coups fourni par le système de combat si disponible.
    this.hitCount = Number.isInteger(turnAction.hitCount)
      ? Math.max(2, Math.min(5, turnAction.hitCount))
      : 4;

    this.hitInterval = 6;

    this.passDuration = 12;

    this.phaseDuration = {
      PREPARE: 9,
      DASH: this.passDuration,
      COMBO: (this.hitCount - 1) * this.passDuration,
      FINAL_HIT: 12,
      RETURN: 10,
    };

    this.canvasWidth = 320;
    this.spriteWidth = this.attacker.frameWidth * (this.attacker.scale || 1);

    this.passProgress = 0;
    this.passCount = 0;
    this.hasHitTarget = false;
    this.passStartX = 0;
    this.passEndX = 0;
    this.passDirection = this.direction;

    this.comboHit = 0;
    this.lastHit = 0;

    this.dashDistance = 0;
    this.dashTargetX = 0;
    this.dashTargetY = 0;

    this.targetShake = 0;
    this.impactFlash = 0;
    this.finalFlash = 0;

    this.afterimages = [];
    this.slashes = [];
    this.particles = [];

    this.shakeTriggered = false;

    this.calculateDashPosition();
  }

  preparePass() {
    this.passProgress = 0;
    this.hasHitTarget = false;

    // La traversée commence juste hors du canvas.
    this.passStartX =
      this.passDirection === 1 ? -this.spriteWidth : this.canvasWidth;

    // Elle se termine hors du côté opposé.
    this.passEndX =
      this.passDirection === 1 ? this.canvasWidth : -this.spriteWidth;

    this.attacker.position.x = this.passStartX;
    this.attacker.position.y = this.originalY;
  }

  // --------------------------------------------------
  // INITIALIZATION
  // --------------------------------------------------

  calculateDashPosition() {
    const attackerScale = this.attacker.scale || 1;
    const targetScale = this.target.scale || 1;

    const attackerWidth = this.attacker.frameWidth * attackerScale;
    const targetWidth = this.target.frameWidth * targetScale;

    const attackerCenter = this.originalX + attackerWidth / 2;

    const targetCenter = this.originalTargetX + targetWidth / 2;

    const distance = Math.abs(targetCenter - attackerCenter);

    this.dashDistance = Math.min(28, Math.max(10, distance - 20));

    this.dashTargetX = this.originalX + this.direction * this.dashDistance;

    this.dashTargetY = this.originalY - 2;
  }

  // --------------------------------------------------
  // UPDATE
  // --------------------------------------------------

  update(context) {
    if (this.isFinished) return;

    this.canvasWidth = context.canvas.width;

    this.timer++;

    switch (this.phase) {
      case FuryAttackAnimation.PHASES.PREPARE:
        this.updatePrepare();
        break;

      case FuryAttackAnimation.PHASES.DASH:
        this.updateDash();
        break;

      case FuryAttackAnimation.PHASES.COMBO:
        this.updateCombo();
        break;

      case FuryAttackAnimation.PHASES.FINAL_HIT:
        this.updateFinalHit();
        break;

      case FuryAttackAnimation.PHASES.RETURN:
        this.updateReturn();
        break;
    }

    this.updateAfterimages();
    this.updateSlashes();
    this.updateParticles();

    this.draw(context);
  }

  changePhase(phase) {
    this.phase = phase;
    this.timer = 0;
  }

  clamp(value) {
    return Math.max(0, Math.min(1, value));
  }

  easeOut(value) {
    return 1 - Math.pow(1 - value, 3);
  }

  easeIn(value) {
    return value * value * value;
  }

  easeInOut(value) {
    return value < 0.5
      ? 4 * value * value * value
      : 1 - Math.pow(-2 * value + 2, 3) / 2;
  }

  // --------------------------------------------------
  // PHASE: PREPARE
  // --------------------------------------------------

  updatePrepare() {
    const progress = this.clamp(this.timer / this.phaseDuration.PREPARE);

    // L'attaquant se prépare à bondir.
    this.attacker.position.x =
      this.originalX - this.direction * this.easeOut(progress) * 3;

    this.attacker.position.y =
      this.originalY + Math.sin(progress * Math.PI) * 2;

    if (this.timer % 3 === 0) {
      this.createEnergyParticles();
    }

    if (this.timer >= this.phaseDuration.PREPARE) {
      this.preparePass();
      this.changePhase(FuryAttackAnimation.PHASES.DASH);
    }
  }

  // --------------------------------------------------
  // PHASE: DASH
  // --------------------------------------------------

  updateDash() {
    const progress = this.clamp(this.timer / this.phaseDuration.DASH);

    this.passProgress = this.easeInOut(progress);

    this.attacker.position.x =
      this.passStartX + (this.passEndX - this.passStartX) * this.passProgress;

    this.attacker.position.y =
      this.originalY + Math.sin(progress * Math.PI * 2) * 2;

    this.createAfterimage();

    if (this.timer % 2 === 0) {
      this.createDashParticles();
    }

    this.checkTargetCrossing();

    if (this.timer >= this.phaseDuration.DASH) {
      this.attacker.position.x = this.passEndX;

      this.passCount = 1;

      if (this.hitCount > 1) {
        this.passDirection *= -1;
        this.preparePass();

        this.changePhase(FuryAttackAnimation.PHASES.COMBO);
      } else {
        this.changePhase(FuryAttackAnimation.PHASES.FINAL_HIT);
      }
    }
  }

  // --------------------------------------------------
  // PHASE: COMBO
  // --------------------------------------------------

  updateCombo() {
    const progress = this.clamp(this.timer / this.passDuration);

    this.passProgress = this.easeInOut(progress);

    this.attacker.position.x =
      this.passStartX + (this.passEndX - this.passStartX) * this.passProgress;

    this.attacker.position.y =
      this.originalY + Math.sin(progress * Math.PI * 2) * 2;

    this.createAfterimage();

    if (this.timer % 2 === 0) {
      this.createDashParticles();
    }

    this.checkTargetCrossing();

    if (this.timer >= this.passDuration) {
      this.passCount++;

      if (this.passCount < this.hitCount) {
        this.passDirection *= -1;
        this.preparePass();

        this.timer = 0;
      } else {
        this.changePhase(FuryAttackAnimation.PHASES.FINAL_HIT);
      }
    }
  }

  checkTargetCrossing() {
    if (this.hasHitTarget) return;

    const center = this.getTargetCenter();

    const attackerCenter = this.attacker.position.x + this.spriteWidth / 2;

    const crossed =
      this.passDirection === 1
        ? attackerCenter >= center.x
        : attackerCenter <= center.x;

    if (!crossed) return;

    this.hasHitTarget = true;

    this.comboHit = this.passCount + 1;

    this.createSlash(this.comboHit);
    this.createImpactParticles(this.comboHit);

    if (this.game.canvas.startShake) {
      this.game.canvas.startShake(5, 2);
    }
  }

  // --------------------------------------------------
  // PHASE: FINAL HIT
  // --------------------------------------------------

  updateFinalHit() {
    const progress = this.clamp(this.timer / this.phaseDuration.FINAL_HIT);

    if (this.timer === 1) {
      this.createFinalSlash();
      this.createFinalParticles();

      if (!this.shakeTriggered && this.game.canvas.startShake) {
        this.game.canvas.startShake(12, 5);
        this.shakeTriggered = true;
      }
    }

    this.finalFlash =
      progress < 0.2 ? 1 : 1 - this.easeOut((progress - 0.2) / 0.8);

    // Petit mouvement d'impact vers l'avant.
    const recoil = Math.sin(progress * Math.PI);

    this.attacker.position.x = this.dashTargetX + this.direction * recoil * 4;

    this.attacker.position.y = this.dashTargetY - recoil * 3;

    if (this.timer >= this.phaseDuration.FINAL_HIT) {
      this.finalFlash = 0;
      this.changePhase(FuryAttackAnimation.PHASES.RETURN);
    }
  }

  // --------------------------------------------------
  // PHASE: RETURN
  // --------------------------------------------------

  updateReturn() {
    const progress = this.clamp(this.timer / this.phaseDuration.RETURN);

    const eased = this.easeOut(progress);

    this.attacker.position.x =
      this.dashTargetX + (this.originalX - this.dashTargetX) * eased;

    this.attacker.position.y =
      this.dashTargetY + (this.originalY - this.dashTargetY) * eased;

    this.target.position.x = this.originalTargetX;
    this.target.position.y = this.originalTargetY;

    if (this.timer >= this.phaseDuration.RETURN) {
      this.attacker.position.x = this.originalX;
      this.attacker.position.y = this.originalY;

      this.target.position.x = this.originalTargetX;
      this.target.position.y = this.originalTargetY;

      this.isFinished = true;
    }
  }

  // --------------------------------------------------
  // TARGET POSITION
  // --------------------------------------------------

  getTargetCenter() {
    const scale = this.target.scale || 1;

    return {
      x: this.originalTargetX + (this.target.frameWidth * scale) / 2,
      y: this.originalTargetY + (this.target.frameHeight * scale) / 2,
    };
  }

  getTargetDimensions() {
    const scale = this.target.scale || 1;

    return {
      width: this.target.frameWidth * scale,
      height: this.target.frameHeight * scale,
    };
  }

  // --------------------------------------------------
  // AFTERIMAGES
  // --------------------------------------------------

  createAfterimage() {
    this.afterimages.push({
      x: this.attacker.position.x,
      y: this.attacker.position.y,
      alpha: 0.55,
      life: 8,
      maxLife: 8,
    });
  }

  updateAfterimages() {
    this.afterimages.forEach((image) => {
      image.life--;
      image.alpha = (image.life / image.maxLife) * 0.45;
    });

    this.afterimages = this.afterimages.filter((image) => image.life > 0);
  }

  // --------------------------------------------------
  // SLASHES
  // --------------------------------------------------

  createSlash(hit) {
    const center = this.getTargetCenter();
    const dimensions = this.getTargetDimensions();

    const angle = [-0.8, 0.8, -0.5, 0.5, -1.1][(hit - 1) % 5];

    this.slashes.push({
      x: center.x + (Math.random() - 0.5) * dimensions.width * 0.35,
      y: center.y + (Math.random() - 0.5) * dimensions.height * 0.35,
      angle,
      length: 22 + hit * 3,
      width: 3 + hit * 0.3,
      life: 9,
      maxLife: 9,
      color: hit % 2 === 0 ? "#fff3a5" : "#ffffff",
    });
  }

  createFinalSlash() {
    const center = this.getTargetCenter();
    const dimensions = this.getTargetDimensions();

    this.slashes.push({
      x: center.x,
      y: center.y,
      angle: -0.7,
      length: Math.max(55, dimensions.width * 1.4),
      width: 7,
      life: 14,
      maxLife: 14,
      color: "#ffffff",
      final: true,
    });

    this.slashes.push({
      x: center.x,
      y: center.y,
      angle: 0.7,
      length: Math.max(45, dimensions.width * 1.2),
      width: 4,
      life: 11,
      maxLife: 11,
      color: "#ffe36d",
      final: true,
    });
  }

  updateSlashes() {
    this.slashes.forEach((slash) => {
      slash.life--;
    });

    this.slashes = this.slashes.filter((slash) => slash.life > 0);
  }

  // --------------------------------------------------
  // PARTICLES
  // --------------------------------------------------

  createEnergyParticles() {
    const x =
      this.originalX +
      (this.attacker.frameWidth * (this.attacker.scale || 1)) / 2;

    const y =
      this.originalY +
      (this.attacker.frameHeight * (this.attacker.scale || 1)) / 2;

    this.particles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: 1 + Math.random() * 2,
      life: 15,
      maxLife: 15,
      color: "#ffe875",
    });
  }

  createDashParticles() {
    this.particles.push({
      x: this.attacker.position.x + Math.random() * 15,
      y: this.attacker.position.y + Math.random() * 15,
      vx: -this.direction * (1 + Math.random() * 2),
      vy: (Math.random() - 0.5) * 2,
      size: 1 + Math.random() * 2,
      life: 12,
      maxLife: 12,
      color: "#ffffff",
    });
  }

  createImpactParticles(hit) {
    const center = this.getTargetCenter();

    const count = hit === this.hitCount ? 10 : 6;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * (1.5 + hit * 0.4);

      this.particles.push({
        x: center.x,
        y: center.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 1 + Math.random() * 2,
        life: 12,
        maxLife: 12,
        color: i % 2 === 0 ? "#ffffff" : "#ffe36d",
      });
    }
  }

  createFinalParticles() {
    const center = this.getTargetCenter();

    for (let i = 0; i < 24; i++) {
      const angle = (Math.PI * 2 * i) / 24;
      const speed = 2 + Math.random() * 3;

      this.particles.push({
        x: center.x,
        y: center.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 1.5 + Math.random() * 2,
        life: 20,
        maxLife: 20,
        color: i % 2 === 0 ? "#ffffff" : "#ffe36d",
      });
    }
  }

  updateParticles() {
    this.particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      particle.vx *= 0.94;
      particle.vy *= 0.94;

      particle.life--;
    });

    this.particles = this.particles.filter((particle) => particle.life > 0);
  }

  // --------------------------------------------------
  // DRAW
  // --------------------------------------------------

  draw(context) {
    context.save();

    this.drawAfterimages(context);
    this.drawSpeedLines(context);
    this.drawSlashes(context);
    this.drawParticles(context);
    this.drawFinalFlash(context);

    context.restore();
  }

  // --------------------------------------------------
  // AFTERIMAGE RENDERING
  // --------------------------------------------------

  drawAfterimages(context) {
    const width = this.attacker.frameWidth * (this.attacker.scale || 1);

    const height = this.attacker.frameHeight * (this.attacker.scale || 1);

    this.afterimages.forEach((image) => {
      context.save();

      context.globalAlpha = image.alpha;

      context.fillStyle = "#ffe36d";
      context.shadowColor = "#ffffff";
      context.shadowBlur = 9;

      context.beginPath();
      context.ellipse(
        image.x + width / 2,
        image.y + height / 2,
        width * 0.35,
        height * 0.35,
        0,
        0,
        Math.PI * 2
      );

      context.fill();

      context.restore();
    });
  }

  // --------------------------------------------------
  // SPEED LINES
  // --------------------------------------------------

  drawSpeedLines(context) {
    if (
      this.phase !== FuryAttackAnimation.PHASES.DASH &&
      this.phase !== FuryAttackAnimation.PHASES.COMBO
    ) {
      return;
    }

    const center = this.getTargetCenter();
    const width = context.canvas.width;

    context.save();

    context.globalAlpha =
      this.phase === FuryAttackAnimation.PHASES.DASH ? 0.65 : 0.3;

    context.strokeStyle = "#fff2a6";
    context.lineWidth = 1.5;

    for (let i = 0; i < 7; i++) {
      const y = center.y - 35 + i * 12 + Math.sin(this.timer + i) * 3;

      const startX = this.direction === 1 ? 0 : width;

      const endX = this.direction === 1 ? center.x - 25 : center.x + 25;

      context.beginPath();
      context.moveTo(startX, y);
      context.lineTo(endX, y);
      context.stroke();
    }

    context.restore();
  }

  // --------------------------------------------------
  // SLASH RENDERING
  // --------------------------------------------------

  drawSlashes(context) {
    this.slashes.forEach((slash) => {
      const progress = 1 - slash.life / slash.maxLife;

      const alpha = 1 - progress;
      const length = slash.length * (0.65 + progress * 0.35);

      context.save();

      context.translate(slash.x, slash.y);
      context.rotate(slash.angle);

      context.globalAlpha = alpha;

      context.shadowColor = slash.color;
      context.shadowBlur = slash.final ? 14 : 7;

      // Traînée lumineuse.
      const gradient = context.createLinearGradient(
        -length / 2,
        0,
        length / 2,
        0
      );

      gradient.addColorStop(0, "rgba(255,255,255,0)");
      gradient.addColorStop(0.5, slash.color);
      gradient.addColorStop(1, "rgba(255,255,255,0)");

      context.strokeStyle = gradient;
      context.lineWidth = slash.width;
      context.lineCap = "round";

      context.beginPath();
      context.moveTo(-length / 2, 0);
      context.lineTo(length / 2, 0);
      context.stroke();

      // Trait central.
      context.shadowBlur = 0;
      context.strokeStyle = "#ffffff";
      context.lineWidth = 1;

      context.beginPath();
      context.moveTo(-length * 0.35, 0);
      context.lineTo(length * 0.35, 0);
      context.stroke();

      context.restore();
    });
  }

  // --------------------------------------------------
  // PARTICLE RENDERING
  // --------------------------------------------------

  drawParticles(context) {
    this.particles.forEach((particle) => {
      context.save();

      context.globalAlpha = particle.life / particle.maxLife;

      context.fillStyle = particle.color;
      context.shadowColor = particle.color;
      context.shadowBlur = 6;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);

      context.fill();

      context.restore();
    });
  }

  // --------------------------------------------------
  // FINAL FLASH
  // --------------------------------------------------

  drawFinalFlash(context) {
    if (this.finalFlash <= 0) return;

    const center = this.getTargetCenter();

    context.save();

    const gradient = context.createRadialGradient(
      center.x,
      center.y,
      2,
      center.x,
      center.y,
      65
    );

    gradient.addColorStop(0, `rgba(255,255,255,${this.finalFlash * 0.85})`);

    gradient.addColorStop(0.4, `rgba(255,220,100,${this.finalFlash * 0.4})`);

    gradient.addColorStop(1, "rgba(255,220,100,0)");

    context.fillStyle = gradient;

    context.beginPath();
    context.arc(center.x, center.y, 65, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }
}
