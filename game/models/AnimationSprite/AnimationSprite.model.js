export class AnimatedSprite {
  constructor(game, config) {
    this.setPosition(game, config);
    this.image = new Image();
    this.image.src = config.src;

    this.frameWidth = config.frameWidth;
    this.frameHeight = config.frameHeight;
    this.frameCount = config.frames;
    this.frameDelay = config.frameDelay;
    this.scale = config.scale;
    this.loop = config.loop ?? true;
    this.currentFrame = 0;
    this.counter = 0;
  }

  setPosition(game, config) {
    game.currentScreen?.name === "POKEDEX"
      ? (this.position = {
          x: config.positionX,
          y: config.positionY,
        })
      : (this.position = {
          x: config.positionX + 90,
          y: config.positionY + 70,
        });
  }

  update(context) {
    this.draw(context);
    this.counter++;

    if (this.counter < this.frameDelay) return;

    this.counter = 0;
    this.currentFrame++;

    if (this.currentFrame >= this.frameCount) {
      this.currentFrame = this.loop ? 0 : this.frameCount - 1;
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
