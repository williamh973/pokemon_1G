export class BattleIntroSequence {
  constructor(game, viewers, onFinish) {
    this.game = game;
    this.viewers = viewers;
    this.frontSlot = viewers.front.slot;
    this.backSlot = viewers.back.slot;
    this.onFinish = onFinish;
    this.isFinished = false;
  }

  start() {
    this.setSpritesInitalPositions();
    this.openSpriteViewer();
  }

  setSpritesInitalPositions() {
    this.viewers.front.sprite.position.x =
      0 - this.viewers.front.sprite.config.frameWidth;

    this.viewers.back.sprite.position.x =
      this.game.canvas.width + this.viewers.back.sprite.config.frameWidth;
  }

  openSpriteViewer() {
    this.viewers.front.isOpen = true;
    this.viewers.back.isOpen = true;
  }

  checkFrontSpriteFinalPosition() {
    return (
      this.viewers.front.sprite.position.x >=
      this.frontSlot.position.x +
        (this.frontSlot.width - this.viewers.front.sprite.frameWidth) / 2
    );
  }

  backSpriteOutLeftSide() {
    return (
      this.viewers.back.sprite.position.x +
        this.viewers.back.sprite.frameWidth * 1.5 <=
      this.game.canvas.position.x
    );
  }

  checkBackSpriteFinalPosition() {
    return this.viewers.back.sprite.position.x <= this.backSlot.position.x;
  }

  update() {
    if (this.isFinished) return;

    if (!this.checkFrontSpriteFinalPosition()) {
      this.viewers.front.sprite.position.x += 4;
    }

    if (!this.checkBackSpriteFinalPosition()) {
      this.viewers.back.sprite.position.x -= 4.5;
    }

    if (
      this.checkFrontSpriteFinalPosition() &&
      this.checkBackSpriteFinalPosition()
    ) {
      this.isFinished = true;
      this.onFinish?.();
    }
  }
}
