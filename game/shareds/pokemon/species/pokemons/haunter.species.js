import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";

import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const HAUNTER_SPECIES = {
  id: "haunter",
  pokedexId: "093",
  name: "SPECTRUM",
  types: ["GHOST", "POISON"],
  femaleRate: 50,
  catchRate: 90,
  growthRate: GROWTH_RATES_DATABASE.MEDIUM_SLOW,
  baseExp: 142,
  baseStats: {
    hp: 45,
    attack: 50,
    defense: 45,
    specialAtt: 115,
    specialDef: 55,
    speed: 95,
  },
  animations: {
    idle: {
      front: "haunter_front_idle",
      back: "haunter_back_idle",
    },
  },
  evolutions: [
    // Évolution par échange : à adapter à ton système d'évolution.
  ],
  learnset: {
    levelUp: [
      { level: 1, move: MOVES_DATABASE.hypnosis },
      { level: 1, move: MOVES_DATABASE.lick },
      { level: 1, move: MOVES_DATABASE.spite },
      { level: 8, move: MOVES_DATABASE.spite },
      { level: 13, move: MOVES_DATABASE.curse },
      { level: 16, move: MOVES_DATABASE.nightShade },
      { level: 21, move: MOVES_DATABASE.confuseRay },
      { level: 25, move: MOVES_DATABASE.shadowPunch },
      { level: 31, move: MOVES_DATABASE.dreamEater },
      { level: 39, move: MOVES_DATABASE.destinyBond },
      { level: 45, move: MOVES_DATABASE.shadowBall },
      { level: 53, move: MOVES_DATABASE.nightmare },
      { level: 64, move: MOVES_DATABASE.meanLook },
    ],
    tmhm: [
      "Toxik",
      "Zénith",
      "Provoc",
      "Puissance Cachée",
      "Protection",
      "Danse Pluie",
      "Giga-Sangsue",
      "Ball'Ombre",
      "Rayon Chargé",
      "Tourmente",
      "Façade",
      "Force Secrète",
      "Repos",
      "Attraction",
      "Larcin",
    ],
  },
};
