export class OriginPulseAnimation {
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

    this.attackerCenter = {
      x: this.attacker.position.x + this.attacker.frameWidth / 2,
      y: this.attacker.position.y + this.attacker.frameHeight / 2,
    };

    this.targetCenter = {
      x: this.target.position.x + this.target.frameWidth / 2,
      y: this.target.position.y + this.target.frameHeight / 2,
    };

    this.direction = this.targetCenter.x >= this.attackerCenter.x ? 1 : -1;

    this.phase = "CHARGE";
    this.timer = 0;
    this.isFinished = false;

    this.particles = [];
    this.bubbles = [];
    this.shockwaves = [];
    this.waterRings = [];
    this.energyOrbs = [];

    this.sphere = {
      x: this.attackerCenter.x + this.direction * 12,
      y: this.attackerCenter.y - 12,
      radius: 0,
      maxRadius: 34,
    };

    this.wave = {
      x: this.sphere.x,
      y: this.sphere.y,
      progress: 0,
      height: 0,
    };

    this.createInitialBubbles();
  }

  update(context) {
    this.timer++;

    switch (this.phase) {
      case "CHARGE":
        this.updateCharge();
        break;

      case "CONDENSE":
        this.updateCondense();
        break;

      case "RELEASE":
        this.updateRelease();
        break;

      case "IMPACT":
        this.updateImpact();
        break;

      case "AFTERMATH":
        this.updateAftermath();
        break;

      case "FINISH":
        this.isFinished = true;
        break;
    }

    this.draw(context);
  }

  createInitialBubbles() {
    for (let i = 0; i < 18; i++) {
      this.bubbles.push({
        x: this.sphere.x + (Math.random() - 0.5) * 90,
        y: this.sphere.y + (Math.random() - 0.5) * 70,
        size: 2 + Math.random() * 5,
        speed: 0.5 + Math.random() * 1.5,
        angle: Math.random() * Math.PI * 2,
        life: 50 + Math.random() * 40,
      });
    }
  }

  createParticle(x, y, color, size, vx, vy, life) {
    this.particles.push({
      x,
      y,
      color,
      size,
      vx,
      vy,
      gravity: 0.025 + Math.random() * 0.045,
      life,
      maxLife: life,
    });
  }

  createShockwave(x, y, maxRadius, duration, width, color) {
    this.shockwaves.push({
      x,
      y,
      radius: 0,
      maxRadius,
      duration,
      timer: 0,
      width,
      color,
    });
  }

  createWaterRing(x, y, radius, speed, rotation) {
    this.waterRings.push({
      x,
      y,
      radius,
      speed,
      rotation,
      life: 45,
      maxLife: 45,
    });
  }

  updateCharge() {
    if (this.timer === 1) {
      this.game.canvas.startShake(1000, 2);
    }

    // L'eau commence à tourbillonner autour du lanceur.
    if (this.timer % 3 === 0) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 30 + Math.random() * 35;

      this.createParticle(
        this.attackerCenter.x + Math.cos(angle) * radius,
        this.attackerCenter.y + Math.sin(angle) * radius,
        "#45dfff",
        2 + Math.random() * 3,
        -Math.sin(angle) * 1.5,
        Math.cos(angle) * 1.5,
        35
      );
    }

    if (this.timer >= 35) {
      this.phase = "CONDENSE";
      this.timer = 0;
    }
  }

  updateCondense() {
    const progress = Math.min(1, this.timer / 32);

    this.sphere.radius = this.sphere.maxRadius * progress;

    // Les bulles convergent vers la sphère.
    for (const bubble of this.bubbles) {
      const dx = this.sphere.x - bubble.x;
      const dy = this.sphere.y - bubble.y;
      const distance = Math.max(1, Math.hypot(dx, dy));

      bubble.x += (dx / distance) * (1.5 + progress);
      bubble.y += (dy / distance) * (1.5 + progress);
      bubble.life--;
    }

    if (this.timer % 5 === 0) {
      this.createWaterRing(
        this.sphere.x,
        this.sphere.y,
        12 + Math.random() * 12,
        1.8,
        Math.random() * Math.PI * 2
      );
    }

    if (this.timer >= 32) {
      this.phase = "RELEASE";
      this.timer = 0;
      this.createReleaseBurst();
    }
  }

  createReleaseBurst() {
    const x = this.sphere.x;
    const y = this.sphere.y;

    this.createShockwave(x, y, 90, 24, 5, "100, 225, 255");

    for (let i = 0; i < 35; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 6;

      this.createParticle(
        x,
        y,
        ["#ffffff", "#8ceeff", "#27bce9", "#167dbb"][
          Math.floor(Math.random() * 4)
        ],
        2 + Math.random() * 5,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed,
        35 + Math.random() * 25
      );
    }

    this.game.canvas.startShake(1000, 4);
  }

  updateRelease() {
    const progress = Math.min(1, this.timer / 34);

    this.wave.progress = progress;
    this.wave.x =
      this.sphere.x + (this.targetCenter.x - this.sphere.x) * progress;

    this.wave.y =
      this.sphere.y + (this.targetCenter.y - this.sphere.y) * progress;

    this.wave.height = 35 + Math.sin(progress * Math.PI) * 48;

    // La vague libère des projections d'eau sur son passage.
    if (this.timer % 2 === 0) {
      for (let i = 0; i < 4; i++) {
        this.createParticle(
          this.wave.x + (Math.random() - 0.5) * 30,
          this.wave.y + (Math.random() - 0.5) * this.wave.height,
          Math.random() < 0.5 ? "#a5f4ff" : "#31bde9",
          2 + Math.random() * 5,
          this.direction * (1 + Math.random() * 4),
          (Math.random() - 0.5) * 5,
          30 + Math.random() * 20
        );
      }
    }

    if (this.timer >= 34) {
      this.phase = "IMPACT";
      this.timer = 0;
      this.createImpact();
    }
  }

  createImpact() {
    const x = this.targetCenter.x;
    const y = this.targetCenter.y;

    this.createShockwave(x, y, 145, 30, 8, "90, 220, 255");

    this.createShockwave(x, y, 105, 24, 5, "220, 250, 255");

    this.createWaterRing(x, y, 25, 3, 0);
    this.createWaterRing(x, y, 15, 4, Math.PI / 4);

    // Grande explosion de gouttelettes.
    for (let i = 0; i < 75; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 9;

      this.createParticle(
        x,
        y,
        ["#ffffff", "#b4f6ff", "#55d8f4", "#168bc9"][
          Math.floor(Math.random() * 4)
        ],
        2 + Math.random() * 6,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed - 2,
        45 + Math.random() * 35
      );
    }

    // Colonnes d'eau qui jaillissent autour de la cible.
    for (let i = 0; i < 11; i++) {
      const offset = (Math.random() - 0.5) * 95;

      for (let j = 0; j < 4; j++) {
        this.createParticle(
          x + offset,
          y,
          j % 2 === 0 ? "#8ceeff" : "#ffffff",
          3 + Math.random() * 4,
          (Math.random() - 0.5) * 3,
          -4 - Math.random() * 7,
          40 + Math.random() * 25
        );
      }
    }

    this.game.canvas.startShake(1500, 10);
  }

  updateImpact() {
    if (this.timer === 1) {
      this.createShockwave(
        this.targetCenter.x,
        this.targetCenter.y,
        165,
        38,
        6,
        "35, 165, 230"
      );
    }

    if (this.timer >= 38) {
      this.phase = "AFTERMATH";
      this.timer = 0;
    }
  }

  updateAftermath() {
    if (this.timer >= 42) {
      this.phase = "FINISH";
      this.timer = 0;
    }
  }

  updateEffects() {
    for (const particle of this.particles) {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += particle.gravity;
      particle.life--;
    }

    this.particles = this.particles.filter((particle) => particle.life > 0);

    for (const bubble of this.bubbles) {
      bubble.y -= bubble.speed;
      bubble.x += Math.sin(bubble.angle) * 0.7;
      bubble.angle += 0.06;
      bubble.life--;
    }

    this.bubbles = this.bubbles.filter((bubble) => bubble.life > 0);

    for (const ring of this.waterRings) {
      ring.radius += ring.speed;
      ring.rotation += 0.035;
      ring.life--;
    }

    this.waterRings = this.waterRings.filter((ring) => ring.life > 0);

    for (const wave of this.shockwaves) {
      wave.timer++;
      wave.radius = (wave.timer / wave.duration) * wave.maxRadius;
    }

    this.shockwaves = this.shockwaves.filter(
      (wave) => wave.timer < wave.duration
    );
  }

  drawSphere(context) {
    if (this.sphere.radius <= 0) return;

    const { x, y, radius } = this.sphere;

    context.save();

    // Halo extérieur.
    const halo = context.createRadialGradient(
      x,
      y,
      radius * 0.2,
      x,
      y,
      radius * 1.6
    );

    halo.addColorStop(0, "rgba(100, 230, 255, 0.35)");
    halo.addColorStop(1, "rgba(30, 130, 220, 0)");

    context.fillStyle = halo;
    context.beginPath();
    context.arc(x, y, radius * 1.6, 0, Math.PI * 2);
    context.fill();

    // Sphère principale.
    const gradient = context.createRadialGradient(
      x - radius * 0.3,
      y - radius * 0.35,
      2,
      x,
      y,
      radius
    );

    gradient.addColorStop(0, "#ffffff");
    gradient.addColorStop(0.3, "#b9f6ff");
    gradient.addColorStop(0.7, "#39c7ef");
    gradient.addColorStop(1, "#075b9b");

    context.fillStyle = gradient;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();

    // Reflet.
    context.fillStyle = "rgba(255, 255, 255, 0.8)";
    context.beginPath();
    context.ellipse(
      x - radius * 0.25,
      y - radius * 0.35,
      radius * 0.25,
      radius * 0.13,
      -0.5,
      0,
      Math.PI * 2
    );
    context.fill();

    // Tourbillon intérieur.
    context.strokeStyle = "rgba(255, 255, 255, 0.75)";
    context.lineWidth = 2;
    context.beginPath();
    context.arc(
      x,
      y,
      radius * 0.62,
      this.timer * 0.12,
      this.timer * 0.12 + Math.PI * 1.4
    );
    context.stroke();

    context.restore();
  }

  drawWave(context) {
    if (this.phase !== "RELEASE" && this.phase !== "IMPACT") {
      return;
    }

    const x = this.wave.x;
    const y = this.wave.y;
    const h = this.wave.height;

    context.save();

    // Corps de la vague.
    const gradient = context.createLinearGradient(
      x - this.direction * 50,
      y - h,
      x + this.direction * 25,
      y + h
    );

    gradient.addColorStop(0, "rgba(210, 250, 255, 0.95)");
    gradient.addColorStop(0.35, "rgba(65, 200, 240, 0.9)");
    gradient.addColorStop(0.75, "rgba(20, 125, 195, 0.9)");
    gradient.addColorStop(1, "rgba(5, 65, 130, 0.75)");

    context.fillStyle = gradient;

    context.beginPath();

    context.moveTo(x - this.direction * 42, y + h * 0.55);

    context.bezierCurveTo(
      x - this.direction * 55,
      y - h * 0.3,
      x - this.direction * 25,
      y - h * 1.3,
      x + this.direction * 12,
      y - h
    );

    context.bezierCurveTo(
      x + this.direction * 48,
      y - h * 0.45,
      x + this.direction * 38,
      y + h * 0.25,
      x + this.direction * 20,
      y + h
    );

    context.bezierCurveTo(
      x - this.direction * 5,
      y + h * 1.1,
      x - this.direction * 28,
      y + h * 0.85,
      x - this.direction * 42,
      y + h * 0.55
    );

    context.closePath();
    context.fill();

    // Crête blanche de la vague.
    context.strokeStyle = "rgba(255, 255, 255, 0.95)";
    context.lineWidth = 4;
    context.beginPath();
    context.moveTo(x - this.direction * 40, y - h * 0.35);

    context.bezierCurveTo(
      x - this.direction * 20,
      y - h * 1.2,
      x + this.direction * 5,
      y - h * 1.25,
      x + this.direction * 15,
      y - h * 0.85
    );

    context.stroke();

    // Écume à l'avant.
    context.fillStyle = "rgba(225, 252, 255, 0.95)";

    for (let i = 0; i < 6; i++) {
      const offset = (i - 2.5) * 8;

      context.beginPath();
      context.arc(
        x + this.direction * 20 + offset,
        y - h * 0.7 + Math.sin(this.timer * 0.3 + i) * 4,
        3 + Math.random() * 2,
        0,
        Math.PI * 2
      );
      context.fill();
    }

    context.restore();
  }

  drawWaterRings(context) {
    for (const ring of this.waterRings) {
      const alpha = ring.life / ring.maxLife;

      context.save();
      context.translate(ring.x, ring.y);
      context.rotate(ring.rotation);

      context.strokeStyle = `rgba(140, 235, 255, ${alpha})`;

      context.lineWidth = 3 * alpha;

      context.beginPath();
      context.ellipse(0, 0, ring.radius, ring.radius * 0.3, 0, 0, Math.PI * 2);
      context.stroke();

      context.restore();
    }
  }

  drawShockwaves(context) {
    for (const wave of this.shockwaves) {
      const alpha = 1 - wave.timer / wave.duration;

      context.save();

      context.strokeStyle = `rgba(${wave.color}, ${alpha})`;

      context.lineWidth = wave.width * alpha;

      context.beginPath();
      context.ellipse(
        wave.x,
        wave.y,
        wave.radius,
        wave.radius * 0.3,
        0,
        0,
        Math.PI * 2
      );
      context.stroke();

      context.restore();
    }
  }

  drawBubbles(context) {
    for (const bubble of this.bubbles) {
      context.save();

      context.globalAlpha = Math.max(0, bubble.life / 50);

      context.strokeStyle = "rgba(210, 250, 255, 0.85)";
      context.lineWidth = 1.5;

      context.fillStyle = "rgba(80, 205, 240, 0.3)";
      context.beginPath();
      context.arc(bubble.x, bubble.y, bubble.size, 0, Math.PI * 2);
      context.fill();
      context.stroke();

      context.fillStyle = "rgba(255, 255, 255, 0.9)";
      context.beginPath();
      context.arc(
        bubble.x - bubble.size * 0.3,
        bubble.y - bubble.size * 0.3,
        Math.max(1, bubble.size * 0.2),
        0,
        Math.PI * 2
      );
      context.fill();

      context.restore();
    }
  }

  drawParticles(context) {
    for (const particle of this.particles) {
      context.save();

      context.globalAlpha = Math.max(0, particle.life / particle.maxLife);

      context.fillStyle = particle.color;
      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fill();

      context.restore();
    }
  }

  drawImpactFlash(context) {
    if (this.phase !== "IMPACT" || this.timer > 8) {
      return;
    }

    const alpha = 0.7 * (1 - this.timer / 8);

    context.fillStyle = `rgba(220, 250, 255, ${alpha})`;

    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
  }

  draw(context) {
    this.updateEffects();

    context.save();

    this.drawWaterRings(context);
    this.drawShockwaves(context);
    this.drawBubbles(context);

    if (this.phase === "CONDENSE") {
      this.drawSphere(context);
    }

    if (this.phase === "RELEASE" || this.phase === "IMPACT") {
      this.drawWave(context);
    }

    this.drawParticles(context);
    this.drawImpactFlash(context);

    context.restore();
  }
}
