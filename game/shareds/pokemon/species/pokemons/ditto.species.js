import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";

import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const DITTO_SPECIES = {
  id: "ditto",
  pokedexId: "132",
  name: "METAMORPH",
  types: ["NORMAL"],
  femaleRate: 0,
  catchRate: 35,
  growthRate: GROWTH_RATES_DATABASE.MEDIUM_FAST,
  baseExp: 61,
  baseStats: {
    hp: 48,
    attack: 48,
    defense: 48,
    specialAtt: 48,
    specialDef: 48,
    speed: 48,
  },
  animations: {
    idle: {
      front: "ditto_front_idle",
      back: "ditto_back_idle",
    },
  },
  evolutions: [],
  learnset: {
    levelUp: [{ level: 1, move: MOVES_DATABASE.transform }],
    tmhm: [],
  },
};
