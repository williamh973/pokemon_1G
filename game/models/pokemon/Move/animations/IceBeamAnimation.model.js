export class IceBeamAnimation {
  constructor(game, viewers, turnAction) {
    this.game = game;
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

    this.originalAttackerX = this.attacker.position.x;
    this.originalAttackerY = this.attacker.position.y;

    this.originalTargetX = this.target.position.x;
    this.originalTargetY = this.target.position.y;

    this.pokemonCenter = this.getCenter(this.pokemonViewer);
    this.targetCenter = this.getCenter(this.targetViewer);

    this.startX = this.pokemonCenter.x;
    this.startY = this.pokemonCenter.y - 5;

    this.endX = this.targetCenter.x;
    this.endY = this.targetCenter.y;

    this.direction = this.endX >= this.startX ? 1 : -1;

    this.angle = Math.atan2(this.endY - this.startY, this.endX - this.startX);

    this.distance = Math.hypot(
      this.endX - this.startX,
      this.endY - this.startY
    );

    this.phase = "CHARGE";
    this.timer = 0;
    this.isFinished = false;

    this.chargeDuration = 25;
    this.beamDuration = 50;
    this.impactDuration = 32;
    this.shatterDuration = 36;

    this.particles = [];
    this.crystals = [];
    this.chargeParticles = [];
    this.beamParticles = [];

    this.beamProgress = 0;

    this.createChargeParticles();
    this.createBeamParticles();
  }

  getCenter(viewer) {
    return {
      x: viewer.sprite.position.x + viewer.sprite.frameWidth / 2,
      y: viewer.sprite.position.y + viewer.sprite.frameHeight / 2,
    };
  }

  createChargeParticles() {
    for (let i = 0; i < 20; i++) {
      this.chargeParticles.push({
        angle: Math.random() * Math.PI * 2,
        radius: 7 + Math.random() * 17,
        speed: 0.06 + Math.random() * 0.08,
        size: 1 + Math.random() * 2.5,
      });
    }
  }

  createBeamParticles() {
    for (let i = 0; i < 32; i++) {
      this.beamParticles.push({
        progress: Math.random(),
        offset: (Math.random() - 0.5) * 12,
        speed: 0.012 + Math.random() * 0.025,
        size: 1 + Math.random() * 2.5,
      });
    }
  }

  createImpactCrystals() {
    const count = 24;

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.35;

      const speed = 1.5 + Math.random() * 3.5;

      this.crystals.push({
        x: this.endX,
        y: this.endY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 4 + Math.random() * 9,
        rotation: Math.random() * Math.PI,
        rotationSpeed: (Math.random() - 0.5) * 0.25,
        life: 1,
      });
    }

    // Petits éclats lumineux autour de l'explosion.
    for (let i = 0; i < 18; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.8 + Math.random() * 2.5;

      this.particles.push({
        x: this.endX,
        y: this.endY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 1 + Math.random() * 3,
        life: 1,
      });
    }
  }

  createShatterParticles() {
    for (let i = 0; i < 28; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 3;

      this.particles.push({
        x: this.endX + (Math.random() - 0.5) * 15,
        y: this.endY + (Math.random() - 0.5) * 15,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 1 + Math.random() * 3,
        life: 1,
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

      case "BEAM":
        this.updateBeam();
        break;

      case "IMPACT":
        this.updateImpact();
        break;

      case "SHATTER":
        this.updateShatter();
        break;
    }

    this.updateParticles();

    // Le rendu est effectué directement dans update().
    this.draw(context);

    if (this.isFinished) {
      this.restorePositions();
    }
  }

  updateCharge() {
    for (const particle of this.chargeParticles) {
      particle.angle += particle.speed;
      particle.radius = Math.max(2, particle.radius - 0.08);
    }

    if (this.timer >= this.chargeDuration) {
      this.phase = "BEAM";
      this.timer = 0;
    }
  }

  updateBeam() {
    this.beamProgress = Math.min(1, this.timer / 5);

    for (const particle of this.beamParticles) {
      particle.progress += particle.speed;

      if (particle.progress > 1) {
        particle.progress = 0;
        particle.offset = (Math.random() - 0.5) * 12;
      }
    }

    if (this.timer >= this.beamDuration) {
      this.phase = "IMPACT";
      this.timer = 0;

      this.createImpactCrystals();

      if (this.game.canvas?.startShake) {
        this.game.canvas.startShake(4, 160);
      }
    }
  }

  updateImpact() {
    if (this.timer >= this.impactDuration) {
      this.phase = "SHATTER";
      this.timer = 0;

      this.createShatterParticles();
    }
  }

  updateShatter() {
    if (this.timer >= this.shatterDuration) {
      this.isFinished = true;
    }
  }

  updateParticles() {
    for (const particle of this.particles) {
      particle.x += particle.vx;
      particle.y += particle.vy;

      particle.vx *= 0.98;
      particle.vy *= 0.98;

      particle.life -= 0.035;
    }

    this.particles = this.particles.filter((particle) => particle.life > 0);

    // Les cristaux ne sont déplacés qu'une seule fois par image.
    for (const crystal of this.crystals) {
      crystal.x += crystal.vx;
      crystal.y += crystal.vy;

      crystal.vx *= 0.97;
      crystal.vy *= 0.97;

      crystal.rotation += crystal.rotationSpeed;
      crystal.life = Math.max(0, crystal.life - 0.025);
    }
  }

  draw(context) {
    if (this.isFinished) return;

    switch (this.phase) {
      case "CHARGE":
        this.drawCharge(context);
        break;

      case "BEAM":
        this.drawBeam(context);
        break;

      case "IMPACT":
        this.drawImpact(context);
        break;

      case "SHATTER":
        this.drawShatter(context);
        break;
    }
  }

  // --------------------------------------------------
  // CHARGE : concentration de l'énergie glaciale
  // --------------------------------------------------

  drawCharge(context) {
    const x = this.startX;
    const y = this.startY;

    const progress = this.timer / this.chargeDuration;
    const pulse = 1 + Math.sin(this.timer * 0.65) * 0.18;

    const radius = (5 + progress * 5) * pulse;

    context.save();

    // Halo extérieur.
    context.globalAlpha = 0.35 + progress * 0.3;
    context.fillStyle = "#42caff";
    context.shadowColor = "#62dcff";
    context.shadowBlur = 20;

    context.beginPath();
    context.arc(x, y, radius * 2.3, 0, Math.PI * 2);
    context.fill();

    // Sphère centrale.
    context.globalAlpha = 0.95;
    context.fillStyle = "#9beaff";
    context.shadowBlur = 14;

    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();

    // Cœur blanc.
    context.globalAlpha = 1;
    context.fillStyle = "#ffffff";
    context.shadowBlur = 8;

    context.beginPath();
    context.arc(x, y, radius * 0.45, 0, Math.PI * 2);
    context.fill();

    context.shadowBlur = 0;

    // Cristaux orbitaux.
    for (const particle of this.chargeParticles) {
      const px = x + Math.cos(particle.angle) * particle.radius;

      const py = y + Math.sin(particle.angle) * particle.radius;

      context.save();
      context.translate(px, py);
      context.rotate(particle.angle);

      context.globalAlpha = 0.6 + Math.random() * 0.4;
      context.fillStyle = "#d9faff";

      context.beginPath();
      context.moveTo(0, -particle.size * 2);
      context.lineTo(particle.size, 0);
      context.lineTo(0, particle.size * 2);
      context.lineTo(-particle.size, 0);
      context.closePath();

      context.fill();
      context.restore();
    }

    context.restore();
  }

  // --------------------------------------------------
  // BEAM : rayon de glace
  // --------------------------------------------------

  drawBeam(context) {
    const pulse = Math.sin(this.timer * 0.9) * 1.5;
    const width = 8 + pulse;

    const length = this.distance * this.beamProgress;

    context.save();

    context.translate(this.startX, this.startY);
    context.rotate(this.angle);

    context.lineCap = "round";

    // Halo extérieur.
    context.globalAlpha = 0.35;
    context.strokeStyle = "#36aaff";
    context.lineWidth = width * 3.5;
    context.shadowColor = "#55cfff";
    context.shadowBlur = 18;

    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(length, 0);
    context.stroke();

    // Deuxième couche lumineuse.
    context.globalAlpha = 0.75;
    context.strokeStyle = "#42bfff";
    context.lineWidth = width * 1.8;
    context.shadowBlur = 12;

    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(length, 0);
    context.stroke();

    // Faisceau bleu clair.
    context.globalAlpha = 1;
    context.strokeStyle = "#91eaff";
    context.lineWidth = width;
    context.shadowBlur = 8;

    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(length, 0);
    context.stroke();

    // Cœur blanc.
    context.strokeStyle = "#ffffff";
    context.lineWidth = width * 0.35;
    context.shadowColor = "#ffffff";
    context.shadowBlur = 6;

    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(length, 0);
    context.stroke();

    // Particules qui circulent dans le faisceau.
    context.shadowBlur = 5;

    for (const particle of this.beamParticles) {
      const x = length * particle.progress;
      const y = particle.offset;

      context.globalAlpha = 0.6 + Math.random() * 0.4;
      context.fillStyle = "#ffffff";

      context.beginPath();
      context.arc(x, y, particle.size, 0, Math.PI * 2);
      context.fill();
    }

    // Éclats sur les bords du rayon.
    for (let i = 0; i < 7; i++) {
      const x = Math.random() * length;
      const y = (Math.random() - 0.5) * width * 1.8;

      context.globalAlpha = Math.random() * 0.8;
      context.fillStyle = "#d9faff";

      context.fillRect(x, y, 2, 2);
    }

    context.restore();
  }

  // --------------------------------------------------
  // IMPACT : explosion de cristaux
  // --------------------------------------------------

  drawImpact(context) {
    const progress = this.timer / this.impactDuration;
    const radius = 5 + progress * 25;

    context.save();

    // Onde extérieure.
    context.globalAlpha = 1 - progress;
    context.strokeStyle = "#7bdfff";
    context.lineWidth = 3;
    context.shadowColor = "#55d5ff";
    context.shadowBlur = 12;

    context.beginPath();
    context.arc(this.endX, this.endY, radius, 0, Math.PI * 2);
    context.stroke();

    // Deuxième onde.
    context.globalAlpha = (1 - progress) * 0.7;
    context.lineWidth = 1.5;

    context.beginPath();
    context.arc(this.endX, this.endY, radius * 0.65, 0, Math.PI * 2);
    context.stroke();

    // Flash central.
    const flashRadius = 13 * (1 - progress);

    context.globalAlpha = 1 - progress * 0.8;
    context.fillStyle = "#ffffff";
    context.shadowColor = "#9beaff";
    context.shadowBlur = 20;

    context.beginPath();
    context.arc(this.endX, this.endY, flashRadius, 0, Math.PI * 2);
    context.fill();

    context.restore();

    this.drawCrystals(context);
    this.drawParticles(context);
  }

  drawCrystals(context) {
    context.save();

    for (const crystal of this.crystals) {
      if (crystal.life <= 0) continue;

      context.save();

      context.translate(crystal.x, crystal.y);
      context.rotate(crystal.rotation);

      context.globalAlpha = crystal.life;

      // Contour lumineux.
      context.shadowColor = "#69dfff";
      context.shadowBlur = 8;

      context.fillStyle = "#a5eaff";
      context.strokeStyle = "#ffffff";
      context.lineWidth = 1;

      context.beginPath();
      context.moveTo(0, -crystal.size);
      context.lineTo(crystal.size * 0.45, 0);
      context.lineTo(0, crystal.size);
      context.lineTo(-crystal.size * 0.45, 0);
      context.closePath();

      context.fill();
      context.stroke();

      // Reflet intérieur.
      context.shadowBlur = 0;
      context.fillStyle = "#ffffff";
      context.globalAlpha = crystal.life * 0.8;

      context.beginPath();
      context.moveTo(0, -crystal.size * 0.65);
      context.lineTo(crystal.size * 0.15, 0);
      context.lineTo(0, crystal.size * 0.25);
      context.closePath();

      context.fill();

      context.restore();
    }

    context.restore();
  }

  // --------------------------------------------------
  // SHATTER : éclatement final
  // --------------------------------------------------

  drawShatter(context) {
    this.drawCrystals(context);
    this.drawParticles(context);
  }

  drawParticles(context) {
    context.save();

    for (const particle of this.particles) {
      context.globalAlpha = particle.life;

      context.fillStyle = "#e6fbff";
      context.shadowColor = "#69dfff";
      context.shadowBlur = 7;

      context.beginPath();
      context.arc(
        particle.x,
        particle.y,
        particle.size * particle.life,
        0,
        Math.PI * 2
      );
      context.fill();
    }

    context.restore();
  }

  restorePositions() {
    this.attacker.position.x = this.originalAttackerX;
    this.attacker.position.y = this.originalAttackerY;

    this.target.position.x = this.originalTargetX;
    this.target.position.y = this.originalTargetY;
  }
}
