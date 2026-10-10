import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";
import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const CLEFABLE_SPECIES = {
  id: "clefable",

  pokedexId: "036",

  name: "MELODELF",

  types: ["NORMAL"],

  femaleRate: 75,

  catchRate: 25,

  growthRate: GROWTH_RATES_DATABASE.FAST,

  baseExp: 129,

  baseStats: {
    hp: 95,
    attack: 70,
    defense: 73,
    specialAtt: 85,
    specialDef: 90,
    speed: 60,
  },

  animations: {
    idle: {
      front: "clefable_front_idle",
      back: "clefable_back_idle",
    },
  },

  evolutions: [],

  learnset: {
    levelUp: [
      { level: 1, move: MOVES_DATABASE.sing },
      { level: 1, move: MOVES_DATABASE.doubleSlap },
      { level: 1, move: MOVES_DATABASE.minimize },
      { level: 1, move: MOVES_DATABASE.metronome },
    ],

    tmhm: [
      "Poing-Focus",
      "Vibraqua",
      "Plénitude",
      "Toxik",
      "Puissance Cachée",
      "Zénith",
      "Laser Glace",
      "Blizzard",
      "Ultralaser",
      "Mur Lumière",
      "Abri",
      "Danse Pluie",
      "Protection",
      "Frustration",
      "Lance-Soleil",
      "Queue de Fer",
      "Tonnerre",
      "Fatal-Foudre",
      "Retour",
      "Tunnel",
      "Psyko",
      "Ball'Ombre",
      "Casse-Brique",
      "Reflet",
      "Onde de Choc",
      "Lance-Flammes",
      "Déflagration",
      "Façade",
      "Force Secrète",
      "Repos",
      "Attraction",
      "Larcin",
      "Force",
      "Éclate-Roc",
      "Flash",
    ],
  },
};
