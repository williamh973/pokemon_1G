export class WhirlwindAnimation {
  constructor(game, viewers, turnAction) {
    this.game = game;
    this.viewers = viewers;
    this.turnAction = turnAction;

    if (this.viewers.front.slot.content === turnAction.pokemon) {
      this.targetViewer = this.viewers.back;
    } else {
      this.targetViewer = this.viewers.front;
    }

    this.target = this.targetViewer.sprite;

    this.targetOriginPositionX = this.target.position.x;

    this.phase = "gust";
    this.timer = 0;
    this.isFinished = false;

    this.width = this.game.canvas.width;
    this.height = this.game.canvas.height;

    this.direction = viewers.front.slot.content === turnAction.pokemon ? -1 : 1;

    this.duration = {
      gust: 65,
      storm: 100,
      fade: 35,
    };

    this.gusts = [];
    this.vortices = [];
    this.debris = [];

    this.createGusts();
    this.createVortices();
    this.createDebris();
  }

  createGusts() {
    for (let i = 0; i < 60; i++) {
      this.gusts.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        length: 35 + Math.random() * 85,
        thickness: 1 + Math.random() * 3,
        speed: 8 + Math.random() * 12,
        wave: 8 + Math.random() * 15,
        frequency: 0.025 + Math.random() * 0.04,
        phase: Math.random() * Math.PI * 2,
        alpha: 0.2 + Math.random() * 0.4,
        color: ["#ffffff", "#d8f5ff", "#a8e6f5"][i % 3],
      });
    }
  }

  createVortices() {
    for (let i = 0; i < 10; i++) {
      this.vortices.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: 18 + Math.random() * 28,
        rotation: Math.random() * Math.PI * 2,
        speed: 0.1 + Math.random() * 0.06,
        direction: Math.random() < 0.5 ? 1 : -1,
        alpha: 0.3 + Math.random() * 0.3,
      });
    }
  }

  createDebris() {
    for (let i = 0; i < 24; i++) {
      this.debris.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        speed: 3 + Math.random() * 7,
        vy: (Math.random() - 0.5) * 3,
        size: 2 + Math.random() * 3,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.45,
        type: i % 3,
        color: ["#c9c19c", "#b4d48d", "#e5e0c8"][i % 3],
      });
    }
  }

  update(context) {
    if (this.isFinished) return;

    this.timer++;

    switch (this.phase) {
      case "gust":
        this.updateGust();
        break;

      case "storm":
        this.updateStorm();
        break;

      case "fade":
        this.updateFade();
        break;
    }

    this.draw(context);
  }

  updateGust() {
    this.updateWind();

    if (this.timer >= this.duration.gust) {
      this.phase = "storm";
      this.timer = 0;
      this.game.canvas.startShake(3500, 3);
    }
  }

  updateStorm() {
    this.updateWind();

    if (this.timer >= this.duration.storm) {
      this.phase = "fade";
      this.timer = 0;
    }
  }

  updateFade() {
    this.updateWind();

    this.direction === 1
      ? (this.target.position.x += 16)
      : (this.target.position.x -= 16);

    if (this.timer >= this.duration.fade) {
      this.isFinished = true;
      this.target.position.x = this.targetOriginPositionX;
    }
  }

  getIntensity() {
    if (this.phase === "gust") {
      return Math.min(1, this.timer / 25);
    }

    if (this.phase === "storm") {
      return 1;
    }

    return Math.max(0, 1 - this.timer / this.duration.fade);
  }

  updateWind() {
    const intensity = this.getIntensity();

    this.gusts.forEach((gust) => {
      gust.x += this.direction * gust.speed * intensity;
      gust.y += Math.sin(this.timer * gust.frequency + gust.phase) * 1.5;

      if (
        (this.direction > 0 && gust.x > this.width + gust.length) ||
        (this.direction < 0 && gust.x < -gust.length)
      ) {
        gust.x = this.direction > 0 ? -gust.length : this.width + gust.length;
        gust.y = Math.random() * this.height;
      }
    });

    this.vortices.forEach((vortex) => {
      vortex.rotation += vortex.speed * vortex.direction * intensity;
      vortex.x += this.direction * 1.5 * intensity;

      if (vortex.x < -vortex.radius * 2) {
        vortex.x = this.width + vortex.radius * 2;
      }

      if (vortex.x > this.width + vortex.radius * 2) {
        vortex.x = -vortex.radius * 2;
      }
    });

    this.debris.forEach((particle) => {
      particle.x += this.direction * particle.speed * intensity;
      particle.y += particle.vy * intensity;
      particle.rotation += particle.rotationSpeed * intensity;

      if (particle.x > this.width + 10) particle.x = -10;
      if (particle.x < -10) particle.x = this.width + 10;

      if (particle.y < -10) particle.y = this.height + 10;
      if (particle.y > this.height + 10) particle.y = -10;
    });
  }

  drawGust(context, gust, intensity) {
    context.save();

    context.globalAlpha = gust.alpha * intensity;
    context.strokeStyle = gust.color;
    context.lineWidth = gust.thickness;
    context.lineCap = "round";

    const wave = Math.sin(this.timer * gust.frequency + gust.phase) * gust.wave;

    const startX = gust.x;
    const endX = gust.x + this.direction * gust.length;

    context.beginPath();
    context.moveTo(startX, gust.y);

    context.bezierCurveTo(
      startX + this.direction * gust.length * 0.3,
      gust.y - wave,
      startX + this.direction * gust.length * 0.7,
      gust.y + wave,
      endX,
      gust.y
    );

    context.stroke();
    context.restore();
  }

  drawVortex(context, vortex, intensity) {
    context.save();

    context.translate(vortex.x, vortex.y);
    context.rotate(vortex.rotation);

    context.globalAlpha = vortex.alpha * intensity;
    context.strokeStyle = "#d8f5ff";
    context.lineWidth = 2;

    for (let i = 0; i < 3; i++) {
      const radius = vortex.radius * (1 - i * 0.23);

      context.beginPath();
      context.ellipse(0, 0, radius, radius * 0.42, i * 0.5, 0, Math.PI * 1.65);
      context.stroke();
    }

    context.restore();
  }

  drawDebris(context, particle, intensity) {
    context.save();

    context.translate(particle.x, particle.y);
    context.rotate(particle.rotation);

    context.globalAlpha = intensity;
    context.fillStyle = particle.color;

    if (particle.type === 0) {
      context.beginPath();
      context.ellipse(
        0,
        0,
        particle.size * 1.7,
        particle.size * 0.6,
        0,
        0,
        Math.PI * 2
      );
      context.fill();
    } else if (particle.type === 1) {
      context.beginPath();
      context.moveTo(-particle.size, 0);
      context.lineTo(0, -particle.size);
      context.lineTo(particle.size, 0);
      context.lineTo(0, particle.size);
      context.closePath();
      context.fill();
    } else {
      context.fillRect(
        -particle.size / 2,
        -particle.size / 2,
        particle.size,
        particle.size
      );
    }

    context.restore();
  }

  draw(context) {
    const intensity = this.getIntensity();

    context.save();

    // Légère teinte atmosphérique pendant la tempête.
    context.globalAlpha = intensity * 0.08;
    context.fillStyle = "#b9eaff";
    context.fillRect(0, 0, this.width, this.height);

    context.restore();

    // Grandes rafales traversant tout le terrain.
    this.gusts.forEach((gust) => {
      this.drawGust(context, gust, intensity);
    });

    // Turbulences réparties sur toute l'arène.
    this.vortices.forEach((vortex) => {
      this.drawVortex(context, vortex, intensity);
    });

    // Débris emportés par le vent.
    this.debris.forEach((particle) => {
      this.drawDebris(context, particle, intensity);
    });
  }
}
