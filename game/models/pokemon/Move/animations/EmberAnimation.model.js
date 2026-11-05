export class EmberAnimation {
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

    this.duration = {
      PREPARE: 20,
      FIRE: 30,
      IMPACT: 35,
      FINISH: 25,
    };

    this.fireParticles = [];
    this.embers = [];
    this.flames = [];

    this.projectile = {
      x: 0,
      y: 0,
      radius: 7,
      progress: 0,
    };

    this.pokemonCenter = this.getCenter(this.pokemonViewer);
    this.targetCenter = this.getCenter(this.targetViewer);

    this.startX = this.pokemonCenter.x;
    this.startY = this.pokemonCenter.y - 5;

    this.endX = this.targetCenter.x;
    this.endY = this.targetCenter.y;

    this.angle = Math.atan2(this.endY - this.startY, this.endX - this.startX);

    this.projectile.x = this.startX;
    this.projectile.y = this.startY;
  }

  getCenter(viewer) {
    return {
      x: viewer.sprite.position.x + viewer.sprite.frameWidth / 2,
      y: viewer.sprite.position.y + viewer.sprite.frameHeight / 2,
    };
  }

  setState(state) {
    this.state = state;
    this.timer = 0;
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

    this.updateParticles();
    this.updateEmbers();
    this.updateFlames();

    // Dessin de l'animation
    this.draw(context);

    this.timer++;
  }

  updatePrepare() {
    if (this.timer % 4 === 0) {
      this.createEmber(
        this.startX + (Math.random() - 0.5) * 12,
        this.startY + (Math.random() - 0.5) * 12
      );
    }

    if (this.timer >= this.duration.PREPARE) {
      this.setState("FIRE");
    }
  }

  updateFire() {
    const progress = Math.min(this.timer / this.duration.FIRE, 1);

    this.projectile.progress = progress;

    this.projectile.x = this.startX + (this.endX - this.startX) * progress;

    this.projectile.y = this.startY + (this.endY - this.startY) * progress;

    if (this.timer % 2 === 0) {
      this.createFireParticle();
    }

    if (this.timer % 3 === 0) {
      this.createEmber(this.projectile.x, this.projectile.y);
    }

    if (this.timer >= this.duration.FIRE) {
      this.createImpactFlames();
      this.setState("IMPACT");
    }
  }

  updateImpact() {
    if (this.timer % 3 === 0) {
      this.createImpactFlames();
    }

    if (this.timer % 2 === 0) {
      this.createEmber(this.targetCenter.x, this.targetCenter.y);
    }

    if (this.timer >= this.duration.IMPACT) {
      this.setState("FINISH");
    }
  }

  updateFinish() {
    if (this.timer >= this.duration.FINISH) {
      this.isFinished = true;
    }
  }

  createFireParticle() {
    const spread = (Math.random() - 0.5) * 12;

    this.fireParticles.push({
      x: this.projectile.x + Math.cos(this.angle + Math.PI / 2) * spread,
      y: this.projectile.y + Math.sin(this.angle + Math.PI / 2) * spread,
      size: 3 + Math.random() * 4,
      life: 12 + Math.random() * 10,
      maxLife: 22,
      speed: 0.5 + Math.random(),
      angle: this.angle + Math.PI + (Math.random() - 0.5) * 0.8,
    });
  }

  createEmber(x, y) {
    this.embers.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 2,
      vy: -0.8 - Math.random() * 1.8,
      size: 1 + Math.random() * 2.5,
      life: 18 + Math.random() * 20,
      maxLife: 38,
    });
  }

  createImpactFlames() {
    for (let i = 0; i < 3; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 2;

      this.flames.push({
        x: this.targetCenter.x,
        y: this.targetCenter.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 5 + Math.random() * 7,
        rotation: angle,
        rotationSpeed: (Math.random() - 0.5) * 0.15,
        life: 15 + Math.random() * 12,
        maxLife: 27,
      });
    }
  }

  updateParticles() {
    for (const particle of this.fireParticles) {
      particle.x += Math.cos(particle.angle) * particle.speed;
      particle.y += Math.sin(particle.angle) * particle.speed;
      particle.life--;
    }

    this.fireParticles = this.fireParticles.filter(
      (particle) => particle.life > 0
    );
  }

  updateEmbers() {
    for (const ember of this.embers) {
      ember.x += ember.vx;
      ember.y += ember.vy;
      ember.vy -= 0.025;
      ember.life--;
    }

    this.embers = this.embers.filter((ember) => ember.life > 0);
  }

  updateFlames() {
    for (const flame of this.flames) {
      flame.x += flame.vx;
      flame.y += flame.vy;
      flame.rotation += flame.rotationSpeed;
      flame.size *= 0.97;
      flame.life--;
    }

    this.flames = this.flames.filter((flame) => flame.life > 0);
  }

  draw(context) {
    if (this.state === "PREPARE") {
      this.drawPreparation(context);
    }

    if (this.state === "FIRE") {
      this.drawProjectile(context);
    }

    if (this.state === "IMPACT") {
      this.drawImpact(context);
    }

    this.drawFireParticles(context);
    this.drawFlames(context);
    this.drawEmbers(context);
  }

  drawPreparation(context) {
    const pulse = 1 + Math.sin(this.timer * 0.5) * 0.15;

    context.save();

    const gradient = context.createRadialGradient(
      this.startX,
      this.startY,
      1,
      this.startX,
      this.startY,
      13 * pulse
    );

    gradient.addColorStop(0, "rgba(255, 255, 170, 0.9)");
    gradient.addColorStop(0.4, "rgba(255, 140, 30, 0.65)");
    gradient.addColorStop(1, "rgba(255, 60, 0, 0)");

    context.fillStyle = gradient;
    context.beginPath();
    context.arc(this.startX, this.startY, 13 * pulse, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }

  drawProjectile(context) {
    const pulse = 1 + Math.sin(this.timer * 0.6) * 0.12;
    const radius = this.projectile.radius * pulse;

    context.save();

    // Halo extérieur
    const halo = context.createRadialGradient(
      this.projectile.x,
      this.projectile.y,
      1,
      this.projectile.x,
      this.projectile.y,
      radius * 2.5
    );

    halo.addColorStop(0, "rgba(255, 255, 150, 0.7)");
    halo.addColorStop(0.5, "rgba(255, 110, 20, 0.4)");
    halo.addColorStop(1, "rgba(255, 40, 0, 0)");

    context.fillStyle = halo;
    context.beginPath();
    context.arc(
      this.projectile.x,
      this.projectile.y,
      radius * 2.5,
      0,
      Math.PI * 2
    );
    context.fill();

    // Boule de feu
    const gradient = context.createRadialGradient(
      this.projectile.x - radius * 0.3,
      this.projectile.y - radius * 0.3,
      1,
      this.projectile.x,
      this.projectile.y,
      radius
    );

    gradient.addColorStop(0, "#fffbd0");
    gradient.addColorStop(0.35, "#ffe45c");
    gradient.addColorStop(0.7, "#ff8b20");
    gradient.addColorStop(1, "#e52b08");

    context.fillStyle = gradient;
    context.shadowColor = "#ff6b16";
    context.shadowBlur = 14;

    context.beginPath();
    context.arc(this.projectile.x, this.projectile.y, radius, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }

  drawImpact(context) {
    const progress = Math.min(this.timer / this.duration.IMPACT, 1);

    const radius = 7 + progress * 19;
    const alpha = 1 - progress;

    context.save();
    context.globalAlpha = alpha;

    const gradient = context.createRadialGradient(
      this.targetCenter.x,
      this.targetCenter.y,
      1,
      this.targetCenter.x,
      this.targetCenter.y,
      radius
    );

    gradient.addColorStop(0, "#fffbd0");
    gradient.addColorStop(0.3, "#ffe45c");
    gradient.addColorStop(0.65, "#ff791c");
    gradient.addColorStop(1, "rgba(220, 35, 0, 0)");

    context.fillStyle = gradient;
    context.beginPath();
    context.arc(
      this.targetCenter.x,
      this.targetCenter.y,
      radius,
      0,
      Math.PI * 2
    );
    context.fill();

    context.restore();
  }

  drawFireParticles(context) {
    context.save();

    for (const particle of this.fireParticles) {
      const alpha = Math.min(particle.life / particle.maxLife, 1);

      context.globalAlpha = alpha;
      context.fillStyle = "#ffb52e";
      context.shadowColor = "#ff6b16";
      context.shadowBlur = 7;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fill();
    }

    context.restore();
  }

  drawFlames(context) {
    context.save();

    for (const flame of this.flames) {
      context.save();
      context.translate(flame.x, flame.y);
      context.rotate(flame.rotation);

      context.globalAlpha = Math.min(flame.life / flame.maxLife, 1);

      const gradient = context.createLinearGradient(
        0,
        flame.size,
        0,
        -flame.size
      );

      gradient.addColorStop(0, "#ff3b08");
      gradient.addColorStop(0.5, "#ff9d20");
      gradient.addColorStop(1, "#fff5a0");

      context.fillStyle = gradient;
      context.shadowColor = "#ff5a10";
      context.shadowBlur = 10;

      context.beginPath();
      context.moveTo(0, flame.size);
      context.quadraticCurveTo(flame.size * 0.9, 0, 0, -flame.size);
      context.quadraticCurveTo(-flame.size * 0.9, 0, 0, flame.size);
      context.fill();

      context.restore();
    }

    context.restore();
  }

  drawEmbers(context) {
    context.save();

    for (const ember of this.embers) {
      context.globalAlpha = Math.min(ember.life / ember.maxLife, 1);

      context.fillStyle = "#ffb52e";
      context.shadowColor = "#ff6b16";
      context.shadowBlur = 6;

      context.beginPath();
      context.arc(ember.x, ember.y, ember.size, 0, Math.PI * 2);
      context.fill();
    }

    context.restore();
  }
}
