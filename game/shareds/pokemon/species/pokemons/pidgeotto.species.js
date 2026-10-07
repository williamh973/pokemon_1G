import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";
import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const PIDGEOTTO_SPECIES = {
  id: "pidgeotto",
  pokedexId: "017",
  name: "ROUCOUPS",
  types: ["NORMAL", "FLYING"],
  femaleRate: 50,
  catchRate: 120,
  growthRate: GROWTH_RATES_DATABASE.MEDIUM_SLOW,
  baseExp: 113,
  baseStats: {
    hp: 63,
    attack: 60,
    defense: 55,
    specialAtt: 50,
    specialDef: 50,
    speed: 71,
  },
  animations: {
    idle: {
      front: "pidgeotto_front_idle",
      back: "pidgeotto_back_idle",
    },
  },
  evolutions: [
    {
      method: "level",
      level: 36,
      target: "pidgeot",
    },
  ],
  learnset: {
    levelUp: [
      { level: 1, move: MOVES_DATABASE.tackle },
      { level: 1, move: MOVES_DATABASE.sandAttack },
      { level: 1, move: MOVES_DATABASE.gust },
      { level: 5, move: MOVES_DATABASE.sandAttack },
      { level: 9, move: MOVES_DATABASE.gust },
      { level: 13, move: MOVES_DATABASE.quickAttack },
      { level: 20, move: MOVES_DATABASE.whirlwind },
      { level: 27, move: MOVES_DATABASE.wingAttack },
      { level: 34, move: MOVES_DATABASE.featherDance },
      { level: 43, move: MOVES_DATABASE.agility },
      { level: 52, move: MOVES_DATABASE.mirrorMove },
    ],
    tmhm: [
      "Toxik",
      "Puissance Cachée",
      "Zénith",
      "Abri",
      "Danse Pluie",
      "Frustration",
      "Retour",
      "Double Team",
      "Aéropique",
      "Facade",
      "Force Secrète",
      "Repos",
      "Attraction",
      "Larcin",
      "Aile d'Acier",
      "Vol",
    ],
  },
};
