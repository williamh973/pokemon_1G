export class Canvas {
  constructor(canvas) {
    this.context = canvas.getContext("2d");
    this.context.imageSmoothingEnabled = false;

    this.position = { x: 0, y: 0 };
    this.width = 320;
    this.height = 320;

    canvas.width = this.width;
    canvas.height = this.height;

    // Tremblement du Canvas
    this.isShaking = false;
    this.shakeDuration = 0;
    this.shakeElapsed = 0;
    this.shakeIntensity = 0;
  }

  startShake(duration = 1500, intensity = 3) {
    this.isShaking = true;
    this.shakeDuration = duration;
    this.shakeElapsed = 0;
    this.shakeIntensity = intensity;
  }

  beginFrame() {
    this.context.save();

    if (!this.isShaking) return;

    // Progression du tremblement
    this.shakeElapsed += 16;

    const progress = Math.min(this.shakeElapsed / this.shakeDuration, 1);

    if (progress >= 1) {
      this.isShaking = false;
      return;
    }

    // Le tremblement diminue progressivement
    const intensity = this.shakeIntensity * (1 - progress);

    const offsetX = (Math.random() * 2 - 1) * intensity;
    const offsetY = (Math.random() * 2 - 1) * intensity;

    this.context.translate(offsetX, offsetY);
  }

  endFrame() {
    this.context.restore();
  }

  clear() {
    this.context.clearRect(
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  draw() {
    this.context.fillStyle = "black";
    this.context.fillRect(
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  getContext() {
    return this.context;
  }
}
