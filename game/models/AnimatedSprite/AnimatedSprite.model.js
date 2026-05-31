export class AnimatedSprite {
  constructor(config, isPlaying = true) {
    this.config = config;
    this.position = {
      x: this.config.x,
      y: this.config.y,
    };
    this.image = new Image();
    this.image.src = this.config.src;

    this.frameWidth = this.config.frameWidth;
    this.frameHeight = this.config.frameHeight;
    this.frameCount = this.config.frames;
    this.frameDelay = this.config.frameDelay;
    this.scale = this.config.scale;
    this.loop = this.config.loop ?? true;
    this.currentFrame = 0;
    this.counter = 0;
    this.isPlaying = isPlaying;
  }

  play() {
    this.isPlaying = true;
  }

  stop() {
    this.isPlaying = false;
  }

  update(context) {
    if (!this.isPlaying) {
      this.draw(context);
      return;
    }

    this.draw(context);

    this.counter++;

    if (this.counter < this.frameDelay) return;

    this.counter = 0;
    this.currentFrame++;

    if (this.currentFrame >= this.frameCount) {
      if (this.loop) this.currentFrame = 0;
      else {
        this.currentFrame = this.frameCount - 1;
        this.isPlaying = false;
      }
    }
  }

  draw(context) {
    context.drawImage(
      this.image,
      this.currentFrame * this.frameWidth,
      0,
      this.frameWidth,
      this.frameHeight,
      this.position.x,
      this.position.y,
      this.frameWidth * this.scale,
      this.frameHeight * this.scale
    );
  }
}
