import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";

import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const SEEL_SPECIES = {
  id: "seel",
  pokedexId: "086",
  name: "OTARIA",
  types: ["WATER"],
  femaleRate: 50,
  catchRate: 190,
  growthRate: GROWTH_RATES_DATABASE.MEDIUM_FAST,
  baseExp: 100,
  baseStats: {
    hp: 65,
    attack: 45,
    defense: 55,
    specialAtt: 45,
    specialDef: 70,
    speed: 45,
  },
  animations: {
    idle: {
      front: "seel_front_idle",
      back: "seel_back_idle",
    },
  },
  evolutions: [
    {
      method: "level",
      level: 34,
      target: "dewgong",
    },
  ],
  learnset: {
    levelUp: [
      { level: 1, move: MOVES_DATABASE.headbutt },
      { level: 9, move: MOVES_DATABASE.growl },
      { level: 17, move: MOVES_DATABASE.icyWind },
      { level: 21, move: MOVES_DATABASE.auroraBeam },
      { level: 29, move: MOVES_DATABASE.rest },
      { level: 37, move: MOVES_DATABASE.takeDown },
      { level: 41, move: MOVES_DATABASE.iceBeam },
      { level: 49, move: MOVES_DATABASE.safeguard },
    ],
    tmhm: [
      "Toxik",
      "Grêle",
      "Puissance Cachée",
      "Laser Glace",
      "Blizzard",
      "Ultralaser",
      "Protection",
      "Danse Pluie",
      "Rune Protect",
      "Frustration",
      "Retour",
      "Reflet",
      "Onde de Choc",
      "Façade",
      "Force Secrète",
      "Repos",
      "Attraction",
      "Surf",
      "Force",
      "Cascade",
      "Plongée",
    ],
  },
};
