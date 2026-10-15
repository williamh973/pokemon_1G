import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";

import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const ABRA_SPECIES = {
  id: "abra",
  pokedexId: "063",
  name: "ABRA",
  types: ["PSYCHIC"],
  femaleRate: 25,
  catchRate: 200,
  growthRate: GROWTH_RATES_DATABASE.MEDIUM_SLOW,
  baseExp: 62,
  baseStats: {
    hp: 25,
    attack: 20,
    defense: 15,
    specialAtt: 105,
    specialDef: 55,
    speed: 90,
  },
  animations: {
    idle: {
      front: "abra_front_idle",
      back: "abra_back_idle",
    },
  },
  evolutions: [{ method: "level", level: 16, target: "kadabra" }],
  learnset: {
    levelUp: [{ level: 1, move: MOVES_DATABASE.teleport }],
    tmhm: [
      "Poing-Focus",
      "Plénitude",
      "Toxik",
      "Puissance Cachée",
      "Zénith",
      "Ball'Ombre",
      "Reflet",
      "Protection",
      "Onde de Choc",
      "Tourmente",
      "Façade",
      "Force Secrète",
      "Repos",
      "Attraction",
      "Larcin",
      "Échange",
      "Saisie",
      "Flash",
    ],
  },
};
