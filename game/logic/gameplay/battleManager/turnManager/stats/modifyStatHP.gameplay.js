export const modifyStatHP = (damage, move, pokemon) => {
  const healAmount = Math.floor((damage * move.effect.amount) / 100);

  pokemon.stats.hp = Math.min(
    pokemon.stats.maxHp,
    pokemon.stats.hp + healAmount
  );

  return {
    pokemon: pokemon,
    amount: healAmount,
  };
};
