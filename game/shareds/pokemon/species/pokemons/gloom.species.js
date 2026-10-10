import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";

import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const GLOOM_SPECIES = {
  id: "gloom",

  pokedexId: "044",

  name: "ORTIDE",

  types: ["GRASS", "POISON"],

  femaleRate: 50,

  catchRate: 120,

  growthRate: GROWTH_RATES_DATABASE.MEDIUM_SLOW,

  baseExp: 138,

  baseStats: {
    hp: 60,
    attack: 65,
    defense: 70,
    specialAtt: 85,
    specialDef: 75,
    speed: 40,
  },

  animations: {
    idle: {
      front: "gloom_front_idle",
      back: "gloom_back_idle",
    },
  },

  evolutions: [
    { method: "item", item: "leafStone", target: "vileplume" },
    { method: "item", item: "sunStone", target: "bellossom" },
  ],

  learnset: {
    levelUp: [
      { level: 1, move: MOVES_DATABASE.absorb },
      { level: 1, move: MOVES_DATABASE.sweetScent },
      { level: 1, move: MOVES_DATABASE.poisonPowder },
      { level: 7, move: MOVES_DATABASE.sweetScent },
      { level: 14, move: MOVES_DATABASE.poisonPowder },
      { level: 16, move: MOVES_DATABASE.stunSpore },
      { level: 18, move: MOVES_DATABASE.sleepPowder },
      { level: 24, move: MOVES_DATABASE.acid },
      { level: 35, move: MOVES_DATABASE.moonlight },
      { level: 44, move: MOVES_DATABASE.petalDance },
    ],

    tmhm: [
      "Toxik",
      "Balle Graine",
      "Puissance Cachée",
      "Zénith",
      "Abri",
      "Méga-Sangsue",
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
