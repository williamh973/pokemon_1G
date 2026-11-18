export class LovelyKissAnimation {
  constructor(game, viewers, turnAction) {
    this.game = game;
    this.viewers = viewers;
    this.turnAction = turnAction;

    if (viewers.front.slot.content === turnAction.pokemon) {
      this.pokemonViewer = viewers.front;
      this.targetViewer = viewers.back;
    } else {
      this.pokemonViewer = viewers.back;
      this.targetViewer = viewers.front;
    }

    this.attacker = this.pokemonViewer.sprite;
    this.target = this.targetViewer.sprite;

    this.attackerX =
      this.attacker.position.x +
      (this.attacker.frameWidth * this.attacker.scale) / 2;

    this.attackerY =
      this.attacker.position.y +
      (this.attacker.frameHeight * this.attacker.scale) / 2;

    this.targetX =
      this.target.position.x + (this.target.frameWidth * this.target.scale) / 2;

    this.targetY =
      this.target.position.y +
      (this.target.frameHeight * this.target.scale) / 2;

    this.direction = this.targetX > this.attackerX ? 1 : -1;

    this.phase = "HEART";
    this.timer = 0;
    this.isFinished = false;

    this.heartScale = 0;
    this.impactAlpha = 0;
    this.sleepAlpha = 0;

    this.hearts = Array.from({ length: 5 }, (_, i) => ({
      progress: -i * 0.18,
      size: 5 + Math.random() * 3,
      offsetY: (Math.random() - 0.5) * 22,
      wobble: Math.random() * Math.PI * 2,
      speed: 0.022 + Math.random() * 0.008,
    }));

    this.stars = Array.from({ length: 10 }, (_, i) => ({
      angle: (Math.PI * 2 * i) / 10,
      radius: 20 + Math.random() * 12,
      size: 2 + Math.random() * 2,
      speed: 0.035 + Math.random() * 0.025,
      offset: Math.random() * Math.PI * 2,
    }));

    this.bubbles = Array.from({ length: 5 }, (_, i) => ({
      angle: (Math.PI * 2 * i) / 5,
      radius: 14 + Math.random() * 10,
      size: 2 + Math.random() * 2,
      speed: 0.025 + Math.random() * 0.02,
    }));
  }

  update(context) {
    if (this.isFinished) return;

    this.timer++;

    switch (this.phase) {
      case "HEART":
        this.updateHeart();
        break;

      case "TRAVEL":
        this.updateTravel();
        break;

      case "KISS":
        this.updateKiss();
        break;

      case "SLEEP":
        this.updateSleep();
        break;

      case "FADE":
        this.updateFade();
        break;
    }

    this.draw(context);
  }

  updateHeart() {
    this.heartScale = Math.min(1, this.timer / 12);

    if (this.timer >= 25) {
      this.phase = "TRAVEL";
      this.timer = 0;
    }
  }

  updateTravel() {
    this.hearts.forEach((heart) => {
      heart.progress += heart.speed;
      heart.wobble += 0.12;
    });

    if (this.hearts[0].progress >= 1) {
      this.phase = "KISS";
      this.timer = 0;
      this.impactAlpha = 1;
      this.game.canvas.startShake(5, 1);
    }
  }

  updateKiss() {
    this.impactAlpha = Math.max(0, 1 - this.timer / 18);

    if (this.timer >= 18) {
      this.phase = "SLEEP";
      this.timer = 0;
    }
  }

  updateSleep() {
    this.stars.forEach((star) => {
      star.angle += star.speed;
    });

    this.bubbles.forEach((bubble) => {
      bubble.angle += bubble.speed;
    });

    if (this.timer >= 65) {
      this.phase = "FADE";
      this.timer = 0;
    }
  }

  updateFade() {
    this.sleepAlpha = Math.max(0, 1 - this.timer / 20);

    if (this.timer >= 20) {
      this.isFinished = true;
    }
  }

  draw(context) {
    context.save();

    switch (this.phase) {
      case "HEART":
        this.drawMainHeart(context);
        break;

      case "TRAVEL":
        this.drawTravelHearts(context);
        break;

      case "KISS":
        this.drawImpact(context);
        break;

      case "SLEEP":
        this.drawSleepEffect(context);
        break;

      case "FADE":
        this.drawSleepEffect(context);
        break;
    }

    context.restore();
  }

  drawMainHeart(context) {
    const x = this.attackerX + this.direction * 20;
    const y = this.attackerY - 15;

    const pulse = 1 + Math.sin(this.timer * 0.25) * 0.08;

    context.save();
    context.translate(x, y);
    context.scale(this.heartScale * pulse, this.heartScale * pulse);

    this.drawHeart(context, 0, 0, 11, "#ff8fca");

    context.restore();
  }

  drawTravelHearts(context) {
    this.hearts.forEach((heart) => {
      const progress = Math.max(0, Math.min(1, heart.progress));

      const x = this.attackerX + (this.targetX - this.attackerX) * progress;

      const y =
        this.attackerY -
        15 +
        (this.targetY - this.attackerY) * progress +
        heart.offsetY +
        Math.sin(heart.wobble) * 5;

      const alpha = Math.max(0, 1 - Math.abs(heart.progress - 0.5) * 0.7);

      context.globalAlpha = alpha;
      this.drawHeart(context, x, y, heart.size, "#ff8fca");
    });
  }

  drawImpact(context) {
    const radius = 10 + this.timer * 3;

    context.globalAlpha = this.impactAlpha;

    // Onde rose
    context.strokeStyle = "#ffb5df";
    context.lineWidth = 4;
    context.shadowBlur = 18;
    context.shadowColor = "#ff65ba";

    context.beginPath();
    context.arc(this.targetX, this.targetY - 15, radius, 0, Math.PI * 2);
    context.stroke();

    // Grand cœur lumineux
    const scale = Math.max(0, 1 - this.timer / 22);

    context.save();
    context.translate(this.targetX, this.targetY - 15);
    context.scale(scale, scale);

    this.drawHeart(context, 0, 0, 22, "#ff9bd2");

    context.restore();
  }

  drawSleepEffect(context) {
    const alpha = this.phase === "SLEEP" ? 1 : this.sleepAlpha;

    const bob = Math.sin(this.timer * 0.12) * 3;

    // Étoiles en orbite
    this.stars.forEach((star) => {
      const x = this.targetX + Math.cos(star.angle) * star.radius;

      const y =
        this.targetY - 18 + Math.sin(star.angle) * star.radius * 0.55 + bob;

      const twinkle = 0.5 + Math.sin(this.timer * 0.3 + star.offset) * 0.5;

      context.globalAlpha = alpha * twinkle;
      context.fillStyle = "#ffe6a6";
      context.shadowBlur = 10;
      context.shadowColor = "#ffd36a";

      this.drawStar(context, x, y, star.size);
    });

    // Bulles roses
    this.bubbles.forEach((bubble) => {
      const x = this.targetX + Math.cos(bubble.angle) * bubble.radius;

      const y =
        this.targetY - 18 + Math.sin(bubble.angle) * bubble.radius * 0.6;

      context.globalAlpha = alpha * 0.7;
      context.strokeStyle = "#ff9bd2";
      context.lineWidth = 1.5;
      context.beginPath();
      context.arc(x, y, bubble.size, 0, Math.PI * 2);
      context.stroke();
    });

    // Petit symbole Zz qui monte
    if (this.timer > 10) {
      const zProgress = (this.timer % 30) / 30;

      context.globalAlpha = alpha * (1 - zProgress);
      context.fillStyle = "#eaa1df";
      context.font = "bold 12px sans-serif";
      context.textAlign = "center";

      context.fillText(
        "Z",
        this.targetX + 18,
        this.targetY - 35 - zProgress * 20
      );

      context.font = "bold 9px sans-serif";
      context.fillText(
        "z",
        this.targetX + 27,
        this.targetY - 43 - zProgress * 20
      );
    }
  }

  drawHeart(context, x, y, size, color) {
    context.save();
    context.translate(x, y);

    context.fillStyle = color;
    context.shadowBlur = 12;
    context.shadowColor = "#ff65ba";

    context.beginPath();
    context.moveTo(0, size * 0.35);
    context.bezierCurveTo(
      -size * 1.2,
      -size * 0.4,
      -size * 0.8,
      -size * 1.1,
      0,
      -size * 0.45
    );
    context.bezierCurveTo(
      size * 0.8,
      -size * 1.1,
      size * 1.2,
      -size * 0.4,
      0,
      size * 0.35
    );
    context.fill();

    context.restore();
  }

  drawStar(context, x, y, size) {
    context.save();
    context.translate(x, y);

    context.beginPath();

    for (let i = 0; i < 10; i++) {
      const angle = -Math.PI / 2 + (Math.PI * 2 * i) / 10;
      const radius = i % 2 === 0 ? size : size * 0.4;

      const px = Math.cos(angle) * radius;
      const py = Math.sin(angle) * radius;

      if (i === 0) {
        context.moveTo(px, py);
      } else {
        context.lineTo(px, py);
      }
    }

    context.closePath();
    context.fillStyle = "#fff0b8";
    context.shadowBlur = 8;
    context.shadowColor = "#ffd36a";
    context.fill();

    context.restore();
  }
}
