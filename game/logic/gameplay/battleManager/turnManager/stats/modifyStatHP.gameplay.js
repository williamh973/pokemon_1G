export const modifyStatHP = (damage, move, pokemon) => {
  const healAmount = Math.floor((damage * move.effect.amount) / 100);
  console.log(`hp de ${pokemon.name} regagnés : `, healAmount);

  pokemon.stats.hp = Math.min(
    pokemon.stats.maxHp,
    pokemon.stats.hp + healAmount
  );

  return true;
};
