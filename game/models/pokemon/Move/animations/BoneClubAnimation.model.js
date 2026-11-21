export class BoneClubAnimation {
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

    this.attackerCenter = {
      x: this.attacker.position.x + this.attacker.frameWidth / 2,
      y: this.attacker.position.y + this.attacker.frameHeight / 2,
    };

    this.targetCenter = {
      x: this.target.position.x + this.target.frameWidth / 2,
      y: this.target.position.y + this.target.frameHeight / 2,
    };

    const dx = this.targetCenter.x - this.attackerCenter.x;
    const dy = this.targetCenter.y - this.attackerCenter.y;

    this.distance = Math.hypot(dx, dy) || 1;
    this.directionX = dx / this.distance;
    this.directionY = dy / this.distance;

    this.perpendicularX = -this.directionY;
    this.perpendicularY = this.directionX;

    this.phase = "MATERIALIZE";
    this.frame = 0;
    this.isFinished = false;

    this.duration = {
      MATERIALIZE: 18,
      PREPARE: 22,
      SWING: 15,
      IMPACT: 24,
      FINISH: 14,
    };

    this.originalAttackerPosition = {
      x: this.attacker.position.x,
      y: this.attacker.position.y,
    };

    this.originalTargetPosition = {
      x: this.target.position.x,
      y: this.target.position.y,
    };

    this.weapon = {
      x: this.attackerCenter.x,
      y: this.attackerCenter.y,
      angle: -Math.PI * 0.7,
      scale: 0,
      alpha: 0,
    };

    this.attackerOffset = { x: 0, y: 0 };
    this.targetOffset = { x: 0, y: 0 };

    this.particles = [];
    this.speedLines = [];
    this.rings = [];
    this.cracks = [];
    this.dust = [];

    this.flash = 0;
    this.impactPower = 0;
    this.shakeTriggered = false;

    this.createMaterializeParticles();
  }

  changePhase(phase) {
    this.phase = phase;
    this.frame = 0;
  }

  update(context) {
    if (this.isFinished) return;

    switch (this.phase) {
      case "MATERIALIZE":
        this.updateMaterialize();
        break;

      case "PREPARE":
        this.updatePrepare();
        break;

      case "SWING":
        this.updateSwing();
        break;

      case "IMPACT":
        this.updateImpact();
        break;

      case "FINISH":
        this.updateFinish();
        break;
    }

    this.updateParticles();
    this.updateSpeedLines();
    this.updateRings();
    this.updateCracks();
    this.updateDust();

    this.applySpritePositions();
    this.draw(context);

    this.frame++;
  }

  easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  easeIn(t) {
    return t * t * t;
  }

  createMaterializeParticles() {
    for (let i = 0; i < 14; i++) {
      const angle = Math.random() * Math.PI * 2;

      this.particles.push({
        x: this.attackerCenter.x,
        y: this.attackerCenter.y,
        vx: Math.cos(angle) * (0.5 + Math.random()),
        vy: Math.sin(angle) * (0.5 + Math.random()),
        size: 1 + Math.random() * 2,
        alpha: 1,
        life: 18 + Math.random() * 12,
        color: "#fff0c9",
      });
    }
  }

  createParticles(x, y, count, power, colors = ["#fff0c9", "#ffffff"]) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.6 + Math.random() * power;

      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 1.5 + Math.random() * 3,
        alpha: 1,
        life: 16 + Math.random() * 18,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
  }

  createSpeedLines() {
    for (let i = 0; i < 12; i++) {
      const offset = (Math.random() - 0.5) * 35;

      this.speedLines.push({
        x: this.weapon.x + this.perpendicularX * offset,
        y: this.weapon.y + this.perpendicularY * offset,
        length: 7 + Math.random() * 13,
        alpha: 0.9,
        width: 1 + Math.random() * 1.5,
      });
    }
  }

  createRing(x, y, maxRadius = 30) {
    this.rings.push({
      x,
      y,
      radius: 4,
      maxRadius,
      alpha: 1,
    });
  }

  createCracks(x, y) {
    for (let i = 0; i < 9; i++) {
      const angle = (Math.PI * 2 * i) / 9 + Math.random() * 0.3;
      const length = 8 + Math.random() * 13;

      this.cracks.push({
        x,
        y,
        angle,
        length,
        alpha: 1,
      });
    }
  }

  createDust(x, y) {
    for (let i = 0; i < 16; i++) {
      this.dust.push({
        x: x + (Math.random() - 0.5) * 18,
        y: y + (Math.random() - 0.5) * 8,
        vx: (Math.random() - 0.5) * 2.5,
        vy: -0.5 - Math.random() * 2,
        size: 2 + Math.random() * 3,
        alpha: 0.8,
        life: 20 + Math.random() * 12,
      });
    }
  }

  updateMaterialize() {
    const progress = Math.min(1, this.frame / this.duration.MATERIALIZE);
    const eased = this.easeOut(progress);

    this.weapon.scale = eased;
    this.weapon.alpha = eased;

    this.weapon.x = this.attackerCenter.x + this.directionX * 9;
    this.weapon.y = this.attackerCenter.y - 8;

    this.weapon.angle = -Math.PI * 0.7;

    if (this.frame % 4 === 0) {
      this.createParticles(this.weapon.x, this.weapon.y, 3, 1.5);
    }

    if (this.frame >= this.duration.MATERIALIZE) {
      this.changePhase("PREPARE");
    }
  }

  updatePrepare() {
    const progress = Math.min(1, this.frame / this.duration.PREPARE);

    const lift = Math.sin((progress * Math.PI) / 2);

    this.weapon.scale = 1;
    this.weapon.alpha = 1;

    this.weapon.x =
      this.attackerCenter.x +
      this.directionX * (8 + lift * 5) -
      this.perpendicularX * 5;

    this.weapon.y = this.attackerCenter.y - 13 - lift * 12;

    this.weapon.angle = -Math.PI * 0.7 - lift * 0.5;

    this.attackerOffset.x = -this.directionX * lift * 3;
    this.attackerOffset.y = -lift * 2;

    if (this.frame % 7 === 0) {
      this.createParticles(this.weapon.x, this.weapon.y, 2, 0.8);
    }

    if (this.frame >= this.duration.PREPARE) {
      this.changePhase("SWING");
    }
  }

  updateSwing() {
    const progress = Math.min(1, this.frame / this.duration.SWING);
    const eased = this.easeIn(progress);

    const startAngle = -Math.PI * 1.2;
    const endAngle = Math.PI * 0.1;

    this.weapon.angle = startAngle + (endAngle - startAngle) * eased;

    const radius = 15;

    this.weapon.x =
      this.attackerCenter.x +
      this.directionX * radius +
      this.perpendicularX * Math.sin(this.weapon.angle) * 5;

    this.weapon.y =
      this.attackerCenter.y + Math.sin(this.weapon.angle) * radius;

    this.attackerOffset.x = this.directionX * eased * 3;
    this.attackerOffset.y = eased * 2;

    if (this.frame % 2 === 0) {
      this.createSpeedLines();
    }

    if (progress > 0.55) {
      this.weapon.scale = 1 + (progress - 0.55) * 0.5;
    }

    if (this.frame >= this.duration.SWING) {
      this.weapon.x = this.targetCenter.x;
      this.weapon.y = this.targetCenter.y;

      this.triggerImpact();
      this.changePhase("IMPACT");
    }
  }

  triggerImpact() {
    this.flash = 1;
    this.impactPower = 1;

    this.targetOffset.x = this.directionX * 13;
    this.targetOffset.y = this.directionY * 13 + 4;

    this.createParticles(this.targetCenter.x, this.targetCenter.y, 28, 3.5, [
      "#fff0c9",
      "#ffffff",
      "#e8d2a5",
      "#d6b98b",
    ]);

    this.createRing(this.targetCenter.x, this.targetCenter.y, 36);

    this.createCracks(this.targetCenter.x, this.targetCenter.y);

    this.createDust(this.targetCenter.x, this.targetCenter.y + 10);

    this.game.canvas.startShake?.(8, 260);
  }

  updateImpact() {
    const progress = this.frame / this.duration.IMPACT;

    this.flash = Math.max(0, 1 - progress);
    this.impactPower = Math.max(0, 1 - progress);

    this.targetOffset.x *= 0.78;
    this.targetOffset.y *= 0.78;

    this.weapon.scale = 1.2 - progress * 0.2;
    this.weapon.angle += 0.06;

    if (this.frame % 5 === 0) {
      this.createParticles(this.targetCenter.x, this.targetCenter.y, 3, 1.5);
    }

    if (this.frame >= this.duration.IMPACT) {
      this.changePhase("FINISH");
    }
  }

  updateFinish() {
    this.weapon.alpha *= 0.78;
    this.weapon.scale *= 0.94;

    this.attackerOffset.x *= 0.75;
    this.attackerOffset.y *= 0.75;

    this.targetOffset.x *= 0.75;
    this.targetOffset.y *= 0.75;

    if (this.frame >= this.duration.FINISH) {
      this.restoreSprites();
      this.isFinished = true;
    }
  }

  applySpritePositions() {
    this.attacker.position.x =
      this.originalAttackerPosition.x + this.attackerOffset.x;

    this.attacker.position.y =
      this.originalAttackerPosition.y + this.attackerOffset.y;

    this.target.position.x =
      this.originalTargetPosition.x + this.targetOffset.x;

    this.target.position.y =
      this.originalTargetPosition.y + this.targetOffset.y;
  }

  restoreSprites() {
    this.attacker.position.x = this.originalAttackerPosition.x;
    this.attacker.position.y = this.originalAttackerPosition.y;

    this.target.position.x = this.originalTargetPosition.x;
    this.target.position.y = this.originalTargetPosition.y;
  }

  updateParticles() {
    this.particles = this.particles.filter((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      particle.vx *= 0.94;
      particle.vy *= 0.94;

      particle.alpha -= 1 / particle.life;
      particle.life--;

      return particle.life > 0 && particle.alpha > 0;
    });
  }

  updateSpeedLines() {
    this.speedLines = this.speedLines.filter((line) => {
      line.alpha -= 0.12;
      return line.alpha > 0;
    });
  }

  updateRings() {
    this.rings = this.rings.filter((ring) => {
      ring.radius += (ring.maxRadius - ring.radius) * 0.18;
      ring.alpha -= 0.07;

      return ring.alpha > 0;
    });
  }

  updateCracks() {
    this.cracks = this.cracks.filter((crack) => {
      crack.alpha -= 0.045;
      return crack.alpha > 0;
    });
  }

  updateDust() {
    this.dust = this.dust.filter((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      particle.vx *= 0.96;
      particle.vy *= 0.94;

      particle.alpha -= 1 / particle.life;
      particle.life--;

      return particle.life > 0 && particle.alpha > 0;
    });
  }

  draw(context) {
    this.drawDust(context);
    this.drawCracks(context);
    this.drawRings(context);
    this.drawSpeedLines(context);
    this.drawParticles(context);
    this.drawWeapon(context);
    this.drawImpact(context);
  }

  drawWeapon(context) {
    if (this.weapon.alpha <= 0.01) return;

    context.save();

    context.translate(this.weapon.x, this.weapon.y);
    context.rotate(this.weapon.angle);
    context.scale(this.weapon.scale, this.weapon.scale);

    context.globalAlpha = this.weapon.alpha;

    const length = 17;

    // Ombre.
    context.fillStyle = "rgba(50, 35, 20, 0.3)";
    context.beginPath();
    context.ellipse(1, 3, length + 3, 6, 0, 0, Math.PI * 2);
    context.fill();

    // Corps de l'os.
    const gradient = context.createLinearGradient(0, -6, 0, 6);

    gradient.addColorStop(0, "#fff8e5");
    gradient.addColorStop(0.45, "#ead6ae");
    gradient.addColorStop(1, "#b89968");

    context.fillStyle = gradient;
    context.strokeStyle = "#92764d";
    context.lineWidth = 1;

    context.beginPath();

    context.moveTo(-length + 3, -2);
    context.lineTo(-length + 1, -5);
    context.lineTo(-length - 3, -5);
    context.lineTo(-length - 5, -2);
    context.lineTo(-length - 4, 2);
    context.lineTo(-length - 1, 5);
    context.lineTo(-length + 3, 4);

    context.lineTo(length - 3, 4);
    context.lineTo(length + 1, 5);
    context.lineTo(length + 5, 2);
    context.lineTo(length + 4, -2);
    context.lineTo(length + 1, -5);
    context.lineTo(length - 3, -2);

    context.closePath();
    context.fill();
    context.stroke();

    // Extrémités arrondies et épaisses.
    [-length, length].forEach((x) => {
      context.fillStyle = "#fff0c9";

      context.beginPath();
      context.ellipse(x, 0, 5, 5.5, 0, 0, Math.PI * 2);
      context.fill();
      context.stroke();
    });

    // Reflet.
    context.strokeStyle = "rgba(255,255,255,0.85)";
    context.lineWidth = 1.2;

    context.beginPath();
    context.moveTo(-length + 5, -1);
    context.lineTo(length - 5, -1);
    context.stroke();

    context.restore();
  }

  drawSpeedLines(context) {
    this.speedLines.forEach((line) => {
      context.save();

      context.globalAlpha = Math.max(0, line.alpha);
      context.strokeStyle = "#fff0c9";
      context.lineWidth = line.width;
      context.lineCap = "round";

      context.beginPath();
      context.moveTo(line.x, line.y);

      context.lineTo(
        line.x - this.directionX * line.length,
        line.y - this.directionY * line.length
      );

      context.stroke();
      context.restore();
    });
  }

  drawParticles(context) {
    this.particles.forEach((particle) => {
      context.save();

      context.globalAlpha = Math.max(0, particle.alpha);
      context.fillStyle = particle.color;
      context.shadowColor = "#fff0c9";
      context.shadowBlur = 6;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);

      context.fill();
      context.restore();
    });
  }

  drawRings(context) {
    this.rings.forEach((ring) => {
      context.save();

      context.globalAlpha = Math.max(0, ring.alpha);
      context.strokeStyle = "#fff0c9";
      context.lineWidth = 2;

      context.beginPath();
      context.ellipse(
        ring.x,
        ring.y,
        ring.radius * 1.3,
        ring.radius * 0.65,
        0,
        0,
        Math.PI * 2
      );

      context.stroke();
      context.restore();
    });
  }

  drawCracks(context) {
    this.cracks.forEach((crack) => {
      context.save();

      context.translate(crack.x, crack.y);
      context.rotate(crack.angle);

      context.globalAlpha = Math.max(0, crack.alpha);
      context.strokeStyle = "#e8d2a5";
      context.lineWidth = 1.5;

      context.beginPath();
      context.moveTo(3, 0);
      context.lineTo(crack.length * 0.5, -2);
      context.lineTo(crack.length, 1);
      context.stroke();

      context.restore();
    });
  }

  drawDust(context) {
    this.dust.forEach((particle) => {
      context.save();

      context.globalAlpha = Math.max(0, particle.alpha);
      context.fillStyle = "#d6c3a1";

      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);

      context.fill();
      context.restore();
    });
  }

  drawImpact(context) {
    if (this.flash <= 0.01) return;

    context.save();

    context.globalAlpha = this.flash * 0.65;
    context.fillStyle = "#ffffff";

    context.beginPath();
    context.arc(
      this.targetCenter.x,
      this.targetCenter.y,
      8 + this.impactPower * 15,
      0,
      Math.PI * 2
    );

    context.fill();
    context.restore();
  }
}
