import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";

import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const DROWZEE_SPECIES = {
  id: "drowzee",
  pokedexId: "096",
  name: "SOPORIFIK",
  types: ["PSYCHIC"],
  femaleRate: 50,
  catchRate: 190,
  growthRate: GROWTH_RATES_DATABASE.MEDIUM_FAST,
  baseExp: 102,
  baseStats: {
    hp: 60,
    attack: 48,
    defense: 45,
    specialAtt: 43,
    specialDef: 90,
    speed: 42,
  },
  animations: {
    idle: {
      front: "drowzee_front_idle",
      back: "drowzee_back_idle",
    },
  },
  evolutions: [
    {
      method: "level",
      level: 26,
      target: "hypno",
    },
  ],
  learnset: {
    levelUp: [
      { level: 1, move: MOVES_DATABASE.hypnosis },
      { level: 1, move: MOVES_DATABASE.pound },
      { level: 7, move: MOVES_DATABASE.disable },
      { level: 11, move: MOVES_DATABASE.confusion },
      { level: 17, move: MOVES_DATABASE.headbutt },
      { level: 21, move: MOVES_DATABASE.poisonGas },
      { level: 27, move: MOVES_DATABASE.meditate },
      { level: 31, move: MOVES_DATABASE.psychic },
      { level: 37, move: MOVES_DATABASE.psychUp },
      { level: 41, move: MOVES_DATABASE.swagger },
      { level: 47, move: MOVES_DATABASE.futureSight },
    ],
    tmhm: [
      "Poing-Focus",
      "Toxik",
      "Zénith",
      "Provoc",
      "Protection",
      "Danse Pluie",
      "Rune Protect",
      "Frustration",
      "Retour",
      "Psyko",
      "Ball'Ombre",
      "Casse-Brique",
      "Reflet",
      "Tourmente",
      "Façade",
      "Force Secrète",
      "Repos",
      "Attraction",
      "Larcin",
      "Échange",
      "Vol Magnétik",
      "Flash",
    ],
  },
};
