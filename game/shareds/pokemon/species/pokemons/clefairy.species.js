import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";

import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const CLEFAIRY_SPECIES = {
  id: "clefairy",

  pokedexId: "035",

  name: "MELOFEE",

  types: ["NORMAL"],

  femaleRate: 75,

  catchRate: 150,

  growthRate: GROWTH_RATES_DATABASE.FAST,

  baseExp: 68,

  baseStats: {
    hp: 70,
    attack: 45,
    defense: 48,
    specialAtt: 60,
    specialDef: 65,
    speed: 35,
  },

  animations: {
    idle: {
      front: "clefairy_front_idle",
      back: "clefairy_back_idle",
    },
  },

  evolutions: [{ method: "item", item: "moonStone", target: "clefable" }],

  learnset: {
    levelUp: [
      { level: 1, move: MOVES_DATABASE.pound },
      { level: 1, move: MOVES_DATABASE.growl },
      { level: 5, move: MOVES_DATABASE.encore },
      { level: 9, move: MOVES_DATABASE.sing },
      { level: 13, move: MOVES_DATABASE.doubleSlap },
      { level: 17, move: MOVES_DATABASE.followMe },
      { level: 21, move: MOVES_DATABASE.minimize },
      { level: 25, move: MOVES_DATABASE.defenseCurl },
      { level: 29, move: MOVES_DATABASE.metronome },
      { level: 33, move: MOVES_DATABASE.cosmicPower },
      { level: 37, move: MOVES_DATABASE.moonlight },
      { level: 41, move: MOVES_DATABASE.lightScreen },
      { level: 45, move: MOVES_DATABASE.meteorMash },
    ],

    tmhm: [
      "Poing-Focus",
      "Vibraqua",
      "Psyko",
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
      "Protection",
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
