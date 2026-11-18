export class ViceGripAnimation {
  static PHASES = {
    PREPARE: 14,
    CLOSE: 12,
    CRUSH: 10,
    RELEASE: 14,
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

    this.targetCenter = this.getTargetCenter();

    this.jawWidth = 54;
    this.jawHeight = 30;
    this.openDistance = 40;
    this.closeDistance = 0;

    this.jawOffset = this.openDistance;

    this.particles = [];
    this.impactParticles = [];
    this.flashAlpha = 0;

    this.createPreparationParticles();
  }

  update(context) {
    if (this.isFinished) return;

    this.timer++;

    switch (this.phase) {
      case "PREPARE":
        if (this.timer >= ViceGripAnimation.PHASES.PREPARE) {
          this.nextPhase("CLOSE");
        }
        break;

      case "CLOSE": {
        const progress = Math.min(
          this.timer / ViceGripAnimation.PHASES.CLOSE,
          1
        );

        const eased = 1 - Math.pow(1 - progress, 3);

        this.jawOffset =
          this.openDistance - (this.openDistance - this.closeDistance) * eased;

        if (this.timer >= ViceGripAnimation.PHASES.CLOSE) {
          this.createImpact();
          this.nextPhase("CRUSH");
        }
        break;
      }

      case "CRUSH":
        this.jawOffset = this.closeDistance;

        this.flashAlpha *= 0.78;
        this.updateImpactParticles();

        if (this.timer >= ViceGripAnimation.PHASES.CRUSH) {
          this.nextPhase("RELEASE");
        }
        break;

      case "RELEASE": {
        const progress = Math.min(
          this.timer / ViceGripAnimation.PHASES.RELEASE,
          1
        );

        const eased = progress * progress;

        this.jawOffset =
          this.closeDistance + (this.openDistance - this.closeDistance) * eased;

        this.updateImpactParticles();

        if (this.timer >= ViceGripAnimation.PHASES.RELEASE) {
          this.isFinished = true;
        }
        break;
      }
    }

    this.updateParticles();
    this.draw(context);
  }

  nextPhase(phase) {
    this.phase = phase;
    this.timer = 0;
  }

  getTargetCenter() {
    const sprite = this.target;

    return {
      x: sprite.position.x + sprite.frameWidth / 2,
      y: sprite.position.y + sprite.frameHeight / 2,
    };
  }

  createPreparationParticles() {
    for (let i = 0; i < 8; i++) {
      const angle = Math.random() * Math.PI * 2;

      this.particles.push({
        x: this.targetCenter.x,
        y: this.targetCenter.y,
        vx: Math.cos(angle) * (0.5 + Math.random()),
        vy: Math.sin(angle) * (0.5 + Math.random()),
        life: 12 + Math.random() * 8,
        maxLife: 20,
        size: 1 + Math.random() * 2,
      });
    }
  }

  createImpact() {
    this.flashAlpha = 0.95;

    for (let i = 0; i < 22; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.2 + Math.random() * 3;

      this.impactParticles.push({
        x: this.targetCenter.x,
        y: this.targetCenter.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 14 + Math.random() * 10,
        maxLife: 24,
        size: 1 + Math.random() * 2.5,
      });
    }

    if (this.game.canvas?.startShake) {
      this.game.canvas.startShake(3, 140);
    }
  }

  updateParticles() {
    this.particles = this.particles.filter((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vx *= 0.96;
      particle.vy *= 0.96;
      particle.life--;

      return particle.life > 0;
    });
  }

  updateImpactParticles() {
    this.impactParticles = this.impactParticles.filter((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      particle.vx *= 0.92;
      particle.vy *= 0.92;

      particle.life--;

      return particle.life > 0;
    });
  }

  draw(context) {
    this.drawParticles(context);
    this.drawJaws(context);

    if (this.phase === "CRUSH" || this.phase === "RELEASE") {
      this.drawImpact(context);
    }

    this.drawImpactParticles(context);
  }

  drawJaws(context) {
    const center = this.targetCenter;
    const offset = this.jawOffset;

    context.save();

    // Mâchoire supérieure.
    context.save();
    context.translate(center.x, center.y - offset);
    this.drawJaw(context, -1);
    context.restore();

    // Mâchoire inférieure.
    context.save();
    context.translate(center.x, center.y + offset);
    this.drawJaw(context, 1);
    context.restore();

    context.restore();
  }

  drawJaw(context, direction) {
    const width = this.jawWidth;
    const height = this.jawHeight;

    context.save();

    // Aura métallique.
    context.shadowColor = "#bde9ff";
    context.shadowBlur = 9;

    const gradient = context.createLinearGradient(0, -height, 0, height);

    gradient.addColorStop(0, "#f5fbff");
    gradient.addColorStop(0.35, "#9daebc");
    gradient.addColorStop(0.7, "#536979");
    gradient.addColorStop(1, "#dce8ef");

    context.fillStyle = gradient;
    context.strokeStyle = "#344a5a";
    context.lineWidth = 1.5;

    // Corps courbé de la mâchoire.
    context.beginPath();

    if (direction === -1) {
      context.moveTo(-width, -height * 0.5);
      context.quadraticCurveTo(
        -width * 0.6,
        -height * 1.5,
        width * 0.4,
        -height * 0.65
      );
      context.lineTo(width * 0.55, height * 0.25);
      context.quadraticCurveTo(
        -width * 0.3,
        height * 0.1,
        -width,
        -height * 0.5
      );
    } else {
      context.moveTo(-width, height * 0.5);
      context.quadraticCurveTo(
        -width * 0.6,
        height * 1.5,
        width * 0.4,
        height * 0.65
      );
      context.lineTo(width * 0.55, -height * 0.25);
      context.quadraticCurveTo(
        -width * 0.3,
        -height * 0.1,
        -width,
        height * 0.5
      );
    }

    context.closePath();
    context.fill();
    context.stroke();

    // Pointe de la pince.
    context.shadowBlur = 5;
    context.fillStyle = "#f5fbff";

    context.beginPath();

    if (direction === -1) {
      context.moveTo(width * 0.4, -height * 0.65);
      context.lineTo(width * 0.85, 0);
      context.lineTo(width * 0.55, height * 0.25);
    } else {
      context.moveTo(width * 0.4, height * 0.65);
      context.lineTo(width * 0.85, 0);
      context.lineTo(width * 0.55, -height * 0.25);
    }

    context.closePath();
    context.fill();
    context.stroke();

    // Reflet métallique.
    context.shadowBlur = 0;
    context.strokeStyle = "rgba(255,255,255,0.8)";
    context.lineWidth = 1.2;

    context.beginPath();

    if (direction === -1) {
      context.moveTo(-width * 0.7, -height * 0.45);
      context.quadraticCurveTo(
        -width * 0.2,
        -height * 0.95,
        width * 0.3,
        -height * 0.55
      );
    } else {
      context.moveTo(-width * 0.7, height * 0.45);
      context.quadraticCurveTo(
        -width * 0.2,
        height * 0.95,
        width * 0.3,
        height * 0.55
      );
    }

    context.stroke();

    // Rivet.
    context.fillStyle = "#526979";
    context.beginPath();
    context.arc(-width * 0.65, 0, 2.5, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }

  drawImpact(context) {
    if (this.flashAlpha <= 0.03) return;

    context.save();

    context.globalAlpha = this.flashAlpha;
    context.fillStyle = "#ffffff";
    context.shadowColor = "#c8edff";
    context.shadowBlur = 12;

    context.beginPath();
    context.arc(
      this.targetCenter.x,
      this.targetCenter.y,
      8 + this.timer * 0.5,
      0,
      Math.PI * 2
    );
    context.fill();

    context.restore();
  }

  drawParticles(context) {
    context.save();

    for (const particle of this.particles) {
      context.globalAlpha = particle.life / particle.maxLife;
      context.fillStyle = "#d9f3ff";
      context.shadowColor = "#bde9ff";
      context.shadowBlur = 5;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fill();
    }

    context.restore();
  }

  drawImpactParticles(context) {
    context.save();

    for (const particle of this.impactParticles) {
      context.globalAlpha = particle.life / particle.maxLife;
      context.fillStyle = "#ffffff";
      context.shadowColor = "#bde9ff";
      context.shadowBlur = 6;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fill();
    }

    context.restore();
  }
}
