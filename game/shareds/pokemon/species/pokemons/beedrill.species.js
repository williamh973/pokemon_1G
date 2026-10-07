import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";
import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const BEEDRILL_SPECIES = {
  id: "beedrill",

  pokedexId: "015",

  name: "DARDARGNAN",

  types: ["BUG", "POISON"],

  femaleRate: 50,

  catchRate: 45,

  growthRate: GROWTH_RATES_DATABASE.MEDIUM_FAST,

  baseExp: 159,

  baseStats: {
    hp: 65,
    attack: 80,
    defense: 40,
    specialAtt: 45,
    specialDef: 80,
    speed: 75,
  },

  animations: {
    idle: {
      front: "beedrill_front_idle",
      back: "beedrill_back_idle",
    },
  },

  evolutions: [],

  learnset: {
    levelUp: [
      { level: 1, move: MOVES_DATABASE.acid },
      // { level: 10, move: MOVES_DATABASE.furyAttack },
      // { level: 15, move: MOVES_DATABASE.focusEnergy },
      // { level: 20, move: MOVES_DATABASE.twineedle },
      // { level: 25, move: MOVES_DATABASE.rage },
      // { level: 30, move: MOVES_DATABASE.pursuit },
      // { level: 35, move: MOVES_DATABASE.pinMissile },
      // { level: 40, move: MOVES_DATABASE.agility },
      // { level: 45, move: MOVES_DATABASE.endeavor },
    ],

    tmhm: [
      "Toxik",
      "Puissance Cachée",
      "Ultralaser",
      "Abri",
      "Giga-Sangsue",
      "Frustration",
      "Lance-Soleil",
      "Retour",
      "Casse-Brique",
      "Double Team",
      "Bomb-Beurk",
      "Aéropique",
      "Facade",
      "Force Secrète",
      "Repos",
      "Attraction",
      "Larcin",
      "Coupe",
      "Éclate-Roc",
    ],
  },
};
