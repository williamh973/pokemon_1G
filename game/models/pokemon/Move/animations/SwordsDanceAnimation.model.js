export class SwordsDanceAnimation {
  constructor(game, viewers, turnAction) {
    this.game = game;
    this.viewers = viewers;
    this.turnAction = turnAction;

    if (viewers.front.slot.content === turnAction.pokemon) {
      this.pokemonViewer = viewers.front;
    } else {
      this.pokemonViewer = viewers.back;
    }

    this.pokemon = this.pokemonViewer.sprite;

    this.centerX =
      this.pokemon.position.x +
      (this.pokemon.frameWidth * this.pokemon.scale) / 2;

    this.centerY =
      this.pokemon.position.y +
      (this.pokemon.frameHeight * this.pokemon.scale) / 2;

    this.phase = "APPEAR";
    this.timer = 0;
    this.isFinished = false;

    this.bladeDistance = 43;
    this.bladeAngle = 0;
    this.flashAlpha = 0;
    this.auraAlpha = 0;

    this.blades = [
      { angle: -Math.PI / 2, side: -1 },
      { angle: Math.PI / 2, side: 1 },
    ];
  }

  update(context) {
    if (this.isFinished) return;

    this.timer++;

    switch (this.phase) {
      case "APPEAR":
        this.updateAppear();
        break;

      case "ROTATE":
        this.updateRotate();
        break;

      case "CROSS":
        this.updateCross();
        break;

      case "BURST":
        this.updateBurst();
        break;

      case "AURA":
        this.updateAura();
        break;

      case "VANISH":
        this.updateVanish();
        break;
    }

    this.draw(context);
  }

  updateAppear() {
    if (this.timer >= 12) {
      this.phase = "ROTATE";
      this.timer = 0;
    }
  }

  updateRotate() {
    this.bladeAngle += 0.16;

    if (this.timer >= 42) {
      this.phase = "CROSS";
      this.timer = 0;
    }
  }

  updateCross() {
    this.bladeAngle += 0.22;

    if (this.timer >= 15) {
      this.phase = "BURST";
      this.timer = 0;
      this.game.canvas.startShake(12, 3);
    }
  }

  updateBurst() {
    this.flashAlpha = Math.max(0, 1 - this.timer / 12);

    if (this.timer >= 12) {
      this.phase = "AURA";
      this.timer = 0;
    }
  }

  updateAura() {
    this.auraAlpha = Math.max(0, 1 - this.timer / 32);

    if (this.timer >= 32) {
      this.phase = "VANISH";
      this.timer = 0;
    }
  }

  updateVanish() {
    if (this.timer >= 10) {
      this.isFinished = true;
    }
  }

  draw(context) {
    context.save();

    switch (this.phase) {
      case "APPEAR":
      case "ROTATE":
      case "CROSS":
        this.drawBlades(context);
        break;

      case "BURST":
        this.drawBlades(context);
        this.drawFlash(context);
        break;

      case "AURA":
        this.drawAura(context);
        break;

      case "VANISH":
        this.drawAura(context);
        this.drawParticles(context);
        break;
    }

    context.restore();
  }

  drawBlades(context) {
    const progress = Math.min(1, this.timer / 12);
    const alpha = this.phase === "APPEAR" ? progress : 1;

    this.blades.forEach((blade, index) => {
      let angle;

      if (this.phase === "CROSS") {
        const progress = this.timer / 15;
        angle =
          blade.angle +
          this.bladeAngle +
          (index === 0 ? (progress * Math.PI) / 2 : (-progress * Math.PI) / 2);
      } else {
        angle = blade.angle + this.bladeAngle * blade.side;
      }

      const x = this.centerX + Math.cos(angle) * this.bladeDistance;
      const y = this.centerY + Math.sin(angle) * this.bladeDistance;

      context.save();
      context.translate(x, y);
      context.rotate(angle + Math.PI / 2);
      context.globalAlpha = alpha;

      // Traînée lumineuse
      context.shadowBlur = 15;
      context.shadowColor = "#ffe9a6";
      context.strokeStyle = "rgba(255, 220, 120, 0.65)";
      context.lineWidth = 5;
      context.beginPath();
      context.moveTo(0, 13);
      context.lineTo(0, -20);
      context.stroke();

      // Lame
      context.fillStyle = "#fffdf0";
      context.strokeStyle = "#e9b947";
      context.lineWidth = 1.5;

      context.beginPath();
      context.moveTo(0, -23);
      context.lineTo(5, -8);
      context.lineTo(2, 13);
      context.lineTo(0, 18);
      context.lineTo(-2, 13);
      context.lineTo(-5, -8);
      context.closePath();
      context.fill();
      context.stroke();

      context.restore();
    });
  }

  drawFlash(context) {
    const alpha = this.flashAlpha;

    context.globalAlpha = alpha;
    context.fillStyle = "#fff9d9";
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);

    context.globalAlpha = alpha * 0.8;
    context.strokeStyle = "#ffd65c";
    context.lineWidth = 4;
    context.shadowBlur = 20;
    context.shadowColor = "#ffd65c";

    const size = 18 + this.timer * 7;

    context.beginPath();
    context.moveTo(this.centerX - size, this.centerY - size);
    context.lineTo(this.centerX + size, this.centerY + size);
    context.moveTo(this.centerX + size, this.centerY - size);
    context.lineTo(this.centerX - size, this.centerY + size);
    context.stroke();
  }

  drawAura(context) {
    const pulse = Math.sin(this.timer * 0.35) * 4;
    const radius = 25 + pulse + this.timer * 0.25;

    context.globalAlpha = this.auraAlpha;
    context.shadowBlur = 20;
    context.shadowColor = "#ffd447";
    context.strokeStyle = "#ffe58a";
    context.lineWidth = 4;

    context.beginPath();
    context.ellipse(
      this.centerX,
      this.centerY,
      radius,
      radius * 1.3,
      0,
      0,
      Math.PI * 2
    );
    context.stroke();

    context.globalAlpha = this.auraAlpha * 0.35;
    context.fillStyle = "#ffd447";

    context.beginPath();
    context.ellipse(
      this.centerX,
      this.centerY,
      radius,
      radius * 1.3,
      0,
      0,
      Math.PI * 2
    );
    context.fill();
  }

  drawParticles(context) {
    context.globalAlpha = Math.max(0, 1 - this.timer / 10);

    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8;
      const distance = 25 + this.timer * 3;

      const x = this.centerX + Math.cos(angle) * distance;
      const y = this.centerY + Math.sin(angle) * distance;

      context.fillStyle = "#ffe58a";
      context.shadowBlur = 8;
      context.shadowColor = "#ffd447";

      context.beginPath();
      context.arc(x, y, 2, 0, Math.PI * 2);
      context.fill();
    }
  }
}
