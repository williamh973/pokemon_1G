export class CounterAnimation {
  constructor(game, viewers, turnAction) {
    this.game = game;
    this.viewers = viewers;
    this.turnAction = turnAction;

    if (this.viewers.front.slot.content === turnAction.pokemon) {
      this.pokemonViewer = this.viewers.front;
      this.targetViewer = this.viewers.back;
    } else {
      this.pokemonViewer = this.viewers.back;
      this.targetViewer = this.viewers.front;
    }

    this.attacker = this.pokemonViewer.sprite;
    this.target = this.targetViewer.sprite;

    this.direction = this.target.position.x > this.attacker.position.x ? 1 : -1;

    this.attackerOriginal = {
      x: this.attacker.position.x,
      y: this.attacker.position.y,
    };

    this.targetOriginal = {
      x: this.target.position.x,
      y: this.target.position.y,
    };

    this.attackerCenter = {
      x: this.attacker.position.x + this.attacker.frameWidth / 2,
      y: this.attacker.position.y + this.attacker.frameHeight / 2,
    };

    this.targetCenter = {
      x: this.target.position.x + this.target.frameWidth / 2,
      y: this.target.position.y + this.target.frameHeight / 2,
    };

    this.phase = "INCOMING";
    this.timer = 0;
    this.isFinished = false;

    this.phases = {
      INCOMING: 16,
      RECOIL: 12,
      COUNTER: 18,
      COLLISION: 14,
      RETURN: 20,
    };

    this.particles = [];
    this.shockwaves = [];
    this.flash = 0;

    this.impactPosition = {
      x: (this.attackerCenter.x + this.targetCenter.x) / 2,
      y: (this.attackerCenter.y + this.targetCenter.y) / 2,
    };

    this.impactCreated = false;
  }

  update(context) {
    if (this.isFinished) return;

    this.timer++;

    switch (this.phase) {
      case "INCOMING":
        this.updateIncoming();

        if (this.timer >= this.phases.INCOMING) {
          this.nextPhase("RECOIL");
        }
        break;

      case "RECOIL":
        this.updateRecoil();

        if (this.timer >= this.phases.RECOIL) {
          this.nextPhase("COUNTER");
        }
        break;

      case "COUNTER":
        this.updateCounter();

        if (this.timer === 9) {
          this.createImpact();
        }

        if (this.timer >= this.phases.COUNTER) {
          this.nextPhase("COLLISION");
        }
        break;

      case "COLLISION":
        this.updateCollision();

        if (this.timer >= this.phases.COLLISION) {
          this.nextPhase("RETURN");
        }
        break;

      case "RETURN":
        this.updateReturn();

        if (this.timer >= this.phases.RETURN) {
          this.restoreSprites();
          this.isFinished = true;
        }
        break;
    }

    this.updateParticles();
    this.updateShockwaves();

    if (this.flash > 0) this.flash--;

    this.draw(context);
  }

  nextPhase(phase) {
    this.phase = phase;
    this.timer = 0;
  }

  lerp(start, end, progress) {
    return start + (end - start) * progress;
  }

  easeOut(progress) {
    return 1 - Math.pow(1 - progress, 3);
  }

  easeInOut(progress) {
    return progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;
  }

  setAttackerPosition(x, y) {
    this.attacker.position = { x, y };
  }

  setTargetPosition(x, y) {
    this.target.position = { x, y };
  }

  // 1. L'adversaire fonce sur le Pokémon qui prépare Riposte.
  updateIncoming() {
    const progress = this.easeOut(this.timer / this.phases.INCOMING);

    const distance = 19 * progress;

    this.setTargetPosition(
      this.targetOriginal.x - this.direction * distance,
      this.targetOriginal.y
    );

    // Le Pokémon encaisse le coup et recule légèrement.
    const recoil = Math.sin(progress * Math.PI) * 7;

    this.setAttackerPosition(
      this.attackerOriginal.x - this.direction * recoil,
      this.attackerOriginal.y + recoil * 0.4
    );

    if (this.timer % 3 === 0) {
      this.createSmallImpact(
        this.attackerCenter.x - this.direction * 10,
        this.attackerCenter.y
      );
    }
  }

  // 2. Le Pokémon reprend son appui.
  updateRecoil() {
    const progress = this.easeOut(this.timer / this.phases.RECOIL);

    this.setAttackerPosition(
      this.lerp(
        this.attackerOriginal.x - this.direction * 7,
        this.attackerOriginal.x,
        progress
      ),
      this.lerp(this.attackerOriginal.y + 3, this.attackerOriginal.y, progress)
    );

    this.setTargetPosition(
      this.lerp(
        this.targetOriginal.x - this.direction * 19,
        this.targetOriginal.x,
        progress
      ),
      this.targetOriginal.y
    );

    // Petites marques de tension musculaire.
    if (this.timer % 4 === 0) {
      this.createSmallImpact(this.attackerCenter.x, this.attackerCenter.y);
    }
  }

  // 3. Le contre : l'attaquant bondit vers son adversaire.
  updateCounter() {
    const progress = this.easeInOut(this.timer / this.phases.COUNTER);

    const attackerDistance = 48 * progress;

    this.setAttackerPosition(
      this.attackerOriginal.x + this.direction * attackerDistance,
      this.attackerOriginal.y - Math.sin(progress * Math.PI) * 8
    );

    // L'adversaire commence à être repoussé par le contre.
    const targetDistance = 25 * progress;

    this.setTargetPosition(
      this.targetOriginal.x + this.direction * targetDistance,
      this.targetOriginal.y
    );

    // Traînées physiques derrière le Pokémon.
    if (this.timer % 2 === 0) {
      this.createMovementDust();
    }
  }

  // 4. Les deux Pokémon encaissent la collision.
  updateCollision() {
    const progress = this.timer / this.phases.COLLISION;

    // L'attaquant poursuit son mouvement puis se stabilise.
    const attackerDistance = 48 + Math.sin(progress * Math.PI) * 5;

    this.setAttackerPosition(
      this.attackerOriginal.x + this.direction * attackerDistance,
      this.attackerOriginal.y
    );

    // L'adversaire est violemment repoussé.
    const targetDistance = 25 + this.easeOut(progress) * 28;

    this.setTargetPosition(
      this.targetOriginal.x + this.direction * targetDistance,
      this.targetOriginal.y
    );

    if (this.timer % 3 === 0) {
      this.createSmallImpact(this.impactPosition.x, this.impactPosition.y);
    }
  }

  // 5. Les sprites reviennent progressivement à leur place.
  updateReturn() {
    const progress = this.easeOut(this.timer / this.phases.RETURN);

    this.setAttackerPosition(
      this.lerp(
        this.attackerOriginal.x + this.direction * 48,
        this.attackerOriginal.x,
        progress
      ),
      this.lerp(this.attackerOriginal.y, this.attackerOriginal.y, progress)
    );

    this.setTargetPosition(
      this.lerp(
        this.targetOriginal.x + this.direction * 53,
        this.targetOriginal.x,
        progress
      ),
      this.lerp(this.targetOriginal.y, this.targetOriginal.y, progress)
    );
  }

  restoreSprites() {
    this.setAttackerPosition(this.attackerOriginal.x, this.attackerOriginal.y);

    this.setTargetPosition(this.targetOriginal.x, this.targetOriginal.y);
  }

  createImpact() {
    this.impactCreated = true;

    this.game.canvas.startShake(18, 6);
    this.flash = 5;

    for (let i = 0; i < 45; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 6;

      this.particles.push({
        x: this.impactPosition.x,
        y: this.impactPosition.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 1 + Math.random() * 3,
        life: 16 + Math.random() * 12,
        maxLife: 28,
      });
    }

    this.shockwaves.push({
      radius: 5,
      maxRadius: 75,
      life: 15,
      maxLife: 15,
    });

    this.shockwaves.push({
      radius: 3,
      maxRadius: 45,
      life: 11,
      maxLife: 11,
    });
  }

  createSmallImpact(x, y) {
    this.particles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 4,
      vy: -Math.random() * 3,
      radius: 1 + Math.random() * 2,
      life: 8,
      maxLife: 8,
    });
  }

  createMovementDust() {
    const x =
      this.attacker.position.x +
      (this.direction === 1 ? 0 : this.attacker.frameWidth);

    const y = this.attacker.position.y + this.attacker.frameHeight - 4;

    for (let i = 0; i < 2; i++) {
      this.particles.push({
        x,
        y,
        vx: -this.direction * (1 + Math.random() * 3),
        vy: -Math.random() * 2,
        radius: 1 + Math.random() * 2,
        life: 12,
        maxLife: 12,
      });
    }
  }

  updateParticles() {
    this.particles.forEach((particle) => {
      if (particle.life <= 0) return;

      particle.x += particle.vx;
      particle.y += particle.vy;

      particle.vx *= 0.94;
      particle.vy *= 0.94;

      particle.life--;
    });
  }

  updateShockwaves() {
    this.shockwaves.forEach((wave) => {
      if (wave.life <= 0) return;

      const progress = 1 - wave.life / wave.maxLife;

      wave.radius = progress * wave.maxRadius;
      wave.life--;
    });
  }

  draw(context) {
    context.save();

    this.drawIncoming(context);
    this.drawCounter(context);
    this.drawCollision(context);
    this.drawShockwaves(context);
    this.drawParticles(context);
    this.drawFlash(context);

    context.restore();
  }

  drawIncoming(context) {
    if (this.phase !== "INCOMING") return;

    const progress = this.timer / this.phases.INCOMING;

    // Traits de déplacement de l'adversaire.
    context.globalAlpha = 0.7 * (1 - progress);
    context.strokeStyle = "#d6d6d6";
    context.lineWidth = 2;

    const x = this.targetCenter.x;
    const y = this.targetCenter.y;

    for (let i = 0; i < 4; i++) {
      const offset = (i - 1.5) * 7;

      context.beginPath();
      context.moveTo(x + this.direction * 8, y + offset);
      context.lineTo(x + this.direction * 22, y + offset);
      context.stroke();
    }
  }

  drawCounter(context) {
    if (this.phase !== "COUNTER") return;

    const progress = this.timer / this.phases.COUNTER;

    const x = this.attacker.position.x + this.attacker.frameWidth / 2;

    const y = this.attacker.position.y + this.attacker.frameHeight / 2;

    // Lignes de vitesse derrière l'attaquant.
    context.globalAlpha = 0.65 * (1 - progress);
    context.strokeStyle = "#f5c77c";
    context.lineWidth = 2;

    for (let i = 0; i < 5; i++) {
      const offset = (i - 2) * 8;

      context.beginPath();
      context.moveTo(x - this.direction * 5, y + offset);
      context.lineTo(x - this.direction * (20 + progress * 12), y + offset);
      context.stroke();
    }
  }

  drawCollision(context) {
    if (
      this.phase !== "COLLISION" &&
      !(this.phase === "COUNTER" && this.timer >= 9)
    ) {
      return;
    }

    const progress =
      this.phase === "COLLISION"
        ? this.timer / this.phases.COLLISION
        : (this.timer - 9) / 9;

    const radius = 10 + progress * 24;

    context.globalAlpha = 0.65 * (1 - progress);
    context.fillStyle = "#f5c77c";

    context.beginPath();
    context.arc(
      this.impactPosition.x,
      this.impactPosition.y,
      radius,
      0,
      Math.PI * 2
    );
    context.fill();

    // Éclat blanc de collision.
    context.globalAlpha = 0.9 * (1 - progress);
    context.fillStyle = "#fff5d9";

    context.beginPath();
    context.arc(
      this.impactPosition.x,
      this.impactPosition.y,
      radius * 0.35,
      0,
      Math.PI * 2
    );
    context.fill();
  }

  drawShockwaves(context) {
    this.shockwaves.forEach((wave) => {
      if (wave.life <= 0) return;

      const alpha = wave.life / wave.maxLife;

      context.globalAlpha = alpha;
      context.strokeStyle = "#f5d49a";
      context.lineWidth = 3 * alpha;

      context.beginPath();
      context.ellipse(
        this.impactPosition.x,
        this.impactPosition.y,
        wave.radius,
        wave.radius * 0.55,
        0,
        0,
        Math.PI * 2
      );
      context.stroke();
    });
  }

  drawParticles(context) {
    this.particles.forEach((particle) => {
      if (particle.life <= 0) return;

      context.globalAlpha = Math.min(1, particle.life / 8);
      context.fillStyle = "#e8c18a";

      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fill();
    });
  }

  drawFlash(context) {
    if (this.flash <= 0) return;

    context.globalAlpha = (this.flash / 5) * 0.3;
    context.fillStyle = "#fff5df";

    context.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);
  }
}
