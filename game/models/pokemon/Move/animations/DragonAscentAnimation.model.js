export class DragonAscentAnimation {
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

    this.originalPosition = {
      x: this.attacker.position.x,
      y: this.attacker.position.y,
    };

    this.attackerCenter = {
      x: this.originalPosition.x + this.attacker.frameWidth / 2,
      y: this.originalPosition.y + this.attacker.frameHeight / 2,
    };

    this.targetCenter = {
      x: this.target.position.x + this.target.frameWidth / 2,
      y: this.target.position.y + this.target.frameHeight / 2,
    };

    this.direction = this.targetCenter.x >= this.attackerCenter.x ? 1 : -1;

    this.phase = "CHARGE";
    this.timer = 0;
    this.isFinished = false;
    this.hasShaken = false;
    this.hasImpacted = false;

    this.particles = [];
    this.energyRings = [];
    this.lightning = [];
    this.shockwaves = [];

    this.flash = 0;
    this.aura = 0;
    this.rotation = 0;

    this.duration = {
      CHARGE: 32,
      ASCEND: 38,
      ORBIT: 24,
      DIVE: 20,
      IMPACT: 32,
      RETURN: 30,
    };

    this.originalCenter = {
      x: this.attackerCenter.x,
      y: this.attackerCenter.y,
    };
  }

  update(context) {
    this.timer++;

    switch (this.phase) {
      case "CHARGE":
        this.updateCharge();
        break;

      case "ASCEND":
        this.updateAscend();
        break;

      case "ORBIT":
        this.updateOrbit();
        break;

      case "DIVE":
        this.updateDive();
        break;

      case "IMPACT":
        this.updateImpact();
        break;

      case "RETURN":
        this.updateReturn();
        break;
    }

    this.updateParticles();
    this.updateRings();
    this.updateLightning();
    this.updateShockwaves();

    this.draw(context);
  }

  changePhase(phase) {
    this.phase = phase;
    this.timer = 0;
  }

  setAttackerCenter(x, y) {
    this.attacker.position.x = x - this.attacker.frameWidth / 2;
    this.attacker.position.y = y - this.attacker.frameHeight / 2;
  }

  getAttackerCenter() {
    return {
      x: this.attacker.position.x + this.attacker.frameWidth / 2,
      y: this.attacker.position.y + this.attacker.frameHeight / 2,
    };
  }

  updateCharge() {
    this.aura = Math.min(1, this.timer / 22);

    const pulse = Math.sin(this.timer * 0.55) * 5;

    this.setAttackerCenter(
      this.originalCenter.x,
      this.originalCenter.y + pulse
    );

    if (this.timer % 2 === 0) {
      this.createChargeParticles();
    }

    if (this.timer % 5 === 0) {
      this.energyRings.push({
        radius: 18,
        alpha: 1,
        speed: 4,
        width: 5,
      });
    }

    if (this.timer % 7 === 0) {
      this.createLightning();
    }

    if (this.timer >= this.duration.CHARGE) {
      this.changePhase("ASCEND");
    }
  }

  updateAscend() {
    const progress = this.timer / this.duration.ASCEND;
    const eased = 1 - Math.pow(1 - progress, 3);

    this.aura = 1;

    this.setAttackerCenter(
      this.originalCenter.x - this.direction * 25 * eased,
      this.originalCenter.y - 145 * eased
    );

    this.rotation = Math.sin(this.timer * 0.35) * 0.12;

    if (this.timer % 2 === 0) {
      this.createAscensionTrail();
    }

    if (this.timer % 4 === 0) {
      this.energyRings.push({
        radius: 20,
        alpha: 0.9,
        speed: 7,
        width: 5,
      });
    }

    if (this.timer >= this.duration.ASCEND) {
      this.changePhase("ORBIT");
    }
  }

  updateOrbit() {
    const progress = this.timer / this.duration.ORBIT;
    const angle = progress * Math.PI * 2;

    const radiusX = 42;
    const radiusY = 24;

    this.setAttackerCenter(
      this.originalCenter.x - this.direction * 25 + Math.cos(angle) * radiusX,
      this.originalCenter.y - 145 + Math.sin(angle) * radiusY
    );

    this.rotation = Math.sin(angle) * 0.2;

    if (this.timer % 2 === 0) {
      this.createChargeParticles();
    }

    if (this.timer % 3 === 0) {
      this.createLightning();
    }

    if (this.timer >= this.duration.ORBIT) {
      this.changePhase("DIVE");
    }
  }

  updateDive() {
    const progress = Math.min(this.timer / this.duration.DIVE, 1);

    const eased = progress * progress;

    const start = {
      x: this.getAttackerCenter().x,
      y: this.getAttackerCenter().y,
    };

    const end = {
      x: this.targetCenter.x - this.direction * 12,
      y: this.targetCenter.y - 10,
    };

    const x = start.x + (end.x - start.x) * eased;
    const y = start.y + (end.y - start.y) * eased;

    this.setAttackerCenter(x, y);
    this.rotation = this.direction * 0.35;

    if (this.timer % 2 === 0) {
      this.createDiveTrail();
    }

    if (this.timer >= this.duration.DIVE) {
      this.setAttackerCenter(end.x, end.y);
      this.changePhase("IMPACT");
      this.createImpact();
    }
  }

  updateImpact() {
    this.flash *= 0.86;
    this.aura *= 0.9;

    if (!this.hasShaken) {
      this.game.canvas.startShake(30, 9);
      this.hasShaken = true;
    }

    if (this.timer % 2 === 0) {
      this.createImpactDebris();
    }

    if (this.timer >= this.duration.IMPACT) {
      this.changePhase("RETURN");
    }
  }

  updateReturn() {
    const progress = Math.min(this.timer / this.duration.RETURN, 1);

    const eased = 1 - Math.pow(1 - progress, 3);

    const current = this.getAttackerCenter();

    const start = this.impactPosition || current;

    this.setAttackerCenter(
      start.x + (this.originalCenter.x - start.x) * eased,
      start.y + (this.originalCenter.y - start.y) * eased
    );

    this.rotation *= 0.85;
    this.aura *= 0.9;

    if (this.timer >= this.duration.RETURN) {
      this.restoreAttacker();
      this.isFinished = true;
    }
  }

  createChargeParticles() {
    const angle = Math.random() * Math.PI * 2;
    const radius = 30 + Math.random() * 45;

    const center = this.getAttackerCenter();

    this.particles.push({
      x: center.x + Math.cos(angle) * radius,
      y: center.y + Math.sin(angle) * radius,
      vx: -Math.cos(angle) * 2,
      vy: -Math.sin(angle) * 2,
      radius: 2 + Math.random() * 4,
      alpha: 1,
      life: 25,
      color: "#a7f5ff",
    });
  }

  createAscensionTrail() {
    const center = this.getAttackerCenter();

    for (let i = 0; i < 2; i++) {
      this.particles.push({
        x: center.x + (Math.random() - 0.5) * 45,
        y: center.y + 20,
        vx: (Math.random() - 0.5) * 3,
        vy: 3 + Math.random() * 4,
        radius: 3 + Math.random() * 4,
        alpha: 1,
        life: 25,
        color: "#75eaff",
      });
    }
  }

  createDiveTrail() {
    const center = this.getAttackerCenter();

    this.particles.push({
      x: center.x + (Math.random() - 0.5) * 55,
      y: center.y + (Math.random() - 0.5) * 55,
      vx: -this.direction * (3 + Math.random() * 4),
      vy: -2 - Math.random() * 4,
      radius: 3 + Math.random() * 5,
      alpha: 1,
      life: 22,
      color: Math.random() > 0.5 ? "#ffffff" : "#52dfff",
    });
  }

  createLightning() {
    const center = this.getAttackerCenter();

    const points = [];
    const length = 35 + Math.random() * 35;

    let x = center.x + (Math.random() - 0.5) * 70;
    let y = center.y + (Math.random() - 0.5) * 70;

    points.push({ x, y });

    for (let i = 0; i < 4; i++) {
      x += (Math.random() - 0.5) * 30;
      y += ((Math.random() - 0.5) * length) / 2;
      points.push({ x, y });
    }

    this.lightning.push({
      points,
      alpha: 1,
      width: 2 + Math.random() * 3,
    });
  }

  createImpact() {
    this.impactPosition = {
      x: this.targetCenter.x - this.direction * 12,
      y: this.targetCenter.y - 10,
    };

    this.flash = 1;
    this.aura = 1;

    for (let i = 0; i < 7; i++) {
      this.shockwaves.push({
        radius: 15 + i * 9,
        alpha: 1,
        speed: 9 + i,
        width: 8 - i * 0.7,
      });
    }

    for (let i = 0; i < 80; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 12;

      this.particles.push({
        x: this.targetCenter.x,
        y: this.targetCenter.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 2 + Math.random() * 6,
        alpha: 1,
        life: 25 + Math.random() * 20,
        color: Math.random() > 0.5 ? "#ffffff" : "#64eaff",
      });
    }
  }

  createImpactDebris() {
    const angle = Math.random() * Math.PI * 2;
    const speed = 3 + Math.random() * 8;

    this.particles.push({
      x: this.targetCenter.x + (Math.random() - 0.5) * 50,
      y: this.targetCenter.y + (Math.random() - 0.5) * 40,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: 2 + Math.random() * 5,
      alpha: 1,
      life: 20,
      color: "#baf7ff",
    });
  }

  updateParticles() {
    this.particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      particle.vx *= 0.97;
      particle.vy *= 0.97;

      particle.alpha -= 1 / particle.life;
    });

    this.particles = this.particles.filter((particle) => particle.alpha > 0);
  }

  updateRings() {
    this.energyRings.forEach((ring) => {
      ring.radius += ring.speed;
      ring.alpha -= 0.035;
    });

    this.energyRings = this.energyRings.filter((ring) => ring.alpha > 0);
  }

  updateLightning() {
    this.lightning.forEach((bolt) => {
      bolt.alpha -= 0.12;
    });

    this.lightning = this.lightning.filter((bolt) => bolt.alpha > 0);
  }

  updateShockwaves() {
    this.shockwaves.forEach((wave) => {
      wave.radius += wave.speed;
      wave.alpha -= 0.035;
    });

    this.shockwaves = this.shockwaves.filter((wave) => wave.alpha > 0);
  }

  draw(context) {
    this.drawAura(context);
    this.drawEnergyRings(context);
    this.drawLightning(context);
    this.drawAscensionTrail(context);
    this.drawDiveTrail(context);
    this.drawShockwaves(context);
    this.drawParticles(context);
    this.drawImpactFlash(context);
  }

  drawAura(context) {
    if (this.aura <= 0.02) return;

    const center = this.getAttackerCenter();
    const pulse = Math.sin(this.timer * 0.4) * 10;

    context.save();

    context.globalAlpha = this.aura * 0.65;
    context.strokeStyle = "#8df3ff";
    context.lineWidth = 8;
    context.shadowColor = "#28cfff";
    context.shadowBlur = 30;

    context.beginPath();
    context.ellipse(
      center.x,
      center.y,
      48 + pulse,
      30 + pulse * 0.5,
      this.rotation,
      0,
      Math.PI * 2
    );
    context.stroke();

    context.globalAlpha = this.aura * 0.4;
    context.lineWidth = 15;

    context.beginPath();
    context.ellipse(
      center.x,
      center.y,
      65 + pulse,
      42 + pulse * 0.5,
      -this.rotation,
      0,
      Math.PI * 2
    );
    context.stroke();

    context.restore();
  }

  drawEnergyRings(context) {
    const center = this.getAttackerCenter();

    this.energyRings.forEach((ring) => {
      context.save();

      context.globalAlpha = ring.alpha;
      context.strokeStyle = "#b9f8ff";
      context.lineWidth = ring.width;
      context.shadowColor = "#32dfff";
      context.shadowBlur = 20;

      context.beginPath();
      context.ellipse(
        center.x,
        center.y,
        ring.radius,
        ring.radius * 0.6,
        this.rotation,
        0,
        Math.PI * 2
      );
      context.stroke();

      context.restore();
    });
  }

  drawLightning(context) {
    this.lightning.forEach((bolt) => {
      context.save();

      context.globalAlpha = bolt.alpha;
      context.strokeStyle = "#ffffff";
      context.lineWidth = bolt.width;
      context.lineCap = "round";
      context.lineJoin = "round";
      context.shadowColor = "#42dfff";
      context.shadowBlur = 20;

      context.beginPath();
      context.moveTo(bolt.points[0].x, bolt.points[0].y);

      for (let i = 1; i < bolt.points.length; i++) {
        context.lineTo(bolt.points[i].x, bolt.points[i].y);
      }

      context.stroke();
      context.restore();
    });
  }

  drawAscensionTrail(context) {
    if (this.phase !== "ASCEND") return;

    const center = this.getAttackerCenter();

    context.save();

    context.globalAlpha = 0.85;
    context.lineWidth = 9;
    context.lineCap = "round";
    context.shadowColor = "#36dfff";
    context.shadowBlur = 28;

    for (let i = -1; i <= 1; i++) {
      context.strokeStyle = i === 0 ? "#ffffff" : "#62e8ff";

      context.beginPath();
      context.moveTo(center.x + i * 20, center.y + 35);

      context.bezierCurveTo(
        center.x + i * 35 + 35,
        center.y + 85,
        center.x + i * 20 - 30,
        center.y + 125,
        center.x + i * 10,
        center.y + 165
      );

      context.stroke();
    }

    context.restore();
  }

  drawDiveTrail(context) {
    if (this.phase !== "DIVE") return;

    const center = this.getAttackerCenter();

    context.save();

    context.globalAlpha = 0.9;
    context.strokeStyle = "#8af1ff";
    context.lineWidth = 24;
    context.lineCap = "round";
    context.shadowColor = "#20dfff";
    context.shadowBlur = 35;

    context.beginPath();
    context.moveTo(
      this.originalCenter.x - this.direction * 25,
      this.originalCenter.y - 145
    );

    context.quadraticCurveTo(
      center.x - this.direction * 45,
      center.y - 100,
      center.x,
      center.y
    );

    context.stroke();

    context.strokeStyle = "#ffffff";
    context.lineWidth = 7;
    context.globalAlpha = 0.9;
    context.stroke();

    context.restore();
  }

  drawShockwaves(context) {
    this.shockwaves.forEach((wave) => {
      context.save();

      context.globalAlpha = Math.max(0, wave.alpha);
      context.strokeStyle = "#d9fbff";
      context.lineWidth = wave.width;
      context.shadowColor = "#35dfff";
      context.shadowBlur = 25;

      context.beginPath();
      context.ellipse(
        this.targetCenter.x,
        this.targetCenter.y,
        wave.radius,
        wave.radius * 0.55,
        0,
        0,
        Math.PI * 2
      );
      context.stroke();

      context.restore();
    });
  }

  drawParticles(context) {
    this.particles.forEach((particle) => {
      context.save();

      context.globalAlpha = Math.max(0, particle.alpha);
      context.fillStyle = particle.color;
      context.shadowColor = particle.color;
      context.shadowBlur = 18;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fill();

      context.restore();
    });
  }

  drawImpactFlash(context) {
    if (this.flash <= 0.02) return;

    context.save();

    context.globalAlpha = this.flash * 0.65;
    context.fillStyle = "#e6fcff";
    context.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);

    context.restore();
  }

  restoreAttacker() {
    this.attacker.position.x = this.originalPosition.x;
    this.attacker.position.y = this.originalPosition.y;
  }
}
