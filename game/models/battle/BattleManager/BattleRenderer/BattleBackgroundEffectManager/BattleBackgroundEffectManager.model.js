export class BattleBackgroundEffectManager {
  constructor(game) {
    this.game = game;

    this.color = {
      value: null,
      alpha: 0,
      targetAlpha: 0,
      speed: 0.05,
    };

    // Effet d'ondulation
    this.wave = {
      isActive: false,
      time: 0,
      amplitude: 0,
      targetAmplitude: 0,
      frequency: 0.08,
      speed: 0.08,
    };

    this.isFinished = true;
  }

  startColorChange(color, targetAlpha = 0.65) {
    this.color.value = color;
    this.color.alpha = 0;
    this.color.targetAlpha = targetAlpha;
    this.isFinished = false;
  }

  stopColorChange() {
    this.color.targetAlpha = 0;
  }

  startWave({ amplitude = 5, frequency = 0.08, speed = 0.08 } = {}) {
    this.wave.isActive = true;
    this.wave.targetAmplitude = amplitude;
    this.wave.frequency = frequency;
    this.wave.speed = speed;

    this.isFinished = false;
  }

  stopWave() {
    this.wave.targetAmplitude = 0;
  }

  handleColorChange(context) {
    if (this.color.alpha < this.color.targetAlpha) {
      this.color.alpha = Math.min(
        this.color.alpha + this.color.speed,
        this.color.targetAlpha
      );
    } else if (this.color.alpha > this.color.targetAlpha) {
      this.color.alpha = Math.max(
        this.color.alpha - this.color.speed,
        this.color.targetAlpha
      );
    }

    if (this.color.alpha === 0 && this.color.targetAlpha === 0) {
      this.color.value = null;
    }
  }

  drawBackground(context, image, x, y, width, height) {
    if (!this.wave.isActive || this.wave.amplitude <= 0) {
      context.drawImage(image, x, y, width, height);
      return;
    }

    const sourceWidth = image.naturalWidth || image.width;
    const sourceHeight = image.naturalHeight || image.height;

    const stripHeight = 4;
    const amplitude = this.wave.amplitude;

    context.save();

    // Évite que les bandes débordent du Canvas.
    context.beginPath();
    context.rect(x, y, width, height);
    context.clip();

    for (let dy = 0; dy < height; dy += stripHeight) {
      const bandHeight = Math.min(stripHeight, height - dy);

      const progress = dy / height;

      const sourceY = progress * sourceHeight;
      const sourceBandHeight = (bandHeight / height) * sourceHeight;

      // Décalage sinusoïdal de chaque bande.
      const offset =
        Math.sin(dy * this.wave.frequency + this.wave.time) * amplitude;

      context.drawImage(
        image,
        0,
        sourceY,
        sourceWidth,
        sourceBandHeight,
        x + offset - amplitude,
        y + dy,
        width + amplitude * 2,
        bandHeight + 1
      );
    }

    context.restore();
  }

  drawColor(context, x, y, width, height) {
    if (!this.color.value || this.color.alpha <= 0) return;

    context.save();

    context.globalAlpha = this.color.alpha;
    context.fillStyle = this.color.value;
    context.fillRect(x, y, width, height);

    context.restore();
  }

  update(context) {
    if (this.isFinished) return;

    this.handleColorChange(context);

    // Progression de l'ondulation
    if (this.wave.isActive) {
      this.wave.time += this.wave.speed;

      const difference = this.wave.targetAmplitude - this.wave.amplitude;

      this.wave.amplitude += difference * 0.12;

      if (this.wave.targetAmplitude === 0 && this.wave.amplitude < 0.05) {
        this.wave.amplitude = 0;
        this.wave.isActive = false;
      }
    }

    this.isFinished = this.color.value === null && !this.wave.isActive;
  }
}
