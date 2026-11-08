export class WrapAnimation {
  static PHASES = {
    PREPARE: "PREPARE",
    WRAP: "WRAP",
    TIGHTEN: "TIGHTEN",
    STRUGGLE: "STRUGGLE",
    RELEASE: "RELEASE",
  };

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

    this.targetSprite = this.targetViewer.sprite;

    this.originalX = this.targetSprite.position.x;
    this.originalY = this.targetSprite.position.y;

    this.phase = WrapAnimation.PHASES.PREPARE;
    this.timer = 0;
    this.isFinished = false;

    this.duration = {
      PREPARE: 10,
      WRAP: 10,
      TIGHTEN: 40,
      STRUGGLE: 30,
      RELEASE: 18,
    };

    this.wrapProgress = 0;
    this.tightenProgress = 0;
    this.releaseProgress = 0;

    this.strands = [
      { offset: -0.65, direction: 1, width: 7 },
      { offset: -0.25, direction: -1, width: 6 },
      { offset: 0.15, direction: 1, width: 7 },
      { offset: 0.55, direction: -1, width: 6 },
    ];

    this.particles = [];
    this.particleTimer = 0;

    this.struggleStrength = 0;
    this.shakeOffset = 0;
  }

  update(context) {
    if (this.isFinished) return;

    this.timer++;

    switch (this.phase) {
      case WrapAnimation.PHASES.PREPARE:
        this.updatePrepare();
        break;

      case WrapAnimation.PHASES.WRAP:
        this.updateWrap();
        break;

      case WrapAnimation.PHASES.TIGHTEN:
        this.updateTighten();
        break;

      case WrapAnimation.PHASES.STRUGGLE:
        this.updateStruggle();
        break;

      case WrapAnimation.PHASES.RELEASE:
        this.updateRelease();
        break;
    }

    this.updateParticles();
    this.draw(context);
  }

  changePhase(phase) {
    this.phase = phase;
    this.timer = 0;
  }

  updatePrepare() {
    if (this.timer >= this.duration.PREPARE) {
      this.changePhase(WrapAnimation.PHASES.WRAP);
    }
  }

  updateWrap() {
    this.wrapProgress = Math.min(1, this.timer / this.duration.WRAP);

    this.createWrapParticles();

    if (this.wrapProgress >= 1) {
      this.changePhase(WrapAnimation.PHASES.TIGHTEN);
    }
  }

  updateTighten() {
    this.tightenProgress = Math.min(1, this.timer / this.duration.TIGHTEN);

    if (this.tightenProgress >= 1) {
      this.changePhase(WrapAnimation.PHASES.STRUGGLE);
    }
  }

  updateStruggle() {
    this.struggleStrength = Math.sin(this.timer * 0.8);

    const intensity = 2.5;

    this.targetSprite.position.x =
      this.originalX + Math.sin(this.timer * 1.3) * intensity;

    this.targetSprite.position.y =
      this.originalY + Math.cos(this.timer * 1.7) * intensity * 0.5;

    this.createStruggleParticles();

    if (this.timer >= this.duration.STRUGGLE) {
      this.targetSprite.position.x = this.originalX;
      this.targetSprite.position.y = this.originalY;

      this.changePhase(WrapAnimation.PHASES.RELEASE);
    }
  }

  updateRelease() {
    this.releaseProgress = Math.min(1, this.timer / this.duration.RELEASE);

    if (this.releaseProgress >= 1) {
      this.targetSprite.position.x = this.originalX;
      this.targetSprite.position.y = this.originalY;

      this.isFinished = true;
    }
  }

  createWrapParticles() {
    this.particleTimer++;

    if (this.particleTimer % 4 !== 0) return;

    const bounds = this.getBounds();

    this.particles.push({
      x: bounds.centerX + (Math.random() - 0.5) * bounds.width,
      y: bounds.centerY + (Math.random() - 0.5) * bounds.height,
      vx: (Math.random() - 0.5) * 1.5,
      vy: -Math.random() * 1.5,
      life: 18,
      maxLife: 18,
      size: 1 + Math.random() * 2,
    });
  }

  createStruggleParticles() {
    this.particleTimer++;

    if (this.particleTimer % 5 !== 0) return;

    const bounds = this.getBounds();

    this.particles.push({
      x: bounds.centerX + (Math.random() - 0.5) * bounds.width,
      y: bounds.centerY + (Math.random() - 0.5) * bounds.height,
      vx: (Math.random() - 0.5) * 2,
      vy: -Math.random() * 2,
      life: 14,
      maxLife: 14,
      size: 1 + Math.random() * 2,
    });
  }

  updateParticles() {
    this.particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life--;
    });

    this.particles = this.particles.filter((particle) => particle.life > 0);
  }

  getBounds() {
    const sprite = this.targetSprite;

    const width = sprite.frameWidth;
    const height = sprite.frameHeight;

    return {
      x: sprite.position.x,
      y: sprite.position.y,
      width,
      height,
      centerX: sprite.position.x + width / 2,
      centerY: sprite.position.y + height / 2,
    };
  }

  getCurrentTightness() {
    if (this.phase === WrapAnimation.PHASES.TIGHTEN) {
      return this.tightenProgress;
    }

    if (this.phase === WrapAnimation.PHASES.STRUGGLE) {
      return 1;
    }

    if (this.phase === WrapAnimation.PHASES.RELEASE) {
      return 1 - this.releaseProgress;
    }

    return 0;
  }

  getCurrentWrapProgress() {
    if (this.phase === WrapAnimation.PHASES.PREPARE) {
      return 0;
    }

    if (this.phase === WrapAnimation.PHASES.WRAP) {
      return this.wrapProgress;
    }

    return 1;
  }

  getCurrentOpacity() {
    if (this.phase === WrapAnimation.PHASES.RELEASE) {
      return 1 - this.releaseProgress;
    }

    return 1;
  }

  draw(context) {
    const bounds = this.getBounds();

    const progress = this.getCurrentWrapProgress();
    const tightness = this.getCurrentTightness();
    const opacity = this.getCurrentOpacity();

    if (progress <= 0) {
      this.drawParticles(context);
      return;
    }

    context.save();

    context.globalAlpha = opacity;

    // Les liens latéraux donnent l'impression que les cordes
    // passent derrière le corps du Pokémon.
    this.drawSideStrands(context, bounds, progress, tightness);

    // Les liens principaux passent devant le sprite.
    this.drawFrontStrands(context, bounds, progress, tightness);

    // Les nœuds et croisements renforcent l'impression de ligotage.
    this.drawKnots(context, bounds, progress, tightness);

    this.drawParticles(context);

    context.restore();
  }

  drawSideStrands(context, bounds, progress, tightness) {
    const { centerX, centerY, width, height } = bounds;

    const visibleStrands = Math.ceil(progress * this.strands.length);

    for (let i = 0; i < visibleStrands; i++) {
      const strand = this.strands[i];

      const y = centerY + strand.offset * height * 0.55;

      const sideOffset = width * (0.42 - tightness * 0.08);

      context.save();

      context.lineCap = "round";
      context.lineJoin = "round";
      context.lineWidth = strand.width;

      // Partie gauche.
      this.drawStrandStroke(context, () => {
        context.beginPath();
        context.moveTo(centerX - sideOffset - 12, y - 12);
        context.quadraticCurveTo(
          centerX - sideOffset - 5,
          y,
          centerX - sideOffset,
          y + 8
        );
        context.stroke();
      });

      // Partie droite.
      this.drawStrandStroke(context, () => {
        context.beginPath();
        context.moveTo(centerX + sideOffset, y - 8);
        context.quadraticCurveTo(
          centerX + sideOffset + 5,
          y,
          centerX + sideOffset + 12,
          y + 12
        );
        context.stroke();
      });

      context.restore();
    }
  }

  drawFrontStrands(context, bounds, progress, tightness) {
    const { centerX, centerY, width, height } = bounds;

    const visibleStrands = Math.ceil(progress * this.strands.length);

    const compression = tightness * 0.12;

    for (let i = 0; i < visibleStrands; i++) {
      const strand = this.strands[i];

      const startX = centerX - width * 0.48;
      const endX = centerX + width * 0.48;

      const startY = centerY + strand.offset * height;
      const endY = centerY - strand.offset * height;

      const curve = strand.direction * height * (0.35 - compression);

      context.save();

      context.lineCap = "round";
      context.lineJoin = "round";

      // Ombre du lien.
      context.strokeStyle = "rgba(30, 18, 15, 0.65)";
      context.lineWidth = strand.width + 3;

      context.beginPath();
      context.moveTo(startX, startY);
      context.quadraticCurveTo(centerX, centerY + curve, endX, endY);
      context.stroke();

      // Corps du lien.
      const gradient = context.createLinearGradient(startX, startY, endX, endY);

      gradient.addColorStop(0, "#49302a");
      gradient.addColorStop(0.35, "#a87952");
      gradient.addColorStop(0.65, "#d2aa78");
      gradient.addColorStop(1, "#5b3b30");

      context.strokeStyle = gradient;
      context.lineWidth = strand.width;

      context.beginPath();
      context.moveTo(startX, startY);
      context.quadraticCurveTo(centerX, centerY + curve, endX, endY);
      context.stroke();

      // Reflet du lien.
      context.strokeStyle = "rgba(255, 220, 175, 0.55)";
      context.lineWidth = 1.5;

      context.beginPath();
      context.moveTo(startX + 2, startY - 1);
      context.quadraticCurveTo(
        centerX,
        centerY + curve - 2,
        endX - 2,
        endY - 1
      );
      context.stroke();

      context.restore();
    }
  }

  drawKnots(context, bounds, progress, tightness) {
    if (progress < 0.65) return;

    const { centerX, centerY, width, height } = bounds;

    const knotX = centerX + width * 0.2;
    const knotY = centerY - height * 0.1;

    const radius = 4 + tightness * 1.5;

    context.save();

    // Petit nœud central.
    context.fillStyle = "#59392e";
    context.beginPath();
    context.arc(knotX, knotY, radius, 0, Math.PI * 2);
    context.fill();

    context.strokeStyle = "#d2aa78";
    context.lineWidth = 2;
    context.beginPath();
    context.arc(knotX, knotY, radius - 1, 0, Math.PI * 2);
    context.stroke();

    // Extrémités du lien.
    context.lineWidth = 3;
    context.lineCap = "round";

    context.strokeStyle = "#a87952";

    context.beginPath();
    context.moveTo(knotX - 3, knotY + 2);
    context.lineTo(knotX - 9, knotY + 9);
    context.moveTo(knotX + 3, knotY + 2);
    context.lineTo(knotX + 9, knotY + 9);
    context.stroke();

    context.restore();
  }

  drawStrandStroke(context, callback) {
    context.strokeStyle = "rgba(40, 25, 20, 0.8)";
    callback();

    context.strokeStyle = "#a87952";
    context.lineWidth = Math.max(2, context.lineWidth - 2);
    callback();
  }

  drawParticles(context) {
    context.save();

    this.particles.forEach((particle) => {
      context.globalAlpha = particle.life / particle.maxLife;

      context.fillStyle = "#c69a70";

      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fill();
    });

    context.restore();
  }
}
