export class WaterGunAnimation {
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
    this.state = "SHOOT";
    this.isFinished = false;

    // Projectiles
    this.projectiles = [];
    this.projectileCount = 5;
    this.projectileInterval = 6;
    this.projectileTimer = 0;
    this.projectilesCreated = 0;
    this.projectileSpeed = 5;

    // Impacts
    this.splashes = [];
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

    // Direction principale vers la cible
    const angle = Math.atan2(targetY - startY, targetX - startX);

    // Dispersion aléatoire de la trajectoire
    const dispersion = (Math.random() - 0.5) * 0.5;

    const projectileAngle = angle + dispersion;

    this.projectiles.push({
      x: startX,
      y: startY,

      velocityX: Math.cos(projectileAngle) * this.projectileSpeed,
      velocityY: Math.sin(projectileAngle) * this.projectileSpeed,

      radius: 4 + Math.random() * 3,
      isFinished: false,
    });

    this.projectilesCreated++;
  }

  updateProjectileCreation() {
    if (this.projectilesCreated >= this.projectileCount) return;

    this.projectileTimer++;

    if (this.projectileTimer >= this.projectileInterval) {
      this.projectileTimer = 0;
      this.createProjectile();
    }
  }

  updateProjectiles(context) {
    this.projectiles.forEach((projectile) => {
      projectile.x += projectile.velocityX;
      projectile.y += projectile.velocityY;

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
        this.createSplash(projectile.x, projectile.y);
        projectile.isFinished = true;
      }
    });

    this.projectiles = this.projectiles.filter(
      (projectile) => !projectile.isFinished
    );
  }

  drawProjectile(context, projectile) {
    context.save();

    context.fillStyle = "#168BFF";

    context.beginPath();
    context.arc(projectile.x, projectile.y, projectile.radius, 0, Math.PI * 2);
    context.fill();

    context.fillStyle = "#FFFFFF";
    context.globalAlpha = 0.7;

    context.beginPath();
    context.arc(
      projectile.x - 1,
      projectile.y - 1,
      projectile.radius * 0.35,
      0,
      Math.PI * 2
    );
    context.fill();

    context.restore();
  }

  createSplash(x, y) {
    const particles = [];

    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI * 2 * i) / 6;

      const speed = 1.5 + Math.random() * 1.5;

      particles.push({
        x,
        y,
        velocityX: Math.cos(angle) * speed,
        velocityY: Math.sin(angle) * speed,
        radius: 2 + Math.random() * 2,
      });
    }

    this.splashes.push({
      particles,
      opacity: 1,
      timer: 0,
      duration: 15,
    });
  }

  updateSplashes(context) {
    this.splashes.forEach((splash) => {
      splash.timer++;

      splash.opacity = 1 - splash.timer / splash.duration;

      splash.particles.forEach((particle) => {
        particle.x += particle.velocityX;
        particle.y += particle.velocityY;

        particle.velocityY += 0.08;

        this.drawSplash(context, particle, splash.opacity);
      });
    });

    this.splashes = this.splashes.filter(
      (splash) => splash.timer < splash.duration
    );
  }

  drawSplash(context, particle, opacity) {
    context.save();

    context.globalAlpha = opacity;
    context.fillStyle = "#168BFF";

    context.beginPath();
    context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }

  update(context) {
    if (this.isFinished) return;

    switch (this.state) {
      case "SHOOT":
        this.updateProjectileCreation();
        this.updateProjectiles(context);
        this.updateSplashes(context);

        if (
          this.projectilesCreated >= this.projectileCount &&
          this.projectiles.length === 0
        ) {
          this.state = "FINISH";
        }
        break;

      case "FINISH":
        this.updateSplashes(context);

        if (this.splashes.length === 0) {
          this.isFinished = true;
        }
        break;
    }
  }
}
