export class BarrierAnimation {
  static PHASES = {
    PREPARE: "PREPARE",
    FORMATION: "FORMATION",
    PROTECT: "PROTECT",
    DISSIPATE: "DISSIPATE",
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

    this.sprite = this.pokemonViewer.sprite;

    this.phase = BarrierAnimation.PHASES.PREPARE;
    this.timer = 0;
    this.isFinished = false;

    this.centerX =
      this.sprite.position.x + (this.sprite.frameWidth * this.sprite.scale) / 2;

    this.centerY =
      this.sprite.position.y +
      (this.sprite.frameHeight * this.sprite.scale) / 2;

    this.width = this.sprite.frameWidth * this.sprite.scale;
    this.height = this.sprite.frameHeight * this.sprite.scale;

    this.shieldWidth = this.width * 1.3;
    this.shieldHeight = this.height * 1.5;

    this.phaseDuration = {
      PREPARE: 24,
      FORMATION: 50,
      PROTECT: 84,
      DISSIPATE: 44,
      FINISH: 16,
    };

    this.particles = [];
    this.fragments = [];

    this.shieldProgress = 0;
    this.shieldAlpha = 0;
    this.shieldPulse = 0;

    this.shieldOffsetX = 0;

    this.hexagonPoints = [
      [0, -0.5],
      [0.42, -0.25],
      [0.42, 0.25],
      [0, 0.5],
      [-0.42, 0.25],
      [-0.42, -0.25],
    ];
  }

  update(context) {
    if (this.isFinished) return;

    this.timer++;

    switch (this.phase) {
      case BarrierAnimation.PHASES.PREPARE:
        this.updatePrepare();
        break;

      case BarrierAnimation.PHASES.FORMATION:
        this.updateFormation();
        break;

      case BarrierAnimation.PHASES.PROTECT:
        this.updateProtect();
        break;

      case BarrierAnimation.PHASES.DISSIPATE:
        this.updateDissipate();
        break;

      case BarrierAnimation.PHASES.FINISH:
        this.updateFinish();
        break;
    }

    this.updateParticles();
    this.updateFragments();

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
    const progress = Math.min(1, this.timer / this.phaseDuration.PREPARE);

    this.shieldAlpha = progress * 0.25;

    if (this.timer % 3 === 0) {
      this.createEnergyParticle();
    }

    if (this.timer >= this.phaseDuration.PREPARE) {
      this.changePhase(BarrierAnimation.PHASES.FORMATION);
    }
  }

  updateFormation() {
    const progress = Math.min(1, this.timer / this.phaseDuration.FORMATION);

    this.shieldProgress = this.easeOut(progress);
    this.shieldAlpha = 0.2 + progress * 0.65;

    if (this.timer % 2 === 0) {
      this.createEnergyParticle();
    }

    if (this.timer % 5 === 0) {
      this.createShieldFragment();
    }

    if (this.timer >= this.phaseDuration.FORMATION) {
      this.changePhase(BarrierAnimation.PHASES.PROTECT);
    }
  }

  updateProtect() {
    const progress = this.timer / this.phaseDuration.PROTECT;

    this.shieldProgress = 1;
    this.shieldAlpha = 0.75;

    this.shieldPulse = Math.sin(this.timer * 0.25);

    this.shieldOffsetX = Math.sin(progress * Math.PI * 4) * 2;

    if (this.timer % 6 === 0) {
      this.createEnergyParticle();
    }

    if (this.timer >= this.phaseDuration.PROTECT) {
      this.createDissipationFragments();
      this.changePhase(BarrierAnimation.PHASES.DISSIPATE);
    }
  }

  updateDissipate() {
    const progress = Math.min(1, this.timer / this.phaseDuration.DISSIPATE);

    this.shieldAlpha = 0.75 * (1 - this.easeOut(progress));
    this.shieldProgress = 1 - progress * 0.15;

    this.shieldOffsetX += 0.15;

    if (this.timer >= this.phaseDuration.DISSIPATE) {
      this.particles = [];
      this.fragments = [];

      this.changePhase(BarrierAnimation.PHASES.FINISH);
    }
  }

  updateFinish() {
    if (this.timer >= this.phaseDuration.FINISH) {
      this.isFinished = true;
    }
  }

  createEnergyParticle() {
    const angle = Math.random() * Math.PI * 2;
    const distance = this.width * (0.5 + Math.random() * 0.5);

    const x = this.centerX + Math.cos(angle) * distance;
    const y = this.centerY + Math.sin(angle) * distance;

    const dx = this.centerX - x;
    const dy = this.centerY - y;
    const length = Math.sqrt(dx * dx + dy * dy) || 1;

    this.particles.push({
      x,
      y,
      vx: (dx / length) * (1 + Math.random()),
      vy: (dy / length) * (1 + Math.random()),
      size: 2 + Math.random() * 2,
      life: 24,
      maxLife: 24,
    });
  }

  createShieldFragment() {
    const angle = Math.random() * Math.PI * 2;
    const distance = this.width * 0.55;

    this.fragments.push({
      x: this.centerX + Math.cos(angle) * distance,
      y: this.centerY + Math.sin(angle) * distance,
      angle,
      life: 22,
      maxLife: 22,
      size: 3 + Math.random() * 3,
    });
  }

  createDissipationFragments() {
    for (let i = 0; i < 14; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 2.5;

      this.fragments.push({
        x: this.centerX,
        y: this.centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 22,
        maxLife: 22,
        size: 2 + Math.random() * 4,
        angle,
      });
    }
  }

  updateParticles() {
    this.particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      particle.vx *= 0.96;
      particle.vy *= 0.96;

      particle.life--;
    });

    this.particles = this.particles.filter((particle) => particle.life > 0);
  }

  updateFragments() {
    this.fragments.forEach((fragment) => {
      if (fragment.vx !== undefined) {
        fragment.x += fragment.vx;
        fragment.y += fragment.vy;

        fragment.vx *= 0.97;
        fragment.vy *= 0.97;
      }

      fragment.life--;
    });

    this.fragments = this.fragments.filter((fragment) => fragment.life > 0);
  }

  draw(context) {
    context.save();

    this.drawShield(context);
    this.drawParticles(context);
    this.drawFragments(context);

    context.restore();
  }

  drawShield(context) {
    if (this.shieldAlpha <= 0) return;

    const pulse = this.shieldPulse * 3;

    const width = this.shieldWidth * this.shieldProgress;
    const height = this.shieldHeight * this.shieldProgress;

    const centerX = this.centerX + this.shieldOffsetX;

    const centerY = this.centerY;

    context.save();
    context.globalAlpha = this.shieldAlpha;

    // Aura extérieure.
    const aura = context.createRadialGradient(
      centerX,
      centerY,
      5,
      centerX,
      centerY,
      width * 0.8
    );

    aura.addColorStop(0, "rgba(120,210,255,0.2)");
    aura.addColorStop(0.6, "rgba(65,160,255,0.15)");
    aura.addColorStop(1, "rgba(40,110,255,0)");

    context.fillStyle = aura;

    context.beginPath();
    context.ellipse(
      centerX,
      centerY,
      width * 0.75,
      height * 0.65,
      0,
      0,
      Math.PI * 2
    );
    context.fill();

    // Forme hexagonale du bouclier.
    context.beginPath();

    this.hexagonPoints.forEach(([x, y], index) => {
      const pointX = centerX + x * width;
      const pointY = centerY + y * height;

      if (index === 0) {
        context.moveTo(pointX, pointY);
      } else {
        context.lineTo(pointX, pointY);
      }
    });

    context.closePath();

    const gradient = context.createLinearGradient(
      centerX - width / 2,
      centerY,
      centerX + width / 2,
      centerY
    );

    gradient.addColorStop(0, "rgba(60,160,255,0.12)");
    gradient.addColorStop(0.5, "rgba(180,235,255,0.3)");
    gradient.addColorStop(1, "rgba(60,160,255,0.12)");

    context.fillStyle = gradient;
    context.fill();

    context.strokeStyle = `rgba(180,235,255,${0.7 + pulse * 0.03})`;
    context.lineWidth = 2 + pulse * 0.15;

    context.shadowColor = "#55bbff";
    context.shadowBlur = 12 + pulse;

    context.stroke();

    // Reflet lumineux intérieur.
    context.shadowBlur = 0;
    context.strokeStyle = "rgba(255,255,255,0.5)";
    context.lineWidth = 1;

    context.beginPath();
    context.moveTo(centerX - width * 0.25, centerY - height * 0.25);
    context.lineTo(centerX, centerY - height * 0.4);
    context.lineTo(centerX + width * 0.25, centerY - height * 0.25);
    context.stroke();

    // Petites lignes énergétiques.
    context.strokeStyle = "rgba(160,225,255,0.5)";
    context.lineWidth = 1;

    for (let i = 1; i < 4; i++) {
      const x = centerX - width / 2 + (width / 4) * i;

      context.beginPath();
      context.moveTo(x, centerY - height * 0.2);
      context.lineTo(x, centerY + height * 0.2);
      context.stroke();
    }

    context.restore();
  }

  drawParticles(context) {
    context.save();

    this.particles.forEach((particle) => {
      const alpha = particle.life / particle.maxLife;

      context.globalAlpha = alpha;
      context.fillStyle = "#a8eaff";

      context.shadowColor = "#54bfff";
      context.shadowBlur = 8;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fill();
    });

    context.restore();
  }

  drawFragments(context) {
    context.save();

    this.fragments.forEach((fragment) => {
      const alpha = fragment.life / fragment.maxLife;

      context.globalAlpha = alpha;
      context.fillStyle = "#b9edff";

      context.shadowColor = "#42aaff";
      context.shadowBlur = 8;

      context.translate(fragment.x, fragment.y);
      context.rotate(fragment.angle);

      context.beginPath();
      context.moveTo(0, -fragment.size);
      context.lineTo(fragment.size * 0.7, 0);
      context.lineTo(0, fragment.size);
      context.lineTo(-fragment.size * 0.7, 0);
      context.closePath();

      context.fill();

      context.setTransform(1, 0, 0, 1, 0, 0);
    });

    context.restore();
  }
}
