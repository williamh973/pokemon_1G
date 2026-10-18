import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";

import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const STARMIE_SPECIES = {
  id: "starmie",
  pokedexId: "121",
  name: "STAROSS",
  types: ["WATER", "PSYCHIC"],
  femaleRate: 0,
  catchRate: 60,
  growthRate: GROWTH_RATES_DATABASE.SLOW,
  baseExp: 207,
  baseStats: {
    hp: 60,
    attack: 75,
    defense: 85,
    specialAtt: 100,
    specialDef: 85,
    speed: 115,
  },
  animations: {
    idle: {
      front: "starmie_front_idle",
      back: "starmie_back_idle",
    },
  },
  evolutions: [],
  learnset: {
    levelUp: [
      { level: 1, move: MOVES_DATABASE.waterGun },
      { level: 1, move: MOVES_DATABASE.rapidSpin },
      { level: 1, move: MOVES_DATABASE.recover },
      { level: 1, move: MOVES_DATABASE.swift },
      { level: 33, move: MOVES_DATABASE.confuseRay },
    ],
    tmhm: [
      "Vibraqua",
      "Toxik",
      "Grêle",
      "Puissance Cachée",
      "Laser Glace",
      "Blizzard",
      "Ultralaser",
      "Mur Lumière",
      "Protection",
      "Danse Pluie",
      "Frustration",
      "Tonnerre",
      "Fatal-Foudre",
      "Retour",
      "Psyko",
      "Reflet",
      "Onde de Choc",
      "Façade",
      "Force Secrète",
      "Repos",
      "Surf",
      "Flash",
      "Cascade",
      "Plongée",
    ],
  },
};
