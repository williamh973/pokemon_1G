import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";

import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const GOLBAT_SPECIES = {
  id: "golbat",

  pokedexId: "042",

  name: "NOSFERALTO",

  types: ["POISON", "FLYING"],

  femaleRate: 50,

  catchRate: 90,

  growthRate: GROWTH_RATES_DATABASE.MEDIUM_FAST,

  baseExp: 159,

  baseStats: {
    hp: 75,
    attack: 80,
    defense: 70,
    specialAtt: 65,
    specialDef: 75,
    speed: 90,
  },

  animations: {
    idle: {
      front: "golbat_front_idle",
      back: "golbat_back_idle",
    },
  },

  evolutions: [
    {
      method: "friendship",
      target: "crobat",
    },
  ],

  learnset: {
    levelUp: [
      { level: 1, move: MOVES_DATABASE.screech },
      { level: 1, move: MOVES_DATABASE.leechLife },
      { level: 1, move: MOVES_DATABASE.supersonic },
      { level: 1, move: MOVES_DATABASE.astonish },
      { level: 6, move: MOVES_DATABASE.supersonic },
      { level: 11, move: MOVES_DATABASE.astonish },
      { level: 16, move: MOVES_DATABASE.bite },
      { level: 21, move: MOVES_DATABASE.wingAttack },
      { level: 28, move: MOVES_DATABASE.confuseRay },
      { level: 35, move: MOVES_DATABASE.airCutter },
      { level: 42, move: MOVES_DATABASE.meanLook },
      { level: 49, move: MOVES_DATABASE.poisonFang },
      { level: 56, move: MOVES_DATABASE.haze },
    ],

    tmhm: [
      "Toxik",
      "Puissance Cachée",
      "Zénith",
      "Provoc",
      "Ultralaser",
      "Abri",
      "Danse Pluie",
      "Méga-Sangsue",
      "Frustration",
      "Retour",
      "Ball'Ombre",
      "Reflet",
      "Bomb-Beurk",
      "Tourmente",
      "Façade",
      "Force Secrète",
      "Repos",
      "Attraction",
      "Larcin",
      "Aile d'Acier",
      "Saisie",
    ],
  },
};
