export class ExtremeSpeedAnimation {
  static PHASES = {
    PREPARE: "PREPARE",
    FLASH: "FLASH",
    DASH: "DASH",
    IMPACT: "IMPACT",
    RETURN: "RETURN",
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

    this.dashDistance = Math.max(0, distance - this.attacker.frameWidth * 0.55);

    this.phase = ExtremeSpeedAnimation.PHASES.PREPARE;
    this.timer = 0;
    this.isFinished = false;

    this.phaseDuration = {
      PREPARE: 8,
      FLASH: 5,
      DASH: 5,
      IMPACT: 12,
      RETURN: 8,
      FINISH: 6,
    };

    this.afterImages = [];
    this.speedLines = [];
    this.particles = [];
    this.shockwaves = [];

    this.flashAlpha = 0;
    this.impactProgress = 0;

    this.dashStartX = this.originalX;
    this.dashEndX = this.originalX + this.direction * this.dashDistance;
  }

  update(context) {
    if (this.isFinished) return;

    this.timer++;

    switch (this.phase) {
      case ExtremeSpeedAnimation.PHASES.PREPARE:
        this.updatePrepare();
        break;

      case ExtremeSpeedAnimation.PHASES.FLASH:
        this.updateFlash();
        break;

      case ExtremeSpeedAnimation.PHASES.DASH:
        this.updateDash();
        break;

      case ExtremeSpeedAnimation.PHASES.IMPACT:
        this.updateImpact();
        break;

      case ExtremeSpeedAnimation.PHASES.RETURN:
        this.updateReturn();
        break;

      case ExtremeSpeedAnimation.PHASES.FINISH:
        this.updateFinish();
        break;
    }

    this.updateEffects();
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

    // Le Pokémon se prépare à partir.
    this.attacker.position.x = this.originalX - this.direction * progress * 5;

    this.attacker.position.y = this.originalY + progress * 2;

    if (this.timer % 2 === 0) {
      this.createEnergyParticles();
    }

    if (this.timer >= this.phaseDuration.PREPARE) {
      this.changePhase(ExtremeSpeedAnimation.PHASES.FLASH);
    }
  }

  updateFlash() {
    const progress = this.timer / this.phaseDuration.FLASH;

    this.flashAlpha = Math.sin(progress * Math.PI);

    if (this.timer === 1) {
      this.createFlashParticles();

      // Flash de départ.
      this.game.canvas.startShake(3, 2);
    }

    if (this.timer >= this.phaseDuration.FLASH) {
      this.attacker.position.x = this.dashStartX;
      this.attacker.position.y = this.originalY;

      this.changePhase(ExtremeSpeedAnimation.PHASES.DASH);
    }
  }

  updateDash() {
    const progress = Math.min(1, this.timer / this.phaseDuration.DASH);

    const eased = this.easeOut(progress);

    this.attacker.position.x =
      this.dashStartX + (this.dashEndX - this.dashStartX) * eased;

    this.attacker.position.y =
      this.originalY + Math.sin(progress * Math.PI) * 2;

    // Les images rémanentes donnent l'impression de vitesse.
    if (this.timer % 1 === 0) {
      this.createAfterImage();
      this.createSpeedLines();
      this.createDashParticles();
    }

    if (this.timer >= this.phaseDuration.DASH) {
      this.attacker.position.x = this.dashEndX;
      this.attacker.position.y = this.originalY;

      this.createImpactParticles();
      this.createShockwave();

      this.game.canvas.startShake(12, 6);

      this.changePhase(ExtremeSpeedAnimation.PHASES.IMPACT);
    }
  }

  updateImpact() {
    const progress = Math.min(1, this.timer / this.phaseDuration.IMPACT);

    this.impactProgress = progress;

    // La cible est légèrement repoussée par le choc.
    this.target.position.x =
      this.targetOriginalX + this.direction * this.easeOut(progress) * 9;

    this.target.position.y =
      this.targetOriginalY - Math.sin(progress * Math.PI) * 4;

    if (this.timer >= this.phaseDuration.IMPACT) {
      this.target.position.x = this.targetOriginalX;
      this.target.position.y = this.targetOriginalY;

      this.changePhase(ExtremeSpeedAnimation.PHASES.RETURN);
    }
  }

  updateReturn() {
    const progress = Math.min(1, this.timer / this.phaseDuration.RETURN);

    const eased = this.easeOut(progress);

    this.attacker.position.x =
      this.dashEndX + (this.originalX - this.dashEndX) * eased;

    this.attacker.position.y =
      this.originalY - Math.sin(progress * Math.PI) * 3;

    if (this.timer >= this.phaseDuration.RETURN) {
      this.restorePositions();
      this.changePhase(ExtremeSpeedAnimation.PHASES.FINISH);
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

  createEnergyParticles() {
    const x = this.attacker.position.x + this.attacker.frameWidth / 2;

    const y = this.attacker.position.y + this.attacker.frameHeight / 2;

    for (let i = 0; i < 3; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 12 + Math.random() * 15;

      this.particles.push({
        x: x + Math.cos(angle) * distance,
        y: y + Math.sin(angle) * distance,
        vx: -Math.cos(angle) * 0.8,
        vy: -Math.sin(angle) * 0.8,
        size: 2 + Math.random() * 2,
        life: 12,
        maxLife: 12,
        color: "#ffe9a6",
      });
    }
  }

  createFlashParticles() {
    const x = this.attacker.position.x + this.attacker.frameWidth / 2;

    const y = this.attacker.position.y + this.attacker.frameHeight / 2;

    for (let i = 0; i < 18; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 4;

      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 3,
        life: 10,
        maxLife: 10,
        color: i % 2 === 0 ? "#ffffff" : "#ffe28a",
      });
    }
  }

  createAfterImage() {
    this.afterImages.push({
      x: this.attacker.position.x,
      y: this.attacker.position.y,
      width: this.attacker.frameWidth,
      height: this.attacker.frameHeight,
      alpha: 0.65,
      life: 8,
      maxLife: 8,
    });
  }

  createSpeedLines() {
    const x = this.attacker.position.x + this.attacker.frameWidth / 2;

    const y = this.attacker.position.y + this.attacker.frameHeight / 2;

    for (let i = 0; i < 5; i++) {
      this.speedLines.push({
        x: x - this.direction * (10 + Math.random() * 30),
        y: y + (Math.random() - 0.5) * 35,
        length: 12 + Math.random() * 30,
        life: 5 + Math.random() * 3,
        maxLife: 8,
        width: 1 + Math.random() * 2,
      });
    }
  }

  createDashParticles() {
    const x = this.attacker.position.x + this.attacker.frameWidth / 2;

    const y = this.attacker.position.y + this.attacker.frameHeight / 2;

    this.particles.push({
      x: x - this.direction * 8,
      y: y + (Math.random() - 0.5) * 20,
      vx: -this.direction * (1 + Math.random() * 3),
      vy: (Math.random() - 0.5) * 2,
      size: 1.5 + Math.random() * 2,
      life: 9,
      maxLife: 9,
      color: Math.random() > 0.5 ? "#ffffff" : "#ffe28a",
    });
  }

  createImpactParticles() {
    const x = this.target.position.x + this.target.frameWidth / 2;

    const y = this.target.position.y + this.target.frameHeight / 2;

    for (let i = 0; i < 38; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 5;

      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 4,
        life: 18 + Math.random() * 8,
        maxLife: 26,
        color: ["#ffffff", "#fff3c4", "#ffe078", "#f3b83f"][i % 4],
      });
    }
  }

  createShockwave() {
    this.shockwaves.push({
      x: this.target.position.x + this.target.frameWidth / 2,
      y: this.target.position.y + this.target.frameHeight / 2,
      radius: 4,
      maxRadius: 42,
      life: 14,
      maxLife: 14,
    });
  }

  updateEffects() {
    this.afterImages.forEach((image) => {
      image.life--;
      image.alpha = (image.life / image.maxLife) * 0.65;
    });

    this.afterImages = this.afterImages.filter((image) => image.life > 0);

    this.speedLines.forEach((line) => {
      line.x -= this.direction * 5;
      line.life--;
    });

    this.speedLines = this.speedLines.filter((line) => line.life > 0);

    this.particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      particle.vx *= 0.94;
      particle.vy *= 0.94;

      particle.life--;
    });

    this.particles = this.particles.filter((particle) => particle.life > 0);

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
    this.drawAfterImages(context);
    this.drawSpeedLines(context);
    this.drawParticles(context);
    this.drawFlash(context);
    this.drawImpact(context);

    context.restore();
  }

  drawAfterImages(context) {
    context.save();

    this.afterImages.forEach((image) => {
      context.globalAlpha = image.alpha;

      const gradient = context.createLinearGradient(
        image.x,
        image.y,
        image.x + image.width,
        image.y + image.height
      );

      gradient.addColorStop(0, "rgba(255,255,255,0)");
      gradient.addColorStop(0.5, "rgba(255,255,255,0.8)");
      gradient.addColorStop(1, "rgba(255,220,130,0)");

      context.fillStyle = gradient;

      context.fillRect(image.x, image.y, image.width, image.height);
    });

    context.restore();
  }

  drawSpeedLines(context) {
    context.save();

    this.speedLines.forEach((line) => {
      context.globalAlpha = line.life / line.maxLife;
      context.strokeStyle = "#fff1bd";
      context.lineWidth = line.width;

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
      context.strokeStyle = "#fff0b0";
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

  drawFlash(context) {
    if (this.phase !== ExtremeSpeedAnimation.PHASES.FLASH) return;

    const x = this.attacker.position.x + this.attacker.frameWidth / 2;

    const y = this.attacker.position.y + this.attacker.frameHeight / 2;

    context.save();
    context.globalAlpha = this.flashAlpha;

    const gradient = context.createRadialGradient(x, y, 0, x, y, 48);

    gradient.addColorStop(0, "#ffffff");
    gradient.addColorStop(0.35, "#fff4ca");
    gradient.addColorStop(0.7, "rgba(255,210,100,0.6)");
    gradient.addColorStop(1, "rgba(255,220,120,0)");

    context.fillStyle = gradient;
    context.beginPath();
    context.arc(x, y, 48, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }

  drawImpact(context) {
    if (this.phase !== ExtremeSpeedAnimation.PHASES.IMPACT) return;

    const x = this.target.position.x + this.target.frameWidth / 2;

    const y = this.target.position.y + this.target.frameHeight / 2;

    const progress = this.impactProgress;
    const alpha = 1 - progress;
    const radius = 10 + progress * 35;

    context.save();

    const gradient = context.createRadialGradient(x, y, 0, x, y, radius);

    gradient.addColorStop(0, `rgba(255,255,255,${alpha})`);
    gradient.addColorStop(0.3, `rgba(255,245,200,${alpha})`);
    gradient.addColorStop(0.7, `rgba(255,200,90,${alpha * 0.7})`);
    gradient.addColorStop(1, "rgba(255,180,50,0)");

    context.fillStyle = gradient;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();

    // Éclats lumineux de l'impact.
    context.strokeStyle = `rgba(255,255,255,${alpha})`;
    context.lineWidth = 3;

    for (let i = 0; i < 10; i++) {
      const angle = (Math.PI * 2 * i) / 10;
      const inner = 10 + progress * 10;
      const outer = 20 + progress * 30;

      context.beginPath();
      context.moveTo(x + Math.cos(angle) * inner, y + Math.sin(angle) * inner);

      context.lineTo(x + Math.cos(angle) * outer, y + Math.sin(angle) * outer);

      context.stroke();
    }

    context.restore();
  }
}
