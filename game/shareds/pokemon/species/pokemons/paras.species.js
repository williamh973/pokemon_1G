import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";

import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const PARAS_SPECIES = {
  id: "paras",

  pokedexId: "046",

  name: "PARAS",

  types: ["BUG", "GRASS"],

  femaleRate: 50,

  catchRate: 190,

  growthRate: GROWTH_RATES_DATABASE.MEDIUM_FAST,

  baseExp: 70,

  baseStats: {
    hp: 35,
    attack: 70,
    defense: 55,
    specialAtt: 45,
    specialDef: 55,
    speed: 25,
  },

  animations: {
    idle: {
      front: "paras_front_idle",
      back: "paras_back_idle",
    },
  },

  evolutions: [{ method: "level", level: 24, target: "parasect" }],

  learnset: {
    levelUp: [
      { level: 1, move: MOVES_DATABASE.scratch },
      { level: 7, move: MOVES_DATABASE.stunSpore },
      { level: 13, move: MOVES_DATABASE.poisonPowder },
      { level: 19, move: MOVES_DATABASE.leechLife },
      { level: 25, move: MOVES_DATABASE.spore },
      { level: 31, move: MOVES_DATABASE.slash },
      { level: 37, move: MOVES_DATABASE.growth },
      { level: 43, move: MOVES_DATABASE.gigaDrain },
      { level: 49, move: MOVES_DATABASE.aromatherapy },
    ],

    tmhm: [
      "Toxik",
      "Balle Graine",
      "Puissance Cachée",
      "Zénith",
      "Abri",
      "Giga-Sangsue",
      "Frustration",
      "Lance-Soleil",
      "Retour",
      "Tunnel",
      "Reflet",
      "Bomb-Beurk",
      "Aéropique",
      "Façade",
      "Force Secrète",
      "Repos",
      "Attraction",
      "Larcin",
      "Coupe",
      "Éclate-Roc",
      "Flash",
    ],
  },
};
