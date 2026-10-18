import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";

import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const DODUO_SPECIES = {
  id: "doduo",
  pokedexId: "084",
  name: "DODUO",
  types: ["NORMAL", "FLYING"],
  femaleRate: 50,
  catchRate: 190,
  growthRate: GROWTH_RATES_DATABASE.MEDIUM_FAST,
  baseExp: 96,
  baseStats: {
    hp: 35,
    attack: 85,
    defense: 45,
    specialAtt: 35,
    specialDef: 35,
    speed: 75,
  },
  animations: {
    idle: {
      front: "doduo_front_idle",
      back: "doduo_back_idle",
    },
  },
  evolutions: [
    {
      method: "level",
      level: 31,
      target: "dodrio",
    },
  ],
  learnset: {
    levelUp: [
      { level: 1, move: MOVES_DATABASE.growl },
      { level: 1, move: MOVES_DATABASE.peck },
      { level: 9, move: MOVES_DATABASE.pursuit },
      { level: 13, move: MOVES_DATABASE.furyAttack },
      { level: 21, move: MOVES_DATABASE.triAttack },
      { level: 25, move: MOVES_DATABASE.rage },
      { level: 33, move: MOVES_DATABASE.uproar },
      { level: 37, move: MOVES_DATABASE.drillPeck },
      { level: 45, move: MOVES_DATABASE.agility },
    ],
    tmhm: [
      "Toxik",
      "Zénith",
      "Puissance Cachée",
      "Protection",
      "Frustration",
      "Retour",
      "Reflet",
      "Aéropique",
      "Façade",
      "Force Secrète",
      "Repos",
      "Attraction",
      "Larcin",
      "Aile d'Acier",
      "Vol",
    ],
  },
};
