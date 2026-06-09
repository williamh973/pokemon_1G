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
    this.backImage = this.config.image;
    this.hoveredBackImage = this.config.imageHovered;
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
    const backImage = this.isHovered ? this.hoveredBackImage : this.backImage;

    if (backImage) {
      context.drawImage(
        backImage,
        this.position.x,
        this.position.y,
        this.width * this.scale,
        this.height * this.scale
      );
    }
  }

  update(context) {
    this.draw(context);
    // drawDebugCollisionSquare(this, context, false);
  }
}
