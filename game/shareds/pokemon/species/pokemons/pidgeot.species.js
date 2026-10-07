import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";

import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const PIDGEOT_SPECIES = {
  id: "pidgeot",

  pokedexId: "018",

  name: "ROUCARNAGE",

  types: ["NORMAL", "FLYING"],

  femaleRate: 50,

  catchRate: 45,

  growthRate: GROWTH_RATES_DATABASE.MEDIUM_SLOW,

  baseExp: 172,

  baseStats: {
    hp: 83,
    attack: 80,
    defense: 75,
    specialAtt: 70,
    specialDef: 70,
    speed: 91,
  },

  animations: {
    idle: {
      front: "pidgeot_front_idle",
      back: "pidgeot_back_idle",
    },
  },

  evolutions: [],

  learnset: {
    levelUp: [
      { level: 1, move: MOVES_DATABASE.tackle },
      { level: 1, move: MOVES_DATABASE.sandAttack },
      { level: 1, move: MOVES_DATABASE.gust },
      { level: 1, move: MOVES_DATABASE.quickAttack },

      { level: 5, move: MOVES_DATABASE.sandAttack },
      { level: 9, move: MOVES_DATABASE.gust },
      { level: 13, move: MOVES_DATABASE.quickAttack },
      { level: 20, move: MOVES_DATABASE.whirlwind },
      { level: 27, move: MOVES_DATABASE.wingAttack },
      { level: 34, move: MOVES_DATABASE.featherDance },
      { level: 48, move: MOVES_DATABASE.agility },
      { level: 62, move: MOVES_DATABASE.mirrorMove },
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
      "Double Team",
      "Aéropique",
      "Facade",
      "Force Secrète",
      "Repos",
      "Attraction",
      "Larcin",
      "Aile d'Acier",
      "Vol",
    ],
  },
};
