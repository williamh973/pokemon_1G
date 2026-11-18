export class RazorWindAnimation {
  constructor(game, viewers, turnAction) {
    this.game = game;
    this.viewers = viewers;
    this.turnAction = turnAction;

    this.pokemon = turnAction.pokemon;
    this.target = turnAction.target;
    this.move = turnAction.move;

    // --------------------------------------------------
    // VIEWERS
    // --------------------------------------------------

    if (this.viewers.front.slot.content === this.pokemon) {
      this.pokemonViewer = this.viewers.front;
      this.targetViewer = this.viewers.back;
    } else {
      this.pokemonViewer = this.viewers.back;
      this.targetViewer = this.viewers.front;
    }

    this.sprite = this.pokemonViewer.sprite;
    this.targetSprite = this.targetViewer.sprite;

    this.phase = this.pokemon.chargedMove.animationPhase;
    this.isFinished = false;

    this.frame = 0;

    // --------------------------------------------------
    // CANVAS
    // --------------------------------------------------

    this.canvasWidth = this.game.canvas.width;
    this.canvasHeight = this.game.canvas.height;

    // --------------------------------------------------
    // POSITIONS
    // --------------------------------------------------

    this.initialX = this.sprite.position.x;
    this.initialY = this.sprite.position.y;

    this.targetCenterX =
      this.targetSprite.position.x + this.targetSprite.frameWidth / 2;

    this.targetCenterY =
      this.targetSprite.position.y + this.targetSprite.frameHeight / 2;

    this.startCenterX = this.sprite.position.x + this.sprite.frameWidth / 2;

    this.startCenterY = this.sprite.position.y + this.sprite.frameHeight / 2;

    // --------------------------------------------------
    // DIRECTION
    // --------------------------------------------------

    this.direction = this.targetCenterX > this.startCenterX ? 1 : -1;

    this.distanceX = this.targetCenterX - this.startCenterX;

    this.distanceY = this.targetCenterY - this.startCenterY;

    // --------------------------------------------------
    // FIRST PHASE
    // --------------------------------------------------

    this.chargeDuration = 65;

    this.windParticles = [];
    this.windOrbs = [];
    this.chargeRings = [];

    this.chargeProgress = 0;

    // --------------------------------------------------
    // SECOND PHASE
    // --------------------------------------------------

    this.blades = [];
    this.particles = [];
    this.impactRings = [];

    this.bladeSpeed = 11;
    this.bladeSpacing = 7;

    this.bladeCount = 10;
    this.bladesLaunched = 0;

    this.launchInterval = 7;

    this.impactTriggered = false;

    // --------------------------------------------------
    // INITIALISATION
    // --------------------------------------------------

    if (this.phase === "FIRST") {
      this.initializeCharge();
    }

    if (this.phase === "SECOND") {
      this.initializeAttack();
    }
  }

  // --------------------------------------------------
  // HELPERS
  // --------------------------------------------------

  random(min, max) {
    return Math.random() * (max - min) + min;
  }

  easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  easeIn(t) {
    return t * t;
  }

  // --------------------------------------------------
  // INITIALISATION CHARGE
  // --------------------------------------------------

  initializeCharge() {
    for (let i = 0; i < 22; i++) {
      const angle = this.random(0, Math.PI * 2);

      this.windParticles.push({
        angle,
        radius: this.random(18, 38),
        speed: this.random(0.025, 0.065),
        size: this.random(1.5, 3),
        alpha: this.random(0.35, 0.8),
      });
    }

    for (let i = 0; i < 7; i++) {
      this.windOrbs.push({
        angle: (Math.PI * 2 * i) / 7,
        radius: this.random(24, 35),
        speed: this.random(0.04, 0.075),
        size: this.random(2, 4),
      });
    }
  }

  // --------------------------------------------------
  // INITIALISATION ATTAQUE
  // --------------------------------------------------

  initializeAttack() {
    this.blades = [];
    this.bladesLaunched = 0;

    this.launchTimer = 0;

    // La cible sert de point de convergence.
    this.aimX = this.targetCenterX;
    this.aimY = this.targetCenterY;

    // Les lames partent légèrement autour du centre.
    this.bladeOffsets = [
      { x: 0, y: -19, scale: 0.72, delay: 0 },
      { x: 0, y: 0, scale: 1.25, delay: 7 },
      { x: 0, y: 19, scale: 0.72, delay: 14 },
      { x: 0, y: 0, scale: 1.25, delay: 21 },
      { x: 0, y: -19, scale: 0.72, delay: 28 },
      { x: 0, y: 0, scale: 1.25, delay: 35 },
      { x: 0, y: 19, scale: 0.72, delay: 42 },
      { x: 0, y: 0, scale: 1.25, delay: 49 },
      { x: 0, y: -19, scale: 0.72, delay: 56 },
      { x: 0, y: 0, scale: 1.25, delay: 63 },
    ];

    this.attackDuration = 0;
  }

  // --------------------------------------------------
  // UPDATE
  // --------------------------------------------------

  update(context) {
    if (this.isFinished) return;

    switch (this.phase) {
      case "FIRST":
        this.updateCharge();
        this.drawCharge(context);
        break;

      case "SECOND":
        this.updateAttack();
        this.drawAttack(context);
        break;
    }
  }

  // --------------------------------------------------
  // PHASE FIRST : CHARGE
  // --------------------------------------------------

  updateCharge() {
    this.frame++;

    this.chargeProgress = Math.min(this.frame / this.chargeDuration, 1);

    // Rotation des particules.
    this.windParticles.forEach((particle) => {
      particle.angle += particle.speed;

      particle.radius = 38 - this.chargeProgress * 15;
    });

    this.windOrbs.forEach((orb) => {
      orb.angle += orb.speed;

      orb.radius = 34 - this.chargeProgress * 17;
    });

    // Les anneaux apparaissent progressivement.
    if (this.frame % 12 === 0) {
      this.chargeRings.push({
        radius: 8,
        alpha: 0.75,
        speed: 1.5,
      });
    }

    this.chargeRings.forEach((ring) => {
      ring.radius += ring.speed;
      ring.alpha -= 0.025;
    });

    this.chargeRings = this.chargeRings.filter((ring) => ring.alpha > 0);

    if (this.frame >= this.chargeDuration) {
      this.isFinished = true;
    }
  }

  // --------------------------------------------------
  // DRAW CHARGE
  // --------------------------------------------------

  drawCharge(context) {
    const centerX = this.startCenterX;
    const centerY = this.startCenterY;

    context.save();

    // Courants d'air circulaires.
    const intensity = this.chargeProgress;

    for (let i = 0; i < 3; i++) {
      const radius = 28 + i * 9 - intensity * 10;
      const rotation = this.frame * (0.045 + i * 0.012);

      context.save();

      context.translate(centerX, centerY);
      context.rotate(rotation * (i % 2 === 0 ? 1 : -1));

      context.globalAlpha = 0.25 + intensity * 0.3;
      context.strokeStyle = i === 1 ? "#ffffff" : "#80f4dc";
      context.lineWidth = 2 + intensity;

      context.beginPath();
      context.ellipse(
        0,
        0,
        radius,
        radius * 0.55,
        0,
        Math.PI * 0.15,
        Math.PI * 1.65
      );
      context.stroke();

      context.restore();
    }

    // Petites particules en orbite.
    this.windParticles.forEach((particle) => {
      const x = centerX + Math.cos(particle.angle) * particle.radius;

      const y = centerY + Math.sin(particle.angle) * particle.radius * 0.55;

      context.globalAlpha = particle.alpha;
      context.fillStyle = "#c4fff4";

      context.beginPath();
      context.arc(x, y, particle.size, 0, Math.PI * 2);
      context.fill();
    });

    // Orbes énergétiques.
    this.windOrbs.forEach((orb) => {
      const x = centerX + Math.cos(orb.angle) * orb.radius;

      const y = centerY + Math.sin(orb.angle) * orb.radius * 0.55;

      context.globalAlpha = 0.5 + intensity * 0.5;
      context.fillStyle = "#ffffff";

      context.beginPath();
      context.arc(x, y, orb.size, 0, Math.PI * 2);
      context.fill();
    });

    // Anneaux de concentration.
    this.chargeRings.forEach((ring) => {
      context.globalAlpha = ring.alpha;
      context.strokeStyle = "#bafff0";
      context.lineWidth = 2;

      context.beginPath();
      context.ellipse(
        centerX,
        centerY,
        ring.radius,
        ring.radius * 0.5,
        0,
        0,
        Math.PI * 2
      );
      context.stroke();
    });

    // Flash final de concentration.
    if (this.chargeProgress > 0.8) {
      const alpha = (this.chargeProgress - 0.8) * 3.5;

      context.globalAlpha = Math.min(alpha, 0.65);
      context.fillStyle = "#ffffff";

      context.beginPath();
      context.arc(centerX, centerY, 8 + intensity * 12, 0, Math.PI * 2);
      context.fill();
    }

    context.restore();
  }

  // --------------------------------------------------
  // PHASE SECOND : ATTAQUE
  // --------------------------------------------------

  updateAttack() {
    this.frame++;

    // Sécurité : durée maximale de l'attaque.
    if (this.frame >= 100) {
      this.isFinished = true;
      return;
    }

    // Lancement successif des trois lames.
    this.bladeOffsets.forEach((offset, index) => {
      const alreadyLaunched = this.blades.some(
        (blade) => blade.index === index
      );

      if (!alreadyLaunched && this.frame >= offset.delay + 1) {
        this.createBlade(index, offset);
      }
    });

    // Déplacement des lames.
    this.blades.forEach((blade) => {
      // Une lame terminée ne doit plus être actualisée.
      if (blade.finished) return;

      // Une lame ayant touché sa cible reste sur place
      // pendant sa disparition.
      if (blade.impacted) {
        blade.life -= 0.12;

        if (blade.life <= 0) {
          blade.finished = true;
        }

        return;
      }

      blade.x += blade.vx;
      blade.y += blade.vy;

      blade.rotation += blade.rotationSpeed;
      blade.trailTimer++;

      if (blade.trailTimer >= 2) {
        blade.trailTimer = 0;

        this.createTrailParticle(blade.x, blade.y, blade.scale);
      }

      // Détection de l'arrivée à destination.
      const reachedTarget =
        this.direction > 0 ? blade.x >= this.aimX : blade.x <= this.aimX;

      if (reachedTarget) {
        blade.x = this.aimX;
        blade.impacted = true;

        this.createImpact(blade.x, blade.y, blade.scale);

        if (blade.index === 1) {
          this.triggerMainImpact();
        }
      }
    });

    this.updateAttackParticles();
    this.updateImpactRings();

    // Toutes les lames doivent avoir terminé leur animation.
    const allBladesFinished =
      this.blades.length === this.bladeCount &&
      this.blades.every((blade) => blade.finished);

    const noParticles = this.particles.length === 0;
    const noRings = this.impactRings.length === 0;

    if (allBladesFinished && noParticles && noRings) {
      this.isFinished = true;
    }
  }

  // --------------------------------------------------
  // CRÉATION DES LAMES
  // --------------------------------------------------

  createBlade(index, offset) {
    const startX = this.startCenterX + this.direction * 15;

    const startY = this.startCenterY + offset.y;

    const deltaX = this.aimX - startX;
    const deltaY = this.aimY - startY;

    const distance = Math.hypot(deltaX, deltaY) || 1;

    const speed = this.bladeSpeed;

    const blade = {
      index,

      x: startX,
      y: startY,

      vx: (deltaX / distance) * speed,
      vy: (deltaY / distance) * speed,

      scale: offset.scale,

      rotation: this.direction > 0 ? 0 : Math.PI,
      rotationSpeed: this.direction * 0.13,

      trailTimer: 0,

      impacted: false,
      finished: false,

      life: 1,
    };

    this.blades.push(blade);
  }

  // --------------------------------------------------
  // PARTICULES DE TRAÎNÉE
  // --------------------------------------------------

  createTrailParticle(x, y, scale) {
    this.particles.push({
      x: x - this.direction * 5,
      y: y + this.random(-4, 4),

      vx: -this.direction * this.random(0.5, 1.8),
      vy: this.random(-0.8, 0.8),

      size: this.random(2, 5) * scale,

      alpha: 0.8,
      decay: 0.045,

      color: "#bafff0",
      type: "trail",
    });
  }

  // --------------------------------------------------
  // IMPACT
  // --------------------------------------------------

  createImpact(x, y, scale) {
    for (let i = 0; i < 12; i++) {
      const angle = this.random(0, Math.PI * 2);
      const speed = this.random(1.5, 4);

      this.particles.push({
        x,
        y,

        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,

        size: this.random(2, 5) * scale,

        alpha: 1,
        decay: 0.06,

        color: "#ffffff",
        type: "impact",
      });
    }

    this.impactRings.push({
      x,
      y,

      radius: 5,
      alpha: 1,

      speed: 3 * scale,
      maxRadius: 30 * scale,
    });
  }

  triggerMainImpact() {
    if (this.impactTriggered) return;

    this.impactTriggered = true;

    this.game.canvas?.startShake?.(7, 250);

    for (let i = 0; i < 24; i++) {
      const angle = this.random(0, Math.PI * 2);
      const speed = this.random(2, 6);

      this.particles.push({
        x: this.aimX,
        y: this.targetCenterY,

        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,

        size: this.random(2, 6),

        alpha: 1,
        decay: 0.035,

        color: i % 2 === 0 ? "#ffffff" : "#8bffe6",
        type: "impact",
      });
    }

    this.impactRings.push({
      x: this.aimX,
      y: this.targetCenterY,

      radius: 4,
      alpha: 1,

      speed: 4,
      maxRadius: 48,
    });
  }

  // --------------------------------------------------
  // UPDATE PARTICULES
  // --------------------------------------------------

  updateAttackParticles() {
    this.particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      particle.alpha -= particle.decay;

      if (particle.type === "impact") {
        particle.vx *= 0.96;
        particle.vy *= 0.96;
      }
    });

    this.particles = this.particles.filter((particle) => particle.alpha > 0);

    this.blades.forEach((blade) => {
      if (blade.impacted) {
        blade.life -= 0.12;

        if (blade.life <= 0) {
          blade.finished = true;
        }
      }
    });
  }

  updateImpactRings() {
    this.impactRings.forEach((ring) => {
      ring.radius += ring.speed;
      ring.alpha -= 0.045;
    });

    this.impactRings = this.impactRings.filter(
      (ring) => ring.alpha > 0 && ring.radius < ring.maxRadius
    );
  }

  // --------------------------------------------------
  // DRAW ATTACK
  // --------------------------------------------------

  drawAttack(context) {
    this.drawImpactRings(context);
    this.drawParticles(context);

    this.blades.forEach((blade) => {
      if (!blade.finished) {
        this.drawBlade(context, blade);
      }
    });
  }

  // --------------------------------------------------
  // DRAW BLADE
  // --------------------------------------------------

  drawBlade(context, blade) {
    const alpha = blade.impacted ? Math.max(0, blade.life) : 1;

    context.save();

    context.translate(blade.x, blade.y);
    context.rotate(blade.rotation);

    context.globalAlpha = alpha;

    context.scale(blade.scale, blade.scale);

    // Lueur extérieure.
    context.shadowColor = "#8bffe6";
    context.shadowBlur = 13;

    // Lame en croissant.
    context.fillStyle = "#8bffe6";

    context.beginPath();
    context.moveTo(-18, -4);
    context.quadraticCurveTo(0, -25, 24, -8);
    context.quadraticCurveTo(8, -3, -18, -4);
    context.closePath();
    context.fill();

    // Partie blanche de la lame.
    context.shadowBlur = 5;
    context.fillStyle = "#ffffff";

    context.beginPath();
    context.moveTo(-15, -3);
    context.quadraticCurveTo(1, -16, 19, -7);
    context.quadraticCurveTo(4, -5, -15, -3);
    context.closePath();
    context.fill();

    // Pointe lumineuse.
    context.shadowBlur = 8;
    context.fillStyle = "#ffffff";

    context.beginPath();
    context.arc(17, -7, 2.5, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }

  // --------------------------------------------------
  // DRAW PARTICULES
  // --------------------------------------------------

  drawParticles(context) {
    context.save();

    this.particles.forEach((particle) => {
      context.globalAlpha = Math.max(0, particle.alpha);
      context.fillStyle = particle.color;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fill();
    });

    context.restore();
  }

  // --------------------------------------------------
  // DRAW IMPACT RINGS
  // --------------------------------------------------

  drawImpactRings(context) {
    context.save();

    this.impactRings.forEach((ring) => {
      context.globalAlpha = ring.alpha;

      context.strokeStyle = "#bafff0";
      context.lineWidth = 2;

      context.beginPath();
      context.ellipse(
        ring.x,
        ring.y,
        ring.radius,
        ring.radius * 0.5,
        0,
        0,
        Math.PI * 2
      );

      context.stroke();

      this.game.canvas.startShake(500, 5);
    });

    context.restore();
  }
}
