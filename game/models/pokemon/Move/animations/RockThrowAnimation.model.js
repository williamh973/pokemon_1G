import { randomBetween } from "../../../../shareds/utils/math/math.utils.js";

export class RockThrowAnimation {
  constructor(game, viewers, turnAction) {
    this.game = game;
    this.viewers = viewers;
    this.turnAction = turnAction;

    this.pokemon = turnAction.pokemon;
    this.target = turnAction.target;
    this.move = turnAction.move;

    // Viewers
    if (this.viewers.front.slot.content === this.pokemon) {
      this.pokemonViewer = this.viewers.front;
      this.targetViewer = this.viewers.back;
    } else {
      this.pokemonViewer = this.viewers.back;
      this.targetViewer = this.viewers.front;
    }

    // Animation
    this.state = "THROW";
    this.isFinished = false;

    // Projectiles
    this.projectiles = [];
    this.projectileCount = 3;
    this.projectileInterval = randomBetween(3, 10);
    this.projectileTimer = 0;
    this.projectilesCreated = 0;
    this.projectileSpeed = randomBetween(4, 8);

    // Impacts
    this.impacts = [];
  }

  createProjectile() {
    const startX =
      this.pokemonViewer.sprite.position.x +
      this.pokemonViewer.sprite.frameWidth / 2;

    const startY =
      this.pokemonViewer.sprite.position.y +
      this.pokemonViewer.sprite.frameHeight / 2;

    const targetX =
      this.targetViewer.sprite.position.x +
      this.targetViewer.sprite.frameWidth / 2;

    const targetY =
      this.targetViewer.sprite.position.y +
      this.targetViewer.sprite.frameHeight / 2;

    const angle = Math.atan2(targetY - startY, targetX - startX);

    const dispersion = (Math.random() - 0.5) * 0.35;
    const projectileAngle = angle + dispersion;

    const radius = 7 + Math.random() * 5;

    const vertices = [];

    for (let i = 0; i < 7; i++) {
      const vertexAngle = (Math.PI * 2 * i) / 7;
      const vertexRadius = radius * (0.7 + Math.random() * 0.3);

      vertices.push({
        x: Math.cos(vertexAngle) * vertexRadius,
        y: Math.sin(vertexAngle) * vertexRadius,
      });
    }

    this.projectiles.push({
      x: startX,
      y: startY,

      velocityX: Math.cos(projectileAngle) * this.projectileSpeed,
      velocityY: Math.sin(projectileAngle) * this.projectileSpeed,

      vertices,
      radius,

      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.15,

      isFinished: false,
    });

    this.projectilesCreated++;
  }

  drawProjectile(context, projectile) {
    context.save();

    context.translate(projectile.x, projectile.y);
    context.rotate(projectile.rotation);

    // Corps du rocher
    context.beginPath();

    projectile.vertices.forEach((vertex, index) => {
      if (index === 0) {
        context.moveTo(vertex.x, vertex.y);
      } else {
        context.lineTo(vertex.x, vertex.y);
      }
    });

    context.closePath();

    context.fillStyle = "#777777";
    context.fill();

    context.strokeStyle = "#454545";
    context.lineWidth = 1.5;
    context.stroke();

    // Relief intérieur
    context.beginPath();
    context.moveTo(-projectile.radius * 0.5, -projectile.radius * 0.2);
    context.lineTo(0, -projectile.radius * 0.65);
    context.lineTo(projectile.radius * 0.45, -projectile.radius * 0.2);
    context.closePath();

    context.fillStyle = "#AAAAAA";
    context.fill();

    context.restore();
  }

  drawFragment(context, fragment, opacity) {
    context.save();

    context.globalAlpha = opacity;
    context.fillStyle = "#777777";

    context.beginPath();
    context.arc(fragment.x, fragment.y, fragment.radius, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }

  updateProjectiles(context) {
    this.projectiles.forEach((projectile) => {
      projectile.x += projectile.velocityX;
      projectile.y += projectile.velocityY;

      projectile.rotation += projectile.rotationSpeed;

      this.drawProjectile(context, projectile);

      const targetX = this.targetViewer.sprite.position.x;
      const targetY = this.targetViewer.sprite.position.y;

      if (
        projectile.x + projectile.radius >= targetX &&
        projectile.x - projectile.radius <=
          targetX + this.targetViewer.sprite.frameWidth &&
        projectile.y + projectile.radius >= targetY &&
        projectile.y - projectile.radius <=
          targetY + this.targetViewer.sprite.frameHeight
      ) {
        this.createImpact(projectile.x, projectile.y);
        projectile.isFinished = true;
      }
    });

    this.projectiles = this.projectiles.filter(
      (projectile) => !projectile.isFinished
    );
  }

  updateProjectileCreation() {
    if (this.projectilesCreated >= this.projectileCount) return;

    this.projectileTimer++;

    if (this.projectileTimer >= this.projectileInterval) {
      this.projectileTimer = 0;
      this.createProjectile();
    }
  }

  createImpact(x, y) {
    const fragments = [];

    for (let i = 0; i < 7; i++) {
      const angle = (Math.PI * 2 * i) / 7;
      const speed = 1 + Math.random() * 2;

      fragments.push({
        x,
        y,
        velocityX: Math.cos(angle) * speed,
        velocityY: Math.sin(angle) * speed,
        radius: 1.5 + Math.random() * 2,
      });
    }

    this.impacts.push({
      x,
      y,
      timer: 0,
      duration: 20,
      fragments,
    });
  }

  updateImpacts(context) {
    this.impacts.forEach((impact) => {
      impact.timer++;

      const opacity = 1 - impact.timer / impact.duration;

      impact.fragments.forEach((fragment) => {
        fragment.x += fragment.velocityX;
        fragment.y += fragment.velocityY;

        // Gravité
        fragment.velocityY += 0.12;

        this.drawFragment(context, fragment, opacity);
      });

      this.drawDust(context, impact, opacity);
    });

    this.impacts = this.impacts.filter(
      (impact) => impact.timer < impact.duration
    );
  }

  drawDust(context, impact, opacity) {
    const radius = impact.timer * 0.5;

    context.save();

    context.globalAlpha = opacity * 0.35;
    context.fillStyle = "#999999";

    context.beginPath();
    context.arc(impact.x, impact.y, radius, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }

  update(context) {
    if (this.isFinished) return;

    switch (this.state) {
      case "THROW":
        this.updateProjectileCreation();
        this.updateProjectiles(context);
        this.updateImpacts(context);

        if (
          this.projectilesCreated >= this.projectileCount &&
          this.projectiles.length === 0
        ) {
          this.state = "FINISH";
        }
        break;

      case "FINISH":
        this.updateImpacts(context);

        if (this.impacts.length === 0) {
          this.isFinished = true;
        }
        break;
    }
  }
}
