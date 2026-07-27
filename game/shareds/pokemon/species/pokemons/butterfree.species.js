import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";
import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const BUTTERFREE_SPECIES = {
  id: "butterfree",
  pokedexId: "012",
  name: "PAPILUSION",

  types: ["BUG", "FLYING"],

  femaleRate: 50,
  catchRate: 45,

  growthRate: GROWTH_RATES_DATABASE.MEDIUM_FAST,

  baseExp: 178,

  baseStats: {
    hp: 60,
    attack: 45,
    defense: 50,
    specialAtt: 90,
    specialDef: 80,
    speed: 70,
  },

  animations: {
    idle: {
      front: "butterfree_front_idle",
      back: "butterfree_back_idle",
    },
  },

  evolutions: [],

  learnset: {
    levelUp: [
      { level: 1, move: MOVES_DATABASE.confusion },
      { level: 10, move: MOVES_DATABASE.confusion },
      { level: 12, move: MOVES_DATABASE.poisonPowder },
      { level: 13, move: MOVES_DATABASE.stunSpore },
      { level: 14, move: MOVES_DATABASE.sleepPowder },
      { level: 18, move: MOVES_DATABASE.supersonic },
      { level: 23, move: MOVES_DATABASE.whirlwind },
      { level: 28, move: MOVES_DATABASE.psybeam },
    ],

    tmhm: [
      "Toxik",
      "Rafale Psy",
      "Méga-Sangsue",
      "Lance-Soleil",
      "Hyper Rayon",
      "Copie",
      "Reflet",
      "Protection",
      "Patience",
      "Repos",
      "Clonage",
      "Flash",
    ],
  },
};
