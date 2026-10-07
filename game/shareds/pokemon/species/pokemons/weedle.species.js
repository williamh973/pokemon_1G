import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";
import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const WEEDLE_SPECIES = {
  id: "weedle",
  pokedexId: "013",
  name: "ASPICOT",
  types: ["BUG", "POISON"],
  femaleRate: 50,
  catchRate: 255,
  growthRate: GROWTH_RATES_DATABASE.MEDIUM_FAST,
  baseExp: 52,
  baseStats: {
    hp: 40,
    attack: 35,
    defense: 30,
    specialAtt: 20,
    specialDef: 20,
    speed: 50,
  },
  animations: {
    idle: { front: "weedle_front_idle", back: "weedle_back_idle" },
  },
  evolutions: [{ method: "level", level: 7, target: "kakuna" }],
  learnset: {
    levelUp: [
      { level: 1, move: MOVES_DATABASE.acid },
      // { level: 1, move: MOVES_DATABASE.stringShot },
    ],
    tmhm: [],
  },
};
