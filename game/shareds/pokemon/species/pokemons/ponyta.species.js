import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";

import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const PONYTA_SPECIES = {
  id: "ponyta",
  pokedexId: "077",
  name: "PONYTA",
  types: ["FIRE"],
  femaleRate: 50,
  catchRate: 190,
  growthRate: GROWTH_RATES_DATABASE.MEDIUM_FAST,
  baseExp: 152,
  baseStats: {
    hp: 50,
    attack: 85,
    defense: 55,
    specialAtt: 65,
    specialDef: 65,
    speed: 90,
  },
  animations: {
    idle: {
      front: "ponyta_front_idle",
      back: "ponyta_back_idle",
    },
  },
  evolutions: [
    {
      method: "level",
      level: 40,
      target: "rapidash",
    },
  ],
  learnset: {
    levelUp: [
      { level: 1, move: MOVES_DATABASE.tackle },
      { level: 5, move: MOVES_DATABASE.growl },
      { level: 9, move: MOVES_DATABASE.tailWhip },
      { level: 14, move: MOVES_DATABASE.ember },
      { level: 19, move: MOVES_DATABASE.stomp },
      { level: 25, move: MOVES_DATABASE.fireSpin },
      { level: 31, move: MOVES_DATABASE.takeDown },
      { level: 38, move: MOVES_DATABASE.agility },
      { level: 45, move: MOVES_DATABASE.bounce },
      { level: 53, move: MOVES_DATABASE.fireBlast },
    ],
    tmhm: [
      "Toxik",
      "Puissance Cachée",
      "Zénith",
      "Abri",
      "Frustration",
      "Lance-Soleil",
      "Queue de Fer",
      "Retour",
      "Reflet",
      "Lance-Flammes",
      "Déflagration",
      "Façade",
      "Force Secrète",
      "Repos",
      "Attraction",
      "Surchauffe",
      "Force",
    ],
  },
};
