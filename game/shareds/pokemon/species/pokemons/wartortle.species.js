import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";

import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const WARTORTLE_SPECIES = {
  id: "wartortle",

  pokedexId: "008",

  name: "CARABAFFE",

  types: ["WATER"],

  femaleRate: 12.5,

  catchRate: 45,

  growthRate: GROWTH_RATES_DATABASE.MEDIUM_SLOW,

  baseExp: 143,

  baseStats: {
    hp: 59,
    attack: 63,
    defense: 80,
    specialAtt: 65,
    specialDef: 80,
    speed: 58,
  },

  animations: {
    idle: {
      front: "wartortle_front_idle",
      back: "wartortle_back_idle",
    },
  },

  evolutions: [
    {
      method: "level",
      level: 36,
      target: "blastoise",
    },
  ],

  learnset: {
    levelUp: [
      { level: 1, move: MOVES_DATABASE.tackle },
      { level: 1, move: MOVES_DATABASE.tailWhip },
      { level: 1, move: MOVES_DATABASE.bubble },

      { level: 4, move: MOVES_DATABASE.tailWhip },
      { level: 7, move: MOVES_DATABASE.bubble },
      { level: 10, move: MOVES_DATABASE.withdraw },
      { level: 13, move: MOVES_DATABASE.waterGun },
      { level: 19, move: MOVES_DATABASE.bite },
      { level: 25, move: MOVES_DATABASE.rapidSpin },
      { level: 31, move: MOVES_DATABASE.protect },
      { level: 37, move: MOVES_DATABASE.rainDance },
      { level: 45, move: MOVES_DATABASE.skullBash },
      { level: 53, move: MOVES_DATABASE.hydroPump },
    ],

    tmhm: [
      "Poing-Focus",
      "Vibraqua",
      "Toxik",
      "Grêle",
      "Puissance Cachée",
      "Laser Glace",
      "Blizzard",
      "Abri",
      "Danse Pluie",
      "Frustration",
      "Queue de Fer",
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
