export class PrecipiceBladesAnimation {
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

    this.targetCenter = {
      x: this.target.position.x + this.target.frameWidth / 2,
      y: this.target.position.y + this.target.frameHeight * 0.85,
    };

    this.phase = "CHARGE";
    this.timer = 0;
    this.isFinished = false;

    this.cracks = [];
    this.blades = [];
    this.particles = [];
    this.shockwaves = [];
    this.debris = [];

    this.createCracks();
    this.createBlades();
  }

  update(context) {
    this.timer++;

    switch (this.phase) {
      case "CHARGE":
        this.updateCharge();
        break;

      case "CRACK":
        this.updateCrack();
        break;

      case "ERUPTION":
        this.updateEruption();
        break;

      case "IMPACT":
        this.updateImpact();
        break;

      case "COLLAPSE":
        this.updateCollapse();
        break;

      case "FINISH":
        this.isFinished = true;
        break;
    }

    this.draw(context);
  }

  createCracks() {
    const centerX = this.targetCenter.x;
    const groundY = this.targetCenter.y;

    for (let i = 0; i < 18; i++) {
      const angle = (Math.PI * 2 * i) / 18;

      this.cracks.push({
        x: centerX + Math.cos(angle) * 8,
        y: groundY + Math.sin(angle) * 4,
        angle,
        length: 25 + Math.random() * 55,
        progress: 0,
        width: 1 + Math.random() * 2,
      });
    }
  }

  createBlades() {
    const centerX = this.targetCenter.x;
    const groundY = this.targetCenter.y;

    // Sept lames disposées autour de la cible.
    const offsets = [-65, -43, -22, 0, 22, 43, 65];

    this.blades = offsets.map((offset, index) => ({
      x: centerX + offset,
      baseY: groundY + Math.abs(offset) * 0.12,
      width: index === 3 ? 19 : 13 + Math.random() * 5,
      maxHeight: index === 3 ? 115 : 65 + Math.random() * 45,
      height: 0,
      delay: Math.abs(offset) * 0.12,
      speed: 7 + Math.random() * 3,
      angle: (Math.random() - 0.5) * 0.25,
      rotation: (Math.random() - 0.5) * 0.15,
      falling: false,
      opacity: 1,
    }));
  }

  createParticle(x, y, color, size, vx, vy, life) {
    this.particles.push({
      x,
      y,
      color,
      size,
      vx,
      vy,
      gravity: 0.12 + Math.random() * 0.12,
      life,
      maxLife: life,
    });
  }

  createDebris(x, y, size, vx, vy) {
    this.debris.push({
      x,
      y,
      size,
      vx,
      vy,
      rotation: Math.random() * Math.PI,
      rotationSpeed: (Math.random() - 0.5) * 0.2,
      life: 65 + Math.random() * 30,
      maxLife: 95,
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

  updateCharge() {
    if (this.timer === 1) {
      this.game.canvas.startShake(1000, 2);
    }

    if (this.timer >= 35) {
      this.phase = "CRACK";
      this.timer = 0;
    }
  }

  updateCrack() {
    const progress = Math.min(1, this.timer / 28);

    for (const crack of this.cracks) {
      crack.progress = progress;
    }

    if (this.timer >= 30) {
      this.phase = "ERUPTION";
      this.timer = 0;
    }
  }

  updateEruption() {
    if (this.timer === 1) {
      this.game.canvas.startShake(1000, 5);
    }

    for (const blade of this.blades) {
      if (this.timer >= blade.delay) {
        blade.height = Math.min(blade.maxHeight, blade.height + blade.speed);
      }
    }

    if (this.timer % 3 === 0) {
      const x = this.targetCenter.x + (Math.random() - 0.5) * 95;

      const y = this.targetCenter.y;

      for (let i = 0; i < 3; i++) {
        this.createParticle(
          x,
          y,
          Math.random() < 0.5 ? "#ff9a32" : "#ffd477",
          2 + Math.random() * 4,
          (Math.random() - 0.5) * 4,
          -2 - Math.random() * 5,
          30 + Math.random() * 20
        );
      }
    }

    if (this.timer >= 28) {
      this.phase = "IMPACT";
      this.timer = 0;
      this.createImpact();
    }
  }

  createImpact() {
    const x = this.targetCenter.x;
    const y = this.targetCenter.y;

    this.createShockwave(x, y, 155, 32, 8, "255, 165, 75");

    this.createShockwave(x, y, 105, 25, 5, "255, 225, 160");

    // Les lames se brisent et projettent des fragments.
    for (const blade of this.blades) {
      for (let i = 0; i < 5; i++) {
        this.createDebris(
          blade.x,
          blade.baseY - blade.height * 0.6,
          4 + Math.random() * 8,
          (Math.random() - 0.5) * 8,
          -3 - Math.random() * 8
        );
      }
    }

    // Projection massive de poussière et de fragments.
    for (let i = 0; i < 65; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 9;

      this.createParticle(
        x,
        y,
        ["#e7b66e", "#a66d3e", "#ff9d45", "#ffe0a0"][
          Math.floor(Math.random() * 4)
        ],
        2 + Math.random() * 6,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed - 2,
        45 + Math.random() * 35
      );
    }

    this.game.canvas.startShake(1500, 12);
  }

  updateImpact() {
    if (this.timer === 1) {
      // Une seconde onde de choc accompagne l'explosion.
      this.createShockwave(
        this.targetCenter.x,
        this.targetCenter.y,
        125,
        35,
        6,
        "255, 105, 35"
      );
    }

    if (this.timer >= 32) {
      for (const blade of this.blades) {
        blade.falling = true;
      }

      this.phase = "COLLAPSE";
      this.timer = 0;
    }
  }

  updateCollapse() {
    for (const blade of this.blades) {
      blade.height = Math.max(0, blade.height - 5);
      blade.opacity = Math.max(0, blade.opacity - 0.025);
    }

    if (this.timer >= 45) {
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

    for (const debris of this.debris) {
      debris.x += debris.vx;
      debris.y += debris.vy;
      debris.vy += 0.2;
      debris.rotation += debris.rotationSpeed;
      debris.life--;
    }

    this.debris = this.debris.filter((piece) => piece.life > 0);

    for (const wave of this.shockwaves) {
      wave.timer++;
      wave.radius = (wave.timer / wave.duration) * wave.maxRadius;
    }

    this.shockwaves = this.shockwaves.filter(
      (wave) => wave.timer < wave.duration
    );
  }

  drawCracks(context) {
    context.save();

    for (const crack of this.cracks) {
      const length = crack.length * crack.progress;

      const endX = crack.x + Math.cos(crack.angle) * length;

      const endY = crack.y + Math.sin(crack.angle) * length;

      // Fissure sombre.
      context.strokeStyle = "rgba(48, 29, 22, 0.95)";
      context.lineWidth = crack.width + 3;
      context.beginPath();
      context.moveTo(crack.x, crack.y);
      context.lineTo(endX, endY);
      context.stroke();

      // Lueur incandescente.
      context.strokeStyle = "rgba(255, 115, 35, 0.95)";
      context.lineWidth = crack.width;
      context.beginPath();
      context.moveTo(crack.x, crack.y);
      context.lineTo(endX, endY);
      context.stroke();

      // Fine ligne lumineuse au centre.
      context.strokeStyle = "rgba(255, 220, 130, 0.85)";
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(crack.x, crack.y);
      context.lineTo(endX, endY);
      context.stroke();
    }

    context.restore();
  }

  drawBlade(context, blade) {
    if (blade.height <= 0) return;

    const h = blade.height;
    const w = blade.width;
    const x = blade.x;
    const y = blade.baseY;

    context.save();

    context.globalAlpha = blade.opacity;
    context.translate(x, y);
    context.rotate(blade.angle);

    // Ombre portée de la lame.
    context.fillStyle = "rgba(25, 17, 13, 0.45)";
    context.beginPath();
    context.moveTo(-w * 1.3, 0);
    context.lineTo(-w * 0.55, -h * 0.78);
    context.lineTo(0, -h);
    context.lineTo(w * 1.3, 0);
    context.closePath();
    context.fill();

    // Corps principal de la lame.
    context.fillStyle = "#68452f";
    context.beginPath();
    context.moveTo(-w, 0);
    context.lineTo(-w * 0.72, -h * 0.72);
    context.lineTo(-w * 0.18, -h);
    context.lineTo(w * 0.38, -h * 0.83);
    context.lineTo(w, 0);
    context.closePath();
    context.fill();

    // Face rocheuse éclairée.
    context.fillStyle = "#bd8954";
    context.beginPath();
    context.moveTo(-w * 0.72, -h * 0.72);
    context.lineTo(-w * 0.18, -h);
    context.lineTo(w * 0.38, -h * 0.83);
    context.lineTo(0, -h * 0.5);
    context.closePath();
    context.fill();

    // Arête incandescente.
    context.strokeStyle = "#ffad48";
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(-w * 0.18, -h);
    context.lineTo(0, -h * 0.5);
    context.lineTo(w, 0);
    context.stroke();

    // Lueur rouge sur le côté opposé.
    context.strokeStyle = "rgba(255, 75, 25, 0.9)";
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(-w, 0);
    context.lineTo(-w * 0.72, -h * 0.72);
    context.stroke();

    context.restore();
  }

  drawBlades(context) {
    for (const blade of this.blades) {
      this.drawBlade(context, blade);
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
        wave.radius * 0.28,
        0,
        0,
        Math.PI * 2
      );
      context.stroke();

      context.restore();
    }
  }

  drawDebris(context) {
    for (const piece of this.debris) {
      context.save();

      context.translate(piece.x, piece.y);
      context.rotate(piece.rotation);

      context.globalAlpha = Math.min(1, piece.life / 15);

      context.fillStyle = "#8e6040";
      context.beginPath();
      context.moveTo(-piece.size, piece.size * 0.5);
      context.lineTo(-piece.size * 0.3, -piece.size);
      context.lineTo(piece.size, -piece.size * 0.2);
      context.lineTo(piece.size * 0.6, piece.size);
      context.closePath();
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

  drawFlash(context) {
    if (this.phase !== "IMPACT" || this.timer > 9) {
      return;
    }

    const alpha = 0.75 * (1 - this.timer / 9);

    context.fillStyle = `rgba(255, 235, 195, ${alpha})`;

    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
  }

  draw(context) {
    this.updateEffects();

    context.save();

    if (
      this.phase === "CHARGE" ||
      this.phase === "CRACK" ||
      this.phase === "ERUPTION"
    ) {
      this.drawCracks(context);
    }

    this.drawShockwaves(context);
    this.drawBlades(context);
    this.drawDebris(context);
    this.drawParticles(context);
    this.drawFlash(context);

    context.restore();
  }
}
