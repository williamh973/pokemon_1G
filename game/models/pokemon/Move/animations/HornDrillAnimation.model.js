export class HornDrillAnimation {
  static PHASES = {
    PREPARE: "PREPARE",
    CHARGE: "CHARGE",
    DRILL: "DRILL",
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

    this.direction =
      this.target.position.x >= this.attacker.position.x ? 1 : -1;

    this.phase = HornDrillAnimation.PHASES.PREPARE;
    this.timer = 0;
    this.isFinished = false;

    this.rotation = 0;
    this.drillScale = 0;

    this.backgroundIntensity = 0;
    this.vortexIntensity = 0;
    this.impactFlash = 0;
    this.impactRingScale = 0;

    this.particles = [];
    this.energyParticles = [];
    this.speedLines = [];

    this.phaseDuration = {
      PREPARE: 12,
      CHARGE: 22,
      DRILL: 20,
      IMPACT: 20,
      RETURN: 16,
    };

    this.lungeDistance = 22;

    this.drillLength = 43;
    this.drillWidth = 15;

    this.vortexRotation = 0;
    this.vortexRings = 5;

    this.shakeTriggered = false;
  }

  // --------------------------------------------------
  // UPDATE
  // --------------------------------------------------

  update(context) {
    if (this.isFinished) return;

    this.timer++;

    switch (this.phase) {
      case HornDrillAnimation.PHASES.PREPARE:
        this.updatePrepare();
        break;

      case HornDrillAnimation.PHASES.CHARGE:
        this.updateCharge();
        break;

      case HornDrillAnimation.PHASES.DRILL:
        this.updateDrill();
        break;

      case HornDrillAnimation.PHASES.IMPACT:
        this.updateImpact();
        break;

      case HornDrillAnimation.PHASES.RETURN:
        this.updateReturn();
        break;
    }

    this.updateParticles();
    this.updateEnergyParticles();
    this.updateSpeedLines();

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

  clamp(value) {
    return Math.max(0, Math.min(1, value));
  }

  // --------------------------------------------------
  // PREPARE
  // --------------------------------------------------

  updatePrepare() {
    const progress = this.clamp(this.timer / this.phaseDuration.PREPARE);

    this.backgroundIntensity = this.easeOut(progress) * 0.72;
    this.vortexIntensity = this.easeOut(progress);

    const anticipation = Math.sin(progress * Math.PI);

    this.attacker.position.x =
      this.originalX - this.direction * anticipation * 4;

    this.drillScale = this.easeOut(progress);

    this.vortexRotation += 0.025;

    if (this.timer % 2 === 0) {
      this.createEnergyParticles();
    }

    if (this.timer >= this.phaseDuration.PREPARE) {
      this.attacker.position.x = this.originalX;
      this.changePhase(HornDrillAnimation.PHASES.CHARGE);
    }
  }

  // --------------------------------------------------
  // CHARGE
  // --------------------------------------------------

  updateCharge() {
    const progress = this.clamp(this.timer / this.phaseDuration.CHARGE);

    this.backgroundIntensity = 0.72 + progress * 0.18;
    this.vortexIntensity = 1;

    this.rotation += 0.4 + progress * 1.5;
    this.vortexRotation += 0.08 + progress * 0.1;

    this.drillScale = 1;

    if (this.timer % 2 === 0) {
      this.createChargeParticles();
      this.createEnergyParticles();
    }

    if (this.timer >= this.phaseDuration.CHARGE) {
      this.changePhase(HornDrillAnimation.PHASES.DRILL);
    }
  }

  // --------------------------------------------------
  // DRILL
  // --------------------------------------------------

  updateDrill() {
    const progress = this.clamp(this.timer / this.phaseDuration.DRILL);

    const eased = this.easeInOut(progress);

    this.backgroundIntensity = 0.9;
    this.vortexIntensity = 1;

    this.rotation += 1.9;
    this.vortexRotation += 0.16;

    this.attacker.position.x =
      this.originalX + this.direction * this.lungeDistance * eased;

    this.drillScale = 1;

    if (this.timer % 2 === 0) {
      this.createSpeedLines();
      this.createDrillParticles();
      this.createEnergyParticles();
    }

    if (this.timer >= this.phaseDuration.DRILL) {
      this.createImpactParticles();

      if (!this.shakeTriggered && this.game.canvas.startShake) {
        this.game.canvas.startShake(14, 6);
        this.shakeTriggered = true;
      }

      this.changePhase(HornDrillAnimation.PHASES.IMPACT);
    }
  }

  // --------------------------------------------------
  // IMPACT
  // --------------------------------------------------

  updateImpact() {
    const progress = this.clamp(this.timer / this.phaseDuration.IMPACT);

    this.backgroundIntensity = 0.9 * (1 - progress);
    this.vortexIntensity = 1 - progress * 0.5;

    // Flash blanc très intense au début de l'impact.
    this.impactFlash =
      progress < 0.25 ? 1 : 1 - this.easeOut((progress - 0.25) / 0.75);

    this.impactRingScale = this.easeOut(progress);

    this.rotation += 0.3 * (1 - progress);

    if (this.timer === 3) {
      this.createImpactParticles();

      if (this.game.canvas.startShake) {
        this.game.canvas.startShake(8, 4);
      }
    }

    if (this.timer >= this.phaseDuration.IMPACT) {
      this.changePhase(HornDrillAnimation.PHASES.RETURN);
    }
  }

  // --------------------------------------------------
  // RETURN
  // --------------------------------------------------

  updateReturn() {
    const progress = this.clamp(this.timer / this.phaseDuration.RETURN);

    const eased = this.easeOut(progress);

    this.attacker.position.x =
      this.originalX + this.direction * this.lungeDistance * (1 - eased);

    this.drillScale = 1 - eased;

    this.backgroundIntensity = 0;
    this.vortexIntensity = 0;

    this.impactFlash = 0;

    if (this.timer >= this.phaseDuration.RETURN) {
      this.attacker.position.x = this.originalX;
      this.attacker.position.y = this.originalY;

      this.isFinished = true;
    }
  }

  // --------------------------------------------------
  // POSITIONS
  // --------------------------------------------------

  getAttackerCenter() {
    const scale = this.attacker.scale || 1;

    return {
      x: this.attacker.position.x + (this.attacker.frameWidth * scale) / 2,
      y: this.attacker.position.y + (this.attacker.frameHeight * scale) / 2,
    };
  }

  getTargetCenter() {
    const scale = this.target.scale || 1;

    return {
      x: this.target.position.x + (this.target.frameWidth * scale) / 2,
      y: this.target.position.y + (this.target.frameHeight * scale) / 2,
    };
  }

  getBattleCenter() {
    const attacker = this.getAttackerCenter();
    const target = this.getTargetCenter();

    return {
      x: (attacker.x + target.x) / 2,
      y: (attacker.y + target.y) / 2,
    };
  }

  // --------------------------------------------------
  // ENERGY PARTICLES
  // --------------------------------------------------

  createEnergyParticles() {
    const center = this.getAttackerCenter();

    const angle = Math.random() * Math.PI * 2;
    const radius = 25 + Math.random() * 25;

    this.energyParticles.push({
      angle,
      radius,
      x: center.x + Math.cos(angle) * radius,
      y: center.y + Math.sin(angle) * radius,
      speed: 0.06 + Math.random() * 0.08,
      life: 30 + Math.random() * 15,
      maxLife: 45,
      size: 1.5 + Math.random() * 2,
    });
  }

  updateEnergyParticles() {
    const center = this.getAttackerCenter();

    this.energyParticles.forEach((particle) => {
      particle.angle += particle.speed;
      particle.radius -= 0.15;

      particle.x = center.x + Math.cos(particle.angle) * particle.radius;

      particle.y = center.y + Math.sin(particle.angle) * particle.radius;

      particle.life--;
    });

    this.energyParticles = this.energyParticles.filter(
      (particle) => particle.life > 0
    );
  }

  // --------------------------------------------------
  // CHARGE PARTICLES
  // --------------------------------------------------

  createChargeParticles() {
    const center = this.getAttackerCenter();

    const angle = Math.random() * Math.PI * 2;
    const radius = 12 + Math.random() * 15;

    this.particles.push({
      x: center.x + Math.cos(angle) * radius,
      y: center.y + Math.sin(angle) * radius,
      vx: Math.cos(angle) * 0.7,
      vy: Math.sin(angle) * 0.7,
      size: 1 + Math.random() * 2,
      life: 14,
      maxLife: 14,
      color: "#c9edff",
    });
  }

  createDrillParticles() {
    const center = this.getAttackerCenter();

    this.particles.push({
      x: center.x + this.direction * 25,
      y: center.y + (Math.random() - 0.5) * 20,
      vx: -this.direction * (1 + Math.random() * 2),
      vy: (Math.random() - 0.5) * 2,
      size: 1 + Math.random() * 2,
      life: 12,
      maxLife: 12,
      color: Math.random() > 0.5 ? "#ffffff" : "#83c9ec",
    });
  }

  createSpeedLines() {
    const center = this.getAttackerCenter();

    this.speedLines.push({
      x: center.x - this.direction * (18 + Math.random() * 20),
      y: center.y + (Math.random() - 0.5) * 35,
      length: 10 + Math.random() * 18,
      life: 12,
      maxLife: 12,
    });
  }

  createImpactParticles() {
    const center = this.getTargetCenter();

    for (let i = 0; i < 45; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 5;

      this.particles.push({
        x: center.x,
        y: center.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 3,
        life: 24,
        maxLife: 24,
        color: i % 3 === 0 ? "#ffffff" : i % 2 === 0 ? "#bceaff" : "#759bb5",
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
  // SPEED LINES UPDATE
  // --------------------------------------------------

  updateSpeedLines() {
    this.speedLines.forEach((line) => {
      line.life--;
    });

    this.speedLines = this.speedLines.filter((line) => line.life > 0);
  }

  // --------------------------------------------------
  // DRAW
  // --------------------------------------------------

  draw(context) {
    context.save();

    this.drawBackgroundEffect(context);

    if (this.phase !== HornDrillAnimation.PHASES.RETURN) {
      this.drawVortex(context);
      this.drawEnergyParticles(context);
      this.drawDrill(context);
    }

    this.drawSpeedLines(context);
    this.drawParticles(context);

    if (this.phase === HornDrillAnimation.PHASES.IMPACT) {
      this.drawImpactEffect(context);
    }

    context.restore();
  }

  // --------------------------------------------------
  // BACKGROUND EFFECT
  // --------------------------------------------------

  drawBackgroundEffect(context) {
    if (this.backgroundIntensity <= 0) return;

    const intensity = this.backgroundIntensity;

    const width = context.canvas.width;
    const height = context.canvas.height;

    context.save();

    // Assombrissement global.
    context.fillStyle = `rgba(3, 8, 28, ${intensity * 0.78})`;
    context.fillRect(0, 0, width, height);

    // Halo énergétique au centre du combat.
    const center = this.getBattleCenter();

    const gradient = context.createRadialGradient(
      center.x,
      center.y,
      5,
      center.x,
      center.y,
      Math.max(width, height) * 0.65
    );

    gradient.addColorStop(0, `rgba(37, 130, 210, ${intensity * 0.3})`);

    gradient.addColorStop(0.45, `rgba(15, 65, 130, ${intensity * 0.2})`);

    gradient.addColorStop(1, "rgba(0, 0, 20, 0)");

    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);

    // Lignes radiales de vitesse.
    if (
      this.phase === HornDrillAnimation.PHASES.DRILL ||
      this.phase === HornDrillAnimation.PHASES.CHARGE
    ) {
      this.drawRadialLines(context, center, intensity);
    }

    context.restore();
  }

  // --------------------------------------------------
  // RADIAL LINES
  // --------------------------------------------------

  drawRadialLines(context, center, intensity) {
    const width = context.canvas.width;
    const height = context.canvas.height;

    const maxRadius = Math.sqrt(width * width + height * height);

    context.save();

    context.strokeStyle = `rgba(160, 220, 255, ${intensity * 0.35})`;
    context.lineWidth = 1;

    for (let i = 0; i < 24; i++) {
      const angle = (Math.PI * 2 * i) / 24 + this.vortexRotation * 0.15;

      const innerRadius = 35 + Math.sin(this.vortexRotation * 3 + i) * 12;

      context.beginPath();

      context.moveTo(
        center.x + Math.cos(angle) * innerRadius,
        center.y + Math.sin(angle) * innerRadius
      );

      context.lineTo(
        center.x + Math.cos(angle) * maxRadius,
        center.y + Math.sin(angle) * maxRadius
      );

      context.stroke();
    }

    context.restore();
  }

  // --------------------------------------------------
  // VORTEX
  // --------------------------------------------------

  drawVortex(context) {
    if (this.vortexIntensity <= 0) return;

    const center = this.getAttackerCenter();

    context.save();

    context.translate(center.x, center.y);

    for (let i = 0; i < this.vortexRings; i++) {
      const progress = i / this.vortexRings;

      const radius = 24 + i * 12;

      const rotation = this.vortexRotation * (i % 2 === 0 ? 1 : -1);

      context.save();
      context.rotate(rotation);

      context.globalAlpha = this.vortexIntensity * (0.6 - progress * 0.35);

      context.strokeStyle = i % 2 === 0 ? "#a8e7ff" : "#4a9bd0";

      context.lineWidth = 1.5 + (1 - progress);

      context.beginPath();

      context.ellipse(
        0,
        0,
        radius,
        radius * 0.45,
        0,
        -Math.PI * 0.7,
        Math.PI * 0.7
      );

      context.stroke();

      context.restore();
    }

    context.restore();
  }

  // --------------------------------------------------
  // ENERGY PARTICLES DRAW
  // --------------------------------------------------

  drawEnergyParticles(context) {
    this.energyParticles.forEach((particle) => {
      context.save();

      context.globalAlpha = particle.life / particle.maxLife;

      context.fillStyle = "#c9edff";
      context.shadowColor = "#4cbcff";
      context.shadowBlur = 8;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);

      context.fill();

      context.restore();
    });
  }

  // --------------------------------------------------
  // DRILL
  // --------------------------------------------------

  drawDrill(context) {
    const center = this.getAttackerCenter();

    context.save();

    context.translate(center.x + this.direction * 13, center.y - 2);

    context.scale(this.direction, 1);
    context.scale(this.drillScale, this.drillScale);

    this.drawDrillBody(context);
    this.drawHelicalFlutes(context);
    this.drawDrillHighlights(context);

    context.restore();
  }

  drawDrillBody(context) {
    const length = this.drillLength;
    const width = this.drillWidth;

    context.save();

    context.beginPath();
    context.moveTo(0, -width * 0.65);
    context.lineTo(length * 0.8, -width * 0.15);
    context.lineTo(length, 0);
    context.lineTo(length * 0.8, width * 0.15);
    context.lineTo(0, width * 0.65);
    context.closePath();

    context.fillStyle = "#263e50";
    context.fill();

    context.beginPath();
    context.moveTo(0, -width);
    context.lineTo(length * 0.82, -width * 0.32);
    context.lineTo(length, 0);
    context.lineTo(length * 0.82, width * 0.32);
    context.lineTo(0, width);
    context.closePath();

    const gradient = context.createLinearGradient(0, -width, 0, width);

    gradient.addColorStop(0, "#526a7a");
    gradient.addColorStop(0.2, "#dcecf5");
    gradient.addColorStop(0.38, "#ffffff");
    gradient.addColorStop(0.58, "#9bb9ca");
    gradient.addColorStop(0.8, "#526d80");
    gradient.addColorStop(1, "#263f50");

    context.fillStyle = gradient;
    context.fill();

    context.strokeStyle = "#314d60";
    context.lineWidth = 1.2;
    context.stroke();

    context.beginPath();
    context.moveTo(length * 0.78, -width * 0.32);
    context.lineTo(length, 0);
    context.lineTo(length * 0.78, width * 0.32);

    context.fillStyle = "#ffffff";
    context.fill();

    context.strokeStyle = "#d8f4ff";
    context.lineWidth = 1;
    context.stroke();

    context.restore();
  }

  // --------------------------------------------------
  // HELICAL FLUTES
  // --------------------------------------------------

  drawHelicalFlutes(context) {
    const length = this.drillLength;
    const width = this.drillWidth;

    context.save();

    for (let i = 0; i < 3; i++) {
      const offset = (Math.PI * 2 * i) / 3;

      context.beginPath();

      for (let step = 0; step <= 24; step++) {
        const progress = step / 24;
        const x = progress * length * 0.88;

        const radius = width * (1 - progress * 0.65);

        const angle = this.rotation + progress * Math.PI * 3 + offset;

        const y = Math.sin(angle) * radius * 0.7;

        if (step === 0) {
          context.moveTo(x, y);
        } else {
          context.lineTo(x, y);
        }
      }

      context.strokeStyle = i === 0 ? "#304f63" : "#739bb0";

      context.lineWidth = i === 0 ? 3 : 2;
      context.lineCap = "round";
      context.stroke();

      context.globalAlpha = 0.75;
      context.strokeStyle = "#effaff";
      context.lineWidth = 0.8;

      context.beginPath();

      for (let step = 0; step <= 24; step++) {
        const progress = step / 24;
        const x = progress * length * 0.88;

        const radius = width * (1 - progress * 0.65);

        const angle = this.rotation + progress * Math.PI * 3 + offset;

        const y = Math.sin(angle + 0.18) * radius * 0.7 - 1.5;

        if (step === 0) {
          context.moveTo(x, y);
        } else {
          context.lineTo(x, y);
        }
      }

      context.stroke();
      context.globalAlpha = 1;
    }

    context.restore();
  }

  // --------------------------------------------------
  // DRILL HIGHLIGHTS
  // --------------------------------------------------

  drawDrillHighlights(context) {
    const length = this.drillLength;
    const width = this.drillWidth;

    context.save();

    context.beginPath();
    context.moveTo(2, -width * 0.5);
    context.lineTo(length * 0.72, -width * 0.19);

    context.strokeStyle = "rgba(255,255,255,0.9)";
    context.lineWidth = 1.5;
    context.stroke();

    context.strokeStyle = "rgba(170,225,255,0.75)";
    context.lineWidth = 1.5;

    for (let i = 0; i < 3; i++) {
      const radius = 13 + i * 4;

      context.beginPath();
      context.ellipse(5, 0, 5, radius, this.rotation + i, 0, Math.PI * 2);

      context.stroke();
    }

    context.restore();
  }

  // --------------------------------------------------
  // IMPACT EFFECT
  // --------------------------------------------------

  drawImpactEffect(context) {
    const center = this.getTargetCenter();

    const radius = 10 + this.impactRingScale * 42;

    context.save();

    // Flash blanc sur l'ensemble du canvas.
    context.globalAlpha = this.impactFlash * 0.8;
    context.fillStyle = "#ffffff";

    context.fillRect(0, 0, context.canvas.width, context.canvas.height);

    // Halo central.
    context.globalAlpha = this.impactFlash * 0.8;

    const gradient = context.createRadialGradient(
      center.x,
      center.y,
      2,
      center.x,
      center.y,
      radius * 1.8
    );

    gradient.addColorStop(0, "#ffffff");
    gradient.addColorStop(0.3, "#a9e6ff");
    gradient.addColorStop(1, "rgba(80,160,255,0)");

    context.fillStyle = gradient;

    context.beginPath();
    context.arc(center.x, center.y, radius * 1.8, 0, Math.PI * 2);
    context.fill();

    // Trois ondes de choc.
    context.globalAlpha = this.impactRingScale;
    context.strokeStyle = "#e6f8ff";
    context.lineWidth = 3;

    for (let i = 0; i < 3; i++) {
      const ringRadius = radius + i * 9;

      context.beginPath();
      context.ellipse(
        center.x,
        center.y,
        ringRadius,
        ringRadius * 0.55,
        0,
        0,
        Math.PI * 2
      );

      context.stroke();
    }

    // Éclats radiaux.
    context.strokeStyle = "#ffffff";
    context.lineWidth = 2;

    for (let i = 0; i < 16; i++) {
      const angle = (Math.PI * 2 * i) / 16;

      context.beginPath();

      context.moveTo(
        center.x + Math.cos(angle) * radius * 0.3,
        center.y + Math.sin(angle) * radius * 0.3
      );

      context.lineTo(
        center.x + Math.cos(angle) * radius,
        center.y + Math.sin(angle) * radius
      );

      context.stroke();
    }

    context.restore();
  }

  // --------------------------------------------------
  // SPEED LINES
  // --------------------------------------------------

  drawSpeedLines(context) {
    this.speedLines.forEach((line) => {
      context.save();

      context.globalAlpha = line.life / line.maxLife;
      context.strokeStyle = "#c8efff";
      context.lineWidth = 2;

      context.beginPath();

      context.moveTo(line.x, line.y);

      context.lineTo(line.x - this.direction * line.length, line.y);

      context.stroke();

      context.restore();
    });
  }

  // --------------------------------------------------
  // PARTICLES
  // --------------------------------------------------

  drawParticles(context) {
    this.particles.forEach((particle) => {
      context.save();

      context.globalAlpha = particle.life / particle.maxLife;

      context.fillStyle = particle.color;

      context.shadowColor = particle.color;
      context.shadowBlur = 5;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);

      context.fill();

      context.restore();
    });
  }
}
