export class HighJumpKickAnimation {
  static PHASES = {
    PREPARE: "PREPARE",
    TAKEOFF: "TAKEOFF",
    ASCENT: "ASCENT",
    DIVE: "DIVE",
    IMPACT: "IMPACT",
    LANDING: "LANDING",
    RETURN: "RETURN",
    FINISH: "FINISH",
  };

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

    this.originalX = this.attacker.position.x;
    this.originalY = this.attacker.position.y;
    this.originalRotation = this.attacker.rotation;

    this.direction = this.target.position.x > this.attacker.position.x ? 1 : -1;

    this.phase = HighJumpKickAnimation.PHASES.PREPARE;
    this.timer = 0;
    this.isFinished = false;

    this.duration = {
      PREPARE: 12,
      TAKEOFF: 8,
      ASCENT: 12,
      DIVE: 9,
      IMPACT: 18,
      LANDING: 10,
      RETURN: 12,
      FINISH: 6,
    };

    this.jumpHeight = 65;
    this.jumpDistance = 42;

    this.particles = [];
    this.dustParticles = [];
    this.shockwaves = [];

    this.impactX =
      this.target.position.x + (this.target.frameWidth * this.target.scale) / 2;

    this.impactY =
      this.target.position.y +
      (this.target.frameHeight * this.target.scale) / 2;
  }

  update(context) {
    if (this.isFinished) return;

    switch (this.phase) {
      case HighJumpKickAnimation.PHASES.PREPARE:
        this.updatePrepare();
        break;

      case HighJumpKickAnimation.PHASES.TAKEOFF:
        this.updateTakeoff();
        break;

      case HighJumpKickAnimation.PHASES.ASCENT:
        this.updateAscent();
        break;

      case HighJumpKickAnimation.PHASES.DIVE:
        this.updateDive();
        break;

      case HighJumpKickAnimation.PHASES.IMPACT:
        this.updateImpact();
        break;

      case HighJumpKickAnimation.PHASES.LANDING:
        this.updateLanding();
        break;

      case HighJumpKickAnimation.PHASES.RETURN:
        this.updateReturn();
        break;

      case HighJumpKickAnimation.PHASES.FINISH:
        this.updateFinish();
        break;
    }

    this.updateParticles();
    this.draw(context);

    this.timer++;
  }

  setPhase(phase) {
    this.phase = phase;
    this.timer = 0;
  }

  easeOut(value) {
    return 1 - Math.pow(1 - value, 3);
  }

  easeIn(value) {
    return value * value * value;
  }

  easeInOut(value) {
    return value < 0.5
      ? 4 * value * value * value
      : 1 - Math.pow(-2 * value + 2, 3) / 2;
  }

  updatePrepare() {
    const progress = Math.min(this.timer / this.duration.PREPARE, 1);

    // Le Pokémon fléchit profondément avant son saut.
    this.attacker.position.y = this.originalY + progress * 7;

    this.attacker.position.x = this.originalX - this.direction * progress * 5;

    this.attacker.rotation = this.direction * progress * 0.12;

    if (this.timer >= this.duration.PREPARE) {
      this.createDust(this.originalX + 15, this.originalY + 30, 12);

      this.setPhase(HighJumpKickAnimation.PHASES.TAKEOFF);
    }
  }

  updateTakeoff() {
    const progress = Math.min(this.timer / this.duration.TAKEOFF, 1);

    const eased = this.easeOut(progress);

    // Décollage explosif.
    this.attacker.position.y = this.originalY + 7 - eased * 22;

    this.attacker.position.x =
      this.originalX - this.direction * 5 + this.direction * eased * 8;

    this.attacker.rotation = this.direction * -0.25 * eased;

    if (this.timer % 2 === 0) {
      this.createAirParticles();
    }

    if (this.timer >= this.duration.TAKEOFF) {
      this.setPhase(HighJumpKickAnimation.PHASES.ASCENT);
    }
  }

  updateAscent() {
    const progress = Math.min(this.timer / this.duration.ASCENT, 1);

    const eased = this.easeInOut(progress);

    // Le Pokémon atteint une grande hauteur.
    this.attacker.position.x =
      this.originalX + this.direction * (8 + this.jumpDistance * eased);

    this.attacker.position.y =
      this.originalY -
      15 -
      Math.sin((progress * Math.PI) / 2) * this.jumpHeight;

    // Préparation du genou.
    this.attacker.rotation = this.direction * (-0.25 - eased * 0.5);

    if (this.timer % 2 === 0) {
      this.createAirParticles();
    }

    if (this.timer >= this.duration.ASCENT) {
      this.setPhase(HighJumpKickAnimation.PHASES.DIVE);
    }
  }

  updateDive() {
    const progress = Math.min(this.timer / this.duration.DIVE, 1);

    const eased = this.easeIn(progress);

    // Plongeon rapide vers l'adversaire.
    this.attacker.position.x =
      this.originalX + this.direction * (8 + this.jumpDistance + 17 * eased);

    this.attacker.position.y =
      this.originalY - this.jumpHeight * (1 - eased) - 8;

    this.attacker.rotation = this.direction * (-0.75 - eased * 0.45);

    if (this.timer % 2 === 0) {
      this.createDiveTrail();
    }

    if (this.timer >= this.duration.DIVE) {
      this.createImpact();
      this.game.canvas.startShake(14, 5);

      this.setPhase(HighJumpKickAnimation.PHASES.IMPACT);
    }
  }

  updateImpact() {
    if (this.timer % 3 === 0) {
      this.createSparks();
    }

    if (this.timer >= this.duration.IMPACT) {
      this.setPhase(HighJumpKickAnimation.PHASES.LANDING);
    }
  }

  updateLanding() {
    const progress = Math.min(this.timer / this.duration.LANDING, 1);

    const eased = this.easeOut(progress);

    // Réception lourde après le coup.
    this.attacker.position.y = this.originalY - 8 + eased * 8;

    this.attacker.rotation = this.direction * -1.2 * (1 - eased);

    if (this.timer === 1) {
      this.createDust(this.attacker.position.x + 15, this.originalY + 30, 18);

      this.game.canvas.startShake(7, 2);
    }

    if (this.timer >= this.duration.LANDING) {
      this.setPhase(HighJumpKickAnimation.PHASES.RETURN);
    }
  }

  updateReturn() {
    const progress = Math.min(this.timer / this.duration.RETURN, 1);

    const eased = this.easeOut(progress);

    this.attacker.position.x =
      this.originalX + this.direction * (this.jumpDistance + 25) * (1 - eased);

    this.attacker.position.y = this.originalY;

    this.attacker.rotation = this.direction * -0.8 * (1 - eased);

    if (this.timer >= this.duration.RETURN) {
      this.restoreAttacker();
      this.setPhase(HighJumpKickAnimation.PHASES.FINISH);
    }
  }

  updateFinish() {
    if (this.timer >= this.duration.FINISH) {
      this.restoreAttacker();
      this.isFinished = true;
    }
  }

  restoreAttacker() {
    this.attacker.position.x = this.originalX;
    this.attacker.position.y = this.originalY;
    this.attacker.rotation = this.originalRotation;
  }

  createAirParticles() {
    const width = this.attacker.frameWidth * this.attacker.scale;

    const height = this.attacker.frameHeight * this.attacker.scale;

    this.particles.push({
      x: this.attacker.position.x + width / 2,
      y: this.attacker.position.y + height / 2,
      vx: -this.direction * (1 + Math.random() * 2),
      vy: 1 + Math.random() * 2,
      size: 2 + Math.random() * 2,
      life: 12,
      maxLife: 12,
      color: "#d7e0e8",
    });
  }

  createDiveTrail() {
    const width = this.attacker.frameWidth * this.attacker.scale;

    const height = this.attacker.frameHeight * this.attacker.scale;

    this.particles.push({
      x: this.attacker.position.x + width / 2,
      y: this.attacker.position.y + height / 2,
      vx: -this.direction * (2 + Math.random() * 3),
      vy: 2 + Math.random() * 2,
      size: 3 + Math.random() * 3,
      life: 14,
      maxLife: 14,
      color: "#fff0c2",
    });
  }

  createImpact() {
    this.shockwaves.push({
      x: this.impactX,
      y: this.impactY,
      radius: 5,
      life: 18,
      maxLife: 18,
    });

    this.createSparks();
  }

  createSparks() {
    for (let i = 0; i < 12; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 4;

      this.particles.push({
        x: this.impactX,
        y: this.impactY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 3,
        life: 15,
        maxLife: 15,
        color: "#fff0bd",
      });
    }
  }

  createDust(x, y, count) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 3;

      this.dustParticles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1,
        size: 2 + Math.random() * 3,
        life: 20,
        maxLife: 20,
      });
    }
  }

  updateParticles() {
    for (const particle of this.particles) {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vx *= 0.94;
      particle.vy *= 0.94;
      particle.life--;
    }

    this.particles = this.particles.filter((particle) => particle.life > 0);

    for (const particle of this.dustParticles) {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vx *= 0.96;
      particle.vy += 0.08;
      particle.life--;
    }

    this.dustParticles = this.dustParticles.filter(
      (particle) => particle.life > 0
    );

    for (const wave of this.shockwaves) {
      wave.radius += 3;
      wave.life--;
    }

    this.shockwaves = this.shockwaves.filter((wave) => wave.life > 0);
  }

  draw(context) {
    this.drawShockwaves(context);
    this.drawParticles(context);
    this.drawDust(context);
  }

  drawShockwaves(context) {
    context.save();

    for (const wave of this.shockwaves) {
      context.globalAlpha = wave.life / wave.maxLife;
      context.strokeStyle = "#fff0bd";
      context.lineWidth = 4;
      context.shadowColor = "#ffbd59";
      context.shadowBlur = 10;

      context.beginPath();
      context.ellipse(
        wave.x,
        wave.y,
        wave.radius,
        wave.radius * 0.5,
        0,
        0,
        Math.PI * 2
      );
      context.stroke();
    }

    context.restore();
  }

  drawParticles(context) {
    context.save();

    for (const particle of this.particles) {
      context.globalAlpha = particle.life / particle.maxLife;
      context.fillStyle = particle.color;
      context.shadowColor = particle.color;
      context.shadowBlur = 8;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fill();
    }

    context.restore();
  }

  drawDust(context) {
    context.save();

    for (const particle of this.dustParticles) {
      context.globalAlpha = particle.life / particle.maxLife;
      context.fillStyle = "#bcb5a9";

      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fill();
    }

    context.restore();
  }
}
