export class MegaPunchAnimation {
  constructor(game, viewers, turnAction) {
    this.game = game;
    this.viewers = viewers;
    this.turnAction = turnAction;
    this.impactElapsed = 0;
    this.impactDuration = 180;
    this.impactPosition = null;
    this.impactParticles = [];

    this.pokemon = turnAction.pokemon;
    this.target = turnAction.target;
    this.move = turnAction.move;

    if (this.viewers.front.slot.content === this.pokemon) {
      this.pokemonViewer = this.viewers.front;
      this.targetViewer = this.viewers.back;
    } else {
      this.pokemonViewer = this.viewers.back;
      this.targetViewer = this.viewers.front;
    }

    this.sprite = this.pokemonViewer.sprite;
    this.targetSprite = this.targetViewer.sprite;

    this.initialPosition = {
      x: this.sprite.position.x,
      y: this.sprite.position.y,
    };

    this.direction =
      this.targetSprite.position.x > this.sprite.position.x ? 1 : -1;

    this.state = "PREPARE";
    this.stateElapsed = 0;
    this.isFinished = false;

    this.prepareDuration = 180;
    this.punchDuration = 200;
    this.recoverDuration = 180;

    this.moveDistance = 12;

    this.impactElapsed = 0;
    this.impactDuration = 120;
    this.impactPosition = null;
  }

  createImpactParticles() {
    const directions = [
      { x: -1, y: -1 },
      { x: 1, y: -1 },
      { x: -1, y: 1 },
      { x: 1, y: 1 },
    ];

    this.impactParticles = directions.map((direction) => ({
      x: this.impactPosition.x,
      y: this.impactPosition.y,
      velocityX: direction.x * 0.08,
      velocityY: direction.y * 0.08,
      size: 32,
    }));
  }

  drawImpactStar(context, x, y, radius, opacity) {
    context.save();

    context.globalAlpha = opacity;
    context.fillStyle = "#FFFFFF";
    context.strokeStyle = "#FFD700";
    context.lineWidth = 2;

    context.beginPath();

    for (let i = 0; i < 10; i++) {
      const angle = (Math.PI * 2 * i) / 10 - Math.PI / 2;
      const currentRadius = i % 2 === 0 ? radius : radius * 0.4;

      const pointX = x + Math.cos(angle) * currentRadius;
      const pointY = y + Math.sin(angle) * currentRadius;

      if (i === 0) context.moveTo(pointX, pointY);
      else context.lineTo(pointX, pointY);
    }

    context.closePath();
    context.fill();
    context.stroke();

    context.restore();
  }

  updatePrepare() {
    this.stateElapsed += 16;

    const progress = Math.min(this.stateElapsed / this.prepareDuration, 1);

    // Léger recul.
    this.sprite.position.x =
      this.initialPosition.x - this.direction * 15 * progress;

    if (progress >= 1) {
      this.state = "PUNCH";
      this.stateElapsed = 0;
    }
  }

  updatePunch() {
    this.stateElapsed += 16;

    const progress = Math.min(this.stateElapsed / this.punchDuration, 1);

    // Avancée rapide.
    const easedProgress = 1 - (1 - progress) ** 2;

    this.sprite.position.x =
      this.initialPosition.x -
      this.direction * 3 +
      this.direction * (this.moveDistance + 50) * easedProgress;

    if (progress >= 1) {
      this.state = "RECOVER";
      this.stateElapsed = 0;

      this.impactPosition = {
        x: this.targetSprite.position.x + this.targetSprite.frameWidth / 2,
        y: this.targetSprite.position.y + this.targetSprite.frameHeight / 2,
      };

      this.createImpactParticles();
    }
  }

  updateRecover(context) {
    this.stateElapsed += 16;
    this.impactElapsed += 16;

    const progress = Math.min(this.stateElapsed / this.recoverDuration, 1);

    // Retour à la position initiale.
    this.sprite.position.x =
      this.initialPosition.x +
      (this.sprite.position.x - this.initialPosition.x) * (1 - progress);

    this.updateImpact(context);

    if (progress >= 1) {
      this.sprite.position.x = this.initialPosition.x;
      this.sprite.position.y = this.initialPosition.y;
      this.isFinished = true;
    }
  }

  drawImpact(context) {
    if (!this.impactPosition || this.impactElapsed >= this.impactDuration)
      return;

    const progress = this.impactElapsed / this.impactDuration;

    context.save();

    context.globalAlpha = 1 - progress;
    context.fillStyle = "#ffffff";

    context.beginPath();
    context.arc(
      this.impactPosition.x,
      this.impactPosition.y,
      4 + progress * 12,
      0,
      Math.PI * 2
    );
    context.fill();

    context.restore();
  }

  updateImpact(context) {
    const progress = this.impactElapsed / this.impactDuration;

    const radius = 4 + progress * 12;
    const opacity = 1 - progress;

    this.drawImpactStar(
      context,
      this.impactPosition.x,
      this.impactPosition.y,
      radius,
      opacity
    );

    this.impactParticles.forEach((particle) => {
      particle.x += particle.velocityX * 16;
      particle.y += particle.velocityY * 16;

      context.save();
      context.globalAlpha = opacity;
      context.fillStyle = "#FFD700";

      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fill();

      context.restore();
    });

    this.impactElapsed += 16;

    if (this.impactElapsed >= this.impactDuration) {
      this.impactParticles = [];
    }
  }

  update(context) {
    if (this.isFinished) return;

    switch (this.state) {
      case "PREPARE":
        this.updatePrepare();
        break;

      case "PUNCH":
        this.updatePunch();
        break;

      case "RECOVER":
        this.updateRecover(context);
        break;
    }

    this.drawImpact(context);
  }
}
