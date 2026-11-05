export class FireSpinAnimation {
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

    this.phase = "PREPARE";
    this.timer = 0;
    this.isFinished = false;

    this.flames = [];
    this.embers = [];
    this.sparks = [];

    this.rotation = 0;
    this.intensity = 0;
    this.flashOpacity = 0;

    this.centerX = 0;
    this.centerY = 0;
    this.radiusX = 0;
    this.radiusY = 0;

    this.initializeFlames();
  }

  initializeFlames() {
    for (let i = 0; i < 24; i++) {
      this.flames.push({
        angle: (Math.PI * 2 * i) / 24,
        speed: 0.035 + Math.random() * 0.025,
        height: Math.random(),
        size: 0.7 + Math.random() * 0.7,
        offset: Math.random() * Math.PI * 2,
      });
    }
  }

  update(context) {
    if (this.isFinished) return;

    this.timer++;
    this.rotation += 0.075;

    this.updateTargetPosition();
    this.updateParticles();

    switch (this.phase) {
      case "PREPARE":
        this.updatePrepare();
        break;

      case "SPIN":
        this.updateSpin();
        break;

      case "TRAP":
        this.updateTrap();
        break;

      case "FINISH":
        this.updateFinish();
        break;
    }

    this.draw(context);
  }

  updateTargetPosition() {
    const sprite = this.targetViewer.sprite;

    this.centerX = sprite.position.x + sprite.frameWidth / 2;

    this.centerY = sprite.position.y + sprite.frameHeight / 2;

    this.radiusX = Math.max(28, sprite.frameWidth * 0.8);
    this.radiusY = Math.max(20, sprite.frameHeight * 0.65);
  }

  updatePrepare() {
    this.intensity = Math.min(1, this.timer / 30);

    if (this.timer % 4 === 0) {
      this.createEmber();
    }

    if (this.timer >= 30) {
      this.phase = "SPIN";
      this.timer = 0;
    }
  }

  updateSpin() {
    this.intensity = Math.min(1, this.intensity + 0.025);

    if (this.timer % 3 === 0) {
      this.createEmber();
    }

    if (this.timer % 8 === 0) {
      this.createSparks();
    }

    if (this.timer >= 105) {
      this.phase = "TRAP";
      this.timer = 0;
    }
  }

  updateTrap() {
    this.intensity = 1;

    if (this.timer % 2 === 0) {
      this.createEmber();
    }

    if (this.timer % 7 === 0) {
      this.createSparks();
    }

    if (this.timer >= 75) {
      this.phase = "FINISH";
      this.timer = 0;
      this.flashOpacity = 0.65;
    }
  }

  updateFinish() {
    this.intensity = Math.max(0, this.intensity - 0.025);
    this.flashOpacity = Math.max(0, this.flashOpacity - 0.035);

    if (this.timer >= 45) {
      this.isFinished = true;
    }
  }

  createEmber() {
    const angle = Math.random() * Math.PI * 2;
    const height = Math.random();

    this.embers.push({
      x: this.centerX + Math.cos(angle) * this.radiusX,
      y: this.centerY + (Math.random() - 0.5) * this.radiusY * 2,
      vx: (Math.random() - 0.5) * 1.4,
      vy: -0.8 - Math.random() * 1.8,
      life: 25 + Math.random() * 30,
      maxLife: 55,
      size: 1 + Math.random() * 2.5,
    });
  }

  createSparks() {
    for (let i = 0; i < 4; i++) {
      const angle = Math.random() * Math.PI * 2;

      this.sparks.push({
        x: this.centerX + Math.cos(angle) * this.radiusX,
        y: this.centerY + Math.sin(angle) * this.radiusY,
        vx: (Math.random() - 0.5) * 3,
        vy: -1 - Math.random() * 2,
        life: 15 + Math.random() * 15,
        maxLife: 30,
        size: 1 + Math.random() * 2,
      });
    }
  }

  updateParticles() {
    this.embers.forEach((ember) => {
      ember.x += ember.vx;
      ember.y += ember.vy;
      ember.vy -= 0.025;
      ember.life--;
    });

    this.embers = this.embers.filter((ember) => ember.life > 0);

    this.sparks.forEach((spark) => {
      spark.x += spark.vx;
      spark.y += spark.vy;
      spark.vy += 0.035;
      spark.life--;
    });

    this.sparks = this.sparks.filter((spark) => spark.life > 0);

    this.flames.forEach((flame) => {
      flame.angle += flame.speed;
    });
  }

  draw(context) {
    context.save();

    this.drawFireRing(context);
    this.drawVortex(context);
    this.drawFlames(context);
    this.drawEmbers(context);
    this.drawSparks(context);
    this.drawFlash(context);

    context.restore();
  }

  drawFireRing(context) {
    if (this.intensity <= 0) return;

    const pulse = 1 + Math.sin(this.rotation * 2) * 0.08;

    context.save();
    context.translate(this.centerX, this.centerY + this.radiusY * 0.65);
    context.rotate(this.rotation * 0.25);

    context.globalAlpha = this.intensity * 0.8;
    context.lineWidth = 5;
    context.strokeStyle = "#ff6a00";
    context.shadowColor = "#ff3c00";
    context.shadowBlur = 14;

    context.beginPath();
    context.ellipse(
      0,
      0,
      this.radiusX * 1.25 * pulse,
      this.radiusY * 0.55 * pulse,
      0,
      0,
      Math.PI * 2
    );
    context.stroke();

    context.lineWidth = 2;
    context.strokeStyle = "#fff4a0";
    context.shadowBlur = 8;

    context.beginPath();
    context.ellipse(
      0,
      0,
      this.radiusX * 1.1 * pulse,
      this.radiusY * 0.45 * pulse,
      0,
      0,
      Math.PI * 2
    );
    context.stroke();

    context.restore();
  }

  drawVortex(context) {
    if (this.intensity <= 0) return;

    const height = this.targetViewer.sprite.frameHeight * 2.5;

    context.save();
    context.globalAlpha = this.intensity * 0.18;

    const gradient = context.createLinearGradient(
      this.centerX,
      this.centerY - height / 2,
      this.centerX,
      this.centerY + height / 2
    );

    gradient.addColorStop(0, "rgba(255, 50, 0, 0)");
    gradient.addColorStop(0.35, "rgba(255, 100, 0, 0.8)");
    gradient.addColorStop(0.7, "rgba(255, 60, 0, 0.9)");
    gradient.addColorStop(1, "rgba(255, 180, 0, 0)");

    context.fillStyle = gradient;
    context.beginPath();

    context.moveTo(this.centerX, this.centerY - height / 2);

    context.bezierCurveTo(
      this.centerX + this.radiusX * 1.8,
      this.centerY - height * 0.2,
      this.centerX + this.radiusX * 1.5,
      this.centerY + height * 0.3,
      this.centerX,
      this.centerY + height / 2
    );

    context.bezierCurveTo(
      this.centerX - this.radiusX * 1.5,
      this.centerY + height * 0.3,
      this.centerX - this.radiusX * 1.8,
      this.centerY - height * 0.2,
      this.centerX,
      this.centerY - height / 2
    );

    context.fill();
    context.restore();
  }

  drawFlames(context) {
    if (this.intensity <= 0) return;

    const height = this.targetViewer.sprite.frameHeight * 2.4;

    this.flames.forEach((flame, index) => {
      const angle = flame.angle + this.rotation;
      const verticalPosition = flame.height;

      const orbitRadius = this.radiusX * (0.65 + verticalPosition * 0.55);

      const x = this.centerX + Math.cos(angle) * orbitRadius;

      const y =
        this.centerY +
        height * (0.5 - verticalPosition) +
        Math.sin(angle) * this.radiusY * 0.45;

      const size = (8 + flame.size * 7) * this.intensity;

      context.save();
      context.translate(x, y);
      context.rotate(
        Math.sin(angle + flame.offset) * 0.5 + Math.cos(this.rotation) * 0.2
      );

      context.globalAlpha =
        this.intensity * (0.65 + Math.sin(this.rotation + index) * 0.2);

      const gradient = context.createLinearGradient(0, size, 0, -size * 1.6);

      gradient.addColorStop(0, "#ff2600");
      gradient.addColorStop(0.45, "#ff7800");
      gradient.addColorStop(0.8, "#ffd34d");
      gradient.addColorStop(1, "#fff6c4");

      context.fillStyle = gradient;
      context.shadowColor = "#ff4500";
      context.shadowBlur = 12;

      context.beginPath();
      context.moveTo(0, size);
      context.bezierCurveTo(
        -size * 1.2,
        size * 0.2,
        -size * 0.7,
        -size * 0.8,
        size * 0.1,
        -size * 1.6
      );
      context.bezierCurveTo(
        size * 0.2,
        -size * 0.7,
        size * 1.2,
        -size * 0.3,
        0,
        size
      );
      context.fill();

      context.restore();
    });
  }

  drawEmbers(context) {
    this.embers.forEach((ember) => {
      context.save();

      context.globalAlpha = Math.max(0, ember.life / ember.maxLife);

      context.fillStyle = "#ffb52e";
      context.shadowColor = "#ff4a00";
      context.shadowBlur = 8;

      context.beginPath();
      context.arc(ember.x, ember.y, ember.size, 0, Math.PI * 2);
      context.fill();

      context.restore();
    });
  }

  drawSparks(context) {
    this.sparks.forEach((spark) => {
      context.save();

      context.globalAlpha = Math.max(0, spark.life / spark.maxLife);

      context.strokeStyle = "#fff0a0";
      context.lineWidth = 2;
      context.shadowColor = "#ff6600";
      context.shadowBlur = 7;

      context.beginPath();
      context.moveTo(spark.x, spark.y);
      context.lineTo(spark.x - spark.vx * 2, spark.y - spark.vy * 2);
      context.stroke();

      context.restore();
    });
  }

  drawFlash(context) {
    if (this.flashOpacity <= 0) return;

    context.save();

    context.globalAlpha = this.flashOpacity;
    context.fillStyle = "#ffd66b";

    context.beginPath();
    context.arc(this.centerX, this.centerY, this.radiusX * 1.5, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }
}
