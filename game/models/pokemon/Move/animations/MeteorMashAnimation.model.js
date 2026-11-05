export class MeteorMashAnimation {
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

    this.phase = "PREPARE";
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
      this.targetViewer.sprite.frameHeight;

    this.direction = this.attackerX < this.targetX ? 1 : -1;

    this.originalTargetX = this.targetViewer.sprite.position.x;
    this.originalTargetY = this.targetViewer.sprite.position.y;

    this.punchX = this.targetX;
    this.punchY = this.targetY;

    this.meteor = {
      x: this.targetX + 45,
      y: -100,
      radius: 15,
      rotation: 0,
      scale: 0.5,
    };

    this.meteorStartX = this.meteor.x;
    this.meteorStartY = this.meteor.y;

    this.meteorEndX = this.targetX;
    this.meteorEndY = this.targetY - 5;

    this.punchProgress = 0;
    this.punchImpactRadius = 0;
    this.punchFlash = 0;

    this.meteorTrail = [];
    this.particles = [];
    this.rockFragments = [];
    this.shockwaves = [];
    this.sparks = [];

    this.explosionRadius = 0;
    this.explosionOpacity = 0;
    this.flashOpacity = 0;
    this.smokeOpacity = 0;

    this.shakeStarted = false;
  }

  update(context) {
    this.timer++;

    switch (this.phase) {
      case "PREPARE":
        this.updatePrepare();
        break;

      case "PUNCH":
        this.updatePunch();
        break;

      case "SUMMON":
        this.updateSummon();
        break;

      case "METEOR":
        this.updateMeteor();
        break;

      case "IMPACT":
        this.updateImpact();
        break;

      case "FINISH":
        this.updateFinish();
        break;
    }

    this.updateParticles();
    this.draw(context);
  }

  updatePrepare() {
    if (this.timer >= 18) {
      this.timer = 0;
      this.phase = "PUNCH";
    }
  }

  updatePunch() {
    this.punchProgress = Math.min(this.timer / 12, 1);

    this.punchImpactRadius = this.punchProgress * 18;

    if (this.timer >= 12) {
      this.createPunchImpact();
      this.timer = 0;
      this.phase = "SUMMON";
    }
  }

  updateSummon() {
    this.punchFlash = Math.max(0, this.punchFlash - 0.08);

    if (this.timer >= 22) {
      this.timer = 0;
      this.phase = "METEOR";
    }
  }

  updateMeteor() {
    const progress = Math.min(this.timer / 35, 1);
    const eased = progress * progress;

    this.meteor.x =
      this.meteorStartX + (this.meteorEndX - this.meteorStartX) * eased;

    this.meteor.y =
      this.meteorStartY + (this.meteorEndY - this.meteorStartY) * eased;

    this.meteor.scale = 0.5 + progress * 1.5;
    this.meteor.radius = 15 + progress * 15;
    this.meteor.rotation += 0.16;

    if (this.timer % 2 === 0) {
      this.createMeteorTrail();
    }

    if (this.timer >= 35) {
      this.timer = 0;
      this.phase = "IMPACT";
      this.createMeteorImpact();
    }
  }

  updateImpact() {
    this.explosionRadius += 5;
    this.explosionOpacity = Math.max(0, this.explosionOpacity - 0.025);

    this.flashOpacity = Math.max(0, this.flashOpacity - 0.055);
    this.smokeOpacity = Math.min(0.65, this.smokeOpacity + 0.025);

    this.targetViewer.sprite.position.x =
      this.originalTargetX + (Math.random() - 0.5) * 5;

    this.targetViewer.sprite.position.y =
      this.originalTargetY + (Math.random() - 0.5) * 5;

    if (this.timer >= 30) {
      this.targetViewer.sprite.position.x = this.originalTargetX;
      this.targetViewer.sprite.position.y = this.originalTargetY;

      this.timer = 0;
      this.phase = "FINISH";
    }
  }

  updateFinish() {
    this.smokeOpacity = Math.max(0, this.smokeOpacity - 0.012);
    this.flashOpacity = Math.max(0, this.flashOpacity - 0.04);

    if (this.timer >= 40) {
      this.targetViewer.sprite.position.x = this.originalTargetX;
      this.targetViewer.sprite.position.y = this.originalTargetY;
      this.isFinished = true;
    }
  }

  createPunchImpact() {
    this.punchFlash = 0.8;
    this.punchImpactRadius = 22;

    this.createSparks(this.punchX, this.punchY, 14, "#ffe58a");

    if (this.game.canvas?.startShake) {
      this.game.canvas.startShake(7, 2);
    }
  }

  createMeteorTrail() {
    this.meteorTrail.push({
      x: this.meteor.x + (Math.random() - 0.5) * 15,
      y: this.meteor.y - 12,
      radius: 5 + Math.random() * 8,
      life: 15 + Math.random() * 10,
      maxLife: 25,
    });
  }

  createMeteorImpact() {
    this.explosionRadius = 10;
    this.explosionOpacity = 1;
    this.flashOpacity = 1;
    this.smokeOpacity = 0;

    this.createShockwave(this.targetX, this.targetY, 25);
    this.createShockwave(this.targetX, this.targetY, 15);

    this.createSparks(this.targetX, this.targetY, 35, "#ffb52e");

    this.createSparks(this.targetX, this.targetY, 20, "#ffffff");

    this.createRockFragments();

    if (!this.shakeStarted && this.game.canvas?.startShake) {
      this.game.canvas.startShake(1500, 9);
      this.shakeStarted = true;
    }
  }

  createShockwave(x, y, speed) {
    this.shockwaves.push({
      x,
      y,
      radius: 5,
      speed,
      opacity: 1,
      width: 7,
    });
  }

  createSparks(x, y, count, color) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 6;

      this.sparks.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 2 + Math.random() * 4,
        life: 15 + Math.random() * 20,
        maxLife: 35,
        color,
      });
    }
  }

  createRockFragments() {
    for (let i = 0; i < 16; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 5;

      this.rockFragments.push({
        x: this.targetX,
        y: this.targetY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        size: 5 + Math.random() * 10,
        life: 30 + Math.random() * 15,
        maxLife: 45,
      });
    }
  }

  updateParticles() {
    this.meteorTrail.forEach((particle) => {
      particle.life--;
      particle.radius *= 0.96;
    });

    this.meteorTrail = this.meteorTrail.filter((particle) => particle.life > 0);

    this.sparks.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      particle.vx *= 0.96;
      particle.vy *= 0.96;
      particle.vy += 0.08;

      particle.life--;
    });

    this.sparks = this.sparks.filter((particle) => particle.life > 0);

    this.rockFragments.forEach((rock) => {
      rock.x += rock.vx;
      rock.y += rock.vy;

      rock.vx *= 0.97;
      rock.vy += 0.18;

      rock.rotation += rock.rotationSpeed;
      rock.life--;
    });

    this.rockFragments = this.rockFragments.filter((rock) => rock.life > 0);

    this.shockwaves.forEach((wave) => {
      wave.radius += wave.speed;
      wave.opacity -= 0.035;
      wave.width *= 0.97;
    });

    this.shockwaves = this.shockwaves.filter((wave) => wave.opacity > 0);

    this.punchFlash = Math.max(0, this.punchFlash - 0.08);
  }

  draw(context) {
    if (this.phase === "PREPARE") {
      this.drawPreparation(context);
    }

    if (this.phase === "PUNCH") {
      this.drawPunch(context);
    }

    if (this.phase === "SUMMON") {
      this.drawSummon(context);
    }

    if (this.phase === "METEOR") {
      this.drawMeteor(context);
    }

    if (this.phase === "IMPACT" || this.phase === "FINISH") {
      this.drawExplosion(context);
    }

    this.drawMeteorTrail(context);
    this.drawShockwaves(context);
    this.drawRockFragments(context);
    this.drawSparks(context);
    this.drawFlash(context);
  }

  drawPreparation(context) {
    const progress = this.timer / 18;

    context.save();

    const x = this.attackerX;
    const y = this.attackerY;

    context.globalAlpha = 0.4 + progress * 0.5;
    context.strokeStyle = "#ffe08a";
    context.lineWidth = 3;

    context.beginPath();
    context.arc(x, y, 8 + progress * 15, 0, Math.PI * 2);
    context.stroke();

    context.strokeStyle = "#ffffff";
    context.lineWidth = 2;

    context.beginPath();
    context.arc(x, y, 5 + progress * 9, 0, Math.PI * 2);
    context.stroke();

    context.restore();
  }

  drawPunch(context) {
    const progress = this.punchProgress;
    const startX = this.attackerX;
    const startY = this.attackerY;

    const x = startX + (this.targetX - startX) * progress;
    const y = startY + (this.targetY - startY) * progress;

    context.save();

    context.globalAlpha = 0.8;
    context.strokeStyle = "#ffe08a";
    context.lineWidth = 10;
    context.lineCap = "round";

    context.beginPath();
    context.moveTo(x - this.direction * 30, y + 10);
    context.lineTo(x, y);
    context.stroke();

    context.fillStyle = "#fff1a8";

    context.beginPath();
    context.arc(x, y, 9, 0, Math.PI * 2);
    context.fill();

    context.fillStyle = "#ffffff";

    context.beginPath();
    context.arc(x, y, 4, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }

  drawSummon(context) {
    const progress = this.timer / 22;

    context.save();

    const x = this.targetX;
    const y = this.targetY;

    context.globalAlpha = 0.2 + progress * 0.35;
    context.fillStyle = "#fff0a0";

    context.beginPath();
    context.arc(x, y - 30, 25 + progress * 20, 0, Math.PI * 2);
    context.fill();

    context.strokeStyle = "#ffb52e";
    context.lineWidth = 2;

    for (let i = 0; i < 4; i++) {
      const angle = (Math.PI * 2 * i) / 4 + this.timer * 0.08;

      context.beginPath();
      context.moveTo(x + Math.cos(angle) * 25, y - 30 + Math.sin(angle) * 25);
      context.lineTo(x + Math.cos(angle) * 45, y - 30 + Math.sin(angle) * 45);
      context.stroke();
    }

    context.restore();
  }

  drawMeteor(context) {
    context.save();

    context.translate(this.meteor.x, this.meteor.y);
    context.rotate(this.meteor.rotation);
    context.scale(this.meteor.scale, this.meteor.scale);

    // Enveloppe de feu
    const fireGradient = context.createRadialGradient(0, 0, 2, 0, 0, 38);

    fireGradient.addColorStop(0, "#ffffff");
    fireGradient.addColorStop(0.25, "#fff2a1");
    fireGradient.addColorStop(0.55, "#ff9d24");
    fireGradient.addColorStop(1, "rgba(255, 65, 0, 0)");

    context.fillStyle = fireGradient;

    context.beginPath();
    context.arc(0, 0, 38, 0, Math.PI * 2);
    context.fill();

    // Roche métallique
    context.fillStyle = "#6e6260";
    context.strokeStyle = "#e4b85e";
    context.lineWidth = 3;

    context.beginPath();
    context.moveTo(-19, -12);
    context.lineTo(-9, -25);
    context.lineTo(10, -22);
    context.lineTo(22, -8);
    context.lineTo(17, 13);
    context.lineTo(2, 23);
    context.lineTo(-17, 14);
    context.lineTo(-24, 0);
    context.closePath();

    context.fill();
    context.stroke();

    // Reflets métalliques
    context.fillStyle = "#c9a66b";

    context.beginPath();
    context.moveTo(-9, -20);
    context.lineTo(8, -18);
    context.lineTo(16, -7);
    context.lineTo(0, -3);
    context.lineTo(-14, -8);
    context.closePath();
    context.fill();

    context.fillStyle = "#fff0a8";

    context.beginPath();
    context.arc(-8, -9, 3, 0, Math.PI * 2);
    context.fill();

    context.restore();

    // Traînée derrière le météore
    context.save();

    context.globalAlpha = 0.65;
    context.strokeStyle = "#ff9d24";
    context.lineWidth = 9;
    context.lineCap = "round";

    context.beginPath();
    context.moveTo(this.meteor.x + 8, this.meteor.y - 15);
    context.lineTo(this.meteor.x - 8, this.meteor.y - 48);
    context.stroke();

    context.restore();
  }

  drawMeteorTrail(context) {
    this.meteorTrail.forEach((particle) => {
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

      gradient.addColorStop(0, "#fff9c0");
      gradient.addColorStop(0.5, "#ff9d24");
      gradient.addColorStop(1, "rgba(255, 65, 0, 0)");

      context.fillStyle = gradient;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fill();

      context.restore();
    });
  }

  drawExplosion(context) {
    context.save();

    // Halo principal
    const gradient = context.createRadialGradient(
      this.targetX,
      this.targetY,
      2,
      this.targetX,
      this.targetY,
      Math.max(1, this.explosionRadius)
    );

    gradient.addColorStop(0, "rgba(255,255,230,0.95)");
    gradient.addColorStop(0.25, "rgba(255,218,105,0.85)");
    gradient.addColorStop(0.55, "rgba(255,125,25,0.55)");
    gradient.addColorStop(1, "rgba(255,50,0,0)");

    context.globalAlpha = this.explosionOpacity;
    context.fillStyle = gradient;

    context.beginPath();
    context.arc(
      this.targetX,
      this.targetY,
      this.explosionRadius,
      0,
      Math.PI * 2
    );
    context.fill();

    // Fumée
    if (this.smokeOpacity > 0) {
      context.globalAlpha = this.smokeOpacity;
      context.fillStyle = "#655d59";

      for (let i = 0; i < 7; i++) {
        const angle = (Math.PI * 2 * i) / 7;

        const x = this.targetX + Math.cos(angle) * (15 + this.timer);

        const y = this.targetY + Math.sin(angle) * (12 + this.timer * 0.5);

        context.beginPath();
        context.arc(x, y, 9 + this.timer * 0.4, 0, Math.PI * 2);
        context.fill();
      }
    }

    context.restore();
  }

  drawShockwaves(context) {
    this.shockwaves.forEach((wave) => {
      context.save();

      context.globalAlpha = Math.max(0, wave.opacity);
      context.strokeStyle = "#ffe49a";
      context.lineWidth = wave.width;

      context.beginPath();
      context.ellipse(
        wave.x,
        wave.y + 8,
        wave.radius,
        wave.radius * 0.35,
        0,
        0,
        Math.PI * 2
      );
      context.stroke();

      context.restore();
    });
  }

  drawRockFragments(context) {
    this.rockFragments.forEach((rock) => {
      context.save();

      context.translate(rock.x, rock.y);
      context.rotate(rock.rotation);

      context.globalAlpha = Math.min(1, rock.life / 12);

      context.fillStyle = "#71665d";
      context.strokeStyle = "#d4a95d";
      context.lineWidth = 1.5;

      context.beginPath();
      context.moveTo(-rock.size, -rock.size * 0.4);
      context.lineTo(0, -rock.size);
      context.lineTo(rock.size, -rock.size * 0.2);
      context.lineTo(rock.size * 0.5, rock.size);
      context.lineTo(-rock.size * 0.7, rock.size * 0.6);
      context.closePath();

      context.fill();
      context.stroke();

      context.restore();
    });
  }

  drawSparks(context) {
    this.sparks.forEach((particle) => {
      context.save();

      context.globalAlpha = Math.max(0, particle.life / particle.maxLife);

      context.fillStyle = particle.color;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fill();

      context.restore();
    });
  }

  drawFlash(context) {
    if (this.flashOpacity <= 0) return;

    context.save();

    context.globalAlpha = this.flashOpacity;
    context.fillStyle = "#fff7d5";

    context.beginPath();
    context.arc(
      this.targetX,
      this.targetY,
      35 + this.timer * 2,
      0,
      Math.PI * 2
    );
    context.fill();

    context.restore();
  }
}
