export class SolarBeamAnimation {
  constructor(game, viewers, turnAction) {
    this.game = game;
    this.viewers = viewers;
    this.turnAction = turnAction;

    this.pokemon = turnAction.pokemon;
    this.target = turnAction.target;
    this.move = turnAction.move;

    // --------------------------------------------------
    // VIEWERS
    // --------------------------------------------------

    if (this.viewers.front.slot.content === this.pokemon) {
      this.pokemonViewer = this.viewers.front;
      this.targetViewer = this.viewers.back;
    } else {
      this.pokemonViewer = this.viewers.back;
      this.targetViewer = this.viewers.front;
    }

    this.sprite = this.pokemonViewer.sprite;
    this.targetSprite = this.targetViewer.sprite;

    // --------------------------------------------------
    // PHASE
    // --------------------------------------------------

    this.phase = this.pokemon.chargedMove.animationPhase;
    this.isFinished = false;

    // --------------------------------------------------
    // ABSORPTION : FIRST
    // --------------------------------------------------

    this.state = "ABSORPTION";

    this.absorptionDuration = 1600;
    this.absorptionElapsed = 0;

    this.particles = [];
    this.particleCount = 35;

    this.particleMinDistance = 55;
    this.particleMaxDistance = 115;

    this.particleMinSpeed = 0.8;
    this.particleMaxSpeed = 1.8;

    this.particleMinSize = 1.5;
    this.particleMaxSize = 3.5;

    this.particleColors = [
      "#b6ff70",
      "#7dff42",
      "#d4ff91",
      "#faffc2",
      "#ffd76a",
      "#ffffff",
    ];

    this.initializeParticles();

    this.auraRadius = 10;
    this.auraMaxRadius = 45;

    // --------------------------------------------------
    // RAYON : SECOND
    // --------------------------------------------------

    this.beamElapsed = 0;
    this.beamDuration = 450;

    this.impactElapsed = 0;
    this.impactDuration = 350;

    this.beamStartWidth = 4;
    this.beamMaxWidth = 12;

    this.beamProgress = 0;
    this.impactProgress = 0;

    this.impactParticles = [];

    if (this.phase === "SECOND") {
      this.state = "BEAM";
    }
  }

  // --------------------------------------------------
  // POSITIONS
  // --------------------------------------------------

  getSpriteCenter(sprite) {
    return {
      x: sprite.position.x + sprite.frameWidth / 2,
      y: sprite.position.y + sprite.frameHeight / 2,
    };
  }

  // --------------------------------------------------
  // INITIALISATION DES PARTICULES
  // --------------------------------------------------

  initializeParticles() {
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        angle: Math.random() * Math.PI * 2,
        distance:
          this.particleMinDistance +
          Math.random() * (this.particleMaxDistance - this.particleMinDistance),
        speed:
          this.particleMinSpeed +
          Math.random() * (this.particleMaxSpeed - this.particleMinSpeed),
        size:
          this.particleMinSize +
          Math.random() * (this.particleMaxSize - this.particleMinSize),
        color:
          this.particleColors[
            Math.floor(Math.random() * this.particleColors.length)
          ],
      });
    }
  }

  // --------------------------------------------------
  // ABSORPTION : UPDATE
  // --------------------------------------------------

  updateAbsorption() {
    this.absorptionElapsed += 16;

    const progress = Math.min(
      this.absorptionElapsed / this.absorptionDuration,
      1
    );

    this.auraRadius = 10 + (this.auraMaxRadius - 10) * progress;

    for (const particle of this.particles) {
      particle.distance -= particle.speed;
      particle.angle += 0.035;

      if (particle.distance <= 8) {
        particle.distance =
          this.particleMinDistance +
          Math.random() * (this.particleMaxDistance - this.particleMinDistance);

        particle.angle = Math.random() * Math.PI * 2;
      }
    }

    if (progress >= 1) {
      this.isFinished = true;
    }
  }

  // --------------------------------------------------
  // ABSORPTION : DRAW
  // --------------------------------------------------

  drawAbsorption(context) {
    const ctx = context;
    const center = this.getSpriteCenter(this.sprite);

    ctx.save();

    const gradient = ctx.createRadialGradient(
      center.x,
      center.y,
      2,
      center.x,
      center.y,
      this.auraRadius
    );

    gradient.addColorStop(0, "rgba(220, 255, 150, 0.45)");
    gradient.addColorStop(0.5, "rgba(120, 255, 70, 0.2)");
    gradient.addColorStop(1, "rgba(120, 255, 70, 0)");

    ctx.beginPath();
    ctx.arc(center.x, center.y, this.auraRadius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    for (const particle of this.particles) {
      const x = center.x + Math.cos(particle.angle) * particle.distance;
      const y = center.y + Math.sin(particle.angle) * particle.distance;

      ctx.beginPath();
      ctx.arc(x, y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.globalAlpha = 0.9;
      ctx.fill();
    }

    ctx.restore();
  }

  // --------------------------------------------------
  // RAYON : UPDATE
  // --------------------------------------------------

  updateBeam() {
    this.beamElapsed += 12;

    this.beamProgress = Math.min(this.beamElapsed / this.beamDuration, 1);

    if (this.beamProgress >= 1) {
      this.state = "IMPACT";
    }
  }

  // --------------------------------------------------
  // RAYON : DRAW
  // --------------------------------------------------

  drawBeam(context) {
    const ctx = context;

    // Positions recalculées pour prendre en compte
    // les deux orientations possibles du combat.
    const start = this.getSpriteCenter(this.sprite);
    const end = this.getSpriteCenter(this.targetSprite);

    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.hypot(dx, dy);
    const angle = Math.atan2(dy, dx);

    // Le rayon apparaît progressivement, puis s'épaissit.
    const beamLength = length * this.beamProgress;
    const beamWidth =
      this.beamStartWidth +
      (this.beamMaxWidth - this.beamStartWidth) *
        Math.min(this.beamProgress * 2, 1);

    ctx.save();

    ctx.translate(start.x, start.y);
    ctx.rotate(angle);

    // Halo extérieur vert.
    ctx.globalAlpha = 0.45;
    ctx.fillStyle = "#56ff32";
    ctx.shadowColor = "#80ff45";
    ctx.shadowBlur = 18;

    ctx.fillRect(0, -beamWidth, beamLength, beamWidth * 2);

    // Noyau lumineux du rayon.
    ctx.globalAlpha = 0.95;
    ctx.fillStyle = "#baff75";
    ctx.shadowBlur = 12;

    ctx.fillRect(0, -beamWidth * 0.55, beamLength, beamWidth * 1.1);

    // Centre presque blanc.
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#ffffff";
    ctx.shadowBlur = 8;

    ctx.fillRect(
      0,
      -Math.max(1, beamWidth * 0.15),
      beamLength,
      Math.max(2, beamWidth * 0.3)
    );

    ctx.restore();
  }

  // --------------------------------------------------
  // IMPACT : UPDATE
  // --------------------------------------------------

  updateImpact() {
    this.impactElapsed += 16;

    this.impactProgress = Math.min(this.impactElapsed / this.impactDuration, 1);

    if (this.impactProgress >= 1) {
      this.isFinished = true;
    }
  }

  // --------------------------------------------------
  // IMPACT : DRAW
  // --------------------------------------------------

  drawImpact(context) {
    const ctx = context;
    const center = this.getSpriteCenter(this.targetSprite);

    // Flash qui diminue progressivement.
    const alpha = 1 - this.impactProgress;
    const radius = 12 + this.impactProgress * 28;

    ctx.save();

    ctx.globalAlpha = alpha;

    const gradient = ctx.createRadialGradient(
      center.x,
      center.y,
      1,
      center.x,
      center.y,
      radius
    );

    gradient.addColorStop(0, "#ffffff");
    gradient.addColorStop(0.3, "#e5ff9b");
    gradient.addColorStop(0.7, "#77ff43");
    gradient.addColorStop(1, "rgba(80, 255, 40, 0)");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
    ctx.fill();

    // Éclats lumineux.
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8;
      const distance = radius * (0.45 + this.impactProgress * 0.7);

      const x = center.x + Math.cos(angle) * distance;
      const y = center.y + Math.sin(angle) * distance;

      ctx.fillStyle = i % 2 === 0 ? "#ffffff" : "#baff75";
      ctx.fillRect(x - 2, y - 2, 4, 4);
    }

    ctx.restore();
  }

  // --------------------------------------------------
  // UPDATE PRINCIPAL
  // --------------------------------------------------

  update(context) {
    if (this.isFinished) return;

    switch (this.phase) {
      case "FIRST":
        this.updateAbsorption();
        this.drawAbsorption(context);
        break;

      case "SECOND":
        switch (this.state) {
          case "BEAM":
            this.updateBeam();
            this.drawBeam(context);
            break;

          case "IMPACT":
            this.updateImpact();
            this.drawImpact(context);
            break;
        }
        break;
    }
  }
}
