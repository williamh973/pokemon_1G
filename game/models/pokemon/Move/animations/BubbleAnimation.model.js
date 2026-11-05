export class BubbleAnimation {
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

    this.state = "PREPARE";
    this.timer = 0;
    this.isFinished = false;

    this.bubbles = [];
    this.splashes = [];
    this.particles = [];

    this.originX =
      this.pokemonViewer.sprite.position.x +
      this.pokemonViewer.sprite.frameWidth / 2;

    this.originY =
      this.pokemonViewer.sprite.position.y +
      this.pokemonViewer.sprite.frameHeight / 2;

    this.targetX =
      this.targetViewer.sprite.position.x +
      this.targetViewer.sprite.frameWidth / 2;

    this.targetY =
      this.targetViewer.sprite.position.y +
      this.targetViewer.sprite.frameHeight / 2;

    this.bubbleCount = 12;
    this.bubblesCreated = 0;
    this.shakeStarted = false;
  }

  update(context) {
    if (this.isFinished) return;

    switch (this.state) {
      case "PREPARE":
        this.updatePrepare();
        break;

      case "FIRE":
        this.updateFire();
        break;

      case "IMPACT":
        this.updateImpact();
        break;

      case "FINISH":
        this.updateFinish();
        break;
    }

    this.updateBubbles();
    this.updateSplashes();
    this.updateParticles();

    this.draw(context);
    this.timer++;
  }

  setState(state) {
    this.state = state;
    this.timer = 0;
  }

  updatePrepare() {
    if (this.timer >= 10) {
      this.setState("FIRE");
    }
  }

  updateFire() {
    if (this.timer % 3 === 0 && this.bubblesCreated < this.bubbleCount) {
      this.createBubble();
      this.bubblesCreated++;
    }

    if (this.bubblesCreated >= this.bubbleCount && this.bubbles.length === 0) {
      this.setState("IMPACT");
    }
  }

  updateImpact() {
    if (this.timer === 1) {
      this.createSplash(this.targetX, this.targetY, 20);
    }

    if (this.timer >= 22) {
      this.setState("FINISH");
    }
  }

  updateFinish() {
    if (this.timer >= 18) {
      this.isFinished = true;
    }
  }

  createBubble() {
    const startX = this.originX + (Math.random() - 0.5) * 15;
    const startY = this.originY + (Math.random() - 0.5) * 15;

    const dx = this.targetX - startX;
    const dy = this.targetY - startY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const speed = 4 + Math.random() * 2;

    this.bubbles.push({
      x: startX,
      y: startY,
      vx: (dx / distance) * speed,
      vy: (dy / distance) * speed,
      radius: 3 + Math.random() * 5,
      life: 80,
      phase: Math.random() * Math.PI * 2,
      wobble: 0.4 + Math.random() * 0.8,
    });
  }

  updateBubbles() {
    this.bubbles.forEach((bubble) => {
      bubble.x += bubble.vx;
      bubble.y += bubble.vy;

      bubble.phase += 0.12;
      bubble.x += Math.sin(bubble.phase) * bubble.wobble;

      bubble.life--;

      const dx = this.targetX - bubble.x;
      const dy = this.targetY - bubble.y;

      if (Math.sqrt(dx * dx + dy * dy) < 12) {
        bubble.life = 0;
        this.createSplash(bubble.x, bubble.y, 5);
      }
    });

    this.bubbles = this.bubbles.filter((bubble) => bubble.life > 0);
  }

  createSplash(x, y, count) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 3;

      this.splashes.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 1 + Math.random() * 3,
        life: 15 + Math.random() * 12,
      });
    }
  }

  updateSplashes() {
    this.splashes.forEach((splash) => {
      splash.x += splash.vx;
      splash.y += splash.vy;

      splash.vx *= 0.94;
      splash.vy *= 0.94;

      splash.radius *= 0.96;
      splash.life--;
    });

    this.splashes = this.splashes.filter((splash) => splash.life > 0);
  }

  updateParticles() {
    this.particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += 0.04;
      particle.life--;
    });

    this.particles = this.particles.filter((particle) => particle.life > 0);
  }

  draw(context) {
    this.drawBubbles(context);
    this.drawSplashes(context);
  }

  drawBubbles(context) {
    context.save();

    this.bubbles.forEach((bubble) => {
      const pulse = Math.sin(bubble.phase) * 0.8;
      const radius = bubble.radius + pulse;

      const gradient = context.createRadialGradient(
        bubble.x - radius * 0.35,
        bubble.y - radius * 0.35,
        0,
        bubble.x,
        bubble.y,
        radius * 1.3
      );

      gradient.addColorStop(0, "rgba(255,255,255,0.9)");
      gradient.addColorStop(0.3, "rgba(180,240,255,0.45)");
      gradient.addColorStop(0.75, "rgba(50,170,230,0.25)");
      gradient.addColorStop(1, "rgba(30,120,210,0.65)");

      context.fillStyle = gradient;
      context.strokeStyle = "rgba(180,240,255,0.85)";
      context.lineWidth = 1;

      context.beginPath();
      context.arc(bubble.x, bubble.y, radius, 0, Math.PI * 2);
      context.fill();
      context.stroke();

      // Reflet lumineux
      context.fillStyle = "rgba(255,255,255,0.9)";
      context.beginPath();
      context.ellipse(
        bubble.x - radius * 0.35,
        bubble.y - radius * 0.35,
        radius * 0.22,
        radius * 0.13,
        -0.5,
        0,
        Math.PI * 2
      );
      context.fill();
    });

    context.restore();
  }

  drawSplashes(context) {
    context.save();
    context.globalCompositeOperation = "lighter";

    this.splashes.forEach((splash) => {
      context.globalAlpha = Math.min(1, splash.life / 10);
      context.fillStyle = "#8ceaff";

      context.beginPath();
      context.arc(splash.x, splash.y, splash.radius, 0, Math.PI * 2);
      context.fill();
    });

    context.restore();
  }
}
