import { POKEBALL_STATES } from "../../../../../logic/gameplay/battle/pokeball/pokeball.states.js";
import { Pokeball } from "../../Pokeball/Pokeball.model.js";

export class BattlePlayerThrowSequence {
  constructor(game, viewers, onFinish) {
    this.game = game;
    this.viewers = viewers;
    this.backSlot = viewers.back.slot;
    this.onFinish = onFinish;
    this.pokeball = null;
    this.hasPokeballThrowed = false;
    this.isFinished = false;
  }

  start() {
    this.viewers.back.sprite.play();
  }

  playerThrowPokeball() {
    this.pokeball = new Pokeball(
      this.game,
      {
        position: {
          x: 0,
          y: this.viewers.back.sprite.position.y,
        },
        vx: 1.6,
        vy: -6,
        gravity: 0.3,
        angle: 1,
      },
      this.backSlot
    );
  }

  isBackSpriteOut() {
    return (
      this.viewers.back.sprite.position.x +
        this.viewers.back.sprite.frameWidth <=
      -20
    );
  }

  update(context) {
    if (this.isFinished) return;

    if (!this.isBackSpriteOut()) {
      return (this.viewers.back.sprite.position.x -= 3);
    }

    if (this.isBackSpriteOut() && !this.hasPokeballThrowed) {
      this.playerThrowPokeball();
      this.hasPokeballThrowed = true;
    }

    this.viewers.back.sprite.position.x = this.viewers.back.sprite.position.x;

    if (this.pokeball) {
      this.pokeball.update(context);

      switch (this.pokeball.state) {
        case POKEBALL_STATES.IMPACT:
          this.pokeball.createPokeballReleaseEffect();
          break;

        default:
          break;
      }
    }
  }
}
