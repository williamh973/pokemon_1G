import { SPECIES_DATABASE } from "../../../shareds/pokemon/species/species.database.js";

export const generateWildPokemon = (target) => {
  if (target.entityType !== "OP") return;

  const baseStats = SPECIES_DATABASE[target.id].baseStats;

  const IVs = generateIVs();
  const EVs = 0; // inexistant si pokemon sauvage

  const stats = calculateStats(baseStats, IVs, EVs, target.level);

  const POKEMON = {
    id: target.id,
    level: target.level,
    baseStats,
    IVs,
    stats,
  };

  // console.log(POKEMON);
  return POKEMON;
};

const calculateStats = (baseStats, ivs, evs, level) => {
  return {
    hp: calcStat(baseStats.hp, ivs.hp, evs, level, true),
    attack: calcStat(baseStats.attack, ivs.att, evs, level, false),
    defense: calcStat(baseStats.defense, ivs.def, evs, level, false),
    speed: calcStat(baseStats.speed, ivs.spd, evs, level, false),
    special: calcStat(baseStats.special, ivs.spc, evs, level, false),
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

const randomN = () => {
  return Math.floor(Math.random() * 16);
};

const generateIVs = () => {
  // Dans pokemon 1G, deux iv possibles et calculés differemment, l'un pour les stats, l'autre pour les hp
  const iv = {
    att: randomN(),
    def: randomN(),
    spd: randomN(),
    spc: randomN(),
  };

  iv.hp =
    ((iv.att & 1) << 3) | // 1 = 0001  << 3 = 1000 = 8
    ((iv.def & 1) << 2) |
    ((iv.spd & 1) << 1) |
    (iv.spc & 1);

  return iv;
};
// le | assemble les bits en un seul nombre
// >> multiplicateur de bits
