export class HyperFangAnimation {
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

    this.targetOriginalX = this.target.position.x;
    this.targetOriginalY = this.target.position.y;

    this.direction =
      this.target.position.x >= this.attacker.position.x ? 1 : -1;

    this.phase = HyperFangAnimation.PHASES.PREPARE;
    this.timer = 0;
    this.isFinished = false;

    this.phaseDuration = {
      PREPARE: 12,
      LUNGE: 18,
      OPEN: 24,
      BITE: 12,
      IMPACT: 22,
      RETURN: 14,
    };

    this.lungeDistance = 25;
    this.targetRecoil = 13;

    this.jawOpening = 0;
    this.impactFlash = 0;
    this.mouthScale = 1;
    this.fangScale = 1;

    this.particles = [];
    this.speedLines = [];
    this.impactRings = [];
    this.cracks = [];

    this.shakeTriggered = false;
  }

  // --------------------------------------------------
  // UPDATE
  // --------------------------------------------------

  update(context) {
    if (this.isFinished) return;

    this.timer++;

    switch (this.phase) {
      case HyperFangAnimation.PHASES.PREPARE:
        this.updatePrepare();
        break;

      case HyperFangAnimation.PHASES.LUNGE:
        this.updateLunge();
        break;

      case HyperFangAnimation.PHASES.OPEN:
        this.updateOpen();
        break;

      case HyperFangAnimation.PHASES.BITE:
        this.updateBite();
        break;

      case HyperFangAnimation.PHASES.IMPACT:
        this.updateImpact();
        break;

      case HyperFangAnimation.PHASES.RETURN:
        this.updateReturn();
        break;
    }

    this.updateParticles();
    this.updateSpeedLines();
    this.updateImpactRings();
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
    const progress = Math.min(1, this.timer / this.phaseDuration.PREPARE);

    this.mouthScale = 0.9 + progress * 0.12;

    if (this.timer % 3 === 0) {
      this.createEnergyParticles();
    }

    if (this.timer >= this.phaseDuration.PREPARE) {
      this.changePhase(HyperFangAnimation.PHASES.LUNGE);
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

    this.attacker.position.y =
      this.originalY - Math.sin(progress * Math.PI) * 5;

    this.createSpeedLines();

    if (this.timer >= this.phaseDuration.LUNGE) {
      this.changePhase(HyperFangAnimation.PHASES.OPEN);
    }
  }

  // --------------------------------------------------
  // OPEN
  // --------------------------------------------------

  updateOpen() {
    const progress = Math.min(1, this.timer / this.phaseDuration.OPEN);

    this.jawOpening = this.easeOut(progress);
    this.mouthScale = 1 + progress * 0.12;
    this.fangScale = 1 + progress * 0.25;

    if (this.timer % 3 === 0) {
      this.createEnergyParticles();
    }

    if (this.timer >= this.phaseDuration.OPEN) {
      this.changePhase(HyperFangAnimation.PHASES.BITE);
    }
  }

  // --------------------------------------------------
  // BITE
  // --------------------------------------------------

  updateBite() {
    const progress = Math.min(1, this.timer / this.phaseDuration.BITE);

    // Fermeture extrêmement brutale.
    this.jawOpening = 1 - this.easeIn(progress);
    this.fangScale = 1.25 + progress * 0.25;

    if (this.timer === 2) {
      this.createImpactParticles();
      this.createImpactRings();

      if (this.game.canvas?.startShake) {
        this.game.canvas.startShake(500, 8);
      }

      this.target.position.x =
        this.targetOriginalX + this.direction * this.targetRecoil;

      this.target.position.y = this.targetOriginalY + 4;

      this.shakeTriggered = true;
    }

    if (this.timer >= this.phaseDuration.BITE) {
      this.jawOpening = 0;
      this.changePhase(HyperFangAnimation.PHASES.IMPACT);
    }
  }

  // --------------------------------------------------
  // IMPACT
  // --------------------------------------------------

  updateImpact() {
    const progress = Math.min(1, this.timer / this.phaseDuration.IMPACT);

    this.impactFlash = Math.max(0, 1 - progress);

    // La cible reprend progressivement sa position.
    const recoilProgress = this.easeOut(progress);

    this.target.position.x =
      this.targetOriginalX +
      this.direction * this.targetRecoil * (1 - recoilProgress);

    this.target.position.y = this.targetOriginalY + 4 * (1 - recoilProgress);

    if (this.timer === 3) {
      this.createImpactParticles();
      this.createImpactRings();
      this.createCracks();
    }

    if (this.timer >= this.phaseDuration.IMPACT) {
      this.changePhase(HyperFangAnimation.PHASES.RETURN);
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

    this.attacker.position.y = this.originalY;

    this.mouthScale = 1.12 - progress * 0.12;
    this.fangScale = 1.5 - progress * 0.5;

    if (this.timer >= this.phaseDuration.RETURN) {
      this.attacker.position.x = this.originalX;
      this.attacker.position.y = this.originalY;

      this.target.position.x = this.targetOriginalX;
      this.target.position.y = this.targetOriginalY;

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

  easeInOut(value) {
    return value < 0.5
      ? 4 * value * value * value
      : 1 - Math.pow(-2 * value + 2, 3) / 2;
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

  createEnergyParticles() {
    const bounds = this.getTargetBounds();

    for (let i = 0; i < 2; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 25 + Math.random() * 20;

      this.particles.push({
        x: bounds.centerX + Math.cos(angle) * radius,
        y: bounds.centerY + Math.sin(angle) * radius,
        vx: -Math.cos(angle) * (1.5 + Math.random()),
        vy: -Math.sin(angle) * (1.5 + Math.random()),
        size: 2 + Math.random() * 3,
        life: 18,
        maxLife: 18,
        color: Math.random() > 0.5 ? "#ff4149" : "#ffb0a8",
      });
    }
  }

  createImpactParticles() {
    const bounds = this.getTargetBounds();

    for (let i = 0; i < 38; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2.5 + Math.random() * 5;

      this.particles.push({
        x: bounds.centerX,
        y: bounds.centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 4,
        life: 26,
        maxLife: 26,
        color: ["#ffffff", "#ff4545", "#c82036", "#ffb2a5"][i % 4],
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
  // SPEED LINES
  // --------------------------------------------------

  createSpeedLines() {
    const bounds = this.getTargetBounds();

    for (let i = 0; i < 3; i++) {
      this.speedLines.push({
        x: this.attacker.position.x + (this.direction === 1 ? -8 : 8),
        y: this.attacker.position.y + Math.random() * this.attacker.frameHeight,
        length: 12 + Math.random() * 20,
        life: 10,
        maxLife: 10,
        offset: (Math.random() - 0.5) * 30,
      });
    }
  }

  updateSpeedLines() {
    this.speedLines.forEach((line) => {
      line.x -= this.direction * 5;
      line.life--;
    });

    this.speedLines = this.speedLines.filter((line) => line.life > 0);
  }

  // --------------------------------------------------
  // IMPACT RINGS
  // --------------------------------------------------

  createImpactRings() {
    const bounds = this.getTargetBounds();

    this.impactRings.push({
      x: bounds.centerX,
      y: bounds.centerY,
      radius: 8,
      maxRadius: 55,
      speed: 5,
      life: 14,
      maxLife: 14,
      color: "#ffffff",
    });

    this.impactRings.push({
      x: bounds.centerX,
      y: bounds.centerY,
      radius: 5,
      maxRadius: 42,
      speed: 4,
      life: 12,
      maxLife: 12,
      color: "#ff444b",
    });
  }

  updateImpactRings() {
    this.impactRings.forEach((ring) => {
      ring.radius += ring.speed;
      ring.life--;
    });

    this.impactRings = this.impactRings.filter((ring) => ring.life > 0);
  }

  // --------------------------------------------------
  // CRACKS
  // --------------------------------------------------

  createCracks() {
    const bounds = this.getTargetBounds();

    for (let i = 0; i < 9; i++) {
      const angle = (Math.PI * 2 * i) / 9;

      this.cracks.push({
        x: bounds.centerX,
        y: bounds.centerY,
        angle,
        length: 12 + Math.random() * 17,
        life: 18,
        maxLife: 18,
      });
    }
  }

  // --------------------------------------------------
  // DRAW
  // --------------------------------------------------

  draw(context) {
    if (!context) return;

    const bounds = this.getTargetBounds();

    context.save();

    if (
      this.phase === HyperFangAnimation.PHASES.PREPARE ||
      this.phase === HyperFangAnimation.PHASES.OPEN ||
      this.phase === HyperFangAnimation.PHASES.BITE
    ) {
      this.drawEnergyAura(context, bounds);
    }

    if (
      this.phase === HyperFangAnimation.PHASES.OPEN ||
      this.phase === HyperFangAnimation.PHASES.BITE
    ) {
      this.drawMouth(context, bounds);
    }

    if (
      this.phase === HyperFangAnimation.PHASES.IMPACT ||
      this.phase === HyperFangAnimation.PHASES.BITE
    ) {
      this.drawImpact(context, bounds);
    }

    this.drawSpeedLines(context);
    this.drawImpactRings(context);
    this.drawCracks(context);
    this.drawParticles(context);

    context.restore();
  }

  // --------------------------------------------------
  // ENERGY AURA
  // --------------------------------------------------

  drawEnergyAura(context, bounds) {
    const { centerX, centerY } = bounds;

    const pulse = 0.8 + Math.sin(this.timer * 0.6) * 0.15;

    context.save();

    context.globalAlpha = 0.25 * pulse;
    context.fillStyle = "#ed263d";

    context.beginPath();
    context.ellipse(
      centerX,
      centerY,
      35 * this.mouthScale,
      25 * this.mouthScale,
      0,
      0,
      Math.PI * 2
    );
    context.fill();

    context.globalAlpha = 0.65 * pulse;
    context.strokeStyle = "#ff6970";
    context.lineWidth = 2;

    context.beginPath();
    context.ellipse(
      centerX,
      centerY,
      42 * this.mouthScale,
      31 * this.mouthScale,
      0,
      0,
      Math.PI * 2
    );
    context.stroke();

    context.restore();
  }

  // --------------------------------------------------
  // MOUTH
  // --------------------------------------------------

  drawMouth(context, bounds) {
    const { centerX, centerY, width, height } = bounds;

    const mouthWidth = Math.max(66, width + 28) * this.mouthScale;
    const mouthHeight = Math.max(54, height + 20) * this.mouthScale;

    const halfW = mouthWidth * 0.55;
    const halfH = mouthHeight * 0.5;

    // Contrôle de l'accentuation du losange.
    const pointX = halfW;
    const curveX = halfW * 0.48;
    const curveY = halfH * 0.48;

    context.save();

    context.translate(centerX, centerY);
    context.scale(this.direction, 1);

    // Contour extérieur : losange très prononcé.
    context.globalAlpha = 0.95;
    context.fillStyle = "#35101e";

    context.beginPath();
    context.moveTo(-pointX, 0);
    context.quadraticCurveTo(-curveX, -halfH, 0, -halfH);
    context.quadraticCurveTo(curveX, -halfH, pointX, 0);
    context.quadraticCurveTo(curveX, halfH, 0, halfH);
    context.quadraticCurveTo(-curveX, halfH, -pointX, 0);
    context.closePath();
    context.fill();

    // Cavité intérieure, avec la même géométrie.
    context.fillStyle = "#8f142d";

    context.beginPath();
    context.moveTo(-pointX * 0.88, 0);
    context.quadraticCurveTo(-curveX * 0.88, -halfH * 0.78, 0, -halfH * 0.78);
    context.quadraticCurveTo(curveX * 0.88, -halfH * 0.78, pointX * 0.88, 0);
    context.quadraticCurveTo(curveX * 0.88, halfH * 0.78, 0, halfH * 0.78);
    context.quadraticCurveTo(-curveX * 0.88, halfH * 0.78, -pointX * 0.88, 0);
    context.closePath();
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
    const gap = height * (0.1 + this.jawOpening * 0.5);

    const positions = [
      { x: -0.43, size: 0.9 },
      { x: -0.27, size: 1.65 },
      { x: -0.08, size: 0.9 },
      { x: 0.08, size: 0.9 },
      { x: 0.27, size: 1.65 },
      { x: 0.43, size: 0.9 },
    ];

    positions.forEach((tooth, index) => {
      const isFang = index === 1 || index === 4;

      const toothWidth = isFang ? 19 : 11;
      const toothHeight = (isFang ? 31 : 10) * tooth.size * this.fangScale;

      this.drawTooth(
        context,
        width * tooth.x,
        -gap + 2,
        toothWidth,
        toothHeight,
        true,
        isFang
      );
    });
  }

  // --------------------------------------------------
  // LOWER TEETH
  // --------------------------------------------------

  drawLowerTeeth(context, width, height) {
    const gap = height * (0.1 + this.jawOpening * 0.5);

    const positions = [
      { x: -0.4, size: 0.9 },
      { x: -0.2, size: 1.35 },
      { x: 0, size: 0.85 },
      { x: 0.2, size: 1.35 },
      { x: 0.4, size: 0.9 },
    ];

    positions.forEach((tooth, index) => {
      const isFang = index === 1 || index === 3;

      const toothWidth = isFang ? 16 : 10;
      const toothHeight = (isFang ? 25 : 9) * tooth.size * this.fangScale;

      this.drawTooth(
        context,
        width * tooth.x,
        gap - 2,
        toothWidth,
        toothHeight,
        false,
        isFang
      );
    });
  }

  // --------------------------------------------------
  // TOOTH DRAWING
  // --------------------------------------------------

  drawTooth(context, x, baseY, width, height, upper, isFang) {
    const tipY = upper ? baseY + height : baseY - height;

    context.save();

    context.beginPath();
    context.moveTo(x - width / 2, baseY);

    context.bezierCurveTo(
      x - width * 0.55,
      baseY + (upper ? 4 : -4),
      x - width * 0.25,
      tipY - (upper ? 3 : -3),
      x,
      tipY
    );

    context.bezierCurveTo(
      x + width * 0.25,
      tipY - (upper ? 3 : -3),
      x + width * 0.55,
      baseY + (upper ? 4 : -4),
      x + width / 2,
      baseY
    );

    context.closePath();

    const gradient = context.createLinearGradient(
      x - width / 2,
      baseY,
      x + width / 2,
      tipY
    );

    gradient.addColorStop(0, "#a99a87");
    gradient.addColorStop(0.3, "#eee2cc");
    gradient.addColorStop(0.65, "#ffffff");
    gradient.addColorStop(1, "#c9b99f");

    context.fillStyle = gradient;
    context.fill();

    context.strokeStyle = isFang ? "#4d2029" : "#59434a";
    context.lineWidth = isFang ? 1.6 : 1;
    context.stroke();

    // Reflet sur les grandes canines.
    if (isFang) {
      context.beginPath();
      context.moveTo(x - width * 0.2, baseY + (upper ? 1 : -1));

      context.quadraticCurveTo(
        x - width * 0.12,
        (baseY + tipY) / 2,
        x - width * 0.04,
        tipY + (upper ? 4 : -4)
      );

      context.strokeStyle = "rgba(255,255,255,0.95)";
      context.lineWidth = 1.8;
      context.lineCap = "round";
      context.stroke();
    }

    context.restore();
  }

  // --------------------------------------------------
  // SALIVA
  // --------------------------------------------------

  drawSaliva(context, width, height) {
    if (this.jawOpening < 0.5) return;

    const gap = height * (0.1 + this.jawOpening * 0.5);

    context.save();

    context.strokeStyle = "rgba(255, 190, 205, 0.8)";
    context.lineWidth = 1.6;

    [-0.3, 0, 0.3].forEach((position, index) => {
      const x = width * position;
      const offset = Math.sin(this.timer * 0.7 + index) * 4;

      context.beginPath();
      context.moveTo(x, -gap * 0.1);
      context.quadraticCurveTo(x + offset, 0, x - offset, gap * 0.1);
      context.stroke();
    });

    context.restore();
  }

  // --------------------------------------------------
  // IMPACT DRAWING
  // --------------------------------------------------

  drawImpact(context, bounds) {
    const { centerX, centerY } = bounds;

    const progress = Math.min(1, this.timer / this.phaseDuration.IMPACT);

    const radius = 12 + progress * 42;

    context.save();

    // Flash rouge central.
    context.globalAlpha = this.impactFlash * 0.7;
    context.fillStyle = "#f0233c";

    context.beginPath();
    context.arc(centerX, centerY, radius * 0.65, 0, Math.PI * 2);
    context.fill();

    // Éclair blanc.
    context.globalAlpha = this.impactFlash;
    context.strokeStyle = "#ffffff";
    context.lineWidth = 3;

    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 * i) / 12;

      context.beginPath();
      context.moveTo(
        centerX + Math.cos(angle) * radius * 0.3,
        centerY + Math.sin(angle) * radius * 0.3
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
  // SPEED LINES DRAWING
  // --------------------------------------------------

  drawSpeedLines(context) {
    context.save();

    this.speedLines.forEach((line) => {
      context.globalAlpha = line.life / line.maxLife;
      context.strokeStyle = "#ff6970";
      context.lineWidth = 2;

      context.beginPath();
      context.moveTo(line.x, line.y);
      context.lineTo(
        line.x - this.direction * line.length,
        line.y + line.offset
      );
      context.stroke();
    });

    context.restore();
  }

  // --------------------------------------------------
  // RINGS DRAWING
  // --------------------------------------------------

  drawImpactRings(context) {
    context.save();

    this.impactRings.forEach((ring) => {
      context.globalAlpha = ring.life / ring.maxLife;
      context.strokeStyle = ring.color;
      context.lineWidth = 2.5;

      context.beginPath();
      context.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2);
      context.stroke();
    });

    context.restore();
  }

  // --------------------------------------------------
  // CRACKS DRAWING
  // --------------------------------------------------

  drawCracks(context) {
    context.save();

    this.cracks.forEach((crack) => {
      const alpha = crack.life / crack.maxLife;

      context.globalAlpha = alpha;
      context.strokeStyle = "#ffb2b2";
      context.lineWidth = 1.5;

      context.beginPath();
      context.moveTo(crack.x, crack.y);

      context.lineTo(
        crack.x + Math.cos(crack.angle) * crack.length,
        crack.y + Math.sin(crack.angle) * crack.length
      );

      context.stroke();
      crack.life--;
    });

    this.cracks = this.cracks.filter((crack) => crack.life > 0);

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
