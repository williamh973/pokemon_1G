import { rightArrow } from "../../assets/images/ui/misc/misc.assets.js";
import { drawDebugCollisionSquare } from "../../shareds/utils.js";

export class Cursor {
  constructor(currentMenuIndex) {
    this.position = {
      x: 0,
      y: currentMenuIndex,
    };
    this.width = 16;
    this.height = 16;
    this.image = rightArrow;
  }

  draw(context, parentPositionX, parentPositionY, heightLine) {
    context.drawImage(
      this.image,
      parentPositionX,
      parentPositionY + heightLine,
      this.width,
      this.height
    );
    drawDebugCollisionSquare(this, context, true);
  }

  update() {
    this.draw(context, positionX, positionY, index);
  }
}
