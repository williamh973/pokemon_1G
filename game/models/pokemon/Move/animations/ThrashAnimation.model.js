export class ThrashAnimation {
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

    this.originalAttackerPosition = {
      x: this.attacker.position.x,
      y: this.attacker.position.y,
    };

    this.originalTargetPosition = {
      x: this.target.position.x,
      y: this.target.position.y,
    };

    this.attackerCenter = {
      x: this.originalAttackerPosition.x + this.attacker.frameWidth / 2,
      y: this.originalAttackerPosition.y + this.attacker.frameHeight / 2,
    };

    this.targetCenter = {
      x: this.originalTargetPosition.x + this.target.frameWidth / 2,
      y: this.originalTargetPosition.y + this.target.frameHeight / 2,
    };

    const dx = this.targetCenter.x - this.attackerCenter.x;
    const dy = this.targetCenter.y - this.attackerCenter.y;
    const distance = Math.hypot(dx, dy) || 1;

    this.directionX = dx / distance;
    this.directionY = dy / distance;

    this.perpendicularX = -this.directionY;
    this.perpendicularY = this.directionX;

    this.phase = "RAGE";
    this.frame = 0;
    this.isFinished = false;

    this.duration = {
      RAGE: 24,
      ATTACK: 4,
      RECOVER: 4,
      FINAL_ATTACK: 12,
      FINAL_IMPACT: 28,
      EXHAUSTION: 24,
    };

    this.attackCount = 0;
    this.maxAttacks = 3;

    this.attackDistance = Math.min(48, distance * 0.42);
    this.finalAttackDistance = Math.min(58, distance * 0.5);

    this.currentAttackDistance = 0;
    this.currentAttackAngle = 0;

    this.aura = 0;
    this.auraRotation = 0;
    this.impactFlash = 0;

    this.afterimages = [];
    this.speedLines = [];
    this.particles = [];
    this.shockwaves = [];
    this.debris = [];
    this.stars = [];
    this.energyArcs = [];

    this.shakeTriggered = false;

    this.attackOffsets = [
      { x: 0, y: -5 },
      { x: -4, y: 7 },
      { x: 5, y: -2 },
    ];

    this.createRageParticles();
    this.battleBackgroundEffectManager.startColorChange("BLACK", 0.85);
  }

  getCenter(attacker) {
    return {
      x: attacker.position.x + attacker.frameWidth / 2,
      y: attacker.position.y + attacker.frameHeight / 2,
    };
  }

  random(min, max) {
    return min + Math.random() * (max - min);
  }

  clamp(value) {
    return Math.max(0, Math.min(1, value));
  }

  easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  easeIn(t) {
    return t * t * t;
  }

  easeInOut(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  changePhase(phase) {
    this.phase = phase;
    this.frame = 0;
  }

  update(context) {
    if (this.isFinished) return;

    this.frame++;

    switch (this.phase) {
      case "RAGE":
        this.updateRage();
        break;

      case "ATTACK":
        this.updateAttack();
        break;

      case "RECOVER":
        this.updateRecover();
        break;

      case "FINAL_ATTACK":
        this.updateFinalAttack();
        break;

      case "FINAL_IMPACT":
        this.updateFinalImpact();
        break;

      case "EXHAUSTION":
        this.updateExhaustion();
        break;
    }

    this.updateEffects();
    this.draw(context);
  }

  createRageParticles() {
    for (let i = 0; i < 30; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = this.random(0.5, 2);

      this.particles.push({
        x: this.attackerCenter.x,
        y: this.attackerCenter.y,

        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,

        size: this.random(2, 5),
        alpha: 1,

        life: this.random(25, 50),
        maxLife: 50,

        color: this.randomRageColor(),
        type: "RAGE",
      });
    }
  }

  drawShockwaves(context) {
    context.save();

    this.shockwaves.forEach((wave, index) => {
      context.save();

      context.globalAlpha = wave.alpha;
      context.strokeStyle = index % 2 === 0 ? "#ffb56b" : "#ffe18b";
      context.lineWidth = wave.width;

      const segments = 12;
      const innerRadius = wave.radius * 0.72;
      const outerRadius = wave.radius;

      context.beginPath();

      for (let i = 0; i <= segments; i++) {
        const angle = (Math.PI * 2 * i) / segments;
        const radius = i % 2 === 0 ? outerRadius : innerRadius;

        const x = wave.x + Math.cos(angle) * radius;
        const y = wave.y + Math.sin(angle) * radius * 0.55;

        if (i === 0) {
          context.moveTo(x, y);
        } else {
          context.lineTo(x, y);
        }
      }

      context.closePath();
      context.stroke();

      context.restore();
    });

    context.restore();
  }

  randomRageColor() {
    const colors = ["#ffef9c", "#ffbd62", "#ff8155", "#ff4c4c", "#ffcf8a"];

    return colors[Math.floor(Math.random() * colors.length)];
  }

  updateRage() {
    const progress = this.clamp(this.frame / this.duration.RAGE);

    this.aura = this.easeInOut(progress);
    this.auraRotation += 0.22 + progress * 0.2;

    // Le Pokémon tremble sous l'effet de la rage.
    const shake = Math.sin(this.frame * 2.8) * (1 + progress * 2);

    this.attacker.position.x = this.originalAttackerPosition.x + shake;

    this.attacker.position.y =
      this.originalAttackerPosition.y +
      Math.cos(this.frame * 2.2) * (1 + progress * 2);

    if (this.frame % 2 === 0) {
      this.createRageParticles();
      this.createEnergyArc();
    }

    if (this.frame % 3 === 0) {
      this.createSpeedLine();
    }

    if (this.frame >= this.duration.RAGE) {
      this.restoreAttackerPosition();
      this.attackCount = 0;
      this.changePhase("ATTACK");
    }
  }

  updateAttack() {
    const progress = this.clamp(this.frame / this.duration.ATTACK);

    const movement = this.easeOut(progress);

    const offset = this.attackOffsets[this.attackCount];

    this.currentAttackDistance = this.attackDistance;

    this.attacker.position.x =
      this.originalAttackerPosition.x +
      this.directionX * this.attackDistance * movement +
      this.perpendicularX * offset.x * movement;

    this.attacker.position.y =
      this.originalAttackerPosition.y +
      this.directionY * this.attackDistance * movement +
      this.perpendicularY * offset.y * movement;

    if (this.frame === 1) {
      this.createAfterimage();
      this.createAttackBurst();
      this.createSpeedBurst();
    }

    if (progress >= 1) {
      this.triggerImpact(false);

      this.attackCount++;
      this.changePhase("RECOVER");
    }
  }

  updateRecover() {
    const progress = this.clamp(this.frame / this.duration.RECOVER);

    const movement = 1 - this.easeOut(progress);

    const offset = this.attackOffsets[Math.max(0, this.attackCount - 1)];

    this.attacker.position.x =
      this.originalAttackerPosition.x +
      this.directionX * this.attackDistance * 0.12 * movement +
      this.perpendicularX * offset.x * 0.12 * movement;

    this.attacker.position.y =
      this.originalAttackerPosition.y +
      this.directionY * this.attackDistance * 0.12 * movement +
      this.perpendicularY * offset.y * 0.12 * movement;

    if (this.frame % 2 === 0) {
      this.createRageParticles();
    }

    if (this.frame >= this.duration.RECOVER) {
      this.restoreAttackerPosition();

      if (this.attackCount < this.maxAttacks) {
        this.changePhase("ATTACK");
      } else {
        this.changePhase("FINAL_ATTACK");
      }
    }
  }

  updateFinalAttack() {
    const progress = this.clamp(this.frame / this.duration.FINAL_ATTACK);

    const movement = this.easeInOut(progress);

    // Le dernier assaut est beaucoup plus ample.
    this.attacker.position.x =
      this.originalAttackerPosition.x +
      this.directionX * this.finalAttackDistance * movement;

    this.attacker.position.y =
      this.originalAttackerPosition.y +
      this.directionY * this.finalAttackDistance * movement;

    this.aura = Math.min(1.5, 1 + progress * 0.5);

    if (this.frame % 2 === 0) {
      this.createAfterimage();
      this.createSpeedBurst();
    }

    if (progress >= 1) {
      this.triggerImpact(true);
      this.changePhase("FINAL_IMPACT");
    }
  }

  triggerImpact(isFinal) {
    const intensity = isFinal ? 1.8 : 1;

    this.impactFlash = isFinal ? 1 : 0.45;

    if (this.game.canvas?.startShake) {
      this.game.canvas.startShake(isFinal ? 500 : 250, isFinal ? 20 : 7);
    }

    // Recul visuel de la cible.
    const recoil = isFinal ? 20 : 9;

    this.target.position.x =
      this.originalTargetPosition.x + this.directionX * recoil;

    this.target.position.y =
      this.originalTargetPosition.y + this.directionY * recoil;

    // Ondes de choc.
    for (let i = 0; i < (isFinal ? 7 : 3); i++) {
      this.shockwaves.push({
        x: this.targetCenter.x,
        y: this.targetCenter.y,
        radius: 5 + i * 7,
        alpha: 0.95,
        speed: isFinal ? 5 + i * 0.8 : 3.5 + i * 0.5,
        width: isFinal ? 3 : 2,
      });
    }

    // Explosion d'énergie.
    const particleCount = isFinal ? 65 : 24;

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = this.random(isFinal ? 2 : 1, isFinal ? 8 : 4);

      this.particles.push({
        x: this.targetCenter.x,
        y: this.targetCenter.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: this.random(2, isFinal ? 6 : 4),
        alpha: 1,
        life: this.random(20, isFinal ? 48 : 30),
        maxLife: isFinal ? 48 : 30,
        color: this.randomRageColor(),
        type: "BURST",
      });
    }

    if (isFinal) {
      this.createDebris();
      this.createStars();
      this.createFinalEnergyArcs();
    }
  }

  updateFinalImpact() {
    const progress = this.clamp(this.frame / this.duration.FINAL_IMPACT);

    this.impactFlash = Math.max(0, this.impactFlash - 0.045);

    this.aura = 1.5 - progress * 0.7;

    // Le Pokémon attaquant revient progressivement.
    const recoil = 1 - this.easeOut(progress);

    this.attacker.position.x =
      this.originalAttackerPosition.x +
      this.directionX * this.finalAttackDistance * recoil;

    this.attacker.position.y =
      this.originalAttackerPosition.y +
      this.directionY * this.finalAttackDistance * recoil;

    if (this.frame % 3 === 0) {
      this.createRageParticles();
    }

    if (this.frame >= this.duration.FINAL_IMPACT) {
      this.restorePositions();
      this.changePhase("EXHAUSTION");
    }
  }

  updateExhaustion() {
    const progress = this.clamp(this.frame / this.duration.EXHAUSTION);

    this.aura = 0.8 * (1 - this.easeOut(progress));

    if (this.frame % 5 === 0) {
      this.createExhaustionParticle();
    }

    if (this.frame >= this.duration.EXHAUSTION) {
      this.restorePositions();
      this.isFinished = true;
      this.battleBackgroundEffectManager.stopColorChange();
    }
  }

  createAfterimage() {
    this.afterimages.push({
      x: this.attacker.position.x,
      y: this.attacker.position.y,
      alpha: 0.55,
      scale: this.attacker.scale ?? 1,
    });
  }

  createAttackBurst() {
    for (let i = 0; i < 12; i++) {
      const angle = Math.random() * Math.PI * 2;

      this.particles.push({
        x: this.attackerCenter.x,
        y: this.attackerCenter.y,
        vx: Math.cos(angle) * this.random(1, 4),
        vy: Math.sin(angle) * this.random(1, 4),
        size: this.random(2, 4),
        alpha: 1,
        life: 20,
        maxLife: 20,
        color: this.randomRageColor(),
        type: "BURST",
      });
    }
  }

  createSpeedBurst() {
    for (let i = 0; i < 9; i++) {
      this.speedLines.push({
        x: this.attackerCenter.x,
        y: this.attackerCenter.y,
        offset: this.random(-22, 22),
        length: this.random(15, 35),
        alpha: 0.8,
        life: 12,
      });
    }
  }

  createSpeedLine() {
    this.speedLines.push({
      x: this.attackerCenter.x,
      y: this.attackerCenter.y,
      offset: this.random(-20, 20),
      length: this.random(10, 28),
      alpha: 0.7,
      life: 15,
    });
  }

  createEnergyArc() {
    this.energyArcs.push({
      angle: Math.random() * Math.PI * 2,
      radius: this.random(12, 26),
      alpha: 0.8,
      life: 15,
      width: this.random(1, 2.5),
    });
  }

  createFinalEnergyArcs() {
    for (let i = 0; i < 14; i++) {
      this.energyArcs.push({
        angle: Math.random() * Math.PI * 2,
        radius: this.random(12, 42),
        alpha: 1,
        life: this.random(15, 30),
        width: this.random(1, 3),
      });
    }
  }

  createDebris() {
    for (let i = 0; i < 30; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = this.random(2, 7);

      this.debris.push({
        x: this.targetCenter.x,
        y: this.targetCenter.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        size: this.random(2, 6),
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: this.random(-0.2, 0.2),
        alpha: 1,
        life: this.random(25, 45),
      });
    }
  }

  createStars() {
    for (let i = 0; i < 9; i++) {
      this.stars.push({
        x: this.targetCenter.x + this.random(-28, 28),
        y: this.targetCenter.y + this.random(-28, 28),
        size: this.random(3, 7),
        rotation: Math.random() * Math.PI,
        alpha: 1,
        life: this.random(20, 35),
      });
    }
  }

  createExhaustionParticle() {
    this.particles.push({
      x: this.attackerCenter.x + this.random(-12, 12),
      y: this.attackerCenter.y + this.random(-12, 12),
      vx: this.random(-0.5, 0.5),
      vy: this.random(-1.5, -0.5),
      size: this.random(1, 3),
      alpha: 0.7,
      life: 20,
      maxLife: 20,
      color: "#ffb77b",
      type: "BURST",
    });
  }

  updateEffects() {
    this.afterimages.forEach((image) => {
      image.alpha -= 0.08;
    });

    this.afterimages = this.afterimages.filter((image) => image.alpha > 0);

    this.speedLines.forEach((line) => {
      line.life--;
      line.alpha = Math.min(1, line.life / 5);
    });

    this.speedLines = this.speedLines.filter((line) => line.life > 0);

    this.particles.forEach((particle) => {
      if (particle.type === "BURST") {
        particle.x += particle.vx;
        particle.y += particle.vy;

        particle.vx *= 0.96;
        particle.vy *= 0.96;

        particle.life--;
        particle.alpha = Math.min(1, particle.life / 10);
      } else if (particle.type === "RAGE") {
        particle.x += particle.vx;
        particle.y += particle.vy;

        particle.vx *= 0.97;
        particle.vy *= 0.97;

        particle.life--;
        particle.alpha = Math.min(1, particle.life / 12);
      }
    });

    this.particles = this.particles.filter((particle) => particle.life > 0);

    this.shockwaves.forEach((wave) => {
      wave.radius += wave.speed;
      wave.alpha -= 0.035;
    });

    this.shockwaves = this.shockwaves.filter((wave) => wave.alpha > 0);

    this.debris.forEach((piece) => {
      piece.x += piece.vx;
      piece.y += piece.vy;

      piece.vy += 0.18;
      piece.vx *= 0.98;

      piece.rotation += piece.rotationSpeed;
      piece.life--;
      piece.alpha = Math.min(1, piece.life / 10);
    });

    this.debris = this.debris.filter((piece) => piece.life > 0);

    this.stars.forEach((star) => {
      star.rotation += 0.12;
      star.life--;
      star.alpha = Math.min(1, star.life / 8);
    });

    this.stars = this.stars.filter((star) => star.life > 0);

    this.energyArcs.forEach((arc) => {
      arc.life--;
      arc.alpha = Math.min(1, arc.life / 8);
    });

    this.energyArcs = this.energyArcs.filter((arc) => arc.life > 0);
  }

  restoreAttackerPosition() {
    this.attacker.position.x = this.originalAttackerPosition.x;
    this.attacker.position.y = this.originalAttackerPosition.y;
  }

  restorePositions() {
    this.restoreAttackerPosition();

    this.target.position.x = this.originalTargetPosition.x;
    this.target.position.y = this.originalTargetPosition.y;
  }

  draw(context) {
    this.drawAfterimages(context);
    this.drawAura(context);
    this.drawEnergyArcs(context);
    this.drawSpeedLines(context);
    this.drawParticles(context);
    this.drawShockwaves(context);
    this.drawDebris(context);
    this.drawStars(context);
    this.drawFlash(context);
  }

  drawAfterimages(context) {
    context.save();

    this.afterimages.forEach((image) => {
      context.globalAlpha = image.alpha * 0.45;
      context.fillStyle = "#ff8b55";

      context.beginPath();
      context.arc(
        image.x + this.attacker.frameWidth / 2,
        image.y + this.attacker.frameHeight / 2,
        10 * image.scale,
        0,
        Math.PI * 2
      );
      context.fill();
    });

    context.restore();
  }

  drawAura(context) {
    if (this.aura <= 0) return;

    context.save();

    const center = this.getCenter(this.attacker);
    const radius = 23 + this.aura * 13;

    const gradient = context.createRadialGradient(
      center.x,
      center.y,
      2,
      center.x,
      center.y,
      radius
    );

    gradient.addColorStop(0, "rgba(255,230,150,0.35)");

    gradient.addColorStop(0.45, "rgba(255,100,55,0.28)");

    gradient.addColorStop(1, "rgba(255,50,40,0)");

    context.globalAlpha = Math.min(1, this.aura);
    context.fillStyle = gradient;

    context.beginPath();
    context.arc(center.x, center.y, radius, 0, Math.PI * 2);
    context.fill();

    // Arcs circulaires autour du Pokémon.
    for (let i = 0; i < 3; i++) {
      const angle = this.auraRotation + (i * Math.PI * 2) / 3;

      context.globalAlpha = Math.min(1, this.aura) * 0.65;
      context.strokeStyle = i === 1 ? "#fff0a5" : "#ff7950";
      context.lineWidth = 2;

      context.beginPath();
      context.arc(
        center.x,
        center.y,
        radius * (0.55 + i * 0.12),
        angle,
        angle + Math.PI * 0.75
      );
      context.stroke();
    }

    context.restore();
  }

  drawEnergyArcs(context) {
    context.save();

    const center = this.getCenter(this.attacker);

    this.energyArcs.forEach((arc) => {
      const startAngle = arc.angle;
      const endAngle = arc.angle + Math.PI * 0.55;

      context.globalAlpha = arc.alpha;
      context.strokeStyle = "#ffe18b";
      context.lineWidth = arc.width;

      context.beginPath();
      context.arc(center.x, center.y, arc.radius, startAngle, endAngle);
      context.stroke();
    });

    context.restore();
  }

  drawSpeedLines(context) {
    context.save();

    this.speedLines.forEach((line) => {
      context.globalAlpha = line.alpha;
      context.strokeStyle = "#ffbd77";
      context.lineWidth = 1.5;

      const startX = line.x - this.directionX * line.length;

      const startY = line.y - this.directionY * line.length;

      const endX = startX + this.perpendicularX * line.offset;

      const endY = startY + this.perpendicularY * line.offset;

      context.beginPath();
      context.moveTo(startX, startY);
      context.lineTo(endX, endY);
      context.stroke();
    });

    context.restore();
  }

  drawParticles(context) {
    context.save();

    this.particles.forEach((particle) => {
      context.save();

      context.translate(particle.x, particle.y);

      // Orientation dans le sens du déplacement.
      const angle = Math.atan2(particle.vy, particle.vx);
      context.rotate(angle);

      context.globalAlpha = particle.alpha;
      context.fillStyle = particle.color;

      // Éclat effilé.
      context.beginPath();
      context.moveTo(particle.size * 1.8, 0);
      context.quadraticCurveTo(
        particle.size * 0.4,
        -particle.size,
        -particle.size,
        -particle.size * 0.35
      );
      context.quadraticCurveTo(
        -particle.size * 0.2,
        0,
        -particle.size,
        particle.size * 0.35
      );
      context.quadraticCurveTo(
        particle.size * 0.4,
        particle.size,
        particle.size * 1.8,
        0
      );

      context.closePath();
      context.fill();

      context.restore();
    });

    context.restore();
  }

  drawDebris(context) {
    context.save();

    this.debris.forEach((piece) => {
      context.save();

      context.translate(piece.x, piece.y);
      context.rotate(piece.rotation);

      context.globalAlpha = piece.alpha;
      context.fillStyle = "#ff9c65";

      context.fillRect(
        -piece.size / 2,
        -piece.size / 2,
        piece.size,
        piece.size
      );

      context.restore();
    });

    context.restore();
  }

  drawStars(context) {
    context.save();

    this.stars.forEach((star) => {
      context.save();

      context.translate(star.x, star.y);
      context.rotate(star.rotation);

      context.globalAlpha = star.alpha;
      context.fillStyle = "#fff2ae";

      context.beginPath();

      for (let i = 0; i < 8; i++) {
        const radius = i % 2 === 0 ? star.size : star.size * 0.3;
        const angle = (Math.PI * 2 * i) / 8;

        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        if (i === 0) {
          context.moveTo(x, y);
        } else {
          context.lineTo(x, y);
        }
      }

      context.closePath();
      context.fill();

      context.restore();
    });

    context.restore();
  }

  drawFlash(context) {
    if (this.impactFlash <= 0) return;

    context.save();

    context.globalAlpha = this.impactFlash * 0.25;
    context.fillStyle = "#fff0bd";

    context.beginPath();
    context.arc(this.targetCenter.x, this.targetCenter.y, 48, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }
}
