import { POKEBALL_STATES } from "../../../../../logic/gameplay/battle/pokeball/pokeball.states.js";
import { calculateCatchProbability } from "../../../../../logic/gameplay/battle/sequences/catchSequence/calculateCatchProbability.gameplay.js";
import { Pokeball } from "../../Pokeball/Pokeball.model.js";

export class BattleCatchSequence {
  constructor(game, viewers, frontSlot, wildPokemon, usedItem) {
    this.countdown = 30;
    this.game = game;
    this.viewers = viewers;
    this.frontSlot = frontSlot;
    this.wildPokemon = wildPokemon;
    this.usedItem = usedItem;
    this.isFinished = false;
    this.pokeball = null;
    this.isStarted = false;
    this.hasAppearsSequenceStarted = false;
    this.randoms = [];
    this.secondFormulaValue = null;
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
      true
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
          this.pokeball.showOpenedPokeball();
          this.pokeball.createPokeballReleaseEffect();
          break;

        case POKEBALL_STATES.RELEASE:
          this.pokeball.pokeballReleaseEffect?.update(context);
          sequence.pokemonDisappearsSequence.update();
          break;

        case POKEBALL_STATES.ESCAPE:
          this.pokeball.pokeballReleaseEffect?.update(context);

          if (!this.hasAppearsSequenceStarted) {
            this.usedItem = null;
            this.hasAppearsSequenceStarted = true;
            sequence.startPokemonAppearsSequence(this.wildPokemon, "front");
          }

          break;

        default:
          break;
      }
    }
  }
}
