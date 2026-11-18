export class SlamAnimation {
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

    this.attackerOriginalPosition = {
      x: this.attacker.position.x,
      y: this.attacker.position.y,
    };

    this.targetOriginalPosition = {
      x: this.target.position.x,
      y: this.target.position.y,
    };

    this.attackerCenterX =
      this.attacker.position.x + this.attacker.frameWidth / 2;

    this.attackerCenterY =
      this.attacker.position.y + this.attacker.frameHeight / 2;

    this.targetCenterX = this.target.position.x + this.target.frameWidth / 2;

    this.targetCenterY = this.target.position.y + this.target.frameHeight / 2;

    this.direction = this.targetCenterX >= this.attackerCenterX ? 1 : -1;

    this.frame = 0;
    this.phase = "PREPARE";
    this.isFinished = false;

    this.duration = {
      PREPARE: 10,
      CHARGE: 12,
      SLAM: 8,
      IMPACT: 24,
      RETURN: 14,
    };

    this.totalDuration = Object.values(this.duration).reduce(
      (total, value) => total + value,
      0
    );

    this.attackerOffset = { x: 0, y: 0 };
    this.targetOffset = { x: 0, y: 0 };

    this.impact = {
      alpha: 0,
      rings: [],
      particles: [],
      debris: [],
      cracks: [],
    };

    this.shakeTriggered = false;
  }

  easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  easeInCubic(t) {
    return t * t * t;
  }

  update(context) {
    if (this.isFinished) return;

    this.frame++;

    switch (this.phase) {
      case "PREPARE":
        this.updatePrepare();
        break;

      case "CHARGE":
        this.updateCharge();
        break;

      case "SLAM":
        this.updateSlam();
        break;

      case "IMPACT":
        this.updateImpact();
        break;

      case "RETURN":
        this.updateReturn();
        break;
    }

    this.applySpritePositions();
    this.draw(context);
  }

  applySpritePositions() {
    this.attacker.position.x =
      this.attackerOriginalPosition.x + this.attackerOffset.x;

    this.attacker.position.y =
      this.attackerOriginalPosition.y + this.attackerOffset.y;

    this.target.position.x =
      this.targetOriginalPosition.x + this.targetOffset.x;

    this.target.position.y =
      this.targetOriginalPosition.y + this.targetOffset.y;
  }

  updatePrepare() {
    const progress = Math.min(this.frame / this.duration.PREPARE, 1);

    const crouch = Math.sin((progress * Math.PI) / 2);

    this.attackerOffset.y = crouch * 7;
    this.attackerOffset.x = -this.direction * crouch * 5;

    if (progress >= 1) {
      this.phase = "CHARGE";
      this.frame = 0;
    }
  }

  updateCharge() {
    const progress = Math.min(this.frame / this.duration.CHARGE, 1);

    const movement = this.easeInCubic(progress);

    const distance = 29;

    this.attackerOffset.x =
      -this.direction * 5 + this.direction * distance * movement;

    this.attackerOffset.y = 7 - movement * 9;

    if (progress >= 1) {
      this.phase = "SLAM";
      this.frame = 0;
      this.createImpact();
    }
  }

  updateSlam() {
    const progress = Math.min(this.frame / this.duration.SLAM, 1);

    const movement = this.easeInCubic(progress);

    // L'attaquant termine sa course vers l'adversaire.
    this.attackerOffset.x = this.direction * (29 + movement * 8);

    this.attackerOffset.y = -2 + movement * 8;

    // La cible est violemment projetée vers le bas.
    this.targetOffset.x = this.direction * movement * 9;

    this.targetOffset.y = movement * 19;

    if (progress >= 1) {
      this.phase = "IMPACT";
      this.frame = 0;
      this.triggerImpact();
    }
  }

  updateImpact() {
    const progress = Math.min(this.frame / this.duration.IMPACT, 1);

    const decay = 1 - this.easeOutCubic(progress);

    // La cible rebondit légèrement après le choc.
    this.targetOffset.y = 19 - Math.sin(progress * Math.PI * 2) * 5 * decay;

    this.targetOffset.x = this.direction * 9 * decay;

    // L'attaquant reste au contact pendant le choc.
    this.attackerOffset.y = 6 + Math.sin(this.frame * 0.8) * 1.5;

    this.impact.alpha = decay;

    this.updateRings();
    this.updateParticles();
    this.updateDebris();

    if (progress >= 1) {
      this.phase = "RETURN";
      this.frame = 0;
    }
  }

  updateReturn() {
    const progress = Math.min(this.frame / this.duration.RETURN, 1);

    const remaining = 1 - this.easeOutCubic(progress);

    this.attackerOffset.x = this.direction * 37 * remaining;
    this.attackerOffset.y = 6 * remaining;

    this.targetOffset.x = this.direction * 9 * remaining;
    this.targetOffset.y = 19 * remaining;

    this.updateParticles();
    this.updateDebris();

    if (progress >= 1) {
      this.attackerOffset = { x: 0, y: 0 };
      this.targetOffset = { x: 0, y: 0 };

      this.applySpritePositions();

      this.attacker.position.x = this.attackerOriginalPosition.x;
      this.attacker.position.y = this.attackerOriginalPosition.y;

      this.target.position.x = this.targetOriginalPosition.x;
      this.target.position.y = this.targetOriginalPosition.y;

      this.isFinished = true;
    }
  }

  createImpact() {
    // Anneaux de choc.
    for (let i = 0; i < 4; i++) {
      this.impact.rings.push({
        radius: 5 + i * 8,
        speed: 3 + i * 0.8,
        alpha: 0.95,
        decay: 0.045,
      });
    }

    // Débris projetés dans toutes les directions.
    for (let i = 0; i < 32; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 4;

      this.impact.debris.push({
        x: this.targetCenterX,
        y: this.targetCenterY + 10,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        radius: 2 + Math.random() * 3,
        alpha: 1,
        gravity: 0.13 + Math.random() * 0.08,
      });
    }

    // Particules lumineuses.
    for (let i = 0; i < 24; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 4;

      this.impact.particles.push({
        x: this.targetCenterX,
        y: this.targetCenterY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 1 + Math.random() * 3,
        alpha: 1,
        decay: 0.035,
        color: Math.random() > 0.5 ? "#ffffff" : "#ffe3a1",
      });
    }

    // Fissures au sol.
    for (let i = 0; i < 9; i++) {
      this.impact.cracks.push({
        angle: ((Math.PI * 2) / 9) * i + Math.random() * 0.2,
        length: 12 + Math.random() * 19,
      });
    }
  }

  triggerImpact() {
    if (this.shakeTriggered) return;

    this.shakeTriggered = true;

    this.game.canvas?.startShake?.(10, 320);
  }

  updateRings() {
    this.impact.rings.forEach((ring) => {
      ring.radius += ring.speed;
      ring.alpha -= ring.decay;
    });

    this.impact.rings = this.impact.rings.filter((ring) => ring.alpha > 0);
  }

  updateParticles() {
    this.impact.particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      particle.vx *= 0.97;
      particle.vy *= 0.97;

      particle.alpha -= particle.decay;
      particle.radius *= 0.99;
    });

    this.impact.particles = this.impact.particles.filter(
      (particle) => particle.alpha > 0
    );
  }

  updateDebris() {
    this.impact.debris.forEach((debris) => {
      debris.x += debris.vx;
      debris.y += debris.vy;

      debris.vy += debris.gravity;
      debris.vx *= 0.98;

      debris.alpha -= 0.025;
    });

    this.impact.debris = this.impact.debris.filter(
      (debris) => debris.alpha > 0
    );
  }

  draw(context) {
    if (this.phase === "IMPACT" || this.phase === "RETURN") {
      this.drawImpact(context);
    }
  }

  drawImpact(context) {
    const centerX = this.targetCenterX + this.targetOffset.x;
    const centerY = this.targetCenterY + this.targetOffset.y;

    context.save();

    // Flash de l'impact.
    if (this.phase === "IMPACT" && this.frame < 5) {
      context.globalAlpha = (1 - this.frame / 5) * 0.65;
      context.fillStyle = "#ffffff";

      context.beginPath();
      context.arc(centerX, centerY, 48, 0, Math.PI * 2);
      context.fill();
    }

    // Onde de choc.
    this.impact.rings.forEach((ring) => {
      context.globalAlpha = ring.alpha;
      context.strokeStyle = "#f6d9a0";
      context.lineWidth = 3;

      context.beginPath();
      context.ellipse(
        centerX,
        centerY + 13,
        ring.radius * 1.5,
        ring.radius * 0.45,
        0,
        0,
        Math.PI * 2
      );
      context.stroke();
    });

    // Fissures.
    context.globalAlpha = this.impact.alpha * 0.9;
    context.strokeStyle = "#8b7257";
    context.lineWidth = 2;

    this.impact.cracks.forEach((crack) => {
      context.save();
      context.translate(centerX, centerY + 17);
      context.rotate(crack.angle);

      context.beginPath();
      context.moveTo(4, 0);
      context.lineTo(crack.length, -2);
      context.lineTo(crack.length + 5, 3);
      context.stroke();

      context.restore();
    });

    // Débris.
    this.impact.debris.forEach((debris) => {
      context.globalAlpha = debris.alpha;
      context.fillStyle = "#aa8962";

      context.beginPath();
      context.arc(debris.x, debris.y, debris.radius, 0, Math.PI * 2);
      context.fill();
    });

    // Particules.
    this.impact.particles.forEach((particle) => {
      context.globalAlpha = particle.alpha;
      context.fillStyle = particle.color;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fill();
    });

    context.restore();
  }
}
