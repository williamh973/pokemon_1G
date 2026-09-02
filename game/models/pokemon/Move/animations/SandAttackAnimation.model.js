export class SandAttackAnimation {
  constructor(game, viewers, turnAction) {
    this.game = game;
    this.viewers = viewers;
    this.turnAction = turnAction;

    this.pokemon = turnAction.pokemon;
    this.target = turnAction.target;
    this.move = turnAction.move;

    if (this.viewers.front.slot.content === this.pokemon) {
      this.pokemonViewer = this.viewers.front;
      this.targetViewer = this.viewers.back;
      this.key = "front";
    } else {
      this.pokemonViewer = this.viewers.back;
      this.targetViewer = this.viewers.front;
      this.key = "back";
    }

    this.direction = this.pokemonViewer.slot.attackDirection;

    if (this.key === "front") {
      this.startX = this.pokemonViewer.sprite.position.x;
      this.endX = this.targetViewer.sprite.position.x;
    } else {
      this.startX =
        this.pokemonViewer.sprite.position.x +
        this.pokemonViewer.sprite.frameWidth;
      this.endX = this.targetViewer.sprite.position.x + 50;
      this.endY = this.targetViewer.sprite.position.y;
    }

    this.startY = this.pokemonViewer.sprite.position.y + 35;
    this.endY = this.targetViewer.sprite.position.y + 35;

    this.particles = [];

    this.timer = 0;
    this.duration = 35;

    this.isFinished = false;

    this.createParticles();
  }

  createParticles() {
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: this.startX,
        y: this.startY,

        // Décalage aléatoire autour de la trajectoire
        offsetY: (Math.random() - 0.1) * 70,

        size: Math.random() * 2 + 1.5,

        speed: Math.random() * 0.6 + 0.8,

        delay: Math.random() * 16,

        life: 1,

        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.15 + 0.05,
      });
    }
  }

  update(context) {
    if (this.isFinished) return;

    this.timer++;

    const progress = Math.min(this.timer / this.duration, 1);

    for (const particle of this.particles) {
      if (this.timer < particle.delay) continue;

      const particleProgress = Math.min(
        (this.timer - particle.delay) / (this.duration - particle.delay),
        1
      );

      const x = this.startX + (this.endX - this.startX) * particleProgress;

      const y = this.startY + (this.endY - this.startY) * particleProgress;

      const wobble =
        Math.sin(particle.wobble + this.timer * particle.wobbleSpeed) * 5;

      particle.x = x;
      particle.y =
        y + particle.offsetY * Math.sin(Math.PI * particleProgress) + wobble;

      // Les particules deviennent progressivement plus dispersées
      const spread = Math.sin(Math.PI * particleProgress) * 10;

      particle.x += (Math.random() - 0.5) * spread;

      particle.y += (Math.random() - 0.5) * spread;

      particle.life = 1 - particleProgress;

      this.drawParticle(context, particle);
    }

    if (progress >= 1) {
      this.isFinished = true;
    }
  }

  drawParticle(context, particle) {
    context.save();

    context.globalAlpha = particle.life;

    context.fillStyle = "black"; //

    context.fillRect(particle.x, particle.y, particle.size, particle.size);

    context.restore();
  }
}
