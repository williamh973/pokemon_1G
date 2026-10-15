import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";

import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const ARCANINE_SPECIES = {
  id: "arcanine",
  pokedexId: "059",
  name: "ARCANIN",
  types: ["FIRE"],
  femaleRate: 25,
  catchRate: 75,
  growthRate: GROWTH_RATES_DATABASE.SLOW,
  baseExp: 213,
  baseStats: {
    hp: 90,
    attack: 110,
    defense: 80,
    specialAtt: 100,
    specialDef: 80,
    speed: 95,
  },
  animations: {
    idle: {
      front: "arcanine_front_idle",
      back: "arcanine_back_idle",
    },
  },
  evolutions: [],
  learnset: {
    levelUp: [
      { level: 1, move: MOVES_DATABASE.bite },
      { level: 1, move: MOVES_DATABASE.roar },
      { level: 1, move: MOVES_DATABASE.ember },
      { level: 1, move: MOVES_DATABASE.odorSleuth },
      { level: 49, move: MOVES_DATABASE.extremeSpeed },
    ],
    tmhm: [
      "Hurlement",
      "Toxik",
      "Puissance Cachée",
      "Zénith",
      "Ultralaser",
      "Abri",
      "Frustration",
      "Queue de Fer",
      "Retour",
      "Tunnel",
      "Reflet",
      "Lance-Flammes",
      "Déflagration",
      "Aéropique",
      "Façade",
      "Force Secrète",
      "Repos",
      "Attraction",
      "Larcin",
      "Surchauffe",
      "Force",
      "Éclate-Roc",
    ],
  },
};
