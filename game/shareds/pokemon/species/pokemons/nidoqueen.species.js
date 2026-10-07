import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";
import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const NIDOQUEEN_SPECIES = {
  id: "nidoqueen",

  pokedexId: "031",

  name: "NIDOQUEEN",

  types: ["POISON", "GROUND"],

  femaleRate: 100,

  catchRate: 45,

  growthRate: GROWTH_RATES_DATABASE.MEDIUM_SLOW,

  baseExp: 194,

  baseStats: {
    hp: 90,
    attack: 92,
    defense: 87,
    specialAtt: 75,
    specialDef: 85,
    speed: 76,
  },

  animations: {
    idle: {
      front: "nidoqueen_front_idle",
      back: "nidoqueen_back_idle",
    },
  },

  evolutions: [],

  learnset: {
    levelUp: [
      { level: 1, move: MOVES_DATABASE.scratch },
      { level: 1, move: MOVES_DATABASE.tailWhip },
      //   { level: 1, move: MOVES_DATABASE.doubleKick },
      //   { level: 1, move: MOVES_DATABASE.poisonSting },
      { level: 23, move: MOVES_DATABASE.bodySlam },
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
      "Aéropique",
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
