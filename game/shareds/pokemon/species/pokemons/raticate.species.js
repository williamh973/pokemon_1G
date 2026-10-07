import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";

import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const RATICATE_SPECIES = {
  id: "raticate",

  pokedexId: "020",

  name: "RATTATAC",

  types: ["NORMAL"],

  femaleRate: 50,

  catchRate: 127,

  growthRate: GROWTH_RATES_DATABASE.MEDIUM_FAST,

  baseExp: 116,

  baseStats: {
    hp: 55,
    attack: 81,
    defense: 60,
    specialAtt: 50,
    specialDef: 70,
    speed: 97,
  },

  animations: {
    idle: {
      front: "raticate_front_idle",
      back: "raticate_back_idle",
    },
  },

  evolutions: [],

  learnset: {
    levelUp: [
      { level: 1, move: MOVES_DATABASE.tackle },
      { level: 1, move: MOVES_DATABASE.tailWhip },
      { level: 1, move: MOVES_DATABASE.quickAttack },

      { level: 7, move: MOVES_DATABASE.quickAttack },
      { level: 13, move: MOVES_DATABASE.hyperFang },
      { level: 20, move: MOVES_DATABASE.scaryFace },
      { level: 30, move: MOVES_DATABASE.pursuit },
      { level: 40, move: MOVES_DATABASE.superFang },
      { level: 50, move: MOVES_DATABASE.endeavor },
    ],

    tmhm: [
      "Hurlement",
      "Toxik",
      "Puissance Cachée",
      "Zénith",
      "Provoc",
      "Laser Glace",
      "Blizzard",
      "Ultralaser",
      "Abri",
      "Danse Pluie",
      "Frustration",
      "Queue de Fer",
      "Tonnerre",
      "Fatal-Foudre",
      "Retour",
      "Tunnel",
      "Ball'Ombre",
      "Double Team",
      "Onde de Choc",
      "Facade",
      "Force Secrète",
      "Repos",
      "Attraction",
      "Larcin",
      "Coupe",
      "Force",
      "Éclate-Roc",
    ],
  },
};
