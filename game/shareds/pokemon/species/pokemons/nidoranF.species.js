import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";

import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const NIDORAN_F_SPECIES = {
  id: "nidoranf",

  pokedexId: "029",

  name: "NIDORAN♀",

  types: ["POISON"],

  femaleRate: 100,

  catchRate: 235,

  growthRate: GROWTH_RATES_DATABASE.MEDIUM_SLOW,

  baseExp: 59,

  baseStats: {
    hp: 55,
    attack: 47,
    defense: 52,
    specialAtt: 40,
    specialDef: 40,
    speed: 41,
  },

  animations: {
    idle: {
      front: "nidoranf_front_idle",
      back: "nidoranf_back_idle",
    },
  },

  evolutions: [{ method: "level", level: 16, target: "nidorina" }],

  learnset: {
    levelUp: [
      { level: 1, move: MOVES_DATABASE.growl },
      { level: 1, move: MOVES_DATABASE.scratch },
      { level: 8, move: MOVES_DATABASE.tailWhip },
      { level: 12, move: MOVES_DATABASE.doubleKick },
      { level: 17, move: MOVES_DATABASE.poisonSting },
      { level: 20, move: MOVES_DATABASE.bite },
      { level: 23, move: MOVES_DATABASE.helpingHand },
      { level: 30, move: MOVES_DATABASE.furySwipes },
      { level: 38, move: MOVES_DATABASE.flatter },
      { level: 47, move: MOVES_DATABASE.crunch },
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
