export class DreamEaterAnimation {
  constructor(game, viewers, turnAction) {
    this.game = game;
    this.turnAction = turnAction;

    this.battleBackgroundEffectManager =
      this.game.battleManager.battleRenderer.battleBackgroundEffectManager;

    if (viewers.front.slot.content === turnAction.pokemon) {
      this.pokemonViewer = viewers.front;
      this.targetViewer = viewers.back;
    } else {
      this.pokemonViewer = viewers.back;
      this.targetViewer = viewers.front;
    }

    this.attacker = this.pokemonViewer.sprite;
    this.target = this.targetViewer.sprite;

    this.attackerCenter = {
      x: this.attacker.position.x + this.attacker.frameWidth / 2,
      y: this.attacker.position.y + this.attacker.frameHeight / 2,
    };

    this.targetCenter = {
      x: this.target.position.x + this.target.frameWidth / 2,
      y: this.target.position.y + this.target.frameHeight / 2,
    };

    const dx = this.attackerCenter.x - this.targetCenter.x;
    const dy = this.attackerCenter.y - this.targetCenter.y;

    this.distance = Math.hypot(dx, dy);
    this.directionX = dx / this.distance;
    this.directionY = dy / this.distance;

    this.duration = {
      NIGHTMARE: 56,
      DRAIN: 48,
      ABSORB: 60,
      CONSUME: 44,
      FINISH: 50,
    };

    this.phase = "NIGHTMARE";
    this.frame = 0;
    this.isFinished = false;

    this.nightmareAura = 0;
    this.absorption = 0;
    this.flash = 0;
    this.orbRadius = 0;
    this.orbOpacity = 0;
    this.rotation = 0;

    this.ribbons = [];
    this.dreamParticles = [];
    this.targetParticles = [];
    this.attackerParticles = [];
    this.orbitParticles = [];
    this.rings = [];
    this.stars = [];
    this.zSymbols = [];

    this.battleBackgroundEffectManager.startColorChange("BLACK", 0.5);

    this.battleBackgroundEffectManager.startWave({
      amplitude: 25,
      frequency: 0.01,
      speed: 0.04,
    });

    this.createNightmareParticles();
  }

  changePhase(phase) {
    this.phase = phase;
    this.frame = 0;
  }

  update(context) {
    if (this.isFinished) return;

    switch (this.phase) {
      case "NIGHTMARE":
        this.updateNightmare();
        break;

      case "DRAIN":
        this.updateDrain();
        break;

      case "ABSORB":
        this.updateAbsorb();
        break;

      case "CONSUME":
        this.updateConsume();
        break;

      case "FINISH":
        this.updateFinish();
        this.battleBackgroundEffectManager.stopColorChange();
        this.battleBackgroundEffectManager.stopWave();
        break;
    }

    this.updateRibbons();
    this.updateDreamParticles();
    this.updateTargetParticles();
    this.updateAttackerParticles();
    this.updateOrbitParticles();
    this.updateRings();
    this.updateStars();
    this.updateZSymbols();

    this.draw(context);
    this.frame++;
  }

  randomColor() {
    const colors = ["#c084fc", "#a855f7", "#f472b6", "#e879f9", "#818cf8"];

    return colors[Math.floor(Math.random() * colors.length)];
  }

  createNightmareParticles() {
    for (let i = 0; i < 22; i++) {
      const angle = Math.random() * Math.PI * 2;

      this.dreamParticles.push({
        angle,
        radius: 13 + Math.random() * 22,
        speed: 0.025 + Math.random() * 0.025,
        size: 1 + Math.random() * 2,
        alpha: 0.5 + Math.random() * 0.5,
        color: this.randomColor(),
      });
    }

    for (let i = 0; i < 5; i++) {
      this.zSymbols.push({
        x: this.targetCenter.x + (Math.random() - 0.5) * 28,
        y: this.targetCenter.y - 12 - Math.random() * 20,
        size: 7 + Math.random() * 5,
        alpha: 0.7 + Math.random() * 0.3,
        life: 35 + Math.random() * 20,
        drift: 0.3 + Math.random() * 0.5,
      });
    }
  }

  createRibbon(index, count) {
    const spread = (index - (count - 1) / 2) * 7;

    this.ribbons.push({
      index,
      progress: 0,
      speed: 0.012 + Math.random() * 0.005,
      amplitude: 5 + Math.random() * 5,
      frequency: 2.5 + Math.random() * 1.5,
      phase: Math.random() * Math.PI * 2,
      spread,
      width: 2.5 + Math.random() * 2,
      alpha: 0,
      color: this.randomColor(),
      finished: false,
    });
  }

  createTargetParticles(count, power = 2) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.5 + Math.random() * power;

      this.targetParticles.push({
        x: this.targetCenter.x,
        y: this.targetCenter.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 1 + Math.random() * 2.5,
        alpha: 1,
        life: 18 + Math.random() * 18,
        color: this.randomColor(),
      });
    }
  }

  createAttackerParticles(count, power = 2) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.5 + Math.random() * power;

      this.attackerParticles.push({
        x: this.attackerCenter.x,
        y: this.attackerCenter.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 1 + Math.random() * 2.5,
        alpha: 1,
        life: 20 + Math.random() * 20,
        color: this.randomColor(),
      });
    }
  }

  createOrbitParticles(count) {
    for (let i = 0; i < count; i++) {
      this.orbitParticles.push({
        angle: Math.random() * Math.PI * 2,
        radius: this.orbRadius + Math.random() * 5,
        speed: 0.08 + Math.random() * 0.06,
        size: 1.5 + Math.random() * 2,
        alpha: 1,
        color: this.randomColor(),
      });
    }
  }

  createRing(x, y, color = "#c084fc", speed = 0.08) {
    this.rings.push({
      x,
      y,
      radius: 5,
      speed,
      alpha: 0.9,
      color,
    });
  }

  createStars(count, x, y) {
    for (let i = 0; i < count; i++) {
      this.stars.push({
        x,
        y,
        angle: Math.random() * Math.PI * 2,
        radius: 3 + Math.random() * 8,
        speed: 1 + Math.random() * 2,
        size: 2 + Math.random() * 3,
        alpha: 1,
        rotation: Math.random() * Math.PI,
      });
    }
  }

  updateNightmare() {
    const progress = this.frame / this.duration.NIGHTMARE;

    this.nightmareAura = progress;
    this.rotation += 0.045;

    this.dreamParticles.forEach((particle) => {
      particle.angle += particle.speed;
    });

    if (this.frame % 8 === 0) {
      this.createRing(
        this.targetCenter.x,
        this.targetCenter.y,
        this.randomColor(),
        0.045
      );
    }

    if (this.frame >= this.duration.NIGHTMARE) {
      for (let i = 0; i < 5; i++) {
        this.createRibbon(i, 5);
      }

      this.changePhase("DRAIN");
    }
  }

  updateDrain() {
    const progress = this.frame / this.duration.DRAIN;

    this.nightmareAura = 1;
    this.absorption = progress;

    this.ribbons.forEach((ribbon) => {
      ribbon.alpha = Math.min(1, ribbon.alpha + 0.12);
      ribbon.progress = Math.min(1, ribbon.progress + ribbon.speed);

      if (ribbon.progress > 0.15 && Math.random() < 0.45) {
        const point = this.getRibbonPoint(ribbon, ribbon.progress);

        this.dreamParticles.push({
          angle: Math.atan2(
            point.y - this.attackerCenter.y,
            point.x - this.attackerCenter.x
          ),
          radius: Math.hypot(
            point.x - this.attackerCenter.x,
            point.y - this.attackerCenter.y
          ),
          speed: 0,
          size: 1.5 + Math.random() * 2,
          alpha: 0.9,
          color: ribbon.color,
        });
      }

      if (ribbon.progress >= 1) {
        ribbon.finished = true;
      }
    });

    if (this.frame % 5 === 0) {
      this.createTargetParticles(3, 1.5);
      this.createRing(
        this.targetCenter.x,
        this.targetCenter.y,
        this.randomColor(),
        0.055
      );
    }

    if (this.frame % 8 === 0) {
      this.createOrbitParticles(2);
    }

    if (this.frame >= this.duration.DRAIN) {
      this.createAttackerParticles(18, 3);
      this.flash = 0.5;
      this.changePhase("ABSORB");
    }
  }

  getRibbonPoint(ribbon, progress) {
    const t = Math.max(0, Math.min(1, progress));

    const startX = this.targetCenter.x;
    const startY = this.targetCenter.y;

    const endX = this.attackerCenter.x;
    const endY = this.attackerCenter.y;

    const baseX = startX + (endX - startX) * t;
    const baseY = startY + (endY - startY) * t;

    const wave =
      Math.sin(
        t * Math.PI * ribbon.frequency + ribbon.phase + this.frame * 0.035
      ) *
      ribbon.amplitude *
      Math.sin(t * Math.PI);

    return {
      x:
        baseX -
        this.directionY * (wave + ribbon.spread * Math.sin(t * Math.PI)),
      y:
        baseY +
        this.directionX * (wave + ribbon.spread * Math.sin(t * Math.PI)),
    };
  }

  updateAbsorb() {
    const progress = this.frame / this.duration.ABSORB;
    const ease = progress * progress * (3 - 2 * progress);

    this.nightmareAura = 1 - ease * 0.3;
    this.orbRadius = 3 + ease * 10;
    this.orbOpacity = 0.4 + ease * 0.6;

    this.rotation += 0.12;

    this.ribbons.forEach((ribbon) => {
      ribbon.progress = Math.min(1, ribbon.progress + 0.025);
      ribbon.alpha *= 0.95;
    });

    if (this.frame % 4 === 0) {
      this.createOrbitParticles(3);
      this.createRing(
        this.attackerCenter.x,
        this.attackerCenter.y,
        this.randomColor(),
        0.07
      );
    }

    if (this.frame % 6 === 0) {
      this.createAttackerParticles(3, 2);
    }

    if (this.frame >= this.duration.ABSORB) {
      this.flash = 1;
      this.createStars(12, this.attackerCenter.x, this.attackerCenter.y);
      this.createAttackerParticles(28, 3.5);
      this.game.canvas.startShake?.(5, 180);

      this.changePhase("CONSUME");
    }
  }

  updateConsume() {
    const progress = this.frame / this.duration.CONSUME;

    this.orbOpacity = 1 - progress;
    this.orbRadius = 13 * (1 - progress * 0.5);
    this.flash *= 0.82;

    this.orbitParticles.forEach((particle) => {
      particle.radius *= 0.94;
      particle.alpha *= 0.94;
    });

    if (this.frame % 4 === 0) {
      this.createRing(
        this.attackerCenter.x,
        this.attackerCenter.y,
        this.randomColor(),
        0.1
      );
      this.createStars(2, this.attackerCenter.x, this.attackerCenter.y);
    }

    if (this.frame >= this.duration.CONSUME) {
      this.changePhase("FINISH");
    }
  }

  updateFinish() {
    this.nightmareAura *= 0.91;

    this.dreamParticles.forEach((particle) => {
      particle.alpha *= 0.92;
      particle.radius += 0.2;
    });

    if (this.frame >= this.duration.FINISH) {
      this.isFinished = true;
    }
  }

  updateRibbons() {
    this.ribbons = this.ribbons.filter((ribbon) => {
      if (ribbon.finished && ribbon.alpha <= 0.02) return false;
      if (this.phase === "ABSORB" || this.phase === "CONSUME") {
        ribbon.alpha *= 0.9;
      }
      return true;
    });
  }

  updateDreamParticles() {
    this.dreamParticles = this.dreamParticles.filter((particle) => {
      if (particle.speed > 0) {
        particle.angle += particle.speed;
      }

      if (this.phase === "FINISH") {
        particle.alpha *= 0.92;
      }

      return particle.alpha > 0.03;
    });
  }

  updateTargetParticles() {
    this.targetParticles = this.targetParticles.filter((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vx *= 0.96;
      particle.vy *= 0.96;
      particle.alpha -= 1 / particle.life;
      particle.life--;

      return particle.life > 0 && particle.alpha > 0;
    });
  }

  updateAttackerParticles() {
    this.attackerParticles = this.attackerParticles.filter((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vx *= 0.95;
      particle.vy *= 0.95;
      particle.alpha -= 1 / particle.life;
      particle.life--;

      return particle.life > 0 && particle.alpha > 0;
    });
  }

  updateOrbitParticles() {
    this.orbitParticles = this.orbitParticles.filter((particle) => {
      particle.angle += particle.speed;
      particle.radius += 0.015;
      particle.alpha -= 0.025;

      return particle.alpha > 0;
    });
  }

  updateRings() {
    this.rings = this.rings.filter((ring) => {
      ring.radius += ring.speed * 3;
      ring.alpha -= 0.035;

      return ring.alpha > 0;
    });
  }

  updateStars() {
    this.stars = this.stars.filter((star) => {
      star.angle += 0.04;
      star.radius += star.speed;
      star.alpha -= 0.045;
      star.rotation += 0.1;

      return star.alpha > 0;
    });
  }

  updateZSymbols() {
    this.zSymbols = this.zSymbols.filter((symbol) => {
      symbol.y -= symbol.drift;
      symbol.x += Math.sin(this.frame * 0.08 + symbol.x) * 0.15;
      symbol.alpha -= 0.018;
      symbol.life--;

      return symbol.life > 0 && symbol.alpha > 0;
    });
  }

  draw(context) {
    this.drawNightmareAura(context);
    this.drawRibbons(context);
    this.drawDreamParticles(context);
    this.drawTargetParticles(context);
    this.drawOrb(context);
    this.drawOrbitParticles(context);
    this.drawAttackerParticles(context);
    this.drawRings(context);
    this.drawStars(context);
    this.drawZSymbols(context);
    this.drawFlash(context);
  }

  drawNightmareAura(context) {
    if (this.nightmareAura <= 0.01) return;

    const pulse = 1 + Math.sin(this.frame * 0.12) * 0.06;
    const radius = 25 * pulse;

    context.save();
    context.translate(this.targetCenter.x, this.targetCenter.y);

    const gradient = context.createRadialGradient(0, 0, 2, 0, 0, radius);

    gradient.addColorStop(
      0,
      `rgba(168, 85, 247, ${0.28 * this.nightmareAura})`
    );
    gradient.addColorStop(
      0.55,
      `rgba(112, 45, 170, ${0.18 * this.nightmareAura})`
    );
    gradient.addColorStop(1, "rgba(112, 45, 170, 0)");

    context.fillStyle = gradient;

    context.beginPath();
    context.ellipse(0, 0, radius * 0.85, radius * 1.35, 0, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }

  drawRibbons(context) {
    this.ribbons.forEach((ribbon) => {
      if (ribbon.alpha <= 0.02) return;

      context.save();
      context.lineCap = "round";
      context.lineJoin = "round";

      // Lueur extérieure.
      context.beginPath();

      for (let i = 0; i <= 30; i++) {
        const t = i / 30;
        if (t > ribbon.progress) break;

        const point = this.getRibbonPoint(ribbon, t);

        if (i === 0) context.moveTo(point.x, point.y);
        else context.lineTo(point.x, point.y);
      }

      context.globalAlpha = ribbon.alpha * 0.35;
      context.strokeStyle = ribbon.color;
      context.lineWidth = ribbon.width * 3;
      context.shadowColor = ribbon.color;
      context.shadowBlur = 12;
      context.stroke();

      // Corps du ruban.
      context.beginPath();

      for (let i = 0; i <= 30; i++) {
        const t = i / 30;
        if (t > ribbon.progress) break;

        const point = this.getRibbonPoint(ribbon, t);

        if (i === 0) context.moveTo(point.x, point.y);
        else context.lineTo(point.x, point.y);
      }

      context.globalAlpha = ribbon.alpha;
      context.strokeStyle = ribbon.color;
      context.lineWidth = ribbon.width;
      context.shadowBlur = 5;
      context.stroke();

      // Reflet lumineux central.
      context.globalAlpha = ribbon.alpha * 0.8;
      context.strokeStyle = "#ffffff";
      context.lineWidth = 0.8;
      context.shadowBlur = 4;
      context.stroke();

      context.restore();
    });
  }

  drawDreamParticles(context) {
    this.dreamParticles.forEach((particle) => {
      const x =
        this.targetCenter.x + Math.cos(particle.angle) * particle.radius;
      const y =
        this.targetCenter.y + Math.sin(particle.angle) * particle.radius;

      context.save();
      context.globalAlpha = particle.alpha * this.nightmareAura;
      context.fillStyle = particle.color;
      context.shadowColor = particle.color;
      context.shadowBlur = 7;

      context.beginPath();
      context.arc(x, y, particle.size, 0, Math.PI * 2);
      context.fill();

      context.restore();
    });
  }

  drawTargetParticles(context) {
    this.targetParticles.forEach((particle) => {
      context.save();
      context.globalAlpha = Math.max(0, particle.alpha);
      context.fillStyle = particle.color;
      context.shadowColor = particle.color;
      context.shadowBlur = 7;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fill();

      context.restore();
    });
  }

  drawOrb(context) {
    if (this.orbOpacity <= 0.01) return;

    context.save();
    context.translate(this.attackerCenter.x, this.attackerCenter.y);
    context.rotate(this.rotation);

    const radius = Math.max(1, this.orbRadius);

    const gradient = context.createRadialGradient(0, 0, 1, 0, 0, radius * 2);

    gradient.addColorStop(0, "#ffffff");
    gradient.addColorStop(0.3, "#fbcfe8");
    gradient.addColorStop(0.65, "#c084fc");
    gradient.addColorStop(1, "rgba(168, 85, 247, 0)");

    context.globalAlpha = this.orbOpacity;
    context.fillStyle = gradient;
    context.shadowColor = "#c084fc";
    context.shadowBlur = 14;

    context.beginPath();
    context.arc(0, 0, radius * 2, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }

  drawOrbitParticles(context) {
    this.orbitParticles.forEach((particle) => {
      const x =
        this.attackerCenter.x + Math.cos(particle.angle) * particle.radius;
      const y =
        this.attackerCenter.y + Math.sin(particle.angle) * particle.radius;

      context.save();
      context.globalAlpha = Math.max(0, particle.alpha);
      context.fillStyle = particle.color;
      context.shadowColor = particle.color;
      context.shadowBlur = 7;

      context.beginPath();
      context.arc(x, y, particle.size, 0, Math.PI * 2);
      context.fill();

      context.restore();
    });
  }

  drawAttackerParticles(context) {
    this.attackerParticles.forEach((particle) => {
      context.save();
      context.globalAlpha = Math.max(0, particle.alpha);
      context.fillStyle = particle.color;
      context.shadowColor = particle.color;
      context.shadowBlur = 8;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fill();

      context.restore();
    });
  }

  drawRings(context) {
    this.rings.forEach((ring) => {
      context.save();
      context.globalAlpha = Math.max(0, ring.alpha);
      context.strokeStyle = ring.color;
      context.lineWidth = 2;
      context.shadowColor = ring.color;
      context.shadowBlur = 8;

      context.beginPath();
      context.ellipse(
        ring.x,
        ring.y,
        ring.radius * 1.2,
        ring.radius * 0.65,
        0,
        0,
        Math.PI * 2
      );
      context.stroke();

      context.restore();
    });
  }

  drawStars(context) {
    this.stars.forEach((star) => {
      context.save();
      context.translate(star.x, star.y);
      context.rotate(star.rotation);
      context.globalAlpha = Math.max(0, star.alpha);
      context.fillStyle = "#fff1c2";
      context.shadowColor = "#e879f9";
      context.shadowBlur = 8;

      context.beginPath();

      for (let i = 0; i < 10; i++) {
        const radius = i % 2 === 0 ? star.size : star.size * 0.4;
        const angle = (Math.PI * 2 * i) / 10;

        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        if (i === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      }

      context.closePath();
      context.fill();

      context.restore();
    });
  }

  drawZSymbols(context) {
    this.zSymbols.forEach((symbol) => {
      context.save();
      context.globalAlpha = Math.max(0, symbol.alpha);
      context.fillStyle = "#c4b5fd";
      context.font = `bold ${symbol.size}px sans-serif`;
      context.textAlign = "center";
      context.shadowColor = "#a855f7";
      context.shadowBlur = 6;

      context.fillText("Z", symbol.x, symbol.y);

      context.restore();
    });
  }

  drawFlash(context) {
    if (this.flash <= 0.01) return;

    context.save();
    context.globalAlpha = Math.min(1, this.flash) * 0.55;
    context.fillStyle = "#f5d0fe";

    context.beginPath();
    context.arc(
      this.attackerCenter.x,
      this.attackerCenter.y,
      18 + this.flash * 20,
      0,
      Math.PI * 2
    );
    context.fill();

    context.restore();
  }
}
