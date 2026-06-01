import { drawBox } from "../../shareds/utils/box/box.utils.js";
import { AnimatedSprite } from "../AnimatedSprite/AnimatedSprite.model.js";

export class SpriteViewer {
  constructor(game, animationConfig, slot) {
    this.game = game;
    this.animationConfig = animationConfig;
    this.slot = slot;
    this.isOpen = false;

    this.spritePosition();
  }

  spritePosition() {
    const center = this.slot.center(
      this.animationConfig.frameWidth,
      this.animationConfig.frameHeight
    );

    this.sprite = new AnimatedSprite({
      ...this.animationConfig,
      positionX: center.x,
      positionY: center.y,
    });
  }

  update(context) {
    if (!this.isOpen) return;

    this.draw(context);
    this.sprite.update(context);
  }

  draw(context) {
    this.drawGlassBehindAnimatedSprite(context);
  }

  drawGlassBehindAnimatedSprite(context) {
    switch (this.game.state) {
      case "POKEDEX":
        context.globalAlpha = 0.8;
        drawBox(context, 15, 15, 120, 120, "black", "black"); // dessine un fond derriere le sprite
        break;
      case "CHOICE_MENU":
        context.globalAlpha = 0.8;
        drawBox(context, 112, 95, 95, 100, "purple", "black");
        break;
      default:
        break;
    }
    context.globalAlpha = 1;
  }
}
