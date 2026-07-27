import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";
import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const GYARADOS_SPECIES = {
  id: "gyarados",
  pokedexId: "130",
  name: "LEVIATOR",
  types: ["WATER", "FLYING"],
  femaleRate: 50,
  catchRate: 45,
  growthRate: GROWTH_RATES_DATABASE.SLOW,
  baseExp: 214,
  baseStats: {
    hp: 95,
    attack: 125,
    defense: 79,
    specialAtt: 60,
    specialDef: 100,
    speed: 81,
  },

  animations: {
    idle: {
      front: "gyarados_front_idle",
      back: "gyarados_back_idle",
    },
  },

  evolutions: [],

  learnset: {
    levelUp: [
      { level: 1, move: MOVES_DATABASE.bite },
      { level: 1, move: MOVES_DATABASE.tackle },
      { level: 20, move: MOVES_DATABASE.bite },
      { level: 25, move: MOVES_DATABASE.dragonRage },
      { level: 32, move: MOVES_DATABASE.leer },
      { level: 41, move: MOVES_DATABASE.hydroPump },
      { level: 52, move: MOVES_DATABASE.hyperBeam },
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
      "Laser Glace",
      "Blizzard",
      "Bulles d'O",
      "Tonnerre",
      "Fatal-Foudre",
      "Séisme",
      "Tunnel",
      "Copie",
      "Reflet",
      "Protection",
      "Patience",
      "Météores",
      "Coud'Krâne",
      "Repos",
      "Clonage",
      "Surf",
      "Force",
    ],
  },
};
