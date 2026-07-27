import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";
import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const SCYTHER_SPECIES = {
  id: "scyther",
  pokedexId: "123",
  name: "INSECATEUR",
  types: ["BUG", "FLYING"],
  femaleRate: 50,
  catchRate: 45,
  growthRate: GROWTH_RATES_DATABASE.MEDIUM_FAST,
  baseExp: 100,

  baseStats: {
    hp: 70,
    attack: 110,
    defense: 80,
    specialAtt: 55,
    specialDef: 80,
    speed: 105,
  },

  animations: {
    idle: {
      front: "scyther_front_idle",
      back: "scyther_back_idle",
    },
  },

  evolutions: [],

  learnset: {
    levelUp: [
      { level: 1, move: MOVES_DATABASE.quickAttack },
      { level: 1, move: MOVES_DATABASE.leer },
      { level: 17, move: MOVES_DATABASE.focusEnergy },
      { level: 20, move: MOVES_DATABASE.doubleTeam },
      { level: 25, move: MOVES_DATABASE.furyCutter },
      { level: 30, move: MOVES_DATABASE.agility },
      { level: 35, move: MOVES_DATABASE.slash },
      { level: 40, move: MOVES_DATABASE.swordsDance },
      { level: 45, move: MOVES_DATABASE.doubleHit },
    ],

    tmhm: [
      "Ultimapoing",
      "Danse Lames",
      "Aeropique",
      "Toxik",
      "Plaquage",
      "Bélier",
      "Damoclès",
      "Mimique",
      "Reflet",
      "Protection",
      "Détection",
      "Repos",
      "Clonage",
      "Coupe",
      "Force",
    ],
  },
};
