export class GrowthAnimation {
  constructor(game, viewers, turnAction) {
    this.game = game;
    this.viewers = viewers;
    this.turnAction = turnAction;

    if (this.viewers.front.slot.content === turnAction.pokemon) {
      this.pokemonViewer = this.viewers.front;
    } else {
      this.pokemonViewer = this.viewers.back;
    }

    this.state = "PREPARE";
    this.timer = 0;
    this.isFinished = false;

    this.prepareDuration = 20;
    this.growDuration = 100;
    this.surgeDuration = 25;
    this.finishDuration = 35;

    this.particles = [];
    this.leaves = [];
    this.particleCount = 35;
    this.leafCount = 12;

    this.auraAlpha = 0;
    this.auraPulse = 0;
    this.flashAlpha = 0;

    this.createParticles();
    this.createLeaves();
  }

  update(context) {
    if (this.isFinished) return;

    switch (this.state) {
      case "PREPARE":
        this.updatePrepare(context);
        break;

      case "GROW":
        this.updateGrow(context);
        break;

      case "SURGE":
        this.updateSurge(context);
        break;

      case "FINISH":
        this.updateFinish(context);
        break;
    }

    this.timer++;
  }

  getPokemonPosition() {
    const sprite = this.pokemonViewer.sprite;

    return {
      x: sprite.position.x + sprite.frameWidth / 2,
      y: sprite.position.y + sprite.frameHeight,
      height: sprite.frameHeight,
    };
  }

  createParticles() {
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        angle: Math.random() * Math.PI * 2,
        radius: 12 + Math.random() * 25,
        speed: 0.015 + Math.random() * 0.025,
        size: 1.5 + Math.random() * 2.5,
        height: Math.random(),
        alpha: 0.4 + Math.random() * 0.6,
        color: Math.random() < 0.7 ? "#62e878" : "#f6d66a",
      });
    }
  }

  createLeaves() {
    for (let i = 0; i < this.leafCount; i++) {
      this.leaves.push({
        angle: Math.random() * Math.PI * 2,
        radius: 18 + Math.random() * 18,
        height: Math.random(),
        speed: 0.025 + Math.random() * 0.02,
        size: 4 + Math.random() * 3,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.12,
        alpha: 0.7 + Math.random() * 0.3,
      });
    }
  }

  updatePrepare(context) {
    const progress = Math.min(this.timer / this.prepareDuration, 1);

    this.auraAlpha = progress * 0.45;

    this.drawAura(context);
    this.drawParticles(context, 0.35);
    this.drawLeaves(context, 0.4);

    if (this.timer >= this.prepareDuration) {
      this.setState("GROW");
    }
  }

  updateGrow(context) {
    const progress = Math.min(this.timer / this.growDuration, 1);

    this.auraAlpha = 0.35 + progress * 0.4;
    this.auraPulse += 0.12;

    this.updateParticleMovement();
    this.updateLeafMovement();

    this.drawAura(context);
    this.drawParticles(context, 1);
    this.drawLeaves(context, 1);

    if (this.timer >= this.growDuration) {
      this.setState("SURGE");
    }
  }

  updateSurge(context) {
    this.auraPulse += 0.2;

    const pulse = (Math.sin(this.auraPulse) + 1) / 2;

    this.auraAlpha = 0.6 + pulse * 0.4;
    this.flashAlpha = pulse * 0.15;

    this.updateParticleMovement();
    this.updateLeafMovement();

    this.drawAura(context);
    this.drawParticles(context, 1.2);
    this.drawLeaves(context, 1.2);
    this.drawFlash(context);

    if (this.timer >= this.surgeDuration) {
      this.setState("FINISH");
    }
  }

  updateFinish(context) {
    const progress = Math.min(this.timer / this.finishDuration, 1);

    const fade = 1 - progress;

    this.auraAlpha = 0.8 * fade;
    this.flashAlpha = 0;

    this.updateParticleMovement();
    this.updateLeafMovement();

    this.drawAura(context);
    this.drawParticles(context, fade);
    this.drawLeaves(context, fade);

    if (this.timer >= this.finishDuration) {
      this.isFinished = true;
    }
  }

  setState(state) {
    this.state = state;
    this.timer = 0;
  }

  updateParticleMovement() {
    for (const particle of this.particles) {
      particle.angle += particle.speed;
      particle.height += 0.008;

      if (particle.height > 1) {
        particle.height = 0;
        particle.angle = Math.random() * Math.PI * 2;
      }
    }
  }

  updateLeafMovement() {
    for (const leaf of this.leaves) {
      leaf.angle += leaf.speed;
      leaf.rotation += leaf.rotationSpeed;
      leaf.height += 0.009;

      if (leaf.height > 1) {
        leaf.height = 0;
        leaf.angle = Math.random() * Math.PI * 2;
      }
    }
  }

  drawAura(context) {
    const { x, y, height } = this.getPokemonPosition();

    context.save();

    const pulse = Math.sin(this.auraPulse) * 3;
    const radiusX = 20 + pulse;
    const radiusY = height * 0.55 + pulse;

    const gradient = context.createRadialGradient(
      x,
      y,
      2,
      x,
      y,
      Math.max(radiusX, radiusY)
    );

    gradient.addColorStop(0, `rgba(90, 255, 125, ${this.auraAlpha * 0.3})`);

    gradient.addColorStop(0.65, `rgba(40, 210, 95, ${this.auraAlpha * 0.2})`);

    gradient.addColorStop(1, "rgba(30, 180, 80, 0)");

    context.fillStyle = gradient;
    context.beginPath();
    context.ellipse(x, y, radiusX, radiusY, 0, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }

  drawParticles(context, intensity) {
    const { x, y, height } = this.getPokemonPosition();

    context.save();

    for (const particle of this.particles) {
      const angle = particle.angle;
      const orbitRadius = particle.radius;

      const px = x + Math.cos(angle) * orbitRadius;
      const py =
        y +
        Math.sin(angle) * orbitRadius * 0.55 -
        particle.height * height * 0.7;

      const alpha = Math.min(particle.alpha * intensity, 1);

      context.globalAlpha = alpha;
      context.fillStyle = particle.color;
      context.shadowColor = particle.color;
      context.shadowBlur = 6;

      context.beginPath();
      context.arc(
        px,
        py,
        particle.size * Math.min(intensity, 1.5),
        0,
        Math.PI * 2
      );
      context.fill();
    }

    context.restore();
  }

  drawLeaves(context, intensity) {
    const { x, y, height } = this.getPokemonPosition();

    context.save();

    for (const leaf of this.leaves) {
      const px = x + Math.cos(leaf.angle) * leaf.radius;
      const py =
        y +
        Math.sin(leaf.angle) * leaf.radius * 0.5 -
        leaf.height * height * 0.65;

      context.save();
      context.translate(px, py);
      context.rotate(leaf.rotation);

      context.globalAlpha = Math.min(leaf.alpha * intensity, 1);

      context.fillStyle = "#65d957";
      context.strokeStyle = "#b8ff9e";
      context.lineWidth = 0.8;

      // Forme d'une feuille
      context.beginPath();
      context.moveTo(0, -leaf.size);
      context.quadraticCurveTo(leaf.size * 1.2, -leaf.size * 0.3, 0, leaf.size);
      context.quadraticCurveTo(
        -leaf.size * 1.2,
        -leaf.size * 0.3,
        0,
        -leaf.size
      );

      context.fill();
      context.stroke();

      // Nervure centrale
      context.beginPath();
      context.moveTo(0, -leaf.size * 0.7);
      context.lineTo(0, leaf.size * 0.7);
      context.stroke();

      context.restore();
    }

    context.restore();
  }

  drawFlash(context) {
    if (this.flashAlpha <= 0) return;

    const { x, y, height } = this.getPokemonPosition();

    context.save();

    context.globalAlpha = this.flashAlpha;

    const gradient = context.createRadialGradient(x, y, 0, x, y, height * 0.65);

    gradient.addColorStop(0, "#eaffb5");
    gradient.addColorStop(0.5, "#72ff91");
    gradient.addColorStop(1, "rgba(80, 255, 120, 0)");

    context.fillStyle = gradient;
    context.beginPath();
    context.arc(x, y, height * 0.65, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }
}
