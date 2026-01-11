import {
  activatedRightArrow,
  rightArrow,
} from "../../assets/images/ui/misc/misc.assets.js";

export class Cursor {
  constructor(isActivated) {
    this.position = {
      x: 0,
      y: 0,
    };
    this.width = 16;
    this.height = 16;
    this.isActivated = isActivated;
    this.state = { idle: rightArrow, active: activatedRightArrow };
    this.image = this.state.idle;
  }

  draw(context, positionX, cursorY) {
    context.drawImage(this.image, positionX, cursorY, this.width, this.height);
  }

  update(context, positionX, cursorY, isActivated) {
    this.isActivated = isActivated;
    this.isActivated
      ? (this.image = activatedRightArrow)
      : (this.image = rightArrow);
    this.draw(context, positionX, cursorY);
  }
}
