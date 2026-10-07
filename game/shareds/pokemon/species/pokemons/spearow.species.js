import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";
import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const SPEAROW_SPECIES = {
  id: "spearow",

  pokedexId: "021",

  name: "PIAFABEC",

  types: ["NORMAL", "FLYING"],

  femaleRate: 50,

  catchRate: 255,

  growthRate: GROWTH_RATES_DATABASE.MEDIUM_FAST,

  baseExp: 58,

  baseStats: {
    hp: 40,
    attack: 60,
    defense: 30,
    specialAtt: 31,
    specialDef: 31,
    speed: 70,
  },

  animations: {
    idle: {
      front: "spearow_front_idle",
      back: "spearow_back_idle",
    },
  },

  evolutions: [
    {
      method: "level",
      level: 20,
      target: "fearow",
    },
  ],

  learnset: {
    levelUp: [
      { level: 1, move: MOVES_DATABASE.growl },
      //   { level: 1, move: MOVES_DATABASE.peck },

      //   { level: 7, move: MOVES_DATABASE.leer },
      //   { level: 13, move: MOVES_DATABASE.furyAttack },
      //   { level: 19, move: MOVES_DATABASE.pursuit },
      //   { level: 25, move: MOVES_DATABASE.aerialAce },
      //   { level: 31, move: MOVES_DATABASE.mirrorMove },
      //   { level: 37, move: MOVES_DATABASE.drillPeck },
      //   { level: 43, move: MOVES_DATABASE.agility },
    ],

    tmhm: [
      "Toxik",
      "Puissance Cachée",
      "Zénith",
      "Abri",
      "Danse Pluie",
      "Frustration",
      "Retour",
      "Double Team",
      "Aéropique",
      "Facade",
      "Force Secrète",
      "Repos",
      "Attraction",
      "Larcin",
      "Aile d'Acier",
      "Vol",
    ],
  },
};
