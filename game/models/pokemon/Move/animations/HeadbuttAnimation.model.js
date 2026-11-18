export class HeadbuttAnimation {
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

    this.timer = 0;
    this.duration = 76;
    this.isFinished = false;
    this.hasShaken = false;

    this.impactX = this.originalTargetPosition.x + this.target.frameWidth / 2;

    this.impactY =
      this.originalTargetPosition.y +
      this.target.frameHeight * (this.target.scale || 1) * 0.55;

    this.flashAlpha = 0;
    this.impactAlpha = 0;

    this.stars = Array.from({ length: 8 }, (_, i) => ({
      angle: (Math.PI * 2 * i) / 8,
      speed: 1.5 + Math.random() * 2,
      size: 2 + Math.random() * 2,
      delay: Math.random() * 3,
      rotation: Math.random() * Math.PI,
    }));

    this.speedLines = Array.from({ length: 7 }, (_, i) => ({
      offsetY: -20 + i * 7,
      length: 9 + Math.random() * 12,
      delay: i * 1.1,
    }));

    this.debris = Array.from({ length: 14 }, (_, i) => ({
      angle: (Math.PI * 2 * i) / 14,
      speed: 1 + Math.random() * 2.5,
      size: 1.5 + Math.random() * 2.5,
      delay: Math.random() * 4,
    }));

    this.dust = Array.from({ length: 10 }, () => ({
      side: Math.random() < 0.5 ? -1 : 1,
      speed: 0.7 + Math.random() * 2,
      size: 2 + Math.random() * 4,
      delay: Math.random() * 5,
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

    // 1. Préparation : le Pokémon recule pour prendre son élan.
    if (t < 13) {
      const progress = t / 13;

      attackerX = -this.direction * progress * 9;
      attackerY = Math.sin(progress * Math.PI) * 2;
    }

    // 2. Charge frontale.
    else if (t < 25) {
      const progress = (t - 13) / 12;
      const eased = progress * progress;

      attackerX = -this.direction * 9 + eased * this.direction * 35;
      attackerY = -Math.sin(progress * Math.PI) * 3;
    }

    // 3. Collision.
    else if (t < 32) {
      const progress = (t - 25) / 7;
      const remaining = 1 - progress;

      attackerX = this.direction * (26 - progress * 8);
      attackerY = 3 * remaining;

      targetX = this.direction * 12 * remaining;
      targetY = 4 * remaining;
    }

    // 4. Rebond de l'attaquant et recul de la cible.
    else if (t < 50) {
      const progress = (t - 32) / 18;
      const remaining = 1 - progress;

      attackerX = this.direction * 18 * remaining;
      attackerY = -Math.sin(progress * Math.PI) * 5;

      targetX = this.direction * 12 * remaining;
      targetY = -Math.sin(progress * Math.PI) * 2;
    }

    // 5. Retour à la position initiale.
    else if (t < 65) {
      const progress = (t - 50) / 15;
      const remaining = 1 - progress;

      attackerX = this.direction * 18 * remaining;
      targetX = this.direction * 12 * remaining;
    }

    this.attacker.position.x = this.originalAttackerPosition.x + attackerX;

    this.attacker.position.y = this.originalAttackerPosition.y + attackerY;

    this.target.position.x = this.originalTargetPosition.x + targetX;

    this.target.position.y = this.originalTargetPosition.y + targetY;
  }

  updateEffects() {
    const t = this.timer;

    if (t === 25 && !this.hasShaken) {
      this.hasShaken = true;
      this.game.canvas?.startShake?.(6, 180);
    }

    if (t >= 25 && t < 32) {
      this.flashAlpha = Math.max(0, 1 - (t - 25) / 7);
    } else {
      this.flashAlpha = 0;
    }

    if (t >= 25 && t < 47) {
      this.impactAlpha = Math.max(0, 1 - (t - 25) / 22);
    } else {
      this.impactAlpha = 0;
    }
  }

  draw(context) {
    const t = this.timer;

    if (t < 13) {
      this.drawPreparation(context);
    }

    if (t >= 13 && t < 25) {
      this.drawCharge(context);
    }

    if (t >= 25 && t < 34) {
      this.drawImpact(context);
    }

    if (t >= 25 && t < 49) {
      this.drawStars(context);
      this.drawDebris(context);
      this.drawDust(context);
    }
  }

  drawPreparation(context) {
    const progress = this.timer / 13;

    context.save();

    // Petite ombre sous l'attaquant.
    context.globalAlpha = 0.25 + progress * 0.25;
    context.fillStyle = "#222";

    context.beginPath();
    context.ellipse(
      this.originalAttackerPosition.x + this.attacker.frameWidth / 2,
      this.originalAttackerPosition.y + this.attacker.frameHeight - 2,
      15 + progress * 3,
      3,
      0,
      0,
      Math.PI * 2
    );
    context.fill();

    // Particules de préparation.
    context.globalAlpha = progress * 0.6;
    context.fillStyle = "#e7d4ad";

    for (let i = 0; i < 4; i++) {
      const x = this.originalAttackerPosition.x + 5 + i * 8;

      const y =
        this.originalAttackerPosition.y +
        this.attacker.frameHeight -
        progress * (4 + i * 2);

      context.fillRect(x, y, 2, 2);
    }

    context.restore();
  }

  drawCharge(context) {
    const progress = (this.timer - 13) / 12;

    context.save();

    const centerX = this.attacker.position.x + this.attacker.frameWidth / 2;

    context.globalAlpha = 0.3 + progress * 0.65;
    context.strokeStyle = "#fff0c7";
    context.lineWidth = 2;

    // Traits de vitesse derrière le Pokémon.
    for (const line of this.speedLines) {
      const age = this.timer - 13 - line.delay;

      if (age < 0) continue;

      const x = centerX - this.direction * (12 + progress * 9);

      const y =
        this.attacker.position.y + this.attacker.frameHeight / 2 + line.offsetY;

      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(x - this.direction * line.length, y);
      context.stroke();
    }

    // Halo autour de la tête.
    context.globalAlpha = progress * 0.3;
    context.fillStyle = "#fff2cb";

    context.beginPath();
    context.ellipse(
      centerX + this.direction * 8,
      this.attacker.position.y + this.attacker.frameHeight * 0.35,
      13 + progress * 5,
      12 + progress * 3,
      0,
      0,
      Math.PI * 2
    );
    context.fill();

    context.restore();
  }

  drawImpact(context) {
    const progress = (this.timer - 25) / 9;
    const alpha = Math.max(0, 1 - progress);

    context.save();

    // Flash de collision.
    context.globalAlpha = this.flashAlpha * 0.9;
    context.fillStyle = "#fff8dc";

    context.beginPath();
    context.arc(this.impactX, this.impactY, 9 + progress * 18, 0, Math.PI * 2);
    context.fill();

    // Étoile centrale.
    context.globalAlpha = alpha;
    context.fillStyle = "#fff0bd";

    context.beginPath();

    for (let i = 0; i < 10; i++) {
      const angle = (Math.PI * 2 * i) / 10 - Math.PI / 2;
      const radius = i % 2 === 0 ? 13 : 5;

      const x = this.impactX + Math.cos(angle) * radius;
      const y = this.impactY + Math.sin(angle) * radius;

      if (i === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    }

    context.closePath();
    context.fill();

    // Traits d'impact.
    context.strokeStyle = "#fff1c4";
    context.lineWidth = 2;

    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8;
      const inner = 9 + progress * 5;
      const outer = 19 + progress * 13;

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

    context.restore();
  }

  drawStars(context) {
    const elapsed = this.timer - 25;

    context.save();

    for (const star of this.stars) {
      const age = elapsed - star.delay;

      if (age < 0 || age > 22) continue;

      const distance = age * star.speed;

      const x = this.impactX + Math.cos(star.angle) * distance;

      const y =
        this.impactY + Math.sin(star.angle) * distance * 0.6 - age * 0.35;

      const alpha = Math.max(0, 1 - age / 22);

      context.save();
      context.translate(x, y);
      context.rotate(star.rotation + age * 0.12);

      context.globalAlpha = alpha;
      context.fillStyle = "#fff0bd";

      context.beginPath();

      for (let i = 0; i < 8; i++) {
        const angle = (Math.PI * 2 * i) / 8;
        const radius = i % 2 === 0 ? star.size : star.size * 0.35;

        const px = Math.cos(angle) * radius;
        const py = Math.sin(angle) * radius;

        if (i === 0) context.moveTo(px, py);
        else context.lineTo(px, py);
      }

      context.closePath();
      context.fill();

      context.restore();
    }

    context.restore();
  }

  drawDebris(context) {
    const elapsed = this.timer - 25;

    if (elapsed < 0 || elapsed > 25) return;

    context.save();

    for (const particle of this.debris) {
      const age = elapsed - particle.delay;

      if (age < 0) continue;

      const distance = age * particle.speed;

      const x = this.impactX + Math.cos(particle.angle) * distance;

      const y =
        this.impactY +
        Math.sin(particle.angle) * distance * 0.55 -
        age * 1.8 +
        age * age * 0.07;

      const alpha = Math.max(0, 1 - age / 25);

      context.save();
      context.translate(x, y);
      context.rotate(age * 0.2);

      context.globalAlpha = alpha;
      context.fillStyle = "#a58b69";

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
    const elapsed = this.timer - 25;

    if (elapsed < 0) return;

    context.save();

    for (const particle of this.dust) {
      const age = elapsed - particle.delay;

      if (age < 0 || age > 22) continue;

      const x = this.impactX + particle.side * age * particle.speed;

      const y = this.impactY - 4 - Math.sin(age * 0.2) * particle.height * 0.25;

      context.globalAlpha = this.impactAlpha * Math.max(0, 1 - age / 22) * 0.5;

      context.fillStyle = "#b9a58b";

      context.beginPath();
      context.arc(x, y, particle.size + age * 0.1, 0, Math.PI * 2);
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
