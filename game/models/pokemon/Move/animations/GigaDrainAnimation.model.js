export class GigaDrainAnimation {
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
      PREPARE: 45,
      DRAIN: 110,
      IMPACT: 75,
      FINISH: 45,
    };

    this.particles = [];
    this.leaves = [];
    this.vines = [];
    this.energyOrbs = [];

    this.pokemonCenter = this.getCenter(this.pokemonViewer);
    this.targetCenter = this.getCenter(this.targetViewer);

    this.createVines();
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

      case "DRAIN":
        this.updateDrain();
        break;

      case "IMPACT":
        this.updateImpact();
        break;

      case "FINISH":
        this.updateFinish();
        break;
    }

    this.updateParticles();
    this.updateLeaves();
    this.updateVines();

    this.draw(context);

    this.timer++;
  }

  updatePrepare() {
    if (this.timer >= this.duration.PREPARE) {
      this.setState("DRAIN");
    }
  }

  updateDrain() {
    if (this.timer % 3 === 0) {
      this.createDrainParticles();
    }

    if (this.timer % 8 === 0) {
      this.createEnergyOrb();
    }

    if (this.timer % 12 === 0) {
      this.createLeaves();
    }

    if (this.timer >= this.duration.DRAIN) {
      this.setState("IMPACT");
    }
  }

  updateImpact() {
    if (this.timer % 2 === 0) {
      this.createDrainParticles();
    }

    if (this.timer % 4 === 0) {
      this.createEnergyOrb();
    }

    if (this.timer % 6 === 0) {
      this.createLeaves();
    }

    if (this.timer >= this.duration.IMPACT) {
      this.setState("FINISH");
    }
  }

  updateFinish() {
    if (this.timer === 1) {
      this.createRecoveryBurst();
    }

    if (this.timer >= this.duration.FINISH) {
      this.isFinished = true;
    }
  }

  createVines() {
    for (let i = 0; i < 5; i++) {
      this.vines.push({
        offset: ((Math.PI * 2) / 5) * i,
        phase: Math.random() * Math.PI * 2,
        amplitude: 10 + Math.random() * 12,
        length: 0.7 + Math.random() * 0.3,
      });
    }
  }

  updateVines() {
    for (const vine of this.vines) {
      vine.phase += 0.07;
    }
  }

  createDrainParticles() {
    const progress = Math.random();

    const x =
      this.targetCenter.x +
      (this.pokemonCenter.x - this.targetCenter.x) * progress;

    const y =
      this.targetCenter.y +
      (this.pokemonCenter.y - this.targetCenter.y) * progress;

    this.particles.push({
      x: x + (Math.random() - 0.5) * 18,
      y: y + (Math.random() - 0.5) * 18,
      radius: 2 + Math.random() * 3,
      speed: 1.5 + Math.random() * 2.5,
      life: 35 + Math.random() * 20,
      angle: Math.atan2(this.pokemonCenter.y - y, this.pokemonCenter.x - x),
      color: Math.random() > 0.5 ? "#a7ff83" : "#24d66b",
    });
  }

  createEnergyOrb() {
    this.energyOrbs.push({
      angle: Math.random() * Math.PI * 2,
      radius: 20 + Math.random() * 30,
      speed: 0.035 + Math.random() * 0.035,
      size: 3 + Math.random() * 4,
      life: 55,
    });
  }

  createLeaves() {
    this.leaves.push({
      x: this.targetCenter.x + (Math.random() - 0.5) * 25,
      y: this.targetCenter.y + (Math.random() - 0.5) * 25,
      angle: Math.random() * Math.PI * 2,
      rotation: Math.random() * Math.PI,
      speed: 1 + Math.random() * 2,
      size: 5 + Math.random() * 5,
      life: 45,
    });
  }

  createRecoveryBurst() {
    for (let i = 0; i < 35; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 3;

      this.particles.push({
        x: this.pokemonCenter.x,
        y: this.pokemonCenter.y,
        radius: 2 + Math.random() * 3,
        speed,
        life: 35 + Math.random() * 20,
        angle,
        color: Math.random() > 0.5 ? "#d6ff9c" : "#39ed83",
      });
    }
  }

  updateParticles() {
    for (const particle of this.particles) {
      particle.x += Math.cos(particle.angle) * particle.speed;
      particle.y += Math.sin(particle.angle) * particle.speed;
      particle.life--;
    }

    this.particles = this.particles.filter((particle) => particle.life > 0);

    for (const orb of this.energyOrbs) {
      orb.angle += orb.speed;
      orb.life--;
    }

    this.energyOrbs = this.energyOrbs.filter((orb) => orb.life > 0);
  }

  updateLeaves() {
    for (const leaf of this.leaves) {
      leaf.x += Math.cos(leaf.angle) * leaf.speed;
      leaf.y += Math.sin(leaf.angle) * leaf.speed;
      leaf.rotation += 0.12;
      leaf.life--;
    }

    this.leaves = this.leaves.filter((leaf) => leaf.life > 0);
  }

  draw(context) {
    if (this.isFinished) return;

    this.drawTargetAura(context);
    this.drawVines(context);
    this.drawEnergyStream(context);
    this.drawEnergyOrbs(context);
    this.drawParticles(context);
    this.drawLeaves(context);
    this.drawAttackerAura(context);
  }

  drawTargetAura(context) {
    if (this.state === "FINISH") return;

    const pulse = 1 + Math.sin(this.timer * 0.12) * 0.12;
    const radius = 30 * pulse;

    const gradient = context.createRadialGradient(
      this.targetCenter.x,
      this.targetCenter.y,
      2,
      this.targetCenter.x,
      this.targetCenter.y,
      radius
    );

    gradient.addColorStop(0, "rgba(120, 255, 90, 0.35)");
    gradient.addColorStop(0.55, "rgba(50, 220, 100, 0.18)");
    gradient.addColorStop(1, "rgba(20, 180, 80, 0)");

    context.save();
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

  drawVines(context) {
    if (this.state === "FINISH") return;

    const progress =
      this.state === "PREPARE"
        ? Math.min(this.timer / this.duration.PREPARE, 1)
        : 1;

    context.save();
    context.lineCap = "round";
    context.lineJoin = "round";

    for (const vine of this.vines) {
      const startAngle = vine.offset + vine.phase;
      const startX = this.targetCenter.x + Math.cos(startAngle) * 12;
      const startY = this.targetCenter.y + Math.sin(startAngle) * 12;

      const endX =
        this.pokemonCenter.x +
        (this.targetCenter.x - this.pokemonCenter.x) * 0.15;

      const endY =
        this.pokemonCenter.y +
        (this.targetCenter.y - this.pokemonCenter.y) * 0.15;

      const controlX =
        (startX + endX) / 2 + Math.cos(vine.phase) * vine.amplitude;

      const controlY =
        (startY + endY) / 2 + Math.sin(vine.phase) * vine.amplitude;

      const currentEndX = startX + (endX - startX) * progress;
      const currentEndY = startY + (endY - startY) * progress;

      context.strokeStyle = "rgba(35, 190, 80, 0.85)";
      context.lineWidth = 2.5;

      context.beginPath();
      context.moveTo(startX, startY);
      context.quadraticCurveTo(controlX, controlY, currentEndX, currentEndY);
      context.stroke();

      context.strokeStyle = "rgba(180, 255, 130, 0.8)";
      context.lineWidth = 1;

      context.beginPath();
      context.moveTo(startX, startY);
      context.quadraticCurveTo(controlX, controlY, currentEndX, currentEndY);
      context.stroke();
    }

    context.restore();
  }

  drawEnergyStream(context) {
    if (this.state !== "DRAIN" && this.state !== "IMPACT") return;

    const pulse = 1 + Math.sin(this.timer * 0.2) * 0.12;
    const dx = this.pokemonCenter.x - this.targetCenter.x;
    const dy = this.pokemonCenter.y - this.targetCenter.y;

    const angle = Math.atan2(dy, dx);
    const length = Math.hypot(dx, dy);

    const width = (this.state === "IMPACT" ? 12 : 8) * pulse;

    context.save();
    context.translate(this.targetCenter.x, this.targetCenter.y);
    context.rotate(angle);

    const gradient = context.createLinearGradient(0, 0, length, 0);
    gradient.addColorStop(0, "rgba(100, 255, 100, 0.08)");
    gradient.addColorStop(0.35, "rgba(40, 230, 100, 0.65)");
    gradient.addColorStop(0.75, "rgba(160, 255, 120, 0.8)");
    gradient.addColorStop(1, "rgba(210, 255, 160, 0.25)");

    context.fillStyle = gradient;
    context.beginPath();
    context.moveTo(0, -width);
    context.quadraticCurveTo(length * 0.45, -width * 1.5, length, -width * 0.4);
    context.lineTo(length, width * 0.4);
    context.quadraticCurveTo(length * 0.45, width * 1.5, 0, width);
    context.closePath();
    context.fill();

    context.strokeStyle = "rgba(205, 255, 160, 0.9)";
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(0, 0);
    context.quadraticCurveTo(
      length * 0.5,
      Math.sin(this.timer * 0.2) * 5,
      length,
      0
    );
    context.stroke();

    context.restore();
  }

  drawEnergyOrbs(context) {
    context.save();

    for (const orb of this.energyOrbs) {
      const x = this.targetCenter.x + Math.cos(orb.angle) * orb.radius;

      const y = this.targetCenter.y + Math.sin(orb.angle) * orb.radius;

      const alpha = Math.min(orb.life / 15, 1);

      context.globalAlpha = alpha;
      context.fillStyle = "#baff8a";
      context.shadowColor = "#48ff82";
      context.shadowBlur = 12;

      context.beginPath();
      context.arc(x, y, orb.size, 0, Math.PI * 2);
      context.fill();
    }

    context.restore();
  }

  drawParticles(context) {
    context.save();

    for (const particle of this.particles) {
      context.globalAlpha = Math.min(particle.life / 15, 1);
      context.fillStyle = particle.color;
      context.shadowColor = particle.color;
      context.shadowBlur = 8;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fill();
    }

    context.restore();
  }

  drawLeaves(context) {
    context.save();

    for (const leaf of this.leaves) {
      context.save();
      context.translate(leaf.x, leaf.y);
      context.rotate(leaf.rotation);

      context.globalAlpha = Math.min(leaf.life / 12, 1);
      context.fillStyle = "#8dff76";
      context.shadowColor = "#42ff75";
      context.shadowBlur = 8;

      context.beginPath();
      context.moveTo(0, -leaf.size);
      context.quadraticCurveTo(leaf.size * 1.2, -leaf.size * 0.4, 0, leaf.size);
      context.quadraticCurveTo(
        -leaf.size * 1.2,
        -leaf.size * 0.4,
        0,
        -leaf.size
      );
      context.fill();

      context.strokeStyle = "rgba(220, 255, 180, 0.9)";
      context.lineWidth = 0.8;
      context.beginPath();
      context.moveTo(0, -leaf.size * 0.7);
      context.lineTo(0, leaf.size * 0.7);
      context.stroke();

      context.restore();
    }

    context.restore();
  }

  drawAttackerAura(context) {
    if (this.state !== "FINISH") return;

    const progress = this.timer / this.duration.FINISH;
    const radius = 12 + progress * 38;

    const gradient = context.createRadialGradient(
      this.pokemonCenter.x,
      this.pokemonCenter.y,
      2,
      this.pokemonCenter.x,
      this.pokemonCenter.y,
      radius
    );

    gradient.addColorStop(0, "rgba(220, 255, 160, 0.65)");
    gradient.addColorStop(0.5, "rgba(80, 255, 120, 0.3)");
    gradient.addColorStop(1, "rgba(50, 200, 90, 0)");

    context.save();
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(
      this.pokemonCenter.x,
      this.pokemonCenter.y,
      radius,
      0,
      Math.PI * 2
    );
    context.fill();
    context.restore();
  }
}
