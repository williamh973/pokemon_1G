export class HyperBeamAnimation {
  constructor(game, viewers, turnAction) {
    this.game = game;
    this.viewers = viewers;
    this.turnAction = turnAction;
    this.colors = [
      "white",
      "black",
      "pink",
      "yellow",
      "red",
      "purple",
      "orange",
      "cyan",
      "blue",
      "brown",
      "gold",
      "grey",
    ];
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

    // --------------------------------------------------
    // POSITION
    // --------------------------------------------------

    this.pokemonCenterX =
      this.pokemonViewer.sprite.position.x +
      this.pokemonViewer.sprite.frameWidth / 2;

    this.pokemonCenterY =
      this.pokemonViewer.sprite.position.y +
      this.pokemonViewer.sprite.frameHeight / 2;

    // --------------------------------------------------
    // STATE
    // --------------------------------------------------

    this.state = "CHARGE";

    // --------------------------------------------------
    // CHARGE
    // --------------------------------------------------

    this.chargeDuration = 1000;
    this.chargeElapsed = 0;

    this.particles = [];

    this.particleCount = 20;

    for (let i = 0; i < this.particleCount; i++) {
      const angle = Math.random() * Math.PI * 50;

      const distance = 35 + Math.random() * 30;

      this.particles.push({
        x: this.pokemonCenterX + Math.cos(angle) * distance,

        y: this.pokemonCenterY + Math.sin(angle) * distance,

        angle,

        distance,

        speed: 0.2 + Math.random() * 0.3,

        size: 2 + Math.random() * 3,
      });
    }

    // --------------------------------------------------
    // CONCENTRATION
    // --------------------------------------------------

    const targetCenterX =
      this.targetViewer.sprite.position.x +
      this.targetViewer.sprite.frameWidth / 2;

    const targetCenterY =
      this.targetViewer.sprite.position.y +
      this.targetViewer.sprite.frameHeight / 2;

    const directionX = targetCenterX - this.pokemonCenterX;
    const directionY = targetCenterY - this.pokemonCenterY;

    const distance = Math.hypot(directionX, directionY);

    this.directionX = directionX / distance;
    this.directionY = directionY / distance;

    this.concentrationX = this.pokemonCenterX + this.directionX * 18;

    this.concentrationY = this.pokemonCenterY + this.directionY * 18;

    this.concentrationDuration = 700;
    this.concentrationElapsed = 0;

    this.concentrationRadius = 2;
    this.concentrationMaxRadius = 15;

    // --------------------------------------------------
    // BEAM
    // --------------------------------------------------

    this.beamDuration = 400;
    this.beamElapsed = 0;

    this.beamWidth = 22;
    this.beamInnerWidth = 14;

    // --------------------------------------------------
    // IMPACT
    // --------------------------------------------------

    this.impactDuration = 350;
    this.impactElapsed = 0;

    this.impactRadius = 5;
    this.impactMaxRadius = 45;

    this.targetInitialPositionX = this.targetViewer.sprite.position.x;

    this.impactShakeDistance = 6;
    this.impactShakeSpeed = 4;
    this.impactShakeCount = 0;
    this.impactMaxShakeCount = 8;
    this.impactShakeDirection = 1;

    // --------------------------------------------------
    // FIN
    // --------------------------------------------------

    this.isFinished = false;
  }

  // --------------------------------------------------
  // CHARGE
  // --------------------------------------------------

  updateCharge() {
    this.chargeElapsed += 16;

    const progress = Math.min(this.chargeElapsed / this.chargeDuration, 1);

    // Accélération progressive de l'aspiration.
    const acceleration = 0.5 + progress * 2.5;

    for (const particle of this.particles) {
      particle.distance -= particle.speed * acceleration;

      particle.angle += 0.2;

      particle.x =
        this.pokemonCenterX + Math.cos(particle.angle) * particle.distance;

      particle.y =
        this.pokemonCenterY + Math.sin(particle.angle) * particle.distance;
    }

    if (progress >= 1) {
      for (const particle of this.particles) {
        particle.distance = 0;
        particle.x = this.pokemonCenterX;
        particle.y = this.pokemonCenterY;
      }

      this.state = "CONCENTRATION";
    }
  }

  // --------------------------------------------------
  // CONCENTRATION
  // --------------------------------------------------

  updateConcentration() {
    this.concentrationElapsed += 25;

    const progress = Math.min(
      this.concentrationElapsed / this.concentrationDuration,
      1
    );

    // La boule grossit progressivement.
    this.concentrationRadius = 2 + (this.concentrationMaxRadius - 2) * progress;

    if (progress >= 1) {
      this.state = "BEAM";
    }
  }

  // --------------------------------------------------
  // BEAM
  // --------------------------------------------------

  updateBeam() {
    this.beamElapsed += 8;

    if (this.beamElapsed >= this.beamDuration) {
      this.state = "IMPACT";
    }
  }

  // --------------------------------------------------
  // IMPACT
  // --------------------------------------------------

  updateImpact() {
    this.impactElapsed += 16;

    const progress = Math.min(this.impactElapsed / this.impactDuration, 1);

    // Le flash grossit rapidement puis disparaît progressivement.
    if (progress < 0.5) {
      const flashProgress = progress / 0.5;

      this.impactRadius = 5 + (this.impactMaxRadius - 5) * flashProgress;
    } else {
      const flashProgress = (progress - 0.5) / 0.5;

      this.impactRadius = this.impactMaxRadius * (1 - flashProgress);
    }

    // --------------------------------------------------
    // SECOUSSE DE LA CIBLE
    // --------------------------------------------------

    const sprite = this.targetViewer.sprite;

    sprite.position.x += this.impactShakeSpeed * this.impactShakeDirection;

    if (
      Math.abs(sprite.position.x - this.targetInitialPositionX) >=
      this.impactShakeDistance
    ) {
      this.impactShakeDirection *= -1;
      this.impactShakeCount++;
    }

    if (progress >= 1) {
      sprite.position.x = this.targetInitialPositionX;
      this.isFinished = true;
    }
  }

  // --------------------------------------------------
  // RENDU
  // --------------------------------------------------

  drawCharge(context) {
    const ctx = context;

    ctx.save();

    for (const particle of this.particles) {
      ctx.beginPath();

      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);

      ctx.fillStyle = this.colors[Math.floor(Math.random() * 12 + 1)];
      ctx.fill();
    }

    ctx.restore();
  }

  drawConcentration(context) {
    const ctx = context;

    ctx.save();

    ctx.beginPath();

    ctx.arc(
      this.concentrationX,
      this.concentrationY,
      this.concentrationRadius,
      0,
      Math.PI * 2
    );

    ctx.fillStyle = this.colors[Math.floor(Math.random() * 12 + 1)];
    ctx.fill();

    ctx.restore();
  }

  drawBeam(context) {
    const ctx = context;

    const targetCenterX =
      this.targetViewer.sprite.position.x +
      this.targetViewer.sprite.frameWidth / 2;

    const targetCenterY =
      this.targetViewer.sprite.position.y +
      this.targetViewer.sprite.frameHeight / 2;

    const angle = Math.atan2(
      targetCenterY - this.concentrationY,
      targetCenterX - this.concentrationX
    );

    const beamLength = Math.hypot(
      targetCenterX - this.concentrationX,
      targetCenterY - this.concentrationY
    );

    ctx.save();

    ctx.translate(this.concentrationX, this.concentrationY);
    ctx.rotate(angle);

    // --------------------------------------------------
    // EXTÉRIEUR DU RAYON
    // --------------------------------------------------

    ctx.beginPath();

    ctx.moveTo(0, -this.beamWidth / 2);
    ctx.lineTo(beamLength, -this.beamWidth / 2);
    ctx.lineTo(beamLength, this.beamWidth / 2);
    ctx.lineTo(0, this.beamWidth / 2);
    ctx.closePath();

    ctx.fillStyle = this.colors[Math.floor(Math.random() * 12 + 1)];
    ctx.fill();

    // --------------------------------------------------
    // INTÉRIEUR DU RAYON
    // --------------------------------------------------

    ctx.beginPath();

    ctx.moveTo(0, -this.beamInnerWidth / 2);
    ctx.lineTo(beamLength, -this.beamInnerWidth / 2);
    ctx.lineTo(beamLength, this.beamInnerWidth / 2);
    ctx.lineTo(0, this.beamInnerWidth / 2);
    ctx.closePath();

    ctx.fillStyle = this.colors[Math.floor(Math.random() * 12 + 1)];
    ctx.fill();

    ctx.restore();
  }

  drawImpact(context) {
    const ctx = context;

    const targetCenterX =
      this.targetViewer.sprite.position.x +
      this.targetViewer.sprite.frameWidth / 2;

    const targetCenterY =
      this.targetViewer.sprite.position.y +
      this.targetViewer.sprite.frameHeight / 2;

    ctx.save();

    ctx.beginPath();

    ctx.arc(targetCenterX, targetCenterY, this.impactRadius, 0, Math.PI * 2);

    ctx.fillStyle = "white";
    ctx.fill();

    ctx.restore();
  }
  // --------------------------------------------------
  // UPDATE
  // --------------------------------------------------

  update(context) {
    if (this.isFinished) return;

    switch (this.state) {
      case "CHARGE":
        this.updateCharge();
        this.drawCharge(context);
        break;

      case "CONCENTRATION":
        this.updateConcentration();
        this.drawConcentration(context);
        break;

      case "BEAM":
        this.updateBeam();
        this.drawBeam(context);
        break;

      case "IMPACT":
        this.updateImpact();
        this.drawImpact(context);
        break;

      default:
        break;
    }
  }
}
