import { SCRATCH_ANIMATION } from "../../../../render/config/battle/pokemon/moves/scratchAnimation.config.js";
import { SpriteViewer } from "../../../SpriteViewer/SpriteViewer.model.js";

export class ScratchAnimation {
  constructor(game, viewers, turnAction) {
    this.game = game;
    this.viewers = viewers;
    this.turnAction = turnAction;

    this.pokemon = turnAction.pokemon;
    this.target = turnAction.target;
    this.move = turnAction.move;

    if (this.viewers.front.slot.content === this.target) {
      this.targetViewer = this.viewers.front;
      this.key = "front";
    } else {
      this.targetViewer = this.viewers.back;
      this.key = "back";
    }

    this.viewer = new SpriteViewer(
      this.game,
      SCRATCH_ANIMATION,
      this.targetViewer.slot
    );

    this.viewer.sprite.position.x = this.targetViewer.sprite.position.x;
    this.viewer.sprite.position.y = this.targetViewer.sprite.position.y;

    this.viewer.isOpen = true;

    this.isFinished = false;
  }

  update(context) {
    if (this.isFinished) return;

    this.viewer.update(context);
    if (!this.viewer.sprite.isPlaying) {
      this.viewer.isOpen = false;
      this.isFinished = true;
    }
  }
}
