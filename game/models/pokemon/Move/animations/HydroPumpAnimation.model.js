export class HydroPumpAnimation {
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

    this.state = "PREPARE";
    this.timer = 0;
    this.isFinished = false;

    this.prepareDuration = 40;
    this.fireDuration = 5;
    this.impactDuration = 100;
    this.disperseDuration = 5;

    this.beamWidth = 15;
    this.particles = [];
    this.impactCreated = false;
  }

  update(context) {
    switch (this.state) {
      case "PREPARE":
        this.updatePreparation(context);
        break;

      case "FIRE":
        this.updateFire(context);
        break;

      case "IMPACT":
        this.game.canvas.startShake(1000, 5);
        this.updateImpact(context);
        break;

      case "DISPERSE":
        this.updateDisperse(context);
        break;

      case "FINISH":
        this.isFinished = true;
        break;
    }
  }

  getPositions() {
    const attacker = this.pokemonViewer.sprite;
    const target = this.targetViewer.sprite;

    const startX = attacker.position.x + attacker.frameWidth / 2;
    const startY = attacker.position.y + attacker.frameHeight / 2;

    const targetX = target.position.x + target.frameWidth / 2;
    const targetY = target.position.y + target.frameHeight / 2;

    const angle = Math.atan2(targetY - startY, targetX - startX);

    const distance = Math.hypot(targetX - startX, targetY - startY);

    return {
      startX,
      startY,
      targetX,
      targetY,
      angle,
      distance,
    };
  }

  updatePreparation(context) {
    this.timer++;

    const { startX, startY } = this.getPositions();

    const progress = this.timer / this.prepareDuration;

    const radius = 8 + progress * 12;

    this.drawCharge(context, startX, startY, radius);

    if (this.timer >= this.prepareDuration) {
      this.timer = 0;
      this.state = "FIRE";
    }
  }

  drawCharge(context, x, y, radius) {
    context.save();

    // Aura aqueuse.
    const gradient = context.createRadialGradient(x, y, 0, x, y, radius * 2);

    gradient.addColorStop(0, "rgba(230, 255, 255, 0.9)");
    gradient.addColorStop(0.35, "rgba(50, 190, 255, 0.55)");
    gradient.addColorStop(1, "rgba(20, 110, 255, 0)");

    context.fillStyle = gradient;

    context.beginPath();
    context.arc(x, y, radius * 2, 0, Math.PI * 2);
    context.fill();

    // Sphère centrale.
    context.fillStyle = "rgba(102, 222, 255, 0.85)";

    context.beginPath();
    context.arc(x, y, radius * 0.55, 0, Math.PI * 2);
    context.fill();

    // Petites gouttelettes en orbite.
    for (let i = 0; i < 6; i++) {
      const angle = this.timer * 0.12 + (Math.PI * 2 * i) / 6;

      const dropX = x + Math.cos(angle) * radius;
      const dropY = y + Math.sin(angle) * radius;

      context.fillStyle = "rgba(120, 220, 255, 0.9)";

      context.beginPath();
      context.arc(dropX, dropY, 2, 0, Math.PI * 2);
      context.fill();
    }

    context.restore();
  }

  updateFire(context) {
    this.timer++;

    const progress = Math.min(this.timer / this.fireDuration, 1);

    this.drawWaterBeam(context, progress);

    if (this.timer >= this.fireDuration) {
      this.timer = 0;

      this.state = "IMPACT";
    }
  }

  updateImpact(context) {
    this.timer++;

    this.drawWaterBeam(context, 1);
    this.updateParticles(context);

    if (!this.impactCreated) {
      const { targetX, targetY } = this.getPositions();

      this.createImpact(targetX, targetY);

      this.game.canvas.startShake(250, 4);

      this.impactCreated = true;
    }

    if (this.timer >= this.impactDuration) {
      this.timer = 0;
      this.state = "DISPERSE";
    }
  }

  updateDisperse(context) {
    this.timer++;

    const progress = Math.max(0, 1 - this.timer / this.disperseDuration);

    this.drawWaterBeam(context, progress);

    this.updateParticles(context);

    if (this.timer >= this.disperseDuration && this.particles.length === 0) {
      this.state = "FINISH";
    }
  }

  drawWaterBeam(context, progress) {
    if (progress <= 0) return;

    const { startX, startY, angle, distance } = this.getPositions();

    const length = distance * progress;
    const time = this.timer;

    const width = this.beamWidth;
    const wave = (value) => Math.sin(value);

    context.save();
    context.translate(startX, startY);
    context.rotate(angle);

    // --------------------------------------------------
    // 1. Corps principal du jet
    // --------------------------------------------------

    context.beginPath();

    context.moveTo(0, -width * 0.4);

    context.bezierCurveTo(
      length * 0.2,
      -width * 0.9 + wave(time * 0.4) * 5,

      length * 0.4,
      -width * 0.65 + wave(time * 0.3) * 7,

      length * 0.6,
      -width * 0.8 + wave(time * 0.5) * 4
    );

    context.bezierCurveTo(
      length * 0.8,
      -width * 0.55 + wave(time * 0.35) * 6,

      length * 0.9,
      -width * 0.9 + wave(time * 0.45) * 5,

      length,
      -width * 0.2
    );

    // Extrémité arrondie et irrégulière
    context.bezierCurveTo(
      length + width * 0.9,
      -width * 0.1,

      length + width * 0.8,
      width * 0.5,

      length,
      width * 0.3
    );

    context.bezierCurveTo(
      length * 0.8,
      width * 0.8 + wave(time * 0.35) * 5,

      length * 0.5,
      width * 0.55 + wave(time * 0.4) * 7,

      length * 0.3,
      width * 0.8 + wave(time * 0.3) * 4
    );

    context.bezierCurveTo(
      length * 0.15,
      width * 0.65,

      length * 0.08,
      width * 0.5,

      0,
      width * 0.4
    );

    context.closePath();

    const waterGradient = context.createLinearGradient(0, -width, 0, width);

    waterGradient.addColorStop(0, "rgba(20, 115, 220, 0.85)");
    waterGradient.addColorStop(0.35, "rgba(45, 190, 245, 0.95)");
    waterGradient.addColorStop(0.65, "rgba(100, 220, 255, 0.9)");
    waterGradient.addColorStop(1, "rgba(15, 110, 220, 0.8)");

    context.fillStyle = waterGradient;
    context.shadowColor = "#36bfff";
    context.shadowBlur = 12;
    context.fill();

    context.shadowBlur = 0;

    // --------------------------------------------------
    // 2. Turbulences et mouvements internes
    // --------------------------------------------------

    for (let i = 0; i < 4; i++) {
      const offset = i * 7;

      context.beginPath();
      context.moveTo(0, offset - 8);

      context.bezierCurveTo(
        length * 0.25,
        offset + wave(time * 0.5 + i) * 9,

        length * 0.55,
        offset + wave(time * 0.35 + i * 2) * 10,

        length,
        offset + wave(time * 0.45 + i) * 7
      );

      context.strokeStyle =
        i % 2 === 0 ? "rgba(210, 250, 255, 0.35)" : "rgba(0, 130, 230, 0.35)";

      context.lineWidth = 3 + (i % 2);
      context.lineCap = "round";
      context.stroke();
    }

    // --------------------------------------------------
    // 3. Reflets blancs fragmentés
    // --------------------------------------------------

    for (let i = 0; i < 9; i++) {
      const x = (length / 10) * (i + 1);

      const y = wave(time * 0.4 + i * 1.7) * width * 0.35;

      const highlightWidth = 4 + wave(time + i) * 3;

      context.beginPath();
      context.ellipse(
        x,
        y,
        highlightWidth,
        1.5,
        wave(time * 0.3 + i) * 0.3,
        0,
        Math.PI * 2
      );

      context.fillStyle = "rgba(235, 252, 255, 0.8)";
      context.fill();
    }

    // --------------------------------------------------
    // 4. Gouttelettes qui se détachent du jet
    // --------------------------------------------------

    for (let i = 0; i < 16; i++) {
      const x = (length / 17) * (i + 1);

      const oscillation = time * 0.4 + i * 2.1;

      const y = wave(oscillation) * (width * 0.65 + 7);

      const radius = 1.5 + (i % 3);

      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);

      context.fillStyle = "rgba(160, 235, 255, 0.75)";
      context.fill();
    }

    // --------------------------------------------------
    // 5. Gerbe d'eau à l'extrémité du jet
    // --------------------------------------------------

    for (let i = 0; i < 13; i++) {
      const spread = i - 6;

      const x = length + wave(time * 0.35 + i) * 7;

      const y = spread * 3.5 + wave(time * 0.5 + i * 1.5) * 5;

      const radius = 1.5 + (i % 3);

      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);

      context.fillStyle = "rgba(175, 240, 255, 0.85)";
      context.fill();
    }

    context.restore();
  }

  createImpact(x, y) {
    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
      const angle =
        (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.4;

      const speed = 2 + Math.random() * 5;

      this.particles.push({
        x,
        y,

        velocityX: Math.cos(angle) * speed,
        velocityY: Math.sin(angle) * speed,

        radius: 2 + Math.random() * 4,

        gravity: 0.08 + Math.random() * 0.12,

        color: Math.random() > 0.5 ? "#a8efff" : "#35bfff",

        timer: 0,
        duration: 20 + Math.random() * 15,
      });
    }
  }

  updateParticles(context) {
    for (const particle of this.particles) {
      particle.timer++;

      particle.x += particle.velocityX;
      particle.y += particle.velocityY;

      particle.velocityY += particle.gravity;

      const opacity = Math.max(0, 1 - particle.timer / particle.duration);

      context.save();

      context.globalAlpha = opacity;
      context.fillStyle = particle.color;

      context.shadowColor = "#67dfff";
      context.shadowBlur = 6;

      context.beginPath();

      context.arc(
        particle.x,
        particle.y,
        particle.radius * opacity,
        0,
        Math.PI * 2
      );

      context.fill();

      context.restore();
    }

    this.particles = this.particles.filter(
      (particle) => particle.timer < particle.duration
    );
  }
}
