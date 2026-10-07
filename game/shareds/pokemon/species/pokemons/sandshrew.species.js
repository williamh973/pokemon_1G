import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";

import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const SANDSHREW_SPECIES = {
  id: "sandshrew",

  pokedexId: "027",

  name: "SABELETTE",

  types: ["GROUND"],

  femaleRate: 50,

  catchRate: 255,

  growthRate: GROWTH_RATES_DATABASE.MEDIUM_FAST,

  baseExp: 93,

  baseStats: {
    hp: 50,
    attack: 75,
    defense: 85,
    specialAtt: 20,
    specialDef: 30,
    speed: 40,
  },

  animations: {
    idle: {
      front: "sandshrew_front_idle",
      back: "sandshrew_back_idle",
    },
  },

  evolutions: [
    {
      method: "level",
      level: 22,
      target: "sandslash",
    },
  ],

  learnset: {
    levelUp: [
      { level: 1, move: MOVES_DATABASE.scratch },
      { level: 6, move: MOVES_DATABASE.defenseCurl },
      { level: 11, move: MOVES_DATABASE.sandAttack },
      { level: 17, move: MOVES_DATABASE.poisonSting },
      { level: 23, move: MOVES_DATABASE.slash },
      { level: 30, move: MOVES_DATABASE.swift },
      { level: 37, move: MOVES_DATABASE.furySwipes },
      { level: 45, move: MOVES_DATABASE.sandTomb },
      { level: 53, move: MOVES_DATABASE.sandstorm },
    ],

    tmhm: [
      "Poing-Focus",
      "Toxik",
      "Puissance Cachée",
      "Zénith",
      "Abri",
      "Frustration",
      "Queue de Fer",
      "Séisme",
      "Retour",
      "Tunnel",
      "Casse-Brique",
      "Reflet",
      "Tomberoche",
      "Aéropique",
      "Façade",
      "Force",
      "Repos",
      "Attraction",
      "Larcin",
      "Éclate-Roc",
      "Coupe",
    ],
  },
};
