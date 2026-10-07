import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";
import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const KAKUNA_SPECIES = {
  id: "kakuna",
  pokedexId: "014",
  name: "COCONFORT",
  types: ["BUG", "POISON"],
  femaleRate: 50,
  catchRate: 120,
  growthRate: GROWTH_RATES_DATABASE.MEDIUM_FAST,
  baseExp: 71,
  baseStats: {
    hp: 45,
    attack: 25,
    defense: 50,
    specialAtt: 25,
    specialDef: 25,
    speed: 35,
  },
  animations: {
    idle: { front: "kakuna_front_idle", back: "kakuna_back_idle" },
  },
  evolutions: [{ method: "level", level: 10, target: "beedrill" }],
  learnset: { levelUp: [{ level: 1, move: MOVES_DATABASE.harden }], tmhm: [] },
};
