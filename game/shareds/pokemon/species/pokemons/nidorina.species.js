import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";

import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const NIDORINA_SPECIES = {
  id: "nidorina",

  pokedexId: "030",

  name: "NIDORINA",

  types: ["POISON"],

  femaleRate: 100,

  catchRate: 120,

  growthRate: GROWTH_RATES_DATABASE.MEDIUM_SLOW,

  baseExp: 117,

  baseStats: {
    hp: 70,
    attack: 62,
    defense: 67,
    specialAtt: 55,
    specialDef: 55,
    speed: 56,
  },

  animations: {
    idle: {
      front: "nidorina_front_idle",
      back: "nidorina_back_idle",
    },
  },

  evolutions: [{ method: "item", item: "moonStone", target: "nidoqueen" }],

  learnset: {
    levelUp: [
      { level: 1, move: MOVES_DATABASE.growl },
      { level: 1, move: MOVES_DATABASE.scratch },
      { level: 8, move: MOVES_DATABASE.tailWhip },
      { level: 12, move: MOVES_DATABASE.doubleKick },
      { level: 18, move: MOVES_DATABASE.poisonSting },
      { level: 22, move: MOVES_DATABASE.bite },
      { level: 26, move: MOVES_DATABASE.helpingHand },
      { level: 34, move: MOVES_DATABASE.furySwipes },
      { level: 43, move: MOVES_DATABASE.flatter },
      { level: 53, move: MOVES_DATABASE.crunch },
    ],

    tmhm: [
      "Vibraqua",
      "Toxik",
      "Puissance Cachée",
      "Danse Pluie",
      "Frustration",
      "Queue de Fer",
      "Tonnerre",
      "Retour",
      "Tunnel",
      "Reflet",
      "Onde de Choc",
      "Bomb-Beurk",
      "Aéropique",
      "Façade",
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
