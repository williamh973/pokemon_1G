export class StompAnimation {
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

    this.originalAttackerPosition = {
      x: this.attacker.position.x,
      y: this.attacker.position.y,
    };

    this.originalTargetPosition = {
      x: this.target.position.x,
      y: this.target.position.y,
    };

    this.direction =
      Math.sign(
        this.originalTargetPosition.x - this.originalAttackerPosition.x
      ) || 1;

    this.impactX = this.originalTargetPosition.x + this.target.frameWidth / 2;

    this.impactY =
      this.originalTargetPosition.y +
      this.target.frameHeight * (this.target.scale || 1) * 0.86;

    this.timer = 0;
    this.duration = 96;
    this.isFinished = false;
    this.hasShaken = false;

    this.flashAlpha = 0;
    this.dustAlpha = 0;

    this.rings = [
      { delay: 0, speed: 4.8, width: 4 },
      { delay: 4, speed: 3.8, width: 3 },
      { delay: 9, speed: 3.1, width: 2 },
      { delay: 15, speed: 2.5, width: 1.5 },
    ];

    this.debris = Array.from({ length: 38 }, (_, i) => {
      const angle = (Math.PI * 2 * i) / 38 + (Math.random() - 0.5) * 0.2;

      return {
        angle,
        speed: 1.8 + Math.random() * 4.5,
        size: 2 + Math.random() * 5,
        delay: Math.random() * 7,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.3,
        color: i % 3 === 0 ? "#d9c49d" : "#8f7960",
      };
    });

    this.dust = Array.from({ length: 24 }, () => ({
      side: Math.random() < 0.5 ? -1 : 1,
      speed: 0.8 + Math.random() * 2.8,
      height: 4 + Math.random() * 16,
      size: 3 + Math.random() * 6,
      delay: Math.random() * 12,
    }));

    this.cracks = Array.from({ length: 9 }, (_, i) => ({
      angle: (Math.PI * 2 * i) / 9 + (Math.random() - 0.5) * 0.3,
      length: 13 + Math.random() * 18,
      branches: Math.random() > 0.5,
    }));
  }

  update(context) {
    if (this.isFinished) return;

    this.updatePositions();
    this.updateEffects();

    this.draw(context);

    this.timer++;

    if (this.timer >= this.duration) {
      this.restorePositions();
      this.isFinished = true;
    }
  }

  updatePositions() {
    const t = this.timer;

    let attackerX = 0;
    let attackerY = 0;
    let targetX = 0;
    let targetY = 0;

    // 1. Bond puissant.
    if (t < 16) {
      const progress = t / 16;
      const eased = Math.sin((progress * Math.PI) / 2);

      attackerY = -eased * 38;
      attackerX = this.direction * eased * 9;
    }

    // 2. Plongée vers la cible.
    else if (t < 27) {
      const progress = (t - 16) / 11;
      const eased = progress * progress;

      attackerY = -38 + eased * 50;
      attackerX = this.direction * (9 + eased * 21);
    }

    // 3. Collision.
    else if (t < 36) {
      const progress = (t - 27) / 9;
      const recoil = 1 - progress;

      attackerX = this.direction * (30 - progress * 10);
      attackerY = 12 * recoil;

      targetX = this.direction * (15 * recoil);
      targetY = 8 * recoil;
    }

    // 4. Retombée et retour progressif.
    else if (t < 65) {
      const progress = (t - 36) / 29;
      const eased = progress * progress;

      const remaining = 1 - eased;

      attackerX = this.direction * 20 * remaining;
      attackerY = -Math.sin(progress * Math.PI) * 3;

      targetX = this.direction * 15 * remaining;
      targetY = 8 * remaining;
    }

    // 5. Stabilisation.
    else {
      attackerX = 0;
      attackerY = 0;
      targetX = 0;
      targetY = 0;
    }

    this.attacker.position.x = this.originalAttackerPosition.x + attackerX;

    this.attacker.position.y = this.originalAttackerPosition.y + attackerY;

    this.target.position.x = this.originalTargetPosition.x + targetX;

    this.target.position.y = this.originalTargetPosition.y + targetY;
  }

  updateEffects() {
    const t = this.timer;

    // Secousse majeure.
    if (t === 27 && !this.hasShaken) {
      this.hasShaken = true;
      this.game.canvas?.startShake?.(10, 320);
    }

    // Flash d'impact.
    if (t >= 27 && t < 37) {
      this.flashAlpha = Math.max(0, 1 - (t - 27) / 10);
    } else {
      this.flashAlpha = 0;
    }

    // Poussière persistante.
    if (t >= 27 && t < 72) {
      this.dustAlpha = Math.max(0, 1 - (t - 27) / 45);
    } else {
      this.dustAlpha = 0;
    }
  }

  draw(context) {
    const t = this.timer;

    if (t < 16) {
      this.drawPreparation(context);
    }

    if (t >= 16 && t < 27) {
      this.drawDescent(context);
    }

    if (t >= 27 && t < 38) {
      this.drawImpact(context);
    }

    if (t >= 27 && t < 76) {
      this.drawCracks(context);
      this.drawShockwaves(context);
      this.drawDebris(context);
      this.drawDust(context);
    }
  }

  drawPreparation(context) {
    const progress = this.timer / 16;

    context.save();

    const centerX =
      this.originalAttackerPosition.x + this.attacker.frameWidth / 2;

    // Ombre qui se contracte.
    context.globalAlpha = 0.3 + progress * 0.4;
    context.fillStyle = "#171717";

    context.beginPath();
    context.ellipse(
      centerX,
      this.originalAttackerPosition.y + this.attacker.frameHeight - 2,
      17 - progress * 7,
      4 - progress * 1.5,
      0,
      0,
      Math.PI * 2
    );
    context.fill();

    // Énergie et poussière sous les pieds.
    context.globalAlpha = progress * 0.8;
    context.fillStyle = "#e5d4b5";

    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8;
      const radius = 7 + progress * 10;

      context.beginPath();
      context.arc(
        centerX + Math.cos(angle) * radius,
        this.originalAttackerPosition.y +
          this.attacker.frameHeight +
          Math.sin(angle) * 3,
        1.5 + progress,
        0,
        Math.PI * 2
      );
      context.fill();
    }

    context.restore();
  }

  drawDescent(context) {
    const progress = (this.timer - 16) / 11;

    context.save();

    const centerX = this.attacker.position.x + this.attacker.frameWidth / 2;

    // Traits de vitesse.
    context.globalAlpha = 0.35 + progress * 0.65;
    context.strokeStyle = "#fff0c5";
    context.lineWidth = 2;

    for (let i = -3; i <= 3; i++) {
      const x = centerX + i * 8;

      context.beginPath();
      context.moveTo(x, this.attacker.position.y - 4);
      context.lineTo(x - i * 2, this.attacker.position.y - 22 - progress * 13);
      context.stroke();
    }

    // Aura de pression.
    context.globalAlpha = progress * 0.35;
    context.fillStyle = "#fff1cb";

    context.beginPath();
    context.ellipse(
      centerX,
      this.attacker.position.y + this.attacker.frameHeight / 2,
      21 + progress * 7,
      24 + progress * 10,
      0,
      0,
      Math.PI * 2
    );
    context.fill();

    context.restore();
  }

  drawImpact(context) {
    const progress = (this.timer - 27) / 11;
    const alpha = Math.max(0, 1 - progress);

    context.save();

    // Explosion lumineuse.
    context.globalAlpha = alpha * 0.85;
    context.fillStyle = "#fffbe9";

    context.beginPath();
    context.arc(this.impactX, this.impactY, 18 + progress * 28, 0, Math.PI * 2);
    context.fill();

    // Rayons d'explosion.
    context.globalAlpha = alpha;
    context.strokeStyle = "#fff0bd";
    context.lineWidth = 3;

    for (let i = 0; i < 16; i++) {
      const angle = (Math.PI * 2 * i) / 16;
      const inner = 12 + progress * 8;
      const outer = 28 + progress * 22;

      context.beginPath();
      context.moveTo(
        this.impactX + Math.cos(angle) * inner,
        this.impactY + Math.sin(angle) * inner
      );
      context.lineTo(
        this.impactX + Math.cos(angle) * outer,
        this.impactY + Math.sin(angle) * outer
      );
      context.stroke();
    }

    // Éclats sombres autour du centre.
    context.fillStyle = "#806a50";

    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8;
      const distance = 12 + progress * 17;

      context.globalAlpha = alpha * 0.9;

      context.beginPath();
      context.arc(
        this.impactX + Math.cos(angle) * distance,
        this.impactY + Math.sin(angle) * distance * 0.45,
        2 + progress * 2,
        0,
        Math.PI * 2
      );
      context.fill();
    }

    context.restore();
  }

  drawCracks(context) {
    const elapsed = this.timer - 27;

    if (elapsed < 0) return;

    const progress = Math.min(1, elapsed / 12);
    const alpha = Math.max(0, 1 - elapsed / 42);

    context.save();

    context.globalAlpha = alpha;
    context.strokeStyle = "#554735";
    context.lineWidth = 2;

    for (const crack of this.cracks) {
      const startX = this.impactX;
      const startY = this.impactY;

      const length = crack.length * progress;

      const endX = startX + Math.cos(crack.angle) * length;

      const endY = startY + Math.sin(crack.angle) * length * 0.35;

      const middleX = startX + Math.cos(crack.angle + 0.2) * length * 0.55;

      const middleY = startY + Math.sin(crack.angle + 0.2) * length * 0.2;

      context.beginPath();
      context.moveTo(startX, startY);
      context.lineTo(middleX, middleY);
      context.lineTo(endX, endY);
      context.stroke();

      if (crack.branches) {
        context.beginPath();
        context.moveTo(middleX, middleY);
        context.lineTo(
          middleX + Math.cos(crack.angle + 0.8) * length * 0.35,
          middleY + Math.sin(crack.angle + 0.8) * length * 0.15
        );
        context.stroke();
      }
    }

    context.restore();
  }

  drawShockwaves(context) {
    const elapsed = this.timer - 27;

    context.save();

    for (const ring of this.rings) {
      const age = elapsed - ring.delay;

      if (age < 0 || age > 34) continue;

      const progress = age / 34;
      const radius = age * ring.speed;
      const alpha = 1 - progress;

      // Onde principale.
      context.globalAlpha = alpha * 0.9;
      context.strokeStyle = "#f0dfbd";
      context.lineWidth = ring.width;

      context.beginPath();
      context.ellipse(
        this.impactX,
        this.impactY,
        radius,
        radius * 0.24,
        0,
        0,
        Math.PI * 2
      );
      context.stroke();

      // Contour secondaire.
      context.globalAlpha = alpha * 0.45;
      context.lineWidth = 1.5;

      context.beginPath();
      context.ellipse(
        this.impactX,
        this.impactY,
        radius * 0.78,
        radius * 0.18,
        0,
        0,
        Math.PI * 2
      );
      context.stroke();
    }

    context.restore();
  }

  drawDebris(context) {
    const elapsed = this.timer - 27;

    if (elapsed < 0 || elapsed > 34) return;

    context.save();

    for (const particle of this.debris) {
      const age = elapsed - particle.delay;

      if (age < 0) continue;

      const distance = age * particle.speed;

      const x = this.impactX + Math.cos(particle.angle) * distance;

      // Trajectoire balistique.
      const y =
        this.impactY +
        Math.sin(particle.angle) * distance * 0.65 -
        age * (2.7 + particle.speed * 0.2) +
        age * age * 0.09;

      const alpha = Math.max(0, 1 - age / 34);

      context.save();
      context.translate(x, y);
      context.rotate(particle.rotation + age * particle.rotationSpeed);

      context.globalAlpha = alpha;
      context.fillStyle = particle.color;

      context.fillRect(
        -particle.size / 2,
        -particle.size / 2,
        particle.size,
        particle.size
      );

      context.restore();
    }

    context.restore();
  }

  drawDust(context) {
    const elapsed = this.timer - 27;

    if (elapsed < 0 || this.dustAlpha <= 0) return;

    context.save();

    for (const particle of this.dust) {
      const age = elapsed - particle.delay;

      if (age < 0) continue;

      const distance = age * particle.speed;

      const x = this.impactX + particle.side * distance;

      const y = this.impactY - particle.height - Math.sin(age * 0.18) * 4;

      const alpha = this.dustAlpha * Math.max(0, 1 - age / 35);

      context.globalAlpha = alpha * 0.65;
      context.fillStyle = "#b8a58c";

      context.beginPath();
      context.arc(x, y, particle.size + age * 0.14, 0, Math.PI * 2);
      context.fill();
    }

    context.restore();
  }

  restorePositions() {
    this.attacker.position.x = this.originalAttackerPosition.x;

    this.attacker.position.y = this.originalAttackerPosition.y;

    this.target.position.x = this.originalTargetPosition.x;

    this.target.position.y = this.originalTargetPosition.y;
  }
}
