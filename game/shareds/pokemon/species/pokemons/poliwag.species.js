import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";

import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const POLIWAG_SPECIES = {
  id: "poliwag",
  pokedexId: "060",
  name: "PTITARD",
  types: ["WATER"],
  femaleRate: 50,
  catchRate: 255,
  growthRate: GROWTH_RATES_DATABASE.MEDIUM_SLOW,
  baseExp: 77,
  baseStats: {
    hp: 40,
    attack: 50,
    defense: 40,
    specialAtt: 40,
    specialDef: 40,
    speed: 90,
  },
  animations: {
    idle: {
      front: "poliwag_front_idle",
      back: "poliwag_back_idle",
    },
  },
  evolutions: [{ method: "level", level: 25, target: "poliwhirl" }],
  learnset: {
    levelUp: [
      { level: 1, move: MOVES_DATABASE.bubble },
      { level: 7, move: MOVES_DATABASE.hypnosis },
      { level: 13, move: MOVES_DATABASE.waterGun },
      { level: 19, move: MOVES_DATABASE.doubleSlap },
      { level: 25, move: MOVES_DATABASE.rainDance },
      { level: 31, move: MOVES_DATABASE.bodySlam },
      { level: 37, move: MOVES_DATABASE.bellyDrum },
      { level: 43, move: MOVES_DATABASE.hydroPump },
    ],
    tmhm: [
      "Vibraqua",
      "Toxik",
      "Grêle",
      "Puissance Cachée",
      "Laser Glace",
      "Blizzard",
      "Abri",
      "Danse Pluie",
      "Frustration",
      "Retour",
      "Tunnel",
      "Psyko",
      "Reflet",
      "Façade",
      "Force Secrète",
      "Repos",
      "Attraction",
      "Larcin",
      "Surf",
      "Cascade",
      "Plongée",
    ],
  },
};
