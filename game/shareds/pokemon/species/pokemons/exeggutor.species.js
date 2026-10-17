import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";

import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const EXEGGUTOR_SPECIES = {
  id: "exeggutor",
  pokedexId: "103",
  name: "NOADKOKO",
  types: ["GRASS", "PSYCHIC"],
  femaleRate: 50,
  catchRate: 45,
  growthRate: GROWTH_RATES_DATABASE.SLOW,
  baseExp: 212,
  baseStats: {
    hp: 95,
    attack: 95,
    defense: 85,
    specialAtt: 125,
    specialDef: 65,
    speed: 55,
  },
  animations: {
    idle: {
      front: "exeggutor_front_idle",
      back: "exeggutor_back_idle",
    },
  },
  evolutions: [],
  learnset: {
    levelUp: [
      { level: 1, move: MOVES_DATABASE.hypnosis },
      { level: 1, move: MOVES_DATABASE.barrage },
      { level: 1, move: MOVES_DATABASE.confusion },
      { level: 19, move: MOVES_DATABASE.stomp },
      { level: 31, move: MOVES_DATABASE.eggBomb },
    ],
    tmhm: [
      "Toxik",
      "Balle Graine",
      "Puissance Cachée",
      "Zénith",
      "Ultralaser",
      "Mur Lumière",
      "Protection",
      "Giga-Sangsue",
      "Frustration",
      "Lance-Soleil",
      "Retour",
      "Psyko",
      "Reflet",
      "Bombe Beurk",
      "Façade",
      "Force Secrète",
      "Repos",
      "Attraction",
      "Larcin",
      "Échange",
      "Force",
      "Flash",
    ],
  },
};
