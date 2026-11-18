export class ConfuseRayAnimation {
  constructor(game, viewers, turnAction) {
    this.game = game;
    this.battleBackgroundEffectManager =
      this.game.battleManager.battleRenderer.battleBackgroundEffectManager;

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

    this.direction =
      this.target.position.x >= this.attacker.position.x ? 1 : -1;

    this.attackerCenterX =
      this.attacker.position.x + this.attacker.frameWidth / 2;

    this.attackerCenterY =
      this.attacker.position.y + this.attacker.frameHeight / 2;

    this.targetCenterX = this.target.position.x + this.target.frameWidth / 2;

    this.targetCenterY = this.target.position.y + this.target.frameHeight / 2;

    // Vecteur directionnel vers la cible.
    this.directionX = this.targetCenterX - this.attackerCenterX;
    this.directionY = this.targetCenterY - this.attackerCenterY;

    this.distance = Math.sqrt(this.directionX ** 2 + this.directionY ** 2);

    this.directionX /= this.distance;
    this.directionY /= this.distance;

    this.projectileX = this.attackerCenterX;
    this.projectileY = this.attackerCenterY;

    this.frame = 0;
    this.isFinished = false;

    this.phase = "CHARGE";

    this.duration = {
      CHARGE: 20,
      WAVE: 64,
      IMPACT: 34,
    };

    this.orb = {
      radius: 3,
      alpha: 0,
      pulse: 0,
    };

    this.wave = {
      progress: 0,
      rings: [],
      particles: [],
    };

    this.orbit = {
      duration: 90, // 3 rotations à raison de 30 frames par tour
      frame: 0,
      angle: 0,
      rotations: 3,
      radiusX: 34,
      radiusY: 17,
      speed: (Math.PI * 2 * 3) / 90,
      projectileX: 0,
      projectileY: 0,
    };

    this.impact = {
      alpha: 0,
      rotation: 0,
      stars: [],
      particles: [],
      rings: [],
    };

    this.targetOriginalPosition = {
      x: this.target.position.x,
      y: this.target.position.y,
    };

    this.targetDisplacement = 0;
  }

  update(context) {
    if (this.isFinished) return;

    this.frame++;

    switch (this.phase) {
      case "CHARGE":
        this.updateCharge();
        break;

      case "WAVE":
        this.updateWave();
        break;

      case "ORBIT":
        this.updateOrbit();
        break;

      case "IMPACT":
        this.updateImpact();
        break;
    }

    this.draw(context);
  }

  updateCharge() {
    const progress = Math.min(this.frame / this.duration.CHARGE, 1);

    this.orb.radius = 3 + progress * 15;
    this.orb.alpha = progress;
    this.orb.pulse += 0.18;

    if (this.frame % 2 === 0) {
      this.createChargeParticle();
    }

    this.updateParticles(this.wave.particles);

    if (this.frame >= this.duration.CHARGE) {
      this.phase = "WAVE";
      this.frame = 0;
      this.createWaveRings();
    }
  }

  updateWave() {
    const progress = Math.min(this.frame / this.duration.WAVE, 1);

    this.wave.progress = progress;

    this.projectileX =
      this.attackerCenterX + this.directionX * this.distance * progress;

    this.projectileY =
      this.attackerCenterY + this.directionY * this.distance * progress;

    if (this.frame % 2 === 0) {
      this.createWaveParticle(this.projectileX);
    }

    this.wave.rings.forEach((ring) => {
      ring.x = this.projectileX;
      ring.y = this.projectileY;
      ring.radius += 2.5;
      ring.alpha -= 0.035;
      ring.rotation += ring.rotationSpeed;
    });

    this.wave.rings = this.wave.rings.filter((ring) => ring.alpha > 0);

    this.updateParticles(this.wave.particles);

    if (this.frame >= this.duration.WAVE) {
      this.phase = "ORBIT";
      this.orbit.frame = 0;
      this.orbit.angle = 0;

      this.orbit.projectileX = this.targetCenterX + this.orbit.radiusX;
      this.orbit.projectileY = this.targetCenterY;

      this.wave.particles = [];
      this.wave.rings = [];
    }
  }

  updateOrbit() {
    this.orbit.frame++;

    const progress = this.orbit.frame / this.orbit.duration;

    // Trois rotations complètes autour de la cible.
    this.orbit.angle += this.orbit.speed;

    // Légère variation de profondeur pour donner du relief.
    const depth = Math.sin(this.orbit.angle);

    this.orbit.projectileX =
      this.targetCenterX + Math.cos(this.orbit.angle) * this.orbit.radiusX;

    this.orbit.projectileY = this.targetCenterY + depth * this.orbit.radiusY;

    // Particules lumineuses autour du rayon.
    if (this.orbit.frame % 2 === 0) {
      this.createOrbitParticle();
    }

    this.updateOrbitParticles();

    if (progress >= 1) {
      this.phase = "IMPACT";
      this.frame = 0;
      this.createImpact();
    }
  }

  updateImpact() {
    const progress = Math.min(this.frame / this.duration.IMPACT, 1);

    this.impact.alpha = Math.max(0, 1 - progress);
    this.impact.rotation += 0.12;

    // Léger balancement du Pokémon touché.
    const oscillation = Math.sin(this.frame * 0.55) * 3;
    this.target.position.x = this.targetOriginalPosition.x + oscillation;
    this.target.position.y =
      this.targetOriginalPosition.y + Math.sin(this.frame * 0.35) * 2;

    this.impact.stars.forEach((star) => {
      star.angle += star.speed;
      star.radius += star.radiusSpeed;
      star.alpha -= star.decay;
    });

    this.impact.stars = this.impact.stars.filter((star) => star.alpha > 0);

    this.impact.rings.forEach((ring) => {
      ring.radius += ring.speed;
      ring.alpha -= ring.decay;
    });

    this.impact.rings = this.impact.rings.filter((ring) => ring.alpha > 0);

    this.updateParticles(this.impact.particles);

    if (progress >= 1) {
      this.target.position.x = this.targetOriginalPosition.x;
      this.target.position.y = this.targetOriginalPosition.y;
      this.isFinished = true;
    }
  }

  createChargeParticle() {
    const angle = Math.random() * Math.PI * 2;
    const radius = 10 + Math.random() * 17;

    this.wave.particles.push({
      x: this.attackerCenterX + Math.cos(angle) * radius,
      y: this.attackerCenterY + Math.sin(angle) * radius,
      vx: -Math.cos(angle) * 0.7,
      vy: -Math.sin(angle) * 0.7,
      radius: 1 + Math.random() * 2,
      alpha: 0.9,
      decay: 0.025,
      color: Math.random() > 0.5 ? "#d76cff" : "#6b8cff",
    });
  }

  createOrbitParticle() {
    this.wave.particles.push({
      x: this.orbit.projectileX,
      y: this.orbit.projectileY,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
      radius: 1 + Math.random() * 2,
      alpha: 0.9,
      decay: 0.045,
      color: Math.random() > 0.5 ? "#e66cff" : "#7b8dff",
    });
  }

  updateOrbitParticles() {
    this.wave.particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.alpha -= particle.decay;
    });

    this.wave.particles = this.wave.particles.filter(
      (particle) => particle.alpha > 0
    );
  }

  createWaveRings() {
    for (let i = 0; i < 4; i++) {
      this.wave.rings.push({
        x: this.attackerCenterX,
        y: this.attackerCenterY,
        radius: 8 + i * 7,
        alpha: 0.9,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: 0.08 + Math.random() * 0.08,
        color: i % 2 === 0 ? "#d75cff" : "#72a5ff",
      });
    }
  }

  createWaveParticle(x) {
    const spread = (Math.random() - 0.5) * 35;

    this.wave.particles.push({
      x: x,
      y: this.attackerCenterY + spread,
      vx: this.direction * (1 + Math.random() * 2),
      vy: (Math.random() - 0.5) * 1.5,
      radius: 1 + Math.random() * 3,
      alpha: 0.95,
      decay: 0.035,
      color: Math.random() > 0.5 ? "#e66cff" : "#7b8dff",
    });
  }

  createImpact() {
    this.game.canvas?.startShake?.(5, 180);

    for (let i = 0; i < 3; i++) {
      this.impact.rings.push({
        radius: 8 + i * 9,
        speed: 2.5 + i,
        alpha: 0.9,
        decay: 0.035,
      });
    }

    for (let i = 0; i < 10; i++) {
      this.impact.stars.push({
        angle: ((Math.PI * 2) / 10) * i,
        radius: 10,
        speed: (Math.random() > 0.5 ? 1 : -1) * (0.07 + Math.random() * 0.08),
        radiusSpeed: 0.8 + Math.random() * 1.3,
        alpha: 1,
        decay: 0.018,
        size: 3 + Math.random() * 4,
      });
    }

    for (let i = 0; i < 32; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 4;

      this.impact.particles.push({
        x: this.targetCenterX,
        y: this.targetCenterY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 1 + Math.random() * 3,
        alpha: 1,
        decay: 0.025 + Math.random() * 0.025,
        color: ["#e56aff", "#a18aff", "#70aaff", "#ffffff"][
          Math.floor(Math.random() * 4)
        ],
      });
    }
  }

  updateParticles(particles) {
    particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.alpha -= particle.decay;
    });

    for (let i = particles.length - 1; i >= 0; i--) {
      if (particles[i].alpha <= 0) {
        particles.splice(i, 1);
      }
    }
  }

  draw(context) {
    if (this.phase === "CHARGE") {
      this.drawCharge(context);
    }

    if (this.phase === "WAVE") {
      this.drawWave(context);
      //   this.drawBlackBackground(context);
    }

    if (this.phase === "ORBIT") {
      this.drawOrbit(context);

      context.save();
      this.drawParticles(context, this.wave.particles);
      context.restore();
    }

    if (this.phase === "IMPACT") {
      this.drawImpact(context);
    }
  }

  drawCharge(context) {
    this.battleBackgroundEffectManager.startColorChange("black", 0.65);

    context.save();

    // Aura autour de la sphère.
    const pulse = Math.sin(this.orb.pulse) * 3;

    context.globalAlpha = this.orb.alpha * 0.25;
    context.fillStyle = "#c45cff";
    context.beginPath();
    context.arc(
      this.attackerCenterX,
      this.attackerCenterY,
      this.orb.radius + 9 + pulse,
      0,
      Math.PI * 2
    );
    context.fill();

    // Sphère centrale.
    const gradient = context.createRadialGradient(
      this.attackerCenterX - 4,
      this.attackerCenterY - 5,
      1,
      this.attackerCenterX,
      this.attackerCenterY,
      this.orb.radius
    );

    gradient.addColorStop(0, "#ffffff");
    gradient.addColorStop(0.3, "#edb5ff");
    gradient.addColorStop(0.7, "#b34bff");
    gradient.addColorStop(1, "#5124a0");

    context.globalAlpha = this.orb.alpha;
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(
      this.attackerCenterX,
      this.attackerCenterY,
      this.orb.radius + pulse,
      0,
      Math.PI * 2
    );
    context.fill();

    this.drawParticles(context, this.wave.particles);

    context.restore();
  }

  drawOrbit(context) {
    const { projectileX, projectileY, angle } = this.orbit;

    context.save();

    // Halo extérieur.
    const gradient = context.createRadialGradient(
      projectileX,
      projectileY,
      1,
      projectileX,
      projectileY,
      13
    );

    gradient.addColorStop(0, "rgba(255,255,255,0.95)");
    gradient.addColorStop(0.25, "rgba(230,108,255,0.8)");
    gradient.addColorStop(1, "rgba(123,141,255,0)");

    context.fillStyle = gradient;
    context.beginPath();
    context.arc(projectileX, projectileY, 13, 0, Math.PI * 2);
    context.fill();

    // Noyau lumineux.
    context.fillStyle = "#ffffff";
    context.beginPath();
    context.arc(projectileX, projectileY, 3.5, 0, Math.PI * 2);
    context.fill();

    // Petite traînée derrière le rayon.
    context.translate(projectileX, projectileY);
    context.rotate(angle - Math.PI / 2);

    context.fillStyle = "rgba(230,108,255,0.7)";
    context.beginPath();
    context.ellipse(0, -7, 3, 8, 0, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }

  drawWave(context) {
    const angle = Math.atan2(this.directionY, this.directionX);

    context.save();

    context.translate(this.projectileX, this.projectileY);
    context.rotate(angle);

    // Halo extérieur.
    context.globalAlpha = 0.3;
    context.strokeStyle = "#a84cff";
    context.lineWidth = 17;
    context.shadowColor = "#c65cff";
    context.shadowBlur = 20;

    context.beginPath();
    context.moveTo(-85, 0);
    context.lineTo(0, 0);
    context.stroke();

    // Faisceau central.
    context.globalAlpha = 0.85;
    context.strokeStyle = "#dba1ff";
    context.lineWidth = 7;

    context.beginPath();
    context.moveTo(-85, 0);
    context.lineTo(0, 0);
    context.stroke();

    // Noyau lumineux.
    context.strokeStyle = "#ffffff";
    context.lineWidth = 2;
    context.shadowBlur = 10;

    context.beginPath();
    context.moveTo(-85, 0);
    context.lineTo(0, 0);
    context.stroke();

    context.shadowBlur = 0;

    // Extrémité lumineuse.
    context.fillStyle = "#ffffff";
    context.beginPath();
    context.arc(0, 0, 5, 0, Math.PI * 2);
    context.fill();

    context.restore();

    // Anneaux hypnotiques autour du projectile.
    this.wave.rings.forEach((ring) => {
      context.save();

      context.translate(ring.x, ring.y);
      context.rotate(ring.rotation);

      context.globalAlpha = ring.alpha;
      context.strokeStyle = ring.color;
      context.lineWidth = 2;

      context.beginPath();
      context.ellipse(
        0,
        0,
        ring.radius * 1.5,
        ring.radius * 0.55,
        0,
        0,
        Math.PI * 2
      );
      context.stroke();

      context.restore();
    });

    context.save();
    this.drawParticles(context, this.wave.particles);
    context.restore();
  }

  drawImpact(context) {
    this.battleBackgroundEffectManager.stopColorChange();

    context.save();

    context.translate(this.targetCenterX, this.targetCenterY);

    // Flash initial.
    context.globalAlpha = this.impact.alpha * 0.35;
    context.fillStyle = "#d88aff";
    context.beginPath();
    context.arc(0, 0, 32, 0, Math.PI * 2);
    context.fill();

    // Anneaux d'impact.
    this.impact.rings.forEach((ring) => {
      context.globalAlpha = ring.alpha;
      context.strokeStyle = "#d77aff";
      context.lineWidth = 2;

      context.beginPath();
      context.arc(0, 0, ring.radius, 0, Math.PI * 2);
      context.stroke();
    });

    // Étoiles hypnotiques.
    this.impact.stars.forEach((star) => {
      context.save();
      context.rotate(star.angle);
      context.globalAlpha = star.alpha;
      context.fillStyle = "#f1c5ff";

      context.beginPath();
      context.moveTo(star.radius, 0);
      context.lineTo(star.radius + star.size, -star.size * 0.4);
      context.lineTo(star.radius + star.size * 1.5, 0);
      context.lineTo(star.radius + star.size, star.size * 0.4);
      context.closePath();
      context.fill();

      context.restore();
    });

    context.restore();

    // Particules qui s'éloignent de la cible.
    context.save();
    this.drawParticles(context, this.impact.particles);
    context.restore();
  }

  drawParticles(context, particles) {
    particles.forEach((particle) => {
      context.globalAlpha = Math.max(0, particle.alpha);
      context.fillStyle = particle.color;
      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fill();
    });

    context.globalAlpha = 1;
  }
}
