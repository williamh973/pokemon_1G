import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";

import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const VILEPLUME_SPECIES = {
  id: "vileplume",

  pokedexId: "045",

  name: "RAFFLESIA",

  types: ["GRASS", "POISON"],

  femaleRate: 50,

  catchRate: 45,

  growthRate: GROWTH_RATES_DATABASE.MEDIUM_SLOW,

  baseExp: 184,

  baseStats: {
    hp: 75,
    attack: 80,
    defense: 85,
    specialAtt: 100,
    specialDef: 90,
    speed: 50,
  },

  animations: {
    idle: {
      front: "vileplume_front_idle",
      back: "vileplume_back_idle",
    },
  },

  evolutions: [],

  learnset: {
    levelUp: [
      { level: 1, move: MOVES_DATABASE.absorb },
      { level: 1, move: MOVES_DATABASE.aromatherapy },
      { level: 1, move: MOVES_DATABASE.megaDrain },
      { level: 1, move: MOVES_DATABASE.stunSpore },
      { level: 44, move: MOVES_DATABASE.petalDance },
    ],

    tmhm: [
      "Toxik",
      "Balle Graine",
      "Puissance Cachée",
      "Zénith",
      "Ultralaser",
      "Abri",
      "Giga-Sangsue",
      "Frustration",
      "Lance-Soleil",
      "Retour",
      "Reflet",
      "Bomb-Beurk",
      "Façade",
      "Force Secrète",
      "Repos",
      "Attraction",
      "Coupe",
      "Flash",
    ],
  },
};
