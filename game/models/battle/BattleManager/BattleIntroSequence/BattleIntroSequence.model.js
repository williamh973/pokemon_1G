export class BattleIntroSequence {
  constructor(game, frontViewer, backViewer, frontSlot, backSlot, onFinish) {
    this.game = game;
    this.frontViewer = frontViewer;
    this.backViewer = backViewer;
    this.frontSlot = frontSlot;
    this.backSlot = backSlot;
    this.onFinish = onFinish;
    this.isFinished = false;
  }

  start() {
    this.setSpritesInitalPositions();
    this.openSpriteViewer();
  }

  setSpritesInitalPositions() {
    this.frontViewer.sprite.position.x =
      0 - this.frontViewer.sprite.config.frameWidth;

    this.backViewer.sprite.position.x =
      this.game.canvas.width + this.backViewer.sprite.config.frameWidth;
  }

  openSpriteViewer() {
    this.frontViewer.isOpen = true;
    this.backViewer.isOpen = true;
  }

  frontSpriteFinalPosition() {
    return (
      this.frontViewer.sprite.position.x >=
      this.frontSlot.position.x +
        (this.frontSlot.width - this.frontViewer.sprite.frameWidth) / 2
    );
  }

  backSpriteFinalPosition() {
    return this.backViewer.sprite.position.x <= this.backSlot.position.x;
  }

  update() {
    if (this.isFinished) return;

    if (!this.frontSpriteFinalPosition()) {
      this.frontViewer.sprite.position.x += 4;
    }

    if (!this.backSpriteFinalPosition()) {
      this.backViewer.sprite.position.x -= 4;
    }

    if (this.frontSpriteFinalPosition() && this.backSpriteFinalPosition()) {
      this.isFinished = true;
      this.onFinish?.();
    }
  }
}
