import { SPECIES_DATABASE } from "../../../shareds/pokemon/species/species.database.js";

export const generateWildPokemon = (target) => {
  if (target.entityType !== "OP") return;

  const baseStats = SPECIES_DATABASE[target.id].baseStats;
  const species = SPECIES_DATABASE[target.id];

  const gender = generatePID(species);
  const IVs = generateIVs();
  const EVs = 0;
  const getStats = calculateStats(baseStats, IVs, EVs, target.level);

  const POKEMON = {
    id: target.id,
    name: species.name,
    pokedexId: species.pokedexId,
    gender: gender,
    level: target.level,
    baseStats,
    IVs,
    stats: getStats,
    maxHp: getStats.hp,
  };

  return POKEMON;
};

const generatePID = (species) => {
  const random100 = Math.floor(Math.random() * 100);
  const femaleRate = species.femaleRate;

  if (random100 <= femaleRate) return "♀";
  else return "♂";
};

const calculateStats = (baseStats, ivs, evs, level) => {
  return {
    hp: calcStat(baseStats.hp, ivs.hp, evs, level, true),
    attack: calcStat(baseStats.attack, ivs.att, evs, level, false),
    defense: calcStat(baseStats.defense, ivs.def, evs, level, false),
    specialAtt: calcStat(baseStats.specialAtt, ivs.spcAtt, evs, level, false),
    specialDef: calcStat(baseStats.specialDef, ivs.spcDef, evs, level, false),
    speed: calcStat(baseStats.speed, ivs.spd, evs, level, false),
  };
};

const calcStat = (base, iv, ev, level, isHP) => {
  const sqrtEV = Math.ceil(Math.sqrt(ev));
  const evTerm = Math.floor(sqrtEV / 4);

  let value = ((2 * (base + iv) + evTerm) * level) / 100;

  value = Math.floor(value);

  if (isHP) value += level + 10;
  else value += 5;

  if (value > 999) value = 999;

  return value;
};

const random16 = () => {
  return Math.floor(Math.random() * 16);
};

const generateIVs = () => {
  // Dans pokemon 1G, deux iv possibles et calculés differemment, l'un pour les stats, l'autre pour les hp
  const iv = {
    att: random16(),
    def: random16(),
    spcAtt: random16(),
    spcDef: random16(),
    spd: random16(),
  };

  iv.hp =
    ((iv.att & 1) << 3) | // 1 = 0001  << 3 = 1000 = 8
    ((iv.def & 1) << 2) |
    (iv.spcAtt & 1) |
    (iv.spcDef & 1) |
    ((iv.spd & 1) << 1);

  return iv;
};
// le | assemble les bits en un seul nombre
// >> multiplicateur de bits
