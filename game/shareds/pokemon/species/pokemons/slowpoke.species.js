import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";

import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const SLOWPOKE_SPECIES = {
  id: "slowpoke",
  pokedexId: "079",
  name: "RAMOLOSS",
  types: ["WATER", "PSYCHIC"],
  femaleRate: 50,
  catchRate: 190,
  growthRate: GROWTH_RATES_DATABASE.MEDIUM_FAST,
  baseExp: 99,
  baseStats: {
    hp: 90,
    attack: 65,
    defense: 65,
    specialAtt: 40,
    specialDef: 40,
    speed: 15,
  },
  animations: {
    idle: {
      front: "slowpoke_front_idle",
      back: "slowpoke_back_idle",
    },
  },
  evolutions: [
    {
      method: "level",
      level: 37,
      target: "slowbro",
    },
  ],
  learnset: {
    levelUp: [
      { level: 1, move: MOVES_DATABASE.tackle },
      { level: 1, move: MOVES_DATABASE.curse },
      { level: 1, move: MOVES_DATABASE.yawn },
      { level: 6, move: MOVES_DATABASE.growl },
      { level: 15, move: MOVES_DATABASE.waterGun },
      { level: 20, move: MOVES_DATABASE.confusion },
      { level: 29, move: MOVES_DATABASE.disable },
      { level: 34, move: MOVES_DATABASE.headbutt },
      { level: 43, move: MOVES_DATABASE.amnesia },
      { level: 48, move: MOVES_DATABASE.psychic },
    ],
    tmhm: [
      "Laser Glace",
      "Blizzard",
      "Ball'Ombre",
      "Toxik",
      "Puissance Cachée",
      "Zénith",
      "Danse Pluie",
      "Protection",
      "Frustration",
      "Séisme",
      "Retour",
      "Tunnel",
      "Psyko",
      "Lance-Flammes",
      "Déflagration",
      "Façade",
      "Force Secrète",
      "Repos",
      "Attraction",
      "Surf",
      "Force",
      "Flash",
      "Plongée",
    ],
  },
};
