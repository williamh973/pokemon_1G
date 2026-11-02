import { randomBetween } from "../../../../shareds/utils/math/math.utils.js";

export class RazorLeafAnimation {
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

    this.projectiles = [];
    this.projectileCount = randomBetween(5, 10);
    this.projectileInterval = randomBetween(5, 10);
    this.projectileTimer = 0;
    this.projectilesCreated = 0;
    this.projectileSpeed = randomBetween(5, 10);

    this.impacts = [];
  }

  update(context) {
    switch (this.state) {
      case "PREPARE":
        this.state = "THROW";
        break;

      case "THROW":
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
        break;

      case "FINISH":
        this.isFinished = true;
        break;
    }
  }

  updateProjectileCreation() {
    if (this.projectilesCreated >= this.projectileCount) {
      return;
    }

    this.projectileTimer++;

    if (this.projectileTimer >= this.projectileInterval) {
      this.projectileTimer = 0;
      this.createProjectile();
      this.projectilesCreated++;
    }
  }

  createProjectile() {
    const attacker = this.pokemonViewer.sprite;
    const target = this.targetViewer.sprite;

    const startX = attacker.position.x + attacker.frameWidth / 2;
    const startY = attacker.position.y + attacker.frameHeight / 2;

    const targetX = target.position.x + target.frameWidth / 2;
    const targetY = target.position.y + target.frameHeight / 2;

    const angle =
      Math.atan2(targetY - startY, targetX - startX) +
      (Math.random() - 0.5) * 0.35;

    const speed = this.projectileSpeed + Math.random() * 1.5;

    this.projectiles.push({
      x: startX,
      y: startY,
      velocityX: Math.cos(angle) * speed,
      velocityY: Math.sin(angle) * speed,
      angle,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.25,
      length: 20 + Math.random() * 8,
      width: 9 + Math.random() * 4,
      isFinished: false,
    });
  }

  updateProjectiles(context) {
    const target = this.targetViewer.sprite;

    for (const leaf of this.projectiles) {
      leaf.x += leaf.velocityX;
      leaf.y += leaf.velocityY;
      leaf.rotation += leaf.rotationSpeed;

      this.drawLeaf(context, leaf);

      const hit =
        leaf.x >= target.position.x &&
        leaf.x <= target.position.x + target.frameWidth &&
        leaf.y >= target.position.y &&
        leaf.y <= target.position.y + target.frameHeight;

      if (hit) {
        this.createImpact(leaf.x, leaf.y);
        leaf.isFinished = true;
      }
    }

    this.projectiles = this.projectiles.filter((leaf) => !leaf.isFinished);
  }

  drawLeaf(context, leaf) {
    context.save();

    context.translate(leaf.x, leaf.y);
    context.rotate(leaf.rotation);

    const length = leaf.length;
    const width = leaf.width;

    // Silhouette végétale, avec des pointes et des bords dentelés.
    context.beginPath();
    context.moveTo(length / 2, 0);
    context.quadraticCurveTo(length * 0.18, -width * 0.45, 0, -width / 2);
    context.lineTo(-length * 0.12, -width * 0.72);
    context.lineTo(-length * 0.2, -width * 0.42);
    context.quadraticCurveTo(-length / 2, 0, -length * 0.2, width * 0.42);
    context.lineTo(-length * 0.12, width * 0.72);
    context.quadraticCurveTo(0, width / 2, length / 2, 0);

    context.closePath();

    context.fillStyle = "#398b35";
    context.fill();

    context.strokeStyle = "#205c24";
    context.lineWidth = 1;
    context.stroke();

    // Nervure centrale.
    context.beginPath();
    context.moveTo(-length * 0.35, 0);
    context.lineTo(length * 0.4, 0);

    context.strokeStyle = "#a5d96a";
    context.lineWidth = 1;
    context.stroke();

    // Nervures secondaires.
    context.beginPath();

    for (const side of [-1, 1]) {
      context.moveTo(-length * 0.05, 0);
      context.lineTo(length * 0.12, side * width * 0.25);

      context.moveTo(length * 0.15, 0);
      context.lineTo(length * 0.29, side * width * 0.15);
    }

    context.strokeStyle = "#77bd50";
    context.lineWidth = 0.7;
    context.stroke();

    context.restore();
  }

  createImpact(x, y) {
    this.impacts.push({
      x,
      y,
      timer: 0,
      duration: 8,
    });
  }

  updateImpacts(context) {
    for (const impact of this.impacts) {
      impact.timer++;

      const progress = impact.timer / impact.duration;
      const opacity = 1 - progress;

      context.save();
      context.globalAlpha = opacity;
      context.translate(impact.x, impact.y);
      context.rotate(progress * 0.8);

      // Petit effet de coupure en croix.
      context.strokeStyle = "#b8f58a";
      context.lineWidth = 2;

      context.beginPath();
      context.moveTo(-7, -7);
      context.lineTo(7, 7);
      context.moveTo(7, -7);
      context.lineTo(-7, 7);
      context.stroke();

      context.restore();
    }

    this.impacts = this.impacts.filter(
      (impact) => impact.timer < impact.duration
    );
  }
}
