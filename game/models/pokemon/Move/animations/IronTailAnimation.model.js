export class IronTailAnimation {
  static PHASES = {
    PREPARE: "PREPARE",
    METALIZE: "METALIZE",
    SLASH: "SLASH",
    IMPACT: "IMPACT",
    FINISH: "FINISH",
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

    this.sprite = this.pokemonViewer.sprite;
    this.targetSprite = this.targetViewer.sprite;

    this.width = this.sprite.frameWidth * this.sprite.scale;
    this.height = this.sprite.frameHeight * this.sprite.scale;

    this.targetWidth = this.targetSprite.frameWidth * this.targetSprite.scale;
    this.targetHeight = this.targetSprite.frameHeight * this.targetSprite.scale;

    this.originX = this.sprite.position.x;
    this.originY = this.sprite.position.y;

    this.targetX = this.targetSprite.position.x + this.targetWidth / 2;
    this.targetY = this.targetSprite.position.y + this.targetHeight / 2;

    this.direction = this.targetX >= this.originX ? 1 : -1;

    this.phase = IronTailAnimation.PHASES.PREPARE;
    this.timer = 0;
    this.isFinished = false;

    this.phaseDuration = {
      PREPARE: 16,
      METALIZE: 48,
      SLASH: 32,
      IMPACT: 28,
      FINISH: 24,
    };

    this.metalProgress = 0;
    this.slashProgress = 0;
    this.impactProgress = 0;

    this.particles = [];
    this.sparkles = [];

    this.slashStartX =
      this.direction === 1
        ? this.originX + this.width * 0.65
        : this.originX - this.width * 0.2;

    this.slashEndX =
      this.direction === 1
        ? this.targetX + this.targetWidth * 0.25
        : this.targetX - this.targetWidth * 0.25;

    this.slashY = this.targetY;
    this.impactX = this.targetX;
    this.impactY = this.targetY;
  }

  update(context) {
    if (this.isFinished) return;

    this.timer++;

    switch (this.phase) {
      case IronTailAnimation.PHASES.PREPARE:
        this.updatePrepare();
        break;

      case IronTailAnimation.PHASES.METALIZE:
        this.updateMetalize();
        break;

      case IronTailAnimation.PHASES.SLASH:
        this.updateSlash();
        break;

      case IronTailAnimation.PHASES.IMPACT:
        this.updateImpact();
        break;

      case IronTailAnimation.PHASES.FINISH:
        this.updateFinish();
        break;
    }

    this.updateParticles();
    this.updateSparkles();

    this.draw(context);
  }

  changePhase(phase) {
    this.phase = phase;
    this.timer = 0;
  }

  easeOut(value) {
    return 1 - Math.pow(1 - value, 3);
  }

  easeInOut(value) {
    return value < 0.5
      ? 4 * value * value * value
      : 1 - Math.pow(-2 * value + 2, 3) / 2;
  }

  updatePrepare() {
    if (this.timer >= this.phaseDuration.PREPARE) {
      this.changePhase(IronTailAnimation.PHASES.METALIZE);
    }
  }

  updateMetalize() {
    const progress = Math.min(1, this.timer / this.phaseDuration.METALIZE);

    this.metalProgress = this.easeOut(progress);

    if (this.timer % 4 === 0) {
      this.createMetalSparkle();
    }

    if (this.timer >= this.phaseDuration.METALIZE) {
      this.changePhase(IronTailAnimation.PHASES.SLASH);
    }
  }

  updateSlash() {
    const progress = Math.min(1, this.timer / this.phaseDuration.SLASH);

    this.slashProgress = this.easeInOut(progress);

    if (this.timer % 2 === 0) {
      this.createSlashParticle();
    }

    if (this.timer >= this.phaseDuration.SLASH) {
      this.changePhase(IronTailAnimation.PHASES.IMPACT);

      this.game.canvas.startShake(1000, 5);
      this.createImpactBurst();
    }
  }

  updateImpact() {
    const progress = Math.min(1, this.timer / this.phaseDuration.IMPACT);

    this.impactProgress = 1 - this.easeOut(progress);

    if (this.timer % 3 === 0) {
      this.createImpactSparkle();
    }

    if (this.timer >= this.phaseDuration.IMPACT) {
      this.changePhase(IronTailAnimation.PHASES.FINISH);
    }
  }

  updateFinish() {
    this.metalProgress = Math.max(
      0,
      1 - this.timer / this.phaseDuration.FINISH
    );

    if (this.timer >= this.phaseDuration.FINISH) {
      this.isFinished = true;
    }
  }

  createMetalSparkle() {
    const x = this.originX + Math.random() * this.width;
    const y = this.originY + Math.random() * this.height;

    this.sparkles.push({
      x,
      y,
      size: 2 + Math.random() * 3,
      life: 14,
      maxLife: 14,
    });
  }

  createSlashParticle() {
    const progress = this.slashProgress;

    const x = this.slashStartX + (this.slashEndX - this.slashStartX) * progress;

    const y = this.slashY + (Math.random() - 0.5) * 35;

    this.particles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: 2 + Math.random() * 3,
      life: 12,
      maxLife: 12,
    });
  }

  createImpactBurst() {
    for (let i = 0; i < 18; i++) {
      const angle = (Math.PI * 2 * i) / 18;
      const speed = 2 + Math.random() * 4;

      this.particles.push({
        x: this.impactX,
        y: this.impactY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3 + Math.random() * 4,
        life: 20,
        maxLife: 20,
      });
    }

    for (let i = 0; i < 8; i++) {
      this.createImpactSparkle();
    }
  }

  createImpactSparkle() {
    const angle = Math.random() * Math.PI * 2;
    const radius = 10 + Math.random() * 35;

    this.sparkles.push({
      x: this.impactX + Math.cos(angle) * radius,
      y: this.impactY + Math.sin(angle) * radius,
      size: 3 + Math.random() * 5,
      life: 16,
      maxLife: 16,
    });
  }

  updateParticles() {
    this.particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      particle.vx *= 0.94;
      particle.vy *= 0.94;

      particle.life--;
    });

    this.particles = this.particles.filter((particle) => particle.life > 0);
  }

  updateSparkles() {
    this.sparkles.forEach((sparkle) => {
      sparkle.life--;
    });

    this.sparkles = this.sparkles.filter((sparkle) => sparkle.life > 0);
  }

  draw(context) {
    context.save();

    this.drawMetalPokemon(context);
    this.drawSlash(context);
    this.drawImpact(context);
    this.drawParticles(context);
    this.drawSparkles(context);

    context.restore();
  }

  drawMetalPokemon(context) {
    if (this.metalProgress <= 0) return;

    const image = this.sprite.image;

    if (!image || !image.complete || !image.naturalWidth) return;

    const alpha =
      this.phase === IronTailAnimation.PHASES.FINISH
        ? this.metalProgress
        : this.metalProgress;

    context.save();

    context.globalAlpha = alpha;

    // On redessine exactement la frame courante en niveaux de gris.
    // Le SpriteViewer continue de gérer le sprite original.
    context.filter = "grayscale(1) brightness(1.35) contrast(1.15)";

    context.drawImage(
      image,
      this.sprite.currentFrame * this.sprite.frameWidth,
      0,
      this.sprite.frameWidth,
      this.sprite.frameHeight,
      this.sprite.position.x,
      this.sprite.position.y,
      this.width,
      this.height
    );

    context.filter = "none";

    // Reflet argenté qui traverse progressivement le Pokémon.
    const flashWidth = this.width * 0.35;
    const flashX = this.originX + this.width * this.metalProgress - flashWidth;

    const gradient = context.createLinearGradient(
      flashX,
      0,
      flashX + flashWidth,
      0
    );

    gradient.addColorStop(0, "rgba(255,255,255,0)");
    gradient.addColorStop(0.5, "rgba(255,255,255,0.7)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");

    context.fillStyle = gradient;
    context.fillRect(this.originX, this.originY, this.width, this.height);

    context.restore();
  }

  drawSlash(context) {
    if (this.phase !== IronTailAnimation.PHASES.SLASH) return;

    const progress = this.slashProgress;

    const currentX =
      this.slashStartX + (this.slashEndX - this.slashStartX) * progress;

    const length = 100;
    const thickness = 20;

    // La lame traverse l'écran en diagonale.
    const angle = this.direction === 1 ? -0.65 : Math.PI + 0.65;

    const startX = currentX - Math.cos(angle) * length * 0.5;
    const startY = this.slashY - Math.sin(angle) * length * 0.5;

    const endX = currentX + Math.cos(angle) * length * 0.5;
    const endY = this.slashY + Math.sin(angle) * length * 0.5;

    context.save();

    context.lineCap = "round";

    // Ombre sombre de la lame.
    context.beginPath();
    context.moveTo(startX, startY);
    context.lineTo(endX, endY);

    context.strokeStyle = "#536b85";
    context.lineWidth = thickness + 6;
    context.shadowColor = "#b9dfff";
    context.shadowBlur = 15;
    context.stroke();

    // Corps argenté.
    const gradient = context.createLinearGradient(startX, startY, endX, endY);

    gradient.addColorStop(0, "#8297ad");
    gradient.addColorStop(0.5, "#ffffff");
    gradient.addColorStop(1, "#9fb7d2");

    context.beginPath();
    context.moveTo(startX, startY);
    context.lineTo(endX, endY);

    context.strokeStyle = gradient;
    context.lineWidth = thickness;
    context.stroke();

    // Reflet central.
    context.beginPath();
    context.moveTo(startX, startY);
    context.lineTo(endX, endY);

    context.strokeStyle = "#ffffff";
    context.lineWidth = 3;
    context.shadowBlur = 8;
    context.stroke();

    context.restore();
  }

  drawImpact(context) {
    if (this.phase !== IronTailAnimation.PHASES.IMPACT) return;

    const progress = 1 - this.impactProgress;
    const radius = 12 + progress * 42;

    context.save();

    context.globalAlpha = this.impactProgress;

    // Flash blanc central.
    context.fillStyle = "#ffffff";
    context.shadowColor = "#c5e4ff";
    context.shadowBlur = 20;

    context.beginPath();
    context.arc(this.impactX, this.impactY, 8 + progress * 12, 0, Math.PI * 2);
    context.fill();

    // Onde de choc.
    context.beginPath();
    context.arc(this.impactX, this.impactY, radius, 0, Math.PI * 2);

    context.strokeStyle = "#e8f3ff";
    context.lineWidth = 4;
    context.stroke();

    context.restore();
  }

  drawParticles(context) {
    context.save();

    this.particles.forEach((particle) => {
      const alpha = particle.life / particle.maxLife;

      context.save();
      context.globalAlpha = alpha;

      context.fillStyle = "#e5f2ff";
      context.shadowColor = "#a8d5ff";
      context.shadowBlur = 8;

      context.beginPath();
      context.arc(
        particle.x,
        particle.y,
        particle.size * alpha,
        0,
        Math.PI * 2
      );
      context.fill();

      context.restore();
    });

    context.restore();
  }

  drawSparkles(context) {
    context.save();

    this.sparkles.forEach((sparkle) => {
      const alpha = sparkle.life / sparkle.maxLife;
      const size = sparkle.size * alpha;

      context.save();
      context.globalAlpha = alpha;

      context.strokeStyle = "#ffffff";
      context.lineWidth = 1.5;
      context.shadowColor = "#b9dfff";
      context.shadowBlur = 8;

      context.beginPath();
      context.moveTo(sparkle.x - size, sparkle.y);
      context.lineTo(sparkle.x + size, sparkle.y);

      context.moveTo(sparkle.x, sparkle.y - size);
      context.lineTo(sparkle.x, sparkle.y + size);

      context.stroke();

      context.restore();
    });

    context.restore();
  }
}
