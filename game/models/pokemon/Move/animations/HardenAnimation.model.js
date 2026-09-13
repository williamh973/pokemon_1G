export class HardenAnimation {
  constructor(game, viewers, turnAction) {
    this.game = game;
    this.viewers = viewers;
    this.turnAction = turnAction;

    this.pokemon = turnAction.pokemon;
    this.target = turnAction.target;
    this.move = turnAction.move;

    this.state = "TARGET_SHAKE";

    if (this.viewers.front.slot.content === this.pokemon) {
      this.targetViewer = this.viewers.front;
      this.key = "front";
    } else {
      this.targetViewer = this.viewers.back;
      this.key = "back";
    }

    this.targetInitialPositionY = this.targetViewer.sprite.position.y;

    this.shakeDistance = 4;
    this.shakeSpeed = 1;
    this.shakeCount = 0;
    this.maxShakeCount = 4;
    this.direction = 1;

    this.elapsedTime = 0;

    this.animationDuration = 600;

    this.isFinished = false;
  }

  update(context) {
    if (this.isFinished) return;

    switch (this.state) {
      case "TARGET_SHAKE":
        this.updateTargetShake();

        if (this.shakeCount >= this.maxShakeCount) {
          this.targetViewer.sprite.position.y = this.targetInitialPositionY;

          this.state = "ARMOR";
          this.elapsedTime = 0;
        }
        break;

      case "ARMOR":
        this.updateArmor(context);
        break;

      default:
        break;
    }
  }

  updateTargetShake() {
    const sprite = this.targetViewer.sprite;

    sprite.position.y += this.shakeSpeed * this.direction;

    if (
      Math.abs(sprite.position.y - this.targetInitialPositionY) >=
      this.shakeDistance
    ) {
      this.direction *= -1;
      this.shakeCount++;
    }
  }

  updateArmor(context) {
    this.elapsedTime += 16;

    const progress = Math.min(this.elapsedTime / this.animationDuration, 1);

    this.drawArmor(context, progress);

    if (progress >= 1) {
      this.isFinished = true;
    }
  }

  drawArmor(context, progress) {
    const sprite = this.targetViewer.sprite;

    const centerX = sprite.position.x + sprite.frameWidth / 2;

    const centerY = sprite.position.y + sprite.frameHeight / 2;

    const radius = 28;

    const alpha =
      progress < 0.25 ? progress / 0.25 : 1 - (progress - 0.25) / 0.75;

    context.save();

    context.globalAlpha = Math.max(0, alpha);

    /*
     * Coquille / armure extérieure
     */
    context.strokeStyle = "#ffffff";
    context.lineWidth = 4;

    context.beginPath();

    context.arc(centerX, centerY, radius, 0, Math.PI * 2);

    context.stroke();

    /*
     * Segments de l'armure
     */
    this.drawArmorPlate(
      context,
      centerX,
      centerY,
      radius,
      -Math.PI * 0.75,
      -Math.PI * 0.25
    );

    this.drawArmorPlate(
      context,
      centerX,
      centerY,
      radius,
      -Math.PI * 0.15,
      Math.PI * 0.35
    );

    this.drawArmorPlate(
      context,
      centerX,
      centerY,
      radius,
      Math.PI * 0.45,
      Math.PI * 0.95
    );

    this.drawArmorPlate(
      context,
      centerX,
      centerY,
      radius,
      Math.PI * 1.05,
      Math.PI * 1.55
    );

    context.restore();
  }

  drawArmorPlate(context, centerX, centerY, radius, startAngle, endAngle) {
    const innerRadius = radius - 5;

    const startX = centerX + Math.cos(startAngle) * innerRadius;

    const startY = centerY + Math.sin(startAngle) * innerRadius;

    const endX = centerX + Math.cos(endAngle) * radius;

    const endY = centerY + Math.sin(endAngle) * radius;

    context.beginPath();

    context.moveTo(startX, startY);

    context.lineTo(endX, endY);

    context.stroke();
  }
}
