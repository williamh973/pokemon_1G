import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";

import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const MAGNEMITE_SPECIES = {
  id: "magnemite",
  pokedexId: "081",
  name: "MAGNÉTI",
  types: ["ELECTRIC", "STEEL"],
  femaleRate: 0,
  catchRate: 190,
  growthRate: GROWTH_RATES_DATABASE.MEDIUM_FAST,
  baseExp: 89,
  baseStats: {
    hp: 25,
    attack: 35,
    defense: 70,
    specialAtt: 95,
    specialDef: 55,
    speed: 45,
  },
  animations: {
    idle: {
      front: "magnemite_front_idle",
      back: "magnemite_back_idle",
    },
  },
  evolutions: [
    {
      method: "level",
      level: 30,
      target: "magneton",
    },
  ],
  learnset: {
    levelUp: [
      { level: 1, move: MOVES_DATABASE.tackle },
      { level: 1, move: MOVES_DATABASE.metalSound },
      { level: 6, move: MOVES_DATABASE.thunderShock },
      { level: 11, move: MOVES_DATABASE.supersonic },
      { level: 16, move: MOVES_DATABASE.sonicBoom },
      { level: 21, move: MOVES_DATABASE.thunderWave },
      { level: 26, move: MOVES_DATABASE.spark },
      { level: 32, move: MOVES_DATABASE.lockOn },
      { level: 38, move: MOVES_DATABASE.swift },
      { level: 44, move: MOVES_DATABASE.screech },
      { level: 50, move: MOVES_DATABASE.zapCannon },
    ],
    tmhm: [
      "Toxik",
      "Zénith",
      "Puissance Cachée",
      "Protection",
      "Danse Pluie",
      "Frustration",
      "Tonnerre",
      "Fatal-Foudre",
      "Retour",
      "Reflet",
      "Mur Lumière",
      "Onde de Choc",
      "Façade",
      "Force Secrète",
      "Repos",
      "Flash",
    ],
  },
};
