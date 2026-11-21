export class MirrorMoveAnimation {
  constructor(game, viewers, turnAction) {
    this.game = game;
    this.turnAction = turnAction;

    if (viewers.front.slot.content === turnAction.pokemon) {
      this.pokemonViewer = viewers.front;
      this.targetViewer = viewers.back;
    } else {
      this.pokemonViewer = viewers.back;
      this.targetViewer = viewers.front;
    }

    this.attacker = this.pokemonViewer.sprite;
    this.target = this.targetViewer.sprite;

    this.frame = 0;
    this.phaseFrame = 0;
    this.phase = "OBSERVE";
    this.isFinished = false;

    this.attackerCenter = this.getCenter(this.attacker);
    this.targetCenter = this.getCenter(this.target);

    const dx = this.targetCenter.x - this.attackerCenter.x;
    const dy = this.targetCenter.y - this.attackerCenter.y;
    const distance = Math.hypot(dx, dy) || 1;

    this.directionX = dx / distance;
    this.directionY = dy / distance;

    this.perpendicularX = -this.directionY;
    this.perpendicularY = this.directionX;

    this.midX = (this.attackerCenter.x + this.targetCenter.x) / 2;
    this.midY = (this.attackerCenter.y + this.targetCenter.y) / 2;

    this.mirrorX = this.attackerCenter.x + this.directionX * 35;
    this.mirrorY = this.attackerCenter.y + this.directionY * 35;

    this.mirrorWidth = 25;
    this.mirrorHeight = 37;
    this.mirrorOpacity = 0;
    this.mirrorScale = 0;

    this.reflectionOpacity = 0;
    this.reflectionScale = 0;

    this.energy = 0;
    this.flashOpacity = 0;

    this.particles = [];
    this.shards = [];
    this.rings = [];

    this.rotation = 0;
    this.isReleased = false;
  }

  getCenter(sprite) {
    return {
      x: sprite.position.x + (sprite.frameWidth * sprite.scale) / 2,
      y: sprite.position.y + (sprite.frameHeight * sprite.scale) / 2,
    };
  }

  update(context) {
    if (this.isFinished) return;

    this.frame++;
    this.phaseFrame++;

    this.attackerCenter = this.getCenter(this.attacker);
    this.targetCenter = this.getCenter(this.target);

    switch (this.phase) {
      case "OBSERVE":
        this.updateObserve();
        break;

      case "MATERIALIZE":
        this.updateMaterialize();
        break;

      case "CAPTURE":
        this.updateCapture();
        break;

      case "FRAGMENT":
        this.updateFragment();
        break;

      case "RELEASE":
        this.updateRelease();
        break;

      case "FINISH":
        this.updateFinish();
        break;
    }

    this.updateParticles();
    this.updateShards();
    this.updateRings();

    this.draw(context);
  }

  updateObserve() {
    this.energy = Math.min(1, this.phaseFrame / 20);

    if (this.phaseFrame % 5 === 0) {
      this.createParticle(
        this.attackerCenter.x,
        this.attackerCenter.y - 20,
        0,
        -0.5
      );
    }

    if (this.phaseFrame >= 22) {
      this.changePhase("MATERIALIZE");
    }
  }

  updateMaterialize() {
    const progress = Math.min(1, this.phaseFrame / 20);

    this.mirrorScale = 1 - Math.pow(1 - progress, 3);
    this.mirrorOpacity = Math.min(1, progress * 1.3);

    this.rotation = Math.sin(this.phaseFrame * 0.15) * 0.08;

    if (this.phaseFrame % 3 === 0) {
      this.createParticle(
        this.mirrorX + (Math.random() - 0.5) * 25,
        this.mirrorY + (Math.random() - 0.5) * 35,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      );
    }

    if (this.phaseFrame >= 22) {
      this.changePhase("CAPTURE");
    }
  }

  updateCapture() {
    const progress = Math.min(1, this.phaseFrame / 25);

    this.reflectionOpacity = Math.min(1, progress * 1.5);
    this.reflectionScale = 0.5 + progress * 0.5;

    this.energy = Math.sin(this.phaseFrame * 0.3) * 0.5 + 0.5;

    if (this.phaseFrame % 4 === 0) {
      this.createParticle(
        this.targetCenter.x,
        this.targetCenter.y,
        (this.mirrorX - this.targetCenter.x) * 0.04,
        (this.mirrorY - this.targetCenter.y) * 0.04
      );
    }

    if (this.phaseFrame >= 27) {
      this.createShards();
      this.changePhase("FRAGMENT");
    }
  }

  updateFragment() {
    this.mirrorOpacity = Math.max(0, 1 - this.phaseFrame / 12);

    this.shards.forEach((shard) => {
      if (!shard.returning) return;

      const dx = this.attackerCenter.x - shard.x;
      const dy = this.attackerCenter.y - shard.y;
      const distance = Math.hypot(dx, dy) || 1;

      shard.vx += (dx / distance) * 0.25;
      shard.vy += (dy / distance) * 0.25;
    });

    if (this.phaseFrame >= 18) {
      this.changePhase("RELEASE");
      this.flashOpacity = 0.8;
      this.createReleaseRings();
    }
  }

  updateRelease() {
    const progress = Math.min(1, this.phaseFrame / 20);

    this.flashOpacity = Math.max(0, 0.8 - progress * 0.8);
    this.energy = Math.max(0, 1 - progress);

    if (!this.isReleased) {
      this.isReleased = true;

      this.game.canvas?.startShake?.(3, 140);

      for (let i = 0; i < 20; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1 + Math.random() * 3;

        this.createParticle(
          this.attackerCenter.x,
          this.attackerCenter.y,
          Math.cos(angle) * speed,
          Math.sin(angle) * speed
        );
      }
    }

    if (this.phaseFrame >= 23) {
      this.changePhase("FINISH");
    }
  }

  updateFinish() {
    this.mirrorOpacity = 0;
    this.reflectionOpacity = 0;

    if (this.phaseFrame >= 8) {
      this.isFinished = true;
    }
  }

  changePhase(nextPhase) {
    this.phase = nextPhase;
    this.phaseFrame = 0;
  }

  createParticle(x, y, vx, vy) {
    this.particles.push({
      x,
      y,
      vx,
      vy,
      radius: 1 + Math.random() * 2,
      opacity: 1,
      life: 1,
      color: Math.random() > 0.5 ? "#8beaff" : "#bd83ff",
    });
  }

  createShards() {
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 * i) / 12;
      const speed = 1 + Math.random() * 2;

      this.shards.push({
        x: this.mirrorX,
        y: this.mirrorY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        angle,
        rotation: Math.random() * Math.PI,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        size: 4 + Math.random() * 6,
        opacity: 1,
        returning: true,
      });
    }
  }

  updateParticles() {
    this.particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      particle.vx *= 0.97;
      particle.vy *= 0.97;

      particle.life -= 0.025;
      particle.opacity = particle.life;
    });

    this.particles = this.particles.filter((particle) => particle.life > 0);
  }

  updateShards() {
    this.shards.forEach((shard) => {
      shard.x += shard.vx;
      shard.y += shard.vy;

      shard.vx *= 0.94;
      shard.vy *= 0.94;

      shard.rotation += shard.rotationSpeed;
      shard.opacity -= 0.018;

      if (this.phase === "RELEASE") {
        shard.opacity -= 0.06;
      }
    });

    this.shards = this.shards.filter((shard) => shard.opacity > 0);
  }

  createReleaseRings() {
    for (let i = 0; i < 4; i++) {
      this.rings.push({
        radius: 8 + i * 5,
        speed: 2 + i * 0.5,
        opacity: 0.8 - i * 0.12,
      });
    }
  }

  updateRings() {
    this.rings.forEach((ring) => {
      ring.radius += ring.speed;
      ring.opacity -= 0.035;
    });

    this.rings = this.rings.filter((ring) => ring.opacity > 0);
  }

  draw(context) {
    const ctx = context;

    ctx.save();

    this.drawObservation(ctx);
    this.drawMirror(ctx);
    this.drawReflection(ctx);
    this.drawShards(ctx);
    this.drawRings(ctx);
    this.drawParticles(ctx);
    this.drawFlash(ctx);

    ctx.restore();
  }

  drawObservation(ctx) {
    if (this.phase !== "OBSERVE") return;

    const radius = 12 + Math.sin(this.frame * 0.2) * 3;

    ctx.save();

    ctx.strokeStyle = "#9bdbff";
    ctx.lineWidth = 2;
    ctx.shadowColor = "#62caff";
    ctx.shadowBlur = 12;
    ctx.globalAlpha = this.energy;

    ctx.beginPath();
    ctx.arc(
      this.attackerCenter.x,
      this.attackerCenter.y - 22,
      radius,
      0,
      Math.PI * 2
    );
    ctx.stroke();

    // Petits traits symbolisant la mémorisation.
    for (let i = 0; i < 4; i++) {
      const angle = (Math.PI * 2 * i) / 4 + this.frame * 0.04;

      ctx.beginPath();
      ctx.moveTo(
        this.attackerCenter.x + Math.cos(angle) * radius,
        this.attackerCenter.y - 22 + Math.sin(angle) * radius
      );
      ctx.lineTo(
        this.attackerCenter.x + Math.cos(angle) * (radius + 5),
        this.attackerCenter.y - 22 + Math.sin(angle) * (radius + 5)
      );
      ctx.stroke();
    }

    ctx.restore();
  }

  drawMirror(ctx) {
    if (this.mirrorOpacity <= 0) return;

    ctx.save();

    ctx.translate(this.mirrorX, this.mirrorY);
    ctx.rotate(this.rotation);

    const width = this.mirrorWidth * this.mirrorScale;
    const height = this.mirrorHeight * this.mirrorScale;

    ctx.globalAlpha = this.mirrorOpacity;

    // Halo du miroir.
    ctx.shadowColor = "#62caff";
    ctx.shadowBlur = 15;

    const gradient = ctx.createLinearGradient(-width, -height, width, height);

    gradient.addColorStop(0, "#172d69");
    gradient.addColorStop(0.45, "#65d9ff");
    gradient.addColorStop(0.7, "#c6a8ff");
    gradient.addColorStop(1, "#33206d");

    // Forme ovale du miroir.
    ctx.fillStyle = gradient;
    ctx.strokeStyle = "#d3f5ff";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.ellipse(0, 0, width, height, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Reflets ondulants.
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "rgba(255,255,255,0.8)";
    ctx.lineWidth = 1.5;

    for (let i = 0; i < 3; i++) {
      const offset = Math.sin(this.frame * 0.12 + i) * 3;

      ctx.beginPath();
      ctx.ellipse(
        offset,
        0,
        width * (0.35 + i * 0.15),
        height * (0.25 + i * 0.18),
        0,
        0,
        Math.PI * 2
      );
      ctx.stroke();
    }

    ctx.restore();
  }

  drawReflection(ctx) {
    if (this.reflectionOpacity <= 0) return;

    ctx.save();

    ctx.globalAlpha = this.reflectionOpacity;

    const scale = this.reflectionScale;

    // Silhouette stylisée de l'adversaire dans le miroir.
    ctx.translate(this.mirrorX, this.mirrorY);
    ctx.scale(scale * 0.45, scale * 0.45);

    ctx.fillStyle = "#e4f5ff";
    ctx.shadowColor = "#82dfff";
    ctx.shadowBlur = 10;

    ctx.beginPath();
    ctx.ellipse(0, -9, 7, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(-7, 0);
    ctx.lineTo(7, 0);
    ctx.lineTo(10, 17);
    ctx.lineTo(-10, 17);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  drawShards(ctx) {
    ctx.save();

    this.shards.forEach((shard) => {
      ctx.save();

      ctx.translate(shard.x, shard.y);
      ctx.rotate(shard.rotation);

      ctx.globalAlpha = shard.opacity;
      ctx.fillStyle = "#9eeaff";
      ctx.strokeStyle = "#e2f9ff";
      ctx.lineWidth = 1;

      ctx.shadowColor = "#54caff";
      ctx.shadowBlur = 8;

      ctx.beginPath();
      ctx.moveTo(0, -shard.size);
      ctx.lineTo(shard.size * 0.6, 0);
      ctx.lineTo(0, shard.size);
      ctx.lineTo(-shard.size * 0.6, 0);
      ctx.closePath();

      ctx.fill();
      ctx.stroke();

      ctx.restore();
    });

    ctx.restore();
  }

  drawRings(ctx) {
    ctx.save();

    this.rings.forEach((ring) => {
      ctx.globalAlpha = ring.opacity;
      ctx.strokeStyle = "#9deaff";
      ctx.lineWidth = 2;
      ctx.shadowColor = "#5ecbff";
      ctx.shadowBlur = 9;

      ctx.beginPath();
      ctx.ellipse(
        this.attackerCenter.x,
        this.attackerCenter.y,
        ring.radius,
        ring.radius * 0.6,
        0,
        0,
        Math.PI * 2
      );
      ctx.stroke();
    });

    ctx.restore();
  }

  drawParticles(ctx) {
    ctx.save();

    this.particles.forEach((particle) => {
      ctx.globalAlpha = particle.opacity;
      ctx.fillStyle = particle.color;
      ctx.shadowColor = particle.color;
      ctx.shadowBlur = 7;

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  }

  drawFlash(ctx) {
    if (this.flashOpacity <= 0) return;

    ctx.save();

    ctx.globalAlpha = this.flashOpacity;
    ctx.fillStyle = "#a9eaff";

    const radius = 20 + this.phaseFrame * 1.5;

    const gradient = ctx.createRadialGradient(
      this.attackerCenter.x,
      this.attackerCenter.y,
      1,
      this.attackerCenter.x,
      this.attackerCenter.y,
      radius
    );

    gradient.addColorStop(0, "rgba(255,255,255,0.9)");
    gradient.addColorStop(0.4, "rgba(110,210,255,0.5)");
    gradient.addColorStop(1, "rgba(80,130,255,0)");

    ctx.fillStyle = gradient;

    ctx.beginPath();
    ctx.arc(
      this.attackerCenter.x,
      this.attackerCenter.y,
      radius,
      0,
      Math.PI * 2
    );
    ctx.fill();

    ctx.restore();
  }
}
