import { drawBox } from "../../shareds/utils/box/box.utils.js";
import { AnimatedSprite } from "../AnimatedSprite/AnimatedSprite.model.js";

export class SpriteViewer {
  constructor(game, animationConfig, slot) {
    this.game = game;
    this.animationConfig = animationConfig;
    this.slot = slot;
    this.isOpen = false;

    const center = this.slot.center(
      this.animationConfig.frameWidth,
      this.animationConfig.frameHeight
    );
    this.setPositions(center);
  }

  spritePosition(posX = 0, posY = 0) {
    this.sprite = new AnimatedSprite({
      ...this.animationConfig,
      x: posX,
      y: posY,
    });
  }

  setPositions(centerSlot) {
    // réservé pour d'éventuels placements spécifiques selon l'écran
    switch (this.game.state) {
      case "POKEDEX":
        this.spritePosition(centerSlot.x, centerSlot.y);
        break;
      case "BATTLE":
        this.spritePosition(centerSlot.x, centerSlot.y);
        break;
      case "CHOICE_MENU":
        this.spritePosition(centerSlot.x, centerSlot.y);
        break;
      default:
        this.spritePosition(centerSlot.x, centerSlot.y);
        break;
    }
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
