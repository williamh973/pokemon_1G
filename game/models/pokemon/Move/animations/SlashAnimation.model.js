export class SlashAnimation {
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

    this.phase = "PREPARE";
    this.timer = 0;
    this.isFinished = false;

    this.duration = {
      PREPARE: 12,
      SLASH_1: 9,
      SLASH_2: 9,
      SLASH_3: 13,
      FINISH: 22,
    };

    this.attackerCenter = this.getCenter(this.pokemonViewer);
    this.targetCenter = this.getCenter(this.targetViewer);

    this.direction = this.targetCenter.x >= this.attackerCenter.x ? 1 : -1;

    this.slashes = [];
    this.particles = [];
    this.impactTriggered = false;
  }

  getCenter(viewer) {
    const sprite = viewer.sprite;

    return {
      x: sprite.position.x + (sprite.frameWidth * sprite.scale) / 2,
      y: sprite.position.y + (sprite.frameHeight * sprite.scale) / 2,
    };
  }

  update(context) {
    if (this.isFinished) return;

    this.timer++;

    switch (this.phase) {
      case "PREPARE":
        this.prepare();
        break;

      case "SLASH_1":
        this.executeSlash(0);
        break;

      case "SLASH_2":
        this.executeSlash(1);
        break;

      case "SLASH_3":
        this.executeSlash(2);
        break;

      case "FINISH":
        this.finish();
        break;
    }

    this.updateEffects();
    this.draw(context);
  }

  changePhase(phase) {
    this.phase = phase;
    this.timer = 0;
  }

  prepare() {
    if (this.timer >= this.duration.PREPARE) {
      this.changePhase("SLASH_1");
    }
  }

  executeSlash(index) {
    if (this.timer === 1) {
      this.createSlash(index);

      if (index === 2) {
        this.game.canvas.startShake(12, 5);
        this.createFinalImpact();
      }
    }

    const phases = ["SLASH_1", "SLASH_2", "SLASH_3"];
    const nextPhase = phases[index + 1];

    if (this.timer >= this.duration[this.phase]) {
      this.changePhase(nextPhase || "FINISH");
    }
  }

  createSlash(index) {
    const angles = [-Math.PI / 4, Math.PI / 4, -Math.PI / 4];

    const angle = angles[index];

    this.slashes.push({
      x: this.targetCenter.x,
      y: this.targetCenter.y,
      angle,
      length: index === 2 ? 100 : 85,
      alpha: 1,
      width: index === 2 ? 9 : 6,
      timer: 0,
    });

    if (index === 2) {
      this.createSlashParticles();
    }
  }

  createFinalImpact() {
    for (let i = 0; i < 18; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 5;

      this.particles.push({
        x: this.targetCenter.x,
        y: this.targetCenter.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 3,
        alpha: 1,
        color: Math.random() > 0.5 ? "#ffffff" : "#bceaff",
      });
    }
  }

  createSlashParticles() {
    for (let i = 0; i < 12; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 4;

      this.particles.push({
        x: this.targetCenter.x + (Math.random() - 0.5) * 45,
        y: this.targetCenter.y + (Math.random() - 0.5) * 45,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 3,
        alpha: 1,
        color: "#d9f4ff",
      });
    }
  }

  updateEffects() {
    this.slashes.forEach((slash) => {
      slash.timer++;
      slash.alpha -= 0.075;
    });

    this.slashes = this.slashes.filter((slash) => slash.alpha > 0);

    this.particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      particle.vx *= 0.96;
      particle.vy *= 0.96;
      particle.alpha -= 0.045;
    });

    this.particles = this.particles.filter((particle) => particle.alpha > 0);
  }

  finish() {
    if (
      this.timer >= this.duration.FINISH &&
      this.slashes.length === 0 &&
      this.particles.length === 0
    ) {
      this.isFinished = true;
    }
  }

  draw(context) {
    context.save();

    if (this.phase === "PREPARE") {
      this.drawPreparation(context);
    }

    this.drawSlashes(context);
    this.drawParticles(context);

    if (this.phase === "SLASH_3" && this.timer < 5) {
      this.drawFlash(context);
    }

    context.restore();
  }

  drawPreparation(context) {
    const pulse = 1 + Math.sin(this.timer * 0.5) * 0.15;

    context.save();
    context.translate(
      this.attackerCenter.x + this.direction * 25,
      this.attackerCenter.y
    );
    context.scale(pulse, pulse);

    for (let i = -1; i <= 1; i++) {
      context.beginPath();
      context.moveTo(-5, i * 16 - 12);
      context.lineTo(5, i * 16 + 12);

      context.strokeStyle = "rgba(200, 240, 255, 0.85)";
      context.lineWidth = 3;
      context.stroke();
    }

    context.restore();
  }

  drawSlashes(context) {
    this.slashes.forEach((slash) => {
      const dx = (Math.cos(slash.angle) * slash.length) / 2;
      const dy = (Math.sin(slash.angle) * slash.length) / 2;

      context.save();
      context.globalAlpha = slash.alpha;

      context.lineCap = "round";

      // Lueur extérieure
      context.beginPath();
      context.moveTo(slash.x - dx, slash.y - dy);
      context.lineTo(slash.x + dx, slash.y + dy);

      context.strokeStyle = "#65cfff";
      context.lineWidth = slash.width + 9;
      context.shadowColor = "#74dfff";
      context.shadowBlur = 18;
      context.stroke();

      // Trait lumineux principal
      context.beginPath();
      context.moveTo(slash.x - dx, slash.y - dy);
      context.lineTo(slash.x + dx, slash.y + dy);

      context.strokeStyle = "#ffffff";
      context.lineWidth = slash.width;
      context.shadowColor = "#ffffff";
      context.shadowBlur = 10;
      context.stroke();

      // Reflet central
      context.beginPath();
      context.moveTo(slash.x - dx * 0.65, slash.y - dy * 0.65);
      context.lineTo(slash.x + dx * 0.65, slash.y + dy * 0.65);

      context.strokeStyle = "#d9f5ff";
      context.lineWidth = 2;
      context.shadowBlur = 0;
      context.stroke();

      context.restore();
    });
  }

  drawFlash(context) {
    const alpha = Math.max(0, 1 - this.timer / 5);

    context.beginPath();
    context.arc(this.targetCenter.x, this.targetCenter.y, 35, 0, Math.PI * 2);

    context.fillStyle = `rgba(255, 255, 255, ${alpha * 0.7})`;
    context.fill();
  }

  drawParticles(context) {
    this.particles.forEach((particle) => {
      context.globalAlpha = particle.alpha;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);

      context.fillStyle = particle.color;
      context.shadowColor = particle.color;
      context.shadowBlur = 8;
      context.fill();
    });

    context.globalAlpha = 1;
    context.shadowBlur = 0;
  }
}
