export class SmokescreenAnimation {
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

    this.phase = "projection";
    this.timer = 0;
    this.isFinished = false;

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

    this.direction = this.targetX > this.startX ? 1 : -1;

    this.smoke = [];
    this.createSmoke();

    this.targetClouds = [];
    this.createTargetClouds();
  }

  createSmoke() {
    for (let i = 0; i < 18; i++) {
      this.smoke.push({
        x: this.startX,
        y: this.startY,
        offsetX: (Math.random() - 0.5) * 24,
        offsetY: (Math.random() - 0.5) * 24,
        size: 8 + Math.random() * 13,
        speed: 0.025 + Math.random() * 0.015,
        delay: i * 2,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.06,
        color: ["#34343b", "#494950", "#606068", "#77777e"][
          Math.floor(Math.random() * 4)
        ],
        alpha: 0,
      });
    }
  }

  createTargetClouds() {
    for (let i = 0; i < 26; i++) {
      const angle = (Math.PI * 2 * i) / 26;

      this.targetClouds.push({
        angle,
        radius: 8 + Math.random() * 28,
        size: 10 + Math.random() * 15,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.08,
        color: ["#34343b", "#494950", "#606068", "#77777e"][
          Math.floor(Math.random() * 4)
        ],
        alpha: 0,
        offsetY: (Math.random() - 0.5) * 18,
      });
    }
  }

  update(context) {
    if (this.isFinished) return;

    this.timer++;

    switch (this.phase) {
      case "projection":
        this.updateProjection();
        break;

      case "expansion":
        this.updateExpansion();
        break;

      case "dissipation":
        this.updateDissipation();
        break;
    }

    this.draw(context);
  }

  updateProjection() {
    this.smoke.forEach((particle) => {
      if (this.timer < particle.delay) return;

      const progress = Math.min(1, (this.timer - particle.delay) / 38);

      particle.x =
        this.startX +
        (this.targetX - this.startX) * progress +
        particle.offsetX * (1 - progress);

      particle.y =
        this.startY +
        (this.targetY - this.startY) * progress +
        particle.offsetY +
        Math.sin(progress * Math.PI * 3) * 8;

      particle.alpha = Math.min(0.75, progress * 1.5);
      particle.size += particle.speed * 5;
      particle.rotation += particle.rotationSpeed;
    });

    if (this.timer >= 48) {
      this.phase = "expansion";
      this.timer = 0;
    }
  }

  updateExpansion() {
    this.targetClouds.forEach((cloud) => {
      cloud.radius += 0.45;
      cloud.rotation += cloud.rotationSpeed;
      cloud.alpha = Math.min(0.85, this.timer / 8);
    });

    if (this.timer >= 35) {
      this.phase = "dissipation";
      this.timer = 0;
    }
  }

  updateDissipation() {
    this.targetClouds.forEach((cloud) => {
      cloud.radius += 0.35;
      cloud.rotation += cloud.rotationSpeed;
      cloud.alpha *= 0.94;
    });

    this.smoke.forEach((particle) => {
      particle.alpha *= 0.94;
      particle.y -= 0.25;
      particle.rotation += particle.rotationSpeed;
    });

    if (this.timer >= 40) {
      this.isFinished = true;
    }
  }

  drawSmokeParticle(context, particle) {
    context.save();

    context.translate(particle.x, particle.y);
    context.rotate(particle.rotation);
    context.globalAlpha = particle.alpha;

    const gradient = context.createRadialGradient(0, 0, 1, 0, 0, particle.size);

    gradient.addColorStop(0, particle.color);
    gradient.addColorStop(0.65, particle.color);
    gradient.addColorStop(1, "rgba(40,40,45,0)");

    context.fillStyle = gradient;
    context.strokeStyle = gradient;
    context.lineWidth = 6 * particle.alpha + 0.5;

    context.beginPath();
    context.ellipse(
      0,
      0,
      particle.size * 1.2,
      particle.size * 0.8,
      0,
      0,
      Math.PI * 2
    );
    context.fill();

    context.restore();
  }

  drawTargetCloud(context, cloud) {
    const x =
      this.targetX + Math.cos(cloud.angle + this.timer * 0.025) * cloud.radius;

    const y =
      this.targetY +
      cloud.offsetY +
      Math.sin(cloud.angle + this.timer * 0.025) * cloud.radius * 0.65;

    this.drawSmokeParticle(context, {
      x,
      y,
      size: cloud.size,
      rotation: cloud.rotation,
      color: cloud.color,
      alpha: cloud.alpha,
    });
  }

  draw(context) {
    if (this.phase === "projection") {
      this.smoke.forEach((particle) => {
        this.drawSmokeParticle(context, particle);
      });
    }

    if (this.phase === "expansion" || this.phase === "dissipation") {
      this.targetClouds.forEach((cloud) => {
        this.drawTargetCloud(context, cloud);
      });

      this.smoke.forEach((particle) => {
        this.drawSmokeParticle(context, particle);
      });
    }
  }
}
