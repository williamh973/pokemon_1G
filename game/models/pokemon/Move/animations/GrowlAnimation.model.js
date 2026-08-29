import { GROWL_ANIMATION } from "../../../../render/config/battle/pokemon/moves/growlAnimation.config.js";
import { SpriteViewer } from "../../../SpriteViewer/SpriteViewer.model.js";

export class GrowlAnimation {
  constructor(game, viewers, turnAction) {
    this.game = game;
    this.viewers = viewers;
    this.turnAction = turnAction;

    this.pokemon = this.turnAction.pokemon;
    this.target = this.turnAction.target;
    this.move = this.turnAction.move;

    if (this.viewers.front.slot.content === this.pokemon) {
      this.pokemonViewer = this.viewers.front;
      this.key = "front";
    } else {
      this.pokemonViewer = this.viewers.back;
      this.key = "back";
    }

    this.viewer = new SpriteViewer(
      this.game,
      GROWL_ANIMATION,
      this.pokemonViewer.slot
    );

    this.viewer.sprite.flipX = this.key === "front";

    if (this.key === "front")
      this.viewer.sprite.position.x = this.pokemonViewer.sprite.position.x - 50;
    else
      this.viewer.sprite.position.x = this.pokemonViewer.sprite.position.x + 50;

    this.viewer.sprite.position.y = this.pokemonViewer.sprite.position.y - 60;

    this.initialPositionX = this.pokemonViewer.sprite.position.x;

    this.shakeDistance = 4;
    this.shakeSpeed = 2;

    this.shakeCount = 0;
    this.maxShakeCount = 8;

    this.direction = 1;

    this.viewer.isOpen = true;
    this.isFinished = false;
  }

  update(context) {
    if (this.isFinished) return;

    this.viewer.update(context);

    const sprite = this.pokemonViewer.sprite;

    sprite.position.x += this.shakeSpeed * this.direction;

    if (
      Math.abs(sprite.position.x - this.initialPositionX) >= this.shakeDistance
    ) {
      this.direction *= -1;
      this.shakeCount++;
    }

    if (this.shakeCount >= this.maxShakeCount) {
      sprite.position.x = this.initialPositionX;
    }

    if (!this.viewer.sprite.isPlaying) {
      this.viewer.isOpen = false;
      this.isFinished = true;
    }
  }
}
