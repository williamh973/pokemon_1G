export class AuroraBeamAnimation {
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

    this.attacker = this.pokemonViewer.sprite;
    this.target = this.targetViewer.sprite;

    this.direction = this.target.position.x > this.attacker.position.x ? 1 : -1;

    this.phase = "CHARGE";
    this.timer = 0;
    this.isFinished = false;

    this.durations = {
      CHARGE: 30,
      WAVE: 80,
      IMPACT: 28,
      DISSIPATE: 35,
    };

    this.colors = ["#50fff0", "#4bdbff", "#8c72ff", "#ec71ff", "#9effc7"];

    this.ribbons = [];
    this.particles = [];
    this.shards = [];

    this.initializeEffect();
  }

  initializeEffect() {
    const attackerWidth = this.attacker.frameWidth * this.attacker.scale;
    const attackerHeight = this.attacker.frameHeight * this.attacker.scale;

    const targetWidth = this.target.frameWidth * this.target.scale;
    const targetHeight = this.target.frameHeight * this.target.scale;

    this.direction === 1
      ? (this.start = {
          x: 0,
          y: 0,
        })
      : (this.start = {
          x: this.game.canvas.width,
          y: this.game.canvas.height - this.game.dialogBox.height,
        });

    this.end = {
      x: this.target.position.x + targetWidth / 2,
      y: this.target.position.y + targetHeight / 2,
    };

    this.distance = Math.abs(this.end.x - this.start.x);

    this.ribbonY = (this.start.y + this.end.y) / 2;

    this.chargeX = this.start.x + this.direction * attackerWidth * 0.45;

    this.impactX = this.end.x - this.direction * targetWidth * 0.15;

    // Rubans lumineux.
    for (let i = 0; i < 5; i++) {
      this.ribbons.push({
        offset: (i - 2) * 12,
        amplitude: 10 + Math.random() * 12,
        frequency: 0.018 + Math.random() * 0.012,
        phase: Math.random() * Math.PI * 2,
        speed: 0.07 + Math.random() * 0.04,
        width: 3 + Math.random() * 3,
        color: this.colors[i],
      });
    }

    // Particules scintillantes.
    for (let i = 0; i < 65; i++) {
      this.particles.push({
        x: this.chargeX,
        y: this.ribbonY,
        offsetX: (Math.random() - 0.5) * 40,
        offsetY: (Math.random() - 0.5) * 50,
        size: 1 + Math.random() * 3,
        speed: 0.8 + Math.random() * 2,
        angle: Math.random() * Math.PI * 2,
        alpha: 0.3 + Math.random() * 0.7,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
      });
    }

    // Éclats lumineux à l'impact.
    for (let i = 0; i < 45; i++) {
      this.shards.push({
        angle: Math.random() * Math.PI * 2,
        speed: 1.5 + Math.random() * 5,
        size: 2 + Math.random() * 4,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        alpha: 1,
        x: this.impactX,
        y: this.ribbonY,
      });
    }
  }

  update(context) {
    if (this.isFinished) return;

    this.timer++;

    switch (this.phase) {
      case "CHARGE":
        this.updateCharge();
        break;

      case "WAVE":
        this.updateWave();
        break;

      case "IMPACT":
        this.updateImpact();
        break;

      case "DISSIPATE":
        this.updateDissipate();
        break;
    }

    this.draw(context);
  }

  updateCharge() {
    this.updateChargeParticles();

    if (this.timer >= this.durations.CHARGE) {
      this.nextPhase("WAVE");
    }
  }

  updateWave() {
    this.updateRibbons();
    this.updateTravelParticles();

    if (this.timer >= this.durations.WAVE) {
      this.nextPhase("IMPACT");

      if (this.game.canvas?.startShake) {
        this.game.canvas.startShake(16, 6);
      }
    }
  }

  updateImpact() {
    this.updateShards();

    if (this.timer >= this.durations.IMPACT) {
      this.nextPhase("DISSIPATE");
    }
  }

  updateDissipate() {
    this.updateShards();
    this.updateTravelParticles();

    if (this.timer >= this.durations.DISSIPATE) {
      this.isFinished = true;
    }
  }

  nextPhase(phase) {
    this.phase = phase;
    this.timer = 0;
  }

  updateChargeParticles() {
    this.particles.forEach((particle) => {
      particle.angle += 0.06;
      particle.offsetX *= 0.96;
      particle.offsetY *= 0.96;
    });
  }

  updateRibbons() {
    this.ribbons.forEach((ribbon) => {
      ribbon.phase += ribbon.speed;
    });
  }

  updateTravelParticles() {
    this.particles.forEach((particle) => {
      particle.x += this.direction * particle.speed;
      particle.y += Math.sin(particle.angle) * 0.8;
      particle.angle += 0.08;
    });
  }

  updateShards() {
    this.shards.forEach((shard) => {
      shard.x += Math.cos(shard.angle) * shard.speed;
      shard.y += Math.sin(shard.angle) * shard.speed;
      shard.speed *= 0.94;
      shard.alpha *= 0.94;
    });
  }

  getProgress() {
    return Math.min(this.timer / this.durations[this.phase], 1);
  }

  draw(context) {
    context.save();

    switch (this.phase) {
      case "CHARGE":
        this.drawCharge(context);
        break;

      case "WAVE":
        this.drawWave(context);
        break;

      case "IMPACT":
        this.drawImpact(context);
        break;

      case "DISSIPATE":
        this.drawDissipate(context);
        break;
    }

    context.restore();
  }

  drawCharge(context) {
    const progress = this.getProgress();

    const radius = 5 + progress * 18;
    const pulse = 0.75 + Math.sin(this.timer * 0.3) * 0.25;

    const gradient = context.createRadialGradient(
      this.chargeX,
      this.ribbonY,
      1,
      this.chargeX,
      this.ribbonY,
      radius * 2
    );

    gradient.addColorStop(0, "rgba(255, 255, 255, 0.95)");
    gradient.addColorStop(0.3, "rgba(80, 255, 240, 0.8)");
    gradient.addColorStop(0.65, "rgba(140, 100, 255, 0.35)");
    gradient.addColorStop(1, "rgba(140, 100, 255, 0)");

    context.fillStyle = gradient;

    context.beginPath();
    context.arc(this.chargeX, this.ribbonY, radius * 2, 0, Math.PI * 2);
    context.fill();

    context.strokeStyle = `rgba(220, 255, 255, ${pulse})`;
    context.lineWidth = 2;
    context.shadowColor = "#66eaff";
    context.shadowBlur = 15;

    context.beginPath();
    context.arc(this.chargeX, this.ribbonY, radius * pulse, 0, Math.PI * 2);
    context.stroke();

    this.particles.forEach((particle) => {
      const x =
        this.chargeX + Math.cos(particle.angle) * (radius + particle.offsetX);

      const y =
        this.ribbonY + Math.sin(particle.angle) * (radius + particle.offsetY);

      context.fillStyle = particle.color;
      context.globalAlpha = particle.alpha;

      context.beginPath();
      context.arc(x, y, particle.size, 0, Math.PI * 2);
      context.fill();
    });

    context.globalAlpha = 1;
    context.shadowBlur = 0;
  }

  drawWave(context) {
    const progress = this.getProgress();

    const frontX = this.start.x + (this.end.x - this.start.x) * progress;

    const trailLength = this.distance * 0.8;

    // Lueur générale de la vague.
    const glow = context.createLinearGradient(
      this.start.x,
      this.ribbonY,
      frontX,
      this.ribbonY
    );

    glow.addColorStop(0, "rgba(80, 255, 240, 0)");
    glow.addColorStop(0.5, "rgba(100, 170, 255, 0.12)");
    glow.addColorStop(1, "rgba(255, 255, 255, 0.4)");

    context.fillStyle = glow;

    context.beginPath();
    context.ellipse(
      (this.start.x + frontX) / 2,
      this.ribbonY,
      Math.max(1, (trailLength * progress) / 2),
      48,
      0,
      0,
      Math.PI * 2
    );
    context.fill();

    // Rubans ondulants.
    this.ribbons.forEach((ribbon) => {
      context.beginPath();

      const steps = 40;

      for (let i = 0; i <= steps; i++) {
        const ratio = i / steps;
        const x = this.start.x + (frontX - this.start.x) * ratio;

        const y =
          this.ribbonY +
          ribbon.offset +
          Math.sin(ratio * Math.PI * 5 + ribbon.phase) * ribbon.amplitude;

        if (i === 0) {
          context.moveTo(x, y);
        } else {
          context.lineTo(x, y);
        }
      }

      context.strokeStyle = ribbon.color;
      context.lineWidth = ribbon.width;
      context.lineCap = "round";
      context.lineJoin = "round";
      context.shadowColor = ribbon.color;
      context.shadowBlur = 14;
      context.globalAlpha = 0.9;

      context.stroke();
    });

    context.globalAlpha = 1;
    context.shadowBlur = 0;

    // Noyau blanc lumineux de la vague.
    const coreGradient = context.createLinearGradient(
      this.start.x,
      this.ribbonY,
      frontX,
      this.ribbonY
    );

    coreGradient.addColorStop(0, "rgba(255,255,255,0)");
    coreGradient.addColorStop(1, "rgba(255,255,255,0.85)");

    context.strokeStyle = coreGradient;
    context.lineWidth = 2;
    context.shadowColor = "#ffffff";
    context.shadowBlur = 12;

    context.beginPath();
    context.moveTo(this.start.x, this.ribbonY);
    context.lineTo(frontX, this.ribbonY);
    context.stroke();

    context.shadowBlur = 0;

    this.drawTravelParticles(context);
  }

  drawTravelParticles(context) {
    this.particles.forEach((particle) => {
      const progress = Math.abs(particle.x - this.start.x) / this.distance;

      if (progress < 0 || progress > 1.1) return;

      context.fillStyle = particle.color;
      context.globalAlpha = particle.alpha * 0.8;
      context.shadowColor = particle.color;
      context.shadowBlur = 8;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fill();
    });

    context.globalAlpha = 1;
    context.shadowBlur = 0;
  }

  drawImpact(context) {
    const progress = this.getProgress();
    const radius = 12 + progress * 65;
    const alpha = 1 - progress;

    // Flash central.
    const flash = context.createRadialGradient(
      this.impactX,
      this.ribbonY,
      1,
      this.impactX,
      this.ribbonY,
      radius
    );

    flash.addColorStop(0, `rgba(255,255,255,${alpha})`);
    flash.addColorStop(0.35, `rgba(110,255,245,${alpha * 0.7})`);
    flash.addColorStop(0.7, `rgba(180,110,255,${alpha * 0.3})`);
    flash.addColorStop(1, "rgba(180,110,255,0)");

    context.fillStyle = flash;

    context.beginPath();
    context.arc(this.impactX, this.ribbonY, radius, 0, Math.PI * 2);
    context.fill();

    // Onde circulaire.
    context.strokeStyle = `rgba(180, 245, 255, ${alpha})`;
    context.lineWidth = 4 * alpha;
    context.shadowColor = "#8cfaff";
    context.shadowBlur = 15;

    context.beginPath();
    context.ellipse(
      this.impactX,
      this.ribbonY,
      radius,
      radius * 0.55,
      0,
      0,
      Math.PI * 2
    );
    context.stroke();

    context.shadowBlur = 0;

    this.drawShards(context);
  }

  drawShards(context) {
    this.shards.forEach((shard) => {
      if (shard.alpha <= 0.02) return;

      context.save();

      context.translate(shard.x, shard.y);
      context.rotate(shard.angle);

      context.fillStyle = shard.color;
      context.globalAlpha = shard.alpha;
      context.shadowColor = shard.color;
      context.shadowBlur = 10;

      context.beginPath();
      context.moveTo(0, -shard.size * 2);
      context.lineTo(shard.size, 0);
      context.lineTo(0, shard.size * 2);
      context.lineTo(-shard.size, 0);
      context.closePath();
      context.fill();

      context.restore();
    });
  }

  drawDissipate(context) {
    const progress = this.getProgress();
    const alpha = 1 - progress;

    this.drawShards(context);

    this.particles.forEach((particle) => {
      const y = particle.y - progress * 35;

      context.fillStyle = particle.color;
      context.globalAlpha = particle.alpha * alpha;

      context.beginPath();
      context.arc(particle.x, y, particle.size * alpha, 0, Math.PI * 2);
      context.fill();
    });

    context.globalAlpha = 1;
  }
}
