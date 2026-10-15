import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";

import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const BELLSPROUT_SPECIES = {
  id: "bellsprout",
  pokedexId: "069",
  name: "CHETIFLOR",
  types: ["GRASS", "POISON"],
  femaleRate: 50,
  catchRate: 255,
  growthRate: GROWTH_RATES_DATABASE.MEDIUM_SLOW,
  baseExp: 84,
  baseStats: {
    hp: 50,
    attack: 75,
    defense: 35,
    specialAtt: 70,
    specialDef: 30,
    speed: 40,
  },
  animations: {
    idle: {
      front: "bellsprout_front_idle",
      back: "bellsprout_back_idle",
    },
  },
  evolutions: [{ method: "level", level: 21, target: "weepinbell" }],
  learnset: {
    levelUp: [
      { level: 1, move: MOVES_DATABASE.vineWhip },
      { level: 6, move: MOVES_DATABASE.growth },
      { level: 11, move: MOVES_DATABASE.wrap },
      { level: 15, move: MOVES_DATABASE.sleepPowder },
      { level: 17, move: MOVES_DATABASE.poisonPowder },
      { level: 19, move: MOVES_DATABASE.stunSpore },
      { level: 23, move: MOVES_DATABASE.acid },
      { level: 30, move: MOVES_DATABASE.sweetScent },
      { level: 37, move: MOVES_DATABASE.razorLeaf },
      { level: 45, move: MOVES_DATABASE.slam },
    ],
    tmhm: [
      "Toxik",
      "Balle Graine",
      "Puissance Cachée",
      "Zénith",
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
