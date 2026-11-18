export class SuperFangAnimation {
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

    this.phase = SuperFangAnimation.PHASES.PREPARE;
    this.timer = 0;
    this.isFinished = false;

    this.direction =
      this.target.position.x >= this.attacker.position.x ? 1 : -1;

    this.jawOpening = 0;
    this.impactFlash = 0;
    this.particles = [];

    this.phaseDuration = {
      PREPARE: 8,
      LUNGE: 8,
      OPEN: 10,
      BITE: 7,
      IMPACT: 16,
      RETURN: 12,
    };

    this.lungeDistance = 14;

    this.mouthScale = 1;
    this.fangScale = 1;
  }

  // --------------------------------------------------
  // UPDATE
  // --------------------------------------------------

  update(context) {
    if (this.isFinished) return;

    this.timer++;

    switch (this.phase) {
      case SuperFangAnimation.PHASES.PREPARE:
        this.updatePrepare();
        break;

      case SuperFangAnimation.PHASES.LUNGE:
        this.updateLunge();
        break;

      case SuperFangAnimation.PHASES.OPEN:
        this.updateOpen();
        break;

      case SuperFangAnimation.PHASES.BITE:
        this.updateBite();
        break;

      case SuperFangAnimation.PHASES.IMPACT:
        this.updateImpact();
        break;

      case SuperFangAnimation.PHASES.RETURN:
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

  // --------------------------------------------------
  // PREPARE
  // --------------------------------------------------

  updatePrepare() {
    if (this.timer >= this.phaseDuration.PREPARE) {
      this.changePhase(SuperFangAnimation.PHASES.LUNGE);
    }
  }

  // --------------------------------------------------
  // LUNGE
  // --------------------------------------------------

  updateLunge() {
    const progress = Math.min(1, this.timer / this.phaseDuration.LUNGE);

    const eased = this.easeOut(progress);

    this.attacker.position.x =
      this.originalX + this.direction * this.lungeDistance * eased;

    if (this.timer >= this.phaseDuration.LUNGE) {
      this.changePhase(SuperFangAnimation.PHASES.OPEN);
    }
  }

  // --------------------------------------------------
  // OPEN
  // --------------------------------------------------

  updateOpen() {
    const progress = Math.min(1, this.timer / this.phaseDuration.OPEN);

    this.jawOpening = this.easeOut(progress);

    if (this.timer >= this.phaseDuration.OPEN) {
      this.changePhase(SuperFangAnimation.PHASES.BITE);
    }
  }

  // --------------------------------------------------
  // BITE
  // --------------------------------------------------

  updateBite() {
    const progress = Math.min(1, this.timer / this.phaseDuration.BITE);

    // Fermeture extrêmement rapide de la mâchoire.
    this.jawOpening = 1 - this.easeIn(progress);

    if (this.timer === 2) {
      this.createImpactParticles();

      if (this.game.canvas.startShake) {
        this.game.canvas.startShake(12, 5);
      }
    }

    if (this.timer >= this.phaseDuration.BITE) {
      this.jawOpening = 0;
      this.changePhase(SuperFangAnimation.PHASES.IMPACT);
    }
  }

  // --------------------------------------------------
  // IMPACT
  // --------------------------------------------------

  updateImpact() {
    this.impactFlash = Math.max(0, 1 - this.timer / this.phaseDuration.IMPACT);

    if (this.timer >= this.phaseDuration.IMPACT) {
      this.changePhase(SuperFangAnimation.PHASES.RETURN);
    }
  }

  // --------------------------------------------------
  // RETURN
  // --------------------------------------------------

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

  // --------------------------------------------------
  // EASING
  // --------------------------------------------------

  easeIn(value) {
    return value * value;
  }

  easeOut(value) {
    return 1 - Math.pow(1 - value, 3);
  }

  // --------------------------------------------------
  // TARGET BOUNDS
  // --------------------------------------------------

  getTargetBounds() {
    const scale = this.target.scale || 1;

    const width = this.target.frameWidth * scale;
    const height = this.target.frameHeight * scale;

    return {
      x: this.target.position.x,
      y: this.target.position.y,
      width,
      height,
      centerX: this.target.position.x + width / 2,
      centerY: this.target.position.y + height / 2,
    };
  }

  // --------------------------------------------------
  // PARTICLES
  // --------------------------------------------------

  createImpactParticles() {
    const bounds = this.getTargetBounds();

    for (let i = 0; i < 28; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 4;

      this.particles.push({
        x: bounds.centerX,
        y: bounds.centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 4,
        life: 22,
        maxLife: 22,
        color: i % 4 === 0 ? "#ffffff" : i % 2 === 0 ? "#e84b45" : "#9c303b",
      });
    }
  }

  updateParticles() {
    this.particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      particle.vx *= 0.93;
      particle.vy *= 0.93;

      particle.life--;
    });

    this.particles = this.particles.filter((particle) => particle.life > 0);
  }

  // --------------------------------------------------
  // DRAW
  // --------------------------------------------------

  draw(context) {
    const bounds = this.getTargetBounds();

    context.save();

    if (
      this.phase === SuperFangAnimation.PHASES.OPEN ||
      this.phase === SuperFangAnimation.PHASES.BITE
    ) {
      this.drawMouth(context, bounds);
    }

    if (this.phase === SuperFangAnimation.PHASES.IMPACT) {
      this.drawImpact(context, bounds);
    }

    this.drawParticles(context);

    context.restore();
  }

  // --------------------------------------------------
  // MOUTH
  // --------------------------------------------------

  drawMouth(context, bounds) {
    const { centerX, centerY, width, height } = bounds;

    const mouthWidth = Math.max(58, width + 12) * this.mouthScale;
    const mouthHeight = Math.max(44, height + 8) * this.mouthScale;

    context.save();

    context.translate(centerX, centerY);
    context.scale(this.direction, 1);

    // Ombre de la mâchoire.
    context.globalAlpha = 0.28 + this.jawOpening * 0.2;
    context.fillStyle = "#351d2a";

    context.beginPath();
    context.ellipse(
      0,
      0,
      mouthWidth * 0.52,
      mouthHeight * 0.48,
      0,
      0,
      Math.PI * 2
    );
    context.fill();

    context.globalAlpha = 1;

    this.drawUpperTeeth(context, mouthWidth, mouthHeight);
    this.drawLowerTeeth(context, mouthWidth, mouthHeight);
    this.drawSaliva(context, mouthWidth, mouthHeight);

    context.restore();
  }

  // --------------------------------------------------
  // UPPER TEETH
  // --------------------------------------------------

  drawUpperTeeth(context, width, height) {
    const gap = height * (0.1 + this.jawOpening * 0.48);

    const positions = [
      { x: -0.42, size: 1 },
      { x: -0.27, size: 1.4 },
      { x: -0.1, size: 1 },
      { x: 0.1, size: 1 },
      { x: 0.27, size: 1.4 },
      { x: 0.42, size: 1 },
    ];

    positions.forEach((tooth, index) => {
      const x = width * tooth.x;
      const isFang = index === 1 || index === 4;

      const toothWidth = isFang ? 19 : 12;
      const toothHeight = (isFang ? 20 : 7) * tooth.size * this.fangScale;

      this.drawTooth(context, x, -gap + 2, toothWidth, toothHeight, true);
    });
  }

  // --------------------------------------------------
  // LOWER TEETH
  // --------------------------------------------------

  drawLowerTeeth(context, width, height) {
    const gap = height * (0.1 + this.jawOpening * 0.48);

    const positions = [
      { x: -0.38, size: 0.9 },
      { x: -0.2, size: 1.2 },
      { x: 0, size: 0.8 },
      { x: 0.2, size: 1.2 },
      { x: 0.38, size: 0.9 },
    ];

    positions.forEach((tooth, index) => {
      const x = width * tooth.x;
      const isFang = index === 1 || index === 3;

      const toothWidth = isFang ? 14 : 9;
      const toothHeight = (isFang ? 18 : 9) * tooth.size * this.fangScale;

      this.drawTooth(context, x, gap - 2, toothWidth, toothHeight, false);
    });
  }

  // --------------------------------------------------
  // TOOTH DRAWING
  // --------------------------------------------------

  drawTooth(context, x, baseY, width, height, upper) {
    const tipY = upper ? baseY + height : baseY - height;

    context.save();

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

    context.strokeStyle = "#59434a";
    context.lineWidth = 1.2;
    context.stroke();

    // Reflet sur la dent.
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

    context.restore();
  }

  // --------------------------------------------------
  // SALIVA
  // --------------------------------------------------

  drawSaliva(context, width, height) {
    const gap = height * (0.1 + this.jawOpening * 0.48);

    if (this.jawOpening < 0.45) return;

    context.save();

    context.strokeStyle = "rgba(230, 190, 205, 0.7)";
    context.lineWidth = 1.5;

    const positions = [-0.3, 0, 0.3];

    positions.forEach((position, index) => {
      const x = width * position;
      const offset = Math.sin(this.timer * 0.6 + index) * 3;

      context.beginPath();
      context.moveTo(x, -gap * 0.1);

      context.quadraticCurveTo(x + offset, 0, x - offset, gap * 0.1);

      context.stroke();
    });

    context.restore();
  }

  // --------------------------------------------------
  // IMPACT
  // --------------------------------------------------

  drawImpact(context, bounds) {
    const { centerX, centerY } = bounds;

    const progress = this.timer / this.phaseDuration.IMPACT;
    const radius = 14 + progress * 32;

    context.save();

    // Flash central rouge et blanc.
    context.globalAlpha = this.impactFlash * 0.7;
    context.fillStyle = "#f04444";

    context.beginPath();
    context.arc(centerX, centerY, radius * 0.55, 0, Math.PI * 2);
    context.fill();

    context.globalAlpha = this.impactFlash;
    context.strokeStyle = "#ffffff";
    context.lineWidth = 3;

    // Rayons de l'impact.
    for (let i = 0; i < 10; i++) {
      const angle = (Math.PI * 2 * i) / 10;

      context.beginPath();

      context.moveTo(
        centerX + Math.cos(angle) * radius * 0.35,
        centerY + Math.sin(angle) * radius * 0.35
      );

      context.lineTo(
        centerX + Math.cos(angle) * radius,
        centerY + Math.sin(angle) * radius
      );

      context.stroke();
    }

    context.restore();
  }

  // --------------------------------------------------
  // PARTICLES DRAWING
  // --------------------------------------------------

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
