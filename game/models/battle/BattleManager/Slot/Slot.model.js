export class Slot {
  constructor(config) {
    this.config = config;
    this.position = {
      x: this.config.positionX,
      y: this.config.positionY,
    };
    this.width = this.config.width;
    this.height = this.config.height;
    this.image = this.config.image;
    this.hoveredImage = this.config.imageHovered;
    this.scale = this.config.scale;
    this.content = null;
  }

  center(spriteWidth, spriteHeight) {
    return {
      x: this.position.x + (this.width - spriteWidth) / 2,
      y: this.position.y + (this.height - spriteHeight) / 2,
    };
  }

  draw(context) {
    context.strokeStyle = "red";
    context.lineWidth = 2;

    if (this.config.image) {
      context.drawImage(
        this.config.image,
        this.position.x,
        this.position.y,
        this.width * this.scale,
        this.height * this.scale
      );
    }
  }

  update(context) {
    this.draw(context);
  }
}
