import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";

import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const GASTLY_SPECIES = {
  id: "gastly",
  pokedexId: "092",
  name: "FANTOMINUS",
  types: ["GHOST", "POISON"],
  femaleRate: 50,
  catchRate: 190,
  growthRate: GROWTH_RATES_DATABASE.MEDIUM_SLOW,
  baseExp: 95,
  baseStats: {
    hp: 30,
    attack: 35,
    defense: 30,
    specialAtt: 100,
    specialDef: 35,
    speed: 80,
  },
  animations: {
    idle: {
      front: "gastly_front_idle",
      back: "gastly_back_idle",
    },
  },
  evolutions: [
    {
      method: "level",
      level: 25,
      target: "haunter",
    },
  ],
  learnset: {
    levelUp: [
      { level: 1, move: MOVES_DATABASE.hypnosis },
      { level: 1, move: MOVES_DATABASE.lick },
      { level: 8, move: MOVES_DATABASE.spite },
      { level: 13, move: MOVES_DATABASE.curse },
      { level: 16, move: MOVES_DATABASE.nightShade },
      { level: 21, move: MOVES_DATABASE.confuseRay },
      { level: 28, move: MOVES_DATABASE.dreamEater },
      { level: 33, move: MOVES_DATABASE.destinyBond },
      { level: 36, move: MOVES_DATABASE.shadowBall },
      { level: 41, move: MOVES_DATABASE.nightmare },
      { level: 48, move: MOVES_DATABASE.meanLook },
    ],
    tmhm: [
      "Toxik",
      "Puissance Cachée",
      "Zénith",
      "Provoc",
      "Protection",
      "Danse Pluie",
      "Giga-Sangsue",
      "Frustration",
      "Tonnerre",
      "Retour",
      "Psyko",
      "Ball'Ombre",
      "Reflet",
      "Bomb-Beurk",
      "Tourmente",
      "Façade",
      "Force Secrète",
      "Repos",
      "Attraction",
      "Larcin",
      "Échange",
      "Vantardise",
    ],
  },
};
