import { getMoveAnimationById } from "../../../../../shareds/utils/battle/moves.utils.js";

export class PokemonUseMoveSequence {
  constructor(game, viewers, turnAction) {
    this.game = game;
    this.viewers = viewers;
    this.turnAction = turnAction;
    this.animation = null;
    this.isFinished = false;

    const AnimationClass = getMoveAnimationById(this.turnAction.move.id);

    this.animation = new AnimationClass(
      this.game,
      this.viewers,
      this.turnAction
    );
  }

  update() {
    if (!this.animation?.isFinished) {
      this.animation?.update();
    } else {
      this.animation = null;
      this.isFinished = true;
    }
  }
}
