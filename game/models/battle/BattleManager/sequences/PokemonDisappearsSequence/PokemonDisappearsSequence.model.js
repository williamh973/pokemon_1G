export class PokemonDisappearsSequence {
  constructor(game, key) {
    this.game = game;
    this.key = key;

    this.viewer = this.game.battleManager.viewers[this.key];
    this.slot = this.viewer.slot;
    this.isStarted = false;
    this.isFinished = false;
  }

  start() {
    this.isStarted = true;
  }

  update() {
    if (this.viewer.sprite.scale <= 0) {
      this.isFinished = true;
      return;
    }

    if (this.isStarted) {
      this.viewer.sprite.scale -= 0.04;
      this.updateSpritePosition();
    }
  }

  updateSpritePosition() {
    const sprite = this.viewer.sprite;

    const width = sprite.frameWidth * sprite.scale;
    const height = sprite.frameHeight * sprite.scale;

    sprite.position.x =
      this.slot.position.x + (this.slot.width - width) / 2 + 5;

    sprite.position.y =
      this.slot.position.y + (this.slot.height - height) / 2 - 10;
  }
}
