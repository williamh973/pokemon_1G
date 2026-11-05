export class ThunderWaveAnimation {
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

    this.prepareDuration = 30;
    this.fireDuration = 42;
    this.impactDuration = 100;
    this.finishDuration = 35;

    this.waveProgress = 0;
  }

  setState(state) {
    this.state = state;
    this.timer = 0;
  }

  update(context) {
    if (this.isFinished) return;

    switch (this.state) {
      case "PREPARE":
        this.updatePrepare(context);
        break;

      case "FIRE":
        this.updateFire(context);
        break;

      case "IMPACT":
        this.updateImpact(context);
        break;

      case "FINISH":
        this.updateFinish(context);
        break;
    }

    this.timer++;
  }

  getCenter(viewer) {
    const sprite = viewer.sprite;

    return {
      x: sprite.position.x + sprite.frameWidth / 2,
      y: sprite.position.y + sprite.frameHeight / 2,
    };
  }

  // --------------------------------------------------
  // PREPARE : formation de l'énergie électrique
  // --------------------------------------------------

  updatePrepare(context) {
    const origin = this.getCenter(this.pokemonViewer);

    const progress = this.timer / this.prepareDuration;
    const pulse = 1 + Math.sin(this.timer * 0.35) * 0.15;

    const x = origin.x;
    const y = origin.y - 8;

    context.save();

    // Aura électrique
    const aura = context.createRadialGradient(x, y, 2, x, y, 35 * pulse);

    aura.addColorStop(0, "rgba(120, 230, 255, 0.65)");
    aura.addColorStop(0.45, "rgba(255, 234, 31, 0.25)");
    aura.addColorStop(1, "rgba(255, 200, 0, 0)");

    context.fillStyle = aura;
    context.beginPath();
    context.arc(x, y, 35 * pulse, 0, Math.PI * 2);
    context.fill();

    // Sphère électrique
    const orbRadius = 5 + progress * 5;

    const orb = context.createRadialGradient(x - 3, y - 3, 1, x, y, orbRadius);

    orb.addColorStop(0, "#ffffff");
    orb.addColorStop(0.35, "#fff6b9");
    orb.addColorStop(0.7, "#ffbd38");
    orb.addColorStop(1, "rgba(0, 90, 255, 0)");

    context.fillStyle = orb;
    context.beginPath();
    context.arc(x, y, orbRadius, 0, Math.PI * 2);
    context.fill();

    // Petits arcs autour de la sphère
    for (let i = 0; i < 4; i++) {
      const angle = this.timer * 0.18 + (i * Math.PI) / 2;
      const radius = 15 + Math.sin(this.timer * 0.2 + i) * 3;

      const start = {
        x: x + Math.cos(angle) * radius,
        y: y + Math.sin(angle) * radius,
      };

      const end = {
        x: x + Math.cos(angle + 0.55) * (radius + 7),
        y: y + Math.sin(angle + 0.55) * (radius + 7),
      };

      this.drawLightning(context, start, end, 3, 8);
    }

    context.restore();

    if (this.timer >= this.prepareDuration) {
      this.setState("FIRE");
    }
  }

  // --------------------------------------------------
  // FIRE : propagation de l'onde électrique
  // --------------------------------------------------

  updateFire(context) {
    const origin = this.getCenter(this.pokemonViewer);
    const target = this.getCenter(this.targetViewer);

    const progress = Math.min(this.timer / this.fireDuration, 1);

    const startX = origin.x;
    const startY = origin.y - 8;

    const endX = target.x;
    const endY = target.y;

    const headX = startX + (endX - startX) * progress;
    const headY = startY + (endY - startY) * progress;

    this.waveProgress = progress;

    context.save();

    // Traînée lumineuse de l'onde
    const trailLength = 0.22;
    const trailStart = Math.max(0, progress - trailLength);

    const trailX = startX + (endX - startX) * trailStart;
    const trailY = startY + (endY - startY) * trailStart;

    context.globalAlpha = 0.45;
    context.strokeStyle = "#ffca39";
    context.lineWidth = 13;
    context.lineCap = "round";
    context.shadowColor = "rgba(217, 255, 0)";
    context.shadowBlur = 20;

    context.beginPath();
    context.moveTo(trailX, trailY);
    context.lineTo(headX, headY);
    context.stroke();

    context.globalAlpha = 1;
    context.shadowBlur = 0;

    // Onde électrique principale
    this.drawLightning(
      context,
      { x: trailX, y: trailY },
      { x: headX, y: headY },
      7,
      13
    );

    // Décharges secondaires autour de l'onde
    for (let i = 0; i < 3; i++) {
      const offset = Math.sin(this.timer * 0.35 + i * 2) * 13;

      this.drawLightning(
        context,
        {
          x: trailX,
          y: trailY + offset,
        },
        {
          x: headX,
          y: headY + offset * 0.4,
        },
        5,
        8
      );
    }

    // Halo au niveau de la tête de l'onde
    const pulse = 1 + Math.sin(this.timer * 0.5) * 0.2;

    const gradient = context.createRadialGradient(
      headX,
      headY,
      1,
      headX,
      headY,
      25 * pulse
    );

    gradient.addColorStop(0, "rgba(255, 210, 0, 0.95)");
    gradient.addColorStop(0.3, "rgba(252, 255, 0, 0.75)");
    gradient.addColorStop(1, "rgba(236, 255, 0, 0)");

    context.fillStyle = gradient;
    context.beginPath();
    context.arc(headX, headY, 25 * pulse, 0, Math.PI * 2);
    context.fill();

    context.restore();

    if (this.timer >= this.fireDuration) {
      this.setState("IMPACT");
    }
  }

  // --------------------------------------------------
  // IMPACT : le Pokémon est enfermé dans une cage
  // électrique
  // --------------------------------------------------

  updateImpact(context) {
    const target = this.getCenter(this.targetViewer);

    const progress = this.timer / this.impactDuration;
    const fadeOut = Math.max(0, 1 - Math.max(0, progress - 0.72) / 0.28);

    const pulse = 1 + Math.sin(this.timer * 0.25) * 0.08;
    const width = this.targetViewer.sprite.frameWidth;
    const height = this.targetViewer.sprite.frameHeight;

    const cageWidth = (width * 0.85 + 24) * pulse;
    const cageHeight = (height * 0.8 + 28) * pulse;

    context.save();
    context.globalAlpha = fadeOut;

    // Aura générale de la cage
    const aura = context.createRadialGradient(
      target.x,
      target.y,
      5,
      target.x,
      target.y,
      cageWidth * 0.9
    );

    aura.addColorStop(0, "rgba(255, 210, 0, 0.12)");
    aura.addColorStop(0.7, "rgba(252, 255, 0, 0.15)");
    aura.addColorStop(1, "rgba(236, 255, 0, 0)");

    context.fillStyle = aura;
    context.beginPath();
    context.ellipse(
      target.x,
      target.y,
      cageWidth * 0.9,
      cageHeight * 0.9,
      0,
      0,
      Math.PI * 2
    );
    context.fill();

    // Contour elliptique de la cage
    context.strokeStyle = "rgba(255, 221, 98, 1)";
    context.lineWidth = 2;
    context.shadowColor = "rgba(160, 105, 25, 1";
    context.shadowBlur = 12;

    context.beginPath();
    context.ellipse(
      target.x,
      target.y,
      cageWidth / 2,
      cageHeight / 2,
      0,
      0,
      Math.PI * 2
    );
    context.stroke();

    context.shadowBlur = 0;

    // Barres verticales électriques
    for (let i = -2; i <= 2; i++) {
      const x = target.x + i * (cageWidth / 5);

      this.drawLightning(
        context,
        {
          x,
          y: target.y - cageHeight / 2,
        },
        {
          x: x + Math.sin(this.timer * 0.3 + i) * 7,
          y: target.y + cageHeight / 2,
        },
        5,
        7
      );
    }

    // Barres horizontales électriques
    for (let i = -1; i <= 1; i++) {
      const y = target.y + i * (cageHeight / 3);

      this.drawLightning(
        context,
        {
          x: target.x - cageWidth / 2,
          y,
        },
        {
          x: target.x + cageWidth / 2,
          y: y + Math.sin(this.timer * 0.25 + i) * 5,
        },
        5,
        6
      );
    }

    // Décharges circulant autour de la cible
    for (let i = 0; i < 5; i++) {
      const angle = this.timer * 0.12 + i * ((Math.PI * 2) / 5);

      const start = {
        x: target.x + Math.cos(angle) * cageWidth * 0.48,
        y: target.y + Math.sin(angle) * cageHeight * 0.48,
      };

      const end = {
        x: target.x + Math.cos(angle + 0.45) * cageWidth * 0.48,
        y: target.y + Math.sin(angle + 0.45) * cageHeight * 0.48,
      };

      this.drawLightning(context, start, end, 4, 9);
    }

    // Étincelles à l'intérieur de la cage
    for (let i = 0; i < 8; i++) {
      const angle = i * 2.4 + this.timer * 0.08;
      const radiusX = cageWidth * 0.35;
      const radiusY = cageHeight * 0.35;

      const sparkX = target.x + Math.cos(angle) * radiusX;
      const sparkY = target.y + Math.sin(angle) * radiusY;

      const sparkSize = 1.5 + Math.abs(Math.sin(this.timer * 0.4 + i)) * 2;

      context.fillStyle = "#ffffff";
      context.shadowColor = "rgba(160, 105, 25, 1";
      context.shadowBlur = 8;

      context.beginPath();
      context.arc(sparkX, sparkY, sparkSize, 0, Math.PI * 2);
      context.fill();
    }

    context.restore();

    if (this.timer >= this.impactDuration) {
      this.setState("FINISH");
    }
  }

  // --------------------------------------------------
  // FINISH : disparition progressive de la cage
  // --------------------------------------------------

  updateFinish(context) {
    const target = this.getCenter(this.targetViewer);

    const progress = this.timer / this.finishDuration;
    const alpha = Math.max(0, 1 - progress);

    context.save();
    context.globalAlpha = alpha;

    // Dernières décharges qui s'échappent de la cage
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3 + this.timer * 0.12;

      const start = {
        x: target.x + Math.cos(angle) * 12,
        y: target.y + Math.sin(angle) * 12,
      };

      const end = {
        x: target.x + Math.cos(angle) * (35 + this.timer),
        y: target.y + Math.sin(angle) * (25 + this.timer),
      };

      this.drawLightning(context, start, end, 4, 8);
    }

    // Dernier halo lumineux
    const radius = 20 + this.timer * 1.2;

    const gradient = context.createRadialGradient(
      target.x,
      target.y,
      1,
      target.x,
      target.y,
      radius
    );

    gradient.addColorStop(0, "rgba(255, 255, 255, 0.7)");
    gradient.addColorStop(0.4, "rgba(70, 190, 255, 0.35)");
    gradient.addColorStop(1, "rgba(0, 100, 255, 0)");

    context.fillStyle = gradient;
    context.beginPath();
    context.arc(target.x, target.y, radius, 0, Math.PI * 2);
    context.fill();

    context.restore();

    if (this.timer >= this.finishDuration) {
      this.isFinished = true;
    }
  }

  // --------------------------------------------------
  // Utilitaire : dessin d'un éclair segmenté
  // --------------------------------------------------

  drawLightning(context, start, end, segments = 6, amplitude = 10) {
    const dx = end.x - start.x;
    const dy = end.y - start.y;

    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);

    const perpX = -Math.sin(angle);
    const perpY = Math.cos(angle);

    const points = [];

    points.push(start);

    for (let i = 1; i < segments; i++) {
      const progress = i / segments;

      const variation =
        Math.sin(this.timer * 0.7 + i * 2.1) *
        amplitude *
        (0.5 + Math.sin(i * 1.7) * 0.5);

      points.push({
        x: start.x + dx * progress + perpX * variation,
        y: start.y + dy * progress + perpY * variation,
      });
    }

    points.push(end);

    // Halo extérieur
    context.save();

    context.lineCap = "round";
    context.lineJoin = "round";

    context.strokeStyle = "rgba(245, 243, 39, 0.45)";
    context.lineWidth = 6;
    context.shadowColor = "rgba(160, 105, 25, 1";
    context.shadowBlur = 12;

    context.beginPath();
    context.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
      context.lineTo(points[i].x, points[i].y);
    }

    context.stroke();

    // Éclair bleu
    context.strokeStyle = "rgba(230, 174, 55, 1";
    context.lineWidth = 2.5;
    context.shadowBlur = 6;

    context.beginPath();
    context.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
      context.lineTo(points[i].x, points[i].y);
    }

    context.stroke();

    // Cœur blanc de l'éclair
    context.strokeStyle = "rgba(255, 230, 140, 1)";
    context.lineWidth = 1;
    context.shadowBlur = 4;

    context.beginPath();
    context.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
      context.lineTo(points[i].x, points[i].y);
    }

    context.stroke();

    context.restore();
  }
}
