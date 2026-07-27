import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";
import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const GEODUDE_SPECIES = {
  id: "geodude",
  pokedexId: "074",
  name: "RACAILLOU",
  types: ["ROCK", "GROUND"],
  femaleRate: 50,
  catchRate: 255,
  growthRate: GROWTH_RATES_DATABASE.MEDIUM_SLOW,
  baseExp: 86,

  baseStats: {
    hp: 40,
    attack: 80,
    defense: 100,
    specialAtt: 30,
    specialDef: 30,
    speed: 20,
  },

  animations: {
    idle: {
      front: "geodude_front_idle",
      back: "geodude_back_idle",
    },
  },

  evolutions: [
    {
      method: "level",
      level: 25,
      target: "graveler",
    },
  ],

  learnset: {
    levelUp: [
      { level: 1, move: MOVES_DATABASE.tackle },
      { level: 1, move: MOVES_DATABASE.defenseCurl },
      { level: 11, move: MOVES_DATABASE.bide },
      { level: 16, move: MOVES_DATABASE.rockThrow },
      { level: 21, move: MOVES_DATABASE.harden },
      { level: 26, move: MOVES_DATABASE.magnitude },
      { level: 31, move: MOVES_DATABASE.selfDestruct },
      { level: 36, move: MOVES_DATABASE.amnesia },
      { level: 41, move: MOVES_DATABASE.earthquake },
      { level: 46, move: MOVES_DATABASE.explosion },
    ],

    tmhm: [
      "Ultimapoing",
      "Mégakick",
      "Toxik",
      "Plaquage",
      "Bélier",
      "Damoclès",
      "Séisme",
      "Tunnel",
      "Force",
      "Destruction",
      "Explosion",
      "Repos",
      "Clonage",
      "Éboulement",
      "Coup d'Boule",
    ],
  },
};
