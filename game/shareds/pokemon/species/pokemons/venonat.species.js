import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";

import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const VENONAT_SPECIES = {
  id: "venonat",

  pokedexId: "048",

  name: "MIMITOSS",

  types: ["BUG", "POISON"],

  femaleRate: 50,

  catchRate: 190,

  growthRate: GROWTH_RATES_DATABASE.MEDIUM_FAST,

  baseExp: 75,

  baseStats: {
    hp: 60,
    attack: 55,
    defense: 50,
    specialAtt: 40,
    specialDef: 55,
    speed: 45,
  },

  animations: {
    idle: {
      front: "venonat_front_idle",
      back: "venonat_back_idle",
    },
  },

  evolutions: [{ method: "level", level: 31, target: "venomoth" }],

  learnset: {
    levelUp: [
      { level: 1, move: MOVES_DATABASE.tackle },
      { level: 1, move: MOVES_DATABASE.disable },
      { level: 1, move: MOVES_DATABASE.foresight },
      { level: 9, move: MOVES_DATABASE.supersonic },
      { level: 17, move: MOVES_DATABASE.confusion },
      { level: 20, move: MOVES_DATABASE.poisonPowder },
      { level: 25, move: MOVES_DATABASE.leechLife },
      { level: 28, move: MOVES_DATABASE.stunSpore },
      { level: 33, move: MOVES_DATABASE.psybeam },
      { level: 36, move: MOVES_DATABASE.sleepPowder },
      { level: 41, move: MOVES_DATABASE.psychic },
    ],

    tmhm: [
      "Toxik",
      "Puissance Cachée",
      "Zénith",
      "Abri",
      "Giga-Sangsue",
      "Frustration",
      "Lance-Soleil",
      "Retour",
      "Psyko",
      "Reflet",
      "Bomb-Beurk",
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
