export class CutAnimation {
  static PHASES = {
    PREPARE: 8,
    FIRST_SLASH: 8,
    SECOND_SLASH: 8,
    IMPACT: 14,
    FINISH: 12,
  };

  constructor(game, viewers, turnAction) {
    this.game = game;
    this.viewers = viewers;
    this.turnAction = turnAction;

    if (viewers.front.slot.content === turnAction.pokemon) {
      this.pokemonViewer = viewers.front;
      this.targetViewer = viewers.back;
    } else {
      this.pokemonViewer = viewers.back;
      this.targetViewer = viewers.front;
    }

    this.attacker = this.pokemonViewer.sprite;
    this.target = this.targetViewer.sprite;

    this.phase = "PREPARE";
    this.timer = 0;
    this.isFinished = false;

    this.slashes = [];
    this.particles = [];
    this.flashAlpha = 0;

    this.attackerCenter = this.getCenter(this.pokemonViewer);
    this.targetCenter = this.getCenter(this.targetViewer);

    this.angle = Math.atan2(
      this.targetCenter.y - this.attackerCenter.y,
      this.targetCenter.x - this.attackerCenter.x
    );

    this.createPreparationParticles();
  }

  update(context) {
    if (this.isFinished) return;

    this.timer++;

    switch (this.phase) {
      case "PREPARE":
        if (this.timer >= CutAnimation.PHASES.PREPARE) {
          this.nextPhase("FIRST_SLASH");
          this.createSlash(1);
        }
        break;

      case "FIRST_SLASH":
        this.updateSlash(this.slashes[0]);

        if (this.timer >= CutAnimation.PHASES.FIRST_SLASH) {
          this.nextPhase("SECOND_SLASH");
          this.createSlash(-1);
        }
        break;

      case "SECOND_SLASH":
        this.updateSlash(this.slashes[1]);

        if (this.timer >= CutAnimation.PHASES.SECOND_SLASH) {
          this.createImpact();
          this.nextPhase("IMPACT");
        }
        break;

      case "IMPACT":
        this.updateImpactParticles();

        if (this.timer >= CutAnimation.PHASES.IMPACT) {
          this.nextPhase("FINISH");
        }
        break;

      case "FINISH":
        this.updateImpactParticles();

        if (this.timer >= CutAnimation.PHASES.FINISH) {
          this.isFinished = true;
        }
        break;
    }

    this.updateParticles();
    this.draw(context);
  }

  nextPhase(phase) {
    this.phase = phase;
    this.timer = 0;
  }

  getCenter(viewer) {
    const sprite = viewer.sprite;

    return {
      x: sprite.position.x + sprite.frameWidth / 2,
      y: sprite.position.y + sprite.frameHeight / 2,
    };
  }

  createPreparationParticles() {
    for (let i = 0; i < 6; i++) {
      const angle = Math.random() * Math.PI * 2;

      this.particles.push({
        x: this.attackerCenter.x,
        y: this.attackerCenter.y,
        vx: Math.cos(angle) * (0.5 + Math.random()),
        vy: Math.sin(angle) * (0.5 + Math.random()),
        life: 10 + Math.random() * 8,
        maxLife: 18,
        size: 1 + Math.random() * 2,
      });
    }
  }

  createSlash(direction) {
    const center = this.targetCenter;

    // Les deux coups se croisent en X.
    const baseAngle =
      this.angle + (direction === 1 ? -Math.PI / 4 : Math.PI / 4);

    this.slashes.push({
      x: center.x,
      y: center.y,
      angle: baseAngle,
      direction,
      progress: 0,
      length: 82,
      width: 10,
      finished: false,
    });
  }

  updateSlash(slash) {
    if (!slash || slash.finished) return;

    slash.progress = Math.min(slash.progress + 0.2, 1);

    if (slash.progress >= 1) {
      slash.finished = true;
    }
  }

  createImpact() {
    this.flashAlpha = 0.9;

    for (let i = 0; i < 18; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 3;

      this.particles.push({
        x: this.targetCenter.x,
        y: this.targetCenter.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 12 + Math.random() * 10,
        maxLife: 22,
        size: 1 + Math.random() * 2.5,
      });
    }

    if (this.game.canvas?.startShake) {
      this.game.canvas.startShake(2, 100);
    }
  }

  updateParticles() {
    this.particles = this.particles.filter((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      particle.vx *= 0.94;
      particle.vy *= 0.94;

      particle.life--;

      return particle.life > 0;
    });
  }

  updateImpactParticles() {
    this.updateParticles();
    this.flashAlpha *= 0.82;
  }

  draw(context) {
    this.drawParticles(context);

    if (this.phase === "PREPARE") {
      this.drawPreparation(context);
    }

    if (this.phase === "FIRST_SLASH" || this.phase === "SECOND_SLASH") {
      this.drawSlashes(context);
    }

    if (this.phase === "IMPACT" || this.phase === "FINISH") {
      this.drawImpact(context);
    }
  }

  drawPreparation(context) {
    const pulse = 1 + Math.sin(this.timer * 0.7) * 0.2;

    context.save();

    context.translate(
      this.attackerCenter.x + Math.cos(this.angle) * 12,
      this.attackerCenter.y + Math.sin(this.angle) * 12
    );

    context.rotate(this.angle);

    context.globalAlpha = 0.5 + Math.sin(this.timer * 0.6) * 0.2;
    context.strokeStyle = "#ffffff";
    context.lineWidth = 2;
    context.shadowColor = "#c9f4ff";
    context.shadowBlur = 10;

    context.beginPath();
    context.moveTo(-5, -5 * pulse);
    context.lineTo(5, 5 * pulse);
    context.stroke();

    context.restore();
  }

  drawSlashes(context) {
    for (const slash of this.slashes) {
      if (slash.finished) continue;

      const progress = slash.progress;
      const length = slash.length * progress;

      context.save();

      context.translate(slash.x, slash.y);
      context.rotate(slash.angle);

      context.globalAlpha = 1 - progress * 0.2;

      // Halo lumineux.
      context.strokeStyle = "rgba(180, 235, 255, 0.45)";
      context.lineWidth = slash.width * 2.5;
      context.shadowColor = "#b9edff";
      context.shadowBlur = 12;

      context.beginPath();
      context.moveTo(-length / 2, 0);
      context.lineTo(length / 2, 0);
      context.stroke();

      // Tranchant principal.
      context.strokeStyle = "#ffffff";
      context.lineWidth = slash.width;
      context.shadowColor = "#ffffff";
      context.shadowBlur = 7;

      context.beginPath();
      context.moveTo(-length / 2, 0);
      context.lineTo(length / 2, 0);
      context.stroke();

      // Reflet central.
      context.strokeStyle = "#d7f6ff";
      context.lineWidth = 1;

      context.beginPath();
      context.moveTo(-length / 2, 0);
      context.lineTo(length / 2, 0);
      context.stroke();

      context.restore();
    }
  }

  drawImpact(context) {
    context.save();

    // Flash blanc très bref.
    if (this.flashAlpha > 0.03) {
      context.globalAlpha = this.flashAlpha;
      context.fillStyle = "#ffffff";

      context.beginPath();
      context.arc(
        this.targetCenter.x,
        this.targetCenter.y,
        10 + this.timer * 0.5,
        0,
        Math.PI * 2
      );
      context.fill();
    }

    // Marques de coup croisées.
    if (this.timer < 7) {
      const alpha = 1 - this.timer / 7;

      context.globalAlpha = alpha;
      context.strokeStyle = "#ffffff";
      context.lineWidth = 2;
      context.shadowColor = "#b9edff";
      context.shadowBlur = 8;

      context.beginPath();
      context.moveTo(this.targetCenter.x - 13, this.targetCenter.y - 13);
      context.lineTo(this.targetCenter.x + 13, this.targetCenter.y + 13);

      context.moveTo(this.targetCenter.x + 13, this.targetCenter.y - 13);
      context.lineTo(this.targetCenter.x - 13, this.targetCenter.y + 13);

      context.stroke();
    }

    context.restore();
  }

  drawParticles(context) {
    context.save();

    for (const particle of this.particles) {
      context.globalAlpha = particle.life / particle.maxLife;
      context.fillStyle = "#e8faff";
      context.shadowColor = "#ffffff";
      context.shadowBlur = 6;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fill();
    }

    context.restore();
  }
}
