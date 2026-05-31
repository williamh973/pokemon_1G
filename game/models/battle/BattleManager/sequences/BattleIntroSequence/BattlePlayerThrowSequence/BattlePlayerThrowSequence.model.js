import { SpriteViewer } from "../../../../../SpriteViewer/SpriteViewer.model.js";

export class BattlePlayerThrowSequence {
  constructor(game, viewers, onFinish, backSlot) {
    this.game = game;
    this.viewers = viewers;
    this.backSlot = backSlot;
    this.onFinish = onFinish;
    this.isFinished = false;
  }

  start() {
    this.viewers.back.sprite.play();
  }

  isBackSpriteOut() {
    return (
      this.viewers.back.sprite.position.x +
        this.viewers.back.sprite.frameWidth <=
      -20
    );
  }

  update() {
    if (this.isFinished) return;

    if (!this.isBackSpriteOut()) {
      return (this.viewers.back.sprite.position.x -= 3);
    }

    this.isFinished = true;
    this.onFinish?.();
    this.viewers.back.sprite.position.x = this.viewers.back.sprite.position.x;
  }
}
