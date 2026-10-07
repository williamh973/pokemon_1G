import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";

import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const ARBOK_SPECIES = {
  id: "arbok",

  pokedexId: "024",

  name: "ARBOK",

  types: ["POISON"],

  femaleRate: 50,

  catchRate: 90,

  growthRate: GROWTH_RATES_DATABASE.MEDIUM_FAST,

  baseExp: 147,

  baseStats: {
    hp: 60,
    attack: 85,
    defense: 69,
    specialAtt: 65,
    specialDef: 79,
    speed: 80,
  },

  animations: {
    idle: {
      front: "arbok_front_idle",
      back: "arbok_back_idle",
    },
  },

  evolutions: [],

  learnset: {
    levelUp: [
      { level: 1, move: MOVES_DATABASE.wrap },
      { level: 1, move: MOVES_DATABASE.leer },
      { level: 1, move: MOVES_DATABASE.poisonSting },
      { level: 1, move: MOVES_DATABASE.bite },

      { level: 8, move: MOVES_DATABASE.poisonSting },
      { level: 13, move: MOVES_DATABASE.bite },
      { level: 20, move: MOVES_DATABASE.glare },
      { level: 28, move: MOVES_DATABASE.screech },
      { level: 38, move: MOVES_DATABASE.acid },
      { level: 46, move: MOVES_DATABASE.spitUp },
      { level: 46, move: MOVES_DATABASE.stockpile },
      { level: 46, move: MOVES_DATABASE.swallow },
      { level: 56, move: MOVES_DATABASE.haze },
    ],

    tmhm: [
      "Toxik",
      "Puissance Cachée",
      "Zénith",
      "Ultralaser",
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
