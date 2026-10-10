import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";

import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const VULPIX_SPECIES = {
  id: "vulpix",

  pokedexId: "037",

  name: "VULPIX",

  types: ["FIRE"],

  femaleRate: 75,

  catchRate: 190,

  growthRate: GROWTH_RATES_DATABASE.MEDIUM_FAST,

  baseExp: 63,

  baseStats: {
    hp: 38,
    attack: 41,
    defense: 40,
    specialAtt: 50,
    specialDef: 65,
    speed: 65,
  },

  animations: {
    idle: {
      front: "vulpix_front_idle",
      back: "vulpix_back_idle",
    },
  },

  evolutions: [{ method: "item", item: "fireStone", target: "ninetales" }],

  learnset: {
    levelUp: [
      { level: 1, move: MOVES_DATABASE.ember },
      { level: 5, move: MOVES_DATABASE.tailWhip },
      { level: 9, move: MOVES_DATABASE.roar },
      { level: 13, move: MOVES_DATABASE.quickAttack },
      { level: 17, move: MOVES_DATABASE.willOWisp },
      { level: 21, move: MOVES_DATABASE.confuseRay },
      { level: 25, move: MOVES_DATABASE.imprison },
      { level: 29, move: MOVES_DATABASE.flamethrower },
      { level: 33, move: MOVES_DATABASE.safeguard },
      { level: 37, move: MOVES_DATABASE.grudge },
      { level: 41, move: MOVES_DATABASE.fireSpin },
    ],

    tmhm: [
      "Hurlement",
      "Toxik",
      "Puissance Cachée",
      "Zénith",
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
