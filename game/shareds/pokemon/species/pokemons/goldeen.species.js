import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";

import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const GOLDEEN_SPECIES = {
  id: "goldeen",
  pokedexId: "118",
  name: "POISSIRÈNE",
  types: ["WATER"],
  femaleRate: 50,
  catchRate: 225,
  growthRate: GROWTH_RATES_DATABASE.MEDIUM_FAST,
  baseExp: 111,
  baseStats: {
    hp: 45,
    attack: 67,
    defense: 60,
    specialAtt: 35,
    specialDef: 50,
    speed: 63,
  },
  animations: {
    idle: {
      front: "goldeen_front_idle",
      back: "goldeen_back_idle",
    },
  },
  evolutions: [
    {
      method: "level",
      level: 33,
      target: "seaking",
    },
  ],
  learnset: {
    levelUp: [
      { level: 1, move: MOVES_DATABASE.tailWhip },
      { level: 1, move: MOVES_DATABASE.peck },
      { level: 1, move: MOVES_DATABASE.waterSport },
      { level: 10, move: MOVES_DATABASE.supersonic },
      { level: 15, move: MOVES_DATABASE.hornAttack },
      { level: 24, move: MOVES_DATABASE.flail },
      { level: 29, move: MOVES_DATABASE.furyAttack },
      { level: 38, move: MOVES_DATABASE.waterfall },
      { level: 43, move: MOVES_DATABASE.hornDrill },
      { level: 52, move: MOVES_DATABASE.agility },
      { level: 57, move: MOVES_DATABASE.megahorn },
    ],
    tmhm: [
      "Onde Boréale",
      "Toxik",
      "Grêle",
      "Puissance Cachée",
      "Laser Glace",
      "Blizzard",
      "Protection",
      "Danse Pluie",
      "Frustration",
      "Retour",
      "Reflet",
      "Façade",
      "Force Secrète",
      "Repos",
      "Attraction",
      "Surf",
      "Cascade",
    ],
  },
};
