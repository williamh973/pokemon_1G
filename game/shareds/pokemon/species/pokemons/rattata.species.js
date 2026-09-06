import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";
import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const RATTATA_SPECIES = {
  id: "rattata",
  pokedexId: "019",
  name: "RATTATA",
  types: ["NORMAL"],
  femaleRate: 50,
  catchRate: 255,
  growthRate: GROWTH_RATES_DATABASE.MEDIUM_FAST,
  baseExp: 57,
  baseStats: {
    hp: 30,
    attack: 56,
    defense: 35,
    specialAtt: 25,
    specialDef: 35,
    speed: 72,
  },
  animations: {
    idle: {
      front: "rattata_front_idle",
      back: "rattata_back_idle",
    },
  },
  evolutions: [{ method: "level", level: 27, target: "raticate" }],
  learnset: {
    levelUp: [
      { level: 1, move: MOVES_DATABASE.hypnosis },
      // { level: 1, move: MOVES_DATABASE.tailWhip },
      // { level: 1, move: MOVES_DATABASE.tackle },

      // { level: 7, move: MOVES_DATABASE.quickAttack },
    ],
    tmhm: [
      "Toxik",
      "Plaquage",
      "Bélier",
      "Damoclès",
      "Bulles d’O",
      "Pistolet à O",
      "Blizzard",
      "Frénésie",
      "Tonnerre",
      "Fatal-Foudre",
      "Tunnel",
      "Mimique",
      "Reflet",
      "Patience",
      "Vive-Attaque",
      "Coud’Krâne",
      "Repos",
      "Clonage",
    ],
  },
};
