import { SPECIES_DATABASE } from "../../../shareds/pokemon/species/species.database.js";
import { getExpForLevel } from "../../../shareds/utils/pokemon/experience/experience.utils.js";

export const generatePokemon = (target) => {
  const species = SPECIES_DATABASE[target.id.toLowerCase()];
  const GENDER = generatePID(species);
  const IVs = generateIVs();
  const EVs = 0;
  let getStats = calculateStats(species.baseStats, IVs, EVs, target.level);
  const EXP = getExpForLevel(target.level, species.growthRate);

  const POKEMON = {
    id: species.id,
    exp: EXP,
    gender: GENDER,
    name: species.name,
    pokedexId: species.pokedexId,
    baseStats: species.baseStats,
    growthRate: species.growthRate,
    animations: species.animations,
    level: target.level,
    IVs,
    stats: (getStats = {
      ...getStats,
      maxHp: getStats.hp,
    }),
  };
  console.log(POKEMON.stats);
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
  let value = ((2 * base + iv + ev / 4) * level) / 100 + 1;

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
