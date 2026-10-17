import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";

import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const EXEGGCUTE_SPECIES = {
  id: "exeggcute",
  pokedexId: "102",
  name: "NOEUNOEUF",
  types: ["GRASS", "PSYCHIC"],
  femaleRate: 50,
  catchRate: 90,
  growthRate: GROWTH_RATES_DATABASE.SLOW,
  baseExp: 98,
  baseStats: {
    hp: 60,
    attack: 40,
    defense: 80,
    specialAtt: 60,
    specialDef: 45,
    speed: 40,
  },
  animations: {
    idle: {
      front: "exeggcute_front_idle",
      back: "exeggcute_back_idle",
    },
  },
  evolutions: [
    {
      method: "item",
      item: "leafStone",
      target: "exeggutor",
    },
  ],
  learnset: {
    levelUp: [
      { level: 1, move: MOVES_DATABASE.hypnosis },
      { level: 1, move: MOVES_DATABASE.barrage },
      { level: 1, move: MOVES_DATABASE.uproar },
      { level: 7, move: MOVES_DATABASE.reflect },
      { level: 13, move: MOVES_DATABASE.leechSeed },
      { level: 19, move: MOVES_DATABASE.confusion },
      { level: 25, move: MOVES_DATABASE.stunSpore },
      { level: 31, move: MOVES_DATABASE.poisonPowder },
      { level: 37, move: MOVES_DATABASE.sleepPowder },
      { level: 43, move: MOVES_DATABASE.solarBeam },
    ],
    tmhm: [
      "Toxik",
      "Zénith",
      "Puissance Cachée",
      "Protection",
      "Frustration",
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
