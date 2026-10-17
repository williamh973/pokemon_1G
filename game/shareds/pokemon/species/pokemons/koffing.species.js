import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";

import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const KOFFING_SPECIES = {
  id: "koffing",
  pokedexId: "109",
  name: "SMOGO",
  types: ["POISON"],
  femaleRate: 50,
  catchRate: 190,
  growthRate: GROWTH_RATES_DATABASE.MEDIUM_FAST,
  baseExp: 114,
  baseStats: {
    hp: 40,
    attack: 65,
    defense: 95,
    specialAtt: 60,
    specialDef: 45,
    speed: 35,
  },
  animations: {
    idle: {
      front: "koffing_front_idle",
      back: "koffing_back_idle",
    },
  },
  evolutions: [
    {
      method: "level",
      level: 35,
      target: "weezing",
    },
  ],
  learnset: {
    levelUp: [
      { level: 1, move: MOVES_DATABASE.tackle },
      { level: 1, move: MOVES_DATABASE.poisonGas },
      { level: 9, move: MOVES_DATABASE.smog },
      { level: 17, move: MOVES_DATABASE.selfDestruct },
      { level: 21, move: MOVES_DATABASE.sludge },
      { level: 25, move: MOVES_DATABASE.smokescreen },
      { level: 33, move: MOVES_DATABASE.haze },
      { level: 41, move: MOVES_DATABASE.explosion },
      { level: 45, move: MOVES_DATABASE.destinyBond },
      { level: 49, move: MOVES_DATABASE.memento },
    ],
    tmhm: [
      "Toxik",
      "Zénith",
      "Provoc",
      "Puissance Cachée",
      "Protection",
      "Danse Pluie",
      "Frustration",
      "Tonnerre",
      "Fatal-Foudre",
      "Retour",
      "Ball'Ombre",
      "Reflet",
      "Onde de Choc",
      "Lance-Flammes",
      "Déflagration",
      "Bombe Beurk",
      "Tourmente",
      "Façade",
      "Force Secrète",
      "Repos",
      "Attraction",
      "Larcin",
      "Flash",
    ],
  },
};
