import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";

import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const EKANS_SPECIES = {
  id: "ekans",

  pokedexId: "023",

  name: "ABO",

  types: ["POISON"],

  femaleRate: 50,

  catchRate: 255,

  growthRate: GROWTH_RATES_DATABASE.MEDIUM_FAST,

  baseExp: 62,

  baseStats: {
    hp: 35,
    attack: 60,
    defense: 44,
    specialAtt: 40,
    specialDef: 54,
    speed: 55,
  },

  animations: {
    idle: {
      front: "ekans_front_idle",
      back: "ekans_back_idle",
    },
  },

  evolutions: [
    {
      method: "level",
      level: 22,
      target: "arbok",
    },
  ],

  learnset: {
    levelUp: [
      { level: 32, move: MOVES_DATABASE.acid },
      //   { level: 1, move: MOVES_DATABASE.wrap },
      //   { level: 1, move: MOVES_DATABASE.leer },
      //   { level: 8, move: MOVES_DATABASE.poisonSting },
      //   { level: 13, move: MOVES_DATABASE.bite },
      //   { level: 20, move: MOVES_DATABASE.glare },
      //   { level: 25, move: MOVES_DATABASE.screech },
      //   { level: 37, move: MOVES_DATABASE.stockpile },
      //   { level: 37, move: MOVES_DATABASE.swallow },
      //   { level: 37, move: MOVES_DATABASE.spitUp },
      //   { level: 44, move: MOVES_DATABASE.haze },
    ],

    tmhm: [
      "Toxik",
      "Puissance Cachée",
      "Zénith",
      "Abri",
      "Danse Pluie",
      "Méga-Sangsue",
      "Frustration",
      "Queue de Fer",
      "Séisme",
      "Retour",
      "Tunnel",
      "Reflet",
      "Bomb-Beurk",
      "Tourmente",
      "Façade",
      "Force Secrète",
      "Repos",
      "Attraction",
      "Larcin",
      "Aboiement",
      "Force",
    ],
  },
};
