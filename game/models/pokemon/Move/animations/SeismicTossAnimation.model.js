export class SeismicTossAnimation {
  constructor(game, viewers, turnAction) {
    this.game = game;
    this.viewers = viewers;
    this.turnAction = turnAction;

    if (this.viewers.front.slot.content === turnAction.pokemon) {
      this.pokemonViewer = this.viewers.front;
      this.targetViewer = this.viewers.back;
    } else {
      this.pokemonViewer = this.viewers.back;
      this.targetViewer = this.viewers.front;
    }

    this.attackerSprite = this.pokemonViewer.sprite;
    this.targetSprite = this.targetViewer.sprite;

    this.phase = "GRAB";
    this.timer = 0;
    this.isFinished = false;

    this.duration = {
      GRAB: 22,
      ASCEND: 45,
      SPIN: 40,
      THROW: 22,
      IMPACT: 35,
      FINISH: 30,
    };

    this.attackerCenter = this.getCenter(this.pokemonViewer);
    this.targetCenter = this.getCenter(this.targetViewer);

    this.targetOriginalPosition = {
      x: this.targetSprite.position.x,
      y: this.targetSprite.position.y,
    };

    // Dans le constructeur : on conserve le véritable sprite adverse.
    this.targetSprite = this.targetViewer.sprite;

    this.originalTargetPosition = {
      x: this.targetSprite.position.x,
      y: this.targetSprite.position.y,
    };

    this.originalTargetScale = this.targetSprite.scale;

    this.originalTargetCenter = this.getSpriteCenter(this.targetSprite);

    this.direction = this.targetCenter.x >= this.attackerCenter.x ? 1 : -1;

    this.targetVisual = {
      x: this.targetCenter.x,
      y: this.targetCenter.y,
      scale: 1,
      rotation: 0,
      alpha: 1,
    };

    this.particles = [];
    this.shockwaves = [];
    this.debris = [];

    this.spinAngle = 0;
    this.impactTriggered = false;
  }
  getSpriteCenter(sprite) {
    const width = sprite.frameWidth * sprite.scale;
    const height = sprite.frameHeight * sprite.scale;

    return {
      x: sprite.position.x + width / 2,
      y: sprite.position.y + height / 2,
    };
  }

  setTargetPosition(center, scale = this.originalTargetScale) {
    const width = this.targetSprite.frameWidth * scale;
    const height = this.targetSprite.frameHeight * scale;

    this.targetSprite.scale = scale;

    this.targetSprite.position.x = center.x - width / 2;
    this.targetSprite.position.y = center.y - height / 2;
  }

  restoreTarget() {
    this.targetSprite.position.x = this.originalTargetPosition.x;
    this.targetSprite.position.y = this.originalTargetPosition.y;

    this.targetSprite.scale = this.originalTargetScale;
  }

  getCenter(viewer) {
    const sprite = viewer.sprite;

    return {
      x: sprite.position.x + (sprite.frameWidth * sprite.scale) / 2,
      y: sprite.position.y + (sprite.frameHeight * sprite.scale) / 2,
    };
  }

  update(context) {
    if (this.isFinished) return;

    this.timer++;

    switch (this.phase) {
      case "GRAB":
        this.grab();
        break;

      case "ASCEND":
        this.ascend();
        break;

      case "SPIN":
        this.spin();
        break;

      case "THROW":
        this.throwTarget();
        break;

      case "IMPACT":
        this.impact();
        break;

      case "FINISH":
        this.finish();
        break;
    }

    this.updateEffects();
    this.draw(context);
  }

  changePhase(phase) {
    this.phase = phase;
    this.timer = 0;
  }

  grab() {
    if (this.timer % 4 === 0) {
      this.createEnergyParticle();
    }

    if (this.timer >= this.duration.GRAB) {
      this.changePhase("ASCEND");
    }
  }

  ascend() {
    const progress = Math.min(1, this.timer / this.duration.ASCEND);

    const eased = progress * progress * (3 - 2 * progress);

    this.targetVisual.x = this.targetCenter.x - this.direction * 35 * eased;

    this.targetVisual.y = this.targetCenter.y - 115 * eased;

    this.targetVisual.scale = 1 - progress * 0.12;

    if (this.timer % 4 === 0) {
      this.createEnergyParticle();
    }

    if (this.timer >= this.duration.ASCEND) {
      this.changePhase("SPIN");
    }
  }

  spin() {
    const progress = this.timer / this.duration.SPIN;

    this.spinAngle += 0.35 + progress * 0.25;

    this.targetVisual.x = this.attackerCenter.x + Math.cos(this.spinAngle) * 45;

    this.targetVisual.y =
      this.attackerCenter.y - 110 + Math.sin(this.spinAngle) * 25;

    this.targetVisual.rotation += 0.25;

    if (this.timer % 3 === 0) {
      this.createSpiralParticle();
    }

    if (this.timer >= this.duration.SPIN) {
      this.changePhase("THROW");
      this.game.canvas.startShake(800, 4);
    }
  }

  throwTarget() {
    const progress = Math.min(1, this.timer / this.duration.THROW);

    const eased = progress * progress;

    this.targetVisual.x =
      this.targetCenter.x + this.direction * 25 * (1 - eased);

    this.targetVisual.y = this.attackerCenter.y - 110 + 180 * eased;

    this.targetVisual.rotation += 0.35;
    this.targetVisual.scale = 0.88 - progress * 0.1;

    if (this.timer % 2 === 0) {
      this.createThrowTrail();
    }

    if (this.timer >= this.duration.THROW) {
      this.changePhase("IMPACT");
      this.triggerImpact();
    }
  }

  triggerImpact() {
    if (this.impactTriggered) return;

    this.impactTriggered = true;

    this.targetVisual.alpha = 0;

    this.game.canvas.startShake(24, 12);

    this.createImpactShockwave();
    this.createDebris();
    this.createImpactParticles();
  }

  impact() {
    if (this.timer < 6) {
      this.targetVisual.alpha = 0;
    }

    if (this.timer >= this.duration.IMPACT) {
      this.changePhase("FINISH");
    }
  }

  finish() {
    if (
      this.timer >= this.duration.FINISH &&
      this.particles.length === 0 &&
      this.shockwaves.length === 0 &&
      this.debris.length === 0
    ) {
      this.isFinished = true;
    }
  }

  createEnergyParticle() {
    const angle = Math.random() * Math.PI * 2;
    const radius = 25 + Math.random() * 35;

    this.particles.push({
      x: this.attackerCenter.x + Math.cos(angle) * radius,
      y: this.attackerCenter.y + Math.sin(angle) * radius,
      vx: -Math.cos(angle) * 1.5,
      vy: -Math.sin(angle) * 1.5,
      size: 2 + Math.random() * 3,
      alpha: 1,
      color: "#78dfff",
      type: "energy",
    });
  }

  createSpiralParticle() {
    const angle = Math.random() * Math.PI * 2;
    const radius = 35 + Math.random() * 20;

    this.particles.push({
      x: this.targetVisual.x + Math.cos(angle) * radius,
      y: this.targetVisual.y + Math.sin(angle) * radius,
      vx: Math.cos(angle) * 1.5,
      vy: Math.sin(angle) * 1.5,
      size: 2 + Math.random() * 3,
      alpha: 1,
      color: "#b5f2ff",
      type: "spiral",
    });
  }

  createThrowTrail() {
    this.particles.push({
      x: this.targetVisual.x,
      y: this.targetVisual.y,
      vx: (Math.random() - 0.5) * 2,
      vy: -2 - Math.random() * 3,
      size: 3 + Math.random() * 3,
      alpha: 0.9,
      color: "#d9f6ff",
      type: "trail",
    });
  }

  createImpactShockwave() {
    this.shockwaves.push({
      radius: 15,
      speed: 9,
      alpha: 1,
    });

    this.shockwaves.push({
      radius: 8,
      speed: 5,
      alpha: 0.9,
    });
  }

  createDebris() {
    for (let i = 0; i < 30; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 7;

      this.debris.push({
        x: this.targetCenter.x,
        y: this.targetCenter.y + 35,
        vx: Math.cos(angle) * speed,
        vy: -Math.abs(Math.sin(angle) * speed) - 1,
        gravity: 0.25 + Math.random() * 0.15,
        size: 3 + Math.random() * 7,
        rotation: Math.random() * Math.PI,
        rotationSpeed: (Math.random() - 0.5) * 0.3,
        alpha: 1,
      });
    }
  }

  createImpactParticles() {
    for (let i = 0; i < 35; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 8;

      this.particles.push({
        x: this.targetCenter.x,
        y: this.targetCenter.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 5,
        alpha: 1,
        color: Math.random() > 0.5 ? "#ffffff" : "#83dfff",
        type: "impact",
      });
    }
  }

  updateEffects() {
    this.particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      particle.vx *= 0.97;
      particle.vy *= 0.97;
      particle.alpha -= 0.035;
    });

    this.particles = this.particles.filter((particle) => particle.alpha > 0);

    this.shockwaves.forEach((wave) => {
      wave.radius += wave.speed;
      wave.alpha -= 0.035;
    });

    this.shockwaves = this.shockwaves.filter((wave) => wave.alpha > 0);

    this.debris.forEach((piece) => {
      piece.x += piece.vx;
      piece.y += piece.vy;
      piece.vy += piece.gravity;
      piece.rotation += piece.rotationSpeed;
      piece.alpha -= 0.025;
    });

    this.debris = this.debris.filter((piece) => piece.alpha > 0);
  }

  draw(context) {
    context.save();

    if (this.phase === "GRAB") {
      this.drawGrab(context);
    }

    if (this.phase === "ASCEND") {
      this.drawAscend(context);
    }

    if (this.phase === "SPIN") {
      this.drawSpiral(context);
    }

    if (this.phase === "THROW") {
      this.drawThrow(context);
    }

    if (this.phase === "IMPACT") {
      this.drawImpactFlash(context);
    }

    this.drawTargetClone(context);
    this.drawShockwaves(context);
    this.drawParticles(context);
    this.drawDebris(context);

    context.restore();
  }

  drawGrab(context) {
    const pulse = 1 + Math.sin(this.timer * 0.4) * 0.08;

    context.beginPath();
    context.ellipse(
      this.attackerCenter.x,
      this.attackerCenter.y,
      40 * pulse,
      48 * pulse,
      0,
      0,
      Math.PI * 2
    );

    context.strokeStyle = "rgba(100, 210, 255, 0.8)";
    context.lineWidth = 3;
    context.stroke();

    context.beginPath();
    context.ellipse(
      this.targetCenter.x,
      this.targetCenter.y,
      30,
      35,
      0,
      0,
      Math.PI * 2
    );

    context.strokeStyle = "rgba(180, 240, 255, 0.7)";
    context.lineWidth = 2;
    context.stroke();
  }

  drawAscend(context) {
    const progress = this.timer / this.duration.ASCEND;

    context.beginPath();
    context.moveTo(this.attackerCenter.x, this.attackerCenter.y - 15);
    context.lineTo(this.targetVisual.x, this.targetVisual.y + 25);

    context.strokeStyle = `rgba(100, 210, 255, ${1 - progress * 0.5})`;
    context.lineWidth = 3;
    context.setLineDash([7, 5]);
    context.stroke();
    context.setLineDash([]);

    this.drawEnergyOrbit(context, this.targetVisual.x, this.targetVisual.y, 35);
  }

  drawSpiral(context) {
    this.drawEnergyOrbit(context, this.targetVisual.x, this.targetVisual.y, 45);
  }

  drawEnergyOrbit(context, x, y, radius) {
    context.save();
    context.translate(x, y);
    context.rotate(this.spinAngle);

    for (let i = 0; i < 3; i++) {
      context.beginPath();
      context.ellipse(
        0,
        0,
        radius,
        radius * 0.35,
        (Math.PI / 3) * i,
        0,
        Math.PI * 1.5
      );

      context.strokeStyle =
        i % 2 === 0 ? "rgba(100, 215, 255, 0.85)" : "rgba(220, 250, 255, 0.7)";

      context.lineWidth = 3;
      context.stroke();
    }

    context.restore();
  }

  drawThrow(context) {
    const progress = this.timer / this.duration.THROW;

    context.beginPath();
    context.moveTo(this.targetVisual.x, this.targetVisual.y - 15);
    context.lineTo(this.targetVisual.x, this.targetVisual.y - 65);

    context.strokeStyle = `rgba(150, 230, 255, ${1 - progress * 0.4})`;
    context.lineWidth = 8;
    context.shadowColor = "#8bdfff";
    context.shadowBlur = 15;
    context.stroke();
    context.shadowBlur = 0;
  }

  drawImpactFlash(context) {
    const progress = this.timer / this.duration.IMPACT;
    const alpha = Math.max(0, 1 - progress * 1.8);
    const radius = 40 + progress * 75;

    const gradient = context.createRadialGradient(
      this.targetCenter.x,
      this.targetCenter.y + 30,
      0,
      this.targetCenter.x,
      this.targetCenter.y + 30,
      radius
    );

    gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
    gradient.addColorStop(0.35, `rgba(130, 225, 255, ${alpha * 0.8})`);
    gradient.addColorStop(1, "rgba(60, 160, 255, 0)");

    context.beginPath();
    context.arc(
      this.targetCenter.x,
      this.targetCenter.y + 30,
      radius,
      0,
      Math.PI * 2
    );

    context.fillStyle = gradient;
    context.fill();

    if (this.timer < 5) {
      context.fillStyle = `rgba(255, 255, 255, ${0.7 - this.timer * 0.14})`;
      context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    }
  }

  drawShockwaves(context) {
    this.shockwaves.forEach((wave) => {
      context.beginPath();
      context.ellipse(
        this.targetCenter.x,
        this.targetCenter.y + 35,
        wave.radius,
        wave.radius * 0.4,
        0,
        0,
        Math.PI * 2
      );

      context.strokeStyle = `rgba(140, 220, 255, ${wave.alpha})`;
      context.lineWidth = 4;
      context.stroke();
    });
  }

  drawParticles(context) {
    this.particles.forEach((particle) => {
      context.globalAlpha = particle.alpha;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);

      context.fillStyle = particle.color;
      context.shadowColor = particle.color;
      context.shadowBlur = 8;
      context.fill();
    });

    context.globalAlpha = 1;
    context.shadowBlur = 0;
  }

  drawDebris(context) {
    this.debris.forEach((piece) => {
      context.save();

      context.globalAlpha = piece.alpha;
      context.translate(piece.x, piece.y);
      context.rotate(piece.rotation);

      context.fillStyle = "#8a9a9f";
      context.fillRect(
        -piece.size / 2,
        -piece.size / 2,
        piece.size,
        piece.size
      );

      context.restore();
    });
  }
}
