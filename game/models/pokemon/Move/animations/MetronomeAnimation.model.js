export class MetronomeAnimation {
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

    this.centerX =
      this.attacker.position.x +
      (this.attacker.frameWidth * this.attacker.scale) / 2;

    this.centerY =
      this.attacker.position.y +
      (this.attacker.frameHeight * this.attacker.scale) / 2;

    this.phase = "INVOCATION";
    this.timer = 0;
    this.isFinished = false;

    this.rotation = 0;
    this.rotationSpeed = 0;

    this.symbols = [];
    this.particles = [];
    this.stars = [];

    this.generateSymbols();
    this.generateParticles();
  }

  generateSymbols() {
    const symbolCount = 12;

    for (let i = 0; i < symbolCount; i++) {
      const angle = (Math.PI * 2 * i) / symbolCount;

      this.symbols.push({
        angle,
        radius: 65,
        size: 9 + Math.random() * 5,
        rotation: Math.random() * Math.PI * 2,
        alpha: 0,
        pulse: Math.random() * Math.PI * 2,
      });
    }
  }

  generateParticles() {
    for (let i = 0; i < 35; i++) {
      const angle = Math.random() * Math.PI * 2;

      this.particles.push({
        angle,
        radius: 25 + Math.random() * 65,
        speed: 0.015 + Math.random() * 0.035,
        size: 1.5 + Math.random() * 3,
        alpha: Math.random(),
      });
    }
  }

  generateStars() {
    for (let i = 0; i < 40; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 4;

      this.stars.push({
        x: this.centerX,
        y: this.centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 4,
        alpha: 1,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
      });
    }
  }

  update(context) {
    if (this.isFinished) return;

    this.timer++;

    switch (this.phase) {
      case "INVOCATION":
        this.updateInvocation();
        break;

      case "MATERIALIZATION":
        this.updateMaterialization();
        break;

      case "DRAW":
        this.updateDraw();
        break;

      case "REVELATION":
        this.updateRevelation();
        break;

      case "FINISHED":
        this.isFinished = true;
        break;
    }

    this.updateParticles();
    this.updateStars();

    this.draw(context);
  }

  updateInvocation() {
    if (this.timer >= 25) {
      this.timer = 0;
      this.phase = "MATERIALIZATION";
    }
  }

  updateMaterialization() {
    const progress = Math.min(this.timer / 35, 1);

    this.symbols.forEach((symbol, index) => {
      symbol.alpha = progress;

      symbol.radius = 65 - progress * 12;
      symbol.rotation += 0.025;

      symbol.pulse += 0.08;
    });

    if (this.timer >= 35) {
      this.timer = 0;
      this.phase = "DRAW";
    }
  }

  updateDraw() {
    const duration = 75;
    const progress = Math.min(this.timer / duration, 1);

    // Accélération progressive de la rotation.
    this.rotationSpeed = 0.015 + progress * 0.55;
    this.rotation += this.rotationSpeed;

    this.symbols.forEach((symbol) => {
      symbol.rotation += this.rotationSpeed * 1.5;
      symbol.pulse += 0.18;
    });

    if (this.timer >= duration) {
      this.timer = 0;
      this.phase = "REVELATION";

      this.symbols.forEach((symbol) => {
        symbol.alpha = 0;
      });

      this.generateStars();
    }
  }

  updateRevelation() {
    this.rotationSpeed *= 0.85;

    if (this.timer >= 40) {
      this.timer = 0;
      this.phase = "FINISHED";
    }
  }

  updateParticles() {
    this.particles.forEach((particle) => {
      particle.angle += particle.speed;

      particle.alpha =
        0.35 + Math.sin(this.timer * 0.1 + particle.angle) * 0.45;
    });
  }

  updateStars() {
    this.stars.forEach((star) => {
      star.x += star.vx;
      star.y += star.vy;

      star.vx *= 0.97;
      star.vy *= 0.97;

      star.alpha -= 0.025;
      star.rotation += star.rotationSpeed;
    });

    this.stars = this.stars.filter((star) => star.alpha > 0);
  }

  draw(context) {
    context.save();

    this.drawAura(context);
    this.drawParticles(context);
    this.drawSymbols(context);
    this.drawCentralEnergy(context);
    this.drawFlash(context);
    this.drawStars(context);

    context.restore();
  }

  drawAura(context) {
    if (this.phase === "FINISHED") return;

    const pulse = 1 + Math.sin(this.timer * 0.12) * 0.08;

    context.save();
    context.translate(this.centerX, this.centerY);
    context.scale(pulse, pulse);

    const gradient = context.createRadialGradient(0, 0, 5, 0, 0, 85);

    gradient.addColorStop(0, "rgba(180, 115, 255, 0.16)");
    gradient.addColorStop(0.6, "rgba(105, 125, 255, 0.08)");
    gradient.addColorStop(1, "rgba(105, 125, 255, 0)");

    context.fillStyle = gradient;

    context.beginPath();
    context.arc(0, 0, 85, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }

  drawParticles(context) {
    if (this.phase === "FINISHED") return;

    context.save();

    this.particles.forEach((particle) => {
      const x = this.centerX + Math.cos(particle.angle) * particle.radius;

      const y = this.centerY + Math.sin(particle.angle) * particle.radius;

      context.globalAlpha = particle.alpha;
      context.fillStyle = "#d7b5ff";
      context.shadowBlur = 9;
      context.shadowColor = "#9e62ff";

      context.beginPath();
      context.arc(x, y, particle.size, 0, Math.PI * 2);
      context.fill();
    });

    context.restore();
  }

  drawSymbols(context) {
    if (this.phase !== "MATERIALIZATION" && this.phase !== "DRAW") {
      return;
    }

    context.save();
    context.translate(this.centerX, this.centerY);
    context.rotate(this.rotation);

    this.symbols.forEach((symbol, index) => {
      const x = Math.cos(symbol.angle) * symbol.radius;
      const y = Math.sin(symbol.angle) * symbol.radius;

      const pulse = 1 + Math.sin(symbol.pulse) * 0.15;

      context.save();
      context.translate(x, y);
      context.rotate(symbol.rotation);
      context.scale(pulse, pulse);

      context.globalAlpha = symbol.alpha;

      context.fillStyle = index % 2 === 0 ? "#c78aff" : "#83dcff";

      context.strokeStyle = "#ffffff";
      context.lineWidth = 1.2;
      context.shadowBlur = 12;
      context.shadowColor = "#bd83ff";

      // Losange lumineux.
      context.beginPath();
      context.moveTo(0, -symbol.size);
      context.lineTo(symbol.size * 0.65, 0);
      context.lineTo(0, symbol.size);
      context.lineTo(-symbol.size * 0.65, 0);
      context.closePath();

      context.fill();
      context.stroke();

      // Petit point central.
      context.fillStyle = "#ffffff";

      context.beginPath();
      context.arc(0, 0, 2, 0, Math.PI * 2);
      context.fill();

      context.restore();
    });

    context.restore();
  }

  drawCentralEnergy(context) {
    if (
      this.phase !== "INVOCATION" &&
      this.phase !== "MATERIALIZATION" &&
      this.phase !== "DRAW"
    ) {
      return;
    }

    const pulse = 1 + Math.sin(this.timer * 0.2) * 0.18;
    const radius = 10 * pulse;

    context.save();
    context.translate(this.centerX, this.centerY - 45);

    context.globalAlpha = 0.8;
    context.shadowBlur = 20;
    context.shadowColor = "#c58aff";

    const gradient = context.createRadialGradient(0, 0, 1, 0, 0, radius * 2);

    gradient.addColorStop(0, "#ffffff");
    gradient.addColorStop(0.4, "#d9aaff");
    gradient.addColorStop(1, "rgba(120, 90, 255, 0)");

    context.fillStyle = gradient;

    context.beginPath();
    context.arc(0, 0, radius * 2, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }

  drawFlash(context) {
    if (this.phase !== "REVELATION") return;

    const progress = Math.min(this.timer / 12, 1);
    const alpha = Math.max(0, 0.65 * (1 - progress));

    context.save();

    context.globalAlpha = alpha;
    context.fillStyle = "#ffffff";

    context.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);

    context.restore();

    // Onde lumineuse autour du Pokémon.
    const radius = 10 + this.timer * 5;

    context.save();
    context.translate(this.centerX, this.centerY);

    context.globalAlpha = Math.max(0, 1 - this.timer / 40);
    context.strokeStyle = "#ffe58a";
    context.lineWidth = 4;
    context.shadowBlur = 18;
    context.shadowColor = "#ffd65c";

    context.beginPath();
    context.arc(0, 0, radius, 0, Math.PI * 2);
    context.stroke();

    context.restore();
  }

  drawStars(context) {
    if (this.stars.length === 0) return;

    context.save();

    this.stars.forEach((star) => {
      context.save();

      context.translate(star.x, star.y);
      context.rotate(star.rotation);

      context.globalAlpha = Math.max(0, star.alpha);
      context.fillStyle = "#ffe89b";
      context.shadowBlur = 12;
      context.shadowColor = "#ffd65c";

      context.beginPath();

      context.moveTo(0, -star.size);
      context.lineTo(star.size * 0.3, -star.size * 0.3);
      context.lineTo(star.size, 0);
      context.lineTo(star.size * 0.3, star.size * 0.3);
      context.lineTo(0, star.size);
      context.lineTo(-star.size * 0.3, star.size * 0.3);
      context.lineTo(-star.size, 0);
      context.lineTo(-star.size * 0.3, -star.size * 0.3);

      context.closePath();
      context.fill();

      context.restore();
    });

    context.restore();
  }
}
