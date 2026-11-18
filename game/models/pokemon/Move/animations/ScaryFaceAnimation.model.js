export class ScaryFaceAnimation {
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

    this.attackerX =
      this.attacker.position.x +
      (this.attacker.frameWidth * this.attacker.scale) / 2;

    this.attackerY =
      this.attacker.position.y +
      (this.attacker.frameHeight * this.attacker.scale) / 2;

    this.targetX =
      this.target.position.x + (this.target.frameWidth * this.target.scale) / 2;

    this.targetY =
      this.target.position.y +
      (this.target.frameHeight * this.target.scale) / 2;

    this.direction = this.targetX > this.attackerX ? 1 : -1;

    this.phase = "DARKNESS";
    this.timer = 0;
    this.isFinished = false;

    this.darknessAlpha = 0;
    this.silhouetteAlpha = 0;
    this.faceAlpha = 0;
    this.shockwaveRadius = 0;
    this.shockwaveAlpha = 0;
    this.flashAlpha = 0;

    this.particles = Array.from({ length: 24 }, (_, i) => ({
      angle: (Math.PI * 2 * i) / 24,
      radius: 15 + Math.random() * 35,
      speed: 0.025 + Math.random() * 0.035,
      size: 1.5 + Math.random() * 3,
      alpha: 0.4 + Math.random() * 0.6,
    }));

    this.smokeParticles = Array.from({ length: 16 }, () => ({
      angle: Math.random() * Math.PI * 2,
      radius: 15 + Math.random() * 35,
      size: 4 + Math.random() * 7,
      speed: 0.5 + Math.random() * 1.2,
      offset: Math.random() * Math.PI * 2,
    }));
  }

  update(context) {
    if (this.isFinished) return;

    this.timer++;

    switch (this.phase) {
      case "DARKNESS":
        this.updateDarkness();
        break;

      case "MANIFEST":
        this.updateManifest();
        break;

      case "FEAR":
        this.updateFear();
        break;

      case "SHOCKWAVE":
        this.updateShockwave();
        break;

      case "FACE":
        this.updateFace();
        break;

      case "DISSOLVE":
        this.updateDissolve();
        break;
    }

    this.draw(context);
  }

  updateDarkness() {
    this.darknessAlpha = Math.min(0.4, this.timer * 0.025);

    if (this.timer >= 16) {
      this.phase = "MANIFEST";
      this.timer = 0;
    }
  }

  updateManifest() {
    this.silhouetteAlpha = Math.min(1, this.timer / 15);

    this.particles.forEach((particle) => {
      particle.angle += particle.speed;
    });

    if (this.timer >= 30) {
      this.phase = "FEAR";
      this.timer = 0;
    }
  }

  updateFear() {
    this.faceAlpha = Math.min(1, this.timer / 8);

    if (this.timer >= 18) {
      this.phase = "SHOCKWAVE";
      this.timer = 0;
      this.shockwaveRadius = 0;
      this.shockwaveAlpha = 1;
      this.game.canvas.startShake(12, 3);
    }
  }

  updateShockwave() {
    this.shockwaveRadius += 9;
    this.shockwaveAlpha = Math.max(0, 1 - this.timer / 18);
    this.flashAlpha = this.timer < 3 ? 0.5 : 0;

    if (this.timer >= 40) {
      this.phase = "FACE";
      this.timer = 0;
      this.faceAlpha = 1;
    }
  }

  updateFace() {
    this.faceAlpha = Math.max(0, 1 - this.timer / 22);

    if (this.timer >= 22) {
      this.phase = "DISSOLVE";
      this.timer = 0;
    }
  }

  updateDissolve() {
    this.smokeParticles.forEach((particle) => {
      particle.radius += particle.speed;
    });

    this.darknessAlpha = Math.max(0, 0.4 - this.timer * 0.025);
    this.silhouetteAlpha = Math.max(0, 1 - this.timer / 20);

    if (this.timer >= 20) {
      this.isFinished = true;
    }
  }

  draw(context) {
    context.save();

    switch (this.phase) {
      case "DARKNESS":
        this.drawDarkness(context);
        break;

      case "MANIFEST":
        this.drawDarkness(context);
        this.drawSilhouette(context);
        this.drawParticles(context);
        break;

      case "FEAR":
        this.drawSilhouette(context);
        this.drawParticles(context);
        this.drawEyes(context);
        break;

      case "SHOCKWAVE":
        this.drawShockwave(context);
        this.drawEyes(context);
        break;

      case "FACE":
        this.drawTargetFace(context);
        break;

      case "DISSOLVE":
        this.drawSmoke(context);
        break;
    }

    context.restore();
  }

  drawDarkness(context) {
    context.globalAlpha = this.darknessAlpha;
    context.fillStyle = "#100817";
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
  }

  drawSilhouette(context) {
    const height = 55;
    const width = 42;
    const pulse = Math.sin(this.timer * 0.2) * 3;

    const x = this.attackerX - this.direction * 8;
    const y = this.attackerY - 10;

    context.save();
    context.globalAlpha = this.silhouetteAlpha * 0.85;
    context.shadowBlur = 22;
    context.shadowColor = "#9b102d";
    context.fillStyle = "#170b20";

    // Silhouette spectrale derrière le Pokémon
    context.beginPath();
    context.moveTo(x, y - height - pulse);
    context.bezierCurveTo(
      x - width,
      y - height * 0.8,
      x - width * 0.8,
      y + height * 0.4,
      x - width * 0.5,
      y + height
    );
    context.lineTo(x + width * 0.5, y + height);
    context.bezierCurveTo(
      x + width * 0.8,
      y + height * 0.4,
      x + width,
      y - height * 0.8,
      x,
      y - height - pulse
    );
    context.fill();

    context.restore();
  }

  drawEyes(context) {
    const x = this.attackerX;
    const y = this.attackerY - 27;

    const eyePulse = 1 + Math.sin(this.timer * 0.35) * 0.12;

    context.save();
    context.globalAlpha = this.silhouetteAlpha;
    context.shadowBlur = 18;
    context.shadowColor = "#ff123c";
    context.fillStyle = "#ff243f";

    context.beginPath();
    context.ellipse(
      x - 10,
      y,
      6 * eyePulse,
      2.5 * eyePulse,
      -0.2,
      0,
      Math.PI * 2
    );
    context.ellipse(
      x + 10,
      y,
      6 * eyePulse,
      2.5 * eyePulse,
      0.2,
      0,
      Math.PI * 2
    );
    context.fill();

    context.restore();
  }

  drawParticles(context) {
    this.particles.forEach((particle) => {
      const x = this.attackerX + Math.cos(particle.angle) * particle.radius;

      const y =
        this.attackerY + Math.sin(particle.angle) * particle.radius * 0.7;

      context.globalAlpha = particle.alpha * this.silhouetteAlpha;
      context.fillStyle = "#d6294d";
      context.shadowBlur = 8;
      context.shadowColor = "#ff173e";

      context.beginPath();
      context.arc(x, y, particle.size, 0, Math.PI * 2);
      context.fill();
    });
  }

  drawShockwave(context) {
    context.globalAlpha = this.shockwaveAlpha;
    context.strokeStyle = "#ff2349";
    context.lineWidth = 5;
    context.shadowBlur = 18;
    context.shadowColor = "#ff123c";

    context.beginPath();
    context.ellipse(
      this.attackerX + (this.targetX - this.attackerX) * 0.5,
      this.attackerY + (this.targetY - this.attackerY) * 0.5,
      this.shockwaveRadius,
      this.shockwaveRadius * 0.55,
      0,
      0,
      Math.PI * 2
    );
    context.stroke();

    // Rayons de la décharge psychologique
    const middleX = this.attackerX + (this.targetX - this.attackerX) * 0.5;

    const middleY = this.attackerY + (this.targetY - this.attackerY) * 0.5;

    context.lineWidth = 2;

    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8;
      const length = this.shockwaveRadius * 0.7;

      context.beginPath();
      context.moveTo(middleX, middleY);
      context.lineTo(
        middleX + Math.cos(angle) * length,
        middleY + Math.sin(angle) * length
      );
      context.stroke();
    }

    if (this.flashAlpha > 0) {
      context.globalAlpha = this.flashAlpha;
      context.fillStyle = "#ffb5c4";
      context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    }
  }

  drawTargetFace(context) {
    const scale = 1 + Math.sin(this.timer * 0.5) * 0.08;

    context.save();
    context.translate(this.targetX, this.targetY - 18);
    context.scale(scale, scale);
    context.globalAlpha = this.faceAlpha;

    context.shadowBlur = 20;
    context.shadowColor = "#ff123c";

    // Visage spectral
    context.fillStyle = "#270b20";
    context.strokeStyle = "#ff3153";
    context.lineWidth = 2;

    context.beginPath();
    context.moveTo(0, -28);
    context.lineTo(23, -12);
    context.lineTo(18, 17);
    context.lineTo(0, 29);
    context.lineTo(-18, 17);
    context.lineTo(-23, -12);
    context.closePath();
    context.fill();
    context.stroke();

    // Yeux menaçants
    context.fillStyle = "#ff304d";
    context.beginPath();
    context.moveTo(-15, -7);
    context.lineTo(-3, -2);
    context.lineTo(-13, 1);
    context.closePath();
    context.fill();

    context.beginPath();
    context.moveTo(15, -7);
    context.lineTo(3, -2);
    context.lineTo(13, 1);
    context.closePath();
    context.fill();

    // Bouche
    context.strokeStyle = "#ff7a8e";
    context.lineWidth = 2.5;
    context.beginPath();
    context.moveTo(-10, 13);
    context.lineTo(-5, 8);
    context.lineTo(0, 14);
    context.lineTo(5, 8);
    context.lineTo(10, 13);
    context.stroke();

    context.restore();
  }

  drawSmoke(context) {
    this.smokeParticles.forEach((particle) => {
      const x = this.targetX + Math.cos(particle.angle) * particle.radius;

      const y =
        this.targetY - 15 + Math.sin(particle.angle) * particle.radius * 0.7;

      context.globalAlpha = Math.max(0, 1 - this.timer / 20);
      context.fillStyle = "#7d294c";
      context.shadowBlur = 10;
      context.shadowColor = "#c51d49";

      context.beginPath();
      context.arc(
        x,
        y,
        particle.size * (1 + this.timer * 0.025),
        0,
        Math.PI * 2
      );
      context.fill();
    });
  }
}
