export const deductStatHP = (pokemon) => {
  const levelFactor = (2 * pokemon.level) / 5 + 2;
  const basicPower = 40;

  const damages = Math.floor(
    (levelFactor *
      basicPower *
      (pokemon.stats.attack / pokemon.stats.defense)) /
      30
  );

  console.log(`${pokemon.name} subit : `, damages, "à cause de la confusion");

  pokemon.stats.hp = Math.min(pokemon.stats.hp, pokemon.stats.hp - damages);

  return true;
};
