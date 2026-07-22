import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";
import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const MEWTWO_SPECIES = {
  id: "mewtwo",
  pokedexId: "150",
  name: "MEWTWO",

  types: ["PSYCHIC"],

  femaleRate: 0,

  catchRate: 3,

  growthRate: GROWTH_RATES_DATABASE.SLOW,

  baseExp: 220,

  baseStats: {
    hp: 106,
    attack: 110,
    defense: 90,
    specialAtt: 154,
    specialDef: 90,
    speed: 130,
  },

  animations: {
    idle: {
      front: "mewtwo_front_idle",
      back: "mewtwo_back_idle",
    },
  },

  evolutions: [],

  learnset: {
    levelUp: [
      { level: 1, move: MOVES_DATABASE.confusion },
      { level: 1, move: MOVES_DATABASE.disable },
      { level: 8, move: MOVES_DATABASE.swift },
      { level: 15, move: MOVES_DATABASE.psychic },
      { level: 22, move: MOVES_DATABASE.barrier },
      { level: 29, move: MOVES_DATABASE.recover },
      { level: 36, move: MOVES_DATABASE.mist },
      { level: 43, move: MOVES_DATABASE.amnesia },
      { level: 50, move: MOVES_DATABASE.psychic },
    ],

    tmhm: [
      "Ultimapoing",
      "Danse Lames",
      "Ultimawashi",
      "Méga-Poing",
      "Méga-Kick",
      "Toxik",
      "Plaquage",
      "Bélier",
      "Damoclès",
      "Frénésie",
      "Draco-Rage",
      "Tonnerre",
      "Fatal-Foudre",
      "Laser Glace",
      "Blizzard",
      "Hypnose",
      "Psyko",
      "Télékinésie",
      "Météores",
      "Séisme",
      "Tunnel",
      "Copie",
      "Reflet",
      "Protection",
      "Patience",
      "Repos",
      "Clonage",
      "Force",
      "Flash",
    ],
  },
};
