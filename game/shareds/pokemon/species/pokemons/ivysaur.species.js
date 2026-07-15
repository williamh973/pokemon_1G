import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";
import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const IVYSAUR_SPECIES = {
  id: "ivysaur",
  pokedexId: "002",
  name: "HERBIZARRE",
  types: ["GRASS", "POISON"],
  femaleRate: 50,
  catchRate: 45,
  growthRate: GROWTH_RATES_DATABASE.MEDIUM_SLOW,
  baseExp: 142,
  baseStats: {
    hp: 60,
    attack: 62,
    defense: 63,
    specialAtt: 80,
    specialDef: 80,
    speed: 60,
  },
  animations: {
    idle: {
      front: "ivysaur_front_idle",
      back: "ivysaur_back_idle",
    },
  },
  evolutions: [{ method: "level", level: 32, target: "venusaur" }],
  learnset: {
    levelUp: [
      { level: 1, move: MOVES_DATABASE.tackle },
      { level: 1, move: MOVES_DATABASE.tailWhip },
      { level: 7, move: MOVES_DATABASE.vineWhip },
      { level: 13, move: MOVES_DATABASE.poisonPowder },
      { level: 20, move: MOVES_DATABASE.razorLeaf },
      { level: 27, move: MOVES_DATABASE.growth },
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
