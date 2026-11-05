export class BubbleBeamAnimation {
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

    this.bubbles = [];
    this.particles = [];
    this.rings = [];

    this.originX =
      this.pokemonViewer.sprite.position.x +
      this.pokemonViewer.sprite.frameWidth / 2;

    this.originY =
      this.pokemonViewer.sprite.position.y +
      this.pokemonViewer.sprite.frameHeight / 2;

    this.targetX =
      this.targetViewer.sprite.position.x +
      this.targetViewer.sprite.frameWidth / 2;

    this.targetY =
      this.targetViewer.sprite.position.y +
      this.targetViewer.sprite.frameHeight / 2;

    this.dx = this.targetX - this.originX;
    this.dy = this.targetY - this.originY;

    this.distance = Math.sqrt(this.dx ** 2 + this.dy ** 2);

    this.directionX = this.dx / this.distance;
    this.directionY = this.dy / this.distance;

    this.perpendicularX = -this.directionY;
    this.perpendicularY = this.directionX;

    this.beamProgress = 0;
    this.beamSpeed = 9;

    this.maxBubbles = 65;
    this.bubblesCreated = 0;

    this.createRings();
  }

  update(context) {
    if (this.isFinished) return;

    switch (this.state) {
      case "PREPARE":
        this.updatePrepare();
        break;

      case "FIRE":
        this.updateFire();
        break;

      case "IMPACT":
        this.updateImpact();
        break;

      case "FINISH":
        this.updateFinish();
        break;
    }

    this.updateBubbles();
    this.updateParticles();
    this.updateRings();

    this.draw(context);
    this.timer++;
  }

  setState(state) {
    this.state = state;
    this.timer = 0;
  }

  updatePrepare() {
    if (this.timer >= 12) {
      this.setState("FIRE");
    }
  }

  updateFire() {
    this.beamProgress = Math.min(
      this.beamProgress + this.beamSpeed,
      this.distance
    );

    // Création d'un flux continu de bulles.
    if (this.bubblesCreated < this.maxBubbles) {
      for (let i = 0; i < 3; i++) {
        this.createBubble();
        this.bubblesCreated++;
      }
    }

    if (this.beamProgress >= this.distance && this.bubbles.length === 0) {
      this.setState("IMPACT");
    }
  }

  updateImpact() {
    if (this.timer === 1) {
      this.createImpactBurst();
      this.game.canvas.startShake(18, 2);
    }

    if (this.timer >= 20) {
      this.setState("FINISH");
    }
  }

  updateFinish() {
    if (this.timer >= 18 && this.particles.length === 0) {
      this.isFinished = true;
    }
  }

  createBubble() {
    const progress = Math.random() * this.beamProgress;

    const spread = (Math.random() - 0.5) * 13;

    const x =
      this.originX + this.directionX * progress + this.perpendicularX * spread;

    const y =
      this.originY + this.directionY * progress + this.perpendicularY * spread;

    const size = 3 + Math.random() * 5;

    this.bubbles.push({
      x,
      y,
      radius: size,
      phase: Math.random() * Math.PI * 2,
      speed: 5 + Math.random() * 3,
      life: 100,
      wobble: 0.5 + Math.random(),
      vx: this.directionX * (5 + Math.random() * 3),
      vy: this.directionY * (5 + Math.random() * 3),
    });
  }

  updateBubbles() {
    this.bubbles.forEach((bubble) => {
      bubble.x += bubble.vx;
      bubble.y += bubble.vy;

      bubble.phase += 0.15;

      bubble.x += Math.sin(bubble.phase) * bubble.wobble;
      bubble.y += Math.cos(bubble.phase) * bubble.wobble;

      bubble.life--;

      const dx = this.targetX - bubble.x;
      const dy = this.targetY - bubble.y;

      if (Math.sqrt(dx * dx + dy * dy) < 14) {
        bubble.life = 0;
        this.createBubbleBurst(bubble.x, bubble.y);
      }
    });

    this.bubbles = this.bubbles.filter((bubble) => bubble.life > 0);
  }

  createBubbleBurst(x, y) {
    for (let i = 0; i < 3; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 2;

      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 1 + Math.random() * 2,
        life: 15 + Math.random() * 10,
      });
    }
  }

  createImpactBurst() {
    for (let i = 0; i < 35; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 5;

      this.particles.push({
        x: this.targetX,
        y: this.targetY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 2 + Math.random() * 4,
        life: 20 + Math.random() * 15,
      });
    }

    this.rings.push({
      x: this.targetX,
      y: this.targetY,
      radius: 5,
      maxRadius: 48,
      life: 20,
    });
  }

  createRings() {
    for (let i = 0; i < 3; i++) {
      this.rings.push({
        x: this.originX,
        y: this.originY,
        radius: 3 + i * 3,
        maxRadius: 12 + i * 4,
        life: 18 + i * 3,
        initialLife: 18 + i * 3,
        followsBeam: true,
      });
    }
  }

  updateParticles() {
    this.particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      particle.vx *= 0.95;
      particle.vy *= 0.95;

      particle.radius *= 0.97;
      particle.life--;
    });

    this.particles = this.particles.filter((particle) => particle.life > 0);
  }

  updateRings() {
    this.rings.forEach((ring) => {
      if (ring.followsBeam) {
        ring.x += this.directionX * 4;
        ring.y += this.directionY * 4;
      }

      ring.radius += ring.followsBeam ? 0.3 : 2;
      ring.life--;
    });

    this.rings = this.rings.filter((ring) => ring.life > 0);
  }

  draw(context) {
    this.drawBeam(context);
    this.drawBubbles(context);
    this.drawRings(context);
    this.drawParticles(context);
  }

  drawBeam(context) {
    if (this.state !== "FIRE") return;

    const endX = this.originX + this.directionX * this.beamProgress;

    const endY = this.originY + this.directionY * this.beamProgress;

    context.save();
    context.globalCompositeOperation = "lighter";

    // Halo diffus autour du faisceau.
    context.strokeStyle = "rgba(60,180,255,0.2)";
    context.lineWidth = 23;
    context.lineCap = "round";
    context.beginPath();
    context.moveTo(this.originX, this.originY);
    context.lineTo(endX, endY);
    context.stroke();

    // Faisceau bleu principal.
    context.strokeStyle = "rgba(70,190,255,0.55)";
    context.lineWidth = 13;
    context.beginPath();
    context.moveTo(this.originX, this.originY);
    context.lineTo(endX, endY);
    context.stroke();

    // Cœur lumineux.
    context.strokeStyle = "rgba(220,250,255,0.75)";
    context.lineWidth = 4;
    context.beginPath();
    context.moveTo(this.originX, this.originY);
    context.lineTo(endX, endY);
    context.stroke();

    context.restore();
  }

  drawBubbles(context) {
    context.save();
    context.globalCompositeOperation = "lighter";

    this.bubbles.forEach((bubble) => {
      const pulse = Math.sin(bubble.phase) * 0.7;
      const radius = Math.max(1, bubble.radius + pulse);

      const gradient = context.createRadialGradient(
        bubble.x - radius * 0.35,
        bubble.y - radius * 0.35,
        0,
        bubble.x,
        bubble.y,
        radius * 1.3
      );

      gradient.addColorStop(0, "rgba(255,255,255,0.95)");
      gradient.addColorStop(0.3, "rgba(190,245,255,0.7)");
      gradient.addColorStop(0.7, "rgba(60,175,240,0.35)");
      gradient.addColorStop(1, "rgba(20,110,210,0.15)");

      context.fillStyle = gradient;
      context.strokeStyle = "rgba(190,240,255,0.9)";
      context.lineWidth = 1;

      context.beginPath();
      context.arc(bubble.x, bubble.y, radius, 0, Math.PI * 2);
      context.fill();
      context.stroke();

      // Reflet supérieur.
      context.fillStyle = "rgba(255,255,255,0.95)";
      context.beginPath();
      context.ellipse(
        bubble.x - radius * 0.35,
        bubble.y - radius * 0.35,
        radius * 0.25,
        radius * 0.15,
        -0.5,
        0,
        Math.PI * 2
      );
      context.fill();
    });

    context.restore();
  }

  drawRings(context) {
    context.save();

    this.rings.forEach((ring) => {
      const alpha = ring.life / (ring.initialLife || 20);

      context.globalAlpha = alpha * 0.65;
      context.strokeStyle = "#9beaff";
      context.lineWidth = 1.5;

      context.beginPath();
      context.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2);
      context.stroke();
    });

    context.restore();
  }

  drawParticles(context) {
    context.save();
    context.globalCompositeOperation = "lighter";

    this.particles.forEach((particle) => {
      context.globalAlpha = Math.min(1, particle.life / 12);
      context.fillStyle = "#a8efff";

      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fill();
    });

    context.restore();
  }
}
