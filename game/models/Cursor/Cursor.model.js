import { rightArrow } from "../../assets/images/ui/misc/misc.assets.js";

export class Cursor {
  constructor() {
    this.position = {
      x: 0,
      y: 0,
    };
    this.width = 16;
    this.height = 16;
    this.image = rightArrow;
  }

  draw(context, positionX, cursorY) {
    context.drawImage(this.image, positionX, cursorY, this.width, this.height);
  }

  update() {
    this.draw(context, positionX, positionY);
  }
}
