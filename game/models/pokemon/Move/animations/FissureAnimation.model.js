export class FissureAnimation {
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

    this.targetOriginPosition = {
      x: this.target.position.x,
      y: this.target.position.y,
    };

    this.center = {
      x: this.target.position.x + this.target.frameWidth / 2,
      y: this.target.position.y + this.target.frameHeight * 0.85,
    };

    this.phase = "OPEN";
    this.timer = 0;
    this.isFinished = false;

    this.holeRadius = 0;
    this.maxRadius = 75;

    this.particles = [];
    this.rings = [];
    this.energy = [];

    this.createInitialEnergy();
  }

  update(context) {
    this.timer++;

    switch (this.phase) {
      case "OPEN":
        this.updateOpen();
        break;

      case "SUCTION":
        this.updateSuction();
        break;

      case "ENGULF":
        this.updateEngulf();
        break;

      case "CLOSE":
        this.updateClose();
        break;

      case "FINISH":
        this.isFinished = true;
        break;
    }

    this.draw(context);
  }

  createInitialEnergy() {
    for (let i = 0; i < 24; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 45 + Math.random() * 35;

      this.energy.push({
        angle,
        radius,
        speed: 0.025 + Math.random() * 0.035,
        size: 2 + Math.random() * 3,
      });
    }
  }

  createParticle(x, y, color, size, vx, vy, life) {
    this.particles.push({
      x,
      y,
      color,
      size,
      vx,
      vy,
      life,
      maxLife: life,
    });
  }

  createRing(radius, speed, life) {
    this.rings.push({
      radius,
      speed,
      life,
      maxLife: life,
      rotation: Math.random() * Math.PI * 2,
    });
  }

  updateOpen() {
    this.holeRadius = Math.min(this.maxRadius, this.holeRadius + 3);

    if (this.timer === 1) {
      this.game.canvas.startShake(35, 3);
    }

    if (this.timer % 4 === 0) {
      this.createRing(15, 2.5, 35);
    }

    if (this.timer >= 28) {
      this.phase = "SUCTION";
      this.timer = 0;
    }
  }

  updateSuction() {
    if (this.timer % 2 === 0) {
      const angle = Math.random() * Math.PI * 2;
      const radius = this.maxRadius + Math.random() * 30;

      const x = this.center.x + Math.cos(angle) * radius;
      const y = this.center.y + Math.sin(angle) * radius * 0.3;

      this.createParticle(
        x,
        y,
        Math.random() < 0.5 ? "#40d9ee" : "#a5f5ff",
        2 + Math.random() * 4,
        (this.center.x - x) * 0.045,
        (this.center.y - y) * 0.045,
        45
      );
    }

    if (this.timer % 5 === 0) {
      this.createRing(this.maxRadius + 10, -1.5, 35);
    }

    if (this.timer === 1) {
      this.game.canvas.startShake(1000, 5);
    }

    if (this.timer >= 55) {
      this.phase = "ENGULF";
      this.timer = 0;
    }
  }

  updateEngulf() {
    // Le gouffre s'élargit brutalement.
    this.holeRadius = Math.min(105, this.holeRadius + 1.5);

    if (this.timer % 2 === 0) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 80 + Math.random() * 35;

      this.createParticle(
        this.center.x + Math.cos(angle) * radius,
        this.center.y + Math.sin(angle) * radius * 0.3,
        "#ffffff",
        2 + Math.random() * 5,
        (Math.random() - 0.5) * 3,
        -2 - Math.random() * 4,
        30
      );
    }

    if (this.timer === 1) {
      this.game.canvas.startShake(1000, 10);
    }

    this.target.position.y += 10;

    if (this.timer >= 25) {
      this.phase = "CLOSE";
      this.timer = 0;
    }
  }

  updateClose() {
    this.holeRadius = Math.max(0, this.holeRadius - 4);

    if (this.timer === 1) {
      // Dernière implosion du gouffre.
      for (let i = 0; i < 45; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 7;

        this.createParticle(
          this.center.x,
          this.center.y,
          ["#ffffff", "#51d9ee", "#087fae", "#183e65"][
            Math.floor(Math.random() * 4)
          ],
          2 + Math.random() * 5,
          Math.cos(angle) * speed,
          Math.sin(angle) * speed,
          35 + Math.random() * 20
        );
      }

      this.createRing(10, 5, 25);
      this.game.canvas.startShake(1000, 8);
    }

    if (this.timer >= 35) {
      this.phase = "FINISH";
      this.timer = 0;
      this.target.position.y = this.targetOriginPosition.y;
    }
  }

  updateEffects() {
    for (const particle of this.particles) {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life--;
    }

    this.particles = this.particles.filter((particle) => particle.life > 0);

    for (const ring of this.rings) {
      ring.radius += ring.speed;
      ring.rotation += 0.04;
      ring.life--;
    }

    this.rings = this.rings.filter((ring) => ring.life > 0);

    for (const energy of this.energy) {
      energy.angle += energy.speed;
    }
  }

  drawHole(context) {
    if (this.holeRadius <= 0) return;

    const x = this.center.x;
    const y = this.center.y;
    const r = this.holeRadius;

    context.save();

    // Ombre extérieure.
    const shadow = context.createRadialGradient(x, y, r * 0.3, x, y, r * 1.6);

    shadow.addColorStop(0, "rgba(0, 0, 0, 0.8)");
    shadow.addColorStop(0.65, "rgba(5, 35, 65, 0.55)");
    shadow.addColorStop(1, "rgba(5, 35, 65, 0)");

    context.fillStyle = shadow;
    context.beginPath();
    context.ellipse(x, y, r * 1.6, r * 0.5, 0, 0, Math.PI * 2);
    context.fill();

    // Intérieur du gouffre.
    const gradient = context.createRadialGradient(x, y, 0, x, y, r);

    gradient.addColorStop(0, "#020711");
    gradient.addColorStop(0.55, "#06182c");
    gradient.addColorStop(0.82, "#075078");
    gradient.addColorStop(0.94, "#28b9d4");
    gradient.addColorStop(1, "#b6f8ff");

    context.fillStyle = gradient;
    context.beginPath();
    context.ellipse(x, y, r, r * 0.3, 0, 0, Math.PI * 2);
    context.fill();

    // Bord lumineux.
    context.strokeStyle = "rgba(120, 240, 255, 0.9)";
    context.lineWidth = 3;
    context.beginPath();
    context.ellipse(x, y, r, r * 0.3, 0, 0, Math.PI * 2);
    context.stroke();

    // Spirale abyssale.
    context.strokeStyle = "rgba(55, 190, 220, 0.45)";
    context.lineWidth = 2;
    context.beginPath();

    for (let i = 0; i < 100; i++) {
      const progress = i / 100;
      const angle = progress * Math.PI * 5 + this.timer * 0.15;
      const radius = progress * r * 0.8;

      const px = x + Math.cos(angle) * radius;
      const py = y + Math.sin(angle) * radius * 0.25;

      if (i === 0) context.moveTo(px, py);
      else context.lineTo(px, py);
    }

    context.stroke();

    context.restore();
  }

  drawEnergy(context) {
    if (this.phase !== "OPEN" && this.phase !== "SUCTION") {
      return;
    }

    context.save();

    for (const energy of this.energy) {
      const x = this.center.x + Math.cos(energy.angle) * energy.radius;

      const y = this.center.y + Math.sin(energy.angle) * energy.radius * 0.3;

      context.fillStyle = "#79eaff";
      context.shadowColor = "#26c9f5";
      context.shadowBlur = 9;

      context.beginPath();
      context.arc(x, y, energy.size, 0, Math.PI * 2);
      context.fill();
    }

    context.restore();
  }

  drawRings(context) {
    for (const ring of this.rings) {
      const alpha = ring.life / ring.maxLife;

      context.save();

      context.strokeStyle = `rgba(100, 225, 255, ${alpha})`;

      context.lineWidth = 2.5 * alpha;

      context.beginPath();
      context.ellipse(
        this.center.x,
        this.center.y,
        ring.radius,
        ring.radius * 0.3,
        ring.rotation,
        0,
        Math.PI * 2
      );
      context.stroke();

      context.restore();
    }
  }

  drawParticles(context) {
    for (const particle of this.particles) {
      context.save();

      context.globalAlpha = Math.max(0, particle.life / particle.maxLife);

      context.fillStyle = particle.color;
      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fill();

      context.restore();
    }
  }

  drawFlash(context) {
    if (this.phase !== "CLOSE" || this.timer > 5) {
      return;
    }

    const alpha = 0.65 * (1 - this.timer / 5);

    context.fillStyle = `rgba(180, 245, 255, ${alpha})`;

    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
  }

  draw(context) {
    this.updateEffects();

    context.save();

    this.drawEnergy(context);
    this.drawRings(context);
    this.drawHole(context);
    this.drawParticles(context);
    this.drawFlash(context);

    context.restore();
  }
}
