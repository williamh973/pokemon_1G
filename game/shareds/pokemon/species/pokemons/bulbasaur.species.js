import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";

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
  graphics: {
    partyIcon: "bulbasaur",
  },
  animations: {
    idle: {
      front: "bulbasaur_front_idle",
      back: "bulbasaur_back_idle",
    },
  },
  learnset: {
    levelUp: [
      { level: 1, move: "Charge" },
      { level: 1, move: "Mimi-Queue" },
      { level: 7, move: "Fouet Lianes" },
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
