import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";

import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const KABUTO_SPECIES = {
  id: "kabuto",
  pokedexId: "140",
  name: "KABUTO",
  types: ["ROCK", "WATER"],
  femaleRate: 12.5,
  catchRate: 45,
  growthRate: GROWTH_RATES_DATABASE.MEDIUM_FAST,
  baseExp: 119,
  baseStats: {
    hp: 30,
    attack: 80,
    defense: 90,
    specialAtt: 55,
    specialDef: 45,
    speed: 55,
  },
  animations: {
    idle: {
      front: "kabuto_front_idle",
      back: "kabuto_back_idle",
    },
  },
  evolutions: [
    {
      method: "level",
      level: 40,
      target: "kabutops",
    },
  ],
  learnset: {
    levelUp: [
      { level: 1, move: MOVES_DATABASE.scratch },
      { level: 1, move: MOVES_DATABASE.harden },
      { level: 13, move: MOVES_DATABASE.absorb },
      { level: 19, move: MOVES_DATABASE.leer },
      { level: 25, move: MOVES_DATABASE.mudShot },
      { level: 31, move: MOVES_DATABASE.sandAttack },
      { level: 37, move: MOVES_DATABASE.endure },
      { level: 43, move: MOVES_DATABASE.metalSound },
      { level: 49, move: MOVES_DATABASE.megaDrain },
      { level: 55, move: MOVES_DATABASE.ancientPower },
    ],
    tmhm: [
      "Ultrason",
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
      "Onde Boréale",
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
