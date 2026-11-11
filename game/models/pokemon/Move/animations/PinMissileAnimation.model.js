export class PinMissileAnimation {
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

    this.attacker = this.pokemonViewer.sprite;
    this.target = this.targetViewer.sprite;

    this.direction = this.target.position.x > this.attacker.position.x ? 1 : -1;

    this.phase = "PREPARATION";
    this.timer = 0;
    this.isFinished = false;

    this.darts = [];
    this.particles = [];
    this.impactParticles = [];

    this.initializeEffect();
  }

  initializeEffect() {
    const attackerWidth = this.attacker.frameWidth * this.attacker.scale;
    const attackerHeight = this.attacker.frameHeight * this.attacker.scale;

    const targetWidth = this.target.frameWidth * this.target.scale;
    const targetHeight = this.target.frameHeight * this.target.scale;

    this.start = {
      x: this.attacker.position.x + attackerWidth / 2,
      y: this.attacker.position.y + attackerHeight / 2,
    };

    this.end = {
      x: this.target.position.x + targetWidth / 2,
      y: this.target.position.y + targetHeight / 2,
    };

    this.distance = Math.abs(this.end.x - this.start.x);

    this.colors = ["#b9ff45", "#78e52e", "#d9ff75", "#4bcf36", "#eaffad"];

    this.shotInterval = 6;
    this.preparationDuration = 25;
    this.impactDuration = 24;
    this.dissipationDuration = 30;

    this.dartsCount = 5;

    this.trajectoryOffsets = [-32, 20, -14, 34, 0];

    this.dartsCount = this.trajectoryOffsets.length;

    this.targetPoints = this.trajectoryOffsets.map((offset, index) => ({
      x: this.end.x - this.direction * (Math.random() * 12),
      y: this.end.y + offset,
    }));

    // Préparation des dards.
    for (let i = 0; i < this.dartsCount; i++) {
      const angle = this.direction === 1 ? 0 : Math.PI;

      this.darts.push({
        x: this.start.x,
        y: this.start.y + this.trajectoryOffsets[i] * 0.45,
        startX: this.start.x,
        startY: this.start.y + this.trajectoryOffsets[i] * 0.45,
        targetX: this.targetPoints[i].x,
        targetY: this.targetPoints[i].y,
        angle,
        speed: 9 + Math.random() * 2,
        length: 22 + Math.random() * 8,
        width: 5 + Math.random() * 2,
        color: this.colors[i],
        delay: i * this.shotInterval,
        hasLaunched: false,
        hasImpacted: false,
        alpha: 1,
      });
    }

    // Particules de préparation.
    for (let i = 0; i < 25; i++) {
      this.particles.push({
        angle: Math.random() * Math.PI * 2,
        radius: 12 + Math.random() * 20,
        size: 1 + Math.random() * 2.5,
        speed: 0.04 + Math.random() * 0.04,
        alpha: 0.3 + Math.random() * 0.6,
      });
    }
  }

  update(context) {
    if (this.isFinished) return;

    this.timer++;

    switch (this.phase) {
      case "PREPARATION":
        this.updatePreparation();
        break;

      case "FIRING":
        this.updateFiring();
        break;

      case "IMPACTS":
        this.updateImpacts();
        break;

      case "DISSIPATION":
        this.updateDissipation();
        break;
    }

    this.draw(context);
  }

  updatePreparation() {
    this.particles.forEach((particle) => {
      particle.angle += particle.speed;
    });

    if (this.timer >= this.preparationDuration) {
      this.nextPhase("FIRING");
    }
  }

  updateFiring() {
    this.darts.forEach((dart, index) => {
      if (dart.hasImpacted) return;

      const launchTime = dart.delay;

      if (this.timer < launchTime) return;

      dart.hasLaunched = true;

      const dx = dart.targetX - dart.x;
      const dy = dart.targetY - dart.y;
      const distance = Math.hypot(dx, dy);

      if (distance <= dart.speed + 2) {
        dart.x = dart.targetX;
        dart.y = dart.targetY;
        dart.hasImpacted = true;

        this.createImpact(dart.x, dart.y, dart.color);
        return;
      }

      dart.angle = Math.atan2(dy, dx);
      dart.x += Math.cos(dart.angle) * dart.speed;
      dart.y += Math.sin(dart.angle) * dart.speed;
    });

    if (this.darts.every((dart) => dart.hasImpacted)) {
      this.nextPhase("IMPACTS");
    }
  }

  updateImpacts() {
    this.updateImpactParticles();

    if (this.timer >= this.impactDuration) {
      this.nextPhase("DISSIPATION");
    }
  }

  updateDissipation() {
    this.updateImpactParticles();

    if (this.timer >= this.dissipationDuration) {
      this.isFinished = true;
    }
  }

  nextPhase(phase) {
    this.phase = phase;
    this.timer = 0;
  }

  createImpact(x, y, color) {
    for (let i = 0; i < 9; i++) {
      const angle = ((Math.PI * 2) / 9) * i + Math.random() * 0.4;

      this.impactParticles.push({
        x,
        y,
        vx: Math.cos(angle) * (1.5 + Math.random() * 2.5),
        vy: Math.sin(angle) * (1.5 + Math.random() * 2.5),
        size: 2 + Math.random() * 3,
        alpha: 1,
        color,
      });
    }

    this.impactParticles.push({
      x,
      y,
      vx: 0,
      vy: 0,
      size: 12,
      alpha: 1,
      color: "#ffffff",
      flash: true,
    });
  }

  updateImpactParticles() {
    this.impactParticles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      particle.vx *= 0.92;
      particle.vy *= 0.92;
      particle.alpha *= particle.flash ? 0.78 : 0.91;
      particle.size *= particle.flash ? 0.9 : 0.97;
    });
  }

  getPreparationProgress() {
    return Math.min(this.timer / this.preparationDuration, 1);
  }

  draw(context) {
    context.save();

    switch (this.phase) {
      case "PREPARATION":
        this.drawPreparation(context);
        break;

      case "FIRING":
        this.drawFiring(context);
        break;

      case "IMPACTS":
        this.drawImpactParticles(context);
        break;

      case "DISSIPATION":
        this.drawImpactParticles(context);
        break;
    }

    context.restore();
  }

  drawPreparation(context) {
    const progress = this.getPreparationProgress();

    const pulse = 0.7 + Math.sin(this.timer * 0.35) * 0.3;

    // Aura de préparation.
    const radius = 8 + progress * 14;

    const gradient = context.createRadialGradient(
      this.start.x,
      this.start.y,
      1,
      this.start.x,
      this.start.y,
      radius * 1.8
    );

    gradient.addColorStop(0, "rgba(225, 255, 175, 0.8)");
    gradient.addColorStop(0.4, "rgba(140, 245, 65, 0.45)");
    gradient.addColorStop(1, "rgba(100, 220, 40, 0)");

    context.fillStyle = gradient;
    context.beginPath();
    context.arc(this.start.x, this.start.y, radius * 1.8, 0, Math.PI * 2);
    context.fill();

    // Petites particules orbitales.
    this.particles.forEach((particle) => {
      const x = this.start.x + Math.cos(particle.angle) * particle.radius;

      const y =
        this.start.y + Math.sin(particle.angle) * particle.radius * 0.65;

      context.fillStyle = `rgba(195, 255, 110, ${particle.alpha * pulse})`;
      context.shadowColor = "#aaff55";
      context.shadowBlur = 8;

      context.beginPath();
      context.arc(x, y, particle.size, 0, Math.PI * 2);
      context.fill();
    });

    // Silhouettes des dards en formation.
    this.darts.forEach((dart) => {
      this.drawDart(context, dart, 0.25 + progress * 0.75);
    });

    context.shadowBlur = 0;
  }

  drawFiring(context) {
    this.darts.forEach((dart) => {
      if (!dart.hasLaunched || dart.hasImpacted) return;

      this.drawDart(context, dart, 1);
    });

    this.drawImpactParticles(context);
  }

  drawDart(context, dart, alpha) {
    context.save();

    context.translate(dart.x, dart.y);
    context.rotate(dart.angle);

    const halfLength = dart.length / 2;

    // Traînée lumineuse.
    const trail = context.createLinearGradient(
      -halfLength * 2,
      0,
      halfLength,
      0
    );

    trail.addColorStop(0, "rgba(120, 230, 50, 0)");
    trail.addColorStop(0.7, `${dart.color}66`);
    trail.addColorStop(1, `${dart.color}00`);

    context.fillStyle = trail;
    context.globalAlpha = alpha;

    context.beginPath();
    context.ellipse(
      -halfLength * 0.65,
      0,
      halfLength * 1.2,
      dart.width * 0.55,
      0,
      0,
      Math.PI * 2
    );
    context.fill();

    // Corps du dard.
    context.shadowColor = dart.color;
    context.shadowBlur = 12;

    const body = context.createLinearGradient(0, -dart.width, 0, dart.width);

    body.addColorStop(0, "#f1ffd1");
    body.addColorStop(0.3, dart.color);
    body.addColorStop(1, "#367d20");

    context.fillStyle = body;

    context.beginPath();
    context.moveTo(halfLength, 0);
    context.lineTo(-halfLength * 0.65, -dart.width * 0.65);
    context.lineTo(-halfLength * 0.25, 0);
    context.lineTo(-halfLength * 0.65, dart.width * 0.65);
    context.closePath();
    context.fill();

    // Pointe blanche.
    context.fillStyle = "#faffdf";
    context.beginPath();
    context.moveTo(halfLength, 0);
    context.lineTo(halfLength * 0.35, -dart.width * 0.25);
    context.lineTo(halfLength * 0.35, dart.width * 0.25);
    context.closePath();
    context.fill();

    context.restore();
  }

  drawImpactParticles(context) {
    this.impactParticles.forEach((particle) => {
      if (particle.alpha <= 0.02) return;

      context.save();

      context.globalAlpha = particle.alpha;
      context.fillStyle = particle.color;
      context.shadowColor = particle.color;
      context.shadowBlur = particle.flash ? 15 : 8;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fill();

      context.restore();
    });
  }
}
