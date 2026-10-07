import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";
import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const MOLTRES_SPECIES = {
  id: "moltres",
  pokedexId: "001",
  name: "SULFURA",
  types: ["FIRE", "FLYING"],
  femaleRate: 0,
  catchRate: 3,
  growthRate: GROWTH_RATES_DATABASE.SLOW,
  baseExp: 217,
  baseStats: {
    hp: 90,
    attack: 100,
    defense: 90,
    specialAtt: 125,
    specialDef: 85,
    speed: 90,
  },
  animations: {
    idle: {
      front: "moltres_front_idle",
      back: "moltres_back_idle",
    },
  },
  evolutions: [],
  learnset: {
    levelUp: [
      { level: 1, move: MOVES_DATABASE.ember },
      // { level: 1, move: MOVES_DATABASE.fireSpin },
      // { level: 28, move: MOVES_DATABASE.agility },
      // { level: 31, move: MOVES_DATABASE.endure },
      // { level: 34, move: MOVES_DATABASE.flamethrower },
      // { level: 37, move: MOVES_DATABASE.safeguard },
      // { level: 40, move: MOVES_DATABASE.airSlash },
      // { level: 43, move: MOVES_DATABASE.heatWave },
    ],
    tmhm: [
      "Danse Lames",
      "Toxik",
      "Plaquage",
      "Bélier",
      "Damoclès",
      "Frénésie",
      "Méga-Sangsue",
      "Lance-Soleil",
      "Copie",
      "Double Équipe",
      "Reflet",
      "Patience",
      "Repos",
      "Clonage",
      "Coupe",
    ],
  },
};
