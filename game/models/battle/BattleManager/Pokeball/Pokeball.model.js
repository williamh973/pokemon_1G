import { BALL_CONFIG } from "../../../../render/config/item/ball/ball.config.js";
import { SpriteViewer } from "../../../SpriteViewer/SpriteViewer.model.js";
import { PokeballReleaseEffect } from "./PokeballReleaseEffect/PokeballReleaseEffect.model.js";

export class Pokeball {
  constructor(start, backSlot) {
    this.position = { ...start };

    this.image = BALL_CONFIG.POKEBALL.image;
    this.width = BALL_CONFIG.dimensions.width;
    this.height = BALL_CONFIG.dimensions.height;
    this.scale = BALL_CONFIG.dimensions.scale + 0.3;
    this.backSlot = backSlot;
    this.vx = 1.6;
    this.vy = -6;
    this.gravity = 0.3;
    this.angle = 1;
    this.hasImpacted = false;
  }

  onImpact() {
    this.pokeballReleaseEffect = new PokeballReleaseEffect(
      this.backSlot.position.x + this.backSlot.width / 2,
      this.backSlot.position.y + this.backSlot.height / 2
    );
  }

  update(context) {
    if (this.hasImpacted) {
      this.pokeballReleaseEffect?.update(context);
      return;
    }
    this.draw(context);
    this.position.x += this.vx;
    this.position.y += this.vy;

    this.vy += this.gravity;

    this.angle += 0.6;

    const backSlotPosX = this.backSlot.position.x + this.backSlot.width / 2;
    const backSlotPosY = this.backSlot.position.y + this.backSlot.height / 2;

    if (this.position.x >= backSlotPosX && this.position.y >= backSlotPosY) {
      this.position.x = backSlotPosX;
      this.position.y = backSlotPosY;
      this.hasImpacted = true;
      this.onImpact?.();
    }
  }

  draw(context) {
    context.save();
    context.translate(this.position.x, this.position.y);
    context.rotate(this.angle);

    context.drawImage(
      this.image,
      (-this.width * this.scale) / 2,
      (-this.height * this.scale) / 2,
      this.width * this.scale,
      this.height * this.scale
    );

    context.restore();
  }
}
