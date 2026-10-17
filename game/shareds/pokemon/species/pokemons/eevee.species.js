import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";

import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const EEVEE_SPECIES = {
  id: "eevee",
  pokedexId: "133",
  name: "EVOLI",
  types: ["NORMAL"],
  femaleRate: 12.5,
  catchRate: 45,
  growthRate: GROWTH_RATES_DATABASE.MEDIUM_FAST,
  baseExp: 92,
  baseStats: {
    hp: 55,
    attack: 55,
    defense: 50,
    specialAtt: 45,
    specialDef: 65,
    speed: 55,
  },
  animations: {
    idle: {
      front: "eevee_front_idle",
      back: "eevee_back_idle",
    },
  },
  evolutions: [
    {
      method: "item",
      item: "waterStone",
      target: "vaporeon",
    },
    {
      method: "item",
      item: "thunderStone",
      target: "jolteon",
    },
    {
      method: "item",
      item: "fireStone",
      target: "flareon",
    },
  ],
  learnset: {
    levelUp: [
      { level: 1, move: MOVES_DATABASE.tackle },
      //   { level: 1, move: MOVES_DATABASE.tailWhip },
      //   { level: 1, move: MOVES_DATABASE.helpingHand },
      //   { level: 8, move: MOVES_DATABASE.sandAttack },
      //   { level: 16, move: MOVES_DATABASE.growl },
      //   { level: 23, move: MOVES_DATABASE.quickAttack },
      //   { level: 30, move: MOVES_DATABASE.bite },
      //   { level: 36, move: MOVES_DATABASE.batonPass },
      //   { level: 42, move: MOVES_DATABASE.takeDown },
    ],
    tmhm: [
      "Toxik",
      "Puissance Cachée",
      "Zénith",
      "Protection",
      "Danse Pluie",
      "Frustration",
      "Queue de Fer",
      "Retour",
      "Tunnel",
      "Ball'Ombre",
      "Reflet",
      "Façade",
      "Force Secrète",
      "Repos",
      "Attraction",
    ],
  },
};
