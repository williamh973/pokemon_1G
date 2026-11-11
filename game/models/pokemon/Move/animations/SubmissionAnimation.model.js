export class SubmissionAnimation {
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

    this.phase = "PREPARE";
    this.timer = 0;
    this.isFinished = false;

    this.duration = {
      PREPARE: 24,
      CHARGE: 24,
      IMPACT: 16,
      RECOVERY: 24,
    };

    this.particles = [];
    this.shockwaves = [];
    this.impactCreated = false;

    this.direction = this.target.position.x > this.attacker.position.x ? 1 : -1;

    this.attackerCenter = {
      x: this.attacker.position.x + this.attacker.frameWidth / 2,
      y: this.attacker.position.y + this.attacker.frameHeight / 2,
    };

    this.targetCenter = {
      x: this.target.position.x + this.target.frameWidth / 2,
      y: this.target.position.y + this.target.frameHeight / 2,
    };

    this.impactPosition = {
      x: this.targetCenter.x - this.direction * 18,
      y: this.targetCenter.y,
    };

    this.createParticles();
  }

  update(context) {
    if (this.isFinished) return;

    this.timer++;

    switch (this.phase) {
      case "PREPARE":
        if (this.timer >= this.duration.PREPARE) {
          this.nextPhase("CHARGE");
        }
        break;

      case "CHARGE":
        if (this.timer >= this.duration.CHARGE) {
          this.nextPhase("IMPACT");
        }
        break;

      case "IMPACT":
        if (this.timer === 1) {
          this.createImpact();
        }

        this.updateParticles();
        this.updateShockwaves();

        if (this.timer >= this.duration.IMPACT) {
          this.nextPhase("RECOVERY");
        }
        break;

      case "RECOVERY":
        this.updateParticles();
        this.updateShockwaves();

        if (this.timer >= this.duration.RECOVERY) {
          this.isFinished = true;
        }
        break;
    }

    this.draw(context);
  }

  nextPhase(phase) {
    this.phase = phase;
    this.timer = 0;
  }

  createParticles() {
    for (let i = 0; i < 24; i++) {
      this.particles.push({
        x: this.attackerCenter.x,
        y: this.attackerCenter.y,
        vx: -this.direction * (1 + Math.random() * 2),
        vy: (Math.random() - 0.5) * 3,
        radius: 1 + Math.random() * 2,
        life: 20 + Math.random() * 15,
        maxLife: 35,
      });
    }
  }

  createImpact() {
    this.impactCreated = true;

    this.game.canvas.startShake(18, 5);

    for (let i = 0; i < 65; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 7;

      this.particles.push({
        x: this.impactPosition.x,
        y: this.impactPosition.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 1 + Math.random() * 3,
        life: 18 + Math.random() * 20,
        maxLife: 38,
      });
    }

    this.shockwaves.push({
      radius: 5,
      maxRadius: 95,
      life: 16,
      maxLife: 16,
    });

    this.shockwaves.push({
      radius: 3,
      maxRadius: 65,
      life: 12,
      maxLife: 12,
    });
  }

  updateParticles() {
    this.particles.forEach((particle) => {
      if (particle.life <= 0) return;

      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vx *= 0.96;
      particle.vy *= 0.96;
      particle.life--;
    });
  }

  updateShockwaves() {
    this.shockwaves.forEach((wave) => {
      if (wave.life <= 0) return;

      const progress = 1 - wave.life / wave.maxLife;
      wave.radius = progress * wave.maxRadius;
      wave.life--;
    });
  }

  draw(context) {
    context.save();

    if (this.phase === "PREPARE") {
      this.drawPreparation(context);
    }

    if (this.phase === "CHARGE") {
      this.drawCharge(context);
    }

    if (this.phase === "IMPACT") {
      this.drawImpact(context);
    }

    if (this.phase === "RECOVERY") {
      this.drawRecovery(context);
    }

    this.drawShockwaves(context);
    this.drawParticles(context);

    context.restore();
  }

  drawPreparation(context) {
    const progress = this.timer / this.duration.PREPARE;
    const x = this.attackerCenter.x;
    const y = this.attackerCenter.y;

    // Aura de concentration
    context.globalAlpha = 0.15 + progress * 0.35;
    context.fillStyle = "#f6b84a";
    context.beginPath();
    context.ellipse(
      x,
      y,
      18 + progress * 9,
      25 + progress * 8,
      0,
      0,
      Math.PI * 2
    );
    context.fill();

    // Énergie concentrée
    context.globalAlpha = 0.8;
    context.strokeStyle = "#ffe6a3";
    context.lineWidth = 2;
    context.beginPath();
    context.arc(x, y, 8 + progress * 7, 0, Math.PI * 2);
    context.stroke();

    // Petites étincelles
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2 + this.timer * 0.12;
      const radius = 15 + progress * 8;

      context.fillStyle = "#fff2c2";
      context.beginPath();
      context.arc(
        x + Math.cos(angle) * radius,
        y + Math.sin(angle) * radius,
        2,
        0,
        Math.PI * 2
      );
      context.fill();
    }
  }

  drawCharge(context) {
    const progress = this.timer / this.duration.CHARGE;
    const x = this.attackerCenter.x;
    const y = this.attackerCenter.y;

    // Traînées de vitesse
    context.globalAlpha = 0.2 + progress * 0.6;
    context.lineWidth = 3;

    for (let i = 0; i < 7; i++) {
      const offset = (i - 3) * 7;

      context.strokeStyle = i % 2 === 0 ? "#f6b84a" : "#fff0c0";
      context.beginPath();
      context.moveTo(x - this.direction * (15 + progress * 25), y + offset);
      context.lineTo(x - this.direction * (35 + progress * 45), y + offset);
      context.stroke();
    }

    // Flash de puissance
    context.globalAlpha = 0.2 + Math.abs(Math.sin(this.timer * 0.6)) * 0.35;
    context.fillStyle = "#ffd36a";
    context.beginPath();
    context.ellipse(x, y, 22, 27, 0, 0, Math.PI * 2);
    context.fill();

    // Éclairs autour du corps
    context.globalAlpha = 0.9;
    context.strokeStyle = "#fff4cc";
    context.lineWidth = 2;

    for (let i = 0; i < 3; i++) {
      const offset = (this.timer * 5 + i * 13) % 35;

      context.beginPath();
      context.moveTo(x - this.direction * offset, y - 15 - i * 3);
      context.lineTo(x - this.direction * (offset + 5), y - 8);
      context.lineTo(x - this.direction * (offset + 2), y + 2);
      context.stroke();
    }
  }

  drawImpact(context) {
    const progress = this.timer / this.duration.IMPACT;
    const x = this.impactPosition.x;
    const y = this.impactPosition.y;

    // Flash initial
    if (this.timer <= 4) {
      context.globalAlpha = 0.8 - this.timer * 0.17;
      context.fillStyle = "#fff8dd";
      context.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);
    }

    // Explosion centrale
    const radius = 12 + progress * 35;

    context.globalAlpha = 0.65 * (1 - progress);
    context.fillStyle = "#f5a623";
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();

    // Noyau blanc
    context.globalAlpha = 0.85 * (1 - progress);
    context.fillStyle = "#fff5d6";
    context.beginPath();
    context.arc(x, y, radius * 0.45, 0, Math.PI * 2);
    context.fill();

    // Rayons d'impact
    context.globalAlpha = 1 - progress;
    context.strokeStyle = "#ffdf91";
    context.lineWidth = 3;

    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const inner = radius * 0.6;
      const outer = radius * (1.1 + (i % 3) * 0.25);

      context.beginPath();
      context.moveTo(x + Math.cos(angle) * inner, y + Math.sin(angle) * inner);
      context.lineTo(x + Math.cos(angle) * outer, y + Math.sin(angle) * outer);
      context.stroke();
    }
  }

  drawRecovery(context) {
    const progress = this.timer / this.duration.RECOVERY;

    // Quelques étincelles résiduelles
    context.globalAlpha = 1 - progress;
    context.strokeStyle = "#f6b84a";
    context.lineWidth = 2;

    this.particles.forEach((particle) => {
      if (particle.life <= 0) return;

      context.beginPath();
      context.arc(
        particle.x,
        particle.y,
        particle.radius * 0.7,
        0,
        Math.PI * 2
      );
      context.stroke();
    });
  }

  drawShockwaves(context) {
    this.shockwaves.forEach((wave) => {
      if (wave.life <= 0) return;

      const alpha = wave.life / wave.maxLife;

      context.globalAlpha = alpha;
      context.strokeStyle = "#ffe3a0";
      context.lineWidth = 3 * alpha;

      context.beginPath();
      context.ellipse(
        this.impactPosition.x,
        this.impactPosition.y,
        wave.radius,
        wave.radius * 0.55,
        0,
        0,
        Math.PI * 2
      );
      context.stroke();
    });
  }

  drawParticles(context) {
    this.particles.forEach((particle) => {
      if (particle.life <= 0) return;

      const alpha = Math.min(1, particle.life / 12);

      context.globalAlpha = alpha;
      context.fillStyle = particle.radius > 2 ? "#f6b84a" : "#fff0c0";

      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fill();
    });
  }
}
