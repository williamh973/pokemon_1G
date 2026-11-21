export class RestAnimation {
  constructor(game, viewers, turnAction) {
    this.game = game;
    this.viewers = viewers;
    this.turnAction = turnAction;

    if (viewers.front.slot.content === turnAction.pokemon) {
      this.pokemonViewer = viewers.front;
    } else {
      this.pokemonViewer = viewers.back;
    }

    this.pokemon = this.pokemonViewer.sprite;

    this.originalPosition = {
      x: this.pokemon.position.x,
      y: this.pokemon.position.y,
    };

    this.center = {
      x: this.originalPosition.x + this.pokemon.frameWidth / 2,
      y: this.originalPosition.y + this.pokemon.frameHeight / 2,
    };

    this.phase = "RELAX";
    this.frame = 0;
    this.totalFrames = 0;
    this.isFinished = false;

    this.duration = {
      RELAX: 24,
      SLEEP: 30,
      DREAM: 65,
      FINISH: 28,
    };

    this.originalScale = this.pokemon.scale ?? 1;

    this.sleepOffset = 0;
    this.breathing = 0;
    this.auraOpacity = 0;
    this.auraPulse = 0;

    this.particles = [];
    this.stars = [];
    this.bubbles = [];
    this.sleepSymbols = [];
    this.rings = [];

    this.colors = {
      pink: "#F5A8D7",
      lightPink: "#FFD6F0",
      purple: "#B99BEF",
      lavender: "#D9C9FF",
      white: "#FFFFFF",
      pale: "#FFF0FA",
    };

    this.createParticles();
  }

  update(context) {
    if (this.isFinished) return;

    this.totalFrames++;

    switch (this.phase) {
      case "RELAX":
        this.updateRelax();
        break;

      case "SLEEP":
        this.updateSleep();
        break;

      case "DREAM":
        this.updateDream();
        break;

      case "FINISH":
        this.updateFinish();
        break;
    }

    this.updateParticles();
    this.draw(context);
  }

  changePhase(phase) {
    this.phase = phase;
    this.frame = 0;
  }

  getProgress() {
    return Math.min(this.frame / this.duration[this.phase], 1);
  }

  easeOut(progress) {
    return 1 - Math.pow(1 - progress, 3);
  }

  createParticles() {
    for (let i = 0; i < 22; i++) {
      this.particles.push({
        x: this.center.x + (Math.random() - 0.5) * 65,
        y: this.center.y + (Math.random() - 0.5) * 65,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -0.3 - Math.random() * 0.5,
        size: 1 + Math.random() * 2,
        alpha: 0,
        life: 30 + Math.random() * 30,
      });
    }
  }

  createStar() {
    const angle = Math.random() * Math.PI * 2;
    const distance = 20 + Math.random() * 25;

    this.stars.push({
      x: this.center.x + Math.cos(angle) * distance,
      y: this.center.y + Math.sin(angle) * distance * 0.7,
      size: 2 + Math.random() * 2,
      rotation: Math.random() * Math.PI,
      alpha: 1,
      life: 35 + Math.random() * 25,
      speed: 0.02 + Math.random() * 0.04,
    });
  }

  createBubble() {
    this.bubbles.push({
      x: this.center.x + (Math.random() - 0.5) * 45,
      y: this.center.y + 10 + Math.random() * 15,
      radius: 2 + Math.random() * 3,
      vy: -0.35 - Math.random() * 0.4,
      alpha: 0.7,
      life: 35 + Math.random() * 20,
    });
  }

  createSleepSymbol() {
    this.sleepSymbols.push({
      x: this.center.x + 12 + Math.random() * 12,
      y: this.center.y - 15,
      size: 7 + Math.random() * 4,
      alpha: 1,
      life: 65,
      vy: -0.5 - Math.random() * 0.3,
      drift: Math.random() * Math.PI * 2,
    });
  }

  createRing() {
    this.rings.push({
      radius: 9,
      alpha: 0.6,
      speed: 0.45,
    });
  }

  updateRelax() {
    const progress = this.getProgress();

    this.auraOpacity = progress * 0.25;

    // Le Pokémon commence à s'affaisser.
    this.sleepOffset = this.easeOut(progress) * 2;

    this.pokemon.position.y = this.originalPosition.y + this.sleepOffset;

    if (Math.random() < 0.25) {
      this.createStar();
    }

    this.frame++;

    if (this.frame >= this.duration.RELAX) {
      this.changePhase("SLEEP");
    }
  }

  updateSleep() {
    const progress = this.easeOut(this.getProgress());

    // Le Pokémon s'installe doucement pour dormir.
    this.sleepOffset = 2 + progress * 5;

    this.pokemon.position.y = this.originalPosition.y + this.sleepOffset;

    this.auraOpacity = 0.25 + progress * 0.3;

    if (this.frame % 12 === 0) {
      this.createSleepSymbol();
      this.createRing();
    }

    if (Math.random() < 0.35) {
      this.createBubble();
    }

    if (Math.random() < 0.25) {
      this.createStar();
    }

    this.frame++;

    if (this.frame >= this.duration.SLEEP) {
      this.changePhase("DREAM");
    }
  }

  updateDream() {
    // Respiration lente du Pokémon.
    this.breathing = Math.sin(this.totalFrames * 0.09) * 1.2;

    this.pokemon.position.y = this.originalPosition.y + 7 + this.breathing;

    this.auraPulse = Math.sin(this.totalFrames * 0.07) * 0.08;
    this.auraOpacity = 0.55 + this.auraPulse;

    if (this.frame % 22 === 0) {
      this.createSleepSymbol();
    }

    if (Math.random() < 0.22) {
      this.createStar();
    }

    if (Math.random() < 0.28) {
      this.createBubble();
    }

    this.frame++;

    if (this.frame >= this.duration.DREAM) {
      this.changePhase("FINISH");
    }
  }

  updateFinish() {
    const progress = this.getProgress();

    this.auraOpacity = 0.55 * (1 - this.easeOut(progress));

    this.pokemon.position.y =
      this.originalPosition.y + 7 * (1 - this.easeOut(progress));

    this.breathing *= 0.9;

    this.frame++;

    if (this.frame >= this.duration.FINISH) {
      this.restorePosition();
      this.isFinished = true;
    }
  }

  updateParticles() {
    this.particles = this.particles.filter((particle) => particle.life > 0);

    this.particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.alpha = Math.min(0.5, particle.life / 45);
      particle.life--;
    });

    this.stars = this.stars.filter((star) => star.life > 0);

    this.stars.forEach((star) => {
      star.y -= star.speed;
      star.rotation += 0.035;
      star.alpha = Math.min(1, star.life / 30);
      star.life--;
    });

    this.bubbles = this.bubbles.filter((bubble) => bubble.life > 0);

    this.bubbles.forEach((bubble) => {
      bubble.y += bubble.vy;
      bubble.alpha = Math.min(0.7, bubble.life / 30);
      bubble.life--;
    });

    this.sleepSymbols = this.sleepSymbols.filter((symbol) => symbol.life > 0);

    this.sleepSymbols.forEach((symbol) => {
      symbol.y += symbol.vy;
      symbol.drift += 0.06;
      symbol.x += Math.sin(symbol.drift) * 0.2;
      symbol.alpha = Math.min(1, symbol.life / 25);
      symbol.life--;
    });

    this.rings = this.rings.filter((ring) => ring.alpha > 0.03);

    this.rings.forEach((ring) => {
      ring.radius += ring.speed;
      ring.alpha -= 0.025;
    });
  }

  restorePosition() {
    this.pokemon.position.x = this.originalPosition.x;
    this.pokemon.position.y = this.originalPosition.y;
    this.pokemon.scale = this.originalScale;
  }

  draw(context) {
    context.save();

    this.drawAura(context);
    this.drawRings(context);
    this.drawParticles(context);
    this.drawBubbles(context);
    this.drawStars(context);
    this.drawSleepSymbols(context);

    context.restore();
  }

  drawAura(context) {
    if (this.auraOpacity <= 0.01) return;

    const radius = 27 + Math.sin(this.totalFrames * 0.08) * 2;

    context.save();

    const gradient = context.createRadialGradient(
      this.center.x,
      this.center.y,
      3,
      this.center.x,
      this.center.y,
      radius
    );

    gradient.addColorStop(0, `rgba(255, 214, 240, ${this.auraOpacity * 0.5})`);

    gradient.addColorStop(
      0.6,
      `rgba(185, 155, 239, ${this.auraOpacity * 0.3})`
    );

    gradient.addColorStop(1, "rgba(185, 155, 239, 0)");

    context.fillStyle = gradient;

    context.beginPath();
    context.ellipse(
      this.center.x,
      this.center.y + this.sleepOffset,
      radius * 1.2,
      radius,
      0,
      0,
      Math.PI * 2
    );
    context.fill();

    context.restore();
  }

  drawRings(context) {
    this.rings.forEach((ring) => {
      context.save();

      context.globalAlpha = ring.alpha;
      context.strokeStyle = this.colors.lightPink;
      context.lineWidth = 1;
      context.shadowColor = this.colors.pink;
      context.shadowBlur = 5;

      context.beginPath();
      context.ellipse(
        this.center.x,
        this.center.y + this.sleepOffset + 12,
        ring.radius,
        ring.radius * 0.4,
        0,
        0,
        Math.PI * 2
      );
      context.stroke();

      context.restore();
    });
  }

  drawParticles(context) {
    this.particles.forEach((particle) => {
      context.save();

      context.globalAlpha = particle.alpha;
      context.fillStyle = this.colors.lightPink;
      context.shadowColor = this.colors.pink;
      context.shadowBlur = 5;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fill();

      context.restore();
    });
  }

  drawBubbles(context) {
    this.bubbles.forEach((bubble) => {
      context.save();

      context.globalAlpha = bubble.alpha;
      context.strokeStyle = this.colors.white;
      context.lineWidth = 1;
      context.shadowColor = this.colors.purple;
      context.shadowBlur = 5;

      context.beginPath();
      context.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
      context.stroke();

      context.restore();
    });
  }

  drawStars(context) {
    this.stars.forEach((star) => {
      context.save();

      context.translate(star.x, star.y);
      context.rotate(star.rotation);
      context.globalAlpha = star.alpha;

      context.fillStyle = this.colors.white;
      context.shadowColor = this.colors.pink;
      context.shadowBlur = 7;

      this.drawStarShape(context, star.size);

      context.restore();
    });
  }

  drawStarShape(context, size) {
    context.beginPath();

    for (let i = 0; i < 10; i++) {
      const radius = i % 2 === 0 ? size : size * 0.4;
      const angle = (Math.PI * 2 * i) / 10 - Math.PI / 2;

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
  }

  drawSleepSymbols(context) {
    this.sleepSymbols.forEach((symbol) => {
      context.save();

      context.globalAlpha = symbol.alpha;
      context.fillStyle = this.colors.lavender;
      context.strokeStyle = this.colors.white;
      context.lineWidth = 0.5;
      context.font = `bold ${symbol.size}px Arial`;
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.shadowColor = this.colors.purple;
      context.shadowBlur = 6;

      context.fillText("Z", symbol.x, symbol.y);
      context.strokeText("Z", symbol.x, symbol.y);

      context.restore();
    });
  }
}
