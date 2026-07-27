import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";
import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const CHARIZARD_SPECIES = {
  id: "charizard",
  pokedexId: "006",
  name: "DRACAUFEU",

  types: ["FIRE", "FLYING"],

  femaleRate: 50,
  catchRate: 45,

  growthRate: GROWTH_RATES_DATABASE.MEDIUM_SLOW,

  baseExp: 209,

  baseStats: {
    hp: 78,
    attack: 84,
    defense: 78,
    specialAtt: 109,
    specialDef: 85,
    speed: 100,
  },

  animations: {
    idle: {
      front: "charizard_front_idle",
      back: "charizard_back_idle",
    },
  },

  evolutions: [],

  learnset: {
    levelUp: [
      { level: 1, move: MOVES_DATABASE.tackle },
      { level: 1, move: MOVES_DATABASE.tailWhip },
      { level: 7, move: MOVES_DATABASE.ember },
      { level: 13, move: MOVES_DATABASE.smokescreen },
      { level: 20, move: MOVES_DATABASE.rage },
      { level: 27, move: MOVES_DATABASE.scaryFace },
      { level: 34, move: MOVES_DATABASE.flamethrower },
      { level: 41, move: MOVES_DATABASE.slash },
      { level: 48, move: MOVES_DATABASE.fireSpin },
    ],

    tmhm: [
      "Ultimapoing",
      "Danse Lames",
      "Ultimawashi",
      "Toxik",
      "Plaquage",
      "Bélier",
      "Damoclès",
      "Sacrifice",
      "Riposte",
      "Frappe Atlas",
      "Frénésie",
      "Draco-Rage",
      "Tunnel",
      "Séisme",
      "Lance-Flammes",
      "Déflagration",
      "Copie",
      "Reflet",
      "Protection",
      "Patience",
      "Météores",
      "Coud'Krâne",
      "Repos",
      "Clonage",
      "Coupe",
      "Force",
      "Vol",
    ],
  },
};
