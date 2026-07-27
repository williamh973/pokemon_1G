import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";
import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const METAPOD_SPECIES = {
  id: "metapod",
  pokedexId: "011",
  name: "CHRYSACIER",

  types: ["BUG"],

  femaleRate: 50,
  catchRate: 120,

  growthRate: GROWTH_RATES_DATABASE.MEDIUM_FAST,

  baseExp: 72,

  baseStats: {
    hp: 50,
    attack: 20,
    defense: 55,
    specialAtt: 25,
    specialDef: 25,
    speed: 30,
  },

  animations: {
    idle: {
      front: "metapod_front_idle",
      back: "metapod_back_idle",
    },
  },

  evolutions: [
    {
      method: "level",
      level: 10,
      target: "butterfree",
    },
  ],

  learnset: {
    levelUp: [
      {
        level: 1,
        move: MOVES_DATABASE.harden,
      },
    ],

    tmhm: [],
  },
};
