export class JumpKickAnimation {
  static PHASES = {
    PREPARE: "PREPARE",
    JUMP: "JUMP",
    ATTACK: "ATTACK",
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

    this.phase = JumpKickAnimation.PHASES.PREPARE;
    this.timer = 0;
    this.isFinished = false;

    this.duration = {
      PREPARE: 10,
      JUMP: 14,
      ATTACK: 9,
      IMPACT: 14,
      LANDING: 10,
      RETURN: 12,
      FINISH: 6,
    };

    this.particles = [];
    this.dustParticles = [];
    this.shockwaves = [];

    this.jumpHeight = 45;
    this.jumpDistance = 38;

    this.impactX =
      this.target.position.x + (this.target.frameWidth * this.target.scale) / 2;

    this.impactY =
      this.target.position.y +
      (this.target.frameHeight * this.target.scale) / 2;
  }

  update(context) {
    if (this.isFinished) return;

    switch (this.phase) {
      case JumpKickAnimation.PHASES.PREPARE:
        this.updatePrepare();
        break;

      case JumpKickAnimation.PHASES.JUMP:
        this.updateJump();
        break;

      case JumpKickAnimation.PHASES.ATTACK:
        this.updateAttack();
        break;

      case JumpKickAnimation.PHASES.IMPACT:
        this.updateImpact();
        break;

      case JumpKickAnimation.PHASES.LANDING:
        this.updateLanding();
        break;

      case JumpKickAnimation.PHASES.RETURN:
        this.updateReturn();
        break;

      case JumpKickAnimation.PHASES.FINISH:
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

    // Le Pokémon fléchit les jambes avant de bondir.
    this.attacker.position.y = this.originalY + progress * 5;

    this.attacker.position.x = this.originalX - this.direction * progress * 3;

    this.attacker.rotation = this.direction * progress * 0.08;

    if (this.timer >= this.duration.PREPARE) {
      this.createTakeoffDust();
      this.setPhase(JumpKickAnimation.PHASES.JUMP);
    }
  }

  updateJump() {
    const progress = Math.min(this.timer / this.duration.JUMP, 1);

    const eased = this.easeInOut(progress);

    // Bond en direction de l'adversaire.
    this.attacker.position.x =
      this.originalX + this.direction * this.jumpDistance * eased;

    this.attacker.position.y =
      this.originalY + 5 - Math.sin((progress * Math.PI) / 2) * this.jumpHeight;

    // Le corps s'incline progressivement vers l'avant.
    this.attacker.rotation = this.direction * (-0.15 - progress * 0.3);

    if (this.timer % 3 === 0) {
      this.createAirParticles();
    }

    if (this.timer >= this.duration.JUMP) {
      this.setPhase(JumpKickAnimation.PHASES.ATTACK);
    }
  }

  updateAttack() {
    const progress = Math.min(this.timer / this.duration.ATTACK, 1);

    const eased = this.easeOut(progress);

    // Le Pokémon plonge vers sa cible.
    this.attacker.position.x =
      this.originalX + this.direction * (this.jumpDistance + 15 * eased);

    this.attacker.position.y =
      this.originalY - this.jumpHeight * (1 - eased) - 5;

    // Inclinaison marquée au moment du coup.
    this.attacker.rotation = this.direction * (-0.45 - 0.55 * eased);

    if (this.timer % 2 === 0) {
      this.createAirParticles();
    }

    if (this.timer >= this.duration.ATTACK) {
      this.createImpact();
      this.game.canvas.startShake(11, 4);

      this.setPhase(JumpKickAnimation.PHASES.IMPACT);
    }
  }

  updateImpact() {
    if (this.timer % 3 === 0) {
      this.createSparks();
    }

    if (this.timer >= this.duration.IMPACT) {
      this.setPhase(JumpKickAnimation.PHASES.LANDING);
    }
  }

  updateLanding() {
    const progress = Math.min(this.timer / this.duration.LANDING, 1);

    const eased = this.easeOut(progress);

    // Le Pokémon absorbe le choc de son atterrissage.
    this.attacker.position.y = this.originalY - 5 + eased * 5;

    this.attacker.rotation = this.direction * (-1 + eased * 0.2);

    if (this.timer === 1) {
      this.createLandingDust();
    }

    if (this.timer >= this.duration.LANDING) {
      this.setPhase(JumpKickAnimation.PHASES.RETURN);
    }
  }

  updateReturn() {
    const progress = Math.min(this.timer / this.duration.RETURN, 1);

    const eased = this.easeOut(progress);

    this.attacker.position.x =
      this.originalX + this.direction * (this.jumpDistance + 15) * (1 - eased);

    this.attacker.position.y = this.originalY;

    this.attacker.rotation = this.direction * -0.8 * (1 - eased);

    if (this.timer >= this.duration.RETURN) {
      this.restoreAttacker();
      this.setPhase(JumpKickAnimation.PHASES.FINISH);
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

  createTakeoffDust() {
    this.createDust(this.originalX + 15, this.originalY + 28, 14);
  }

  createLandingDust() {
    this.createDust(this.attacker.position.x + 15, this.originalY + 28, 18);
  }

  createDust(x, y, count) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.8 + Math.random() * 2.5;

      this.dustParticles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1,
        size: 2 + Math.random() * 3,
        life: 18 + Math.random() * 8,
        maxLife: 26,
      });
    }
  }

  createAirParticles() {
    const width = this.attacker.frameWidth * this.attacker.scale;
    const height = this.attacker.frameHeight * this.attacker.scale;

    this.particles.push({
      x: this.attacker.position.x + width / 2,
      y: this.attacker.position.y + height / 2,
      vx: -this.direction * (1 + Math.random() * 2),
      vy: 0.5 + Math.random() * 1.5,
      size: 2 + Math.random() * 2,
      life: 10,
      maxLife: 10,
      color: "#e8e8e8",
    });
  }

  createImpact() {
    this.shockwaves.push({
      x: this.impactX,
      y: this.impactY,
      radius: 5,
      life: 14,
      maxLife: 14,
    });

    this.createSparks();
  }

  createSparks() {
    for (let i = 0; i < 9; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 3.5;

      this.particles.push({
        x: this.impactX,
        y: this.impactY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 2.5,
        life: 13,
        maxLife: 13,
        color: "#fff0bd",
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
      context.lineWidth = 3;

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
      context.shadowBlur = 7;

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
      context.fillStyle = "#c5c0b8";

      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fill();
    }

    context.restore();
  }
}
