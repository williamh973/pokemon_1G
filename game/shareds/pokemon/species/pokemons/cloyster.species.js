import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";

import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const CLOYSTER_SPECIES = {
  id: "cloyster",
  pokedexId: "091",
  name: "CRUSTABRI",
  types: ["WATER", "ICE"],
  femaleRate: 50,
  catchRate: 60,
  growthRate: GROWTH_RATES_DATABASE.SLOW,
  baseExp: 203,
  baseStats: {
    hp: 50,
    attack: 95,
    defense: 180,
    specialAtt: 85,
    specialDef: 45,
    speed: 70,
  },
  animations: {
    idle: {
      front: "cloyster_front_idle",
      back: "cloyster_back_idle",
    },
  },
  evolutions: [],
  learnset: {
    levelUp: [
      { level: 1, move: MOVES_DATABASE.acid },
      //   { level: 1, move: MOVES_DATABASE.supersonic },
      //   { level: 1, move: MOVES_DATABASE.auroraBeam },
      //   { level: 1, move: MOVES_DATABASE.protect },
      //   { level: 33, move: MOVES_DATABASE.spikes },
      //   { level: 41, move: MOVES_DATABASE.spikeCannon },
    ],
    tmhm: [
      "Vibraqua",
      "Toxik",
      "Grêle",
      "Puissance Cachée",
      "Laser Glace",
      "Blizzard",
      "Ultralaser",
      "Abri",
      "Danse Pluie",
      "Frustration",
      "Retour",
      "Reflet",
      "Tourmente",
      "Façade",
      "Force Secrète",
      "Repos",
      "Attraction",
      "Surf",
      "Plongée",
    ],
  },
};
