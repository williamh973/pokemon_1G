export class HardenAnimation {
  constructor(game, viewers, turnAction) {
    this.game = game;
    this.viewers = viewers;
    this.turnAction = turnAction;

    this.battleBackgroundEffectManager =
      this.game.battleManager.battleRenderer.battleBackgroundEffectManager;

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

    this.sprite = this.targetViewer.sprite;

    this.targetInitialPositionY = this.sprite.position.y;

    this.shakeDistance = 4;
    this.shakeSpeed = 1;
    this.shakeCount = 0;
    this.maxShakeCount = 4;
    this.direction = 1;

    this.elapsedTime = 0;
    this.animationDuration = 2000;

    this.metalProgress = 0;
    this.armorProgress = 0;

    this.isFinished = false;

    this.battleBackgroundEffectManager.startColorChange("BLACK", 0.65);
  }

  update(context) {
    if (this.isFinished) return;

    switch (this.state) {
      case "TARGET_SHAKE":
        this.updateTargetShake();

        if (this.shakeCount >= this.maxShakeCount) {
          this.sprite.position.y = this.targetInitialPositionY;

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
    this.sprite.position.y += this.shakeSpeed * this.direction;

    if (
      Math.abs(this.sprite.position.y - this.targetInitialPositionY) >=
      this.shakeDistance
    ) {
      this.direction *= -1;
      this.shakeCount++;
    }
  }

  updateArmor(context) {
    this.elapsedTime += 16;

    const progress = Math.min(this.elapsedTime / this.animationDuration, 1);

    // Apparition progressive de l'effet métallique.
    this.metalProgress = Math.min(progress * 2, 1);

    this.drawMetalPokemon(context);
    this.drawArmor(context, this.armorProgress);

    if (progress >= 1) {
      this.isFinished = true;
      this.battleBackgroundEffectManager.stopColorChange();
    }
  }

  drawMetalPokemon(context) {
    if (this.metalProgress <= 0) return;

    const sprite = this.sprite;
    const image = sprite.image;

    if (!image || !image.complete || !image.naturalWidth) return;

    const width = sprite.frameWidth * sprite.scale;
    const height = sprite.frameHeight * sprite.scale;

    const x = sprite.position.x;
    const y = sprite.position.y;

    context.save();

    context.globalAlpha = this.metalProgress;

    // Redessine la frame actuelle avec un aspect métallique.
    context.filter = "grayscale(1) brightness(1.35) contrast(1.15)";

    context.drawImage(
      image,
      sprite.currentFrame * sprite.frameWidth,
      0,
      sprite.frameWidth,
      sprite.frameHeight,
      x,
      y,
      width,
      height
    );

    context.filter = "none";

    // Reflet argenté qui traverse le Pokémon.
    const flashWidth = width * 0.35;

    const flashX = x + width * this.metalProgress - flashWidth;

    const gradient = context.createLinearGradient(
      flashX,
      y,
      flashX + flashWidth,
      y
    );

    gradient.addColorStop(0, "rgba(255,255,255,0)");
    gradient.addColorStop(0.5, "rgba(255,255,255,0.7)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");

    context.fillStyle = gradient;
    context.fillRect(x, y, width, height);

    context.restore();
  }

  drawArmor(context, progress) {
    if (progress <= 0) return;

    const sprite = this.sprite;

    const centerX = sprite.position.x + (sprite.frameWidth * sprite.scale) / 2;

    const centerY = sprite.position.y + (sprite.frameHeight * sprite.scale) / 2;

    const radius = 28 * progress;

    context.save();

    context.globalAlpha = progress;

    /*
     * Coquille extérieure.
     */
    context.strokeStyle = "#ffffff";
    context.lineWidth = 4;

    context.beginPath();
    context.arc(centerX, centerY, radius, 0, Math.PI * 2);
    context.stroke();

    /*
     * Segments de l'armure.
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
