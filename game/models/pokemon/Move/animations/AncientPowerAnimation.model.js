export class AncientPowerAnimation {
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

    this.state = "PREPARE";
    this.timer = 0;
    this.isFinished = false;

    this.prepareDuration = 100;
    this.projectileCount = 5;
    this.projectileInterval = 7;
    this.projectileTimer = 0;
    this.projectilesCreated = 0;
    this.projectileSpeed = 10;

    this.rocks = [];
    this.impacts = [];
    this.projectiles = [];

    this.colorSets = [
      {
        fillStyle: "rgba(255, 230, 140, 1)",
        strokeStyle: "rgba(230, 174, 55, 0.85)",
        shadowColor: "rgba(160, 105, 25, 0.65)",
      },
      {
        fillStyle: "rgba(255, 190, 170, 1)",
        strokeStyle: "rgba(235, 65, 45, 0.85)",
        shadowColor: "rgba(145, 20, 25, 0.65)",
      },
      {
        fillStyle: "rgba(230, 190, 255, 1)",
        strokeStyle: "rgba(160, 95, 220, 0.85)",
        shadowColor: "rgba(85, 40, 145, 0.65)",
      },
      {
        fillStyle: "rgba(190, 255, 150, 1)",
        strokeStyle: "rgba(85, 190, 75, 0.85)",
        shadowColor: "rgba(35, 110, 45, 0.65)",
      },
      {
        fillStyle: " rgba(170, 235, 255, 1)",
        strokeStyle: "rgba(55, 165, 230, 0.85)",
        shadowColor: "rgba(20, 85, 180, 0.65)",
      },
    ];

    this.runeColorSet = this.getRandomColorDice();

    this.createRocks();
  }

  getRandomColorDice() {
    return this.colorSets[Math.floor(Math.random() * this.colorSets.length)];
  }

  drawRunes(context, rock) {
    context.save();

    context.strokeStyle = this.runeColorSet.strokeStyle;
    context.fillStyle = this.runeColorSet.fillStyle;
    context.lineWidth = 1;
    context.lineJoin = "round";
    context.lineCap = "round";

    context.shadowColor = this.runeColorSet.shadowColor;
    context.shadowBlur = 12;

    // Rune centrale : symbole ancien anguleux.
    context.beginPath();
    context.moveTo(-3, -7);
    context.lineTo(3, -3);
    context.lineTo(-3, 1);
    context.lineTo(3, 5);
    context.lineTo(-3, 9);
    context.stroke();

    // Rune latérale gauche.
    context.beginPath();
    context.moveTo(-10, -6);
    context.lineTo(-6, -2);
    context.lineTo(-10, 2);
    context.lineTo(-6, 6);
    context.stroke();

    // Rune latérale droite.
    context.beginPath();
    context.moveTo(7, -7);
    context.lineTo(11, -3);
    context.lineTo(7, 1);
    context.lineTo(11, 5);
    context.stroke();

    // Petit glyphe supérieur.
    context.beginPath();
    context.moveTo(-2, -12);
    context.lineTo(0, -15);
    context.lineTo(2, -12);
    context.stroke();

    // Point lumineux central.
    context.beginPath();
    context.arc(0, 0, 1.5, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }

  createRocks() {
    for (let i = 0; i < this.projectileCount; i++) {
      const vertices = [];
      const vertexCount = 7;

      for (let j = 0; j < vertexCount; j++) {
        const angle = (Math.PI * 2 * j) / vertexCount;
        const radius = 7 + Math.random() * 6;

        vertices.push({
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius,
        });
      }

      this.rocks.push({
        orbitAngle: (Math.PI * 2 * i) / this.projectileCount,
        orbitRadius: 22 + Math.random() * 12,
        orbitSpeed: 0.035 + Math.random() * 0.025,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.12,
        vertices,
        scale: 0.8 + Math.random() * 0.5,
        isLaunched: false,
      });
    }
  }

  update(context) {
    switch (this.state) {
      case "PREPARE":
        this.updatePreparation(context);
        break;

      case "LAUNCH":
        this.updateLaunch(context);
        break;

      case "FINISH":
        this.isFinished = true;
        break;
    }
  }

  updatePreparation(context) {
    this.timer++;

    const sprite = this.pokemonViewer.sprite;

    const centerX = sprite.position.x + sprite.frameWidth / 2;
    const centerY = sprite.position.y + sprite.frameHeight / 2;

    const progress = this.timer / this.prepareDuration;

    for (const rock of this.rocks) {
      rock.orbitAngle += rock.orbitSpeed;

      const x = centerX + Math.cos(rock.orbitAngle) * rock.orbitRadius;

      const y = centerY + Math.sin(rock.orbitAngle) * rock.orbitRadius;

      rock.rotation += rock.rotationSpeed;

      this.drawAura(context, x, y, 18 * progress);
      this.drawRock(context, rock, x, y);
    }

    if (this.timer >= this.prepareDuration) {
      this.timer = 0;
      this.state = "LAUNCH";
    }
  }

  updateLaunch(context) {
    this.updateProjectileCreation();

    this.updateProjectiles(context);
    this.updateImpacts(context);

    if (
      this.projectilesCreated === this.projectileCount &&
      this.projectiles.length === 0 &&
      this.impacts.length === 0
    ) {
      this.state = "FINISH";
    }
  }

  updateProjectileCreation() {
    if (this.projectilesCreated >= this.projectileCount) {
      return;
    }

    this.projectileTimer++;

    if (this.projectileTimer >= this.projectileInterval) {
      this.projectileTimer = 0;

      const rock = this.rocks[this.projectilesCreated];

      this.launchRock(rock);

      this.projectilesCreated++;
    }
  }

  launchRock(rock) {
    const sprite = this.pokemonViewer.sprite;
    const target = this.targetViewer.sprite;

    const centerX = sprite.position.x + sprite.frameWidth / 2;
    const centerY = sprite.position.y + sprite.frameHeight / 2;

    const targetX = target.position.x + target.frameWidth / 2;
    const targetY = target.position.y + target.frameHeight / 2;

    const startX = centerX + Math.cos(rock.orbitAngle) * rock.orbitRadius;

    const startY = centerY + Math.sin(rock.orbitAngle) * rock.orbitRadius;

    const angle = Math.atan2(targetY - startY, targetX - startX);

    const speed = this.projectileSpeed + Math.random() * 2;

    rock.isLaunched = true;

    this.projectiles ??= [];

    this.projectiles.push({
      x: startX,
      y: startY,

      velocityX: Math.cos(angle) * speed,
      velocityY: Math.sin(angle) * speed,

      perpendicularX: -Math.sin(angle),
      perpendicularY: Math.cos(angle),

      curveAmplitude: (Math.random() - 0.5) * 1.8,
      age: 0,

      rotation: rock.rotation,
      rotationSpeed: rock.rotationSpeed * 2,

      vertices: rock.vertices,
      scale: rock.scale,

      isFinished: false,
    });
  }

  updateProjectiles(context) {
    const target = this.targetViewer.sprite;

    for (const projectile of this.projectiles) {
      projectile.age++;

      const curve = Math.sin(projectile.age * 0.12) * projectile.curveAmplitude;

      projectile.x += projectile.velocityX + projectile.perpendicularX * curve;

      projectile.y += projectile.velocityY + projectile.perpendicularY * curve;

      projectile.rotation += projectile.rotationSpeed;

      this.drawAura(context, projectile.x, projectile.y, 17);

      this.drawRock(context, projectile, projectile.x, projectile.y);

      const hit =
        projectile.x >= target.position.x &&
        projectile.x <= target.position.x + target.frameWidth &&
        projectile.y >= target.position.y &&
        projectile.y <= target.position.y + target.frameHeight;

      if (hit) {
        this.createImpact(projectile.x, projectile.y);
        projectile.isFinished = true;

        this.game.canvas.startShake(200, 2);
      }
    }

    this.projectiles = this.projectiles.filter(
      (projectile) => !projectile.isFinished
    );
  }

  drawAura(context, x, y, radius) {
    if (radius <= 0) return;

    context.save();

    const gradient = context.createRadialGradient(x, y, 0, x, y, radius);

    gradient.addColorStop(0, "rgba(255, 225, 110, 0.45)");
    gradient.addColorStop(0.5, "rgba(255, 190, 45, 0.18)");
    gradient.addColorStop(1, "rgba(255, 170, 20, 0)");

    context.fillStyle = gradient;

    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }

  drawRock(context, rock, x, y) {
    context.save();

    context.translate(x, y);
    context.rotate(rock.rotation);
    context.scale(rock.scale, rock.scale);

    // Silhouette de la roche.
    context.beginPath();

    rock.vertices.forEach((vertex, index) => {
      if (index === 0) {
        context.moveTo(vertex.x, vertex.y);
      } else {
        context.lineTo(vertex.x, vertex.y);
      }
    });

    context.closePath();

    context.fillStyle = "#272725";
    context.fill();

    context.strokeStyle = "#4E4D46";
    context.lineWidth = 1;
    context.stroke();

    // Facette lumineuse.
    context.beginPath();
    context.moveTo(-5, -3);
    context.lineTo(0, -8);
    context.lineTo(5, -4);

    context.strokeStyle = "#c7b994";
    context.lineWidth = 1.5;
    context.stroke();

    this.drawRunes(context, rock);

    context.restore();
  }

  createImpact(x, y) {
    const particles = [];

    for (let i = 0; i < 9; i++) {
      const angle = (Math.PI * 2 * i) / 9 + Math.random() * 0.5;

      const speed = 1.5 + Math.random() * 2.5;

      particles.push({
        x: 0,
        y: 0,
        velocityX: Math.cos(angle) * speed,
        velocityY: Math.sin(angle) * speed,
        radius: 1.5 + Math.random() * 2,
        color: Math.random() > 0.5 ? "#e6b84b" : "#a69a7a",
      });
    }

    this.impacts.push({
      x,
      y,
      particles,
      timer: 0,
      duration: 18,
    });
  }

  updateImpacts(context) {
    for (const impact of this.impacts) {
      impact.timer++;

      const opacity = 1 - impact.timer / impact.duration;

      for (const particle of impact.particles) {
        particle.x += particle.velocityX;
        particle.y += particle.velocityY;

        particle.velocityY += 0.08;

        context.save();

        context.globalAlpha = opacity;
        context.fillStyle = particle.color;

        context.beginPath();
        context.arc(
          impact.x + particle.x,
          impact.y + particle.y,
          particle.radius,
          0,
          Math.PI * 2
        );
        context.fill();

        context.restore();
      }
    }

    this.impacts = this.impacts.filter(
      (impact) => impact.timer < impact.duration
    );
  }
}
