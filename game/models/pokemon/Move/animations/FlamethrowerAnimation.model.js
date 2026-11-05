export class FlamethrowerAnimation {
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
      PREPARE: 25,
      FIRE: 100,
      IMPACT: 55,
      FINISH: 35,
    };

    this.flames = [];
    this.embers = [];
    this.impactParticles = [];

    this.pokemonCenter = this.getCenter(this.pokemonViewer);
    this.targetCenter = this.getCenter(this.targetViewer);

    this.startX = this.pokemonCenter.x;
    this.startY = this.pokemonCenter.y - 5;

    this.endX = this.targetCenter.x;
    this.endY = this.targetCenter.y;

    this.angle = Math.atan2(this.endY - this.startY, this.endX - this.startX);

    this.distance = Math.hypot(
      this.endX - this.startX,
      this.endY - this.startY
    );

    this.fireWidth = 15;
    this.fireIntensity = 0;
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

    this.updateFlames();
    this.updateEmbers();
    this.updateImpactParticles();

    this.draw(context);

    this.timer++;
  }

  updatePrepare() {
    this.fireIntensity = Math.min(this.timer / 20, 1);

    if (this.timer % 4 === 0) {
      this.createEmber(this.startX, this.startY, true);
    }

    if (this.timer >= this.duration.PREPARE) {
      this.setState("FIRE");
    }
  }

  updateFire() {
    this.fireIntensity = 1;

    if (this.timer % 2 === 0) {
      this.createFlame();
    }

    if (this.timer % 3 === 0) {
      this.createEmber(
        this.startX + Math.cos(this.angle) * 15,
        this.startY + Math.sin(this.angle) * 15
      );
    }

    if (this.timer % 5 === 0) {
      this.createImpactParticle();
    }

    if (this.timer >= this.duration.FIRE) {
      this.setState("IMPACT");
    }
  }

  updateImpact() {
    this.fireIntensity = Math.max(0, 1 - this.timer / this.duration.IMPACT);

    if (this.timer % 2 === 0) {
      this.createImpactFlames();
    }

    if (this.timer % 3 === 0) {
      this.createEmber(this.targetCenter.x, this.targetCenter.y);
    }

    if (this.timer >= this.duration.IMPACT) {
      this.setState("FINISH");
    }
  }

  updateFinish() {
    this.fireIntensity = Math.max(0, 1 - this.timer / this.duration.FINISH);

    if (this.timer >= this.duration.FINISH) {
      this.isFinished = true;
    }
  }

  createFlame() {
    const progress = Math.random();

    const x = this.startX + (this.endX - this.startX) * progress;

    const y = this.startY + (this.endY - this.startY) * progress;

    const spread = this.fireWidth * (0.3 + progress * 0.9);

    this.flames.push({
      progress,
      x,
      y,
      offset: (Math.random() - 0.5) * spread,
      size: 5 + Math.random() * 9,
      length: 10 + Math.random() * 20,
      speed: 0.4 + Math.random() * 0.8,
      phase: Math.random() * Math.PI * 2,
      rotation: Math.random() * Math.PI * 2,
      life: 12 + Math.random() * 12,
      maxLife: 24,
      layer: Math.random(),
    });
  }

  createEmber(x, y, fromSource = false) {
    const angle = fromSource
      ? Math.random() * Math.PI * 2
      : this.angle + Math.PI + (Math.random() - 0.5) * 1.5;

    const speed = 1 + Math.random() * 2.5;

    this.embers.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 0.5,
      size: 1 + Math.random() * 2.5,
      life: 20 + Math.random() * 25,
      maxLife: 45,
    });
  }

  createImpactParticle() {
    const progress = Math.random();

    this.impactParticles.push({
      x: this.startX + (this.endX - this.startX) * progress,
      y: this.startY + (this.endY - this.startY) * progress,
      life: 15,
      maxLife: 15,
      size: 2 + Math.random() * 3,
    });
  }

  createImpactFlames() {
    for (let i = 0; i < 3; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 2.5;

      this.flames.push({
        progress: 1,
        x: this.targetCenter.x,
        y: this.targetCenter.y,
        offset: 0,
        size: 7 + Math.random() * 10,
        length: 12 + Math.random() * 15,
        speed,
        phase: Math.random() * Math.PI * 2,
        rotation: angle,
        life: 20 + Math.random() * 15,
        maxLife: 35,
        layer: Math.random(),
        impact: true,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
      });
    }
  }

  updateFlames() {
    for (const flame of this.flames) {
      flame.phase += 0.2;
      flame.rotation += 0.05;

      if (flame.impact) {
        flame.x += flame.vx;
        flame.y += flame.vy;
        flame.size *= 0.97;
      }

      flame.life--;
    }

    this.flames = this.flames.filter((flame) => flame.life > 0);
  }

  updateEmbers() {
    for (const ember of this.embers) {
      ember.x += ember.vx;
      ember.y += ember.vy;

      ember.vy -= 0.025;
      ember.vx *= 0.98;

      ember.life--;
    }

    this.embers = this.embers.filter((ember) => ember.life > 0);
  }

  updateImpactParticles() {
    for (const particle of this.impactParticles) {
      particle.life--;
    }

    this.impactParticles = this.impactParticles.filter(
      (particle) => particle.life > 0
    );
  }

  getFlamePoint(progress, offset = 0, phase = 0) {
    const x = this.startX + (this.endX - this.startX) * progress;

    const y = this.startY + (this.endY - this.startY) * progress;

    const wave = Math.sin(progress * 18 + this.timer * 0.22 + phase) * 4;

    return {
      x: x - Math.sin(this.angle) * (offset + wave),
      y: y + Math.cos(this.angle) * (offset + wave),
    };
  }

  draw(context) {
    if (this.state === "PREPARE") {
      this.drawPreparation(context);
    }

    if (this.state === "FIRE") {
      this.drawFireJet(context);
    }

    if (this.state === "IMPACT") {
      this.drawImpact(context);
    }

    this.drawFlameParticles(context);
    this.drawEmbers(context);
  }

  drawPreparation(context) {
    const pulse = 1 + Math.sin(this.timer * 0.4) * 0.15;

    context.save();

    const gradient = context.createRadialGradient(
      this.startX,
      this.startY,
      1,
      this.startX,
      this.startY,
      18 * pulse
    );

    gradient.addColorStop(0, "rgba(255, 255, 210, 0.95)");
    gradient.addColorStop(0.35, "rgba(255, 180, 40, 0.8)");
    gradient.addColorStop(0.7, "rgba(255, 70, 10, 0.35)");
    gradient.addColorStop(1, "rgba(255, 30, 0, 0)");

    context.fillStyle = gradient;
    context.beginPath();
    context.arc(this.startX, this.startY, 18 * pulse, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }

  drawFireJet(context) {
    const pulse = 1 + Math.sin(this.timer * 0.18) * 0.08;

    const width = this.fireWidth * pulse;
    const length = this.distance;

    context.save();

    context.translate(this.startX, this.startY);
    context.rotate(this.angle);

    // Halo extérieur rouge-orangé
    const outerGradient = context.createLinearGradient(0, 0, length, 0);

    outerGradient.addColorStop(0, "rgba(255, 100, 10, 0.65)");
    outerGradient.addColorStop(0.5, "rgba(255, 60, 0, 0.4)");
    outerGradient.addColorStop(1, "rgba(255, 80, 0, 0.15)");

    context.fillStyle = outerGradient;
    context.beginPath();
    context.moveTo(0, -width);
    context.quadraticCurveTo(length * 0.45, -width * 1.6, length, -width * 0.3);
    context.quadraticCurveTo(length * 0.65, width * 1.3, 0, width);
    context.closePath();
    context.fill();

    // Couche principale orange
    const orangeGradient = context.createLinearGradient(0, 0, length, 0);

    orangeGradient.addColorStop(0, "#ff3c08");
    orangeGradient.addColorStop(0.25, "#ff7414");
    orangeGradient.addColorStop(0.65, "#ff9a24");
    orangeGradient.addColorStop(1, "rgba(255, 80, 0, 0.2)");

    context.fillStyle = orangeGradient;
    context.beginPath();
    context.moveTo(0, -width * 0.7);
    context.bezierCurveTo(
      length * 0.3,
      -width * 1.3,
      length * 0.65,
      -width * 0.8,
      length,
      0
    );
    context.bezierCurveTo(
      length * 0.65,
      width * 0.8,
      length * 0.3,
      width * 1.3,
      0,
      width * 0.7
    );
    context.closePath();
    context.fill();

    // Cœur incandescent jaune
    const coreGradient = context.createLinearGradient(0, 0, length, 0);

    coreGradient.addColorStop(0, "#fff7b0");
    coreGradient.addColorStop(0.25, "#ffe66a");
    coreGradient.addColorStop(0.7, "#ffc23d");
    coreGradient.addColorStop(1, "rgba(255, 190, 60, 0.1)");

    context.fillStyle = coreGradient;
    context.shadowColor = "#ffe45c";
    context.shadowBlur = 12;

    context.beginPath();
    context.moveTo(0, -width * 0.25);
    context.bezierCurveTo(
      length * 0.3,
      -width * 0.55,
      length * 0.65,
      -width * 0.35,
      length,
      0
    );
    context.bezierCurveTo(
      length * 0.65,
      width * 0.35,
      length * 0.3,
      width * 0.55,
      0,
      width * 0.25
    );
    context.closePath();
    context.fill();

    // Turbulences internes
    context.shadowBlur = 0;

    for (let i = 0; i < 5; i++) {
      const progress = (i + 1) / 6;
      const x = length * progress;

      const wave = Math.sin(this.timer * 0.3 + i * 1.7) * width * 0.3;

      context.strokeStyle = "rgba(255, 255, 190, 0.65)";
      context.lineWidth = 1.5 + Math.random();

      context.beginPath();
      context.moveTo(x - 8, wave - width * 0.15);
      context.quadraticCurveTo(
        x,
        wave + width * 0.2,
        x + 9,
        wave - width * 0.1
      );
      context.stroke();
    }

    context.restore();

    // Flammes animées autour du jet
    this.drawStreamFlames(context);
  }

  drawStreamFlames(context) {
    context.save();

    for (const flame of this.flames) {
      if (flame.impact) continue;

      const point = this.getFlamePoint(
        flame.progress,
        flame.offset,
        flame.phase
      );

      context.save();
      context.translate(point.x, point.y);
      context.rotate(this.angle + flame.rotation);

      context.globalAlpha = Math.min(flame.life / flame.maxLife, 1);

      const gradient = context.createLinearGradient(
        0,
        flame.size,
        0,
        -flame.length
      );

      gradient.addColorStop(0, "#ff4a0b");
      gradient.addColorStop(0.45, "#ff9d20");
      gradient.addColorStop(1, "#fff6a0");

      context.fillStyle = gradient;
      context.shadowColor = "#ff7216";
      context.shadowBlur = 9;

      context.beginPath();
      context.moveTo(0, flame.size);
      context.quadraticCurveTo(
        flame.size,
        -flame.length * 0.4,
        0,
        -flame.length
      );
      context.quadraticCurveTo(-flame.size, -flame.length * 0.4, 0, flame.size);
      context.fill();

      context.restore();
    }

    context.restore();
  }

  drawImpact(context) {
    const progress = Math.min(this.timer / this.duration.IMPACT, 1);

    const pulse = 1 + Math.sin(this.timer * 0.3) * 0.15;
    const radius = (18 + progress * 10) * pulse;

    context.save();

    const gradient = context.createRadialGradient(
      this.targetCenter.x,
      this.targetCenter.y,
      1,
      this.targetCenter.x,
      this.targetCenter.y,
      radius
    );

    gradient.addColorStop(0, "rgba(255, 255, 200, 0.9)");
    gradient.addColorStop(0.3, "rgba(255, 190, 50, 0.75)");
    gradient.addColorStop(0.65, "rgba(255, 75, 10, 0.5)");
    gradient.addColorStop(1, "rgba(220, 30, 0, 0)");

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

    this.drawImpactFlameShapes(context);
  }

  drawImpactFlameShapes(context) {
    context.save();

    for (const flame of this.flames) {
      if (!flame.impact) continue;

      context.save();
      context.translate(flame.x, flame.y);
      context.rotate(flame.rotation);

      context.globalAlpha = Math.min(flame.life / flame.maxLife, 1);

      const gradient = context.createLinearGradient(
        0,
        flame.size,
        0,
        -flame.length
      );

      gradient.addColorStop(0, "#ff3908");
      gradient.addColorStop(0.5, "#ff9d22");
      gradient.addColorStop(1, "#fff5a0");

      context.fillStyle = gradient;
      context.shadowColor = "#ff5a10";
      context.shadowBlur = 12;

      context.beginPath();
      context.moveTo(0, flame.size);
      context.quadraticCurveTo(
        flame.size,
        -flame.length * 0.4,
        0,
        -flame.length
      );
      context.quadraticCurveTo(-flame.size, -flame.length * 0.4, 0, flame.size);
      context.fill();

      context.restore();
    }

    context.restore();
  }

  drawFlameParticles(context) {
    if (this.state !== "FIRE") return;

    context.save();

    for (const particle of this.impactParticles) {
      context.globalAlpha = particle.life / particle.maxLife;
      context.fillStyle = "#fff1a0";
      context.shadowColor = "#ff9b24";
      context.shadowBlur = 8;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fill();
    }

    context.restore();
  }

  drawEmbers(context) {
    context.save();

    for (const ember of this.embers) {
      context.globalAlpha = Math.min(ember.life / ember.maxLife, 1);

      context.fillStyle = "#ffb52e";
      context.shadowColor = "#ff5a10";
      context.shadowBlur = 7;

      context.beginPath();
      context.arc(ember.x, ember.y, ember.size, 0, Math.PI * 2);
      context.fill();
    }

    context.restore();
  }
}
