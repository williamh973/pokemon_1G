import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";

import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const OMANYTE_SPECIES = {
  id: "omanyte",
  pokedexId: "138",
  name: "AMONITA",
  types: ["ROCK", "WATER"],
  femaleRate: 12.5,
  catchRate: 45,
  growthRate: GROWTH_RATES_DATABASE.MEDIUM_FAST,
  baseExp: 120,
  baseStats: {
    hp: 35,
    attack: 40,
    defense: 100,
    specialAtt: 90,
    specialDef: 55,
    speed: 35,
  },
  animations: {
    idle: {
      front: "omanyte_front_idle",
      back: "omanyte_back_idle",
    },
  },
  evolutions: [
    {
      method: "level",
      level: 40,
      target: "omastar",
    },
  ],
  learnset: {
    levelUp: [
      { level: 1, move: MOVES_DATABASE.constrict },
      { level: 1, move: MOVES_DATABASE.withdraw },
      { level: 13, move: MOVES_DATABASE.bite },
      { level: 19, move: MOVES_DATABASE.waterGun },
      { level: 25, move: MOVES_DATABASE.mudShot },
      { level: 31, move: MOVES_DATABASE.leer },
      { level: 37, move: MOVES_DATABASE.protect },
      { level: 43, move: MOVES_DATABASE.tackle },
      { level: 49, move: MOVES_DATABASE.ancientPower },
      { level: 55, move: MOVES_DATABASE.hydroPump },
    ],
    tmhm: [
      "Toxik",
      "Grêle",
      "Puissance Cachée",
      "Laser Glace",
      "Blizzard",
      "Protection",
      "Danse Pluie",
      "Frustration",
      "Retour",
      "Tunnel",
      "Reflet",
      "Tomberoche",
      "Façade",
      "Force Secrète",
      "Repos",
      "Attraction",
      "Larcin",
      "Surf",
      "Éclate-Roc",
      "Cascade",
    ],
  },
};
