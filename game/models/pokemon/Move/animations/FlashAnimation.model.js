export class FlashAnimation {
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
      this.attacker.position.x +
      (this.attacker.frameWidth * this.attacker.scale) / 2;

    this.centerY =
      this.attacker.position.y +
      (this.attacker.frameHeight * this.attacker.scale) / 2;

    this.targetX =
      this.target.position.x + (this.target.frameWidth * this.target.scale) / 2;

    this.targetY =
      this.target.position.y +
      (this.target.frameHeight * this.target.scale) / 2;

    this.phase = "CHARGE";
    this.timer = 0;
    this.isFinished = false;

    this.orbRadius = 0;
    this.flashAlpha = 0;
    this.rayAlpha = 0;
    this.afterglowAlpha = 0;

    this.canvasWidth = game.canvas.width;
    this.canvasHeight = game.canvas.height;

    this.particles = Array.from({ length: 24 }, (_, i) => ({
      angle: (Math.PI * 2 * i) / 24,
      distance: 15 + Math.random() * 35,
      speed: 1.5 + Math.random() * 2,
      size: 1 + Math.random() * 2.5,
      alpha: 0.5 + Math.random() * 0.5,
    }));

    this.rays = Array.from({ length: 16 }, (_, i) => ({
      angle: (Math.PI * 2 * i) / 16,
      length: 20 + Math.random() * 25,
      width: 1 + Math.random() * 2,
    }));
  }

  update(context) {
    if (this.isFinished) return;

    this.timer++;

    switch (this.phase) {
      case "CHARGE":
        this.updateCharge();
        break;

      case "GATHER":
        this.updateGather();
        break;

      case "FLASH":
        this.updateFlash();
        break;

      case "AFTERGLOW":
        this.updateAfterglow();
        break;

      case "FADE":
        this.updateFade();
        break;
    }

    this.draw(context);
  }

  updateCharge() {
    this.orbRadius = Math.min(12, this.timer * 0.8);

    if (this.timer >= 15) {
      this.phase = "GATHER";
      this.timer = 0;
    }
  }

  updateGather() {
    this.orbRadius = 12 + Math.sin(this.timer * 0.5) * 3;
    this.rayAlpha = Math.min(1, this.timer / 15);

    this.particles.forEach((particle) => {
      particle.distance = Math.max(4, particle.distance - 0.8);
      particle.angle += 0.04;
    });

    if (this.timer >= 25) {
      this.phase = "FLASH";
      this.timer = 0;
      this.flashAlpha = 1;
      this.game.canvas.startShake(10, 3);
    }
  }

  updateFlash() {
    // Éclair blanc très intense, suivi d'une diminution rapide.
    if (this.timer < 4) {
      this.flashAlpha = 1;
    } else {
      this.flashAlpha = Math.max(0, 1 - (this.timer - 4) / 14);
    }

    if (this.timer >= 18) {
      this.phase = "AFTERGLOW";
      this.timer = 0;
    }
  }

  updateAfterglow() {
    this.afterglowAlpha = Math.max(0, 1 - this.timer / 30);

    this.particles.forEach((particle) => {
      particle.distance += particle.speed;
      particle.angle += 0.025;
    });

    if (this.timer >= 30) {
      this.phase = "FADE";
      this.timer = 0;
    }
  }

  updateFade() {
    if (this.timer >= 8) {
      this.isFinished = true;
    }
  }

  draw(context) {
    context.save();

    switch (this.phase) {
      case "CHARGE":
        this.drawOrb(context);
        break;

      case "GATHER":
        this.drawOrb(context);
        this.drawRays(context);
        this.drawParticles(context);
        break;

      case "FLASH":
        this.drawFullFlash(context);
        break;

      case "AFTERGLOW":
        this.drawAfterglow(context);
        this.drawParticles(context);
        break;

      case "FADE":
        this.drawParticles(context);
        break;
    }

    context.restore();
  }

  drawOrb(context) {
    const pulse = Math.sin(this.timer * 0.4) * 2;

    const gradient = context.createRadialGradient(
      this.centerX,
      this.centerY - 20,
      1,
      this.centerX,
      this.centerY - 20,
      this.orbRadius * 2 + pulse
    );

    gradient.addColorStop(0, "#ffffff");
    gradient.addColorStop(0.35, "#fff9d9");
    gradient.addColorStop(0.7, "#ffdc75");
    gradient.addColorStop(1, "rgba(255, 200, 70, 0)");

    context.globalAlpha = 1;
    context.fillStyle = gradient;
    context.shadowBlur = 20;
    context.shadowColor = "#fff1a8";

    context.beginPath();
    context.arc(
      this.centerX,
      this.centerY - 20,
      this.orbRadius * 2 + pulse,
      0,
      Math.PI * 2
    );
    context.fill();

    context.fillStyle = "#ffffff";
    context.beginPath();
    context.arc(
      this.centerX,
      this.centerY - 20,
      Math.max(2, this.orbRadius * 0.45),
      0,
      Math.PI * 2
    );
    context.fill();
  }

  drawRays(context) {
    context.save();
    context.translate(this.centerX, this.centerY - 20);

    context.globalAlpha = this.rayAlpha;
    context.strokeStyle = "#fff2b5";
    context.shadowBlur = 12;
    context.shadowColor = "#ffe17d";

    this.rays.forEach((ray) => {
      const innerRadius = this.orbRadius * 1.2;
      const outerRadius = innerRadius + ray.length;

      context.lineWidth = ray.width;
      context.beginPath();
      context.moveTo(
        Math.cos(ray.angle) * innerRadius,
        Math.sin(ray.angle) * innerRadius
      );
      context.lineTo(
        Math.cos(ray.angle) * outerRadius,
        Math.sin(ray.angle) * outerRadius
      );
      context.stroke();
    });

    context.restore();
  }

  drawParticles(context) {
    this.particles.forEach((particle) => {
      const x = this.centerX + Math.cos(particle.angle) * particle.distance;

      const y =
        this.centerY - 20 + Math.sin(particle.angle) * particle.distance;

      context.globalAlpha = particle.alpha;
      context.fillStyle = "#fff1b5";
      context.shadowBlur = 10;
      context.shadowColor = "#ffd75e";

      context.beginPath();
      context.arc(x, y, particle.size, 0, Math.PI * 2);
      context.fill();
    });
  }

  drawFullFlash(context) {
    // L'écran entier est envahi par la lumière.
    context.globalAlpha = this.flashAlpha;
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

    // Halo doré au centre de l'éblouissement.
    const gradient = context.createRadialGradient(
      this.targetX,
      this.targetY,
      2,
      this.targetX,
      this.targetY,
      110
    );

    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.5, "rgba(255, 248, 210, 0.8)");
    gradient.addColorStop(1, "rgba(255, 218, 110, 0)");

    context.globalAlpha = this.flashAlpha;
    context.fillStyle = gradient;
    context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
  }

  drawAfterglow(context) {
    context.globalAlpha = this.afterglowAlpha;

    const gradient = context.createRadialGradient(
      this.targetX,
      this.targetY,
      2,
      this.targetX,
      this.targetY,
      85
    );

    gradient.addColorStop(0, "rgba(255,255,255,0.9)");
    gradient.addColorStop(0.4, "rgba(255,237,170,0.5)");
    gradient.addColorStop(1, "rgba(255,210,100,0)");

    context.fillStyle = gradient;
    context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

    // Quelques étoiles résiduelles.
    context.fillStyle = "#fff3c4";
    context.shadowBlur = 12;
    context.shadowColor = "#ffe28a";

    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI * 2 * i) / 6;
      const distance = 25 + this.timer * 1.5;

      const x = this.targetX + Math.cos(angle) * distance;
      const y = this.targetY + Math.sin(angle) * distance;

      const size = 2 + Math.sin(this.timer * 0.4 + i) * 1.2;

      context.globalAlpha = this.afterglowAlpha;
      context.beginPath();
      context.arc(x, y, Math.max(0.5, size), 0, Math.PI * 2);
      context.fill();
    }
  }
}
