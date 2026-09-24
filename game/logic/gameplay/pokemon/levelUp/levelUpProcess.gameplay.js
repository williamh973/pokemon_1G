import { getExpForLevel } from "../../../../shareds/utils/pokemon/experience/experience.utils.js";
import { getSpeciesData } from "../../../../shareds/utils/pokemon/species/species.utils.js";
import { calculateStats } from "../../encounters/generatePokemon.gameplay.js";

const updatePartySlot = (selectedSlot) => {
  if (selectedSlot) {
    selectedSlot.HPbar.currentHp = pokemon.stats.hp;
    selectedSlot.HPbar.maxHp = pokemon.stats.hp;
  }
};

export const levelUpProcess = (
  selectedSlot = null,
  pokemon,
  resetExp = true
) => {
  const SPECIES = getSpeciesData(pokemon.id);
  const evs = pokemon.evs;
  const pastStats = pokemon.stats;

  if (pokemon.level >= 100)
    return {
      success: false,
      text: `Mais ${pokemon.name} est déjà \nau niveau max.`,
    };

  pokemon.level += 1;

  if (resetExp) pokemon.exp = getExpForLevel(pokemon.level, SPECIES.growthRate);

  pokemon.nextLevelExp = getExpForLevel(pokemon.level + 1, SPECIES.growthRate);

  pokemon.stats = calculateStats(
    SPECIES.baseStats,
    pokemon.ivs,
    evs,
    pokemon.level
  );

  const hpIncrease = pokemon.stats.hp - pastStats.maxHp;

  pokemon.stats = {
    ...pokemon.stats,
    hp: pastStats.hp + hpIncrease,
    maxHp: pokemon.stats.hp,
  };

  updatePartySlot(selectedSlot);

  return {
    success: true,
    text: `${pokemon.name} monte au niveau ${pokemon.level} !`,
    pastStats: pastStats,
    newStats: pokemon.stats,
    pokemon,
  };
};
