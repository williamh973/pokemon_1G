export class MinimizeAnimation {
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

    this.phase = "INVOCATION";
    this.timer = 0;
    this.isFinished = false;

    // Sauvegarde de l'état initial du sprite.
    this.originalScale = this.attacker.scale;

    this.originalPosition = {
      x: this.attacker.position.x,
      y: this.attacker.position.y,
    };

    // Centre fixe du Pokémon pendant toute l'animation.
    this.centerX =
      this.originalPosition.x +
      (this.attacker.frameWidth * this.originalScale) / 2;

    this.centerY =
      this.originalPosition.y +
      (this.attacker.frameHeight * this.originalScale) / 2;

    this.minScale = this.originalScale * 0.25;

    this.rings = [
      { radius: 20, rotation: 0, speed: 0.045, alpha: 0.8 },
      { radius: 32, rotation: 2, speed: -0.035, alpha: 0.65 },
      { radius: 44, rotation: 4, speed: 0.025, alpha: 0.5 },
    ];

    this.particles = [];
    this.stars = [];

    this.generateParticles();
  }

  generateParticles() {
    for (let i = 0; i < 24; i++) {
      const angle = (Math.PI * 2 * i) / 24;

      this.particles.push({
        angle,
        radius: 25 + Math.random() * 35,
        speed: 0.025 + Math.random() * 0.025,
        size: 2 + Math.random() * 3,
        alpha: 0.4 + Math.random() * 0.6,
      });
    }
  }

  generateStars() {
    for (let i = 0; i < 30; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 3;

      this.stars.push({
        x: this.centerX,
        y: this.centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 3,
        alpha: 1,
        rotation: Math.random() * Math.PI,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
      });
    }
  }

  setSpriteScale(scale) {
    this.attacker.scale = scale;

    // Repositionnement pour conserver le centre du sprite.
    this.attacker.position.x =
      this.centerX - (this.attacker.frameWidth * scale) / 2;

    this.attacker.position.y =
      this.centerY - (this.attacker.frameHeight * scale) / 2;
  }

  restoreSprite() {
    this.attacker.scale = this.originalScale;

    this.attacker.position.x = this.originalPosition.x;
    this.attacker.position.y = this.originalPosition.y;
  }

  update(context) {
    if (this.isFinished) return;

    this.timer++;

    switch (this.phase) {
      case "INVOCATION":
        this.updateInvocation();
        break;

      case "SHRINK":
        this.updateShrink();
        break;

      case "STABILIZATION":
        this.updateStabilization();
        break;

      case "RETURN":
        this.updateReturn();
        break;

      case "FINISHED":
        this.restoreSprite();
        this.isFinished = true;
        break;
    }

    this.updateParticles();
    this.updateStars();

    this.draw(context);
  }

  updateInvocation() {
    if (this.timer >= 30) {
      this.timer = 0;
      this.phase = "SHRINK";
    }
  }

  updateShrink() {
    const duration = 55;
    const progress = Math.min(this.timer / duration, 1);

    // Réduction progressive avec une accélération douce.
    const easedProgress = 1 - Math.pow(1 - progress, 3);

    const scale =
      this.originalScale - (this.originalScale - this.minScale) * easedProgress;

    this.setSpriteScale(scale);

    this.rings.forEach((ring) => {
      ring.rotation += ring.speed;
    });

    if (this.timer >= duration) {
      this.setSpriteScale(this.minScale);

      this.timer = 0;
      this.phase = "STABILIZATION";
    }
  }

  updateStabilization() {
    this.rings.forEach((ring) => {
      ring.rotation += ring.speed * 1.5;
    });

    if (this.timer >= 35) {
      this.timer = 0;
      this.phase = "RETURN";
      this.generateStars();
    }
  }

  updateReturn() {
    const duration = 35;
    const progress = Math.min(this.timer / duration, 1);

    // Retour à la taille initiale.
    const easedProgress = 1 - Math.pow(1 - progress, 3);

    const scale =
      this.minScale + (this.originalScale - this.minScale) * easedProgress;

    this.setSpriteScale(scale);

    if (this.timer >= duration) {
      this.restoreSprite();

      this.timer = 0;
      this.phase = "FINISHED";
    }
  }

  updateParticles() {
    this.particles.forEach((particle) => {
      particle.angle += particle.speed;
      particle.alpha = 0.4 + Math.sin(this.timer * 0.08 + particle.angle) * 0.4;
    });
  }

  updateStars() {
    this.stars.forEach((star) => {
      star.x += star.vx;
      star.y += star.vy;

      star.vy += 0.025;
      star.alpha -= 0.025;
      star.rotation += star.rotationSpeed;
    });

    this.stars = this.stars.filter((star) => star.alpha > 0);
  }

  draw(context) {
    context.save();

    this.drawMagicCircle(context);
    this.drawEnergyRings(context);
    this.drawParticles(context);
    this.drawSphere(context);
    this.drawStars(context);

    context.restore();
  }

  drawMagicCircle(context) {
    const progress = Math.min(this.timer / 30, 1);

    if (this.phase !== "INVOCATION" && this.phase !== "SHRINK") {
      return;
    }

    const radius = 35 + progress * 15;

    context.save();

    context.translate(this.centerX, this.centerY + 15);

    context.globalAlpha = 0.7;
    context.strokeStyle = "#b56aff";
    context.lineWidth = 2;

    context.beginPath();
    context.ellipse(radius, 0, radius, 9, 0, 0, Math.PI * 2);
    context.stroke();

    context.strokeStyle = "#e5b5ff";
    context.lineWidth = 1;

    context.beginPath();
    context.ellipse(radius, 0, radius * 0.65, 5, 0, 0, Math.PI * 2);
    context.stroke();

    context.restore();
  }

  drawEnergyRings(context) {
    if (this.phase !== "SHRINK" && this.phase !== "STABILIZATION") {
      return;
    }

    context.save();
    context.translate(this.centerX, this.centerY);

    this.rings.forEach((ring, index) => {
      context.save();

      context.rotate(ring.rotation);
      context.globalAlpha = ring.alpha;

      context.strokeStyle = index % 2 === 0 ? "#c77dff" : "#75d8ff";

      context.lineWidth = 2;

      context.beginPath();
      context.ellipse(0, 0, ring.radius, ring.radius * 0.35, 0, 0, Math.PI * 2);
      context.stroke();

      // Petites sphères lumineuses sur les anneaux.
      const orbX = ring.radius;
      const orbY = 0;

      context.fillStyle = "#ffffff";
      context.shadowBlur = 10;
      context.shadowColor = "#c77dff";

      context.beginPath();
      context.arc(orbX, orbY, 3, 0, Math.PI * 2);
      context.fill();

      context.restore();
    });

    context.restore();
  }

  drawParticles(context) {
    if (this.phase === "RETURN" || this.phase === "FINISHED") {
      return;
    }

    context.save();

    this.particles.forEach((particle) => {
      const x = this.centerX + Math.cos(particle.angle) * particle.radius;

      const y = this.centerY + Math.sin(particle.angle) * particle.radius;

      context.globalAlpha = particle.alpha;
      context.fillStyle = "#e7c5ff";
      context.shadowBlur = 8;
      context.shadowColor = "#bd72ff";

      context.beginPath();
      context.arc(x, y, particle.size, 0, Math.PI * 2);
      context.fill();
    });

    context.restore();
  }

  drawSphere(context) {
    if (this.phase !== "STABILIZATION") return;

    const pulse = 1 + Math.sin(this.timer * 0.15) * 0.04;

    context.save();
    context.translate(this.centerX, this.centerY);
    context.scale(pulse, pulse);

    const radius = 48;

    const gradient = context.createRadialGradient(0, 0, 5, 0, 0, radius);

    gradient.addColorStop(0, "rgba(218, 185, 255, 0.08)");
    gradient.addColorStop(0.7, "rgba(155, 95, 255, 0.12)");
    gradient.addColorStop(1, "rgba(100, 180, 255, 0.02)");

    context.fillStyle = gradient;
    context.strokeStyle = "rgba(210, 160, 255, 0.8)";
    context.lineWidth = 2;

    context.beginPath();
    context.arc(0, 0, radius, 0, Math.PI * 2);
    context.fill();
    context.stroke();

    context.restore();
  }

  drawStars(context) {
    if (this.stars.length === 0) return;

    context.save();

    this.stars.forEach((star) => {
      context.save();

      context.translate(star.x, star.y);
      context.rotate(star.rotation);

      context.globalAlpha = Math.max(0, star.alpha);
      context.fillStyle = "#ffe99a";
      context.shadowBlur = 10;
      context.shadowColor = "#ffd45c";

      context.beginPath();

      context.moveTo(0, -star.size);
      context.lineTo(star.size * 0.3, -star.size * 0.3);
      context.lineTo(star.size, 0);
      context.lineTo(star.size * 0.3, star.size * 0.3);
      context.lineTo(0, star.size);
      context.lineTo(-star.size * 0.3, star.size * 0.3);
      context.lineTo(-star.size, 0);
      context.lineTo(-star.size * 0.3, -star.size * 0.3);

      context.closePath();
      context.fill();

      context.restore();
    });

    context.restore();
  }
}
