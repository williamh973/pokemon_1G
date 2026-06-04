import {
  focusedRightArrow,
  rightArrow,
} from "../../assets/images/ui/misc/misc.assets.js";

export class Cursor {
  constructor() {
    this.position = {
      x: 0,
      y: 0,
    };
    this.width = 16;
    this.height = 16;
    this.isVisible = false;
    this.state = { idle: rightArrow, focused: focusedRightArrow };
    this.image = this.state.idle;
    this.row = 0;
    this.col = 0;
  }

  draw(context, positionX, cursorY) {
    context.drawImage(this.image, positionX, cursorY, this.width, this.height);
  }

  update(context, positionX, cursorY, isFocused) {
    if (!this.isVisible) return;
    this.checkFocus(isFocused);
    this.draw(context, positionX, cursorY);
  }

  checkFocus(isFocused) {
    isFocused ? (this.image = focusedRightArrow) : (this.image = rightArrow);
  }
}
