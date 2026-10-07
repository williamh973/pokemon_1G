import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";

import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const SANDSLASH_SPECIES = {
  id: "sandslash",

  pokedexId: "028",

  name: "SABLAIREAU",

  types: ["GROUND"],

  femaleRate: 50,

  catchRate: 90,

  growthRate: GROWTH_RATES_DATABASE.MEDIUM_FAST,

  baseExp: 163,

  baseStats: {
    hp: 75,
    attack: 100,
    defense: 110,
    specialAtt: 45,
    specialDef: 55,
    speed: 65,
  },

  animations: {
    idle: {
      front: "sandslash_front_idle",
      back: "sandslash_back_idle",
    },
  },

  evolutions: [],

  learnset: {
    levelUp: [
      { level: 1, move: MOVES_DATABASE.scratch },
      //   { level: 1, move: MOVES_DATABASE.defenseCurl },
      //   { level: 1, move: MOVES_DATABASE.sandAttack },

      //   { level: 6, move: MOVES_DATABASE.defenseCurl },
      //   { level: 11, move: MOVES_DATABASE.sandAttack },
      //   { level: 17, move: MOVES_DATABASE.poisonSting },
      //   { level: 24, move: MOVES_DATABASE.slash },
      //   { level: 33, move: MOVES_DATABASE.swift },
      //   { level: 42, move: MOVES_DATABASE.furySwipes },
      //   { level: 52, move: MOVES_DATABASE.sandTomb },
      //   { level: 62, move: MOVES_DATABASE.sandstorm },
    ],

    tmhm: [
      "Poing-Focus",
      "Toxik",
      "Puissance Cachée",
      "Zénith",
      "Ultralaser",
      "Abri",
      "Frustration",
      "Queue de Fer",
      "Séisme",
      "Retour",
      "Tunnel",
      "Casse-Brique",
      "Reflet",
      "Tempête de Sable",
      "Tomberoche",
      "Aéropique",
      "Façade",
      "Force Secrète",
      "Repos",
      "Attraction",
      "Larcin",
      "Éclate-Roc",
      "Coupe",
      "Force",
    ],
  },
};
