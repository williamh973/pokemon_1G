export class QuickAttackAnimation {
  constructor(game, viewers, turnAction) {
    this.game = game;
    this.viewers = viewers;
    this.turnAction = turnAction;
    this.pokemon = turnAction.pokemon;
    this.target = turnAction.target;
    this.move = turnAction.move;

    if (this.viewers.front.slot.content === this.pokemon) {
      this.pokemonViewer = this.viewers.front;
      this.key = "front";
    } else {
      this.pokemonViewer = this.viewers.back;
      this.key = "back";
    }

    this.initialPositionX = this.pokemonViewer.sprite.position.x;

    this.distance = 150;
    this.speed = 10;

    this.direction = this.key === "front" ? 1 : -1;

    this.isReturning = false;
    this.isFinished = false;
  }

  update() {
    if (this.isFinished) return;

    const sprite = this.pokemonViewer.sprite;

    if (!this.isReturning) {
      sprite.position.x += this.speed * this.direction;

      if (
        Math.abs(sprite.position.x - this.initialPositionX) >= this.distance
      ) {
        this.isReturning = true;
      }
    } else {
      sprite.position.x -= this.speed * this.direction;

      if (Math.abs(sprite.position.x - this.initialPositionX) <= this.speed) {
        sprite.position.x = this.initialPositionX;
        this.isFinished = true;
      }
    }
  }
}
