export const modifyStatStage = (pokemon, stat, amount) => {
  const currentStage = pokemon.statStages[stat] ?? 0;

  pokemon.statStages[stat] = Math.max(-6, Math.min(6, currentStage + amount));
};
