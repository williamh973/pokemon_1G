import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";
import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const CATERPIE_SPECIES = {
  id: "caterpie",
  pokedexId: "010",
  name: "CHENIPAN",

  types: ["BUG"],

  femaleRate: 50,
  catchRate: 255,

  growthRate: GROWTH_RATES_DATABASE.MEDIUM_FAST,

  baseExp: 39,

  baseStats: {
    hp: 45,
    attack: 30,
    defense: 35,
    specialAtt: 20,
    specialDef: 20,
    speed: 45,
  },

  animations: {
    idle: {
      front: "caterpie_front_idle",
      back: "caterpie_back_idle",
    },
  },

  evolutions: [
    {
      method: "level",
      level: 7,
      target: "metapod",
    },
  ],

  learnset: {
    levelUp: [
      {
        level: 1,
        move: MOVES_DATABASE.tackle,
      },
      {
        level: 1,
        move: MOVES_DATABASE.stringShot,
      },
    ],

    tmhm: [],
  },
};
