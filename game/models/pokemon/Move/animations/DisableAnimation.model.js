export class DisableAnimation {
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

    this.centerX =
      this.target.position.x + (this.target.frameWidth * this.target.scale) / 2;

    this.centerY =
      this.target.position.y +
      (this.target.frameHeight * this.target.scale) / 2;

    this.phase = "RUNE";
    this.timer = 0;
    this.isFinished = false;

    this.runeRadius = 0;
    this.sealScale = 0;
    this.sealAlpha = 0;
    this.flashAlpha = 0;

    this.particles = Array.from({ length: 18 }, (_, i) => ({
      angle: (Math.PI * 2 * i) / 18,
      radius: 25 + Math.random() * 30,
      speed: 0.025 + Math.random() * 0.035,
      size: 1.5 + Math.random() * 2,
      life: Math.random() * Math.PI * 2,
    }));

    this.chains = [
      { angle: 0, offset: 0 },
      { angle: Math.PI / 2, offset: 1.2 },
      { angle: Math.PI, offset: 2.4 },
      { angle: Math.PI * 1.5, offset: 3.6 },
    ];
  }

  update(context) {
    if (this.isFinished) return;

    this.timer++;

    switch (this.phase) {
      case "RUNE":
        this.updateRune();
        break;

      case "CHAINS":
        this.updateChains();
        break;

      case "SEAL":
        this.updateSeal();
        break;

      case "BREAK":
        this.updateBreak();
        break;

      case "VANISH":
        this.updateVanish();
        break;
    }

    this.draw(context);
  }

  updateRune() {
    this.runeRadius = Math.min(48, this.timer * 4);

    if (this.timer >= 16) {
      this.phase = "CHAINS";
      this.timer = 0;
    }
  }

  updateChains() {
    this.particles.forEach((particle) => {
      particle.angle += particle.speed;
    });

    if (this.timer >= 35) {
      this.phase = "SEAL";
      this.timer = 0;
    }
  }

  updateSeal() {
    this.sealScale = Math.min(1, this.timer / 10);
    this.sealAlpha = Math.min(1, this.timer / 6);

    if (this.timer === 10) {
      this.flashAlpha = 0.8;
      this.game.canvas.startShake(8, 2);
    }

    this.flashAlpha = Math.max(0, this.flashAlpha - 0.12);

    if (this.timer >= 24) {
      this.phase = "BREAK";
      this.timer = 0;
    }
  }

  updateBreak() {
    this.particles.forEach((particle) => {
      particle.angle += particle.speed * 2;
      particle.radius += 1.2;
    });

    this.sealAlpha = Math.max(0, 1 - this.timer / 12);

    if (this.timer >= 12) {
      this.phase = "VANISH";
      this.timer = 0;
    }
  }

  updateVanish() {
    if (this.timer >= 15) {
      this.isFinished = true;
    }
  }

  draw(context) {
    context.save();

    switch (this.phase) {
      case "RUNE":
        this.drawRune(context);
        break;

      case "CHAINS":
        this.drawRune(context);
        this.drawChains(context);
        this.drawParticles(context);
        break;

      case "SEAL":
        this.drawChains(context);
        this.drawSeal(context);
        this.drawFlash(context);
        break;

      case "BREAK":
        this.drawBrokenSeal(context);
        this.drawParticles(context);
        break;

      case "VANISH":
        this.drawParticles(context);
        break;
    }

    context.restore();
  }

  drawRune(context) {
    const rotation = this.timer * 0.06;

    context.save();
    context.translate(this.centerX, this.centerY + 24);
    context.rotate(rotation);

    context.globalAlpha = this.phase === "RUNE" ? 1 : 0.65;
    context.strokeStyle = "#b66aff";
    context.lineWidth = 2;
    context.shadowBlur = 14;
    context.shadowColor = "#a52cff";

    context.beginPath();
    context.arc(0, 0, this.runeRadius, 0, Math.PI * 2);
    context.stroke();

    context.beginPath();
    context.arc(0, 0, this.runeRadius * 0.72, 0, Math.PI * 2);
    context.stroke();

    // Marques runiques
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8;
      const x = Math.cos(angle) * this.runeRadius;
      const y = Math.sin(angle) * this.runeRadius;

      context.beginPath();
      context.moveTo(x * 0.82, y * 0.82);
      context.lineTo(x * 1.12, y * 1.12);
      context.stroke();
    }

    context.restore();
  }

  drawChains(context) {
    const progress = Math.min(1, this.timer / 25);

    context.save();
    context.strokeStyle = "#d17aff";
    context.lineWidth = 3;
    context.shadowBlur = 12;
    context.shadowColor = "#b12cff";

    this.chains.forEach((chain) => {
      const angle =
        chain.angle + Math.sin(this.timer * 0.12 + chain.offset) * 0.15;

      const startX = this.centerX + Math.cos(angle) * 12;
      const startY = this.centerY + Math.sin(angle) * 12;

      const endX = this.centerX + Math.cos(angle) * 35;
      const endY = this.centerY + Math.sin(angle) * 35;

      const currentX = startX + (endX - startX) * progress;
      const currentY = startY + (endY - startY) * progress;

      context.beginPath();
      context.moveTo(startX, startY);
      context.quadraticCurveTo(
        this.centerX + Math.cos(angle + 0.7) * 25,
        this.centerY + Math.sin(angle + 0.7) * 25,
        currentX,
        currentY
      );
      context.stroke();

      // Maillons lumineux
      for (let i = 0; i < 4; i++) {
        const t = i / 4;
        const x = startX + (currentX - startX) * t;
        const y = startY + (currentY - startY) * t;

        context.fillStyle = "#f2c5ff";
        context.beginPath();
        context.arc(x, y, 2, 0, Math.PI * 2);
        context.fill();
      }
    });

    context.restore();
  }

  drawSeal(context) {
    const x = this.centerX;
    const y = this.centerY - 5;

    context.save();
    context.translate(x, y);
    context.scale(this.sealScale, this.sealScale);

    context.globalAlpha = this.sealAlpha;
    context.shadowBlur = 18;
    context.shadowColor = "#c044ff";

    // Disque central
    const gradient = context.createRadialGradient(0, 0, 2, 0, 0, 23);
    gradient.addColorStop(0, "#f4d6ff");
    gradient.addColorStop(0.45, "#a83be0");
    gradient.addColorStop(1, "#4b176f");

    context.fillStyle = gradient;
    context.beginPath();
    context.arc(0, 0, 21, 0, Math.PI * 2);
    context.fill();

    context.strokeStyle = "#edb8ff";
    context.lineWidth = 2;
    context.beginPath();
    context.arc(0, 0, 21, 0, Math.PI * 2);
    context.stroke();

    // Symbole de verrouillage
    context.strokeStyle = "#ffffff";
    context.lineWidth = 2.5;
    context.beginPath();
    context.moveTo(-9, -10);
    context.lineTo(9, 10);
    context.moveTo(9, -10);
    context.lineTo(-9, 10);
    context.stroke();

    context.beginPath();
    context.arc(0, 0, 5, 0, Math.PI * 2);
    context.stroke();

    context.restore();
  }

  drawFlash(context) {
    if (this.flashAlpha <= 0) return;

    context.globalAlpha = this.flashAlpha;
    context.fillStyle = "#e9baff";
    context.fillRect(this.centerX - 28, this.centerY - 35, 56, 56);
  }

  drawBrokenSeal(context) {
    const alpha = this.sealAlpha;

    context.save();
    context.translate(this.centerX, this.centerY - 5);
    context.globalAlpha = alpha;
    context.strokeStyle = "#d78aff";
    context.lineWidth = 3;
    context.shadowBlur = 12;
    context.shadowColor = "#bd4aff";

    context.beginPath();
    context.arc(0, 0, 21, 0.2, Math.PI * 0.9);
    context.stroke();

    context.beginPath();
    context.arc(0, 0, 21, Math.PI * 1.2, Math.PI * 1.9);
    context.stroke();

    context.restore();
  }

  drawParticles(context) {
    this.particles.forEach((particle) => {
      const x = this.centerX + Math.cos(particle.angle) * particle.radius;

      const y = this.centerY + Math.sin(particle.angle) * particle.radius * 0.7;

      const alpha = Math.max(0, 0.8 - this.timer / 35);

      context.globalAlpha = alpha;
      context.fillStyle = "#dba0ff";
      context.shadowBlur = 9;
      context.shadowColor = "#b52cff";

      context.beginPath();
      context.arc(x, y, particle.size, 0, Math.PI * 2);
      context.fill();
    });
  }
}
