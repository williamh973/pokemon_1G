export class SludgeAnimation {
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

    this.phase = "PREPARE";
    this.timer = 0;
    this.isFinished = false;

    this.projectiles = [];
    this.splashes = [];
    this.droplets = [];
    this.bubbles = [];
    this.fragments = [];

    this.centerX = 0;
    this.centerY = 0;

    this.startX = 0;
    this.startY = 0;
    this.targetX = 0;
    this.targetY = 0;

    this.intensity = 0;
    this.flashOpacity = 0;
    this.rotation = 0;

    this.projectilesCreated = false;
  }

  update(context) {
    if (this.isFinished) return;

    this.timer++;

    this.updatePositions();
    this.updateParticles();

    switch (this.phase) {
      case "PREPARE":
        this.updatePrepare();
        break;

      case "PROJECTILE":
        this.updateProjectile();
        break;

      case "IMPACT":
        this.updateImpact();
        break;

      case "DRIPPING":
        this.updateDripping();
        break;

      case "FINISH":
        this.updateFinish();
        break;
    }

    this.draw(context);
  }

  updatePositions() {
    const attacker = this.pokemonViewer.sprite;
    const target = this.targetViewer.sprite;

    this.startX = attacker.position.x + attacker.frameWidth / 2;
    this.startY = attacker.position.y + attacker.frameHeight / 2;

    this.targetX = target.position.x + target.frameWidth / 2;
    this.targetY = target.position.y + target.frameHeight / 2;

    this.centerX = this.targetX;
    this.centerY = this.targetY;
  }

  updatePrepare() {
    this.intensity = Math.min(1, this.timer / 25);

    if (this.timer % 5 === 0) {
      this.createBubble(
        this.startX + (Math.random() - 0.5) * 15,
        this.startY + (Math.random() - 0.5) * 15
      );
    }

    if (this.timer >= 25) {
      this.phase = "PROJECTILE";
      this.timer = 0;
      this.createProjectiles();
    }
  }

  createProjectiles() {
    if (this.projectilesCreated) return;

    this.projectilesCreated = true;

    for (let i = 0; i < 5; i++) {
      this.projectiles.push({
        x: this.startX,
        y: this.startY,
        startX: this.startX,
        startY: this.startY,
        targetX: this.targetX + (Math.random() - 0.5) * 25,
        targetY: this.targetY + (Math.random() - 0.5) * 25,
        progress: 0,
        speed: 0.025 + Math.random() * 0.008,
        size: 5 + Math.random() * 6,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.15,
        wobble: Math.random() * Math.PI * 2,
      });
    }
  }

  updateProjectile() {
    this.projectiles.forEach((projectile) => {
      projectile.progress = Math.min(1, projectile.progress + projectile.speed);

      const t = projectile.progress;

      projectile.x =
        projectile.startX + (projectile.targetX - projectile.startX) * t;

      projectile.y =
        projectile.startY +
        (projectile.targetY - projectile.startY) * t -
        Math.sin(t * Math.PI) * 30;

      projectile.rotation += projectile.rotationSpeed;
      projectile.wobble += 0.2;
    });

    if (
      this.projectiles.length > 0 &&
      this.projectiles.every((projectile) => projectile.progress >= 1)
    ) {
      this.phase = "IMPACT";
      this.timer = 0;
      this.createImpact();
    }
  }

  createImpact() {
    this.flashOpacity = 0.75;

    for (let i = 0; i < 22; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 3.5;

      this.splashes.push({
        x: this.centerX,
        y: this.centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3 + Math.random() * 7,
        life: 25 + Math.random() * 20,
        maxLife: 45,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
      });
    }

    for (let i = 0; i < 18; i++) {
      this.createDroplet();
    }

    for (let i = 0; i < 8; i++) {
      this.createBubble(
        this.centerX + (Math.random() - 0.5) * 35,
        this.centerY + (Math.random() - 0.5) * 30
      );
    }
  }

  updateImpact() {
    this.flashOpacity = Math.max(0, this.flashOpacity - 0.08);

    if (this.timer % 3 === 0) {
      this.createDroplet();
    }

    if (this.timer >= 30) {
      this.phase = "DRIPPING";
      this.timer = 0;
    }
  }

  updateDripping() {
    if (this.timer % 5 === 0) {
      this.createDroplet();
      this.createBubble(
        this.centerX + (Math.random() - 0.5) * 40,
        this.centerY + (Math.random() - 0.5) * 30
      );
    }

    if (this.timer >= 45) {
      this.phase = "FINISH";
      this.timer = 0;
    }
  }

  updateFinish() {
    this.intensity = Math.max(0, this.intensity - 0.04);
    this.flashOpacity = Math.max(0, this.flashOpacity - 0.06);

    if (this.timer >= 40) {
      this.isFinished = true;
    }
  }

  createDroplet() {
    this.droplets.push({
      x: this.centerX + (Math.random() - 0.5) * 40,
      y: this.centerY + (Math.random() - 0.5) * 35,
      vx: (Math.random() - 0.5) * 2,
      vy: -1 - Math.random() * 2,
      gravity: 0.12,
      size: 2 + Math.random() * 4,
      life: 30 + Math.random() * 25,
      maxLife: 55,
    });
  }

  createBubble(x, y) {
    this.bubbles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 0.8,
      vy: -0.6 - Math.random() * 1.2,
      size: 2 + Math.random() * 4,
      life: 25 + Math.random() * 20,
      maxLife: 45,
      wobble: Math.random() * Math.PI * 2,
    });
  }

  updateParticles() {
    this.splashes.forEach((splash) => {
      splash.x += splash.vx;
      splash.y += splash.vy;

      splash.vx *= 0.97;
      splash.vy *= 0.97;

      splash.rotation += splash.rotationSpeed;
      splash.life--;
    });

    this.splashes = this.splashes.filter((splash) => splash.life > 0);

    this.droplets.forEach((droplet) => {
      droplet.x += droplet.vx;
      droplet.y += droplet.vy;

      droplet.vy += droplet.gravity;
      droplet.life--;
    });

    this.droplets = this.droplets.filter((droplet) => droplet.life > 0);

    this.bubbles.forEach((bubble) => {
      bubble.x += bubble.vx;
      bubble.y += bubble.vy;

      bubble.wobble += 0.1;
      bubble.life--;
    });

    this.bubbles = this.bubbles.filter((bubble) => bubble.life > 0);
  }

  draw(context) {
    context.save();

    this.drawProjectiles(context);
    this.drawSplashes(context);
    this.drawDroplets(context);
    this.drawBubbles(context);
    this.drawFlash(context);

    context.restore();
  }

  drawSludgeBlob(context, x, y, size, rotation = 0) {
    context.save();

    context.translate(x, y);
    context.rotate(rotation);

    const gradient = context.createRadialGradient(
      -size * 0.3,
      -size * 0.4,
      1,
      0,
      0,
      size * 1.2
    );

    gradient.addColorStop(0, "#d17be8");
    gradient.addColorStop(0.3, "#8c20a8");
    gradient.addColorStop(0.75, "#58106f");
    gradient.addColorStop(1, "#280536");

    context.fillStyle = gradient;
    context.shadowColor = "#9d25bd";
    context.shadowBlur = 10;

    context.beginPath();

    context.moveTo(-size * 0.8, -size * 0.1);

    context.bezierCurveTo(
      -size * 1.1,
      -size * 0.9,
      -size * 0.2,
      -size * 1.1,
      size * 0.1,
      -size * 0.7
    );

    context.bezierCurveTo(
      size * 0.9,
      -size * 1.1,
      size * 1.2,
      -size * 0.2,
      size * 0.7,
      size * 0.4
    );

    context.bezierCurveTo(
      size * 0.4,
      size * 1.1,
      -size * 0.5,
      size * 1.1,
      -size * 0.8,
      -size * 0.1
    );

    context.fill();

    context.restore();
  }

  drawProjectiles(context) {
    this.projectiles.forEach((projectile) => {
      const wobble = Math.sin(projectile.wobble) * 2;

      this.drawSludgeBlob(
        context,
        projectile.x,
        projectile.y + wobble,
        projectile.size,
        projectile.rotation
      );

      context.save();

      context.globalAlpha = 0.7;
      context.fillStyle = "#a7e83d";
      context.shadowColor = "#8cff00";
      context.shadowBlur = 6;

      context.beginPath();
      context.arc(
        projectile.x - projectile.size * 0.2,
        projectile.y - projectile.size * 0.2 + wobble,
        projectile.size * 0.18,
        0,
        Math.PI * 2
      );

      context.fill();
      context.restore();
    });
  }

  drawSplashes(context) {
    this.splashes.forEach((splash) => {
      context.save();

      context.globalAlpha = Math.min(1, splash.life / splash.maxLife);

      this.drawSludgeBlob(
        context,
        splash.x,
        splash.y,
        splash.size,
        splash.rotation
      );

      context.restore();
    });
  }

  drawDroplets(context) {
    this.droplets.forEach((droplet) => {
      context.save();

      context.globalAlpha = Math.min(1, droplet.life / 15);

      context.fillStyle = "#781a91";
      context.shadowColor = "#b83bd4";
      context.shadowBlur = 6;

      context.beginPath();

      context.ellipse(
        droplet.x,
        droplet.y,
        droplet.size * 0.7,
        droplet.size * 1.3,
        0,
        0,
        Math.PI * 2
      );

      context.fill();

      context.restore();
    });
  }

  drawBubbles(context) {
    this.bubbles.forEach((bubble) => {
      context.save();

      context.globalAlpha = Math.min(1, bubble.life / 12);

      context.fillStyle = "#a3ef36";
      context.strokeStyle = "#e1ff9b";
      context.lineWidth = 1;

      context.shadowColor = "#8dff00";
      context.shadowBlur = 7;

      context.beginPath();

      context.arc(
        bubble.x + Math.sin(bubble.wobble) * 2,
        bubble.y,
        bubble.size,
        0,
        Math.PI * 2
      );

      context.fill();
      context.stroke();

      context.restore();
    });
  }

  drawFlash(context) {
    if (this.flashOpacity <= 0) return;

    context.save();

    context.globalAlpha = this.flashOpacity;
    context.fillStyle = "#a7ef4b";

    context.beginPath();

    context.arc(this.centerX, this.centerY, 25, 0, Math.PI * 2);

    context.fill();
    context.restore();
  }
}
