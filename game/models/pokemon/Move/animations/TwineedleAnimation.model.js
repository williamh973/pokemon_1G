export class TwineedleAnimation {
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

    this.phase = "launch";
    this.timer = 0;
    this.isFinished = false;

    this.attacker = this.pokemonViewer.sprite;
    this.target = this.targetViewer.sprite;

    this.direction = this.target.position.x > this.attacker.position.x ? 1 : -1;

    this.startX =
      this.attacker.position.x +
      (this.attacker.frameWidth * this.attacker.scale) / 2;

    this.startY =
      this.attacker.position.y +
      (this.attacker.frameHeight * this.attacker.scale) / 2;

    this.targetX =
      this.target.position.x + (this.target.frameWidth * this.target.scale) / 2;

    this.targetY =
      this.target.position.y +
      (this.target.frameHeight * this.target.scale) / 2;

    this.needles = [
      {
        offsetY: -13,
        startOffsetX: -9,
        impact: false,
        color: "#c9e84b",
      },
      {
        offsetY: 13,
        startOffsetX: 9,
        impact: false,
        color: "#91c936",
      },
    ];

    this.particles = [];
    this.impacts = [];
  }

  update(context) {
    if (this.isFinished) return;

    this.timer++;

    switch (this.phase) {
      case "launch":
        this.updateLaunch();
        break;

      case "impact":
        this.updateImpact();
        break;

      case "dissipate":
        this.updateDissipate();
        break;
    }

    this.draw(context);
  }

  updateLaunch() {
    if (this.timer >= 30) {
      this.phase = "impact";
      this.timer = 0;
    }
  }

  updateImpact() {
    if (this.timer === 1 || this.timer === 6) {
      const index = this.timer === 1 ? 0 : 1;
      this.createImpact(index);

      this.game.canvas.startShake(5, 2);
    }

    if (this.timer >= 15) {
      this.phase = "dissipate";
      this.timer = 0;
    }
  }

  updateDissipate() {
    if (this.timer >= 18) {
      this.isFinished = true;
    }
  }

  getNeedlePosition(needle, progress) {
    const travelX = this.targetX - this.startX;
    const travelY = this.targetY - this.startY;

    const startX = this.startX + needle.startOffsetX;
    const startY = this.startY + needle.offsetY;

    const endX = this.targetX;
    const endY = this.targetY + needle.offsetY * 0.15;

    // Les deux dards se croisent pendant leur déplacement.
    const crossOffset = Math.sin(progress * Math.PI) * 22;

    return {
      x: startX + (endX - startX) * progress,
      y:
        startY +
        (endY - startY) * progress +
        (needle.offsetY < 0 ? crossOffset : -crossOffset),
    };
  }

  createImpact(index) {
    const needle = this.needles[index];
    const position = this.getNeedlePosition(needle, 1);

    this.impacts.push({
      x: position.x,
      y: position.y,
      color: needle.color,
      age: 0,
    });

    for (let i = 0; i < 9; i++) {
      const angle = (Math.PI * 2 * i) / 9;
      const speed = 1.5 + Math.random() * 2;

      this.particles.push({
        x: position.x,
        y: position.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 1.5 + Math.random() * 1.5,
        color: needle.color,
        life: 16,
      });
    }
  }

  updateParticles() {
    this.particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vx *= 0.94;
      particle.vy *= 0.94;
      particle.life--;
    });

    this.particles = this.particles.filter((particle) => particle.life > 0);

    this.impacts.forEach((impact) => impact.age++);
  }

  drawNeedle(context, x, y, color, angle) {
    context.save();
    context.translate(x, y);
    context.rotate(angle);

    // Corps du dard.
    context.fillStyle = color;
    context.beginPath();
    context.moveTo(0, -3);
    context.lineTo(13, 0);
    context.lineTo(0, 3);
    context.lineTo(2, 0);
    context.closePath();
    context.fill();

    // Pointe lumineuse.
    context.fillStyle = "#f4ff9b";
    context.beginPath();
    context.moveTo(8, -1.5);
    context.lineTo(14, 0);
    context.lineTo(8, 1.5);
    context.closePath();
    context.fill();

    // Petit reflet.
    context.strokeStyle = "rgba(255,255,210,0.8)";
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(1, -1);
    context.lineTo(8, -1);
    context.stroke();

    context.restore();
  }

  drawImpact(context, impact) {
    const progress = impact.age / 12;
    const radius = 3 + progress * 13;
    const alpha = Math.max(0, 1 - progress);

    context.save();
    context.globalAlpha = alpha;

    // Halo.
    context.strokeStyle = impact.color;
    context.lineWidth = 2;
    context.beginPath();
    context.arc(impact.x, impact.y, radius, 0, Math.PI * 2);
    context.stroke();

    // Éclat central.
    context.fillStyle = "#f4ff9b";
    context.beginPath();
    context.arc(impact.x, impact.y, 3 * alpha, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }

  drawParticles(context) {
    this.particles.forEach((particle) => {
      context.save();
      context.globalAlpha = Math.min(1, particle.life / 10);
      context.fillStyle = particle.color;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fill();

      context.restore();
    });
  }

  draw(context) {
    if (this.phase === "launch") {
      const progress = Math.min(1, this.timer / 30);

      this.needles.forEach((needle) => {
        const position = this.getNeedlePosition(needle, progress);

        const angle = Math.atan2(
          this.targetY - this.startY,
          this.targetX - this.startX
        );

        this.drawNeedle(context, position.x, position.y, needle.color, angle);
      });
    }

    if (this.phase === "impact" || this.phase === "dissipate") {
      this.updateParticles();

      this.impacts.forEach((impact) => {
        this.drawImpact(context, impact);
      });

      this.drawParticles(context);
    }
  }
}
