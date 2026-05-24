import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";
import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const BULBASAUR_SPECIES = {
  id: "bulbasaur",
  pokedexId: "001",
  name: "BULBIZARRE",
  types: ["GRASS", "POISON"],
  femaleRate: 50,
  catchRate: 45,
  growthRate: GROWTH_RATES_DATABASE.MEDIUM_SLOW,
  baseExp: 64,
  baseStats: {
    hp: 45,
    attack: 49,
    defense: 49,
    specialAtt: 65,
    specialDef: 65,
    speed: 45,
  },
  animations: {
    idle: {
      front: "bulbasaur_front_idle",
      back: "bulbasaur_back_idle",
    },
  },
  evolutions: [{ method: "level", level: 16, target: "ivysaur" }],
  learnset: {
    levelUp: [
      { level: 1, move: MOVES_DATABASE.tackle },
      { level: 1, move: MOVES_DATABASE.tailWhip },
      { level: 7, move: MOVES_DATABASE.vineWhip },
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
