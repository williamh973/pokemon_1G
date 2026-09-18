export const calculateCriticalHit = (action) => {
  const move = action.move;
  const pokemon = action.pokemon;
  const hasBoostedByFocusEnergy = pokemon.volatils.hasBoostedByFocusEnergy;

  const criticalHitBasicRate = 6.25;
  const criticalHitBoostedRate = 50;

  const criticalHitRate = hasBoostedByFocusEnergy
    ? criticalHitBoostedRate
    : criticalHitBasicRate;

  if (move.power <= 0)
    return {
      CC: 1,
      isCriticalHit: false,
    };

  const random100 = Math.floor(Math.random() * 100) + 1;

  if (random100 > criticalHitRate)
    return {
      CC: 1,
      isCriticalHit: false,
    };

  const CC = (2 * (pokemon.level * 2) + 5) / (pokemon.level + 5);

  return {
    CC,
    isCriticalHit: true,
  };
};
