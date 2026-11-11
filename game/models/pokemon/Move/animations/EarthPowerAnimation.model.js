export class EarthPowerAnimation {
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

    this.phase = "CHARGE";
    this.timer = 0;
    this.isFinished = false;

    this.targetCenter = {
      x: this.target.position.x + this.target.frameWidth / 2,
      y: this.target.position.y + this.target.frameHeight / 2,
    };

    this.direction =
      this.targetCenter.x >=
      this.attacker.position.x + this.attacker.frameWidth / 2
        ? 1
        : -1;

    this.particles = [];
    this.rocks = [];
    this.cracks = [];
    this.shockwaves = [];

    this.createCracks();
  }

  update(context) {
    this.timer++;

    switch (this.phase) {
      case "CHARGE":
        this.updateCharge();
        break;

      case "ERUPTION":
        this.updateEruption();
        break;

      case "IMPACT":
        this.updateImpact();
        break;

      case "EXPLOSION":
        this.updateExplosion();
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

  createCracks() {
    const centerX = this.targetCenter.x;
    const groundY = this.target.position.y + this.target.frameHeight * 0.85;

    for (let i = 0; i < 13; i++) {
      const angle = (Math.PI * 2 * i) / 13;

      this.cracks.push({
        x: centerX + Math.cos(angle) * 15,
        y: groundY + Math.sin(angle) * 5,
        angle,
        length: 12 + Math.random() * 25,
        width: 1 + Math.random() * 2,
      });
    }
  }

  createRock(x, y, size, velocityX, velocityY) {
    this.rocks.push({
      x,
      y,
      size,
      vx: velocityX,
      vy: velocityY,
      gravity: 0.22 + Math.random() * 0.12,
      rotation: Math.random() * Math.PI,
      rotationSpeed: (Math.random() - 0.5) * 0.18,
      life: 70 + Math.random() * 35,
      maxLife: 105,
    });
  }

  createParticle(x, y, color, size, vx, vy, life) {
    this.particles.push({
      x,
      y,
      color,
      size,
      vx,
      vy,
      life,
      maxLife: life,
      gravity: 0.08 + Math.random() * 0.12,
    });
  }

  createShockwave(x, y, maxRadius, duration, width) {
    this.shockwaves.push({
      x,
      y,
      radius: 0,
      maxRadius,
      duration,
      timer: 0,
      width,
    });
  }

  updateCharge() {
    if (this.timer === 1) {
      this.game.canvas.startShake(35, 2);
    }

    if (this.timer >= 45) {
      this.phase = "ERUPTION";
      this.timer = 0;
    }
  }

  updateEruption() {
    if (this.timer % 5 === 0) {
      const x = this.targetCenter.x + (Math.random() - 0.5) * 65;

      const y = this.target.position.y + this.target.frameHeight * 0.9;

      this.createRock(
        x,
        y,
        5 + Math.random() * 9,
        (Math.random() - 0.5) * 3,
        -3 - Math.random() * 4
      );

      for (let i = 0; i < 3; i++) {
        this.createParticle(
          x,
          y,
          "#b58a58",
          2 + Math.random() * 3,
          (Math.random() - 0.5) * 3,
          -Math.random() * 3,
          35
        );
      }
    }

    if (this.timer >= 35) {
      this.createMainImpact();
      this.phase = "IMPACT";
      this.timer = 0;
    }
  }

  createMainImpact() {
    const x = this.targetCenter.x;
    const y = this.target.position.y + this.target.frameHeight * 0.85;

    this.impactPosition = { x, y };

    this.createShockwave(x, y, 115, 28, 5);
    this.createShockwave(x, y, 85, 22, 3);

    for (let i = 0; i < 42; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 8;

      this.createParticle(
        x,
        y,
        ["#d6b17a", "#a47748", "#74502f", "#e4d0a5"][
          Math.floor(Math.random() * 4)
        ],
        3 + Math.random() * 6,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed - 2,
        45 + Math.random() * 35
      );
    }

    for (let i = 0; i < 14; i++) {
      const side = Math.random() < 0.5 ? -1 : 1;

      this.createRock(
        x + side * (10 + Math.random() * 35),
        y,
        8 + Math.random() * 12,
        side * (1 + Math.random() * 3),
        -7 - Math.random() * 7
      );
    }

    this.game.canvas.startShake(55, 9);
  }

  updateImpact() {
    if (this.timer === 1) {
      this.createPillars();
    }

    if (this.timer >= 30) {
      this.phase = "EXPLOSION";
      this.timer = 0;
    }
  }

  createPillars() {
    const x = this.impactPosition.x;
    const y = this.impactPosition.y;

    this.pillars = [];

    for (let i = 0; i < 7; i++) {
      const offset = (i - 3) * 19;

      this.pillars.push({
        x: x + offset,
        baseY: y + 12,
        height: 0,
        maxHeight: 45 + Math.random() * 65,
        width: 12 + Math.random() * 10,
        speed: 5 + Math.random() * 5,
        delay: Math.abs(i - 3) * 2,
      });
    }
  }

  updateExplosion() {
    if (this.timer === 1) {
      this.createShockwave(
        this.impactPosition.x,
        this.impactPosition.y,
        150,
        35,
        8
      );

      for (let i = 0; i < 65; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 9;

        this.createParticle(
          this.impactPosition.x,
          this.impactPosition.y,
          ["#8c6746", "#c29a68", "#e0c59b", "#68503b"][
            Math.floor(Math.random() * 4)
          ],
          2 + Math.random() * 6,
          Math.cos(angle) * speed,
          Math.sin(angle) * speed - 2,
          55 + Math.random() * 35
        );
      }

      this.game.canvas.startShake(65, 12);
    }

    if (this.timer >= 42) {
      this.phase = "AFTERMATH";
      this.timer = 0;
    }
  }

  updateAftermath() {
    if (this.timer >= 45) {
      this.phase = "FINISH";
      this.timer = 0;
    }
  }

  updateEffects() {
    for (const rock of this.rocks) {
      rock.x += rock.vx;
      rock.y += rock.vy;
      rock.vy += rock.gravity;
      rock.rotation += rock.rotationSpeed;
      rock.life--;
    }

    this.rocks = this.rocks.filter((rock) => rock.life > 0);

    for (const particle of this.particles) {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += particle.gravity;
      particle.life--;
    }

    this.particles = this.particles.filter((particle) => particle.life > 0);

    for (const wave of this.shockwaves) {
      wave.timer++;
      wave.radius = (wave.timer / wave.duration) * wave.maxRadius;
    }

    this.shockwaves = this.shockwaves.filter(
      (wave) => wave.timer < wave.duration
    );

    if (this.pillars) {
      for (const pillar of this.pillars) {
        if (this.phase === "IMPACT" || this.phase === "EXPLOSION") {
          if (this.timer >= pillar.delay) {
            pillar.height = Math.min(
              pillar.maxHeight,
              pillar.height + pillar.speed
            );
          }
        } else {
          pillar.height = Math.max(0, pillar.height - 3);
        }
      }
    }
  }

  drawCracks(context) {
    const groundY = this.target.position.y + this.target.frameHeight * 0.85;

    context.save();

    for (const crack of this.cracks) {
      const progress = Math.min(1, this.timer / 30);

      context.strokeStyle = `rgba(255, 190, 95, ${0.8 * progress})`;

      context.lineWidth = crack.width;
      context.beginPath();
      context.moveTo(crack.x, crack.y);

      const endX = crack.x + Math.cos(crack.angle) * crack.length * progress;

      const endY = crack.y + Math.sin(crack.angle) * crack.length * progress;

      context.lineTo(endX, endY);
      context.stroke();

      context.strokeStyle = `rgba(75, 49, 31, ${0.9 * progress})`;

      context.lineWidth = crack.width + 2;
      context.beginPath();
      context.moveTo(crack.x, crack.y);
      context.lineTo(endX, endY);
      context.stroke();
    }

    context.restore();
  }

  drawPillars(context) {
    if (!this.pillars) return;

    for (const pillar of this.pillars) {
      if (pillar.height <= 0) continue;

      const h = pillar.height;
      const w = pillar.width;
      const x = pillar.x;
      const y = pillar.baseY;

      context.save();

      context.fillStyle = "#65452f";
      context.beginPath();
      context.moveTo(x - w, y);
      context.lineTo(x - w * 0.7, y - h * 0.75);
      context.lineTo(x - w * 0.2, y - h);
      context.lineTo(x + w, y - h * 0.85);
      context.lineTo(x + w * 0.8, y);
      context.closePath();
      context.fill();

      context.fillStyle = "#b58a59";
      context.beginPath();
      context.moveTo(x - w * 0.7, y - h * 0.75);
      context.lineTo(x - w * 0.2, y - h);
      context.lineTo(x + w * 0.45, y - h * 0.78);
      context.lineTo(x + w * 0.1, y - h * 0.65);
      context.closePath();
      context.fill();

      context.strokeStyle = "rgba(255, 220, 160, 0.7)";
      context.lineWidth = 1.5;
      context.beginPath();
      context.moveTo(x - w * 0.2, y - h);
      context.lineTo(x + w * 0.45, y - h * 0.78);
      context.stroke();

      context.restore();
    }
  }

  drawRocks(context) {
    for (const rock of this.rocks) {
      context.save();

      context.translate(rock.x, rock.y);
      context.rotate(rock.rotation);

      context.globalAlpha = Math.min(1, rock.life / 15);

      context.fillStyle = "#8b6748";
      context.beginPath();
      context.moveTo(-rock.size, rock.size * 0.4);
      context.lineTo(-rock.size * 0.4, -rock.size);
      context.lineTo(rock.size * 0.6, -rock.size * 0.5);
      context.lineTo(rock.size, rock.size * 0.5);
      context.closePath();
      context.fill();

      context.fillStyle = "#c5a077";
      context.beginPath();
      context.moveTo(-rock.size * 0.4, -rock.size);
      context.lineTo(rock.size * 0.6, -rock.size * 0.5);
      context.lineTo(0, 0);
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

  drawShockwaves(context) {
    for (const wave of this.shockwaves) {
      const alpha = 1 - wave.timer / wave.duration;

      context.save();
      context.strokeStyle = `rgba(220, 180, 125, ${alpha})`;
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

  draw(context) {
    this.updateEffects();

    context.save();

    if (this.phase === "CHARGE" || this.phase === "ERUPTION") {
      this.drawCracks(context);
    }

    this.drawShockwaves(context);
    this.drawPillars(context);
    this.drawRocks(context);
    this.drawParticles(context);

    if (this.phase === "IMPACT" || this.phase === "EXPLOSION") {
      const alpha =
        this.phase === "IMPACT"
          ? Math.max(0, 1 - this.timer / 12)
          : Math.max(0, 0.5 - this.timer / 35);

      if (alpha > 0) {
        context.fillStyle = `rgba(255, 235, 190, ${alpha})`;
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
      }
    }

    context.restore();
  }
}
