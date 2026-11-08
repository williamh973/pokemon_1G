export class WingAttackAnimation {
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

    this.sprite = this.pokemonViewer.sprite;

    this.originalX = this.sprite.position.x;
    this.originalY = this.sprite.position.y;

    this.attackerX = this.originalX + this.sprite.frameWidth / 2;

    this.attackerY = this.originalY + this.sprite.frameHeight / 2;

    this.targetX =
      this.targetViewer.sprite.position.x +
      this.targetViewer.sprite.frameWidth / 2;

    this.targetY =
      this.targetViewer.sprite.position.y +
      this.targetViewer.sprite.frameHeight / 2;

    this.direction = this.attackerX < this.targetX ? 1 : -1;

    this.distance = 0;
    this.wingAngle = 0;
    this.slashProgress = 0;
    this.impactOpacity = 0;

    this.windParticles = [];
    this.impactParticles = [];

    this.slashes = [
      {
        offsetY: -13,
        radius: 25,
        rotation: -0.55,
        width: 4,
      },
      {
        offsetY: 8,
        radius: 34,
        rotation: 0.45,
        width: 5,
      },
    ];
  }

  update(context) {
    this.timer++;

    switch (this.phase) {
      case "PREPARE":
        this.updatePrepare();
        break;

      case "ATTACK":
        this.updateAttack();
        break;

      case "IMPACT":
        this.updateImpact();
        break;

      case "RECOVER":
        this.updateRecover();
        break;
    }

    this.updateParticles();

    this.draw(context);
  }

  updatePrepare() {
    this.wingAngle = Math.sin(this.timer * 0.5) * 0.15;
    this.distance = -3;

    if (this.timer >= 7) {
      this.timer = 0;
      this.phase = "ATTACK";
    }
  }

  updateAttack() {
    const progress = Math.min(1, this.timer / 9);

    // Accélération de l'attaque
    const eased = 1 - Math.pow(1 - progress, 3);

    this.distance = 38 * eased;

    this.wingAngle = -0.9 + progress * 1.8;
    this.slashProgress = progress;

    this.createWindParticles();

    if (this.timer >= 9) {
      this.timer = 0;
      this.phase = "IMPACT";

      this.createImpactParticles();

      if (this.game.canvas?.startShake) {
        this.game.canvas.startShake(9, 3);
      }
    }
  }

  updateImpact() {
    this.distance = 38;
    this.wingAngle = 0.9;

    this.impactOpacity = Math.max(0, 1 - this.timer / 11);

    this.slashProgress = 1;

    if (this.timer >= 11) {
      this.timer = 0;
      this.phase = "RECOVER";
    }
  }

  updateRecover() {
    const progress = Math.min(1, this.timer / 8);

    const eased = progress * progress * (3 - 2 * progress);

    this.distance = 38 * (1 - eased);
    this.wingAngle = 0.9 * (1 - eased);

    if (this.timer >= 8) {
      this.sprite.position.x = this.originalX;
      this.sprite.position.y = this.originalY;

      this.isFinished = true;
    }
  }

  createWindParticles() {
    if (Math.random() > 0.6) return;

    const x = this.attackerX + this.direction * this.distance * 0.7;

    const y = this.attackerY + (Math.random() - 0.5) * 35;

    this.windParticles.push({
      x,
      y,
      vx: this.direction * (2 + Math.random() * 3),
      vy: (Math.random() - 0.5) * 3,
      radius: 2 + Math.random() * 3,
      life: 12 + Math.random() * 8,
      maxLife: 20,
    });
  }

  createImpactParticles() {
    for (let i = 0; i < 18; i++) {
      const angle = (Math.PI * 2 * i) / 18;
      const speed = 2 + Math.random() * 4;

      this.impactParticles.push({
        x: this.targetX,
        y: this.targetY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 2 + Math.random() * 3,
        life: 13 + Math.random() * 8,
        maxLife: 21,
      });
    }
  }

  updateParticles() {
    this.windParticles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      particle.vx *= 0.94;
      particle.vy *= 0.94;

      particle.life--;
    });

    this.windParticles = this.windParticles.filter(
      (particle) => particle.life > 0
    );

    this.impactParticles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      particle.vx *= 0.93;
      particle.vy *= 0.93;

      particle.life--;
    });

    this.impactParticles = this.impactParticles.filter(
      (particle) => particle.life > 0
    );
  }

  draw(context) {
    // Déplacement temporaire de l'attaquant
    this.sprite.position.x = this.originalX + this.direction * this.distance;

    this.sprite.position.y = this.originalY;

    if (this.phase === "PREPARE") {
      this.drawPreparation(context);
    }

    if (this.phase === "ATTACK" || this.phase === "IMPACT") {
      this.drawWingSweep(context);
    }

    if (this.phase === "IMPACT") {
      this.drawImpact(context);
    }

    this.drawWindParticles(context);
    this.drawImpactParticles(context);
  }

  drawPreparation(context) {
    context.save();

    const x = this.attackerX;
    const y = this.attackerY;

    // Courants d'air autour du Pokémon
    context.globalAlpha = (this.timer / 7) * 0.6;

    for (let i = 0; i < 3; i++) {
      const offset = i * 9;

      context.strokeStyle = "#c9f3ff";
      context.lineWidth = 2;
      context.lineCap = "round";

      context.beginPath();

      context.ellipse(
        x,
        y + offset - 9,
        18 + i * 5,
        5,
        -0.25,
        Math.PI,
        Math.PI * 2
      );

      context.stroke();
    }

    context.restore();
  }

  drawWingSweep(context) {
    const progress = this.slashProgress;

    const centerX = this.attackerX + this.direction * (this.distance + 15);

    const centerY = this.attackerY - 3;

    context.save();

    this.slashes.forEach((slash, index) => {
      const radius = slash.radius * (0.5 + progress * 0.7);

      const rotation = slash.rotation + (this.direction === -1 ? Math.PI : 0);

      context.globalAlpha = Math.min(1, progress * 1.5);

      // Arc principal de l'aile
      context.beginPath();

      context.arc(
        centerX,
        centerY + slash.offsetY,
        radius,
        rotation,
        rotation + Math.PI * 0.85
      );

      context.strokeStyle = index === 0 ? "#ffffff" : "#8be6ff";

      context.lineWidth = slash.width;
      context.lineCap = "round";
      context.stroke();

      // Reflet intérieur
      context.beginPath();

      context.arc(
        centerX,
        centerY + slash.offsetY,
        radius * 0.72,
        rotation + 0.1,
        rotation + Math.PI * 0.65
      );

      context.strokeStyle = "rgba(255,255,255,0.7)";
      context.lineWidth = 2;
      context.stroke();
    });

    // Traits de vitesse
    for (let i = 0; i < 4; i++) {
      const y = centerY - 18 + i * 12;

      context.strokeStyle = "rgba(210,245,255,0.8)";
      context.lineWidth = 2;

      context.beginPath();

      context.moveTo(centerX - this.direction * (20 + i * 4), y);

      context.lineTo(centerX - this.direction * (5 + i * 3), y - 3);

      context.stroke();
    }

    context.restore();
  }

  drawImpact(context) {
    const progress = this.timer / 11;
    const radius = 13 + progress * 18;

    context.save();

    context.globalAlpha = this.impactOpacity;

    // Cercle de choc
    context.strokeStyle = "#ffffff";
    context.lineWidth = 3;

    context.beginPath();
    context.arc(this.targetX, this.targetY, radius, 0, Math.PI * 2);
    context.stroke();

    // Éclats en croix
    context.strokeStyle = "#a5eaff";
    context.lineWidth = 3;
    context.lineCap = "round";

    const directions = [
      [-1, -1],
      [1, -1],
      [-1, 1],
      [1, 1],
    ];

    directions.forEach(([dx, dy]) => {
      context.beginPath();

      context.moveTo(this.targetX + dx * 5, this.targetY + dy * 5);

      context.lineTo(this.targetX + dx * radius, this.targetY + dy * radius);

      context.stroke();
    });

    context.restore();
  }

  drawWindParticles(context) {
    this.windParticles.forEach((particle) => {
      context.save();

      context.globalAlpha = particle.life / particle.maxLife;
      context.fillStyle = "#d8f7ff";

      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);

      context.fill();

      context.restore();
    });
  }

  drawImpactParticles(context) {
    this.impactParticles.forEach((particle) => {
      context.save();

      context.globalAlpha = particle.life / particle.maxLife;
      context.fillStyle = "#ffffff";

      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);

      context.fill();

      context.restore();
    });
  }
}
