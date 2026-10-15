import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";

import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const VICTREEBEL_SPECIES = {
  id: "victreebel",
  pokedexId: "071",
  name: "EMPIFLOR",
  types: ["GRASS", "POISON"],
  femaleRate: 50,
  catchRate: 45,
  growthRate: GROWTH_RATES_DATABASE.MEDIUM_SLOW,
  baseExp: 191,
  baseStats: {
    hp: 80,
    attack: 105,
    defense: 65,
    specialAtt: 100,
    specialDef: 60,
    speed: 70,
  },
  animations: {
    idle: {
      front: "victreebel_front_idle",
      back: "victreebel_back_idle",
    },
  },
  evolutions: [],
  learnset: {
    levelUp: [
      { level: 1, move: MOVES_DATABASE.acid },
      { level: 1, move: MOVES_DATABASE.sweetScent },
      { level: 1, move: MOVES_DATABASE.razorLeaf },
      { level: 1, move: MOVES_DATABASE.sleepPowder },
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
      "Larcin",
      "Coupe",
      "Flash",
    ],
  },
};
