import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";

import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const DODRIO_SPECIES = {
  id: "dodrio",
  pokedexId: "085",
  name: "DODRIO",
  types: ["NORMAL", "FLYING"],
  femaleRate: 50,
  catchRate: 45,
  growthRate: GROWTH_RATES_DATABASE.MEDIUM_FAST,
  baseExp: 158,
  baseStats: {
    hp: 60,
    attack: 110,
    defense: 70,
    specialAtt: 60,
    specialDef: 60,
    speed: 100,
  },
  animations: {
    idle: {
      front: "dodrio_front_idle",
      back: "dodrio_back_idle",
    },
  },
  evolutions: [],
  learnset: {
    levelUp: [
      { level: 1, move: MOVES_DATABASE.furyAttack },
      { level: 1, move: MOVES_DATABASE.growl },
      { level: 1, move: MOVES_DATABASE.peck },
      { level: 1, move: MOVES_DATABASE.pursuit },
      { level: 9, move: MOVES_DATABASE.pursuit },
      { level: 13, move: MOVES_DATABASE.furyAttack },
      { level: 21, move: MOVES_DATABASE.triAttack },
      { level: 25, move: MOVES_DATABASE.rage },
      { level: 38, move: MOVES_DATABASE.uproar },
      { level: 47, move: MOVES_DATABASE.drillPeck },
      { level: 60, move: MOVES_DATABASE.agility },
    ],
    tmhm: [
      "Toxik",
      "Zénith",
      "Provoc",
      "Puissance Cachée",
      "Ultralaser",
      "Protection",
      "Frustration",
      "Retour",
      "Reflet",
      "Aéropique",
      "Tourmente",
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
