export class Slot {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  center(spriteWidth, spriteHeight) {
    return {
      x: this.x + (this.width - spriteWidth) / 2,
      y: this.y + (this.height - spriteHeight) / 2,
    };
  }
}
