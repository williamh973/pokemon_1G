export class PokemonFaintSequence {
  constructor(game) {
    this.game = game;

    const { target } = this.game.battleManager.turnManager.koAction;

    if (this.game.battleManager.wildPokemon === target) this.key = "front";
    else this.key = "back";

    this.viewer = this.game.battleManager.viewers[this.key];
    this.slot = this.viewer.slot;

    this.isStarted = false;
    this.isFinished = false;
  }

  start() {
    this.isStarted = true;
  }

  update() {
    if (!this.isStarted) return;

    const sprite = this.viewer.sprite;
    const paddingY = 100;

    sprite.position.y += 6;

    if (sprite.position.y >= this.slot.position.y + this.slot.height) {
      sprite.position.y =
        this.game.canvas.position.y + this.game.canvas.height + paddingY;
      this.isFinished = true;
    }
  }
}
