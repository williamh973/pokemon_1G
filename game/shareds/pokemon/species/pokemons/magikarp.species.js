import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";
import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const MAGIKARP_SPECIES = {
  id: "magikarp",
  pokedexId: "129",
  name: "MAGICARPE",
  types: ["WATER"],
  femaleRate: 50,
  catchRate: 255,
  growthRate: GROWTH_RATES_DATABASE.SLOW,
  baseExp: 40,
  baseStats: {
    hp: 20,
    attack: 10,
    defense: 55,
    specialAtt: 15,
    specialDef: 20,
    speed: 80,
  },
  animations: {
    idle: {
      front: "magikarp_front_idle",
      back: "magikarp_back_idle",
    },
  },
  evolutions: [
    {
      method: "level",
      level: 20,
      target: "gyarados",
    },
  ],
  learnset: {
    levelUp: [
      {
        level: 1,
        move: MOVES_DATABASE.splash,
      },
      {
        level: 15,
        move: MOVES_DATABASE.tackle,
      },
    ],
    tmhm: [],
  },
};
