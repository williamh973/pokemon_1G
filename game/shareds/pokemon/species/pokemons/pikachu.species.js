import { GROWTH_RATES_DATABASE } from "../../experience/growthRates/growthRates.database.js";
import { MOVES_DATABASE } from "../../moves/moves.database.js";

export const PIKACHU_SPECIES = {
  id: "pikachu",
  pokedexId: "025",
  name: "PIKACHU",
  types: ["ELECTRIC"],
  femaleRate: 50,
  catchRate: 190,
  growthRate: GROWTH_RATES_DATABASE.MEDIUM_FAST,
  baseExp: 112,

  baseStats: {
    hp: 35,
    attack: 55,
    defense: 30,
    specialAtt: 50,
    specialDef: 40,
    speed: 90,
  },

  animations: {
    idle: {
      front: "pikachu_front_idle",
      back: "pikachu_back_idle",
    },
  },

  evolutions: [
    {
      method: "item",
      item: "ThunderStone",
      target: "raichu",
    },
  ],

  learnset: {
    levelUp: [
      { level: 1, move: MOVES_DATABASE.thundershock },
      { level: 1, move: MOVES_DATABASE.growl },
      { level: 9, move: MOVES_DATABASE.tailWhip },
      { level: 16, move: MOVES_DATABASE.quickAttack },
      { level: 26, move: MOVES_DATABASE.spark },
      { level: 33, move: MOVES_DATABASE.agility },
      { level: 43, move: MOVES_DATABASE.thunderWave },
      { level: 50, move: MOVES_DATABASE.thunder },
    ],

    tmhm: [
      "Méga-Poing",
      "Mégakick",
      "Toxik",
      "Plaquage",
      "Bélier",
      "Damoclès",
      "Frappe Atlas",
      "Vengeance",
      "Frappe-Atlas",
      "Frappe Corps",
      "Frappe-Éclair",
      "Tonnerre",
      "Fatal-Foudre",
      "Météores",
      "Métronome",
      "Reflet",
      "Lance-Soleil",
      "Mimique",
      "Dépit",
      "Repos",
      "Clonage",
      "Flash",
    ],
  },
};
