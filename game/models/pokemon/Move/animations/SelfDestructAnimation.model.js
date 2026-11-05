export class SelfDestructAnimation {
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

    this.phase = "CHARGE";
    this.timer = 0;
    this.isFinished = false;

    const sprite = this.pokemonViewer.sprite;

    this.centerX = sprite.position.x + sprite.frameWidth / 2;
    this.centerY = sprite.position.y + sprite.frameHeight / 2;

    this.explosionRadius = 0;
    this.maxExplosionRadius = 145;

    this.flashOpacity = 0;
    this.energyOpacity = 0;
    this.smokeOpacity = 0;

    this.shockwaves = [];
    this.fireParticles = [];
    this.debris = [];
    this.smokeParticles = [];
    this.energyParticles = [];

    this.createEnergyParticles();
  }

  update(context) {
    this.timer++;

    switch (this.phase) {
      case "CHARGE":
        this.updateCharge();
        break;

      case "OVERLOAD":
        this.updateOverload();
        break;

      case "EXPLOSION":
        this.updateExplosion();
        break;

      case "SHOCKWAVE":
        this.updateShockwave();
        break;

      case "DISSIPATION":
        this.updateDissipation();
        break;
    }

    this.draw(context);
  }

  // --------------------------------------------------
  // PHASE 1 : CHARGE
  // --------------------------------------------------

  updateCharge() {
    this.energyOpacity = Math.min(1, this.timer / 30);

    if (this.timer >= 35) {
      this.nextPhase("OVERLOAD");
    }
  }

  // --------------------------------------------------
  // PHASE 2 : OVERLOAD
  // --------------------------------------------------

  updateOverload() {
    this.energyOpacity = 0.7 + Math.sin(this.timer * 0.45) * 0.3;

    this.updateEnergyParticles();

    if (this.timer >= 25) {
      this.nextPhase("EXPLOSION");

      this.flashOpacity = 1;
      this.explosionRadius = 12;

      this.createExplosionParticles();
      this.createShockwaves();

      this.game.canvas.startShake(35, 9);
    }
  }

  // --------------------------------------------------
  // PHASE 3 : EXPLOSION
  // --------------------------------------------------

  updateExplosion() {
    const progress = Math.min(this.timer / 32, 1);

    this.explosionRadius = 12 + (this.maxExplosionRadius - 12) * progress;

    this.flashOpacity = Math.max(0, 1 - this.timer * 0.055);

    this.updateFireParticles();
    this.updateDebris();
    this.updateShockwaves();

    if (this.timer >= 32) {
      this.nextPhase("SHOCKWAVE");
    }
  }

  // --------------------------------------------------
  // PHASE 4 : SHOCKWAVE
  // --------------------------------------------------

  updateShockwave() {
    this.explosionRadius = Math.max(0, this.explosionRadius - 1.1);

    this.updateShockwaves();
    this.updateFireParticles();
    this.updateDebris();

    this.smokeOpacity = Math.min(0.8, this.timer * 0.025);

    if (this.timer >= 45) {
      this.nextPhase("DISSIPATION");
    }
  }

  // --------------------------------------------------
  // PHASE 5 : DISSIPATION
  // --------------------------------------------------

  updateDissipation() {
    this.smokeOpacity = Math.max(0, 0.8 - this.timer * 0.012);

    this.flashOpacity = 0;

    this.updateFireParticles();
    this.updateDebris();
    this.updateSmokeParticles();
    this.updateShockwaves();

    if (this.timer >= 65) {
      this.isFinished = true;
    }
  }

  // --------------------------------------------------
  // PHASE MANAGEMENT
  // --------------------------------------------------

  nextPhase(phase) {
    this.phase = phase;
    this.timer = 0;
  }

  // --------------------------------------------------
  // PARTICLE CREATION
  // --------------------------------------------------

  createEnergyParticles() {
    for (let i = 0; i < 24; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 35 + Math.random() * 30;

      this.energyParticles.push({
        angle,
        distance,
        speed: 0.5 + Math.random() * 1.5,
        size: 1.5 + Math.random() * 2.5,
      });
    }
  }

  createExplosionParticles() {
    for (let i = 0; i < 75; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 7;

      this.fireParticles.push({
        x: this.centerX,
        y: this.centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 5,
        life: 35 + Math.random() * 35,
        maxLife: 70,
        color: Math.random() > 0.5 ? "#ffb52e" : "#ff5428",
      });
    }

    for (let i = 0; i < 28; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 8;

      this.debris.push({
        x: this.centerX,
        y: this.centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.3,
        size: 2 + Math.random() * 5,
        life: 35 + Math.random() * 30,
      });
    }

    for (let i = 0; i < 30; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 45;

      this.smokeParticles.push({
        x: this.centerX + Math.cos(angle) * distance,
        y: this.centerY + Math.sin(angle) * distance,
        vx: Math.cos(angle) * (0.5 + Math.random()),
        vy: -0.5 - Math.random() * 1.5,
        size: 8 + Math.random() * 13,
        life: 65 + Math.random() * 30,
        maxLife: 95,
      });
    }
  }

  createShockwaves() {
    for (let i = 0; i < 4; i++) {
      this.shockwaves.push({
        radius: 8 + i * 7,
        speed: 4 + i * 1.2,
        opacity: 0.9 - i * 0.12,
        width: 5 - i * 0.7,
      });
    }
  }

  // --------------------------------------------------
  // PARTICLE UPDATES
  // --------------------------------------------------

  updateEnergyParticles() {
    this.energyParticles.forEach((particle) => {
      particle.angle += 0.08;
      particle.distance -= particle.speed;

      if (particle.distance < 5) {
        particle.distance = 55 + Math.random() * 20;
      }
    });
  }

  updateFireParticles() {
    this.fireParticles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      particle.vx *= 0.96;
      particle.vy *= 0.96;

      particle.vy += 0.04;
      particle.life--;
    });

    this.fireParticles = this.fireParticles.filter(
      (particle) => particle.life > 0
    );
  }

  updateDebris() {
    this.debris.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      particle.vx *= 0.98;
      particle.vy *= 0.98;
      particle.vy += 0.12;

      particle.rotation += particle.rotationSpeed;
      particle.life--;
    });

    this.debris = this.debris.filter((particle) => particle.life > 0);
  }

  updateShockwaves() {
    this.shockwaves.forEach((wave) => {
      wave.radius += wave.speed;
      wave.opacity -= 0.025;
    });

    this.shockwaves = this.shockwaves.filter((wave) => wave.opacity > 0);
  }

  updateSmokeParticles() {
    this.smokeParticles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      particle.vx *= 0.99;
      particle.vy *= 0.99;

      particle.size += 0.12;
      particle.life--;
    });

    this.smokeParticles = this.smokeParticles.filter(
      (particle) => particle.life > 0
    );
  }

  // --------------------------------------------------
  // MAIN DRAW
  // --------------------------------------------------

  draw(context) {
    this.drawEnergyAura(context);
    this.drawEnergyParticles(context);
    this.drawFlash(context);
    this.drawExplosion(context);
    this.drawShockwaves(context);
    this.drawFireParticles(context);
    this.drawDebris(context);
    this.drawSmokeParticles(context);
  }

  // --------------------------------------------------
  // ENERGY AURA
  // --------------------------------------------------

  drawEnergyAura(context) {
    if (this.energyOpacity <= 0 || this.phase === "DISSIPATION") {
      return;
    }

    const pulse = 1 + Math.sin(this.timer * 0.3) * 0.08;

    context.save();

    const gradient = context.createRadialGradient(
      this.centerX,
      this.centerY,
      5,
      this.centerX,
      this.centerY,
      65 * pulse
    );

    gradient.addColorStop(0, `rgba(255,255,220,${this.energyOpacity})`);
    gradient.addColorStop(
      0.35,
      `rgba(255,210,60,${this.energyOpacity * 0.65})`
    );
    gradient.addColorStop(1, "rgba(255,100,0,0)");

    context.fillStyle = gradient;
    context.beginPath();
    context.arc(this.centerX, this.centerY, 65 * pulse, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }

  drawEnergyParticles(context) {
    if (this.phase !== "CHARGE" && this.phase !== "OVERLOAD") {
      return;
    }

    context.save();

    this.energyParticles.forEach((particle) => {
      const x = this.centerX + Math.cos(particle.angle) * particle.distance;

      const y = this.centerY + Math.sin(particle.angle) * particle.distance;

      context.globalAlpha = this.energyOpacity;
      context.fillStyle = "#fff4a3";

      context.beginPath();
      context.arc(x, y, particle.size, 0, Math.PI * 2);
      context.fill();
    });

    context.restore();
  }

  // --------------------------------------------------
  // FLASH
  // --------------------------------------------------

  drawFlash(context) {
    if (this.flashOpacity <= 0) return;

    context.save();

    context.globalAlpha = this.flashOpacity * 0.85;
    context.fillStyle = "#ffffff";

    context.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);

    context.restore();
  }

  // --------------------------------------------------
  // EXPLOSION
  // --------------------------------------------------

  drawExplosion(context) {
    if (this.explosionRadius <= 0) return;

    this.game.canvas.startShake(1000, 6);

    context.save();

    const radius = this.explosionRadius;

    const gradient = context.createRadialGradient(
      this.centerX,
      this.centerY,
      0,
      this.centerX,
      this.centerY,
      radius
    );

    gradient.addColorStop(0, "rgba(255,255,235,0.98)");
    gradient.addColorStop(0.25, "rgba(255,240,120,0.98)");
    gradient.addColorStop(0.55, "rgba(255,145,30,0.95)");
    gradient.addColorStop(0.8, "rgba(240,55,15,0.8)");
    gradient.addColorStop(1, "rgba(150,20,10,0)");

    context.fillStyle = gradient;
    context.beginPath();
    context.arc(this.centerX, this.centerY, radius, 0, Math.PI * 2);
    context.fill();

    // Irrégularités de la boule de feu
    context.globalAlpha = 0.45;

    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 * i) / 12;
      const variation = Math.sin(this.timer * 0.4 + i) * 8;

      const x = this.centerX + Math.cos(angle) * (radius * 0.7 + variation);

      const y = this.centerY + Math.sin(angle) * (radius * 0.7 + variation);

      context.fillStyle = i % 2 === 0 ? "#fff1a0" : "#ff5722";

      context.beginPath();
      context.arc(x, y, radius * 0.2, 0, Math.PI * 2);
      context.fill();
    }

    context.restore();
  }

  // --------------------------------------------------
  // SHOCKWAVES
  // --------------------------------------------------

  drawShockwaves(context) {
    if (this.shockwaves.length === 0) return;

    context.save();

    this.shockwaves.forEach((wave) => {
      context.globalAlpha = wave.opacity;
      context.strokeStyle = "#fff5cf";
      context.lineWidth = wave.width;

      context.beginPath();
      context.arc(this.centerX, this.centerY, wave.radius, 0, Math.PI * 2);
      context.stroke();
    });

    context.restore();
  }

  // --------------------------------------------------
  // FIRE PARTICLES
  // --------------------------------------------------

  drawFireParticles(context) {
    context.save();

    this.fireParticles.forEach((particle) => {
      const alpha = Math.min(1, particle.life / 25);

      context.globalAlpha = alpha;
      context.fillStyle = particle.color;

      context.beginPath();
      context.arc(
        particle.x,
        particle.y,
        particle.size * alpha,
        0,
        Math.PI * 2
      );
      context.fill();
    });

    context.restore();
  }

  // --------------------------------------------------
  // DEBRIS
  // --------------------------------------------------

  drawDebris(context) {
    context.save();

    this.debris.forEach((particle) => {
      context.save();

      context.translate(particle.x, particle.y);
      context.rotate(particle.rotation);

      context.globalAlpha = Math.min(1, particle.life / 20);
      context.fillStyle = "#5b3426";

      context.fillRect(
        -particle.size / 2,
        -particle.size / 2,
        particle.size,
        particle.size
      );

      context.restore();
    });

    context.restore();
  }

  // --------------------------------------------------
  // SMOKE
  // --------------------------------------------------

  drawSmokeParticles(context) {
    context.save();

    this.smokeParticles.forEach((particle) => {
      const alpha = Math.min(
        0.5,
        (particle.life / particle.maxLife) * this.smokeOpacity
      );

      context.globalAlpha = alpha;
      context.fillStyle = "#55515a";

      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fill();
    });

    context.restore();
  }
}
