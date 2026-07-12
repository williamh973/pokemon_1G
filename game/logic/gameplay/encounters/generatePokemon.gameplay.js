import { SPECIES_DATABASE } from "../../../shareds/pokemon/species/species.database.js";
import { getExpForLevel } from "../../../shareds/utils/pokemon/experience/experience.utils.js";

export const generatePokemon = (
  target,
  currentMapName = null,
  characterName = "Aucun",
  ball = "POKEBALL"
) => {
  const species = SPECIES_DATABASE[target.id.toLowerCase()];
  const ivs = generateIVs();
  const evs = 0;
  const stats = calculateStats(species.baseStats, ivs, evs, target.level);
  const learnsets = getMoves(species.learnset.levelUp, target.level);

  const pokemon = {
    id: species.id,
    name: species.name,
    gender: generateGender(species),
    exp: getExpForLevel(target.level, species.growthRate),
    nextLevelExp: getExpForLevel(target.level + 1, species.growthRate),
    item: generateItem(),
    trainerId: generateTrainerId(),
    item: "Aucun",
    level: target.level,
    ivs,
    evs,
    moves: learnsets,
    nature: null, // pour l'instant
    origin: {
      caughtAt: currentMapName,
      caughtBy: characterName,
      ball: ball, // pour l'instant
    },
    stats: {
      ...stats,
      maxHp: stats.hp,
    },
  };
  return pokemon;
};

const getMoves = (learnsets, level) => {
  return learnsets
    .filter((set) => set.level <= level)
    .slice(-4)
    .map((set) => ({
      id: set.move.id,
      name: set.move.name,
      type: set.move.type,
      class: set.move.class,
      currentPP: set.move.pp,
      maxPP: set.move.pp,
      power: set.move.power,
      precision: set.move.precision,
      desc: set.move.desc,
    }));
};

const generateTrainerId = () => {
  const random = Math.floor(Math.random() * 100_000);
  return random;
};

const generateItem = () => {
  return "aucun";
};
const generateGender = (species) => {
  const random100 = Math.floor(Math.random() * 100);
  const femaleRate = species.femaleRate;
  if (random100 <= femaleRate) return "♀";
  else return "♂";
};
export const calculateStats = (baseStats, ivs, evs, level) => {
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
const randomIV = () => {
  return Math.floor(Math.random() * 16);
};
const generateIVs = () => {
  // Dans pokemon 1G, deux ivs possibles et calculés differemment, l'un pour les stats, l'autre pour les hp
  const ivs = {
    att: randomIV(),
    def: randomIV(),
    spcAtt: randomIV(),
    spcDef: randomIV(),
    spd: randomIV(),
  };
  ivs.hp =
    ((ivs.att & 1) << 3) | // 1 = 0001  << 3 = 1000 = 8
    ((ivs.def & 1) << 2) |
    (ivs.spcAtt & 1) |
    (ivs.spcDef & 1) |
    ((ivs.spd & 1) << 1);
  return ivs;
};
// le | assemble les bits en un seul nombre
// >> multiplicateur de bits
