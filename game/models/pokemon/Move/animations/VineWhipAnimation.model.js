export class VineWhipAnimation {
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

    this.prepareDuration = 5;
    this.whipDuration = 30;
    this.whipInterval = 25;
    this.retractDuration = 24;

    this.vines = [];
    this.impacts = [];

    this.targetShake = {
      originalX: 0,
      timer: 0,
      duration: 7,
      intensity: 20,
      isActive: false,
      direction: 1,
    };

    this.createVines();
  }

  createVines() {
    const sprite = this.pokemonViewer.sprite;

    const startX = sprite.position.x + sprite.frameWidth / 2;
    const startY = sprite.position.y + sprite.frameHeight / 2;

    for (let i = 0; i < 2; i++) {
      this.vines.push({
        startX,
        startY: startY + (i === 0 ? -7 : 7),
        side: i === 0 ? -5 : 5,
        phase: i * 3.5,
        thickness: 2.5,
        hasHit: false,
      });
    }
  }

  update(context) {
    switch (this.state) {
      case "PREPARE":
        this.timer++;

        this.drawPreparation(context);

        if (this.timer >= this.prepareDuration) {
          this.timer = 0;
          this.state = "WHIP";
        }
        break;

      case "WHIP":
        this.updateWhip(context);
        this.updateTargetShake();
        break;

      case "RETRACT":
        this.updateRetraction(context);
        this.updateTargetShake();
        break;

      case "FINISH":
        this.isFinished = true;
        break;
    }
  }

  drawPreparation(context) {
    const progress = this.timer / this.prepareDuration;

    for (const vine of this.vines) {
      this.drawVine(context, vine, progress * 0.2);
    }
  }

  updateWhip(context) {
    this.timer++;

    for (let i = 0; i < this.vines.length; i++) {
      const vine = this.vines[i];

      const startTime = i * this.whipInterval;
      const elapsed = this.timer - startTime;

      if (elapsed < 0) {
        continue;
      }

      const progress = Math.min(elapsed / this.whipDuration, 1);

      this.drawVine(context, vine, progress);

      if (progress >= 0.9 && !vine.hasHit) {
        this.createImpact(vine);
        vine.hasHit = true;
      }
    }

    this.updateImpacts(context);

    const totalDuration = this.whipDuration + this.whipInterval;

    if (this.timer >= totalDuration) {
      this.timer = 0;
      this.state = "RETRACT";
    }
  }

  updateTargetShake() {
    if (!this.targetShake.isActive) return;

    this.targetShake.timer++;

    const progress = Math.min(
      this.targetShake.timer / this.targetShake.duration,
      1
    );

    const offset =
      Math.sin(progress * Math.PI) *
      this.targetShake.intensity *
      this.targetShake.direction;

    this.targetViewer.sprite.position.x = this.targetShake.originalX + offset;

    if (progress >= 1) {
      this.targetViewer.sprite.position.x = this.targetShake.originalX;

      this.targetShake.isActive = false;
    }
  }

  updateRetraction(context) {
    this.timer++;

    const progress = Math.min(this.timer / this.retractDuration, 1);

    const retractionProgress = 1 - progress;

    for (const vine of this.vines) {
      this.drawVine(context, vine, retractionProgress);
    }

    this.updateImpacts(context);

    if (progress >= 1 && this.impacts.length === 0) {
      this.state = "FINISH";
    }
  }

  drawVine(context, vine, progress) {
    const target = this.targetViewer.sprite;

    const targetX = target.position.x + target.frameWidth / 2;

    const targetY = target.position.y + target.frameHeight / 2;

    const startX = vine.startX;
    const startY = vine.startY;

    const endX = startX + (targetX - startX) * progress;
    const endY = startY + (targetY - startY) * progress;

    const distanceX = targetX - startX;
    const distanceY = targetY - startY;

    const wave = Math.sin(progress * Math.PI * 3 + vine.phase) * 400;

    const controlX = startX + distanceX * 0.5;

    const controlY = startY + distanceY * 0.5 + wave * progress;

    const drawProgress = Math.max(0.01, progress);

    context.save();

    context.lineCap = "round";
    context.lineJoin = "round";

    // Contour sombre de la liane.
    context.beginPath();

    this.traceVine(
      context,
      startX,
      startY,
      controlX,
      controlY,
      endX,
      endY,
      drawProgress
    );

    context.strokeStyle = "#174d24";
    context.lineWidth = vine.thickness + 2;
    context.stroke();

    // Corps vert de la liane.
    context.beginPath();

    this.traceVine(
      context,
      startX,
      startY,
      controlX,
      controlY,
      endX,
      endY,
      drawProgress
    );

    context.strokeStyle = "#4b9c3b";
    context.lineWidth = vine.thickness;
    context.stroke();

    // Reflet lumineux.
    context.beginPath();

    this.traceVine(
      context,
      startX,
      startY - 1,
      controlX,
      controlY - 1,
      endX,
      endY - 1,
      drawProgress
    );

    context.strokeStyle = "#a6d96a";
    context.lineWidth = 1;
    context.stroke();

    // Extrémité pointue de la liane.
    const tip = this.getBezierPoint(
      startX,
      startY,
      controlX,
      controlY,
      endX,
      endY,
      drawProgress
    );

    context.beginPath();
    context.arc(tip.x, tip.y, 2, 0, Math.PI * 2);
    context.fillStyle = "#b9e77a";
    context.fill();

    context.restore();
  }

  traceVine(context, startX, startY, controlX, controlY, endX, endY, progress) {
    const steps = 20;

    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * progress;

      const point = this.getBezierPoint(
        startX,
        startY,
        controlX,
        controlY,
        endX,
        endY,
        t
      );

      if (i === 0) {
        context.moveTo(point.x, point.y);
      } else {
        context.lineTo(point.x, point.y);
      }
    }
  }

  getBezierPoint(x0, y0, x1, y1, x2, y2, t) {
    const inverse = 1 - t;

    return {
      x: inverse * inverse * x0 + 2 * inverse * t * x1 + t * t * x2,

      y: inverse * inverse * y0 + 2 * inverse * t * y1 + t * t * y2,
    };
  }

  createImpact(vine) {
    const target = this.targetViewer.sprite;

    this.impacts.push({
      x: target.position.x + target.frameWidth / 2,
      y: target.position.y + target.frameHeight / 2,
      timer: 0,
      duration: 9,
      rotation: vine.side * 5.5,
    });

    this.targetShake.originalX = this.targetViewer.sprite.position.x;

    this.targetShake.timer = 0;
    this.targetShake.isActive = true;

    this.targetShake.direction =
      this.targetViewer.sprite.position.x > this.pokemonViewer.sprite.position.x
        ? 1
        : -1;
  }

  updateImpacts(context) {
    for (const impact of this.impacts) {
      impact.timer++;

      const progress = impact.timer / impact.duration;
      const opacity = 1 - progress;

      context.save();

      context.translate(impact.x, impact.y);
      context.rotate(impact.rotation);
      context.globalAlpha = opacity;

      context.strokeStyle = "#d3f49b";
      context.lineWidth = 2.5;

      context.beginPath();
      context.moveTo(-9, -5);
      context.lineTo(9, 5);
      context.stroke();

      context.restore();
    }

    this.impacts = this.impacts.filter(
      (impact) => impact.timer < impact.duration
    );
  }
}
