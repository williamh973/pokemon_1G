import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";

import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const GRIMER_SPECIES = {
  id: "grimer",
  pokedexId: "088",
  name: "TADMORV",
  types: ["POISON"],
  femaleRate: 50,
  catchRate: 190,
  growthRate: GROWTH_RATES_DATABASE.MEDIUM_FAST,
  baseExp: 90,
  baseStats: {
    hp: 80,
    attack: 80,
    defense: 50,
    specialAtt: 40,
    specialDef: 50,
    speed: 25,
  },
  animations: {
    idle: {
      front: "grimer_front_idle",
      back: "grimer_back_idle",
    },
  },
  evolutions: [
    {
      method: "level",
      level: 38,
      target: "muk",
    },
  ],
  learnset: {
    levelUp: [
      { level: 1, move: MOVES_DATABASE.poisonGas },
      { level: 1, move: MOVES_DATABASE.pound },
      { level: 4, move: MOVES_DATABASE.harden },
      { level: 8, move: MOVES_DATABASE.disable },
      { level: 13, move: MOVES_DATABASE.sludge },
      { level: 19, move: MOVES_DATABASE.minimize },
      { level: 26, move: MOVES_DATABASE.screech },
      { level: 34, move: MOVES_DATABASE.acidArmor },
      { level: 43, move: MOVES_DATABASE.sludgeBomb },
      { level: 53, move: MOVES_DATABASE.memento },
    ],
    tmhm: [
      "Toxik",
      "Zénith",
      "Provoc",
      "Puissance Cachée",
      "Protection",
      "Danse Pluie",
      "Giga-Sangsue",
      "Frustration",
      "Retour",
      "Ball'Ombre",
      "Casse-Brique",
      "Reflet",
      "Bombe Beurk",
      "Tourmente",
      "Façade",
      "Force Secrète",
      "Repos",
      "Attraction",
      "Larcin",
    ],
  },
};
