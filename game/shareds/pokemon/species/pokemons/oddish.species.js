import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";

import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const ODDISH_SPECIES = {
  id: "oddish",

  pokedexId: "043",

  name: "MYSTHERBE",

  types: ["GRASS", "POISON"],

  femaleRate: 50,

  catchRate: 255,

  growthRate: GROWTH_RATES_DATABASE.MEDIUM_SLOW,

  baseExp: 78,

  baseStats: {
    hp: 45,
    attack: 50,
    defense: 55,
    specialAtt: 75,
    specialDef: 65,
    speed: 30,
  },

  animations: {
    idle: {
      front: "oddish_front_idle",
      back: "oddish_back_idle",
    },
  },

  evolutions: [{ method: "level", level: 21, target: "gloom" }],

  learnset: {
    levelUp: [
      { level: 1, move: MOVES_DATABASE.acid },
      { level: 7, move: MOVES_DATABASE.sweetScent },
      { level: 14, move: MOVES_DATABASE.poisonPowder },
      { level: 16, move: MOVES_DATABASE.stunSpore },
      { level: 18, move: MOVES_DATABASE.sleepPowder },
      { level: 23, move: MOVES_DATABASE.acid },
      { level: 32, move: MOVES_DATABASE.moonlight },
      { level: 39, move: MOVES_DATABASE.petalDance },
    ],

    tmhm: [
      "Toxik",
      "Balle Graine",
      "Puissance Cachée",
      "Zénith",
      "Abri",
      "Méga-Sangsue",
      "Frustration",
      "Lance-Soleil",
      "Retour",
      "Reflet",
      "Bomb-Beurk",
      "Façade",
      "Force Secrète",
      "Repos",
      "Attraction",
      "Coupe",
      "Flash",
    ],
  },
};
