export class SingAnimation {
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

    this.phase = "music";
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

    this.notes = Array.from({ length: 7 }, (_, i) => ({
      delay: i * 7,
      progress: 0,
      x: this.startX,
      y: this.startY,
      size: 9 + Math.random() * 4,
      rotation: Math.random() * 0.5 - 0.25,
      color: ["#f4a7d5", "#b7a5f5", "#f8dc83"][i % 3],
      type: i % 2 === 0 ? "note" : "double",
    }));

    this.stars = Array.from({ length: 8 }, (_, i) => ({
      angle: (Math.PI * 2 * i) / 8,
      radius: 12 + Math.random() * 9,
      size: 2 + Math.random() * 2,
      rotation: Math.random() * Math.PI,
      color: ["#fff0a6", "#c9b8ff", "#f5b9df"][i % 3],
    }));

    this.particles = [];
  }

  update(context) {
    if (this.isFinished) return;

    this.timer++;

    switch (this.phase) {
      case "music":
        this.updateMusic();
        break;

      case "sleep":
        this.updateSleep();
        break;

      case "fade":
        this.updateFade();
        break;
    }

    this.draw(context);
  }

  updateMusic() {
    this.notes.forEach((note) => {
      if (this.timer < note.delay) return;

      note.progress = Math.min(1, (this.timer - note.delay) / 48);

      const wave = Math.sin(note.progress * Math.PI * 4);

      note.x = this.startX + (this.targetX - this.startX) * note.progress;

      note.y =
        this.startY + (this.targetY - this.startY) * note.progress + wave * 17;
    });

    if (this.timer >= 95) {
      this.phase = "sleep";
      this.timer = 0;
    }
  }

  updateSleep() {
    this.stars.forEach((star) => {
      star.angle += 0.035;
    });

    if (this.timer % 4 === 0) {
      this.createSleepParticle();
    }

    this.updateParticles();

    if (this.timer >= 75) {
      this.phase = "fade";
      this.timer = 0;
    }
  }

  updateFade() {
    this.stars.forEach((star) => {
      star.angle += 0.025;
    });

    this.updateParticles();

    if (this.timer >= 25) {
      this.isFinished = true;
    }
  }

  createSleepParticle() {
    const angle = Math.random() * Math.PI * 2;
    const radius = 15 + Math.random() * 22;

    this.particles.push({
      x: this.targetX + Math.cos(angle) * radius,
      y: this.targetY + Math.sin(angle) * radius,
      vx: (Math.random() - 0.5) * 0.6,
      vy: -0.5 - Math.random() * 0.8,
      size: 1 + Math.random() * 2,
      life: 30,
      color: ["#fff0a6", "#c9b8ff", "#f5b9df"][Math.floor(Math.random() * 3)],
    });
  }

  updateParticles() {
    this.particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life--;
    });

    this.particles = this.particles.filter((particle) => particle.life > 0);
  }

  drawMusicNote(context, note) {
    context.save();
    context.translate(note.x, note.y);
    context.rotate(note.rotation);

    context.globalAlpha = Math.min(
      1,
      note.progress * 4,
      (1 - note.progress) * 3
    );

    context.fillStyle = note.color;
    context.strokeStyle = note.color;
    context.lineWidth = 2;

    // Hampe de la note.
    context.beginPath();
    context.moveTo(2, -note.size);
    context.lineTo(2, note.size * 0.55);
    context.stroke();

    // Tête de la note.
    context.beginPath();
    context.ellipse(
      -1,
      note.size * 0.65,
      note.size * 0.45,
      note.size * 0.3,
      -0.35,
      0,
      Math.PI * 2
    );
    context.fill();

    if (note.type === "double") {
      context.beginPath();
      context.moveTo(2, -note.size);
      context.lineTo(note.size, -note.size * 0.7);
      context.lineTo(note.size, -note.size * 0.2);
      context.stroke();

      context.beginPath();
      context.ellipse(
        note.size - 1,
        note.size * 0.1,
        note.size * 0.4,
        note.size * 0.28,
        -0.35,
        0,
        Math.PI * 2
      );
      context.fill();
    }

    context.restore();
  }

  drawStar(context, x, y, size, color, rotation = 0) {
    context.save();
    context.translate(x, y);
    context.rotate(rotation);
    context.fillStyle = color;

    context.beginPath();

    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8 - Math.PI / 2;
      const radius = i % 2 === 0 ? size : size * 0.3;

      const px = Math.cos(angle) * radius;
      const py = Math.sin(angle) * radius;

      if (i === 0) context.moveTo(px, py);
      else context.lineTo(px, py);
    }

    context.closePath();
    context.fill();
    context.restore();
  }

  drawSleepEffect(context) {
    const fade = this.phase === "fade" ? Math.max(0, 1 - this.timer / 25) : 1;

    const pulse = 1 + Math.sin(this.timer * 0.12) * 0.08;

    context.save();
    context.globalAlpha = fade;

    // Halo doux autour de la cible.
    const gradient = context.createRadialGradient(
      this.targetX,
      this.targetY,
      3,
      this.targetX,
      this.targetY,
      48 * pulse
    );

    gradient.addColorStop(0, "rgba(211, 183, 255, 0.30)");
    gradient.addColorStop(0.6, "rgba(244, 190, 225, 0.15)");
    gradient.addColorStop(1, "rgba(244, 190, 225, 0)");

    context.fillStyle = gradient;
    context.beginPath();
    context.arc(this.targetX, this.targetY, 48 * pulse, 0, Math.PI * 2);
    context.fill();

    // Étoiles en orbite.
    this.stars.forEach((star) => {
      const x = this.targetX + Math.cos(star.angle) * star.radius;

      const y = this.targetY - 20 + Math.sin(star.angle) * star.radius * 0.65;

      this.drawStar(
        context,
        x,
        y,
        star.size,
        star.color,
        star.rotation + this.timer * 0.03
      );
    });

    // Petit Z de sommeil.
    context.font = "bold 13px Arial";
    context.textAlign = "center";
    context.fillStyle = "#e5d5ff";

    const zOffset = Math.sin(this.timer * 0.08) * 3;

    context.fillText("Z", this.targetX + 20, this.targetY - 35 + zOffset);

    context.font = "bold 9px Arial";

    context.fillText("z", this.targetX + 29, this.targetY - 47 + zOffset);

    context.restore();
  }

  drawParticles(context) {
    this.particles.forEach((particle) => {
      context.save();

      context.globalAlpha = Math.min(1, particle.life / 12);
      context.fillStyle = particle.color;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fill();

      context.restore();
    });
  }

  draw(context) {
    if (this.phase === "music") {
      this.notes.forEach((note) => {
        if (this.timer >= note.delay && note.progress > 0) {
          this.drawMusicNote(context, note);
        }
      });
    }

    if (this.phase === "sleep" || this.phase === "fade") {
      this.drawSleepEffect(context);
      this.drawParticles(context);
    }
  }
}
