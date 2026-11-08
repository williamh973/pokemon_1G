export class ShadowBallAnimation {
  static PHASES = {
    PREPARE: "PREPARE",
    CHARGE: "CHARGE",
    FIRE: "FIRE",
    IMPACT: "IMPACT",
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

    this.phase = ShadowBallAnimation.PHASES.PREPARE;
    this.timer = 0;
    this.isFinished = false;

    this.phaseDuration = {
      PREPARE: 10,
      CHARGE: 20,
      FIRE: 24,
      IMPACT: 16,
      FINISH: 8,
    };

    const startX = this.attacker.position.x + this.attacker.frameWidth / 2;
    const startY = this.attacker.position.y + this.attacker.frameHeight / 2;

    const targetX = this.target.position.x + this.target.frameWidth / 2;
    const targetY = this.target.position.y + this.target.frameHeight / 2;

    this.startPosition = {
      x: startX,
      y: startY,
    };

    this.endPosition = {
      x: targetX,
      y: targetY,
    };

    this.direction = targetX >= startX ? 1 : -1;

    this.orb = {
      x: startX,
      y: startY,
      radius: 5,
      rotation: 0,
    };

    this.particles = [];
    this.impactParticles = [];

    this.chargeProgress = 0;
    this.impactProgress = 0;

    this.orbRadius = 15;
    this.maxOrbRadius = 17;
  }

  update(context) {
    if (this.isFinished) return;

    this.timer++;

    switch (this.phase) {
      case ShadowBallAnimation.PHASES.PREPARE:
        this.updatePrepare();
        break;

      case ShadowBallAnimation.PHASES.CHARGE:
        this.updateCharge();
        break;

      case ShadowBallAnimation.PHASES.FIRE:
        this.updateFire();
        break;

      case ShadowBallAnimation.PHASES.IMPACT:
        this.updateImpact();
        break;

      case ShadowBallAnimation.PHASES.FINISH:
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

  easeOut(value) {
    return 1 - Math.pow(1 - value, 3);
  }

  updatePrepare() {
    if (this.timer >= this.phaseDuration.PREPARE) {
      this.changePhase(ShadowBallAnimation.PHASES.CHARGE);
    }
  }

  updateCharge() {
    const progress = Math.min(1, this.timer / this.phaseDuration.CHARGE);

    this.chargeProgress = this.easeOut(progress);

    this.orb.x = this.startPosition.x;
    this.orb.y = this.startPosition.y;

    this.orb.radius = 5 + this.chargeProgress * this.maxOrbRadius;

    this.orb.rotation += 0.12;

    if (this.timer % 2 === 0) {
      this.createChargeParticles();
    }

    if (this.timer >= this.phaseDuration.CHARGE) {
      this.orb.radius = this.maxOrbRadius;
      this.changePhase(ShadowBallAnimation.PHASES.FIRE);
    }
  }

  updateFire() {
    const progress = Math.min(1, this.timer / this.phaseDuration.FIRE);

    const eased = this.easeOut(progress);

    this.orb.x =
      this.startPosition.x +
      (this.endPosition.x - this.startPosition.x) * eased;

    this.orb.y =
      this.startPosition.y +
      (this.endPosition.y - this.startPosition.y) * eased;

    this.orb.rotation += 0.25;

    this.orb.radius = this.maxOrbRadius + Math.sin(this.timer * 0.8) * 2;

    this.createTrailParticles();

    if (this.timer >= this.phaseDuration.FIRE) {
      this.orb.x = this.endPosition.x;
      this.orb.y = this.endPosition.y;

      this.createImpactParticles();
      this.game.canvas.startShake(10, 4);

      this.changePhase(ShadowBallAnimation.PHASES.IMPACT);
    }
  }

  updateImpact() {
    const progress = Math.min(1, this.timer / this.phaseDuration.IMPACT);

    this.impactProgress = progress;

    if (this.timer >= this.phaseDuration.IMPACT) {
      this.changePhase(ShadowBallAnimation.PHASES.FINISH);
    }
  }

  updateFinish() {
    if (this.timer >= this.phaseDuration.FINISH) {
      this.isFinished = true;
    }
  }

  createChargeParticles() {
    const angle = Math.random() * Math.PI * 2;
    const distance = 24 + Math.random() * 16;

    this.particles.push({
      x: this.startPosition.x + Math.cos(angle) * distance,
      y: this.startPosition.y + Math.sin(angle) * distance,
      vx:
        (this.startPosition.x -
          this.startPosition.x -
          Math.cos(angle) * distance) *
        0.08,
      vy: -Math.sin(angle) * distance * 0.08,
      size: 1.5 + Math.random() * 2,
      life: 14,
      maxLife: 14,
      color: Math.random() > 0.5 ? "#a45bd5" : "#67318f",
    });
  }

  createTrailParticles() {
    for (let i = 0; i < 2; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 12;

      this.particles.push({
        x: this.orb.x + Math.cos(angle) * distance,
        y: this.orb.y + Math.sin(angle) * distance,
        vx: -this.direction * (0.5 + Math.random() * 1.5),
        vy: (Math.random() - 0.5) * 2,
        size: 1 + Math.random() * 2.5,
        life: 12 + Math.random() * 8,
        maxLife: 20,
        color: Math.random() > 0.5 ? "#b86be8" : "#54216f",
      });
    }
  }

  createImpactParticles() {
    for (let i = 0; i < 35; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 4;

      this.impactParticles.push({
        x: this.endPosition.x,
        y: this.endPosition.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 3,
        life: 20 + Math.random() * 8,
        maxLife: 28,
        color: ["#ffffff", "#d9a0ff", "#a34bd4", "#60218d", "#271333"][i % 5],
      });
    }
  }

  updateParticles() {
    const updateList = (particles) => {
      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        particle.vx *= 0.96;
        particle.vy *= 0.96;

        particle.life--;
      });

      return particles.filter((particle) => particle.life > 0);
    };

    this.particles = updateList(this.particles);
    this.impactParticles = updateList(this.impactParticles);
  }

  draw(context) {
    context.save();

    this.drawParticles(context);

    if (
      this.phase === ShadowBallAnimation.PHASES.CHARGE ||
      this.phase === ShadowBallAnimation.PHASES.FIRE
    ) {
      this.drawOrb(context);
    }

    if (this.phase === ShadowBallAnimation.PHASES.IMPACT) {
      this.drawImpact(context);
    }

    context.restore();
  }

  drawOrb(context) {
    const { x, y, radius, rotation } = this.orb;

    context.save();

    // Aura externe.
    const aura = context.createRadialGradient(
      x,
      y,
      radius * 0.2,
      x,
      y,
      radius * 2.2
    );

    aura.addColorStop(0, "rgba(190, 105, 255, 0.45)");
    aura.addColorStop(0.45, "rgba(120, 45, 180, 0.25)");
    aura.addColorStop(1, "rgba(70, 20, 110, 0)");

    context.fillStyle = aura;
    context.beginPath();
    context.arc(x, y, radius * 2.2, 0, Math.PI * 2);
    context.fill();

    // Halo violet.
    context.strokeStyle = "rgba(190, 110, 255, 0.8)";
    context.lineWidth = 2;
    context.beginPath();
    context.arc(x, y, radius * 1.35, 0, Math.PI * 2);
    context.stroke();

    // Anneaux spectraux tournoyants.
    context.translate(x, y);
    context.rotate(rotation);

    for (let i = 0; i < 2; i++) {
      context.save();
      context.rotate((i * Math.PI) / 2);

      context.strokeStyle =
        i === 0 ? "rgba(220, 165, 255, 0.9)" : "rgba(115, 45, 170, 0.9)";

      context.lineWidth = 2;

      context.beginPath();
      context.ellipse(0, 0, radius * 1.3, radius * 0.48, 0, 0, Math.PI * 2);
      context.stroke();

      context.restore();
    }

    // Corps de la sphère.
    const orbGradient = context.createRadialGradient(
      -radius * 0.35,
      -radius * 0.4,
      radius * 0.05,
      0,
      0,
      radius
    );

    orbGradient.addColorStop(0, "#dcb3ff");
    orbGradient.addColorStop(0.2, "#8c42bc");
    orbGradient.addColorStop(0.55, "#45145f");
    orbGradient.addColorStop(0.85, "#190c25");
    orbGradient.addColorStop(1, "#08050e");

    context.fillStyle = orbGradient;
    context.beginPath();
    context.arc(0, 0, radius, 0, Math.PI * 2);
    context.fill();

    // Reflet lumineux.
    context.fillStyle = "rgba(255,255,255,0.75)";
    context.beginPath();
    context.ellipse(
      -radius * 0.32,
      -radius * 0.38,
      radius * 0.22,
      radius * 0.12,
      -0.5,
      0,
      Math.PI * 2
    );
    context.fill();

    context.restore();
  }

  drawImpact(context) {
    const progress = this.impactProgress;
    const x = this.endPosition.x;
    const y = this.endPosition.y;

    context.save();

    const alpha = 1 - progress;

    // Explosion spectrale.
    const radius = 8 + progress * 38;

    const gradient = context.createRadialGradient(x, y, 0, x, y, radius);

    gradient.addColorStop(0, `rgba(255,255,255,${alpha})`);
    gradient.addColorStop(0.2, `rgba(210,155,255,${alpha * 0.9})`);
    gradient.addColorStop(0.55, `rgba(130,55,180,${alpha * 0.65})`);
    gradient.addColorStop(1, "rgba(55,15,80,0)");

    context.fillStyle = gradient;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();

    // Anneau d'énergie qui se disperse.
    context.globalAlpha = alpha;
    context.strokeStyle = "#d9a4ff";
    context.lineWidth = 3 * alpha + 0.5;

    context.beginPath();
    context.arc(x, y, 8 + progress * 30, 0, Math.PI * 2);
    context.stroke();

    context.restore();

    this.drawImpactParticles(context);
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

  drawImpactParticles(context) {
    context.save();

    this.impactParticles.forEach((particle) => {
      context.globalAlpha = particle.life / particle.maxLife;
      context.fillStyle = particle.color;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fill();
    });

    context.restore();
  }
}
