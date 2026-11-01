export class DigAnimation {
  constructor(game, viewers, turnAction) {
    this.game = game;
    this.viewers = viewers;
    this.turnAction = turnAction;

    this.pokemon = turnAction.pokemon;
    this.target = turnAction.target;
    this.move = turnAction.move;

    // --------------------------------------------------
    // VIEWERS
    // --------------------------------------------------

    if (this.viewers.front.slot.content === this.pokemon) {
      this.pokemonViewer = this.viewers.front;
      this.targetViewer = this.viewers.back;
    } else {
      this.pokemonViewer = this.viewers.back;
      this.targetViewer = this.viewers.front;
    }

    this.sprite = this.pokemonViewer.sprite;
    this.targetSprite = this.targetViewer.sprite;

    // --------------------------------------------------
    // PHASE
    // --------------------------------------------------

    this.phase = this.pokemon.chargedMove.animationPhase;
    this.state = this.phase === "FIRST" ? "BURROW" : "GROUND_SHAKE";

    this.isFinished = false;

    // --------------------------------------------------
    // POSITIONS
    // --------------------------------------------------

    this.initialPosition = this.pokemon.chargedMove.initialPosition;

    if (this.phase === "FIRST" && !this.initialPosition) {
      this.initialPosition = {
        x: this.sprite.position.x,
        y: this.sprite.position.y,
      };

      this.pokemon.chargedMove.initialPosition = {
        ...this.initialPosition,
      };
    }

    this.targetInitialPosition = {
      x: this.targetSprite.position.x,
      y: this.targetSprite.position.y,
    };

    // --------------------------------------------------
    // DURATIONS
    // --------------------------------------------------

    this.stateElapsed = 0;

    this.burrowDuration = 650;
    this.dustSettleDuration = 300;

    this.groundShakeDuration = 1500;
    this.emergeDuration = 450;
    this.dustImpactDuration = 350;

    // --------------------------------------------------
    // BURROW
    // --------------------------------------------------

    this.burrowDistance = 100;

    // --------------------------------------------------
    // PARTICLES
    // --------------------------------------------------

    this.particles = [];

    this.dustColors = ["#8b6848", "#a9825c", "#c5a078", "#d8bd91", "#e8d3a9"];

    this.initializeParticles(20);

    // --------------------------------------------------
    // IMPACT PARTICLES
    // --------------------------------------------------

    this.impactParticles = [];

    this.initializeImpactParticles(16);

    // --------------------------------------------------
    // EMERGE POSITION
    // --------------------------------------------------

    this.emergeStart = null;
    this.emergeEnd = null;

    if (this.phase === "SECOND") {
      this.initializeEmerge();
    }
  }

  // --------------------------------------------------
  // PARTICLES
  // --------------------------------------------------

  initializeParticles(count) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * 50 - 25,
        y: Math.random() * 12 - 6,
        vx: (Math.random() - 0.5) * 2.5,
        vy: -Math.random() * 2 - 0.5,
        size: Math.random() * 3 + 1,
        alpha: 1,
        color:
          this.dustColors[Math.floor(Math.random() * this.dustColors.length)],
      });
    }
  }

  initializeImpactParticles(count) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;

      this.impactParticles.push({
        angle,
        distance: 5 + Math.random() * 8,
        speed: 1.5 + Math.random() * 2.5,
        size: 2 + Math.random() * 3,
        alpha: 1,
        color:
          this.dustColors[Math.floor(Math.random() * this.dustColors.length)],
      });
    }
  }

  // --------------------------------------------------
  // HELPERS
  // --------------------------------------------------

  getSpriteCenter(sprite) {
    return {
      x: sprite.position.x + sprite.frameWidth / 2,
      y: sprite.position.y + sprite.frameHeight / 2,
    };
  }

  getTargetGroundPosition() {
    const target = this.targetSprite;

    return {
      x: target.position.x + target.frameWidth / 2,
      y: target.position.y + target.frameHeight / 2,
    };
  }

  clamp(value, min, max) {
    return Math.max(min, Math.min(value, max));
  }

  // --------------------------------------------------
  // FIRST : BURROW
  // --------------------------------------------------

  updateBurrow() {
    this.stateElapsed += 12;

    const progress = this.clamp(this.stateElapsed / this.burrowDuration, 0, 1);

    const easedProgress = progress * progress;

    this.sprite.position.y =
      this.initialPosition.y + this.burrowDistance * easedProgress;

    const center = this.getSpriteCenter(this.sprite);

    // Poussière soulevée autour du Pokémon.
    if (Math.random() < 0.8) {
      this.spawnDust(
        center.x,
        this.initialPosition.y + this.sprite.frameHeight - 4,
        2
      );
    }

    this.updateParticles();

    if (progress >= 1) {
      // Le Pokémon disparaît sous le sol.
      this.sprite.position.y = this.initialPosition.y + 1000;

      this.state = "DUST_SETTLE";
      this.stateElapsed = 0;
    }
  }

  // --------------------------------------------------
  // FIRST : DUST SETTLE
  // --------------------------------------------------

  updateDustSettle() {
    this.stateElapsed += 16;

    this.updateParticles();

    if (this.stateElapsed >= this.dustSettleDuration) {
      this.isFinished = true;
    }
  }

  // --------------------------------------------------
  // SECOND : INITIALIZE EMERGE
  // --------------------------------------------------

  initializeEmerge() {
    this.game.canvas.startShake(2500, 3);

    const ground = this.getTargetGroundPosition();

    this.emergeStart = {
      x: ground.x - this.sprite.frameWidth / 2,
      y: ground.y + 300,
    };

    this.emergeEnd = {
      x: ground.x - this.sprite.frameWidth / 2,
      y: ground.y - this.sprite.frameHeight - 300,
    };

    // Le Pokémon commence sous le sol, près de sa cible.
    this.sprite.position.x = this.emergeStart.x;
    this.sprite.position.y = this.emergeStart.y;
  }

  // --------------------------------------------------
  // SECOND : GROUND SHAKE
  // --------------------------------------------------

  updateGroundShake() {
    this.stateElapsed += 16;

    const ground = this.getTargetGroundPosition();

    if (Math.random() < 0.9) {
      this.spawnDust(ground.x, ground.y, 2);
    }

    this.updateParticles();

    if (this.stateElapsed >= this.groundShakeDuration) {
      this.state = "EMERGE";
      this.stateElapsed = 0;
    }
  }

  // --------------------------------------------------
  // SECOND : EMERGE
  // --------------------------------------------------

  updateEmerge() {
    this.stateElapsed += 16;

    const progress = this.clamp(this.stateElapsed / this.emergeDuration, 0, 1);

    // Déplacement rapide avec ralentissement à l'arrivée.
    const easedProgress = 1 - (1 - progress) * (1 - progress);

    this.sprite.position.x =
      this.emergeStart.x +
      (this.emergeEnd.x - this.emergeStart.x) * easedProgress;

    this.sprite.position.y =
      this.emergeStart.y +
      (this.emergeEnd.y - this.emergeStart.y) * easedProgress;

    const center = this.getSpriteCenter(this.sprite);

    if (Math.random() < 0.9) {
      this.spawnDust(center.x, center.y + this.sprite.frameHeight / 2, 2);
    }

    this.updateParticles();

    if (progress >= 1) {
      this.state = "DUST_IMPACT";
      this.stateElapsed = 0;

      // Repositionnement exact du sprite.
      this.sprite.position.x = this.initialPosition.x;
      this.sprite.position.y = this.initialPosition.y;
    }
  }

  // --------------------------------------------------
  // SECOND : DUST IMPACT
  // --------------------------------------------------

  updateDustImpact() {
    this.stateElapsed += 16;

    for (const particle of this.impactParticles) {
      particle.distance += particle.speed;
      particle.alpha = Math.max(
        0,
        1 - this.stateElapsed / this.dustImpactDuration
      );
    }

    this.updateParticles();

    if (this.stateElapsed >= this.dustImpactDuration) {
      this.isFinished = true;
    }
  }

  // --------------------------------------------------
  // SPAWN DUST
  // --------------------------------------------------

  spawnDust(x, y, count = 1) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 24,
        y: y + (Math.random() - 0.5) * 8,
        vx: (Math.random() - 0.5) * 3,
        vy: -Math.random() * 2.5 - 0.5,
        size: Math.random() * 3 + 1,
        alpha: 1,
        color:
          this.dustColors[Math.floor(Math.random() * this.dustColors.length)],
      });
    }
  }

  // --------------------------------------------------
  // UPDATE PARTICLES
  // --------------------------------------------------

  updateParticles() {
    for (const particle of this.particles) {
      particle.x += particle.vx;
      particle.y += particle.vy;

      particle.vy += 0.06;
      particle.alpha -= 0.025;
    }

    this.particles = this.particles.filter((particle) => particle.alpha > 0);
  }

  // --------------------------------------------------
  // DRAW PARTICLES
  // --------------------------------------------------

  drawParticles(context) {
    const ctx = context;

    ctx.save();

    for (const particle of this.particles) {
      ctx.globalAlpha = this.clamp(particle.alpha, 0, 1);
      ctx.fillStyle = particle.color;

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  // --------------------------------------------------
  // DRAW IMPACT PARTICLES
  // --------------------------------------------------

  drawImpactParticles(context) {
    const ctx = context;
    const ground = this.getTargetGroundPosition();

    ctx.save();

    for (const particle of this.impactParticles) {
      const x = ground.x + Math.cos(particle.angle) * particle.distance;

      const y = ground.y + Math.sin(particle.angle) * particle.distance * 0.45;

      ctx.globalAlpha = this.clamp(particle.alpha, 0, 1);
      ctx.fillStyle = particle.color;

      ctx.beginPath();
      ctx.arc(x, y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  // --------------------------------------------------
  // UPDATE
  // --------------------------------------------------

  update(context) {
    if (this.isFinished) return;

    switch (this.state) {
      case "BURROW":
        this.updateBurrow();
        break;

      case "DUST_SETTLE":
        this.updateDustSettle();
        break;

      case "GROUND_SHAKE":
        this.updateGroundShake();
        break;

      case "EMERGE":
        this.updateEmerge();
        break;

      case "DUST_IMPACT":
        this.updateDustImpact();
        break;
    }

    this.drawParticles(context);

    if (this.phase === "SECOND" && this.state === "DUST_IMPACT") {
      this.drawImpactParticles(context);
    }
  }
}
