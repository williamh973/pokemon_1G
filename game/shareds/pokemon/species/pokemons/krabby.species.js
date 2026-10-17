import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";

import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const KRABBY_SPECIES = {
  id: "krabby",
  pokedexId: "098",
  name: "KRABBY",
  types: ["WATER"],
  femaleRate: 50,
  catchRate: 225,
  growthRate: GROWTH_RATES_DATABASE.MEDIUM_FAST,
  baseExp: 115,
  baseStats: {
    hp: 30,
    attack: 105,
    defense: 90,
    specialAtt: 25,
    specialDef: 25,
    speed: 50,
  },
  animations: {
    idle: {
      front: "krabby_front_idle",
      back: "krabby_back_idle",
    },
  },
  evolutions: [
    {
      method: "level",
      level: 28,
      target: "kingler",
    },
  ],
  learnset: {
    levelUp: [
      { level: 1, move: MOVES_DATABASE.bubble },
      { level: 5, move: MOVES_DATABASE.leer },
      { level: 12, move: MOVES_DATABASE.viceGrip },
      { level: 16, move: MOVES_DATABASE.harden },
      { level: 23, move: MOVES_DATABASE.mudShot },
      { level: 27, move: MOVES_DATABASE.stomp },
      { level: 34, move: MOVES_DATABASE.guillotine },
      { level: 38, move: MOVES_DATABASE.protect },
      { level: 45, move: MOVES_DATABASE.crabhammer },
      { level: 49, move: MOVES_DATABASE.flail },
    ],
    tmhm: [
      "Toxik",
      "Grêle",
      "Puissance Cachée",
      "Blizzard",
      "Ultralaser",
      "Protection",
      "Danse Pluie",
      "Frustration",
      "Retour",
      "Tunnel",
      "Casse-Brique",
      "Tomberoche",
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
