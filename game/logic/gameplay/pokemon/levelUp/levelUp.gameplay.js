import { getExpForLevel } from "../../../../shareds/utils/pokemon/experience/experience.utils.js";
import { getSpeciesData } from "../../../../shareds/utils/pokemon/species/species.utils.js";
import { calculateStats } from "../../encounters/generatePokemon.gameplay.js";

export const levelUp = (slot = null, pokemon) => {
  const SPECIES = getSpeciesData(pokemon.id);
  const evs = 0;
  const pastStats = pokemon.stats;

  if (pokemon.level >= 100)
    return {
      success: false,
      text: `Sans effet, déjà au niveau max !`,
    };

  pokemon.level += 1;

  pokemon.exp = getExpForLevel(pokemon.level, SPECIES.growthRate);
  pokemon.nextLevelExp = getExpForLevel(pokemon.level + 1, SPECIES.growthRate);

  pokemon.stats = calculateStats(
    SPECIES.baseStats,
    pokemon.ivs,
    evs,
    pokemon.level
  );

  pokemon.stats = {
    ...pokemon.stats,
    maxHp: pokemon.stats.hp,
  };

  if (slot) {
    slot.HPbar.currentHp = pokemon.stats.hp;
    slot.HPbar.maxHp = pokemon.stats.hp;
  }

  return {
    success: true,
    text: `${pokemon.name} monte au niveau ${pokemon.level} !`,
    pastStats: pastStats,
    newStats: pokemon.stats,
  };
};
