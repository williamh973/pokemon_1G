import { POKEBALL_STATES } from "../../../../../logic/gameplay/battle/pokeball/pokeball.states.js";
import { getSpeciesData } from "../../../../../shareds/utils/pokemon/species/species.utils.js";
import { Pokeball } from "../../Pokeball/Pokeball.model.js";

export class BattleCatchSequence {
  constructor(game, viewers, frontSlot, wildPokemon, usedItem) {
    this.game = game;
    this.viewers = viewers;
    this.frontSlot = frontSlot;
    this.wildPokemon = wildPokemon;
    this.usedItem = usedItem;
    this.isFinished = false;
    this.pokeball = null;
    this.isStarted = false;
    this.randoms = [];
    this.secondFormulaValue = null;
    this.calculateCatchProbability();
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

  generateFirstFormula() {
    const speciesCatchRate = getSpeciesData(this.wildPokemon.id).catchRate;
    const ballCatchRate = this.usedItem.value;
    const statutBonus = 1;

    return Math.floor(
      (ballCatchRate -
        ((2 / 3) * this.wildPokemon.stats.hp) / this.wildPokemon.stats.maxHp) *
        speciesCatchRate *
        ballCatchRate *
        statutBonus
    );
  }

  generateSecondFormula(firstFormulaValue) {
    return (
      Math.floor((Math.pow(2, 16) - 1) * firstFormulaValue) /
      Math.floor((Math.pow(2, 8) - 1) * 4)
    );
  }

  getRandom65535() {
    return Math.floor(Math.random() * 65_535);
  }

  calculateCatchProbability() {
    const allowedBalls = [
      "POKE_BALL",
      "SUPER_BALL",
      "HYPER_BALL",
      "MASTER_BALL",
    ];

    if (!allowedBalls.includes(this.usedItem.id)) return;

    const firstFormulaValue = this.generateFirstFormula();
    const maxSpeciesCatchRate = 255;
    if (firstFormulaValue >= maxSpeciesCatchRate)
      console.log("Le pokémon est attrapé");
    else {
      this.secondFormulaValue = this.generateSecondFormula(firstFormulaValue);
      const randomCount = 4;

      for (let i = 0; i < randomCount; i++) {
        // Si ces quatre nombres sont tous inférieurs ou égaux à secondFormulaValue, le Pokémon est attrapé.
        this.randoms.push(this.getRandom65535());
      }
      // console.log(this.randoms, this.secondFormulaValue);
    }

    // console.log(firstFormulaValue);
    // console.log(this.wildPokemon);
    // console.log(this.usedItem);
  }

  update(context) {
    if (this.pokeball) {
      this.pokeball.update(context);

      switch (this.pokeball.state) {
        case POKEBALL_STATES.IMPACT:
          this.pokeball.showOpenedPokeball();
          this.pokeball.createPokeballReleaseEffect();
          break;

        case POKEBALL_STATES.RELEASE:
          this.pokeball.pokeballReleaseEffect?.update(context);
          break;

        case POKEBALL_STATES.ESCAPE:
          this.isFinished = true;
          this.usedItem = null;

          break;

        // case "throw":
        //   break;

        // case "throw":
        //   break;

        // case "throw":
        //   break;

        default:
          break;
      }
    }
  }
}
