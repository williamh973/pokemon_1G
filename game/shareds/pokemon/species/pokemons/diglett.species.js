import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";

import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const DIGLETT_SPECIES = {
  id: "diglett",
  pokedexId: "050",
  name: "TAUPIQUEUR",
  types: ["GROUND"],
  femaleRate: 50,
  catchRate: 255,
  growthRate: GROWTH_RATES_DATABASE.MEDIUM_FAST,
  baseExp: 81,
  baseStats: {
    hp: 10,
    attack: 55,
    defense: 25,
    specialAtt: 35,
    specialDef: 45,
    speed: 95,
  },
  animations: {
    idle: {
      front: "diglett_front_idle",
      back: "diglett_back_idle",
    },
  },
  evolutions: [{ method: "level", level: 26, target: "dugtrio" }],
  learnset: {
    levelUp: [
      { level: 1, move: MOVES_DATABASE.scratch },
      { level: 1, move: MOVES_DATABASE.sandAttack },
      { level: 5, move: MOVES_DATABASE.growl },
      { level: 9, move: MOVES_DATABASE.magnitude },
      { level: 17, move: MOVES_DATABASE.dig },
      { level: 25, move: MOVES_DATABASE.mudSlap },
      { level: 33, move: MOVES_DATABASE.slash },
      { level: 41, move: MOVES_DATABASE.earthquake },
      { level: 49, move: MOVES_DATABASE.fissure },
    ],
    tmhm: [
      "Toxik",
      "Puissance Cachée",
      "Zénith",
      "Abri",
      "Frustration",
      "Séisme",
      "Retour",
      "Tunnel",
      "Reflet",
      "Bomb-Beurk",
      "Tomberoche",
      "Aéropique",
      "Façade",
      "Force Secrète",
      "Repos",
      "Attraction",
      "Larcin",
      "Coupe",
      "Éclate-Roc",
    ],
  },
};
