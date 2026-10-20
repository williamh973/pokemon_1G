import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";

import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const HORSEA_SPECIES = {
  id: "horsea",
  pokedexId: "116",
  name: "HYPOTREMPE",
  types: ["WATER"],
  femaleRate: 50,
  catchRate: 225,
  growthRate: GROWTH_RATES_DATABASE.MEDIUM_FAST,
  baseExp: 83,
  baseStats: {
    hp: 30,
    attack: 40,
    defense: 70,
    specialAtt: 70,
    specialDef: 25,
    speed: 60,
  },
  animations: {
    idle: {
      front: "horsea_front_idle",
      back: "horsea_back_idle",
    },
  },
  evolutions: [
    {
      method: "level",
      level: 32,
      target: "seadra",
    },
  ],
  learnset: {
    levelUp: [
      { level: 1, move: MOVES_DATABASE.bubble },
      { level: 8, move: MOVES_DATABASE.smokescreen },
      { level: 15, move: MOVES_DATABASE.leer },
      { level: 22, move: MOVES_DATABASE.waterGun },
      { level: 29, move: MOVES_DATABASE.twister },
      { level: 36, move: MOVES_DATABASE.agility },
      { level: 43, move: MOVES_DATABASE.hydroPump },
      { level: 50, move: MOVES_DATABASE.dragonDance },
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
      "Plongée",
    ],
  },
};
