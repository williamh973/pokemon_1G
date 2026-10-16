import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";

import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const FARFETCHD_SPECIES = {
  id: "farfetchd",
  pokedexId: "083",
  name: "CANARTICHO",
  types: ["NORMAL", "FLYING"],
  femaleRate: 50,
  catchRate: 45,
  growthRate: GROWTH_RATES_DATABASE.MEDIUM_FAST,
  baseExp: 94,
  baseStats: {
    hp: 52,
    attack: 65,
    defense: 55,
    specialAtt: 58,
    specialDef: 62,
    speed: 60,
  },
  animations: {
    idle: {
      front: "farfetchd_front_idle",
      back: "farfetchd_back_idle",
    },
  },
  evolutions: [],
  learnset: {
    levelUp: [
      { level: 1, move: MOVES_DATABASE.acid },
      //   { level: 6, move: MOVES_DATABASE.sandAttack },
      //   { level: 11, move: MOVES_DATABASE.leer },
      //   { level: 16, move: MOVES_DATABASE.furyAttack },
      //   { level: 21, move: MOVES_DATABASE.knockOff },
      //   { level: 26, move: MOVES_DATABASE.furyCutter },
      //   { level: 31, move: MOVES_DATABASE.swordsDance },
      //   { level: 36, move: MOVES_DATABASE.agility },
      //   { level: 41, move: MOVES_DATABASE.slash },
      //   { level: 46, move: MOVES_DATABASE.falseSwipe },
    ],
    tmhm: [
      "Toxik",
      "Puissance Cachée",
      "Zénith",
      "Protection",
      "Frustration",
      "Queue de Fer",
      "Retour",
      "Reflet",
      "Aéropique",
      "Façade",
      "Force Secrète",
      "Repos",
      "Attraction",
      "Larcin",
      "Aile d'Acier",
      "Coupe",
      "Vol",
    ],
  },
};
