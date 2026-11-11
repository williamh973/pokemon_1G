export class RoarAnimation {
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

    const attackerCenterX =
      this.attacker.position.x + this.attacker.frameWidth / 2;

    const targetCenterX = this.target.position.x + this.target.frameWidth / 2;

    this.direction = targetCenterX >= attackerCenterX ? 1 : -1;

    this.phase = "EMIT";
    this.timer = 0;
    this.isFinished = false;
    this.hasShaken = false;

    this.waves = [];
    this.particles = [];
    this.targetFlash = 0;

    this.duration = {
      EMIT: 18,
      TRAVEL: 42,
      IMPACT: 20,
      FINISH: 22,
    };

    this.createWaves();
  }

  createWaves() {
    for (let i = 0; i < 4; i++) {
      this.waves.push({
        delay: i * 9,
        radius: 0,
        alpha: 0.85,
        width: 5 - i * 0.5,
        active: false,
      });
    }
  }

  createParticles() {
    for (let i = 0; i < 22; i++) {
      const angle = (Math.random() - 0.5) * 1.2;
      const speed = 2 + Math.random() * 5;

      this.particles.push({
        x:
          this.attacker.position.x +
          this.attacker.frameWidth / 2 +
          this.direction * 18,
        y:
          this.attacker.position.y +
          this.attacker.frameHeight / 2 +
          (Math.random() - 0.5) * 35,
        vx: this.direction * speed,
        vy: Math.sin(angle) * speed * 2,
        radius: 2 + Math.random() * 3,
        alpha: 1,
        life: 25 + Math.random() * 15,
      });
    }
  }

  update(context) {
    this.timer++;

    switch (this.phase) {
      case "EMIT":
        this.updateEmit();
        break;

      case "TRAVEL":
        this.updateTravel();
        break;

      case "IMPACT":
        this.updateImpact();
        break;

      case "FINISH":
        this.updateFinish();
        break;
    }

    this.updateParticles();
    this.draw(context);
  }

  updateEmit() {
    if (this.timer === 1) {
      this.createParticles();
    }

    if (this.timer >= this.duration.EMIT) {
      this.phase = "TRAVEL";
      this.timer = 0;
    }
  }

  updateTravel() {
    this.waves.forEach((wave) => {
      if (this.timer >= wave.delay) {
        wave.active = true;
        wave.radius += 9;
        wave.alpha -= 0.012;
      }
    });

    if (this.timer >= this.duration.TRAVEL) {
      this.phase = "IMPACT";
      this.timer = 0;
      this.targetFlash = 1;
    }
  }

  updateImpact() {
    this.targetFlash *= 0.82;

    if (!this.hasShaken) {
      this.game.canvas.startShake(12, 3);
      this.hasShaken = true;
    }

    if (this.timer >= this.duration.IMPACT) {
      this.phase = "FINISH";
      this.timer = 0;
    }
  }

  updateFinish() {
    this.targetFlash *= 0.8;

    if (this.timer >= this.duration.FINISH) {
      this.isFinished = true;
    }
  }

  updateParticles() {
    this.particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.alpha -= 1 / particle.life;
      particle.vx *= 0.96;
      particle.vy *= 0.96;
    });

    this.particles = this.particles.filter((particle) => particle.alpha > 0);
  }

  draw(context) {
    this.drawSoundWaves(context);
    this.drawSoundParticles(context);
    this.drawTargetImpact(context);
    this.drawSourceAura(context);
  }

  drawSoundWaves(context) {
    this.waves.forEach((wave) => {
      if (!wave.active || wave.alpha <= 0) return;

      const startAngle = this.direction === 1 ? -Math.PI / 2 : Math.PI / 2;

      const endAngle = this.direction === 1 ? Math.PI / 2 : (3 * Math.PI) / 2;
      context.save();

      context.globalAlpha = Math.max(0, wave.alpha);
      context.strokeStyle = "#d9f5ff";
      context.lineWidth = wave.width;
      context.shadowColor = "#71d9ff";
      context.shadowBlur = 12;

      context.beginPath();
      context.ellipse(
        this.attacker.position.x +
          this.attacker.frameWidth / 2 +
          this.direction * wave.radius * 0.45,
        this.attacker.position.y + this.attacker.frameHeight / 2,
        wave.radius,
        wave.radius * 0.42,
        0,
        startAngle,
        endAngle
      );
      context.stroke();

      context.globalAlpha *= 0.5;
      context.strokeStyle = "#ffffff";
      context.lineWidth = 2;

      context.beginPath();
      context.ellipse(
        this.attacker.position.x +
          this.attacker.frameWidth / 2 +
          this.direction * wave.radius * 0.45,
        this.attacker.position.y + this.attacker.frameHeight / 2,
        wave.radius * 0.82,
        wave.radius * 0.34,
        0,
        startAngle,
        endAngle
      );
      context.stroke();
      context.restore();
    });
  }

  drawSoundParticles(context) {
    this.particles.forEach((particle) => {
      context.save();

      context.globalAlpha = Math.max(0, particle.alpha);
      context.fillStyle = "#c8f2ff";
      context.shadowColor = "#5bd6ff";
      context.shadowBlur = 10;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fill();

      context.restore();
    });
  }

  drawTargetImpact(context) {
    if (this.targetFlash <= 0.02) return;

    context.save();

    context.globalAlpha = this.targetFlash * 0.65;
    context.strokeStyle = "#ffffff";
    context.lineWidth = 4;
    context.shadowColor = "#80e5ff";
    context.shadowBlur = 18;

    const radius = 25 + (1 - this.targetFlash) * 35;

    context.beginPath();
    context.ellipse(
      this.target.x,
      this.target.y,
      radius,
      radius * 0.65,
      0,
      0,
      Math.PI * 2
    );
    context.stroke();

    context.restore();
  }

  drawSourceAura(context) {
    if (this.phase !== "EMIT") return;

    const progress = Math.min(this.timer / this.duration.EMIT, 1);
    const radius = 12 + progress * 25;

    context.save();

    context.globalAlpha = 1 - progress * 0.5;
    context.strokeStyle = "#d8f7ff";
    context.lineWidth = 3;
    context.shadowColor = "#5bd6ff";
    context.shadowBlur = 16;

    context.beginPath();
    context.arc(
      this.attacker.position.x +
        this.attacker.frameWidth / 2 +
        this.direction * 18,
      this.attacker.position.y + this.attacker.frameHeight / 2,
      radius,
      0,
      Math.PI * 2
    );
    context.stroke();

    context.restore();
  }
}
