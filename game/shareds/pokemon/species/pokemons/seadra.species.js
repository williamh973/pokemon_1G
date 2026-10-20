import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";

import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const SEADRA_SPECIES = {
  id: "seadra",
  pokedexId: "117",
  name: "HYPOCÉAN",
  types: ["WATER"],
  femaleRate: 50,
  catchRate: 75,
  growthRate: GROWTH_RATES_DATABASE.MEDIUM_FAST,
  baseExp: 155,
  baseStats: {
    hp: 55,
    attack: 65,
    defense: 95,
    specialAtt: 95,
    specialDef: 45,
    speed: 85,
  },
  animations: {
    idle: {
      front: "seadra_front_idle",
      back: "seadra_back_idle",
    },
  },
  evolutions: [],
  learnset: {
    levelUp: [
      { level: 1, move: MOVES_DATABASE.bubble },
      { level: 1, move: MOVES_DATABASE.smokescreen },
      { level: 1, move: MOVES_DATABASE.leer },
      { level: 1, move: MOVES_DATABASE.waterGun },
      { level: 8, move: MOVES_DATABASE.smokescreen },
      { level: 15, move: MOVES_DATABASE.leer },
      { level: 22, move: MOVES_DATABASE.waterGun },
      { level: 29, move: MOVES_DATABASE.twister },
      { level: 40, move: MOVES_DATABASE.agility },
      { level: 51, move: MOVES_DATABASE.hydroPump },
      { level: 62, move: MOVES_DATABASE.dragonDance },
    ],
    tmhm: [
      "Onde Boréale",
      "Toxik",
      "Grêle",
      "Puissance Cachée",
      "Laser Glace",
      "Blizzard",
      "Ultralaser",
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
