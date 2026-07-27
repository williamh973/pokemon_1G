import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";
import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const VENUSAUR_SPECIES = {
  id: "venusaur",
  pokedexId: "003",
  name: "FLORIZARRE",

  types: ["GRASS", "POISON"],

  femaleRate: 50,
  catchRate: 45,

  growthRate: GROWTH_RATES_DATABASE.MEDIUM_SLOW,

  baseExp: 208,

  baseStats: {
    hp: 80,
    attack: 82,
    defense: 83,
    specialAtt: 100,
    specialDef: 100,
    speed: 80,
  },

  animations: {
    idle: {
      front: "venusaur_front_idle",
      back: "venusaur_back_idle",
    },
  },

  evolutions: [],

  learnset: {
    levelUp: [
      { level: 1, move: MOVES_DATABASE.tackle },
      { level: 1, move: MOVES_DATABASE.tailWhip },
      { level: 7, move: MOVES_DATABASE.vineWhip },
      { level: 13, move: MOVES_DATABASE.poisonPowder },
      { level: 20, move: MOVES_DATABASE.razorLeaf },
      { level: 27, move: MOVES_DATABASE.growth },
      { level: 34, move: MOVES_DATABASE.sleepPowder },
      { level: 41, move: MOVES_DATABASE.solarBeam },
    ],

    tmhm: [
      "Danse Lames",
      "Toxik",
      "Plaquage",
      "Bélier",
      "Damoclès",
      "Frénésie",
      "Méga-Sangsue",
      "Lance-Soleil",
      "Séisme",
      "Tunnel",
      "Copie",
      "Reflet",
      "Protection",
      "Patience",
      "Repos",
      "Clonage",
      "Coupe",
      "Force",
    ],
  },
};
