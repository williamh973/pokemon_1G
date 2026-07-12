import { GROWTH_RATES_DATABASE } from "../experience/growthRates/growthRates.database.js";
import { CHARMELEON_SPECIES } from "./charmeleon.species.js";
import { BULBASAUR_SPECIES } from "./pokemons/bulbasaur.species.js";
import { CHARMANDER_SPECIES } from "./pokemons/charmander.species.js";
import { ONIX_SPECIES } from "./pokemons/onix.species.js";
import { PIDGEY_SPECIES } from "./pokemons/pidgey.species.js";
import { RATTATA_SPECIES } from "./pokemons/rattata.species.js";
import { ZUBAT_SPECIES } from "./pokemons/zubat.species.js";

export const SPECIES_DATABASE = {
  bulbasaur: BULBASAUR_SPECIES,
  charmander: CHARMANDER_SPECIES,
  charmeleon: CHARMELEON_SPECIES,
  squirtle: {
    id: "squirtle",
    pokedexId: "007",
    name: "CARAPUCE",
    types: ["NORMAL"],
    femaleRate: 50,
    catchRate: 45,
    growthRate: GROWTH_RATES_DATABASE.MEDIUM_SLOW,
    baseExp: 66,
    baseStats: {
      hp: 44,
      attack: 48,
      defense: 65,
      specialAtt: 50,
      specialDef: 64,
      speed: 43,
    },
    learnsetLevel1: ["Charge", "Mimi-Queue", "NO_MOVE", "NO_MOVE"],
    learnsetCTCS: [
      "Ultimapoing",
      "Ultimawashi",
      "Toxik",
      "Plaquage",
      "Bélier",
      "Damoclès",
      "Bulles d'O",
      "Pistolet à O",
      "Laser Glace",
      "Blizzard",
      "Sacrifice",
      "Riposte",
      "Frappe Atlas",
      "Frénésie",
      "Tunnel",
      "Copie",
      "Reflet",
      "Protection",
      "Patience",
      "Coud'Krâne",
      "Repos",
      "Clonage",
      "Surf",
      "Force",
    ],
  },
  pidgey: PIDGEY_SPECIES,
  rattata: RATTATA_SPECIES,
  zubat: ZUBAT_SPECIES,
  onix: ONIX_SPECIES,
};
