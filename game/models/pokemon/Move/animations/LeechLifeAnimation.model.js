import { randomBetween } from "../../../../shareds/utils/math/math.utils.js";

export class LeechLifeAnimation {
  constructor(game, viewers, turnAction) {
    this.game = game;
    this.viewers = viewers;
    this.turnAction = turnAction;

    this.pokemon = turnAction.pokemon;
    this.target = turnAction.target;
    this.move = turnAction.move;

    this.state = "TARGET_SHAKE";

    this.targetViewer =
      this.viewers.front.slot.content === this.target
        ? this.viewers.front
        : this.viewers.back;

    this.userViewer =
      this.viewers.front.slot.content === this.pokemon
        ? this.viewers.front
        : this.viewers.back;

    this.targetInitialPositionY = this.targetViewer.sprite.position.y;

    this.shakeDistance = 4;
    this.shakeSpeed = 1;
    this.shakeCount = 0;
    this.maxShakeCount = 4;
    this.direction = 1;

    this.particles = [];

    this.particleIndex = 0;
    this.particleDelay = 5;
    this.particleTimer = 0;

    this.particlePositions = [
      { x: -18, y: -15 },
      { x: 15, y: -20 },
      { x: 22, y: 5 },
      { x: -20, y: 8 },
      { x: 5, y: 20 },
      { x: -5, y: -25 },
      { x: 25, y: -10 },
      { x: -25, y: -5 },
    ];

    this.isFinished = false;
  }

  update(context) {
    if (this.isFinished) return;

    switch (this.state) {
      case "TARGET_SHAKE":
        this.updateTargetShake();

        if (this.shakeCount >= this.maxShakeCount) {
          this.targetViewer.sprite.position.y = this.targetInitialPositionY;

          this.state = "DRAIN";
        }
        break;

      case "DRAIN":
        this.updateDrain(context);
        break;

      default:
        break;
    }
  }

  updateTargetShake() {
    const sprite = this.targetViewer.sprite;

    sprite.position.y += this.shakeSpeed * this.direction;

    if (
      Math.abs(sprite.position.y - this.targetInitialPositionY) >=
      this.shakeDistance
    ) {
      this.direction *= -1;
      this.shakeCount++;
    }
  }

  updateDrain(context) {
    this.particleTimer++;

    if (
      this.particleTimer >= this.particleDelay &&
      this.particleIndex < this.particlePositions.length
    ) {
      this.particleTimer = 0;

      this.createParticle(this.particlePositions[this.particleIndex]);

      this.particleIndex++;
    }

    for (const particle of this.particles) {
      this.updateParticle(particle);
      this.drawParticle(context, particle);
    }

    this.particles = this.particles.filter((particle) => particle.opacity > 0);

    if (
      this.particleIndex >= this.particlePositions.length &&
      this.particles.length === 0
    ) {
      this.isFinished = true;
    }
  }

  createParticle(position) {
    const target = this.getCenter(this.targetViewer);

    this.particles.push({
      x: target.x + position.x,
      y: target.y + position.y,

      size: randomBetween(2, 6),

      opacity: 1,

      speed: 0.08,

      wobble: Math.random() * Math.PI * 2,
    });
  }

  updateParticle(particle) {
    const user = this.getCenter(this.userViewer);

    const dx = user.x - particle.x;
    const dy = user.y - particle.y;

    particle.x += dx * particle.speed;
    particle.y += dy * particle.speed;

    particle.wobble += 0.15;

    particle.y += Math.sin(particle.wobble) * 0.5;

    particle.opacity -= 0.012;
  }

  drawParticle(context, particle) {
    context.save();

    context.globalAlpha = Math.max(0, particle.opacity);

    context.fillStyle = "orange";

    context.beginPath();

    context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);

    context.fill();

    context.restore();
  }

  getCenter(viewer) {
    return {
      x: viewer.sprite.position.x + viewer.sprite.frameWidth / 2,

      y: viewer.sprite.position.y + viewer.sprite.frameHeight / 2,
    };
  }
}
