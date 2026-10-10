import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";

import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const WIGGLYTUFF_SPECIES = {
  id: "wigglytuff",

  pokedexId: "040",

  name: "GRODOUDOU",

  types: ["NORMAL"],

  femaleRate: 75,

  catchRate: 50,

  growthRate: GROWTH_RATES_DATABASE.FAST,

  baseExp: 109,

  baseStats: {
    hp: 140,
    attack: 70,
    defense: 45,
    specialAtt: 75,
    specialDef: 50,
    speed: 45,
  },

  animations: {
    idle: {
      front: "wigglytuff_front_idle",
      back: "wigglytuff_back_idle",
    },
  },

  evolutions: [],

  learnset: {
    levelUp: [
      { level: 1, move: MOVES_DATABASE.sing },
      { level: 1, move: MOVES_DATABASE.disable },
      { level: 1, move: MOVES_DATABASE.defenseCurl },
      { level: 1, move: MOVES_DATABASE.doubleSlap },
    ],

    tmhm: [
      "Poing-Focus",
      "Vibraqua",
      "Toxik",
      "Puissance Cachée",
      "Zénith",
      "Laser Glace",
      "Blizzard",
      "Ultralaser",
      "Mur Lumière",
      "Abri",
      "Danse Pluie",
      "Rune Protect",
      "Frustration",
      "Lance-Soleil",
      "Tonnerre",
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
      "Saisie",
      "Force",
      "Flash",
    ],
  },
};
