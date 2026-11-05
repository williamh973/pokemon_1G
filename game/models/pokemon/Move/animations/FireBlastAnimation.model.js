export class FireBlastAnimation {
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

    this.particles = [];
    this.embers = [];
    this.firePillars = [];

    this.centerX =
      this.targetViewer.sprite.position.x +
      this.targetViewer.sprite.frameWidth / 2;

    this.centerY =
      this.targetViewer.sprite.position.y +
      this.targetViewer.sprite.frameHeight;

    this.explosionRadius = 0;
    this.flashOpacity = 0;
    this.shakeStarted = false;

    this.createFirePillars();
  }

  update(context) {
    if (this.isFinished) return;

    switch (this.state) {
      case "PREPARE":
        this.updatePrepare();
        break;

      case "EXPLOSION":
        this.updateExplosion();
        break;

      case "PILLARS":
        this.updatePillars();
        break;

      case "FINISH":
        this.updateFinish();
        break;
    }

    this.updateParticles();
    this.updateEmbers();

    this.draw(context);
    this.timer++;
  }

  setState(state) {
    this.state = state;
    this.timer = 0;
  }

  createFirePillars() {
    const offsets = [-48, -25, 0, 25, 48];

    offsets.forEach((offset, index) => {
      this.firePillars.push({
        x: this.centerX + offset,
        y: this.centerY + 20,
        height: 0,
        maxHeight: 85 + Math.random() * 55,
        width: 12 + Math.random() * 13,
        delay: index * 5,
        opacity: 1,
        phase: Math.random() * Math.PI * 2,
      });
    });
  }

  updatePrepare() {
    if (this.timer >= 24) {
      this.setState("EXPLOSION");
      this.game.canvas.startShake(35, 5);
    }
  }

  updateExplosion() {
    const progress = Math.min(this.timer / 18, 1);

    this.explosionRadius = progress * 78;
    this.flashOpacity = Math.max(0, 1 - this.timer / 15);

    if (this.timer === 1) {
      this.createExplosionParticles(55);
      this.createEmbers(35);
    }

    if (this.timer >= 22) {
      this.setState("PILLARS");
      this.game.canvas.startShake(45, 3);
    }
  }

  updatePillars() {
    this.firePillars.forEach((pillar) => {
      if (this.timer < pillar.delay) return;

      pillar.height = Math.min(pillar.height + 9, pillar.maxHeight);

      pillar.phase += 0.18;
    });

    if (this.timer % 5 === 0) {
      this.createEmbers(4);
    }

    if (this.timer >= 75) {
      this.setState("FINISH");
    }
  }

  updateFinish() {
    this.firePillars.forEach((pillar) => {
      pillar.opacity = Math.max(0, pillar.opacity - 0.035);
      pillar.height *= 0.97;
    });

    this.flashOpacity = Math.max(0, this.flashOpacity - 0.08);

    if (this.timer >= 35) {
      this.isFinished = true;
    }
  }

  createExplosionParticles(count) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 7;

      this.particles.push({
        x: this.centerX,
        y: this.centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 3 + Math.random() * 7,
        life: 25 + Math.random() * 25,
        maxLife: 50,
        color: Math.random() > 0.5 ? "#ffcc33" : "#ff5a16",
      });
    }
  }

  createEmbers(count) {
    for (let i = 0; i < count; i++) {
      this.embers.push({
        x: this.centerX + (Math.random() - 0.5) * 100,
        y: this.centerY + (Math.random() - 0.5) * 50,
        vx: (Math.random() - 0.5) * 2,
        vy: -1 - Math.random() * 3,
        radius: 1 + Math.random() * 3,
        life: 25 + Math.random() * 35,
      });
    }
  }

  updateParticles() {
    this.particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      particle.vx *= 0.94;
      particle.vy *= 0.94;

      particle.radius *= 0.96;
      particle.life--;
    });

    this.particles = this.particles.filter((particle) => particle.life > 0);
  }

  updateEmbers() {
    this.embers.forEach((ember) => {
      ember.x += ember.vx;
      ember.y += ember.vy;

      ember.vx += (Math.random() - 0.5) * 0.15;
      ember.vy -= 0.025;

      ember.life--;
    });

    this.embers = this.embers.filter((ember) => ember.life > 0);
  }

  draw(context) {
    this.drawExplosion(context);
    this.drawFirePillars(context);
    this.drawParticles(context);
    this.drawEmbers(context);
    this.drawFlash(context);
  }

  drawExplosion(context) {
    if (this.state !== "EXPLOSION") return;

    const radius = this.explosionRadius;

    const gradient = context.createRadialGradient(
      this.centerX,
      this.centerY,
      0,
      this.centerX,
      this.centerY,
      radius
    );

    gradient.addColorStop(0, "rgba(255,255,220,0.95)");
    gradient.addColorStop(0.25, "rgba(255,235,90,0.9)");
    gradient.addColorStop(0.6, "rgba(255,100,15,0.75)");
    gradient.addColorStop(1, "rgba(190,20,0,0)");

    context.save();
    context.globalCompositeOperation = "lighter";
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(this.centerX, this.centerY, radius, 0, Math.PI * 2);
    context.fill();

    // Anneau extérieur de l'explosion
    context.strokeStyle = `rgba(255,190,50,${Math.max(
      0,
      1 - this.timer / 22
    )})`;
    context.lineWidth = 4;
    context.beginPath();
    context.arc(this.centerX, this.centerY, radius * 0.85, 0, Math.PI * 2);
    context.stroke();

    context.restore();
  }

  drawFirePillars(context) {
    if (this.state !== "PILLARS" && this.state !== "FINISH") return;

    context.save();
    context.globalCompositeOperation = "lighter";

    this.firePillars.forEach((pillar) => {
      if (pillar.height <= 1 || pillar.opacity <= 0) return;

      const sway = Math.sin(pillar.phase) * 5;
      const width = pillar.width;
      const height = pillar.height;

      const x = pillar.x + sway;
      const y = pillar.y;

      context.globalAlpha = pillar.opacity;

      const gradient = context.createLinearGradient(x, y, x, y - height);

      gradient.addColorStop(0, "#ff3300");
      gradient.addColorStop(0.35, "#ff6b12");
      gradient.addColorStop(0.7, "#ffcc33");
      gradient.addColorStop(1, "rgba(255,245,170,0)");

      context.fillStyle = gradient;
      context.beginPath();

      context.moveTo(x - width, y);
      context.bezierCurveTo(
        x - width * 0.8,
        y - height * 0.35,
        x - width * 0.4 + sway,
        y - height * 0.7,
        x,
        y - height
      );

      context.bezierCurveTo(
        x + width * 0.5,
        y - height * 0.7,
        x + width * 1.2,
        y - height * 0.35,
        x + width,
        y
      );

      context.closePath();
      context.fill();

      // Cœur incandescent
      context.globalAlpha = pillar.opacity * 0.8;
      context.fillStyle = "#fff4a8";
      context.beginPath();
      context.ellipse(
        x,
        y - height * 0.38,
        width * 0.28,
        height * 0.22,
        0,
        0,
        Math.PI * 2
      );
      context.fill();
    });

    context.restore();
  }

  drawParticles(context) {
    context.save();
    context.globalCompositeOperation = "lighter";

    this.particles.forEach((particle) => {
      context.globalAlpha = Math.min(1, particle.life / 15);
      context.fillStyle = particle.color;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fill();
    });

    context.restore();
  }

  drawEmbers(context) {
    context.save();
    context.globalCompositeOperation = "lighter";

    this.embers.forEach((ember) => {
      context.globalAlpha = Math.min(1, ember.life / 15);
      context.fillStyle = "#ffb52e";

      context.beginPath();
      context.arc(ember.x, ember.y, ember.radius, 0, Math.PI * 2);
      context.fill();
    });

    context.restore();
  }

  drawFlash(context) {
    if (this.flashOpacity <= 0) return;

    context.save();
    context.globalAlpha = this.flashOpacity * 0.45;
    context.fillStyle = "#fff4c2";
    context.fillRect(0, 0, 320, 274);
    context.restore();
  }
}
