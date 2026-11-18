export class LeechSeedAnimation {
  constructor(game, viewers, turnAction) {
    this.game = game;
    this.viewers = viewers;
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

    this.attackerCenter = {
      x: this.attacker.position.x + this.attacker.frameWidth / 2,
      y: this.attacker.position.y + this.attacker.frameHeight / 2,
    };

    this.targetCenter = {
      x: this.target.position.x + this.target.frameWidth / 2,
      y: this.target.position.y + this.target.frameHeight / 2,
    };

    const dx = this.targetCenter.x - this.attackerCenter.x;
    const dy = this.targetCenter.y - this.attackerCenter.y;
    const distance = Math.hypot(dx, dy) || 1;

    this.directionX = dx / distance;
    this.directionY = dy / distance;
    this.distance = distance;

    this.phase = "PREPARE";
    this.frame = 0;
    this.isFinished = false;

    this.duration = {
      PREPARE: 18,
      LAUNCH: 24,
      IMPACT: 12,
      ROOTS: 38,
      DRAIN: 38,
    };

    this.seed = {
      x: this.attackerCenter.x,
      y: this.attackerCenter.y,
      startX: this.attackerCenter.x,
      startY: this.attackerCenter.y,
      endX: this.targetCenter.x,
      endY: this.targetCenter.y,
      radius: 5,
      rotation: 0,
      alpha: 1,
    };

    this.seedTrail = [];
    this.leaves = [];
    this.particles = [];
    this.roots = [];
    this.energyParticles = [];
    this.rootSparkles = [];
    this.impactRings = [];

    this.rootAlpha = 0;
    this.impactFlash = 0;
    this.drainGlow = 0;

    this.createSeedAura();
  }

  update(context) {
    if (this.isFinished) return;

    this.frame++;

    switch (this.phase) {
      case "PREPARE":
        this.updatePrepare();
        break;

      case "LAUNCH":
        this.updateLaunch();
        break;

      case "IMPACT":
        this.updateImpact();
        break;

      case "ROOTS":
        this.updateRoots();
        break;

      case "DRAIN":
        this.updateDrain();
        break;
    }

    this.updateEffects();
    this.draw(context);
  }

  changePhase(phase) {
    this.phase = phase;
    this.frame = 0;
  }

  clamp(value) {
    return Math.max(0, Math.min(1, value));
  }

  easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  easeIn(t) {
    return t * t * t;
  }

  random(min, max) {
    return min + Math.random() * (max - min);
  }

  createSeedAura() {
    for (let i = 0; i < 16; i++) {
      this.particles.push({
        x: this.seed.x,
        y: this.seed.y,
        angle: Math.random() * Math.PI * 2,
        radius: this.random(7, 19),
        speed: this.random(0.04, 0.1),
        size: this.random(1.5, 3),
        alpha: this.random(0.4, 0.8),
        life: 100,
        type: "ORBIT",
      });
    }
  }

  updatePrepare() {
    const progress = this.clamp(this.frame / this.duration.PREPARE);

    this.seed.radius = 4 + progress * 4;

    this.seed.rotation += 0.1;

    this.particles.forEach((particle) => {
      if (particle.type === "ORBIT") {
        particle.angle += particle.speed;
      }
    });

    if (this.frame % 3 === 0) {
      this.createLeaf(
        this.seed.x + this.random(-10, 10),
        this.seed.y + this.random(-10, 10),
        this.random(-1.5, 1.5),
        this.random(-2, -0.5)
      );
    }

    if (this.frame >= this.duration.PREPARE) {
      this.changePhase("LAUNCH");
    }
  }

  updateLaunch() {
    const progress = this.clamp(this.frame / this.duration.LAUNCH);

    const movement = this.easeOut(progress);

    this.seed.x =
      this.seed.startX + (this.seed.endX - this.seed.startX) * movement;

    this.seed.y =
      this.seed.startY +
      (this.seed.endY - this.seed.startY) * movement -
      Math.sin(progress * Math.PI) * 22;

    this.seed.rotation += 0.25;

    this.seedTrail.push({
      x: this.seed.x,
      y: this.seed.y,
      alpha: 0.8,
      radius: this.seed.radius * 0.65,
    });

    if (this.frame % 2 === 0) {
      this.createLeaf(
        this.seed.x + this.random(-4, 4),
        this.seed.y + this.random(-4, 4),
        -this.directionX * this.random(1, 3),
        -this.directionY * this.random(1, 3)
      );
    }

    if (this.frame >= this.duration.LAUNCH) {
      this.seed.x = this.seed.endX;
      this.seed.y = this.seed.endY;

      this.createImpact();
      this.changePhase("IMPACT");
    }
  }

  createImpact() {
    this.impactFlash = 1;

    for (let i = 0; i < 4; i++) {
      this.impactRings.push({
        radius: 5 + i * 5,
        alpha: 0.9,
        speed: 3 + i * 0.6,
      });
    }

    for (let i = 0; i < 24; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = this.random(1, 5);

      this.particles.push({
        x: this.seed.x,
        y: this.seed.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: this.random(2, 4),
        alpha: 1,
        life: 30,
        type: "BURST",
      });
    }
  }

  updateImpact() {
    const progress = this.clamp(this.frame / this.duration.IMPACT);

    this.seed.radius = 7 + Math.sin(progress * Math.PI) * 4;

    this.impactFlash = Math.max(0, this.impactFlash - 0.1);

    if (this.frame >= this.duration.IMPACT) {
      this.createRoots();
      this.changePhase("ROOTS");
    }
  }

  createRoots() {
    // Racines principales autour de la cible.
    for (let i = 0; i < 10; i++) {
      const angle = (Math.PI * 2 * i) / 10;

      this.roots.push({
        angle,
        length: 0,
        maxLength: this.random(23, 42),
        width: this.random(2, 4),
        alpha: 1,
        curl: this.random(-0.8, 0.8),
        phase: Math.random() * Math.PI * 2,
      });
    }

    // Petites ramifications.
    for (let i = 0; i < 14; i++) {
      const angle = Math.random() * Math.PI * 2;

      this.rootSparkles.push({
        angle,
        radius: this.random(12, 35),
        size: this.random(1.5, 3.5),
        alpha: 1,
        speed: this.random(0.04, 0.09),
        life: 70,
      });
    }

    this.rootAlpha = 0;
  }

  updateRoots() {
    const progress = this.clamp(this.frame / this.duration.ROOTS);

    this.rootAlpha = this.easeOut(progress);

    this.roots.forEach((root) => {
      root.length = root.maxLength * this.rootAlpha;
      root.phase += 0.05;
    });

    this.rootSparkles.forEach((sparkle) => {
      sparkle.angle += sparkle.speed;
      sparkle.life--;
      sparkle.alpha = Math.min(1, sparkle.life / 12);
    });

    if (this.frame % 3 === 0) {
      const angle = Math.random() * Math.PI * 2;

      this.createLeaf(
        this.targetCenter.x + Math.cos(angle) * 25,
        this.targetCenter.y + Math.sin(angle) * 18,
        this.random(-1, 1),
        this.random(-1.5, 0.5)
      );
    }

    if (this.frame >= this.duration.ROOTS) {
      this.createDrainParticles();
      this.changePhase("DRAIN");
    }
  }

  createDrainParticles() {
    for (let i = 0; i < 24; i++) {
      this.energyParticles.push({
        progress: Math.random(),
        speed: this.random(0.012, 0.025),
        offset: this.random(-10, 10),
        size: this.random(2, 4),
        alpha: 1,
        wobble: Math.random() * Math.PI * 2,
      });
    }
  }

  updateDrain() {
    const progress = this.clamp(this.frame / this.duration.DRAIN);

    this.drainGlow = Math.sin(progress * Math.PI);

    this.energyParticles.forEach((particle) => {
      particle.progress += particle.speed;
      particle.wobble += 0.15;

      particle.alpha = Math.min(1, (1 - particle.progress) * 2);
    });

    // Les racines restent visibles pendant le transfert.
    this.roots.forEach((root) => {
      root.phase += 0.08;
    });

    if (this.frame % 4 === 0) {
      this.createDrainSparkle();
    }

    if (this.frame >= this.duration.DRAIN) {
      this.isFinished = true;
    }
  }

  createDrainSparkle() {
    this.particles.push({
      x: this.attackerCenter.x,
      y: this.attackerCenter.y,
      vx: this.random(-1, 1),
      vy: this.random(-1.5, 0.5),
      size: this.random(2, 3),
      alpha: 1,
      life: 25,
      type: "BURST",
    });
  }

  createLeaf(x, y, vx, vy) {
    this.leaves.push({
      x,
      y,
      vx,
      vy,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: this.random(-0.12, 0.12),
      size: this.random(3, 6),
      alpha: 1,
      life: this.random(25, 55),
    });
  }

  updateEffects() {
    this.seedTrail.forEach((trail) => {
      trail.alpha -= 0.08;
      trail.radius *= 0.97;
    });

    this.seedTrail = this.seedTrail.filter((trail) => trail.alpha > 0);

    this.leaves.forEach((leaf) => {
      leaf.x += leaf.vx;
      leaf.y += leaf.vy;

      leaf.vy += 0.025;
      leaf.vx *= 0.985;

      leaf.rotation += leaf.rotationSpeed;
      leaf.life--;
      leaf.alpha = Math.min(1, leaf.life / 12);
    });

    this.leaves = this.leaves.filter((leaf) => leaf.life > 0);

    this.particles.forEach((particle) => {
      if (particle.type === "BURST") {
        particle.x += particle.vx;
        particle.y += particle.vy;

        particle.vx *= 0.96;
        particle.vy *= 0.96;

        particle.life--;
        particle.alpha = Math.min(1, particle.life / 10);
      }
    });

    this.particles = this.particles.filter(
      (particle) => particle.type === "ORBIT" || particle.life > 0
    );

    this.impactRings.forEach((ring) => {
      ring.radius += ring.speed;
      ring.alpha -= 0.05;
    });

    this.impactRings = this.impactRings.filter((ring) => ring.alpha > 0);

    this.rootSparkles = this.rootSparkles.filter((sparkle) => sparkle.life > 0);
  }

  draw(context) {
    this.drawSeedAura(context);
    this.drawSeedTrail(context);
    this.drawLeaves(context);
    this.drawRoots(context);
    this.drawImpactRings(context);
    this.drawParticles(context);
    this.drawEnergyTransfer(context);
    this.drawFlash(context);
  }

  drawSeedAura(context) {
    if (this.phase !== "PREPARE" && this.phase !== "LAUNCH") return;

    context.save();

    const radius = this.seed.radius * 2.8;

    const gradient = context.createRadialGradient(
      this.seed.x,
      this.seed.y,
      1,
      this.seed.x,
      this.seed.y,
      radius
    );

    gradient.addColorStop(0, "rgba(210,255,140,0.85)");
    gradient.addColorStop(0.4, "rgba(90,230,100,0.35)");
    gradient.addColorStop(1, "rgba(40,180,80,0)");

    context.fillStyle = gradient;

    context.beginPath();
    context.arc(this.seed.x, this.seed.y, radius, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }

  drawSeedTrail(context) {
    context.save();

    this.seedTrail.forEach((trail) => {
      context.globalAlpha = trail.alpha * 0.55;
      context.fillStyle = "#a9f58b";

      context.beginPath();
      context.arc(trail.x, trail.y, trail.radius, 0, Math.PI * 2);
      context.fill();
    });

    context.restore();
  }

  drawLeaves(context) {
    context.save();

    this.leaves.forEach((leaf) => {
      context.save();

      context.translate(leaf.x, leaf.y);
      context.rotate(leaf.rotation);

      context.globalAlpha = leaf.alpha;
      context.fillStyle = "#9cde65";

      context.beginPath();
      context.moveTo(0, -leaf.size);
      context.quadraticCurveTo(leaf.size * 1.4, -leaf.size * 0.3, 0, leaf.size);
      context.quadraticCurveTo(
        -leaf.size * 1.4,
        -leaf.size * 0.3,
        0,
        -leaf.size
      );
      context.fill();

      context.strokeStyle = "#e0ffc0";
      context.lineWidth = 0.8;
      context.beginPath();
      context.moveTo(0, -leaf.size * 0.7);
      context.lineTo(0, leaf.size * 0.7);
      context.stroke();

      context.restore();
    });

    context.restore();
  }

  drawRoots(context) {
    if (this.phase !== "ROOTS" && this.phase !== "DRAIN") return;

    context.save();

    this.roots.forEach((root) => {
      const startX = this.targetCenter.x;
      const startY = this.targetCenter.y;

      const endX = startX + Math.cos(root.angle) * root.length;

      const endY = startY + Math.sin(root.angle) * root.length * 0.65;

      const controlX =
        startX + Math.cos(root.angle + root.curl) * root.length * 0.55;

      const controlY =
        startY + Math.sin(root.angle + root.curl) * root.length * 0.4;

      context.globalAlpha =
        this.rootAlpha * (0.8 + Math.sin(root.phase) * 0.15);

      context.strokeStyle = "#8ce46a";
      context.lineWidth = root.width;
      context.lineCap = "round";

      context.beginPath();
      context.moveTo(startX, startY);
      context.quadraticCurveTo(controlX, controlY, endX, endY);
      context.stroke();

      // Nervure lumineuse.
      context.globalAlpha *= 0.55;
      context.strokeStyle = "#d5ff9b";
      context.lineWidth = 1;

      context.beginPath();
      context.moveTo(startX, startY);
      context.lineTo(
        startX + (endX - startX) * 0.7,
        startY + (endY - startY) * 0.7
      );
      context.stroke();
    });

    // Petites pousses lumineuses.
    this.rootSparkles.forEach((sparkle) => {
      const x = this.targetCenter.x + Math.cos(sparkle.angle) * sparkle.radius;

      const y =
        this.targetCenter.y + Math.sin(sparkle.angle) * sparkle.radius * 0.6;

      context.globalAlpha = sparkle.alpha * this.rootAlpha;
      context.fillStyle = "#dcff9c";

      context.beginPath();
      context.arc(x, y, sparkle.size, 0, Math.PI * 2);
      context.fill();
    });

    context.restore();
  }

  drawImpactRings(context) {
    context.save();

    this.impactRings.forEach((ring) => {
      context.globalAlpha = ring.alpha;
      context.strokeStyle = "#c7ff9b";
      context.lineWidth = 2.5;

      context.beginPath();
      context.ellipse(
        this.targetCenter.x,
        this.targetCenter.y,
        ring.radius,
        ring.radius * 0.55,
        0,
        0,
        Math.PI * 2
      );
      context.stroke();
    });

    context.restore();
  }

  drawParticles(context) {
    context.save();

    this.particles.forEach((particle) => {
      if (particle.type === "ORBIT") {
        const x = this.seed.x + Math.cos(particle.angle) * particle.radius;

        const y = this.seed.y + Math.sin(particle.angle) * particle.radius;

        context.globalAlpha = particle.alpha;
        context.fillStyle = "#c9ff9e";

        context.beginPath();
        context.arc(x, y, particle.size, 0, Math.PI * 2);
        context.fill();
      } else {
        context.globalAlpha = particle.alpha;
        context.fillStyle = "#b9f58a";

        context.beginPath();
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        context.fill();
      }
    });

    context.restore();
  }

  drawEnergyTransfer(context) {
    if (this.phase !== "DRAIN") return;

    context.save();

    const startX = this.targetCenter.x;
    const startY = this.targetCenter.y;

    const endX = this.attackerCenter.x;
    const endY = this.attackerCenter.y;

    this.energyParticles.forEach((particle) => {
      if (particle.progress > 1) return;

      const progress = this.easeOut(particle.progress);

      const x =
        startX +
        (endX - startX) * progress -
        Math.sin(progress * Math.PI) * particle.offset;

      const y =
        startY +
        (endY - startY) * progress +
        Math.cos(progress * Math.PI * 2 + particle.wobble) * 5;

      context.globalAlpha = particle.alpha;
      context.fillStyle = "#d7ff9d";

      context.beginPath();
      context.arc(x, y, particle.size, 0, Math.PI * 2);
      context.fill();

      context.globalAlpha = particle.alpha * 0.3;

      context.beginPath();
      context.arc(x, y, particle.size * 2.5, 0, Math.PI * 2);
      context.fill();
    });

    // Halo de récupération autour de l'attaquant.
    context.globalAlpha = this.drainGlow * 0.45;

    const gradient = context.createRadialGradient(
      this.attackerCenter.x,
      this.attackerCenter.y,
      2,
      this.attackerCenter.x,
      this.attackerCenter.y,
      25
    );

    gradient.addColorStop(0, "#e2ffb5");
    gradient.addColorStop(1, "rgba(100,230,100,0)");

    context.fillStyle = gradient;

    context.beginPath();
    context.arc(
      this.attackerCenter.x,
      this.attackerCenter.y,
      25,
      0,
      Math.PI * 2
    );
    context.fill();

    context.restore();
  }

  drawFlash(context) {
    if (this.impactFlash <= 0) return;

    context.save();

    context.globalAlpha = this.impactFlash * 0.25;
    context.fillStyle = "#baff91";

    context.beginPath();
    context.arc(this.targetCenter.x, this.targetCenter.y, 38, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }
}
