import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.JS";
import { MOVES_DATABASE } from "../../moves/moves.database.JS";

export const RHYHORN_SPECIES = {
  id: "rhyhorn",
  pokedexId: "111",
  name: "RHINOCORNE",
  types: ["GROUND", "ROCK"],
  femaleRate: 50,
  catchRate: 120,
  growthRate: GROWTH_RATES_DATABASE.SLOW,
  baseExp: 135,

  baseStats: {
    hp: 80,
    attack: 85,
    defense: 95,
    specialAtt: 30,
    specialDef: 30,
    speed: 25,
  },

  animations: {
    idle: {
      front: "rhyhorn_front_idle",
      back: "rhyhorn_back_idle",
    },
  },

  evolutions: [
    {
      method: "level",
      level: 42,
      target: "rhydon",
    },
  ],

  learnset: {
    levelUp: [
      { level: 1, move: MOVES_DATABASE.hornAttack },
      { level: 1, move: MOVES_DATABASE.tailWhip },
      { level: 10, move: MOVES_DATABASE.stomp },
      { level: 15, move: MOVES_DATABASE.furyAttack },
      { level: 20, move: MOVES_DATABASE.scaryFace },
      { level: 25, move: MOVES_DATABASE.hornDrill },
      { level: 30, move: MOVES_DATABASE.tackle },
      { level: 35, move: MOVES_DATABASE.takeDown },
      { level: 40, move: MOVES_DATABASE.furyAttack },
      { level: 45, move: MOVES_DATABASE.leer },
      { level: 50, move: MOVES_DATABASE.earthquake },
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
      "Frappe Atlas",
      "Tomberoche",
      "Repos",
      "Clonage",
      "Éboulement",
    ],
  },
};
