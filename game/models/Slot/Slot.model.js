import { drawDebugCollisionSquare } from "../../shareds/utils/tile/tile.utils.js";

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
    this.isHovered = false;
  }

  center(spriteWidth, spriteHeight) {
    return {
      x: this.position.x + (this.width - spriteWidth) / 2,
      y: this.position.y + (this.height - spriteHeight) / 2,
    };
  }

  draw(context) {
    const image = this.isHovered ? this.hoveredImage : this.image;

    if (image) {
      context.drawImage(
        image,
        this.position.x,
        this.position.y,
        this.width * this.scale,
        this.height * this.scale
      );
    }
  }

  update(context) {
    this.draw(context);
    // drawDebugCollisionSquare(this, context, true);
  }
}
