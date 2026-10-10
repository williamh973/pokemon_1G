import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";

import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const PARASECT_SPECIES = {
  id: "parasect",

  pokedexId: "047",

  name: "PARASECT",

  types: ["BUG", "GRASS"],

  femaleRate: 50,

  catchRate: 75,

  growthRate: GROWTH_RATES_DATABASE.MEDIUM_FAST,

  baseExp: 128,

  baseStats: {
    hp: 60,
    attack: 95,
    defense: 80,
    specialAtt: 60,
    specialDef: 80,
    speed: 30,
  },

  animations: {
    idle: {
      front: "parasect_front_idle",
      back: "parasect_back_idle",
    },
  },

  evolutions: [],

  learnset: {
    levelUp: [
      { level: 1, move: MOVES_DATABASE.scratch },
      { level: 1, move: MOVES_DATABASE.stunSpore },
      { level: 1, move: MOVES_DATABASE.leechLife },
      { level: 1, move: MOVES_DATABASE.poisonPowder },
      { level: 25, move: MOVES_DATABASE.spore },
      { level: 33, move: MOVES_DATABASE.slash },
      { level: 41, move: MOVES_DATABASE.growth },
      { level: 49, move: MOVES_DATABASE.gigaDrain },
      { level: 57, move: MOVES_DATABASE.aromatherapy },
    ],

    tmhm: [
      "Toxik",
      "Balle Graine",
      "Puissance Cachée",
      "Zénith",
      "Ultralaser",
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
