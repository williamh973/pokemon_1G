export class SurfAnimation {
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

    this.isFinished = false;
    this.phase = "WAVE";
    this.timer = 0;

    this.attackerX =
      this.pokemonViewer.sprite.position.x +
      this.pokemonViewer.sprite.frameWidth / 2;

    this.attackerY =
      this.pokemonViewer.sprite.position.y +
      this.pokemonViewer.sprite.frameHeight / 2;

    this.targetX =
      this.targetViewer.sprite.position.x +
      this.targetViewer.sprite.frameWidth / 2;

    this.targetY =
      this.targetViewer.sprite.position.y +
      this.targetViewer.sprite.frameHeight / 2;

    this.direction = this.attackerX < this.targetX ? 1 : -1;

    this.waveStartX = this.attackerX;
    this.waveEndX = this.targetX;

    this.waveX = this.waveStartX;
    this.waveHeight = 0;
    this.waveWidth = 0;

    this.waveProgress = 0;
    this.impactProgress = 0;

    this.foamParticles = [];
    this.splashParticles = [];
    this.bubbles = [];

    this.flashOpacity = 0;
    this.waterOpacity = 1;

    this.createBubbles();
  }

  update(context) {
    this.timer++;

    switch (this.phase) {
      case "WAVE":
        this.updateWave();
        break;

      case "IMPACT":
        this.updateImpact();
        break;

      case "FINISH":
        this.updateFinish();
        break;
    }

    this.updateParticles();
    this.updateBubbles();

    this.draw(context);
  }

  updateWave() {
    this.waveProgress = Math.min(1, this.waveProgress + 0.025);

    const eased =
      this.waveProgress * this.waveProgress * (3 - 2 * this.waveProgress);

    this.waveX = this.waveStartX + (this.waveEndX - this.waveStartX) * eased;

    this.waveHeight = 85 + Math.sin(this.timer * 0.12) * 8;

    this.createWaveFoam();
    this.updateFoamParticles();

    if (this.waveProgress >= 1) {
      this.timer = 0;
      this.phase = "IMPACT";

      this.impactProgress = 0;
      this.createImpactSplash();

      if (this.game.canvas?.startShake) {
        this.game.canvas.startShake(1500, 6);
      }
    }
  }

  updateImpact() {
    this.impactProgress = Math.min(1, this.timer / 22);

    this.waveHeight = 85 * (1 - this.impactProgress);

    this.createImpactSplash();

    if (this.timer >= 22) {
      this.timer = 0;
      this.phase = "FINISH";
    }
  }

  updateFinish() {
    this.waterOpacity = Math.max(0, this.waterOpacity - 0.025);
    this.flashOpacity = Math.max(0, this.flashOpacity - 0.08);

    if (this.timer >= 45) {
      this.isFinished = true;
    }
  }

  createBubbles() {
    for (let i = 0; i < 24; i++) {
      this.bubbles.push({
        x: this.attackerX + (Math.random() - 0.5) * 35,
        y: this.attackerY + (Math.random() - 0.5) * 35,
        radius: 1 + Math.random() * 4,
        speed: 0.5 + Math.random() * 1.5,
        life: 40 + Math.random() * 30,
      });
    }
  }

  updateBubbles() {
    this.bubbles.forEach((bubble) => {
      bubble.y -= bubble.speed;
      bubble.x += Math.sin(this.timer * 0.08 + bubble.radius) * 0.4;
      bubble.life--;
    });

    this.bubbles = this.bubbles.filter((bubble) => bubble.life > 0);
  }

  createWaveFoam() {
    if (Math.random() > 0.55) return;

    const x = this.waveX + (Math.random() - 0.5) * this.waveWidth;

    const y =
      this.targetY + this.waveHeight * 0.35 + (Math.random() - 0.5) * 15;

    this.foamParticles.push({
      x,
      y,
      vx: -this.direction * (0.5 + Math.random() * 2),
      vy: -1 - Math.random() * 2,
      radius: 1 + Math.random() * 4,
      life: 15 + Math.random() * 12,
      maxLife: 27,
    });
  }

  updateFoamParticles() {
    this.foamParticles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      particle.vy += 0.08;
      particle.life--;
    });

    this.foamParticles = this.foamParticles.filter(
      (particle) => particle.life > 0
    );
  }

  createImpactSplash() {
    if (Math.random() > 0.6) return;

    const count = 3;

    for (let i = 0; i < count; i++) {
      this.splashParticles.push({
        x: this.targetX + (Math.random() - 0.5) * 45,
        y: this.targetY + (Math.random() - 0.5) * 35,
        vx: (Math.random() - 0.5) * 6,
        vy: -2 - Math.random() * 5,
        radius: 2 + Math.random() * 5,
        life: 25 + Math.random() * 15,
        maxLife: 40,
      });
    }
  }

  updateParticles() {
    this.foamParticles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += 0.08;
      particle.life--;
    });

    this.foamParticles = this.foamParticles.filter(
      (particle) => particle.life > 0
    );

    this.splashParticles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      particle.vy += 0.2;
      particle.vx *= 0.98;

      particle.life--;
    });

    this.splashParticles = this.splashParticles.filter(
      (particle) => particle.life > 0
    );
  }

  draw(context) {
    context.save();

    if (this.phase === "PREPARE") {
      this.drawPreparation(context);
    }

    if (this.phase === "WAVE") {
      this.drawWave(context);
    }

    if (this.phase === "IMPACT") {
      this.drawImpact(context);
    }

    if (this.phase === "FINISH") {
      this.drawAftermath(context);
    }

    this.drawBubbles(context);
    this.drawFoamParticles(context);
    this.drawSplashParticles(context);

    context.restore();
  }

  drawPreparation(context) {
    const x = this.attackerX;
    const y = this.attackerY + 15;

    context.save();

    const gradient = context.createRadialGradient(x, y, 2, x, y, 55);

    gradient.addColorStop(0, "rgba(180,245,255,0.7)");
    gradient.addColorStop(0.5, "rgba(40,160,230,0.4)");
    gradient.addColorStop(1, "rgba(0,100,200,0)");

    context.fillStyle = gradient;

    context.beginPath();
    context.ellipse(x, y, 55, 30, 0, 0, Math.PI * 2);
    context.fill();

    // Eau qui commence à monter
    context.fillStyle = "rgba(55,175,235,0.7)";

    context.beginPath();
    context.ellipse(
      x,
      y + 15,
      35 + this.timer,
      8 + this.timer * 0.5,
      0,
      0,
      Math.PI * 2
    );

    context.fill();

    context.restore();
  }

  drawWave(context) {
    this.drawMainWave(context);
    this.drawWaveHighlights(context);
    this.drawWaveCrest(context);
  }

  drawMainWave(context) {
    const x = this.waveX;
    const y = this.targetY + 25;

    const width = this.waveWidth + 30;
    const height = this.waveHeight;

    context.save();

    context.globalAlpha = this.waterOpacity;

    const gradient = context.createLinearGradient(x, y - height, x, y + height);

    gradient.addColorStop(0, "#b8f5ff");
    gradient.addColorStop(0.18, "#53d4f0");
    gradient.addColorStop(0.55, "#168dcc");
    gradient.addColorStop(1, "#07569f");

    context.fillStyle = gradient;

    context.beginPath();

    context.moveTo(x - this.direction * width, y + height * 0.7);

    context.quadraticCurveTo(
      x - this.direction * width * 0.8,
      y - height * 0.6,
      x,
      y - height
    );

    context.quadraticCurveTo(
      x + this.direction * width * 0.6,
      y - height * 1.1,
      x + this.direction * width,
      y - height * 0.1
    );

    context.quadraticCurveTo(
      x + this.direction * width * 0.7,
      y + height * 0.8,
      x - this.direction * width,
      y + height * 0.7
    );

    context.closePath();
    context.fill();

    context.restore();
  }

  drawWaveHighlights(context) {
    const x = this.waveX;
    const y = this.targetY + 25;
    const width = this.waveWidth + 30;
    const height = this.waveHeight;

    context.save();

    context.globalAlpha = this.waterOpacity * 0.75;
    context.lineWidth = 3;
    context.lineCap = "round";

    for (let i = 0; i < 3; i++) {
      context.strokeStyle = ["#d9fbff", "#8ceaff", "#39bce8"][i];

      context.beginPath();

      context.moveTo(
        x - this.direction * width * 0.7,
        y + height * (0.35 + i * 0.12)
      );

      context.quadraticCurveTo(
        x,
        y + height * (0.1 + i * 0.12),
        x + this.direction * width * 0.7,
        y + height * (0.25 + i * 0.12)
      );

      context.stroke();
    }

    context.restore();
  }

  drawWaveCrest(context) {
    const x = this.waveX;
    const y = this.targetY + 25;
    const width = this.waveWidth + 30;
    const height = this.waveHeight;

    context.save();

    context.strokeStyle = "#efffff";
    context.lineWidth = 6;
    context.lineCap = "round";

    context.beginPath();

    context.moveTo(x - this.direction * width * 0.7, y - height * 0.45);

    context.quadraticCurveTo(
      x,
      y - height * 1.15,
      x + this.direction * width * 0.55,
      y - height * 0.65
    );

    context.stroke();

    // Écume sur la crête
    context.fillStyle = "#ffffff";

    for (let i = 0; i < 8; i++) {
      const foamX = x + this.direction * (i - 4) * width * 0.16;

      const foamY =
        y - height * 0.7 + Math.sin(i * 1.5 + this.timer * 0.15) * 5;

      context.beginPath();
      context.arc(foamX, foamY, 3 + Math.random() * 2, 0, Math.PI * 2);
      context.fill();
    }

    context.restore();
  }

  drawImpact(context) {
    const progress = this.impactProgress;

    // La vague s'écrase sur la cible
    context.save();

    context.globalAlpha = this.waterOpacity;

    const width = 45 + progress * 55;
    const height = 65 * (1 - progress * 0.5);

    const gradient = context.createLinearGradient(
      this.targetX,
      this.targetY - height,
      this.targetX,
      this.targetY + height
    );

    gradient.addColorStop(0, "#efffff");
    gradient.addColorStop(0.3, "#6be0f5");
    gradient.addColorStop(1, "#0877bb");

    context.fillStyle = gradient;

    context.beginPath();

    context.moveTo(this.targetX - width, this.targetY - height * 0.5);

    context.quadraticCurveTo(
      this.targetX,
      this.targetY - height * 1.5,
      this.targetX + width,
      this.targetY - height * 0.3
    );

    context.quadraticCurveTo(
      this.targetX + width * 0.6,
      this.targetY + height,
      this.targetX - width,
      this.targetY + height * 0.6
    );

    context.closePath();
    context.fill();

    context.restore();

    this.drawImpactFoam(context);
  }

  drawImpactFoam(context) {
    const progress = this.impactProgress;

    context.save();

    context.globalAlpha = 1 - progress * 0.3;
    context.fillStyle = "#ffffff";

    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 * i) / 12;

      const radius = 15 + progress * 45;

      const x = this.targetX + Math.cos(angle) * radius;
      const y = this.targetY + Math.sin(angle) * radius * 0.65;

      context.beginPath();
      context.arc(x, y, 3 + Math.random() * 3, 0, Math.PI * 2);

      context.fill();
    }

    context.restore();
  }

  drawAftermath(context) {
    context.save();

    context.globalAlpha = this.waterOpacity;

    const gradient = context.createRadialGradient(
      this.targetX,
      this.targetY,
      3,
      this.targetX,
      this.targetY,
      65
    );

    gradient.addColorStop(0, "rgba(210,250,255,0.8)");
    gradient.addColorStop(0.5, "rgba(60,185,225,0.45)");
    gradient.addColorStop(1, "rgba(20,120,190,0)");

    context.fillStyle = gradient;

    context.beginPath();
    context.ellipse(this.targetX, this.targetY + 15, 65, 35, 0, 0, Math.PI * 2);

    context.fill();

    context.restore();
  }

  drawBubbles(context) {
    this.bubbles.forEach((bubble) => {
      context.save();

      context.globalAlpha = Math.min(1, bubble.life / 15);

      context.strokeStyle = "#e6fcff";
      context.lineWidth = 1.5;

      context.beginPath();
      context.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);

      context.stroke();

      context.fillStyle = "rgba(255,255,255,0.5)";

      context.beginPath();
      context.arc(
        bubble.x - bubble.radius * 0.3,
        bubble.y - bubble.radius * 0.3,
        bubble.radius * 0.25,
        0,
        Math.PI * 2
      );

      context.fill();

      context.restore();
    });
  }

  drawFoamParticles(context) {
    this.foamParticles.forEach((particle) => {
      context.save();

      context.globalAlpha = particle.life / particle.maxLife;
      context.fillStyle = "#eaffff";

      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);

      context.fill();

      context.restore();
    });
  }

  drawSplashParticles(context) {
    this.splashParticles.forEach((particle) => {
      context.save();

      context.globalAlpha = particle.life / particle.maxLife;

      const gradient = context.createRadialGradient(
        particle.x,
        particle.y,
        0,
        particle.x,
        particle.y,
        particle.radius
      );

      gradient.addColorStop(0, "#ffffff");
      gradient.addColorStop(0.5, "#a9efff");
      gradient.addColorStop(1, "#36a9db");

      context.fillStyle = gradient;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);

      context.fill();

      context.restore();
    });
  }
}
