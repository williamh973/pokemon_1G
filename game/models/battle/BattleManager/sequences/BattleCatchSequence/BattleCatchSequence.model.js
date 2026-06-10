export class BattleCatchSequence {
  constructor(game, viewers, frontSlot, onFinish) {
    this.game = game;
    this.viewers = viewers;
    this.frontSlot = frontSlot;
    this.onFinish = onFinish;
    this.isFinished = false;
    this.pokeball = null;
  }

  start() {}

  update() {}
}
