import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";

import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const NIDORAN_M_SPECIES = {
  id: "nidoranm",

  pokedexId: "032",

  name: "NIDORAN♂",

  types: ["POISON"],

  femaleRate: 0,

  catchRate: 235,

  growthRate: GROWTH_RATES_DATABASE.MEDIUM_SLOW,

  baseExp: 60,

  baseStats: {
    hp: 46,
    attack: 57,
    defense: 40,
    specialAtt: 40,
    specialDef: 40,
    speed: 50,
  },

  animations: {
    idle: {
      front: "nidoranm_front_idle",
      back: "nidoranm_back_idle",
    },
  },

  evolutions: [{ method: "level", level: 16, target: "nidorino" }],

  learnset: {
    levelUp: [
      { level: 1, move: MOVES_DATABASE.leer },
      { level: 1, move: MOVES_DATABASE.peck },
      { level: 8, move: MOVES_DATABASE.focusEnergy },
      { level: 12, move: MOVES_DATABASE.doubleKick },
      { level: 17, move: MOVES_DATABASE.poisonSting },
      { level: 20, move: MOVES_DATABASE.hornAttack },
      { level: 23, move: MOVES_DATABASE.helpingHand },
      { level: 30, move: MOVES_DATABASE.furyAttack },
      { level: 38, move: MOVES_DATABASE.flatter },
      { level: 47, move: MOVES_DATABASE.hornDrill },
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
