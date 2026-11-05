export const deductStatHP = (pokemon, damages) => {
  pokemon.stats.hp = Math.max(0, pokemon.stats.hp - damages);

  return true;
};
