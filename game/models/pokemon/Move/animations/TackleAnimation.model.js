export class TackleAnimation {
  constructor(game, viewers, turnAction) {
    this.game = game;
    this.viewers = viewers;
    this.turnAction = turnAction;
    this.pokemon = this.turnAction.pokemon;
    this.target = this.turnAction.target;
    this.move = this.turnAction.move;

    if (this.viewers.front.slot.content === this.pokemon) {
      this.pokemonSlot = this.viewers.front.slot;
      this.key = "front";
    } else {
      this.pokemonSlot = this.viewers.back.slot;
      this.key = "back";
    }

    this.pokemonInitialPositionX = this.viewers[this.key].sprite.position.x;
    this.attackDistance = 50;
    this.direction = this.pokemonSlot.attackDirection;

    this.attackTargetX =
      this.pokemonInitialPositionX + this.attackDistance * this.direction;

    this.isFinished = false;
    this.isSlideFirstStepFinished = false;
    this.isFinalPosition = false;
  }

  checkSpriteFirstStepPosition() {
    const currentX = this.viewers[this.key].sprite.position.x;

    return this.direction > 0
      ? currentX >= this.attackTargetX
      : currentX <= this.attackTargetX;
  }

  update() {
    if (
      !this.checkSpriteFirstStepPosition() &&
      !this.isSlideFirstStepFinished
    ) {
      this.viewers[this.key].sprite.position.x += 4 * this.direction;
    }

    if (this.checkSpriteFirstStepPosition()) {
      this.isSlideFirstStepFinished = true;
    }

    if (this.isSlideFirstStepFinished) {
      this.viewers[this.key].sprite.position.x = this.pokemonInitialPositionX;
      this.isFinished = true;
    }
  }
}
