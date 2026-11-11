export class IronDefenseAnimation {
  static PHASES = {
    PREPARE: "PREPARE",
    ARMOR: "ARMOR",
    REINFORCE: "REINFORCE",
    RELEASE: "RELEASE",
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

    this.width = this.sprite.frameWidth * this.sprite.scale;
    this.height = this.sprite.frameHeight * this.sprite.scale;

    this.centerX = this.sprite.position.x + this.width / 2;
    this.centerY = this.sprite.position.y + this.height / 2;

    this.phase = IronDefenseAnimation.PHASES.PREPARE;
    this.timer = 0;
    this.isFinished = false;

    this.phaseDuration = {
      PREPARE: 24,
      ARMOR: 46,
      REINFORCE: 72,
      RELEASE: 40,
      FINISH: 16,
    };

    this.armorProgress = 0;
    this.armorAlpha = 0;
    this.metallicFlash = 0;

    this.particles = [];
    this.sparkles = [];
    this.plates = [];

    this.platePositions = [
      { x: -0.27, y: -0.24, angle: -0.35, width: 0.32, height: 0.24 },
      { x: 0.27, y: -0.24, angle: 0.35, width: 0.32, height: 0.24 },
      { x: -0.34, y: 0.12, angle: -0.2, width: 0.28, height: 0.32 },
      { x: 0.34, y: 0.12, angle: 0.2, width: 0.28, height: 0.32 },
      { x: 0, y: 0.34, angle: 0, width: 0.4, height: 0.2 },
    ];

    this.maxRadius = Math.max(this.width, this.height) * 0.65;
  }

  update(context) {
    if (this.isFinished) return;

    this.timer++;

    switch (this.phase) {
      case IronDefenseAnimation.PHASES.PREPARE:
        this.updatePrepare();
        break;

      case IronDefenseAnimation.PHASES.ARMOR:
        this.updateArmor();
        break;

      case IronDefenseAnimation.PHASES.REINFORCE:
        this.updateReinforce();
        break;

      case IronDefenseAnimation.PHASES.RELEASE:
        this.updateRelease();
        break;

      case IronDefenseAnimation.PHASES.FINISH:
        this.updateFinish();
        break;
    }

    this.updateParticles();
    this.updateSparkles();

    this.draw(context);
  }

  changePhase(phase) {
    this.phase = phase;
    this.timer = 0;
  }

  easeOut(value) {
    return 1 - Math.pow(1 - value, 3);
  }

  easeInOut(value) {
    return value < 0.5
      ? 4 * value * value * value
      : 1 - Math.pow(-2 * value + 2, 3) / 2;
  }

  updatePrepare() {
    const progress = Math.min(1, this.timer / this.phaseDuration.PREPARE);

    this.armorAlpha = progress * 0.3;

    if (this.timer % 3 === 0) {
      this.createMetalParticle();
    }

    if (this.timer >= this.phaseDuration.PREPARE) {
      this.changePhase(IronDefenseAnimation.PHASES.ARMOR);
    }
  }

  updateArmor() {
    const progress = Math.min(1, this.timer / this.phaseDuration.ARMOR);

    this.armorProgress = this.easeOut(progress);
    this.armorAlpha = 0.35 + progress * 0.65;

    this.plates = this.platePositions.map((plate, index) => {
      const delay = index * 0.12;
      const localProgress = Math.max(
        0,
        Math.min(1, (progress - delay) / (1 - delay))
      );

      return {
        ...plate,
        progress: this.easeOut(localProgress),
        alpha: this.easeOut(localProgress),
      };
    });

    if (this.timer % 3 === 0) {
      this.createMetalParticle();
    }

    if (this.timer % 5 === 0) {
      this.createSparkle();
    }

    if (this.timer >= this.phaseDuration.ARMOR) {
      this.changePhase(IronDefenseAnimation.PHASES.REINFORCE);
    }
  }

  updateReinforce() {
    const progress = this.timer / this.phaseDuration.REINFORCE;

    this.armorProgress = 1;
    this.armorAlpha = 1;

    this.metallicFlash = Math.max(0, Math.sin(progress * Math.PI * 4));

    if (this.timer % 7 === 0) {
      this.createMetalParticle();
      this.createSparkle();
    }

    if (this.timer === 10 || this.timer === 25) {
      this.createImpactFlash();
    }

    if (this.timer >= this.phaseDuration.REINFORCE) {
      this.changePhase(IronDefenseAnimation.PHASES.RELEASE);
    }
  }

  updateRelease() {
    const progress = Math.min(1, this.timer / this.phaseDuration.RELEASE);

    this.armorAlpha = 1 - this.easeInOut(progress) * 0.7;
    this.metallicFlash = 1 - progress;

    if (this.timer % 3 === 0) {
      this.createMetalParticle();
    }

    if (this.timer >= this.phaseDuration.RELEASE) {
      this.changePhase(IronDefenseAnimation.PHASES.FINISH);
    }
  }

  updateFinish() {
    if (this.timer >= this.phaseDuration.FINISH) {
      this.isFinished = true;
    }
  }

  createMetalParticle() {
    const angle = Math.random() * Math.PI * 2;
    const radius = this.maxRadius * (0.8 + Math.random() * 0.5);

    const x = this.centerX + Math.cos(angle) * radius;
    const y = this.centerY + Math.sin(angle) * radius;

    const dx = this.centerX - x;
    const dy = this.centerY - y;
    const length = Math.sqrt(dx * dx + dy * dy) || 1;

    this.particles.push({
      x,
      y,
      vx: (dx / length) * (1 + Math.random() * 1.5),
      vy: (dy / length) * (1 + Math.random() * 1.5),
      size: 2 + Math.random() * 3,
      life: 24,
      maxLife: 24,
      rotation: Math.random() * Math.PI,
      rotationSpeed: (Math.random() - 0.5) * 0.15,
    });
  }

  createSparkle() {
    const angle = Math.random() * Math.PI * 2;
    const radius = this.maxRadius * Math.random();

    this.sparkles.push({
      x: this.centerX + Math.cos(angle) * radius,
      y: this.centerY + Math.sin(angle) * radius,
      size: 2 + Math.random() * 3,
      life: 16,
      maxLife: 16,
    });
  }

  createImpactFlash() {
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8;

      this.sparkles.push({
        x: this.centerX + Math.cos(angle) * this.maxRadius,
        y: this.centerY + Math.sin(angle) * this.maxRadius,
        size: 4 + Math.random() * 3,
        life: 22,
        maxLife: 22,
      });
    }
  }

  updateParticles() {
    this.particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      particle.vx *= 0.96;
      particle.vy *= 0.96;

      particle.rotation += particle.rotationSpeed;
      particle.life--;
    });

    this.particles = this.particles.filter((particle) => particle.life > 0);
  }

  updateSparkles() {
    this.sparkles.forEach((sparkle) => {
      sparkle.life--;
    });

    this.sparkles = this.sparkles.filter((sparkle) => sparkle.life > 0);
  }

  draw(context) {
    context.save();

    this.drawMetalAura(context);
    this.drawArmorPlates(context);
    this.drawMetalParticles(context);
    this.drawSparkles(context);

    context.restore();
  }

  drawMetalAura(context) {
    if (this.armorAlpha <= 0) return;

    const pulse = 1 + Math.sin(this.timer * 0.25) * 0.04;

    context.save();
    context.globalAlpha = this.armorAlpha * 0.45;

    const radius = this.maxRadius * pulse;

    const gradient = context.createRadialGradient(
      this.centerX,
      this.centerY,
      5,
      this.centerX,
      this.centerY,
      radius
    );

    gradient.addColorStop(0, "rgba(225,235,245,0.35)");
    gradient.addColorStop(0.5, "rgba(135,155,180,0.22)");
    gradient.addColorStop(1, "rgba(80,100,130,0)");

    context.fillStyle = gradient;

    context.beginPath();
    context.arc(this.centerX, this.centerY, radius, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }

  drawArmorPlates(context) {
    if (!this.plates.length) return;

    context.save();

    this.plates.forEach((plate) => {
      if (plate.alpha <= 0) return;

      const width = this.width * plate.width * plate.progress;
      const height = this.height * plate.height * plate.progress;

      const x = this.centerX + plate.x * this.width;
      const y = this.centerY + plate.y * this.height;

      context.save();

      context.globalAlpha = plate.alpha * this.armorAlpha;

      context.translate(x, y);
      context.rotate(plate.angle);

      const gradient = context.createLinearGradient(
        -width / 2,
        -height / 2,
        width / 2,
        height / 2
      );

      gradient.addColorStop(0, "#f5f8ff");
      gradient.addColorStop(0.2, "#aebdce");
      gradient.addColorStop(0.5, "#66788d");
      gradient.addColorStop(0.75, "#dce6f0");
      gradient.addColorStop(1, "#586a80");

      context.fillStyle = gradient;
      context.strokeStyle = "#e5f0ff";
      context.lineWidth = 1.5;

      context.shadowColor = "#b8d9f5";
      context.shadowBlur = 8 + this.metallicFlash * 5;

      // Plaque métallique à pans coupés.
      context.beginPath();
      context.moveTo(-width * 0.35, -height / 2);
      context.lineTo(width * 0.35, -height / 2);
      context.lineTo(width / 2, -height * 0.15);
      context.lineTo(width * 0.35, height / 2);
      context.lineTo(-width * 0.35, height / 2);
      context.lineTo(-width / 2, -height * 0.15);
      context.closePath();

      context.fill();
      context.stroke();

      // Reflet métallique.
      context.shadowBlur = 0;
      context.strokeStyle = `rgba(255,255,255,${
        0.4 + this.metallicFlash * 0.5
      })`;
      context.lineWidth = 1;

      context.beginPath();
      context.moveTo(-width * 0.3, -height * 0.3);
      context.lineTo(width * 0.25, -height * 0.3);
      context.stroke();

      // Rivet central.
      context.fillStyle = "#f4f8ff";
      context.beginPath();
      context.arc(0, 0, 1.5, 0, Math.PI * 2);
      context.fill();

      context.restore();
    });

    context.restore();
  }

  drawMetalParticles(context) {
    context.save();

    this.particles.forEach((particle) => {
      const alpha = particle.life / particle.maxLife;

      context.save();

      context.globalAlpha = alpha;
      context.translate(particle.x, particle.y);
      context.rotate(particle.rotation);

      context.fillStyle = "#cbd9e8";
      context.shadowColor = "#e6f3ff";
      context.shadowBlur = 7;

      context.fillRect(
        -particle.size / 2,
        -particle.size / 2,
        particle.size,
        particle.size
      );

      context.restore();
    });

    context.restore();
  }

  drawSparkles(context) {
    context.save();

    this.sparkles.forEach((sparkle) => {
      const alpha = sparkle.life / sparkle.maxLife;
      const pulse = Math.sin(alpha * Math.PI);

      context.save();

      context.globalAlpha = alpha;
      context.translate(sparkle.x, sparkle.y);

      context.strokeStyle = "#ffffff";
      context.lineWidth = 1.5;

      context.shadowColor = "#b9dfff";
      context.shadowBlur = 10;

      const size = sparkle.size * (0.5 + pulse * 0.5);

      context.beginPath();
      context.moveTo(-size, 0);
      context.lineTo(size, 0);
      context.moveTo(0, -size);
      context.lineTo(0, size);
      context.stroke();

      context.restore();
    });

    context.restore();
  }
}
