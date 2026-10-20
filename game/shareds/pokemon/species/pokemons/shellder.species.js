import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";

import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const SHELLDER_SPECIES = {
  id: "shellder",
  pokedexId: "090",
  name: "KOKIYAS",
  types: ["WATER"],
  femaleRate: 50,
  catchRate: 190,
  growthRate: GROWTH_RATES_DATABASE.SLOW,
  baseExp: 97,
  baseStats: {
    hp: 30,
    attack: 65,
    defense: 100,
    specialAtt: 45,
    specialDef: 25,
    speed: 40,
  },
  animations: {
    idle: {
      front: "shellder_front_idle",
      back: "shellder_back_idle",
    },
  },
  evolutions: [
    {
      method: "item",
      item: "waterStone",
      target: "cloyster",
    },
  ],
  learnset: {
    levelUp: [
      { level: 1, move: MOVES_DATABASE.tackle },
      { level: 1, move: MOVES_DATABASE.withdraw },
      { level: 8, move: MOVES_DATABASE.icicleSpear },
      { level: 15, move: MOVES_DATABASE.supersonic },
      { level: 22, move: MOVES_DATABASE.auroraBeam },
      { level: 29, move: MOVES_DATABASE.protect },
      { level: 36, move: MOVES_DATABASE.leer },
      { level: 43, move: MOVES_DATABASE.clamp },
      { level: 50, move: MOVES_DATABASE.iceBeam },
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
      "Plongée",
    ],
  },
};
