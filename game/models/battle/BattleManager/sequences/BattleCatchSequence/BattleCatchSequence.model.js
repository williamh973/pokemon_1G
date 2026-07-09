import { POKEBALL_STATES } from "../../../../../logic/gameplay/battle/pokeball/pokeball.states.js";
import { calculateCatchProbability } from "../../../../../logic/gameplay/battle/sequences/catchSequence/calculateCatchProbability.gameplay.js";
import { Pokeball } from "../../Pokeball/Pokeball.model.js";

export class BattleCatchSequence {
  constructor(game, viewers, wildPokemon, usedItem) {
    this.game = game;
    this.viewers = viewers;
    this.frontSlot = this.viewers.front.slot;
    this.wildPokemon = wildPokemon;
    this.usedItem = usedItem;
    this.isFinished = false;
    this.isStarted = false;
    this.hasEscaped = false;
    this.hasCaptured = false;
    this.randoms = [];
    this.secondFormulaValue = null;
    this.pokeball = null;
    this.countdown = 30;
    this.calculateCatchProbability();
  }

  handleCountdownBeforeStart() {
    if (this.countdown > 0) this.countdown--;
    else this.countdown = 30;

    if (this.countdown === 0 && !this.isStarted) this.start();
  }

  start() {
    this.isStarted = true;

    this.pokeball = new Pokeball(
      this.game,
      {
        position: {
          x: 0,
          y: this.viewers.back.sprite.position.y,
        },
        vx: 4.7,
        vy: -9.8,
        gravity: 0.3,
        angle: 1,
      },
      this.frontSlot,
      this.randoms,
      this.secondFormulaValue,
      this
    );
  }

  calculateCatchProbability() {
    const result = calculateCatchProbability(this.usedItem, this.wildPokemon);
    this.randoms = result.randoms;
    this.secondFormulaValue = result.secondFormulaValue;
  }

  update(context) {
    this.handleCountdownBeforeStart();

    if (this.pokeball) {
      this.pokeball.update(context);
      const sequence = this.game.battleManager.sequenceManager;

      switch (this.pokeball.state) {
        case POKEBALL_STATES.IMPACT:
          this.pokeball.showOpenedPokeball(11, 13);
          this.pokeball.createPokeballReleaseEffect();
          sequence.startPokemonDisappearsSequence("front");
          break;

        case POKEBALL_STATES.RELEASE:
          sequence.pokemonDisappearsSequence?.update();
          break;

        case POKEBALL_STATES.FALL:
          sequence.pokemonDisappearsSequence = null;
          break;

        case POKEBALL_STATES.ESCAPE:
          if (!this.hasEscaped) {
            this.pokeball.showOpenedPokeball(11, 30);
            this.pokeball.createPokeballReleaseEffect();
            sequence.startPokemonAppearsSequence(this.wildPokemon, "front");
            this.hasEscaped = true;
          }
          break;

        case POKEBALL_STATES.CAPTURE:
          if (!this.hasCaptured) this.hasCaptured = true;
          break;

        default:
          break;
      }
    }
  }
}
