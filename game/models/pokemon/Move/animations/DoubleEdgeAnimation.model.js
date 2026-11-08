export class DoubleEdgeAnimation {
  static PHASES = {
    PREPARE: "PREPARE",
    DASH: "DASH",
    IMPACT: "IMPACT",
    RECOIL: "RECOIL",
    SELF_IMPACT: "SELF_IMPACT",
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

    this.originalX = this.attacker.position.x;
    this.originalY = this.attacker.position.y;

    this.targetOriginalX = this.target.position.x;
    this.targetOriginalY = this.target.position.y;

    this.direction =
      this.target.position.x >= this.attacker.position.x ? 1 : -1;

    const distance = Math.abs(
      this.target.position.x - this.attacker.position.x
    );

    this.dashDistance = Math.min(58, distance * 0.55);

    this.phase = DoubleEdgeAnimation.PHASES.PREPARE;
    this.timer = 0;
    this.isFinished = false;

    this.phaseDuration = {
      PREPARE: 12,
      DASH: 8,
      IMPACT: 15,
      RECOIL: 12,
      SELF_IMPACT: 16,
      FINISH: 8,
    };

    this.particles = [];
    this.speedLines = [];
    this.shockwaves = [];

    this.impactProgress = 0;
    this.selfImpactProgress = 0;

    this.attackerOriginalX = this.originalX;
    this.attackerOriginalY = this.originalY;

    this.shakeTriggered = false;
  }

  update(context) {
    if (this.isFinished) return;

    this.timer++;

    switch (this.phase) {
      case DoubleEdgeAnimation.PHASES.PREPARE:
        this.updatePrepare();
        break;

      case DoubleEdgeAnimation.PHASES.DASH:
        this.updateDash();
        break;

      case DoubleEdgeAnimation.PHASES.IMPACT:
        this.updateImpact();
        break;

      case DoubleEdgeAnimation.PHASES.RECOIL:
        this.updateRecoil();
        break;

      case DoubleEdgeAnimation.PHASES.SELF_IMPACT:
        this.updateSelfImpact();
        break;

      case DoubleEdgeAnimation.PHASES.FINISH:
        this.updateFinish();
        break;
    }

    this.updateParticles();
    this.updateShockwaves();

    this.draw(context);
  }

  changePhase(phase) {
    this.phase = phase;
    this.timer = 0;
  }

  easeIn(value) {
    return value * value * value;
  }

  easeOut(value) {
    return 1 - Math.pow(1 - value, 3);
  }

  updatePrepare() {
    const progress = Math.min(1, this.timer / this.phaseDuration.PREPARE);

    // Le Pokémon rassemble toute sa puissance.
    this.attacker.position.x = this.originalX - this.direction * progress * 7;

    this.attacker.position.y = this.originalY + progress * 5;

    if (this.timer % 3 === 0) {
      this.createChargeParticles();
    }

    if (this.timer >= this.phaseDuration.PREPARE) {
      this.changePhase(DoubleEdgeAnimation.PHASES.DASH);
    }
  }

  updateDash() {
    const progress = Math.min(1, this.timer / this.phaseDuration.DASH);

    const eased = this.easeIn(progress);

    this.attacker.position.x =
      this.originalX + this.direction * this.dashDistance * eased;

    this.attacker.position.y =
      this.originalY + Math.sin(progress * Math.PI) * 3;

    this.createDashEffects();

    if (this.timer >= this.phaseDuration.DASH) {
      this.attacker.position.x =
        this.originalX + this.direction * this.dashDistance;

      this.createImpactParticles();
      this.createShockwave();

      this.game.canvas.startShake(16, 7);

      this.changePhase(DoubleEdgeAnimation.PHASES.IMPACT);
    }
  }

  updateImpact() {
    const progress = Math.min(1, this.timer / this.phaseDuration.IMPACT);

    this.impactProgress = progress;

    // La cible est violemment repoussée.
    const knockback = this.easeOut(progress) * 13;

    this.target.position.x = this.targetOriginalX + this.direction * knockback;

    this.target.position.y =
      this.targetOriginalY - Math.sin(progress * Math.PI) * 5;

    if (this.timer >= this.phaseDuration.IMPACT) {
      this.changePhase(DoubleEdgeAnimation.PHASES.RECOIL);
    }
  }

  updateRecoil() {
    const progress = Math.min(1, this.timer / this.phaseDuration.RECOIL);

    const eased = this.easeOut(progress);

    // L'attaquant est repoussé par la violence de la collision.
    this.attacker.position.x =
      this.originalX + this.direction * (this.dashDistance - eased * 22);

    this.attacker.position.y =
      this.originalY + Math.sin(progress * Math.PI) * 8;

    this.target.position.x =
      this.targetOriginalX + this.direction * (1 - eased) * 13;

    if (this.timer >= this.phaseDuration.RECOIL) {
      this.target.position.x = this.targetOriginalX;
      this.target.position.y = this.targetOriginalY;

      this.attacker.position.x =
        this.originalX + this.direction * (this.dashDistance - 22);

      this.attacker.position.y = this.originalY;

      this.createSelfImpactParticles();

      this.game.canvas.startShake(8, 3);

      this.changePhase(DoubleEdgeAnimation.PHASES.SELF_IMPACT);
    }
  }

  updateSelfImpact() {
    const progress = Math.min(1, this.timer / this.phaseDuration.SELF_IMPACT);

    this.selfImpactProgress = progress;

    // L'attaquant subit le contrecoup.
    const recoil = Math.sin(progress * Math.PI) * 9;

    this.attacker.position.x =
      this.originalX + this.direction * (this.dashDistance - 22 - recoil);

    this.attacker.position.y =
      this.originalY + Math.sin(progress * Math.PI) * 6;

    if (this.timer === 3) {
      this.game.canvas.startShake(8, 3);
    }

    if (this.timer >= this.phaseDuration.SELF_IMPACT) {
      this.attacker.position.x = this.originalX;
      this.attacker.position.y = this.originalY;

      this.changePhase(DoubleEdgeAnimation.PHASES.FINISH);
    }
  }

  updateFinish() {
    if (this.timer >= this.phaseDuration.FINISH) {
      this.restorePositions();
      this.isFinished = true;
    }
  }

  restorePositions() {
    this.attacker.position.x = this.originalX;
    this.attacker.position.y = this.originalY;

    this.target.position.x = this.targetOriginalX;
    this.target.position.y = this.targetOriginalY;
  }

  createChargeParticles() {
    const x = this.attacker.position.x + this.attacker.frameWidth / 2;
    const y = this.attacker.position.y + this.attacker.frameHeight / 2;

    for (let i = 0; i < 3; i++) {
      this.particles.push({
        x: x - this.direction * (8 + Math.random() * 12),
        y: y + (Math.random() - 0.5) * 20,
        vx: -this.direction * (0.5 + Math.random() * 1.5),
        vy: (Math.random() - 0.5) * 1.5,
        size: 2 + Math.random() * 2,
        life: 12,
        maxLife: 12,
        color: "#f5d99a",
      });
    }
  }

  createDashEffects() {
    const x = this.attacker.position.x + this.attacker.frameWidth / 2;
    const y = this.attacker.position.y + this.attacker.frameHeight / 2;

    for (let i = 0; i < 4; i++) {
      this.speedLines.push({
        x: x - this.direction * (10 + Math.random() * 25),
        y: y + (Math.random() - 0.5) * 30,
        length: 12 + Math.random() * 22,
        life: 7,
        maxLife: 7,
      });
    }

    if (this.timer % 2 === 0) {
      this.particles.push({
        x: x - this.direction * 10,
        y: y + this.attacker.frameHeight / 3,
        vx: -this.direction * (1 + Math.random() * 2),
        vy: (Math.random() - 0.5) * 2,
        size: 2 + Math.random() * 3,
        life: 12,
        maxLife: 12,
        color: "#e8d2a7",
      });
    }
  }

  createImpactParticles() {
    const x = this.target.position.x + this.target.frameWidth / 2;
    const y = this.target.position.y + this.target.frameHeight / 2;

    for (let i = 0; i < 45; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 5;

      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 4,
        life: 20 + Math.random() * 10,
        maxLife: 30,
        color: ["#ffffff", "#fff0c4", "#ffd36c", "#e99b3d", "#a85d29"][i % 5],
      });
    }
  }

  createSelfImpactParticles() {
    const x = this.attacker.position.x + this.attacker.frameWidth / 2;
    const y = this.attacker.position.y + this.attacker.frameHeight / 2;

    for (let i = 0; i < 22; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 3;

      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 3,
        life: 16,
        maxLife: 16,
        color: ["#ffffff", "#ffe3a0", "#d99b4d"][i % 3],
      });
    }
  }

  createShockwave() {
    this.shockwaves.push({
      x: this.target.position.x + this.target.frameWidth / 2,
      y: this.target.position.y + this.target.frameHeight / 2,
      radius: 5,
      maxRadius: 48,
      life: 18,
      maxLife: 18,
    });
  }

  updateParticles() {
    this.particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      particle.vx *= 0.95;
      particle.vy *= 0.95;

      particle.life--;
    });

    this.particles = this.particles.filter((particle) => particle.life > 0);

    this.speedLines.forEach((line) => {
      line.x -= this.direction * 4;
      line.life--;
    });

    this.speedLines = this.speedLines.filter((line) => line.life > 0);
  }

  updateShockwaves() {
    this.shockwaves.forEach((wave) => {
      const progress = 1 - wave.life / wave.maxLife;

      wave.radius = wave.maxRadius * progress;
      wave.life--;
    });

    this.shockwaves = this.shockwaves.filter((wave) => wave.life > 0);
  }

  draw(context) {
    context.save();

    this.drawShockwaves(context);
    this.drawSpeedLines(context);
    this.drawParticles(context);

    if (this.phase === DoubleEdgeAnimation.PHASES.IMPACT) {
      this.drawImpact(context);
    }

    if (this.phase === DoubleEdgeAnimation.PHASES.SELF_IMPACT) {
      this.drawSelfImpact(context);
    }

    context.restore();
  }

  drawSpeedLines(context) {
    context.save();

    this.speedLines.forEach((line) => {
      context.globalAlpha = line.life / line.maxLife;
      context.strokeStyle = "#fff0cf";
      context.lineWidth = 2;

      context.beginPath();
      context.moveTo(line.x, line.y);
      context.lineTo(line.x - this.direction * line.length, line.y);
      context.stroke();
    });

    context.restore();
  }

  drawParticles(context) {
    context.save();

    this.particles.forEach((particle) => {
      context.globalAlpha = particle.life / particle.maxLife;
      context.fillStyle = particle.color;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fill();
    });

    context.restore();
  }

  drawShockwaves(context) {
    context.save();

    this.shockwaves.forEach((wave) => {
      const alpha = wave.life / wave.maxLife;

      context.globalAlpha = alpha;
      context.strokeStyle = "#fff0c4";
      context.lineWidth = 3 * alpha + 0.5;

      context.beginPath();
      context.ellipse(
        wave.x,
        wave.y,
        wave.radius,
        wave.radius * 0.55,
        0,
        0,
        Math.PI * 2
      );
      context.stroke();
    });

    context.restore();
  }

  drawImpact(context) {
    const x = this.target.position.x + this.target.frameWidth / 2;
    const y = this.target.position.y + this.target.frameHeight / 2;

    const progress = this.impactProgress;
    const alpha = 1 - progress;

    context.save();

    // Flash lumineux de la collision.
    const radius = 12 + progress * 40;

    const gradient = context.createRadialGradient(x, y, 0, x, y, radius);

    gradient.addColorStop(0, `rgba(255,255,255,${alpha})`);
    gradient.addColorStop(0.3, `rgba(255,235,180,${alpha})`);
    gradient.addColorStop(0.7, `rgba(255,170,65,${alpha * 0.7})`);
    gradient.addColorStop(1, "rgba(255,120,30,0)");

    context.fillStyle = gradient;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();

    // Éclats radiaux.
    context.strokeStyle = `rgba(255,245,215,${alpha})`;
    context.lineWidth = 3;

    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 * i) / 12;
      const inner = 12 + progress * 12;
      const outer = 24 + progress * 35;

      context.beginPath();
      context.moveTo(x + Math.cos(angle) * inner, y + Math.sin(angle) * inner);
      context.lineTo(x + Math.cos(angle) * outer, y + Math.sin(angle) * outer);
      context.stroke();
    }

    context.restore();
  }

  drawSelfImpact(context) {
    const x = this.attacker.position.x + this.attacker.frameWidth / 2;
    const y = this.attacker.position.y + this.attacker.frameHeight / 2;

    const progress = this.selfImpactProgress;
    const alpha = 1 - progress;

    context.save();

    const radius = 6 + progress * 24;

    const gradient = context.createRadialGradient(x, y, 0, x, y, radius);

    gradient.addColorStop(0, `rgba(255,255,255,${alpha})`);
    gradient.addColorStop(0.45, `rgba(255,210,140,${alpha * 0.8})`);
    gradient.addColorStop(1, "rgba(255,150,50,0)");

    context.fillStyle = gradient;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }
}
