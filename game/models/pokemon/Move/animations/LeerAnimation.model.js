export class LeerAnimation {
  static PHASES = {
    PREPARE: "PREPARE",
    STARE: "STARE",
    INTIMIDATE: "INTIMIDATE",
    FADE: "FADE",
    FINISH: "FINISH",
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

    this.phase = LeerAnimation.PHASES.PREPARE;
    this.timer = 0;
    this.isFinished = false;

    this.phaseDuration = {
      PREPARE: 12,
      STARE: 18,
      INTIMIDATE: 24,
      FADE: 18,
      FINISH: 8,
    };

    this.beams = [];
    this.particles = [];

    this.eyeGlow = 0;
    this.targetAura = 0;
    this.flashProgress = 0;

    this.origin = {
      x: this.target.position.x,
      y: this.target.position.y,
    };
  }

  update(context) {
    if (this.isFinished) return;

    this.timer++;

    switch (this.phase) {
      case LeerAnimation.PHASES.PREPARE:
        this.updatePrepare();
        break;

      case LeerAnimation.PHASES.STARE:
        this.updateStare();
        break;

      case LeerAnimation.PHASES.INTIMIDATE:
        this.updateIntimidate();
        break;

      case LeerAnimation.PHASES.FADE:
        this.updateFade();
        break;

      case LeerAnimation.PHASES.FINISH:
        this.updateFinish();
        break;
    }

    this.updateParticles();
    this.draw(context);
  }

  changePhase(phase) {
    this.phase = phase;
    this.timer = 0;
  }

  easeIn(value) {
    return value * value;
  }

  easeOut(value) {
    return 1 - Math.pow(1 - value, 3);
  }

  updatePrepare() {
    const progress = Math.min(1, this.timer / this.phaseDuration.PREPARE);

    this.eyeGlow = this.easeOut(progress);

    if (this.timer >= this.phaseDuration.PREPARE) {
      this.changePhase(LeerAnimation.PHASES.STARE);
    }
  }

  updateStare() {
    this.eyeGlow = 1;

    if (this.timer === 5) {
      this.createEyeBeams();
    }

    if (this.timer >= this.phaseDuration.STARE) {
      this.changePhase(LeerAnimation.PHASES.INTIMIDATE);
    }
  }

  updateIntimidate() {
    const progress = Math.min(1, this.timer / this.phaseDuration.INTIMIDATE);

    this.targetAura = Math.sin(progress * Math.PI) * 1;
    this.flashProgress = progress;

    if (this.timer % 3 === 0) {
      this.createIntimidationParticles();
    }

    if (this.timer >= this.phaseDuration.INTIMIDATE) {
      this.changePhase(LeerAnimation.PHASES.FADE);
    }
  }

  updateFade() {
    const progress = Math.min(1, this.timer / this.phaseDuration.FADE);

    this.eyeGlow = 1 - this.easeOut(progress);
    this.targetAura = 1 - this.easeOut(progress);

    if (this.timer >= this.phaseDuration.FADE) {
      this.changePhase(LeerAnimation.PHASES.FINISH);
    }
  }

  updateFinish() {
    if (this.timer >= this.phaseDuration.FINISH) {
      this.isFinished = true;
    }
  }

  createEyeBeams() {
    const attackerX = this.attacker.position.x + this.attacker.frameWidth / 2;

    const attackerY =
      this.attacker.position.y + this.attacker.frameHeight * 0.3;

    const targetX = this.target.position.x + this.target.frameWidth / 2;

    const targetY = this.target.position.y + this.target.frameHeight * 0.35;

    for (let i = 0; i < 2; i++) {
      this.beams.push({
        startX: attackerX,
        startY: attackerY + (i === 0 ? -3 : 3),
        endX: targetX,
        endY: targetY + (i === 0 ? -5 : 5),
        life: 20,
        maxLife: 20,
        width: 2 + i,
      });
    }
  }

  createIntimidationParticles() {
    const x = this.target.position.x + this.target.frameWidth / 2;

    const y = this.target.position.y + this.target.frameHeight / 2;

    const angle = Math.random() * Math.PI * 2;
    const distance = 20 + Math.random() * 15;

    this.particles.push({
      x: x + Math.cos(angle) * distance,
      y: y + Math.sin(angle) * distance,
      vx: -Math.cos(angle) * 0.7,
      vy: -Math.sin(angle) * 0.7,
      size: 2 + Math.random() * 2,
      life: 18,
      maxLife: 18,
    });
  }

  updateParticles() {
    this.beams.forEach((beam) => {
      beam.life--;
    });

    this.beams = this.beams.filter((beam) => beam.life > 0);

    this.particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      particle.life--;
    });

    this.particles = this.particles.filter((particle) => particle.life > 0);
  }

  draw(context) {
    context.save();

    this.drawParticles(context);
    this.drawBeams(context);
    this.drawEyeGlow(context);
    this.drawTargetAura(context);

    context.restore();
  }

  drawEyeGlow(context) {
    if (this.eyeGlow <= 0) return;

    const x = this.attacker.position.x + this.attacker.frameWidth / 2;

    const y = this.attacker.position.y + this.attacker.frameHeight * 0.3;

    context.save();
    context.globalAlpha = this.eyeGlow;

    const gradient = context.createRadialGradient(x, y, 1, x, y, 19);

    gradient.addColorStop(0, "rgba(255,255,255,0.95)");
    gradient.addColorStop(0.25, "rgba(255,30,30,0.9)");
    gradient.addColorStop(0.6, "rgba(200,0,0,0.45)");
    gradient.addColorStop(1, "rgba(150,0,0,0)");

    context.fillStyle = gradient;
    context.beginPath();
    context.arc(x, y, 19, 0, Math.PI * 2);
    context.fill();

    // Deux points lumineux pour représenter les yeux.
    context.fillStyle = "#ff2929";

    for (let i = 0; i < 2; i++) {
      context.beginPath();
      context.arc(x + (i === 0 ? -4 : 4), y, 2, 0, Math.PI * 2);
      context.fill();
    }

    context.restore();
  }

  drawBeams(context) {
    context.save();

    this.beams.forEach((beam) => {
      const alpha = beam.life / beam.maxLife;

      context.globalAlpha = alpha;

      // Aura du faisceau.
      context.strokeStyle = "rgba(255,0,0,0.35)";
      context.lineWidth = beam.width * 4;

      context.beginPath();
      context.moveTo(beam.startX, beam.startY);
      context.lineTo(beam.endX, beam.endY);
      context.stroke();

      // Faisceau central.
      context.strokeStyle = "#ff3636";
      context.lineWidth = beam.width;

      context.beginPath();
      context.moveTo(beam.startX, beam.startY);
      context.lineTo(beam.endX, beam.endY);
      context.stroke();

      // Reflet blanc.
      context.strokeStyle = "rgba(255,255,255,0.8)";
      context.lineWidth = 1;

      context.beginPath();
      context.moveTo(beam.startX, beam.startY);
      context.lineTo(beam.endX, beam.endY);
      context.stroke();
    });

    context.restore();
  }

  drawTargetAura(context) {
    if (this.targetAura <= 0) return;

    const x = this.target.position.x + this.target.frameWidth / 2;

    const y = this.target.position.y + this.target.frameHeight / 2;

    const radius =
      Math.max(this.target.frameWidth, this.target.frameHeight) * 0.8;

    context.save();
    context.globalAlpha = this.targetAura * 0.55;

    const gradient = context.createRadialGradient(x, y, 2, x, y, radius);

    gradient.addColorStop(0, "rgba(255,0,0,0)");
    gradient.addColorStop(0.55, "rgba(180,0,0,0.18)");
    gradient.addColorStop(1, "rgba(255,0,0,0.7)");

    context.fillStyle = gradient;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }

  drawParticles(context) {
    context.save();

    this.particles.forEach((particle) => {
      context.globalAlpha = particle.life / particle.maxLife;
      context.fillStyle = "#ff4444";

      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fill();
    });

    context.restore();
  }
}
