import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";

import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const NIDORINO_SPECIES = {
  id: "nidorino",

  pokedexId: "033",

  name: "NIDORINO",

  types: ["POISON"],

  femaleRate: 0,

  catchRate: 120,

  growthRate: GROWTH_RATES_DATABASE.MEDIUM_SLOW,

  baseExp: 118,

  baseStats: {
    hp: 61,
    attack: 72,
    defense: 57,
    specialAtt: 55,
    specialDef: 55,
    speed: 65,
  },

  animations: {
    idle: {
      front: "nidorino_front_idle",
      back: "nidorino_back_idle",
    },
  },

  evolutions: [{ method: "item", item: "moonStone", target: "nidoking" }],

  learnset: {
    levelUp: [
      { level: 1, move: MOVES_DATABASE.focusEnergy },
      //   { level: 1, move: MOVES_DATABASE.leer },
      //   { level: 1, move: MOVES_DATABASE.peck },
      //   { level: 12, move: MOVES_DATABASE.doubleKick },
      //   { level: 18, move: MOVES_DATABASE.poisonSting },
      //   { level: 22, move: MOVES_DATABASE.hornAttack },
      //   { level: 26, move: MOVES_DATABASE.helpingHand },
      //   { level: 34, move: MOVES_DATABASE.furyAttack },
      //   { level: 43, move: MOVES_DATABASE.flatter },
      //   { level: 53, move: MOVES_DATABASE.hornDrill },
    ],

    tmhm: [
      "Vibraqua",
      "Toxik",
      "Puissance Cachée",
      "Zénith",
      "Laser Glace",
      "Blizzard",
      "Abri",
      "Danse Pluie",
      "Frustration",
      "Queue de Fer",
      "Tonnerre",
      "Fatal-Foudre",
      "Retour",
      "Tunnel",
      "Reflet",
      "Onde de Choc",
      "Bomb-Beurk",
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
