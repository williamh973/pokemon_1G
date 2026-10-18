import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";

import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const VOLTORB_SPECIES = {
  id: "voltorb",
  pokedexId: "100",
  name: "VOLTORBE",
  types: ["ELECTRIC"],
  femaleRate: 0,
  catchRate: 190,
  growthRate: GROWTH_RATES_DATABASE.MEDIUM_FAST,
  baseExp: 103,
  baseStats: {
    hp: 40,
    attack: 30,
    defense: 50,
    specialAtt: 55,
    specialDef: 55,
    speed: 100,
  },
  animations: {
    idle: {
      front: "voltorb_front_idle",
      back: "voltorb_back_idle",
    },
  },
  evolutions: [
    {
      method: "level",
      level: 30,
      target: "electrode",
    },
  ],
  learnset: {
    levelUp: [
      { level: 1, move: MOVES_DATABASE.tackle },
      { level: 1, move: MOVES_DATABASE.charge },
      { level: 8, move: MOVES_DATABASE.screech },
      { level: 15, move: MOVES_DATABASE.sonicBoom },
      { level: 21, move: MOVES_DATABASE.spark },
      { level: 27, move: MOVES_DATABASE.selfDestruct },
      { level: 32, move: MOVES_DATABASE.rollout },
      { level: 37, move: MOVES_DATABASE.lightScreen },
      { level: 42, move: MOVES_DATABASE.swift },
      { level: 46, move: MOVES_DATABASE.explosion },
      { level: 49, move: MOVES_DATABASE.mirrorCoat },
    ],
    tmhm: [
      "Toxik",
      "Puissance Cachée",
      "Provoc",
      "Mur Lumière",
      "Protection",
      "Danse Pluie",
      "Frustration",
      "Tonnerre",
      "Fatal-Foudre",
      "Retour",
      "Reflet",
      "Onde de Choc",
      "Tourmente",
      "Façade",
      "Force Secrète",
      "Repos",
      "Larcin",
      "Flash",
    ],
  },
};
