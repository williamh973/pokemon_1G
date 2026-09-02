export const modifyStatStage = (pokemon, stat, amount) => {
  const currentStage = pokemon.statStages[stat] ?? 0;

  const newStage = Math.max(-6, Math.min(6, currentStage + amount));

  pokemon.statStages[stat] = newStage;

  return {
    isAffected: newStage !== currentStage,
    pokemon: pokemon,
    stat: stat,
    amount: amount,
  };
};
