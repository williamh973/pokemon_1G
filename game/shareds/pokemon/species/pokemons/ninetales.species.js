import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";

import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const NINETALES_SPECIES = {
  id: "ninetales",

  pokedexId: "038",

  name: "FEUNARD",

  types: ["FIRE"],

  femaleRate: 75,

  catchRate: 75,

  growthRate: GROWTH_RATES_DATABASE.MEDIUM_FAST,

  baseExp: 178,

  baseStats: {
    hp: 73,
    attack: 76,
    defense: 75,
    specialAtt: 81,
    specialDef: 100,
    speed: 100,
  },

  animations: {
    idle: {
      front: "ninetales_front_idle",
      back: "ninetales_back_idle",
    },
  },

  evolutions: [],

  learnset: {
    levelUp: [
      { level: 1, move: MOVES_DATABASE.ember },
      { level: 1, move: MOVES_DATABASE.quickAttack },
      //   { level: 1, move: MOVES_DATABASE.confuseRay },
      //   { level: 1, move: MOVES_DATABASE.safeguard },
      //   { level: 45, move: MOVES_DATABASE.fireSpin },
    ],

    tmhm: [
      "Hurlement",
      "Toxik",
      "Puissance Cachée",
      "Zénith",
      "Ultralaser",
      "Abri",
      "Rune Protect",
      "Frustration",
      "Queue de Fer",
      "Retour",
      "Tunnel",
      "Reflet",
      "Lance-Flammes",
      "Déflagration",
      "Façade",
      "Force Secrète",
      "Repos",
      "Attraction",
      "Surchauffe",
    ],
  },
};
