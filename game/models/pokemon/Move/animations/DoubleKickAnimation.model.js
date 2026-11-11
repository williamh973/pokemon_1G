export class DoubleKickAnimation {
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
      x: this.targetCenter.x - this.direction * 15,
      y: this.targetCenter.y,
    };

    this.phase = "PREPARE";
    this.timer = 0;
    this.isFinished = false;

    this.phases = {
      PREPARE: 15,
      FIRST_KICK: 12,
      RESET: 9,
      SECOND_KICK: 14,
      FINISH: 18,
    };

    this.impactEffects = [];
    this.particles = [];
    this.legTrails = [];
  }

  update(context) {
    if (this.isFinished) return;

    this.timer++;

    switch (this.phase) {
      case "PREPARE":
        if (this.timer >= this.phases.PREPARE) {
          this.nextPhase("FIRST_KICK");
        }
        break;

      case "FIRST_KICK":
        if (this.timer === 5) this.createImpact(1);

        if (this.timer >= this.phases.FIRST_KICK) {
          this.nextPhase("RESET");
        }
        break;

      case "RESET":
        if (this.timer >= this.phases.RESET) {
          this.nextPhase("SECOND_KICK");
        }
        break;

      case "SECOND_KICK":
        if (this.timer === 6) this.createImpact(2);

        if (this.timer >= this.phases.SECOND_KICK) {
          this.nextPhase("FINISH");
        }
        break;

      case "FINISH":
        if (this.timer >= this.phases.FINISH) {
          this.isFinished = true;
        }
        break;
    }

    this.updateEffects();
    this.draw(context);
  }

  nextPhase(phase) {
    this.phase = phase;
    this.timer = 0;
  }

  createImpact(number) {
    const strength = number === 1 ? 1 : 1.35;

    this.game.canvas.startShake(number === 1 ? 8 : 13, number === 1 ? 2 : 4);

    this.impactEffects.push({
      x: this.impactPosition.x,
      y: this.impactPosition.y,
      radius: 4,
      maxRadius: 30 * strength,
      life: 12,
      maxLife: 12,
      strength,
    });

    for (let i = 0; i < 20 * strength; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 4 * strength;

      this.particles.push({
        x: this.impactPosition.x,
        y: this.impactPosition.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 1 + Math.random() * 2.5,
        life: 12 + Math.random() * 12,
        maxLife: 24,
      });
    }
  }

  updateEffects() {
    this.impactEffects.forEach((effect) => {
      if (effect.life <= 0) return;

      effect.life--;

      const progress = 1 - effect.life / effect.maxLife;
      effect.radius = progress * effect.maxRadius;
    });

    this.particles.forEach((particle) => {
      if (particle.life <= 0) return;

      particle.x += particle.vx;
      particle.y += particle.vy;

      particle.vx *= 0.94;
      particle.vy *= 0.94;

      particle.life--;
    });
  }

  getKickProgress() {
    if (this.phase === "FIRST_KICK") {
      return this.timer / this.phases.FIRST_KICK;
    }

    if (this.phase === "SECOND_KICK") {
      return this.timer / this.phases.SECOND_KICK;
    }

    return 0;
  }

  draw(context) {
    context.save();

    this.drawPreparation(context);
    this.drawKick(context);
    this.drawReset(context);
    this.drawImpacts(context);
    this.drawParticles(context);

    context.restore();
  }

  drawPreparation(context) {
    if (this.phase !== "PREPARE") return;

    const progress = this.timer / this.phases.PREPARE;
    const x = this.attackerCenter.x;
    const y = this.attackerCenter.y;

    // Cercle de puissance sous le Pokémon
    context.globalAlpha = progress * 0.65;
    context.strokeStyle = "#f5d36b";
    context.lineWidth = 2;

    context.beginPath();
    context.ellipse(
      x,
      y + 18,
      12 + progress * 8,
      4 + progress * 3,
      0,
      0,
      Math.PI * 2
    );
    context.stroke();

    // Énergie concentrée autour de la jambe
    context.globalAlpha = progress * 0.8;
    context.fillStyle = "#fff0ae";

    context.beginPath();
    context.arc(
      x + this.direction * 9,
      y + 13,
      3 + progress * 3,
      0,
      Math.PI * 2
    );
    context.fill();
  }

  drawKick(context) {
    if (this.phase !== "FIRST_KICK" && this.phase !== "SECOND_KICK") {
      return;
    }

    const progress = this.getKickProgress();
    const isSecond = this.phase === "SECOND_KICK";

    const strength = isSecond ? 1.35 : 1;
    const x = this.attackerCenter.x;
    const y = this.attackerCenter.y;

    // Mouvement du pied vers la cible
    const reach = Math.sin(progress * Math.PI) * 35 * strength;

    const footX = x + this.direction * (10 + reach);
    const footY = y + 12 - Math.sin(progress * Math.PI) * 10;

    // Traînée du coup de pied
    context.globalAlpha = 0.75 * Math.sin(progress * Math.PI);
    context.strokeStyle = isSecond ? "#fff1a8" : "#f5c45b";
    context.lineWidth = isSecond ? 5 : 3;

    context.beginPath();
    context.moveTo(footX - this.direction * 22, footY - 5);
    context.lineTo(footX - this.direction * 5, footY);
    context.stroke();

    // Arc de mouvement
    context.globalAlpha = 0.8 * Math.sin(progress * Math.PI);

    context.lineWidth = 3;
    context.strokeStyle = "#fff6d1";

    context.beginPath();

    if (this.direction === 1) {
      context.arc(x + 12, y + 8, 24 * strength, -Math.PI * 0.75, Math.PI * 0.2);
    } else {
      context.arc(x - 12, y + 8, 24 * strength, Math.PI * 0.8, Math.PI * 1.8);
    }

    context.stroke();

    // Éclat sur le pied
    context.globalAlpha = 0.9 * Math.sin(progress * Math.PI);
    context.fillStyle = "#fff4c2";

    context.beginPath();
    context.arc(footX, footY, 3 * strength, 0, Math.PI * 2);
    context.fill();
  }

  drawReset(context) {
    if (this.phase !== "RESET") return;

    const progress = this.timer / this.phases.RESET;

    // Le Pokémon reprend son appui entre les deux coups
    context.globalAlpha = 0.5 * (1 - progress);
    context.strokeStyle = "#f5d36b";
    context.lineWidth = 2;

    for (let i = 0; i < 3; i++) {
      context.beginPath();
      context.moveTo(
        this.attackerCenter.x - this.direction * (10 + i * 8),
        this.attackerCenter.y + 18 + i * 3
      );
      context.lineTo(
        this.attackerCenter.x - this.direction * (25 + i * 8),
        this.attackerCenter.y + 18 + i * 3
      );
      context.stroke();
    }
  }

  drawImpacts(context) {
    this.impactEffects.forEach((effect) => {
      if (effect.life <= 0) return;

      const alpha = effect.life / effect.maxLife;
      const progress = 1 - alpha;

      const isSecond = effect.strength > 1;
      const color = isSecond ? "#6e2602" : "#6e2602";

      // Empreinte qui apparaît puis disparaît
      const footprintScale = isSecond ? 2.5 : 2;

      // this.direction === 1 ? Math.PI / 2 : -Math.PI / 2,

      this.drawFootprint(
        context,
        effect.x,
        effect.y,
        footprintScale * (0.8 + progress * 0.2),
        null,
        color,
        alpha
      );

      // Halo lumineux autour de l'empreinte
      context.globalAlpha = alpha * 0.45;
      context.fillStyle = color;

      context.beginPath();
      context.arc(effect.x, effect.y, 12 + progress * 15, 0, Math.PI * 2);
      context.fill();

      // Onde de choc
      context.globalAlpha = alpha;
      context.strokeStyle = "#fff0b0";
      context.lineWidth = 3 * alpha;

      context.beginPath();
      context.ellipse(
        effect.x,
        effect.y,
        effect.radius,
        effect.radius * 0.55,
        0,
        0,
        Math.PI * 2
      );
      context.stroke();

      // Rayons d'impact
      context.strokeStyle = color;
      context.lineWidth = 2;

      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const inner = effect.radius * 0.5;
        const outer = effect.radius * 0.9;

        context.beginPath();
        context.moveTo(
          effect.x + Math.cos(angle) * inner,
          effect.y + Math.sin(angle) * inner
        );
        context.lineTo(
          effect.x + Math.cos(angle) * outer,
          effect.y + Math.sin(angle) * outer
        );
        context.stroke();
      }
    });
  }

  drawParticles(context) {
    this.particles.forEach((particle) => {
      if (particle.life <= 0) return;

      context.globalAlpha = Math.min(1, particle.life / 8);
      context.fillStyle = "#ffe5a0";

      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fill();
    });
  }

  drawFootprint(context, x, y, scale, rotation, color, alpha) {
    context.save();

    context.translate(x, y);
    context.rotate(rotation);
    context.scale(scale, scale);

    context.globalAlpha = alpha;
    context.fillStyle = color;
    context.shadowColor = "black";
    context.shadowBlur = 5;

    // Quatre doigts arrondis
    const toes = [
      { x: -11, y: -9, rx: 4, ry: 5 },
      { x: -4, y: -15, rx: 4.2, ry: 5.5 },
      { x: 4, y: -15, rx: 4.2, ry: 5.5 },
      { x: 11, y: -9, rx: 4, ry: 5 },
    ];

    toes.forEach((toe) => {
      context.beginPath();
      context.ellipse(toe.x, toe.y, toe.rx, toe.ry, 0, 0, Math.PI * 2);
      context.fill();
    });

    // Grand coussinet central
    context.beginPath();
    context.moveTo(-11, 4);
    context.bezierCurveTo(-13, -3, -9, -8, -4, -7);
    context.bezierCurveTo(-1, -10, 1, -10, 4, -7);
    context.bezierCurveTo(10, -8, 13, -3, 11, 4);
    context.bezierCurveTo(10, 11, 5, 14, 0, 14);
    context.bezierCurveTo(-6, 14, -10, 11, -11, 4);
    context.fill();

    // Petit reflet sur les coussinets
    context.shadowBlur = 0;
    context.globalAlpha = alpha * 0.45;
    context.fillStyle = "#969595";

    context.beginPath();
    context.ellipse(-4, 1, 3, 2, -0.3, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }
}
