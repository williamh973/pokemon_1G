import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";
import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const DRATINI_SPECIES = {
  id: "dratini",
  pokedexId: "147",
  name: "MINIDRACO",
  types: ["DRAGON"],
  femaleRate: 50,
  catchRate: 45,
  growthRate: GROWTH_RATES_DATABASE.SLOW,
  baseExp: 60,
  baseStats: {
    hp: 41,
    attack: 64,
    defense: 45,
    specialAtt: 50,
    specialDef: 50,
    speed: 50,
  },
  animations: {
    idle: {
      front: "dratini_front_idle",
      back: "dratini_back_idle",
    },
  },
  evolutions: [
    {
      method: "level",
      level: 30,
      target: "dragonair",
    },
  ],
  learnset: {
    levelUp: [
      { level: 1, move: MOVES_DATABASE.wrap },
      { level: 1, move: MOVES_DATABASE.leer },
      { level: 10, move: MOVES_DATABASE.thunderWave },
      { level: 20, move: MOVES_DATABASE.twister },
      { level: 30, move: MOVES_DATABASE.slam },
      { level: 40, move: MOVES_DATABASE.agility },
      { level: 50, move: MOVES_DATABASE.dragonRage },
      { level: 60, move: MOVES_DATABASE.hyperBeam },
    ],

    tmhm: [
      "Ultimapoing",
      "Danse Lames",
      "Ultimawashi",
      "Toxik",
      "Plaquage",
      "Bélier",
      "Damoclès",
      "Draco-Rage",
      "Tonnerre",
      "Fatal-Foudre",
      "Laser Glace",
      "Blizzard",
      "Tunnel",
      "Copie",
      "Reflet",
      "Protection",
      "Patience",
      "Météores",
      "Repos",
      "Clonage",
      "Surf",
      "Force",
    ],
  },
};
