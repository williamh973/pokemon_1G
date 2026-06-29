import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";
import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const ONIX_SPECIES = {
  id: "onix",
  pokedexId: "095",
  name: "ONIX",
  types: ["ROCK"],
  femaleRate: 50,
  catchRate: 45,
  growthRate: GROWTH_RATES_DATABASE.MEDIUM_FAST,
  baseExp: 77,
  baseStats: {
    hp: 35,
    attack: 45,
    defense: 160,
    specialAtt: 30,
    specialDef: 45,
    speed: 70,
  },
  animations: {
    idle: {
      front: "onix_front_idle",
      back: "onix_back_idle",
    },
  },
  evolutions: [{ method: "metal_skin", level: 0, target: "steelix" }],
  learnset: {
    levelUp: [
      { level: 1, move: MOVES_DATABASE.tackle },
      { level: 1, move: MOVES_DATABASE.creaking },
      { level: 15, move: MOVES_DATABASE.embrace },
    ],
    tmhm: [
      "Toxik",
      "Plaquage",
      "Damoclès",
      "Bélier",
      "Frénésie",
      "Séisme",
      "Abîme",
      "Tunnel",
      "Mimique",
      "Patience",
      "Reflet",
      "Repos",
      "Coud'Krâne",
      "Éboulement",
      "Clonage",
      "Force",
    ],
  },
};
