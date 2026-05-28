import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";
import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const PIDGEY_SPECIES = {
  id: "pidgey",
  pokedexId: "016",
  name: "ROUCOOL",
  types: ["FLIGHT", "NORMAL"],
  femaleRate: 50,
  catchRate: 255,
  growthRate: GROWTH_RATES_DATABASE.FAST,
  baseExp: 55,
  baseStats: {
    hp: 40,
    attack: 45,
    defense: 40,
    specialAtt: 35,
    specialDef: 35,
    speed: 56,
  },
  animations: {
    idle: {
      front: "pidgey_front_idle",
      back: "pidgey_back_idle",
    },
  },
  evolutions: [{ method: "level", level: 18, target: "pidgeotto" }],
  learnset: {
    levelUp: [
      { level: 1, move: MOVES_DATABASE.tackle },
      { level: 6, move: "Jet de Sable" },
      { level: 9, move: "Tornade" },
    ],
    tmhm: [
      "Coupe-Vent",
      "Cyclone",
      "Toxik",
      "Bélier",
      "Damoclès",
      "Rage",
      "Copie",
      "Reflet",
      "Protection",
      "Patience",
      "Météores",
      "Piqué",
      "Repos",
      "Clonage",
      "Vol",
    ],
  },
};
