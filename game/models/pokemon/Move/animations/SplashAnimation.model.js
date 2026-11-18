export class SplashAnimation {
  constructor(game, viewers, turnAction) {
    this.game = game;
    this.viewers = viewers;
    this.turnAction = turnAction;

    if (this.viewers.front.slot.content === turnAction.pokemon) {
      this.pokemonViewer = this.viewers.front;
    } else {
      this.pokemonViewer = this.viewers.back;
    }

    this.attacker = this.pokemonViewer.sprite;

    this.originalY = this.attacker.position.y;

    this.centerX =
      this.attacker.position.x +
      (this.attacker.frameWidth * this.attacker.scale) / 2;

    this.centerY =
      this.attacker.position.y +
      (this.attacker.frameHeight * this.attacker.scale) / 2;

    this.groundY =
      this.attacker.position.y +
      this.attacker.frameHeight * this.attacker.scale;

    this.phase = "INVOCATION";
    this.timer = 0;
    this.isFinished = false;

    this.jumpHeight = 0;
    this.dustParticles = [];
    this.splashParticles = [];
    this.rings = [];

    this.createDustParticles();
  }

  update(context) {
    if (this.isFinished) return;

    this.timer++;

    switch (this.phase) {
      case "INVOCATION":
        this.updateInvocation();
        break;

      case "JUMP":
        this.updateJump();
        break;

      case "LANDING":
        this.updateLanding();
        break;

      case "REVELATION":
        this.updateRevelation();
        break;

      case "FINISHED":
        this.finish();
        break;
    }

    this.updateParticles();
    this.draw(context);
  }

  // --------------------------------------------------
  // INVOCATION
  // --------------------------------------------------

  updateInvocation() {
    const duration = 16;
    const progress = Math.min(this.timer / duration, 1);

    // Petite préparation avant le saut.
    const anticipation = Math.sin(progress * Math.PI);

    this.attacker.position.y = this.originalY + anticipation * 5;

    if (this.timer >= duration) {
      this.attacker.position.y = this.originalY;
      this.phase = "JUMP";
      this.timer = 0;
    }
  }

  // --------------------------------------------------
  // JUMP
  // --------------------------------------------------

  updateJump() {
    const duration = 24;
    const progress = Math.min(this.timer / duration, 1);

    // Trajectoire parabolique du bond.
    this.jumpHeight = Math.sin(progress * Math.PI) * 42;

    this.attacker.position.y = this.originalY - this.jumpHeight;

    if (this.timer >= duration) {
      this.attacker.position.y = this.originalY;
      this.jumpHeight = 0;

      this.createLandingParticles();

      this.phase = "LANDING";
      this.timer = 0;
    }
  }

  // --------------------------------------------------
  // LANDING
  // --------------------------------------------------

  updateLanding() {
    const duration = 18;
    const progress = Math.min(this.timer / duration, 1);

    // Petit rebond à la retombée.
    const bounce = Math.sin(progress * Math.PI * 2) * (1 - progress) * 4;

    this.attacker.position.y = this.originalY - Math.max(0, bounce);

    if (this.timer >= duration) {
      this.attacker.position.y = this.originalY;

      this.phase = "REVELATION";
      this.timer = 0;
    }
  }

  // --------------------------------------------------
  // REVELATION
  // --------------------------------------------------

  updateRevelation() {
    if (this.timer >= 28) {
      this.phase = "FINISHED";
    }
  }

  // --------------------------------------------------
  // PARTICLES
  // --------------------------------------------------

  createDustParticles() {
    for (let i = 0; i < 6; i++) {
      this.dustParticles.push({
        x: this.centerX + (Math.random() - 0.5) * 25,
        y: this.groundY - 3,
        velocityX: (Math.random() - 0.5) * 1.5,
        velocityY: -Math.random() * 1.2 - 0.3,
        radius: Math.random() * 2 + 1,
        alpha: 0.6,
        life: 16,
      });
    }
  }

  createLandingParticles() {
    // Petit nuage de poussière à l'impact.
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 * i) / 12;

      this.splashParticles.push({
        x: this.centerX,
        y: this.groundY - 3,
        velocityX: Math.cos(angle) * (Math.random() * 1.8 + 0.5),
        velocityY: Math.sin(angle) * (Math.random() * 1.2 + 0.3) * -1,
        radius: Math.random() * 2.5 + 1,
        alpha: 0.8,
        life: 24,
      });
    }

    this.rings.push({
      radius: 4,
      maxRadius: 27,
      alpha: 0.7,
      life: 16,
    });
  }

  updateParticles() {
    const updateList = (particles) => {
      particles.forEach((particle) => {
        particle.x += particle.velocityX;
        particle.y += particle.velocityY;

        particle.velocityY += 0.06;

        particle.alpha -= 0.035;
        particle.life--;
      });

      return particles.filter(
        (particle) => particle.life > 0 && particle.alpha > 0
      );
    };

    this.dustParticles = updateList(this.dustParticles);
    this.splashParticles = updateList(this.splashParticles);

    this.rings.forEach((ring) => {
      ring.radius += 1.5;
      ring.alpha -= 0.045;
      ring.life--;
    });

    this.rings = this.rings.filter((ring) => ring.life > 0 && ring.alpha > 0);
  }

  // --------------------------------------------------
  // DRAW
  // --------------------------------------------------

  draw(context) {
    this.drawRings(context);
    this.drawDust(context);
    this.drawSplashParticles(context);
  }

  drawRings(context) {
    this.rings.forEach((ring) => {
      context.save();

      context.globalAlpha = ring.alpha;
      context.strokeStyle = "#d8e7f5";
      context.lineWidth = 2;

      context.beginPath();

      context.ellipse(
        this.centerX,
        this.groundY - 2,
        ring.radius,
        ring.radius * 0.35,
        0,
        0,
        Math.PI * 2
      );

      context.stroke();
      context.restore();
    });
  }

  drawDust(context) {
    this.dustParticles.forEach((particle) => {
      context.save();

      context.globalAlpha = particle.alpha;
      context.fillStyle = "#d6d0c4";

      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);

      context.fill();
      context.restore();
    });
  }

  drawSplashParticles(context) {
    this.splashParticles.forEach((particle) => {
      context.save();

      context.globalAlpha = particle.alpha;
      context.fillStyle = "#e9f2f7";

      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);

      context.fill();
      context.restore();
    });
  }

  // --------------------------------------------------
  // FINISHED
  // --------------------------------------------------

  finish() {
    this.attacker.position.y = this.originalY;
    this.isFinished = true;
  }
}
