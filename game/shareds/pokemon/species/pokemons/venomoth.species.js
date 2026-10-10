import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";

import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const VENOMOTH_SPECIES = {
  id: "venomoth",

  pokedexId: "049",

  name: "AÉROMITE",

  types: ["BUG", "POISON"],

  femaleRate: 50,

  catchRate: 75,

  growthRate: GROWTH_RATES_DATABASE.MEDIUM_FAST,

  baseExp: 138,

  baseStats: {
    hp: 70,
    attack: 65,
    defense: 60,
    specialAtt: 90,
    specialDef: 75,
    speed: 90,
  },

  animations: {
    idle: {
      front: "venomoth_front_idle",
      back: "venomoth_back_idle",
    },
  },

  evolutions: [],

  learnset: {
    levelUp: [
      { level: 1, move: MOVES_DATABASE.tackle },
      { level: 1, move: MOVES_DATABASE.silverWind },
      { level: 1, move: MOVES_DATABASE.disable },
      { level: 1, move: MOVES_DATABASE.foresight },
      { level: 1, move: MOVES_DATABASE.supersonic },
      { level: 9, move: MOVES_DATABASE.supersonic },
      { level: 17, move: MOVES_DATABASE.confusion },
      { level: 20, move: MOVES_DATABASE.poisonPowder },
      { level: 25, move: MOVES_DATABASE.leechLife },
      { level: 28, move: MOVES_DATABASE.stunSpore },
      { level: 31, move: MOVES_DATABASE.gust },
      { level: 36, move: MOVES_DATABASE.psybeam },
      { level: 42, move: MOVES_DATABASE.sleepPowder },
      { level: 52, move: MOVES_DATABASE.psychic },
    ],

    tmhm: [
      "Toxik",
      "Puissance Cachée",
      "Zénith",
      "Ultralaser",
      "Abri",
      "Giga-Sangsue",
      "Frustration",
      "Lance-Soleil",
      "Retour",
      "Psyko",
      "Reflet",
      "Bomb-Beurk",
      "Aéropique",
      "Façade",
      "Force Secrète",
      "Repos",
      "Attraction",
      "Larcin",
      "Échange",
      "Flash",
    ],
  },
};
