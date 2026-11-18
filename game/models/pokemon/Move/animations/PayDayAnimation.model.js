export class PayDayAnimation {
  static PHASES = {
    PREPARE: 24,
    THROW: 60,
    IMPACT: 32,
    FALL: 24,
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

    this.coins = [];
    this.sparkles = [];
    this.impactParticles = [];

    this.coinCount = 5;
    this.coinInterval = 4;
    this.coinsLaunched = 0;

    this.startPoint = this.getStartPoint();
    this.targetPoint = this.getTargetCenter();

    this.angle = Math.atan2(
      this.targetPoint.y - this.startPoint.y,
      this.targetPoint.x - this.startPoint.x
    );

    this.distance = Math.hypot(
      this.targetPoint.x - this.startPoint.x,
      this.targetPoint.y - this.startPoint.y
    );

    this.perpendicular = {
      x: -Math.sin(this.angle),
      y: Math.cos(this.angle),
    };

    this.createPreparationSparkles();
  }

  update(context) {
    if (this.isFinished) return;

    this.timer++;

    switch (this.phase) {
      case "PREPARE":
        if (this.timer >= PayDayAnimation.PHASES.PREPARE) {
          this.nextPhase("THROW");
        }
        break;

      case "THROW":
        this.launchCoins();
        this.updateCoins();

        if (
          this.coinsLaunched >= this.coinCount &&
          this.coins.every((coin) => coin.finished)
        ) {
          this.createFinalImpact();
          this.nextPhase("IMPACT");
        }
        break;

      case "IMPACT":
        this.updateImpactParticles();

        if (this.timer >= PayDayAnimation.PHASES.IMPACT) {
          this.nextPhase("FALL");
        }
        break;

      case "FALL":
        this.updateImpactParticles();

        if (this.timer >= PayDayAnimation.PHASES.FALL) {
          this.isFinished = true;
        }
        break;
    }

    this.updateSparkles();
    this.draw(context);
  }

  nextPhase(phase) {
    this.phase = phase;
    this.timer = 0;
  }

  getAttackerCenter() {
    return {
      x: this.attacker.position.x + this.attacker.frameWidth / 2,
      y: this.attacker.position.y + this.attacker.frameHeight / 2,
    };
  }

  getTargetCenter() {
    return {
      x: this.target.position.x + this.target.frameWidth / 2,
      y: this.target.position.y + this.target.frameHeight / 2,
    };
  }

  getStartPoint() {
    const center = this.getAttackerCenter();
    const target = this.getTargetCenter();

    const direction = Math.atan2(target.y - center.y, target.x - center.x);

    // La pièce part légèrement devant le Pokémon.
    return {
      x: center.x + Math.cos(direction) * 12,
      y: center.y + Math.sin(direction) * 12 - 5,
    };
  }

  createPreparationSparkles() {
    for (let i = 0; i < 8; i++) {
      const angle = Math.random() * Math.PI * 2;

      this.sparkles.push({
        x: this.startPoint.x,
        y: this.startPoint.y,
        angle,
        radius: 5 + Math.random() * 8,
        speed: 0.08 + Math.random() * 0.08,
        life: 20,
        maxLife: 20,
        size: 1 + Math.random() * 2,
      });
    }
  }

  launchCoins() {
    if (this.coinsLaunched >= this.coinCount) return;

    if (this.timer % this.coinInterval !== 1) return;

    const index = this.coinsLaunched++;

    const spread = (index - (this.coinCount - 1) / 2) * 5;

    this.coins.push({
      x: this.startPoint.x,
      y: this.startPoint.y,
      startX: this.startPoint.x,
      startY: this.startPoint.y,
      progress: 0,
      duration: 15 + Math.random() * 5,
      offset: spread,
      arcHeight: 12 + Math.random() * 12,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: 0.35 + Math.random() * 0.25,
      size: 15 + Math.random() * 1.5,
      finished: false,
      impacted: false,
      bounceTimer: 0,
      bounceHeight: 0,
    });
  }

  updateCoins() {
    for (const coin of this.coins) {
      if (coin.finished) continue;

      if (!coin.impacted) {
        coin.progress += 1 / coin.duration;

        const progress = Math.min(coin.progress, 1);
        const eased = 1 - Math.pow(1 - progress, 2);

        const spreadX = this.perpendicular.x * coin.offset;
        const spreadY = this.perpendicular.y * coin.offset;

        const arc = Math.sin(progress * Math.PI) * coin.arcHeight;

        coin.x =
          coin.startX +
          (this.targetPoint.x - coin.startX) * eased +
          spreadX * progress;

        coin.y =
          coin.startY +
          (this.targetPoint.y - coin.startY) * eased +
          spreadY * progress -
          arc;

        coin.rotation += coin.rotationSpeed;

        if (coin.progress >= 1) {
          this.impactCoin(coin);
        }
      } else {
        coin.bounceTimer++;

        coin.bounceHeight =
          Math.abs(Math.sin(coin.bounceTimer * 0.32)) *
          Math.max(0, 8 - coin.bounceTimer * 0.35);

        coin.x += coin.bounceVX;
        coin.y += coin.bounceVY;

        coin.bounceVX *= 0.88;
        coin.bounceVY *= 0.88;

        coin.rotation += coin.rotationSpeed;

        if (coin.bounceTimer >= 12) {
          coin.finished = true;
        }
      }
    }
  }

  impactCoin(coin) {
    coin.impacted = true;
    coin.bounceTimer = 0;

    coin.bounceVX = this.perpendicular.x * coin.offset * 0.025;
    coin.bounceVY = this.perpendicular.y * coin.offset * 0.025 - 0.7;

    this.createCoinImpact(coin.x, coin.y);

    if (this.game.canvas?.startShake) {
      this.game.canvas.startShake(1.5, 70);
    }
  }

  createCoinImpact(x, y) {
    for (let i = 0; i < 5; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 2;

      this.impactParticles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 12 + Math.random() * 8,
        maxLife: 20,
        size: 1 + Math.random() * 2,
      });
    }
  }

  createFinalImpact() {
    const center = this.getTargetCenter();

    for (let i = 0; i < 14; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 2.5;

      this.impactParticles.push({
        x: center.x,
        y: center.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 18 + Math.random() * 8,
        maxLife: 26,
        size: 1.5 + Math.random() * 2,
      });
    }

    if (this.game.canvas?.startShake) {
      this.game.canvas.startShake(2.5, 120);
    }
  }

  updateSparkles() {
    this.sparkles = this.sparkles.filter((sparkle) => {
      sparkle.angle += sparkle.speed;
      sparkle.life--;

      const radius = sparkle.radius;

      sparkle.x = this.startPoint.x + Math.cos(sparkle.angle) * radius;

      sparkle.y = this.startPoint.y + Math.sin(sparkle.angle) * radius;

      return sparkle.life > 0;
    });
  }

  updateImpactParticles() {
    this.impactParticles = this.impactParticles.filter((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      particle.vx *= 0.94;
      particle.vy *= 0.94;

      particle.life--;

      return particle.life > 0;
    });
  }

  draw(context) {
    this.drawSparkles(context);
    this.drawImpactParticles(context);

    if (this.phase === "PREPARE") {
      this.drawPreparingCoin(context);
    }

    if (this.phase === "THROW") {
      this.drawCoins(context);
    }

    if (this.phase === "IMPACT" || this.phase === "FALL") {
      this.drawCoins(context);
      this.drawFinalSparkles(context);
    }
  }

  drawPreparingCoin(context) {
    const pulse = 1 + Math.sin(this.timer * 0.45) * 0.15;

    context.save();

    context.translate(this.startPoint.x, this.startPoint.y - 8);
    context.rotate(this.timer * 0.18);

    this.drawCoin(context, 6 * pulse);

    context.restore();
  }

  drawCoins(context) {
    for (const coin of this.coins) {
      if (coin.finished) continue;

      context.save();

      context.translate(
        coin.x,
        coin.y - (coin.impacted ? coin.bounceHeight : 0)
      );

      context.rotate(coin.rotation);

      this.drawCoin(context, coin.size);

      context.restore();
    }
  }

  drawCoin(context, size) {
    // Lueur extérieure.
    context.save();

    context.shadowColor = "#ffd43b";
    context.shadowBlur = 9;

    // Épaisseur de la pièce.
    context.fillStyle = "#9c6415";
    context.beginPath();
    context.ellipse(0, 1.5, size, size * 0.9, 0, 0, Math.PI * 2);
    context.fill();

    // Rotation sur l'axe vertical :
    // l'ellipse s'aplatit progressivement.
    const rotationWidth = Math.max(
      0.12,
      Math.abs(Math.cos(context.getTransform().a === 0 ? 0 : 0))
    );

    context.fillStyle = "#f4c542";
    context.beginPath();
    context.ellipse(0, 0, size * 0.88, size * 0.88, 0, 0, Math.PI * 2);
    context.fill();

    // Bord intérieur.
    context.shadowBlur = 0;
    context.strokeStyle = "#fff0a6";
    context.lineWidth = 1;
    context.beginPath();
    context.ellipse(0, 0, size * 0.68, size * 0.68, 0, 0, Math.PI * 2);
    context.stroke();

    // Symbole central.
    context.fillStyle = "#a66b12";
    context.font = `bold ${Math.max(6, size)}px Arial`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText("$", 0, 0.5);

    context.restore();
  }

  drawSparkles(context) {
    context.save();

    for (const sparkle of this.sparkles) {
      context.globalAlpha = sparkle.life / sparkle.maxLife;
      context.fillStyle = "#fff1a8";
      context.shadowColor = "#ffd43b";
      context.shadowBlur = 6;

      context.beginPath();
      context.arc(sparkle.x, sparkle.y, sparkle.size, 0, Math.PI * 2);
      context.fill();
    }

    context.restore();
  }

  drawImpactParticles(context) {
    context.save();

    for (const particle of this.impactParticles) {
      context.globalAlpha = particle.life / particle.maxLife;
      context.fillStyle = "#ffe17a";
      context.shadowColor = "#ffc52b";
      context.shadowBlur = 5;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fill();
    }

    context.restore();
  }

  drawFinalSparkles(context) {
    const center = this.getTargetCenter();
    const alpha = Math.max(0, 1 - this.timer / 20);

    context.save();

    context.globalAlpha = alpha;
    context.strokeStyle = "#ffe68a";
    context.lineWidth = 1.5;
    context.shadowColor = "#ffd43b";
    context.shadowBlur = 7;

    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2 + this.timer * 0.08;
      const x = center.x + Math.cos(angle) * 15;
      const y = center.y + Math.sin(angle) * 12;

      context.beginPath();
      context.moveTo(x - 3, y);
      context.lineTo(x + 3, y);
      context.moveTo(x, y - 3);
      context.lineTo(x, y + 3);
      context.stroke();
    }

    context.restore();
  }
}
