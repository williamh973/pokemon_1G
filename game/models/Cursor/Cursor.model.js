import {
  rightArrowFocusedCursor,
  rightArrowDefaultCursor,
  worldMapUnlockedCursor,
  worldMapLockedCursor,
} from "../../assets/images/ui/misc/misc.assets.js";
import { CURSOR_TYPES } from "../../logic/gameplay/worldMap/worldMapCursorTypes.gameplay.js";

export class Cursor {
  constructor(type = CURSOR_TYPES.MENU) {
    this.type = type;
    this.cursorType = CURSOR_TYPES;
    this.state = {
      idle: "idle",
      focused: "focused",
    };

    this.position = {
      x: 0,
      y: 0,
    };

    this.width = 16;
    this.height = 16;
    this.scale = 1;
    this.animationCounter = 0;
    this.isVisible = false;
    this.image = null;
  }

  draw(context, positionX, cursorY) {
    const width = this.width * this.scale;
    const height = this.height * this.scale;

    context.drawImage(
      this.image,
      positionX - (width - this.width) / 2,
      cursorY - (height - this.height) / 2,
      width,
      height
    );
  }

  updatePulse() {
    this.animationCounter++;

    const period = 60;

    this.scale =
      1 + 0.2 * Math.sin((this.animationCounter / period) * Math.PI * 2);
  }

  update(context, positionX, cursorY, isFocused) {
    if (!this.isVisible) return;
    this.checkCursorState(isFocused);

    if (this.type === CURSOR_TYPES.WORLDMAP) this.updatePulse();
    else this.scale = 1;

    this.draw(context, positionX, cursorY);
  }

  checkCursorState(isFocused) {
    switch (this.type) {
      case CURSOR_TYPES.MENU:
        this.image = isFocused
          ? rightArrowFocusedCursor
          : rightArrowDefaultCursor;
        break;

      case CURSOR_TYPES.WORLDMAP:
        this.image = isFocused ? worldMapUnlockedCursor : worldMapLockedCursor;
        break;
    }
  }
}
