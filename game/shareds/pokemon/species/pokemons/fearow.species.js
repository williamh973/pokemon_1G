import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";

import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const FEAROW_SPECIES = {
  id: "fearow",

  pokedexId: "022",

  name: "RAPASDEPIC",

  types: ["NORMAL", "FLYING"],

  femaleRate: 50,

  catchRate: 90,

  growthRate: GROWTH_RATES_DATABASE.MEDIUM_FAST,

  baseExp: 162,

  baseStats: {
    hp: 65,
    attack: 90,
    defense: 65,
    specialAtt: 61,
    specialDef: 61,
    speed: 100,
  },

  animations: {
    idle: {
      front: "fearow_front_idle",
      back: "fearow_back_idle",
    },
  },

  evolutions: [],

  learnset: {
    levelUp: [
      { level: 1, move: MOVES_DATABASE.growl },
      { level: 1, move: MOVES_DATABASE.peck },
      { level: 1, move: MOVES_DATABASE.leer },
      { level: 1, move: MOVES_DATABASE.furyAttack },

      { level: 7, move: MOVES_DATABASE.leer },
      { level: 13, move: MOVES_DATABASE.furyAttack },
      { level: 26, move: MOVES_DATABASE.pursuit },
      { level: 32, move: MOVES_DATABASE.mirrorMove },
      { level: 40, move: MOVES_DATABASE.drillPeck },
      { level: 47, move: MOVES_DATABASE.agility },
    ],

    tmhm: [
      "Toxik",
      "Puissance Cachée",
      "Zénith",
      "Ultralaser",
      "Abri",
      "Danse Pluie",
      "Frustration",
      "Retour",
      "Reflet",
      "Aéropique",
      "Façade",
      "Force",
      "Repos",
      "Attraction",
      "Larcin",
      "Aile d'Acier",
      "Éclate-Roc",
      "Vol",
    ],
  },
};
