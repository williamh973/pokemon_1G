import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";
import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const ZUBAT_SPECIES = {
  id: "zubat",
  pokedexId: "041",
  name: "NOSFERAPTI",
  types: ["POISON", "FLIGHT"],
  femaleRate: 50,
  catchRate: 255,
  growthRate: GROWTH_RATES_DATABASE.MEDIUM_FAST,
  baseExp: 54,
  baseStats: {
    hp: 40,
    attack: 45,
    defense: 35,
    specialAtt: 30,
    specialDef: 40,
    speed: 55,
  },
  animations: {
    idle: {
      front: "zubat_front_idle",
      back: "zubat_back_idle",
    },
  },
  evolutions: [{ method: "level", level: 22, target: "golbat" }],
  learnset: {
    levelUp: [
      { level: 1, move: MOVES_DATABASE.vampirism },
      { level: 10, move: MOVES_DATABASE.ultrasound },
    ],
    tmhm: [
      "Coupe-Vent",
      "Cyclone",
      "Toxik",
      "Bélier",
      "Ultimapoing",
      "Frénésie",
      "Méga-Sangsue",
      "Mimique",
      "Reflet",
      "Patience",
      "Météores",
      "Repos",
      "Clonage",
    ],
  },
};
