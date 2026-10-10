import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";

import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const JIGGLYPUFF_SPECIES = {
  id: "jigglypuff",

  pokedexId: "039",

  name: "RONDOUDOU",

  types: ["NORMAL"],

  femaleRate: 75,

  catchRate: 170,

  growthRate: GROWTH_RATES_DATABASE.FAST,

  baseExp: 76,

  baseStats: {
    hp: 115,
    attack: 45,
    defense: 20,
    specialAtt: 45,
    specialDef: 25,
    speed: 20,
  },

  animations: {
    idle: {
      front: "jigglypuff_front_idle",
      back: "jigglypuff_back_idle",
    },
  },

  evolutions: [
    {
      method: "item",
      item: "moonStone",
      target: "wigglytuff",
    },
  ],

  learnset: {
    levelUp: [
      { level: 1, move: MOVES_DATABASE.sing },
      { level: 4, move: MOVES_DATABASE.defenseCurl },
      { level: 9, move: MOVES_DATABASE.pound },
      { level: 14, move: MOVES_DATABASE.disable },
      { level: 19, move: MOVES_DATABASE.rollout },
      { level: 24, move: MOVES_DATABASE.doubleSlap },
      { level: 29, move: MOVES_DATABASE.rest },
      { level: 34, move: MOVES_DATABASE.bodySlam },
      { level: 39, move: MOVES_DATABASE.mimic },
      { level: 44, move: MOVES_DATABASE.hyperVoice },
      { level: 49, move: MOVES_DATABASE.doubleEdge },
    ],

    tmhm: [
      "Poing-Focus",
      "Vibraqua",
      "Toxik",
      "Puissance Cachée",
      "Zénith",
      "Laser Glace",
      "Blizzard",
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
      "Larcin",
      "Force",
      "Flash",
    ],
  },
};
