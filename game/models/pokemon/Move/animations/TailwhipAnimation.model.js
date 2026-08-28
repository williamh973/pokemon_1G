export class TailWhipAnimation {
  constructor(game, viewers, turnAction) {
    this.game = game;
    this.viewers = viewers;
    this.turnAction = turnAction;

    this.pokemon = this.turnAction.pokemon;
    this.target = this.turnAction.target;
    this.move = this.turnAction.move;

    if (this.viewers.front.slot.content === this.target) {
      this.targetViewer = this.viewers.front;
      this.key = "front";
    } else {
      this.targetViewer = this.viewers.back;
      this.key = "back";
    }

    this.targetInitialPositionX = this.targetViewer.sprite.position.x;

    this.shakeDistance = 5;
    this.shakeSpeed = 2;

    this.shakeCount = 0;
    this.maxShakeCount = 6;

    this.direction = 1;

    this.isFinished = false;
  }

  update() {
    if (this.isFinished) return;

    const sprite = this.targetViewer.sprite;

    sprite.position.x += this.shakeSpeed * this.direction;

    if (
      Math.abs(sprite.position.x - this.targetInitialPositionX) >=
      this.shakeDistance
    ) {
      this.direction *= -1;
      this.shakeCount++;
    }

    if (this.shakeCount >= this.maxShakeCount) {
      sprite.position.x = this.targetInitialPositionX;

      this.isFinished = true;
    }
  }
}
