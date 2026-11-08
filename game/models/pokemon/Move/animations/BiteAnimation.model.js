export class BiteAnimation {
  static PHASES = {
    PREPARE: "PREPARE",
    LUNGE: "LUNGE",
    OPEN: "OPEN",
    BITE: "BITE",
    IMPACT: "IMPACT",
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

    this.phase = BiteAnimation.PHASES.PREPARE;
    this.timer = 0;
    this.isFinished = false;

    this.direction =
      this.target.position.x >= this.attacker.position.x ? 1 : -1;

    this.jawOpening = 0;
    this.impactFlash = 0;
    this.particles = [];

    this.phaseDuration = {
      PREPARE: 0,
      LUNGE: 8,
      OPEN: 8,
      BITE: 8,
      IMPACT: 12,
      RETURN: 12,
    };

    this.lungeDistance = 18;
    this.biteCount = 0;
    this.maxBites = 2;
  }

  update(context) {
    if (this.isFinished) return;

    this.timer++;

    switch (this.phase) {
      case BiteAnimation.PHASES.PREPARE:
        this.updatePrepare();
        break;

      case BiteAnimation.PHASES.LUNGE:
        this.updateLunge();
        break;

      case BiteAnimation.PHASES.OPEN:
        this.updateOpen();
        break;

      case BiteAnimation.PHASES.BITE:
        this.updateBite();
        break;

      case BiteAnimation.PHASES.IMPACT:
        this.updateImpact();
        break;

      case BiteAnimation.PHASES.RETURN:
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
      this.changePhase(BiteAnimation.PHASES.LUNGE);
    }
  }

  updateLunge() {
    const progress = Math.min(1, this.timer / this.phaseDuration.LUNGE);

    const eased = 1 - Math.pow(1 - progress, 3);

    this.attacker.position.x =
      this.originalX + this.direction * this.lungeDistance * eased;

    if (this.timer >= this.phaseDuration.LUNGE) {
      this.changePhase(BiteAnimation.PHASES.OPEN);
    }
  }

  updateOpen() {
    const progress = Math.min(1, this.timer / this.phaseDuration.OPEN);

    this.jawOpening = this.easeOut(progress);

    if (this.timer >= this.phaseDuration.OPEN) {
      this.changePhase(BiteAnimation.PHASES.BITE);
    }
  }

  updateBite() {
    const progress = Math.min(1, this.timer / this.phaseDuration.BITE);

    this.jawOpening = 1 - this.easeIn(progress);

    if (this.timer === 2) {
      this.createImpactParticles();
      this.game.canvas.startShake(9, 4);
    }

    if (this.timer >= this.phaseDuration.BITE) {
      this.biteCount++;

      if (this.biteCount < this.maxBites) {
        this.changePhase(BiteAnimation.PHASES.OPEN);
      } else {
        this.jawOpening = 0;
        this.changePhase(BiteAnimation.PHASES.IMPACT);
      }
    }
  }

  updateImpact() {
    this.impactFlash = Math.max(0, 1 - this.timer / this.phaseDuration.IMPACT);

    if (this.timer >= this.phaseDuration.IMPACT) {
      this.changePhase(BiteAnimation.PHASES.RETURN);
    }
  }

  updateReturn() {
    const progress = Math.min(1, this.timer / this.phaseDuration.RETURN);

    const eased = this.easeOut(progress);

    this.attacker.position.x =
      this.originalX + this.direction * this.lungeDistance * (1 - eased);

    if (this.timer >= this.phaseDuration.RETURN) {
      this.attacker.position.x = this.originalX;
      this.attacker.position.y = this.originalY;

      this.isFinished = true;
    }
  }

  easeIn(value) {
    return value * value;
  }

  easeOut(value) {
    return 1 - Math.pow(1 - value, 3);
  }

  getTargetBounds() {
    return {
      x: this.target.position.x,
      y: this.target.position.y,
      width: this.target.frameWidth,
      height: this.target.frameHeight,
      centerX: this.target.position.x + this.target.frameWidth / 2,
      centerY: this.target.position.y + this.target.frameHeight / 2,
    };
  }

  createImpactParticles() {
    const bounds = this.getTargetBounds();

    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 3.5;

      this.particles.push({
        x: bounds.centerX,
        y: bounds.centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2.5 + Math.random() * 4,
        life: 18,
        maxLife: 18,
        color: i % 3 === 0 ? "#ffffff" : "#b8a8b4",
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

  draw(context) {
    const bounds = this.getTargetBounds();

    context.save();

    if (
      this.phase === BiteAnimation.PHASES.OPEN ||
      this.phase === BiteAnimation.PHASES.BITE
    ) {
      this.drawMouth(context, bounds);
    }

    if (this.phase === BiteAnimation.PHASES.IMPACT) {
      this.drawImpact(context, bounds);
    }

    this.drawParticles(context);

    context.restore();
  }

  drawMouth(context, bounds) {
    const { centerX, centerY, width, height } = bounds;

    const mouthWidth = Math.max(48, width - 20);
    const mouthHeight = Math.max(38, height);

    context.save();

    context.translate(centerX, centerY);
    context.scale(this.direction, 1);

    this.drawUpperTeeth(context, mouthWidth, mouthHeight);
    this.drawLowerTeeth(context, mouthWidth, mouthHeight);

    // Reflets humides à l'intérieur de la bouche.
    this.drawSaliva(context, mouthWidth, mouthHeight);

    context.restore();
  }

  drawUpperTeeth(context, width, height) {
    const gap = height * (0.12 + this.jawOpening * 0.42);

    const positions = [
      { x: -0.39, size: 1.75 },
      { x: -0.27, size: 2 },
      { x: -0.12, size: 1.7 },
      { x: 0.08, size: 1.7 },
      { x: 0.25, size: 2 },
      { x: 0.39, size: 1.75 },
    ];

    positions.forEach((tooth, index) => {
      const x = width * tooth.x;

      const isFang = index === 1 || index === 4;

      const toothWidth = isFang ? 15 : 12;
      const toothHeight = (isFang ? 13 : 5) * tooth.size;

      this.drawTooth(context, x, -gap + 2, toothWidth, toothHeight, true);
    });
  }

  drawLowerTeeth(context, width, height) {
    const gap = height * (0.12 + this.jawOpening * 0.42);

    const positions = [
      { x: -0.36, size: 0.75 },
      { x: -0.2, size: 1.3 },
      { x: 0, size: 0.7 },
      { x: 0.2, size: 1.3 },
      { x: 0.36, size: 0.75 },
    ];

    positions.forEach((tooth, index) => {
      const x = (width / 1.5) * tooth.x;

      const isFang = index === 1 || index === 3;

      const toothWidth = isFang ? 10 : 7;
      const toothHeight = (isFang ? 16 : 9) * tooth.size;

      this.drawTooth(context, x, gap - 2, toothWidth, toothHeight, false);
    });
  }

  drawTooth(context, x, baseY, width, height, upper) {
    const tipY = upper ? baseY + height : baseY - height;

    context.save();

    // Silhouette de la dent.
    context.beginPath();
    context.moveTo(x - width / 2, baseY);

    context.bezierCurveTo(
      x - width * 0.55,
      baseY + (upper ? 3 : -3),
      x - width * 0.25,
      tipY - (upper ? 2 : -2),
      x,
      tipY
    );

    context.bezierCurveTo(
      x + width * 0.25,
      tipY - (upper ? 2 : -2),
      x + width * 0.55,
      baseY + (upper ? 3 : -3),
      x + width / 2,
      baseY
    );

    context.closePath();

    // Dégradé ivoire : ombre à la base, blanc lumineux au centre.
    const gradient = context.createLinearGradient(
      x - width * 0.5,
      baseY,
      x + width * 0.35,
      tipY
    );

    gradient.addColorStop(0, "#b9a58e");
    gradient.addColorStop(0.22, "#e8dcc5");
    gradient.addColorStop(0.5, "#fffef0");
    gradient.addColorStop(0.78, "#fff8df");
    gradient.addColorStop(1, "#d8c8aa");

    context.fillStyle = gradient;
    context.fill();

    // Contour sombre pour détacher la dent de la bouche.
    context.strokeStyle = "#59434a";
    context.lineWidth = 1;
    context.stroke();

    // Reflet principal sur la surface de la dent.
    context.beginPath();
    context.moveTo(x - width * 0.2, baseY + (upper ? 1 : -1));
    context.quadraticCurveTo(
      x - width * 0.12,
      (baseY + tipY) / 2,
      x - width * 0.04,
      tipY + (upper ? 3 : -3)
    );

    context.strokeStyle = "rgba(255,255,255,0.95)";
    context.lineWidth = Math.max(1, width * 0.13);
    context.lineCap = "round";
    context.stroke();

    // Petit éclat lumineux à la base.
    context.beginPath();
    context.arc(
      x + width * 0.18,
      baseY + (upper ? -1 : 1),
      0.8,
      0,
      Math.PI * 2
    );

    context.fillStyle = "rgba(255,255,255,0.85)";
    context.fill();

    context.restore();
  }

  drawSaliva(context, width, height) {
    const gap = height * (0.12 + this.jawOpening * 0.42);

    if (this.jawOpening < 0.5) return;

    context.save();

    context.strokeStyle = "rgba(230, 190, 205, 0.7)";
    context.lineWidth = 1.5;

    // Filaments de salive entre les mâchoires.
    const salivaPositions = [-0.28, 0.05, 0.3];

    salivaPositions.forEach((position, index) => {
      const x = width * position;
      const offset = Math.sin(this.timer * 0.5 + index) * 2;

      context.beginPath();
      context.moveTo(x, -gap * 0.1);
      context.quadraticCurveTo(x + offset, 0, x - offset, gap * 0.1);
      context.stroke();
    });

    context.restore();
  }

  drawImpact(context, bounds) {
    const { centerX, centerY } = bounds;

    const progress = this.timer / this.phaseDuration.IMPACT;
    const radius = 12 + progress * 25;

    context.save();

    context.globalAlpha = this.impactFlash * 0.65;
    context.fillStyle = "rgba(245, 217, 39, 0.8)";

    context.beginPath();
    context.arc(centerX, centerY, radius * 0.45, 0, Math.PI * 2);
    context.fill();

    context.globalAlpha = this.impactFlash;
    context.strokeStyle = "rgba(182, 182, 182, 0.8)";
    context.lineWidth = 3;

    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8;

      context.beginPath();
      context.moveTo(
        centerX + Math.cos(angle) * radius * 0.5,
        centerY + Math.sin(angle) * radius * 0.5
      );
      context.lineTo(
        centerX + Math.cos(angle) * radius,
        centerY + Math.sin(angle) * radius
      );
      context.stroke();
    }

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
}
