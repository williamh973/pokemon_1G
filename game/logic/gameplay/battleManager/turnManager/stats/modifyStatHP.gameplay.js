export const modifyStatHP = (damage, move, pokemon) => {
  let healAmount = null;

  damage > 0
    ? (healAmount = Math.floor((damage * move.effect.amount) / 100))
    : (healAmount = Math.floor(
        (pokemon.stats.maxHp * move.effect.amount) / 100
      ));

  const recoveredHP = pokemon.stats.maxHp - pokemon.stats.hp;

  pokemon.stats.hp = Math.min(
    pokemon.stats.maxHp,
    pokemon.stats.hp + healAmount
  );

  console.log(`hp de ${pokemon.name} regagnés : `, recoveredHP);

  return {
    recoveredHP,
  };
};
