export class BlizzardAnimation {
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

    this.snowflakes = [];
    this.iceShards = [];
    this.windParticles = [];
    this.impactParticles = [];

    this.originX =
      this.pokemonViewer.sprite.position.x +
      this.pokemonViewer.sprite.frameWidth / 2;

    this.originY =
      this.pokemonViewer.sprite.position.y +
      this.pokemonViewer.sprite.frameHeight / 2;

    this.targetX =
      this.targetViewer.sprite.position.x +
      this.targetViewer.sprite.frameWidth / 2;

    this.targetY =
      this.targetViewer.sprite.position.y +
      this.targetViewer.sprite.frameHeight / 2;

    this.dx = this.targetX - this.originX;
    this.dy = this.targetY - this.originY;

    this.distance = Math.sqrt(this.dx ** 2 + this.dy ** 2);

    this.directionX = this.dx / this.distance;
    this.directionY = this.dy / this.distance;

    this.perpendicularX = -this.directionY;
    this.perpendicularY = this.directionX;

    this.beamProgress = 0;
    this.beamWidth = 0;

    this.snowIntensity = 0;
    this.windOffset = 0;
    this.flashOpacity = 0;

    this.createInitialSnow();
  }

  update(context) {
    if (this.isFinished) return;

    switch (this.state) {
      case "PREPARE":
        this.updatePrepare();
        break;

      case "BLIZZARD":
        this.updateBlizzard();
        break;

      case "IMPACT":
        this.updateImpact();
        break;

      case "FINISH":
        this.updateFinish();
        break;
    }

    this.updateSnowflakes();
    this.updateIceShards();
    this.updateWindParticles();
    this.updateImpactParticles();

    this.draw(context);
    this.timer++;
  }

  setState(state) {
    this.state = state;
    this.timer = 0;
  }

  createInitialSnow() {
    for (let i = 0; i < 35; i++) {
      this.snowflakes.push({
        x: this.originX + (Math.random() - 0.5) * 45,
        y: this.originY + (Math.random() - 0.5) * 45,
        radius: 1 + Math.random() * 2.5,
        speed: 0.5 + Math.random(),
        phase: Math.random() * Math.PI * 2,
        alpha: 0.4 + Math.random() * 0.6,
      });
    }
  }

  updatePrepare() {
    this.snowIntensity = Math.min(1, this.timer / 22);
    this.windOffset += 0.12;

    if (this.timer % 3 === 0) {
      this.createSnowBurst(this.originX, this.originY, 3);
    }

    if (this.timer >= 24) {
      this.setState("BLIZZARD");
      this.game.canvas.startShake(45, 3);
    }
  }

  updateBlizzard() {
    this.snowIntensity = 1;
    this.windOffset += 0.35;

    this.beamProgress = Math.min(this.distance, this.beamProgress + 7);

    this.beamWidth = Math.min(48, this.beamWidth + 3);

    // Tempête de neige continue.
    for (let i = 0; i < 5; i++) {
      this.createStormParticle();
    }

    // Éclats de glace mélangés à la neige.
    if (this.timer % 5 === 0) {
      this.createIceShard();
    }

    if (this.timer % 3 === 0) {
      this.createWindBurst();
    }

    if (this.beamProgress >= this.distance && this.timer >= 45) {
      this.setState("IMPACT");
      this.game.canvas.startShake(35, 5);
    }
  }

  updateImpact() {
    if (this.timer === 1) {
      this.createImpactExplosion();
      this.flashOpacity = 0.65;
    }

    this.flashOpacity = Math.max(0, this.flashOpacity - 0.055);

    if (this.timer % 4 === 0) {
      this.createSnowBurst(this.targetX, this.targetY, 8);
    }

    if (this.timer >= 30) {
      this.setState("FINISH");
    }
  }

  updateFinish() {
    this.snowIntensity = Math.max(0, this.snowIntensity - 0.025);
    this.beamWidth *= 0.94;
    this.flashOpacity = Math.max(0, this.flashOpacity - 0.08);

    if (this.timer >= 60) {
      this.isFinished = true;
    }
  }

  createStormParticle() {
    const progress = Math.random() * Math.max(1, this.beamProgress);
    const spread = (Math.random() - 0.5) * this.beamWidth * 2;

    const x =
      this.originX + this.directionX * progress + this.perpendicularX * spread;

    const y =
      this.originY + this.directionY * progress + this.perpendicularY * spread;

    this.snowflakes.push({
      x,
      y,
      radius: 1.5 + Math.random() * 3.5,
      vx:
        this.directionX * (3 + Math.random() * 4) +
        this.perpendicularX * (Math.random() - 0.5) * 3,
      vy:
        this.directionY * (3 + Math.random() * 4) +
        this.perpendicularY * (Math.random() - 0.5) * 3,
      speed: 1 + Math.random() * 2,
      phase: Math.random() * Math.PI * 2,
      alpha: 0.5 + Math.random() * 0.5,
      life: 35 + Math.random() * 30,
      storm: true,
    });
  }

  createSnowBurst(x, y, count) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 3;

      this.snowflakes.push({
        x,
        y,
        radius: 1 + Math.random() * 3,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        speed,
        phase: Math.random() * Math.PI * 2,
        alpha: 0.8,
        life: 30 + Math.random() * 20,
        storm: true,
      });
    }
  }

  createIceShard() {
    const progress = Math.random() * Math.max(1, this.beamProgress);
    const spread = (Math.random() - 0.5) * this.beamWidth;

    const x =
      this.originX + this.directionX * progress + this.perpendicularX * spread;

    const y =
      this.originY + this.directionY * progress + this.perpendicularY * spread;

    this.iceShards.push({
      x,
      y,
      vx: this.directionX * (4 + Math.random() * 4),
      vy: this.directionY * (4 + Math.random() * 4),
      length: 5 + Math.random() * 9,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.2,
      life: 30 + Math.random() * 20,
    });
  }

  createWindBurst() {
    for (let i = 0; i < 3; i++) {
      const spread = (Math.random() - 0.5) * this.beamWidth * 2;
      const progress = Math.random() * this.beamProgress;

      this.windParticles.push({
        x:
          this.originX +
          this.directionX * progress +
          this.perpendicularX * spread,
        y:
          this.originY +
          this.directionY * progress +
          this.perpendicularY * spread,
        vx: this.directionX * (5 + Math.random() * 3),
        vy: this.directionY * (5 + Math.random() * 3),
        length: 8 + Math.random() * 15,
        life: 12 + Math.random() * 10,
      });
    }
  }

  createImpactExplosion() {
    for (let i = 0; i < 45; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 5;

      this.impactParticles.push({
        x: this.targetX,
        y: this.targetY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 2 + Math.random() * 4,
        life: 25 + Math.random() * 20,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
      });
    }

    // Cristaux qui éclatent autour de la cible.
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8;

      this.iceShards.push({
        x: this.targetX,
        y: this.targetY,
        vx: Math.cos(angle) * (2 + Math.random() * 3),
        vy: Math.sin(angle) * (2 + Math.random() * 3),
        length: 9 + Math.random() * 8,
        rotation: angle,
        rotationSpeed: 0.08,
        life: 35,
      });
    }
  }

  updateSnowflakes() {
    this.snowflakes.forEach((snow) => {
      if (snow.vx !== undefined) {
        snow.x += snow.vx;
        snow.y += snow.vy;

        snow.vx *= 0.98;
        snow.vy *= 0.98;
      } else {
        snow.x += Math.sin(snow.phase) * snow.speed;
        snow.y -= snow.speed * 0.5;
      }

      snow.phase += 0.1;

      if (snow.life !== undefined) {
        snow.life--;
      }
    });

    this.snowflakes = this.snowflakes.filter(
      (snow) => snow.life === undefined || snow.life > 0
    );
  }

  updateIceShards() {
    this.iceShards.forEach((shard) => {
      shard.x += shard.vx;
      shard.y += shard.vy;

      shard.vx *= 0.96;
      shard.vy *= 0.96;

      shard.rotation += shard.rotationSpeed;
      shard.life--;
    });

    this.iceShards = this.iceShards.filter((shard) => shard.life > 0);
  }

  updateWindParticles() {
    this.windParticles.forEach((wind) => {
      wind.x += wind.vx;
      wind.y += wind.vy;
      wind.life--;
    });

    this.windParticles = this.windParticles.filter((wind) => wind.life > 0);
  }

  updateImpactParticles() {
    this.impactParticles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      particle.vx *= 0.94;
      particle.vy *= 0.94;

      particle.radius *= 0.97;
      particle.rotation += particle.rotationSpeed;
      particle.life--;
    });

    this.impactParticles = this.impactParticles.filter(
      (particle) => particle.life > 0
    );
  }

  draw(context) {
    this.drawBlizzardAura(context);
    this.drawWind(context);
    this.drawSnowflakes(context);
    this.drawIceShards(context);
    this.drawImpactParticles(context);
    this.drawFlash(context);
  }

  drawBlizzardAura(context) {
    if (this.state !== "BLIZZARD") return;

    const endX = this.originX + this.directionX * this.beamProgress;

    const endY = this.originY + this.directionY * this.beamProgress;

    context.save();
    context.globalCompositeOperation = "lighter";

    // Halo froid et diffus.
    const gradient = context.createLinearGradient(
      this.originX,
      this.originY,
      endX,
      endY
    );

    gradient.addColorStop(0, "rgba(110,210,255,0.05)");
    gradient.addColorStop(0.5, "rgba(140,225,255,0.25)");
    gradient.addColorStop(1, "rgba(220,250,255,0.45)");

    context.strokeStyle = gradient;
    context.lineWidth = this.beamWidth * 2;
    context.lineCap = "round";

    context.beginPath();
    context.moveTo(this.originX, this.originY);
    context.lineTo(endX, endY);
    context.stroke();

    // Courants d'air glacé.
    context.strokeStyle = "rgba(210,245,255,0.45)";
    context.lineWidth = 3;

    for (let i = 0; i < 4; i++) {
      const offset = Math.sin(this.windOffset + i) * 8;

      context.beginPath();
      context.moveTo(
        this.originX + this.perpendicularX * offset,
        this.originY + this.perpendicularY * offset
      );

      context.lineTo(
        endX + this.perpendicularX * offset,
        endY + this.perpendicularY * offset
      );

      context.stroke();
    }

    context.restore();
  }

  drawWind(context) {
    context.save();
    context.globalCompositeOperation = "lighter";

    this.windParticles.forEach((wind) => {
      context.globalAlpha = Math.min(1, wind.life / 10);
      context.strokeStyle = "#c8f3ff";
      context.lineWidth = 1.5;

      context.beginPath();
      context.moveTo(wind.x, wind.y);
      context.lineTo(wind.x - wind.vx * 2, wind.y - wind.vy * 2);
      context.stroke();
    });

    context.restore();
  }

  drawSnowflakes(context) {
    context.save();
    context.globalCompositeOperation = "lighter";

    this.snowflakes.forEach((snow) => {
      const alpha =
        snow.life !== undefined ? Math.min(1, snow.life / 15) : snow.alpha;

      context.globalAlpha = alpha;
      context.fillStyle = "#e8faff";

      context.beginPath();
      context.arc(snow.x, snow.y, snow.radius, 0, Math.PI * 2);
      context.fill();

      // Petits reflets cristallins.
      if (snow.radius > 2.5) {
        context.strokeStyle = "rgba(255,255,255,0.8)";
        context.lineWidth = 0.7;

        context.beginPath();
        context.moveTo(snow.x - snow.radius * 1.5, snow.y);
        context.lineTo(snow.x + snow.radius * 1.5, snow.y);
        context.moveTo(snow.x, snow.y - snow.radius * 1.5);
        context.lineTo(snow.x, snow.y + snow.radius * 1.5);
        context.stroke();
      }
    });

    context.restore();
  }

  drawIceShards(context) {
    context.save();
    context.globalCompositeOperation = "lighter";

    this.iceShards.forEach((shard) => {
      context.save();

      context.translate(shard.x, shard.y);
      context.rotate(shard.rotation);
      context.globalAlpha = Math.min(1, shard.life / 12);

      const gradient = context.createLinearGradient(
        0,
        -shard.length,
        0,
        shard.length
      );

      gradient.addColorStop(0, "#ffffff");
      gradient.addColorStop(0.5, "#8be6ff");
      gradient.addColorStop(1, "#299bd6");

      context.fillStyle = gradient;
      context.strokeStyle = "rgba(235,255,255,0.9)";
      context.lineWidth = 0.8;

      context.beginPath();
      context.moveTo(0, -shard.length);
      context.lineTo(shard.length * 0.4, 0);
      context.lineTo(0, shard.length);
      context.lineTo(-shard.length * 0.4, 0);
      context.closePath();

      context.fill();
      context.stroke();

      context.restore();
    });

    context.restore();
  }

  drawImpactParticles(context) {
    context.save();
    context.globalCompositeOperation = "lighter";

    this.impactParticles.forEach((particle) => {
      context.save();

      context.translate(particle.x, particle.y);
      context.rotate(particle.rotation);
      context.globalAlpha = Math.min(1, particle.life / 12);

      context.fillStyle = "#b8f0ff";
      context.strokeStyle = "#ffffff";
      context.lineWidth = 1;

      context.beginPath();
      context.moveTo(0, -particle.radius * 2);
      context.lineTo(particle.radius, 0);
      context.lineTo(0, particle.radius * 2);
      context.lineTo(-particle.radius, 0);
      context.closePath();

      context.fill();
      context.stroke();

      context.restore();
    });

    context.restore();
  }

  drawFlash(context) {
    if (this.flashOpacity <= 0) return;

    context.save();
    context.globalAlpha = this.flashOpacity;
    context.fillStyle = "#e4faff";
    context.fillRect(0, 0, 320, 274);
    context.restore();
  }
}
