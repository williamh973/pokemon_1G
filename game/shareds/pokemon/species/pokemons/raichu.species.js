import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";

import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const RAICHU_SPECIES = {
  id: "raichu",

  pokedexId: "026",

  name: "RAICHU",

  types: ["ELECTRIC"],

  femaleRate: 50,

  catchRate: 75,

  growthRate: GROWTH_RATES_DATABASE.MEDIUM_FAST,

  baseExp: 122,

  baseStats: {
    hp: 60,
    attack: 90,
    defense: 55,
    specialAtt: 90,
    specialDef: 80,
    speed: 100,
  },

  animations: {
    idle: {
      front: "raichu_front_idle",
      back: "raichu_back_idle",
    },
  },

  evolutions: [],

  learnset: {
    levelUp: [
      { level: 1, move: MOVES_DATABASE.thunderShock },
      { level: 1, move: MOVES_DATABASE.tailWhip },
      { level: 1, move: MOVES_DATABASE.quickAttack },
      { level: 1, move: MOVES_DATABASE.thunderbolt },
    ],

    tmhm: [
      "Poing-Focus",
      "Toxik",
      "Puissance Cachée",
      "Ultralaser",
      "Mur Lumière",
      "Abri",
      "Danse Pluie",
      "Frustration",
      "Queue de Fer",
      "Tonnerre",
      "Retour",
      "Tunnel",
      "Casse-Brique",
      "Double Team",
      "Onde de Choc",
      "Façade",
      "Force",
      "Repos",
      "Attraction",
      "Larcin",
      "Éclate-Roc",
      "Flash",
    ],
  },
};
