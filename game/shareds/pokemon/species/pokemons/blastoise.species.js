import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";

import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const BLASTOISE_SPECIES = {
  id: "blastoise",

  pokedexId: "009",

  name: "TORTANK",

  types: ["WATER"],

  femaleRate: 12.5,

  catchRate: 45,

  growthRate: GROWTH_RATES_DATABASE.MEDIUM_SLOW,

  baseExp: 210,

  baseStats: {
    hp: 79,
    attack: 83,
    defense: 100,
    specialAtt: 85,
    specialDef: 105,
    speed: 78,
  },

  animations: {
    idle: {
      front: "blastoise_front_idle",
      back: "blastoise_back_idle",
    },
  },

  evolutions: [],

  learnset: {
    levelUp: [
      { level: 1, move: MOVES_DATABASE.tackle },
      { level: 1, move: MOVES_DATABASE.tailWhip },
      // { level: 1, move: MOVES_DATABASE.bubble },
      // { level: 1, move: MOVES_DATABASE.withdraw },

      // { level: 4, move: MOVES_DATABASE.tailWhip },
      // { level: 7, move: MOVES_DATABASE.bubble },
      // { level: 10, move: MOVES_DATABASE.withdraw },
      // { level: 13, move: MOVES_DATABASE.waterGun },
      // { level: 19, move: MOVES_DATABASE.bite },
      // { level: 25, move: MOVES_DATABASE.rapidSpin },
      // { level: 31, move: MOVES_DATABASE.protect },
      // { level: 42, move: MOVES_DATABASE.rainDance },
      // { level: 55, move: MOVES_DATABASE.skullBash },
      // { level: 68, move: MOVES_DATABASE.hydroPump },
    ],

    tmhm: [
      "Poing-Focus",
      "Vibraqua",
      "Hurlement",
      "Toxik",
      "Grêle",
      "Puissance Cachée",
      "Laser Glace",
      "Blizzard",
      "Ultralaser",
      "Abri",
      "Danse Pluie",
      "Frustration",
      "Queue de Fer",
      "Séisme",
      "Retour",
      "Tunnel",
      "Casse-Brique",
      "Double Team",
      "Façade",
      "Force",
      "Repos",
      "Attraction",
      "Surf",
      "Éclate-Roc",
      "Cascade",
      "Plongée",
    ],
  },
};
