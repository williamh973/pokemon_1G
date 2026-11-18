export class TriAttackAnimation {
  constructor(game, viewers, turnAction) {
    this.game = game;
    this.viewers = viewers;
    this.turnAction = turnAction;

    this.battleBackgroundEffectManager =
      this.game.battleManager.battleRenderer.battleBackgroundEffectManager;

    if (viewers.front.slot.content === turnAction.pokemon) {
      this.pokemonViewer = viewers.front;
      this.targetViewer = viewers.back;
    } else {
      this.pokemonViewer = viewers.back;
      this.targetViewer = viewers.front;
    }

    this.attacker = this.pokemonViewer.sprite;
    this.target = this.targetViewer.sprite;

    this.attackerCenterX =
      this.attacker.position.x + this.attacker.frameWidth / 2;
    this.attackerCenterY =
      this.attacker.position.y + this.attacker.frameHeight / 2;

    this.targetCenterX = this.target.position.x + this.target.frameWidth / 2;
    this.targetCenterY = this.target.position.y + this.target.frameHeight / 2;

    this.directionX = this.targetCenterX - this.attackerCenterX;
    this.directionY = this.targetCenterY - this.attackerCenterY;

    this.distance = Math.hypot(this.directionX, this.directionY);

    if (this.distance > 0) {
      this.directionX /= this.distance;
      this.directionY /= this.distance;
    } else {
      this.directionX = 1;
      this.directionY = 0;
    }

    // Vecteur perpendiculaire à la trajectoire.
    this.perpendicularX = -this.directionY;
    this.perpendicularY = this.directionX;

    this.frame = 0;
    this.phase = "PREPARE";
    this.isFinished = false;

    this.duration = {
      PREPARE: 80,
      CHARGE: 16,
      LAUNCH: 30,
      IMPACT: 100,
      FINISH: 14,
    };

    this.colors = {
      fire: "#ff7138",
      ice: "#79e7ff",
      electric: "#ffe34d",
    };

    this.elements = [
      {
        type: "fire",
        color: this.colors.fire,
        delay: 0,
        offset: -15,
        size: 7,
        progress: 0,
        particles: [],
      },
      {
        type: "ice",
        color: this.colors.ice,
        delay: 4,
        offset: 0,
        size: 8,
        progress: 0,
        particles: [],
      },
      {
        type: "electric",
        color: this.colors.electric,
        delay: 8,
        offset: 15,
        size: 7,
        progress: 0,
        particles: [],
      },
    ];

    this.orbs = [];
    this.chargeParticles = [];
    this.impactParticles = [];
    this.impactRings = [];
    this.impactShards = [];
    this.lightningBolts = [];

    this.impactAlpha = 0;
    this.impactCreated = false;
    this.shakeTriggered = false;

    this.orbitAngle = 0;
    this.flashAlpha = 0;
    this.battleBackgroundEffectManager.startColorChange("#ff7138", 0.2);
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

      case "LAUNCH":
        this.updateLaunch();
        break;

      case "IMPACT":
        this.updateImpact();
        break;

      case "FINISH":
        this.updateFinish();
        break;
    }

    this.draw(context);
  }

  changePhase(phase) {
    this.phase = phase;
    this.frame = 0;
  }

  updatePrepare() {
    this.orbitAngle += 0.17;

    const progress = Math.min(this.frame / this.duration.PREPARE, 1);

    this.orbs = this.elements.map((element, index) => {
      const angle = this.orbitAngle + ((Math.PI * 2) / 3) * index;

      const radius = 13 + progress * 12;

      return {
        x: this.attackerCenterX + Math.cos(angle) * radius,
        y: this.attackerCenterY + Math.sin(angle) * radius * 0.65,
        color: element.color,
        size: element.size,
        type: element.type,
      };
    });

    if (this.frame % 2 === 0) {
      this.createChargeParticles();
    }

    this.updateParticles(this.chargeParticles);

    if (progress >= 1) {
      this.changePhase("CHARGE");
    }
  }

  updateCharge() {
    this.orbitAngle += 0.28;

    const progress = Math.min(this.frame / this.duration.CHARGE, 1);

    const convergence = this.easeInCubic(progress);

    this.orbs = this.elements.map((element, index) => {
      const angle = this.orbitAngle + ((Math.PI * 2) / 3) * index;

      const radius = 25 * (1 - convergence);

      return {
        x: this.attackerCenterX + Math.cos(angle) * radius,
        y: this.attackerCenterY + Math.sin(angle) * radius * 0.65,
        color: element.color,
        size: element.size * (1 + convergence * 0.5),
        type: element.type,
      };
    });

    if (this.frame % 2 === 0) {
      this.createChargeParticles();
    }

    this.updateParticles(this.chargeParticles);

    this.flashAlpha = Math.min(progress * 1.2, 0.8);

    if (progress >= 1) {
      this.flashAlpha = 0;
      this.initializeProjectiles();
      this.changePhase("LAUNCH");

      this.battleBackgroundEffectManager.stopColorChange();
      this.battleBackgroundEffectManager.startColorChange("#79e7ff", 0.2);
    }
  }

  initializeProjectiles() {
    this.elements.forEach((element) => {
      element.progress = 0;
      element.particles = [];
    });
  }

  updateLaunch() {
    const launchDuration = 22;

    this.elements.forEach((element) => {
      const localFrame = this.frame - element.delay;

      if (localFrame < 0) return;

      const progress = Math.min(localFrame / launchDuration, 1);

      element.progress = this.easeOutCubic(progress);

      const spread = element.offset;

      const projectileX =
        this.attackerCenterX +
        this.directionX * this.distance * element.progress +
        this.perpendicularX * spread * element.progress;

      const projectileY =
        this.attackerCenterY +
        this.directionY * this.distance * element.progress +
        this.perpendicularY * spread * element.progress;

      element.x = projectileX;
      element.y = projectileY;

      if (localFrame % 2 === 0 && progress < 1) {
        this.createProjectileParticle(element);
      }

      this.updateParticles(element.particles);
    });

    if (this.frame >= launchDuration + 9) {
      this.createImpact();
      this.changePhase("IMPACT");

      this.battleBackgroundEffectManager.stopColorChange();
      this.battleBackgroundEffectManager.startColorChange("#ffe34d", 0.2);
    }
  }

  createChargeParticles() {
    this.orbs.forEach((orb) => {
      this.chargeParticles.push({
        x: orb.x,
        y: orb.y,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius: 1 + Math.random() * 2,
        alpha: 0.9,
        decay: 0.055,
        color: orb.color,
      });
    });
  }

  createProjectileParticle(element) {
    const spread = (Math.random() - 0.5) * 9;

    this.impactParticles.push({
      x: element.x + this.perpendicularX * spread,
      y: element.y + this.perpendicularY * spread,
      vx: -this.directionX * (1 + Math.random() * 2),
      vy: -this.directionY * (1 + Math.random() * 2),
      radius: 1 + Math.random() * 2,
      alpha: 0.9,
      decay: 0.055,
      color: element.color,
    });
  }

  createImpact() {
    if (this.impactCreated) return;

    this.impactCreated = true;

    if (!this.shakeTriggered) {
      this.game.canvas?.startShake?.(500, 5);
      this.shakeTriggered = true;
    }

    this.flashAlpha = 1;

    // Trois anneaux colorés.
    this.elements.forEach((element, index) => {
      this.impactRings.push({
        radius: 8 + index * 5,
        speed: 3.5 + index,
        alpha: 1,
        decay: 0.035,
        color: element.color,
      });
    });

    // Explosion de particules tricolores.
    this.elements.forEach((element) => {
      for (let i = 0; i < 22; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.5 + Math.random() * 5;

        this.impactParticles.push({
          x: this.targetCenterX,
          y: this.targetCenterY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: 1 + Math.random() * 3,
          alpha: 1,
          decay: 0.025 + Math.random() * 0.025,
          color: element.color,
        });
      }
    });

    this.createIceShards();
    this.createLightningBolts();
  }

  createIceShards() {
    for (let i = 0; i < 14; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 4;

      this.impactShards.push({
        x: this.targetCenterX,
        y: this.targetCenterY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        angle: angle,
        rotation: Math.random() * Math.PI,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        length: 5 + Math.random() * 10,
        alpha: 1,
        decay: 0.035,
      });
    }
  }

  createLightningBolts() {
    for (let i = 0; i < 7; i++) {
      const angle = Math.random() * Math.PI * 2;
      const length = 15 + Math.random() * 23;

      const points = [
        { x: 0, y: 0 },
        {
          x: Math.cos(angle) * length * 0.35 + (Math.random() - 0.5) * 8,
          y: Math.sin(angle) * length * 0.35 + (Math.random() - 0.5) * 8,
        },
        {
          x: Math.cos(angle) * length * 0.7 + (Math.random() - 0.5) * 10,
          y: Math.sin(angle) * length * 0.7 + (Math.random() - 0.5) * 10,
        },
        {
          x: Math.cos(angle) * length,
          y: Math.sin(angle) * length,
        },
      ];

      this.lightningBolts.push({
        points,
        alpha: 1,
        decay: 0.07,
      });
    }
  }

  updateImpact() {
    const progress = Math.min(this.frame / this.duration.IMPACT, 1);

    this.impactAlpha = 1 - progress;
    this.flashAlpha = Math.max(0, 1 - this.frame / 5);

    this.updateParticles(this.impactParticles);
    this.updateRings();
    this.updateShards();
    this.updateLightning();

    if (progress >= 1) {
      this.changePhase("FINISH");

      this.battleBackgroundEffectManager.stopColorChange();
    }
  }

  updateFinish() {
    this.updateParticles(this.impactParticles);
    this.updateRings();
    this.updateShards();
    this.updateLightning();

    const progress = Math.min(this.frame / this.duration.FINISH, 1);

    this.impactAlpha = 1 - progress;

    if (progress >= 1) {
      this.isFinished = true;
    }
  }

  updateParticles(particles) {
    particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      particle.vx *= 0.97;
      particle.vy *= 0.97;

      particle.alpha -= particle.decay;
      particle.radius *= 0.99;
    });

    for (let i = particles.length - 1; i >= 0; i--) {
      if (particles[i].alpha <= 0) {
        particles.splice(i, 1);
      }
    }
  }

  updateRings() {
    this.impactRings.forEach((ring) => {
      ring.radius += ring.speed;
      ring.alpha -= ring.decay;
    });

    this.impactRings = this.impactRings.filter((ring) => ring.alpha > 0);
  }

  updateShards() {
    this.impactShards.forEach((shard) => {
      shard.x += shard.vx;
      shard.y += shard.vy;

      shard.vx *= 0.96;
      shard.vy *= 0.96;

      shard.rotation += shard.rotationSpeed;
      shard.alpha -= shard.decay;
    });

    this.impactShards = this.impactShards.filter((shard) => shard.alpha > 0);
  }

  updateLightning() {
    this.lightningBolts.forEach((bolt) => {
      bolt.alpha -= bolt.decay;
    });

    this.lightningBolts = this.lightningBolts.filter((bolt) => bolt.alpha > 0);
  }

  draw(context) {
    switch (this.phase) {
      case "PREPARE":
      case "CHARGE":
        this.drawCharge(context);
        break;

      case "LAUNCH":
        this.drawLaunch(context);
        break;

      case "IMPACT":
      case "FINISH":
        this.drawImpact(context);
        break;
    }
  }

  drawCharge(context) {
    context.save();

    // Les trois sphères d'énergie.
    this.orbs.forEach((orb) => {
      this.drawOrb(context, orb.x, orb.y, orb.size, orb.color);
    });

    this.drawParticles(context, this.chargeParticles);

    // Fusion lumineuse au centre.
    if (this.phase === "CHARGE") {
      const pulse = Math.sin(this.frame * 0.7) * 3;

      context.globalAlpha = this.flashAlpha * 0.45;
      context.fillStyle = "#ffffff";

      context.beginPath();
      context.arc(
        this.attackerCenterX,
        this.attackerCenterY,
        8 + pulse,
        0,
        Math.PI * 2
      );
      context.fill();
    }

    context.restore();
  }

  drawOrb(context, x, y, radius, color) {
    context.save();

    const gradient = context.createRadialGradient(
      x - radius * 0.3,
      y - radius * 0.35,
      1,
      x,
      y,
      radius * 2.2
    );

    gradient.addColorStop(0, "#ffffff");
    gradient.addColorStop(0.25, color);
    gradient.addColorStop(0.65, color);
    gradient.addColorStop(1, "rgba(255,255,255,0)");

    context.globalAlpha = 0.95;
    context.fillStyle = gradient;
    context.shadowColor = color;
    context.shadowBlur = 14;

    context.beginPath();
    context.arc(x, y, radius * 2.2, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }

  drawLaunch(context) {
    context.save();

    this.elements.forEach((element) => {
      if (element.progress <= 0) return;

      this.drawProjectile(context, element);
    });

    this.drawParticles(context, this.impactParticles);

    context.restore();
  }

  drawProjectile(context, element) {
    const x = element.x;
    const y = element.y;

    context.save();

    if (element.type === "fire") {
      // Noyau de feu.
      context.translate(x, y);
      context.rotate(Math.atan2(this.directionY, this.directionX));

      context.globalAlpha = 0.35;
      context.fillStyle = "#ff4a1f";
      context.beginPath();
      context.ellipse(-5, 0, 16, 9, 0, 0, Math.PI * 2);
      context.fill();

      context.globalAlpha = 1;
      context.fillStyle = "#ff7138";
      context.beginPath();
      context.moveTo(-10, 0);
      context.quadraticCurveTo(-2, -13, 10, 0);
      context.quadraticCurveTo(0, 13, -10, 0);
      context.fill();

      context.fillStyle = "#fff4c4";
      context.beginPath();
      context.arc(0, 0, 3.5, 0, Math.PI * 2);
      context.fill();
    }

    if (element.type === "ice") {
      // Cristal de glace.
      context.translate(x, y);
      context.rotate(this.frame * 0.12);

      context.shadowColor = this.colors.ice;
      context.shadowBlur = 12;

      context.fillStyle = "#b8f6ff";
      context.strokeStyle = "#ffffff";
      context.lineWidth = 1.5;

      context.beginPath();
      context.moveTo(0, -12);
      context.lineTo(6, -3);
      context.lineTo(4, 7);
      context.lineTo(0, 12);
      context.lineTo(-5, 5);
      context.lineTo(-6, -4);
      context.closePath();
      context.fill();
      context.stroke();

      context.beginPath();
      context.moveTo(0, -10);
      context.lineTo(0, 9);
      context.stroke();
    }

    if (element.type === "electric") {
      // Orbe électrique et éclairs.
      context.translate(x, y);

      context.shadowColor = this.colors.electric;
      context.shadowBlur = 15;

      context.fillStyle = "#fff5a5";
      context.beginPath();
      context.arc(0, 0, 6, 0, Math.PI * 2);
      context.fill();

      context.strokeStyle = "#ffe34d";
      context.lineWidth = 2;

      for (let i = 0; i < 3; i++) {
        const angle = this.frame * 0.2 + (i * Math.PI * 2) / 3;

        context.beginPath();
        context.moveTo(Math.cos(angle) * 7, Math.sin(angle) * 7);
        context.lineTo(Math.cos(angle + 0.4) * 13, Math.sin(angle + 0.4) * 13);
        context.stroke();
      }
    }

    context.restore();
  }

  drawImpact(context) {
    context.save();

    const x = this.targetCenterX;
    const y = this.targetCenterY;

    // Explosion tricolore.
    context.globalAlpha = this.flashAlpha * 0.75;
    context.fillStyle = "#ffffff";

    context.beginPath();
    context.arc(x, y, 42, 0, Math.PI * 2);
    context.fill();

    // Auras élémentaires.
    this.elements.forEach((element, index) => {
      const angle = this.frame * 0.12 + (index * Math.PI * 2) / 3;

      const radius = 16 + this.frame * 0.45;
      const orbX = x + Math.cos(angle) * radius;
      const orbY = y + Math.sin(angle) * radius * 0.65;

      context.globalAlpha = this.impactAlpha * 0.65;
      context.fillStyle = element.color;
      context.shadowColor = element.color;
      context.shadowBlur = 15;

      context.beginPath();
      context.arc(orbX, orbY, 5 + this.impactAlpha * 3, 0, Math.PI * 2);
      context.fill();
    });

    context.shadowBlur = 0;

    // Anneaux.
    this.impactRings.forEach((ring) => {
      context.globalAlpha = ring.alpha;
      context.strokeStyle = ring.color;
      context.lineWidth = 3;

      context.beginPath();
      context.ellipse(
        x,
        y,
        ring.radius * 1.4,
        ring.radius * 0.65,
        0,
        0,
        Math.PI * 2
      );
      context.stroke();
    });

    // Éclats de glace.
    this.impactShards.forEach((shard) => {
      context.save();

      context.translate(shard.x, shard.y);
      context.rotate(shard.rotation);

      context.globalAlpha = shard.alpha;
      context.fillStyle = "#9beeff";
      context.strokeStyle = "#ffffff";
      context.lineWidth = 1;

      context.beginPath();
      context.moveTo(0, -shard.length);
      context.lineTo(3, 0);
      context.lineTo(0, shard.length);
      context.lineTo(-3, 0);
      context.closePath();
      context.fill();
      context.stroke();

      context.restore();
    });

    // Éclairs.
    this.lightningBolts.forEach((bolt) => {
      context.save();

      context.translate(x, y);
      context.globalAlpha = bolt.alpha;
      context.strokeStyle = "#fff36a";
      context.lineWidth = 2.5;
      context.shadowColor = "#ffe34d";
      context.shadowBlur = 10;

      context.beginPath();
      bolt.points.forEach((point, index) => {
        if (index === 0) {
          context.moveTo(point.x, point.y);
        } else {
          context.lineTo(point.x, point.y);
        }
      });

      context.stroke();
      context.restore();
    });

    this.drawParticles(context, this.impactParticles);

    context.restore();
  }

  drawParticles(context, particles) {
    particles.forEach((particle) => {
      context.save();

      context.globalAlpha = Math.max(0, particle.alpha);
      context.fillStyle = particle.color;
      context.shadowColor = particle.color;
      context.shadowBlur = 7;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fill();

      context.restore();
    });
  }
}
