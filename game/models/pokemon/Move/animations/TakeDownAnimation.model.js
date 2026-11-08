export class TakeDownAnimation {
  static PHASES = {
    PREPARE: "PREPARE",
    CHARGE: "CHARGE",
    IMPACT: "IMPACT",
    RECOIL: "RECOIL",
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

    this.distance = Math.abs(this.target.position.x - this.attacker.position.x);

    this.chargeDistance = Math.min(48, this.distance * 0.45);

    this.phase = TakeDownAnimation.PHASES.PREPARE;
    this.timer = 0;
    this.isFinished = false;

    this.phaseDuration = {
      PREPARE: 12,
      CHARGE: 12,
      IMPACT: 12,
      RECOIL: 14,
      FINISH: 8,
    };

    this.particles = [];
    this.speedLines = [];
    this.impactProgress = 0;
    this.recoilProgress = 0;
    this.shakeTriggered = false;
  }

  update(context) {
    if (this.isFinished) return;

    this.timer++;

    switch (this.phase) {
      case TakeDownAnimation.PHASES.PREPARE:
        this.updatePrepare();
        break;

      case TakeDownAnimation.PHASES.CHARGE:
        this.updateCharge();
        break;

      case TakeDownAnimation.PHASES.IMPACT:
        this.updateImpact();
        break;

      case TakeDownAnimation.PHASES.RECOIL:
        this.updateRecoil();
        break;

      case TakeDownAnimation.PHASES.FINISH:
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
    return value * value * value;
  }

  easeOut(value) {
    return 1 - Math.pow(1 - value, 3);
  }

  updatePrepare() {
    const progress = Math.min(1, this.timer / this.phaseDuration.PREPARE);

    // Le Pokémon se tasse avant de charger.
    this.attacker.position.y =
      this.originalY + Math.sin((progress * Math.PI) / 2) * 5;

    this.attacker.position.x = this.originalX - this.direction * progress * 3;

    if (this.timer >= this.phaseDuration.PREPARE) {
      this.changePhase(TakeDownAnimation.PHASES.CHARGE);
    }
  }

  updateCharge() {
    const progress = Math.min(1, this.timer / this.phaseDuration.CHARGE);

    const eased = this.easeIn(progress);

    this.attacker.position.x =
      this.originalX + this.direction * this.chargeDistance * eased;

    this.attacker.position.y =
      this.originalY + Math.sin(progress * Math.PI) * 2;

    if (this.timer % 2 === 0) {
      this.createSpeedLines();
      this.createDustParticles();
    }

    if (this.timer >= this.phaseDuration.CHARGE) {
      this.attacker.position.x =
        this.originalX + this.direction * this.chargeDistance;

      this.createImpactParticles();
      this.game.canvas.startShake(12, 5);

      this.changePhase(TakeDownAnimation.PHASES.IMPACT);
    }
  }

  updateImpact() {
    const progress = Math.min(1, this.timer / this.phaseDuration.IMPACT);

    this.impactProgress = progress;

    // L'adversaire recule légèrement sous le choc.
    this.target.position.x =
      this.targetOriginalX + this.direction * this.easeOut(progress) * 8;

    if (this.timer >= this.phaseDuration.IMPACT) {
      this.changePhase(TakeDownAnimation.PHASES.RECOIL);
    }
  }

  updateRecoil() {
    const progress = Math.min(1, this.timer / this.phaseDuration.RECOIL);

    this.recoilProgress = progress;

    // Contrecoup : l'attaquant recule après la collision.
    const recoil = Math.sin(progress * Math.PI) * 13;

    this.attacker.position.x =
      this.originalX + this.direction * (this.chargeDistance - recoil);

    this.attacker.position.y =
      this.originalY + Math.sin(progress * Math.PI) * 4;

    this.target.position.x =
      this.targetOriginalX + this.direction * (1 - this.easeOut(progress)) * 8;

    if (this.timer >= this.phaseDuration.RECOIL) {
      this.attacker.position.x = this.originalX;
      this.attacker.position.y = this.originalY;

      this.target.position.x = this.targetOriginalX;
      this.target.position.y = this.targetOriginalY;

      this.changePhase(TakeDownAnimation.PHASES.FINISH);
    }
  }

  updateFinish() {
    if (this.timer >= this.phaseDuration.FINISH) {
      this.attacker.position.x = this.originalX;
      this.attacker.position.y = this.originalY;

      this.target.position.x = this.targetOriginalX;
      this.target.position.y = this.targetOriginalY;

      this.isFinished = true;
    }
  }

  createSpeedLines() {
    for (let i = 0; i < 3; i++) {
      this.speedLines.push({
        x:
          this.attacker.position.x +
          (this.direction === 1 ? -8 : this.attacker.frameWidth + 8),
        y: this.attacker.position.y + Math.random() * this.attacker.frameHeight,
        length: 10 + Math.random() * 16,
        life: 8,
        maxLife: 8,
      });
    }
  }

  createDustParticles() {
    for (let i = 0; i < 2; i++) {
      this.particles.push({
        x: this.attacker.position.x + this.attacker.frameWidth / 2,
        y: this.attacker.position.y + this.attacker.frameHeight - 4,
        vx: -this.direction * (1 + Math.random() * 2),
        vy: -Math.random() * 2,
        size: 2 + Math.random() * 3,
        life: 14,
        maxLife: 14,
        color: Math.random() > 0.5 ? "#c5a77b" : "#8d795f",
      });
    }
  }

  createImpactParticles() {
    for (let i = 0; i < 28; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 4;

      this.particles.push({
        x: this.target.position.x + this.target.frameWidth / 2,
        y: this.target.position.y + this.target.frameHeight / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 3,
        life: 18 + Math.random() * 8,
        maxLife: 26,
        color: ["#ffffff", "#ffe6a3", "#f5b94c", "#d58b35"][i % 4],
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

    this.speedLines.forEach((line) => {
      line.x -= this.direction * 3;
      line.life--;
    });

    this.speedLines = this.speedLines.filter((line) => line.life > 0);
  }

  draw(context) {
    context.save();

    this.drawSpeedLines(context);
    this.drawParticles(context);

    if (this.phase === TakeDownAnimation.PHASES.IMPACT) {
      this.drawImpact(context);
    }

    context.restore();
  }

  drawSpeedLines(context) {
    context.save();

    this.speedLines.forEach((line) => {
      context.globalAlpha = line.life / line.maxLife;
      context.strokeStyle = "#e8e0d2";
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

  drawImpact(context) {
    const x = this.target.position.x + this.target.frameWidth / 2;
    const y = this.target.position.y + this.target.frameHeight / 2;

    const progress = this.impactProgress;
    const alpha = 1 - progress;

    context.save();

    // Flash central.
    const radius = 8 + progress * 25;

    const gradient = context.createRadialGradient(x, y, 0, x, y, radius);

    gradient.addColorStop(0, `rgba(255,255,255,${alpha})`);
    gradient.addColorStop(0.35, `rgba(255,225,150,${alpha})`);
    gradient.addColorStop(1, "rgba(255,170,50,0)");

    context.fillStyle = gradient;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();

    // Éclats de collision.
    context.strokeStyle = `rgba(255,245,210,${alpha})`;
    context.lineWidth = 3;

    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8;
      const inner = 10 + progress * 8;
      const outer = 18 + progress * 24;

      context.beginPath();
      context.moveTo(x + Math.cos(angle) * inner, y + Math.sin(angle) * inner);
      context.lineTo(x + Math.cos(angle) * outer, y + Math.sin(angle) * outer);
      context.stroke();
    }

    context.restore();
  }
}
