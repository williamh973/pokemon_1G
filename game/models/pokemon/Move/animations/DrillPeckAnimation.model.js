export class DrillPeckAnimation {
  constructor(game, viewers, turnAction) {
    this.game = game;
    this.viewers = viewers;
    this.turnAction = turnAction;

    // Identification de l'attaquant et de la cible
    if (viewers.front.slot.content === turnAction.pokemon) {
      this.pokemonViewer = viewers.front;
      this.targetViewer = viewers.back;
    } else {
      this.pokemonViewer = viewers.back;
      this.targetViewer = viewers.front;
    }

    // Véritables instances AnimatedSprite
    this.attacker = this.pokemonViewer.sprite;
    this.target = this.targetViewer.sprite;

    this.originalAttacker = {
      x: this.attacker.position.x,
      y: this.attacker.position.y,
      rotation: this.attacker.rotation,
      flipX: this.attacker.flipX,
      scale: this.attacker.scale,
    };

    this.originalTarget = {
      x: this.target.position.x,
      y: this.target.position.y,
    };

    this.attackerWidth = this.attacker.frameWidth * this.attacker.scale;
    this.attackerHeight = this.attacker.frameHeight * this.attacker.scale;

    this.targetWidth = this.target.frameWidth * this.target.scale;
    this.targetHeight = this.target.frameHeight * this.target.scale;

    this.startCenter = {
      x: this.originalAttacker.x + this.attackerWidth / 2,
      y: this.originalAttacker.y + this.attackerHeight / 2,
    };

    this.targetCenter = {
      x: this.originalTarget.x + this.targetWidth / 2,
      y: this.originalTarget.y + this.targetHeight / 2,
    };

    const dx = this.targetCenter.x - this.startCenter.x;
    const dy = this.targetCenter.y - this.startCenter.y;

    this.distance = Math.hypot(dx, dy) || 1;

    this.directionX = dx / this.distance;
    this.directionY = dy / this.distance;

    this.phase = "CHARGE";
    this.frame = 0;
    this.isFinished = false;

    this.particles = [];
    this.rings = [];

    this.impactPosition = { ...this.targetCenter };

    this.dashDistance = this.distance + this.attackerWidth * 0.7;
    this.spinRotations = Math.PI * 6;
  }

  update(context) {
    if (this.isFinished) return;

    switch (this.phase) {
      case "CHARGE":
        this.updateCharge();
        break;

      case "DASH":
        this.updateDash();
        break;

      case "IMPACT":
        this.updateImpact();
        break;

      case "RETURN":
        this.updateReturn();
        break;
    }

    this.updateParticles();
    this.updateRings();

    // Seuls les effets sont dessinés ici.
    // Le Pokémon est toujours dessiné par le moteur.
    this.draw(context);

    this.frame++;
  }

  updateCharge() {
    const progress = this.frame / 16;

    // Le Pokémon se concentre avant de vriller.
    this.attacker.rotation =
      this.originalAttacker.rotation + Math.sin(progress * Math.PI * 4) * 0.12;

    if (this.frame >= 16) {
      this.phase = "DASH";
      this.frame = 0;
    }
  }

  updateDash() {
    const duration = 24;
    const progress = Math.min(this.frame / duration, 1);

    // Accélération progressive puis ralentissement.
    const eased = progress < 0.75 ? 1 - Math.pow(1 - progress / 0.75, 3) : 1;

    const travel = eased * this.dashDistance;

    // Déplacement du véritable sprite.
    this.attacker.position.x =
      this.originalAttacker.x + this.directionX * travel;

    this.attacker.position.y =
      this.originalAttacker.y + this.directionY * travel;

    // Rotation complète du Pokémon comme une vrille.
    this.attacker.rotation =
      this.originalAttacker.rotation + progress * this.spinRotations;

    // Effets de vitesse derrière le Pokémon.
    if (this.frame % 2 === 0) {
      this.createTrailParticles();
    }

    // Premier impact au passage sur l'adversaire.
    if (progress >= 0.48 && !this.firstImpact) {
      this.firstImpact = true;
      this.createImpact(this.targetCenter.x, this.targetCenter.y);
    }

    if (this.frame >= duration) {
      this.phase = "IMPACT";
      this.frame = 0;

      this.attacker.rotation =
        this.originalAttacker.rotation + this.spinRotations;

      this.createImpact(this.targetCenter.x, this.targetCenter.y);
      this.game.canvas?.startShake?.(7, 180);
    }
  }

  updateImpact() {
    const progress = this.frame / 12;

    // L'adversaire subit un léger recul.
    const recoil = Math.sin(progress * Math.PI) * 9;

    this.target.position.x = this.originalTarget.x + this.directionX * recoil;

    this.target.position.y = this.originalTarget.y + this.directionY * recoil;

    // La vrille ralentit progressivement.
    this.attacker.rotation =
      this.originalAttacker.rotation + this.spinRotations * (1 - progress);

    if (this.frame >= 12) {
      this.phase = "RETURN";
      this.frame = 0;
    }
  }

  updateReturn() {
    const duration = 20;
    const progress = Math.min(this.frame / duration, 1);

    // Retour progressif à la position initiale.
    const eased = 1 - Math.pow(1 - progress, 3);

    const dashEndX =
      this.originalAttacker.x + this.directionX * this.dashDistance;

    const dashEndY =
      this.originalAttacker.y + this.directionY * this.dashDistance;

    this.attacker.position.x =
      dashEndX + (this.originalAttacker.x - dashEndX) * eased;

    this.attacker.position.y =
      dashEndY + (this.originalAttacker.y - dashEndY) * eased;

    this.attacker.rotation =
      this.originalAttacker.rotation + this.spinRotations * (1 - eased);

    if (this.frame >= duration) {
      this.restoreSprites();
      this.isFinished = true;
    }
  }

  createTrailParticles() {
    const centerX = this.attacker.position.x + this.attackerWidth / 2;

    const centerY = this.attacker.position.y + this.attackerHeight / 2;

    for (let i = 0; i < 2; i++) {
      const angle = Math.random() * Math.PI * 2;

      this.particles.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * (1 + Math.random() * 2),
        vy: Math.sin(angle) * (1 + Math.random() * 2),
        life: 12 + Math.random() * 8,
        maxLife: 20,
        size: 2 + Math.random() * 3,
        color: Math.random() > 0.5 ? "#d9f7ff" : "#75cfff",
      });
    }
  }

  createImpact(x, y) {
    this.rings.push({
      x,
      y,
      radius: 5,
      maxRadius: 36,
      life: 16,
      maxLife: 16,
    });

    for (let i = 0; i < 18; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 4;

      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 18 + Math.random() * 10,
        maxLife: 28,
        size: 2 + Math.random() * 3,
        color: Math.random() > 0.5 ? "#ffffff" : "#8bdcff",
      });
    }
  }

  updateParticles() {
    this.particles = this.particles.filter((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      particle.vx *= 0.94;
      particle.vy *= 0.94;
      particle.life--;

      return particle.life > 0;
    });
  }

  updateRings() {
    this.rings = this.rings.filter((ring) => {
      ring.radius += 2;
      ring.life--;

      return ring.life > 0;
    });
  }

  draw(context) {
    this.drawRings(context);
    this.drawParticles(context);
  }

  drawRings(context) {
    context.save();

    for (const ring of this.rings) {
      const alpha = ring.life / ring.maxLife;

      context.globalAlpha = alpha;
      context.strokeStyle = "#bceeff";
      context.lineWidth = 3 * alpha;

      context.beginPath();
      context.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2);
      context.stroke();
    }

    context.restore();
  }

  drawParticles(context) {
    context.save();

    for (const particle of this.particles) {
      const alpha = particle.life / particle.maxLife;

      context.globalAlpha = alpha;
      context.fillStyle = particle.color;

      context.beginPath();
      context.arc(
        particle.x,
        particle.y,
        particle.size * alpha,
        0,
        Math.PI * 2
      );
      context.fill();
    }

    context.restore();
  }

  restoreSprites() {
    this.attacker.position.x = this.originalAttacker.x;
    this.attacker.position.y = this.originalAttacker.y;
    this.attacker.rotation = this.originalAttacker.rotation;
    this.attacker.flipX = this.originalAttacker.flipX;
    this.attacker.scale = this.originalAttacker.scale;

    this.target.position.x = this.originalTarget.x;
    this.target.position.y = this.originalTarget.y;
  }
}
