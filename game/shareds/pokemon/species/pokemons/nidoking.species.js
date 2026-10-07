import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";

import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const NIDOKING_SPECIES = {
  id: "nidoking",

  pokedexId: "034",

  name: "NIDOKING",

  types: ["POISON", "GROUND"],

  femaleRate: 0,

  catchRate: 45,

  growthRate: GROWTH_RATES_DATABASE.MEDIUM_SLOW,

  baseExp: 195,

  baseStats: {
    hp: 81,
    attack: 92,
    defense: 77,
    specialAtt: 85,
    specialDef: 75,
    speed: 85,
  },

  animations: {
    idle: {
      front: "nidoking_front_idle",
      back: "nidoking_back_idle",
    },
  },

  evolutions: [],

  learnset: {
    levelUp: [
      { level: 1, move: MOVES_DATABASE.peck },
      { level: 1, move: MOVES_DATABASE.focusEnergy },
      { level: 1, move: MOVES_DATABASE.doubleKick },
      { level: 1, move: MOVES_DATABASE.poisonSting },
      { level: 23, move: MOVES_DATABASE.thrash },
    ],

    tmhm: [
      "Poing-Focus",
      "Vibraqua",
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
      "Séisme",
      "Retour",
      "Tunnel",
      "Ball'Ombre",
      "Casse-Brique",
      "Reflet",
      "Onde de Choc",
      "Lance-Flammes",
      "Bomb-Beurk",
      "Tempête de Sable",
      "Déflagration",
      "Tomberoche",
      "Tourmente",
      "Façade",
      "Force Secrète",
      "Repos",
      "Attraction",
      "Larcin",
      "Coupe",
      "Surf",
      "Force",
      "Éclate-Roc",
    ],
  },
};
